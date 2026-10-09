---
paths:
  - "composables/**"
---

# Composables

## useSizeProps

**File:** `composables/useSizeProps.ts`

### Size Type

```typescript
export type Size = 'default' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export const AvailableSizes: Size[] = ['default', 'xs', 'sm', 'md', 'lg', 'xl']
```

### useSizeMapping Function

```typescript
export function useSizeMapping(props: { size: Size }, suffix: string): ComputedRef<string>
```

- `suffix`: DaisyUI component prefix (e.g., `'btn'`, `'badge'`, `'input'`)
- Returns the corresponding CSS class: `'btn-sm'`, `'badge-lg'`, etc.
- Returns `''` if `size` is `'default'`

**Example:**
```typescript
const sizeClass = useSizeMapping(props, 'btn')
// props.size = 'sm' -> sizeClass.value = 'btn-sm'
// props.size = 'default' -> sizeClass.value = ''
```

---

## useVariantProps

**File:** `composables/useVariantProps.ts`

### Variant Type

```typescript
export type Variant = 'default' | 'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error'
```

### useVariantMapping Function

```typescript
export function useVariantMapping(props: { variant: Variant }, suffix: string): ComputedRef<string>
```

- `suffix`: DaisyUI component prefix (e.g., `'btn'`, `'alert'`, `'badge'`)
- Returns the corresponding CSS class: `'btn-primary'`, `'alert-error'`, etc.
- Returns `''` if `variant` is `'default'`

**Example:**
```typescript
const variantClass = useVariantMapping(props, 'btn')
// props.variant = 'primary' -> variantClass.value = 'btn-primary'
// props.variant = 'default' -> variantClass.value = ''
```

### mapVariant Function

```typescript
export function mapVariant(variant: Variant | undefined, suffix: string): string
```

- Same mapping for one value that is not a prop — a variant per item of a list (DuChat bubbles), a nested config (DuFab's `closeButton.variant`)
- Returns `''` for `'default'` and `undefined`
- Keep `suffix` a string literal: the class checks read it from the call

```typescript
mapVariant(item.variant, 'chat-bubble') // 'primary' -> 'chat-bubble-primary'
```

**Rule:** never build a size/variant/colour class by hand (`` `btn-${variant}` ``, `'btn-' + size`) — go through `useSizeMapping` / `useVariantMapping` / `mapVariant`, and list the literals in `.types.ts`. `tests/class-literals-invariant.spec.ts` fails on a hand-built one.

---

## Combined usage in a component

```typescript
const props = withDefaults(defineProps<{
  size?: Size
  variant?: Variant
}>(), {
  size: 'default',
  variant: 'default'
})

const sizeClass = useSizeMapping(props, 'btn')
const variantClass = useVariantMapping(props, 'btn')

const classes = computed(() =>
  ['btn', sizeClass.value, variantClass.value].filter(Boolean).join(' ')
)
```

## useIconSource

**File:** `composables/useIconSource.ts`

The `icon` (and `figure`) field of an item, in the three forms the components
accept: a Vue component, an image URL, or a raw SVG/HTML string.

```typescript
export type IconSource = Component | string | null
export type IconKind = 'component' | 'image' | 'html'

export function resolveIconKind(icon: unknown): IconKind | null
export function iconAsText(icon: unknown): string | undefined
```

A template cannot narrow `IconSource` through a `resolveIconKind` call in a
sibling `v-if`, so the two are used together — `resolveIconKind` picks the
branch, `iconAsText` hands that branch a `string`:

```vue
<component :is="item.icon" v-if="resolveIconKind(item.icon) === 'component'" />
<img v-else-if="resolveIconKind(item.icon) === 'image'" :src="iconAsText(item.icon)" :alt="item.label" />
<div v-else-if="resolveIconKind(item.icon) === 'html'" v-html="iconAsText(item.icon)"></div>
```

Never inline a `typeof item.icon === 'object'` chain in a template: the three
components that did each recognized a different subset (one missed function
components, another missed root-relative image paths).

**Used by:** DuDock, DuTabs, DuStats, DuFab, DuMenuItem.

---

## nestedSize

**File:** `composables/useSizeProps.ts`

```typescript
export function nestedSize(size: Size): Size
```

The size one step below `size`, for a control rendered **inside** a sized
component — the chips in a select field, a modal's close button. `'default'`
counts as `'md'`; `'xs'` has nowhere left to go. Pair it with `useSizeMapping`
through a getter so it stays reactive:

```typescript
const inner = reactive({ get size() { return nestedSize(props.size) } })
const { sizeClass } = useSizeMapping(inner, 'btn')
```

A hardcoded `btn-sm` inside a component that exposes `size` is always a bug.

---

## useToasts

**File:** `composables/useToasts.ts`

Module-scope toast queue, rendered by a single `<DuToast />` in the layout.

```typescript
export function useToasts(): {
  toasts: DeepReadonly<Ref<Toast[]>>
  push(options?: ToastOptions): string
  dismiss(id: string): void
  clear(): void
  pause(): void
  resume(): void
}
```

Module scope is the point: anything in the app can raise a toast without
reaching the right component first. `duration` defaults to 5000 ms and `0`
means until dismissed. `pause()` / `resume()` are called for you by `DuToast`
on hover and focus-within — WCAG 2.2.1 — and each countdown picks up where it
stopped rather than restarting.

---

## core/ primitives (internal)

Not composables in the `composables/` sense — they live in
`components/core/` and are **not** exported from `index.ts`. See
`docs/architecture.md` for the full table. The focus pair, because the choice
between them is easy to get wrong:

```typescript
// components/core/focus/
useFocusReturn(): { capture(), restore(): boolean, forget() }
useFocusTrap({ container, active, initialFocus?, alsoInside? })
```

- `useFocusReturn` remembers what had focus **before** opening. Use it whenever
  the opener is not part of the overlay (a navbar hamburger, a shortcut, a row
  action). When the trigger *is* part of the widget, `usePopoverState`'s
  `returnFocusTo` is enough.
- `useNativeValidation` reads validity from the browser and dresses it in the
  combobox's error surface (same codes, same `errorMessages`, same "not until
  you have had a chance" timing). Do not reimplement constraint checking.
- `useFocusTrap` is for overlays built from ordinary elements. A native
  `<dialog>` opened with `showModal()` already traps — do not add one.
  Only one trap may be active at a time.

---

## Creating a new composable

1. Create `composables/use{Feature}.ts`
2. Export types and function
3. Add export to `index.ts`
4. Follow the same pattern as existing composables
