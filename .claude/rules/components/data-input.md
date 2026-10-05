---
paths:
  - "components/DataInput/**"
---

# Data Input Components

## DuInputField

**Files:** `components/DataInput/du-input-field/du-input-field.vue` | `.types.ts` | `.stories.ts`

An emptied field emits **`null`** for every type in `NULL_WHEN_EMPTY_TYPES`
(`number`, `date`, `datetime-local`, `time`, `week`, `month`): the browser hands
back `''` to mean *nothing* for these, and `''` is never a valid one of them, so
it is an absence wearing a value's clothes — and it is what makes a server
reject an optional field the user simply left alone. Text types keep `''`, which
for them is a real answer.

`v-model.number` is implemented (`DuInputFieldModelModifier`), so it casts on any
`type`, not just `number`. The cast follows Vue's own `looseToNumber` semantics —
`'abc'` stays `'abc'` — with the empty case going to `null` like the rest. Never
leave a modifier undeclared: Vue hands `modelModifiers` to the child whether or
not it reads them, so an ignored one looks like it works.

**Props:**
- `modelValue?`: unknown (v-model) — see the null rule above
- `type?`: DuInputFieldType (`'text'` | `'password'` | `'email'` | `'number'` | `'date'` | `'datetime-local'` | `'week'` | `'month'` | `'tel'` | `'url'` | `'search'` | `'time'`)
- `placeholder?`: string
- `size?`: Size
- `ghost?`: boolean
- `invalid?`: boolean
- `showValid?`: boolean — green once visited, valid and non-empty (off by default)
- `variant?`: Variant
- `disabled?`: boolean
- `suggestionName?`: string
- `suggestionList?`: string[]
- `required?`: boolean
- `pattern?`: string
- `minlength?`: number
- `maxlength?`: number
- `title?`: string
- `class?`: string

---

## DuSelect

**Files:** `components/DataInput/du-select/du-select.vue` | `.types.ts` | `.stories.ts`

> **Complex component**: a styled facade over the internal combobox engine in
> `components/core/combobox/`.
> The engine owns open/close, the query, the highlight, focus, the keyboard and the
> ARIA prop bags; the component owns markup and DaisyUI classes only. Never
> reintroduce local `open` / `query` / `highlightedIndex` state here — pass a
> new option to `useCombobox` (or extend the engine) instead.

Generic: `<script setup generic="O = any, V = any">`. Read the source and
`tests/du-select.spec.ts` before modifying.

**Props:**
- `modelValue?`: V | V[] | null (v-model)
- `options?`: O[]
- `multiple?` / `disabled?` / `readonly?` / `required?`: boolean
- `minSelected?` / `maxSelected?`: number
- `errorMessages?`: Partial<Record<'required' | 'minlength' | 'maxlength', string>>
- `trackBy?`: string (default `'id'`) - key identifying an option
- `labelBy?`: string (default `'name'`) - key displayed for an option
- `optionValue?` / `optionLabel?` / `optionFilter?` / `optionDisabled?`: callbacks, win over trackBy/labelBy
- `returnObject?`: boolean - emit whole options
- `closeOnSelect?`: boolean | null (default `null` = single closes, multiple stays open)
- `closeOnClickOutside?` / `selectOnTab?` / `clearable?`: boolean
- `placeholder?` / `noResultsText?` / `searchPlaceholder?` / `removeItemLabel?`: string
- `id?`: string (defaults to `useId()`)
- `popover?`: boolean - dropdown in the top layer
- `searchable?`: boolean - type in the field; `searchableInside?`: boolean - type in the dropdown
- `checkboxes?`: boolean
- `size?` / `subSize?`: Size, `variant?`: Variant, `ghost?`: boolean, `customClass?`: string

**Emits:** `update:modelValue`, `select`, `remove`, `query`, `open`, `close`

**Slots:** `tag`, `selected`, `option`, `no-options`, `error`

---

## DuSearch

**Files:** `components/DataInput/du-search/du-search.vue` | `.types.ts` | `.stories.ts`

> **Complex component**: same engine as DuSelect, typeahead shape — a single
> input that is itself the combobox. Same rule: no local state here.

Generic like DuSelect. `returnObject` defaults to **`true`** (the model holds
whole options).

**Props:** DuSelect's, minus `searchable*` / `checkboxes`, plus:
- `creatable?`: boolean - offer an "Add «query»" entry when nothing matches exactly
- `createOptionText?`: string (default `'Add'`), `createOption?`: (query: string) => O
- `commitOnClose?`: `'none' | 'match' | 'auto'` - what happens to text left in the field on close
- `externalFilter?`: boolean - server-side search: options already are the result
- `resultsLimit?`: number
- `name?` / `type?` / `pattern?`: string - native input attributes

**Emits:** `update:modelValue`, `select`, `remove`, `add`, `query`, `open`, `close`

**Slots:** `tag`, `option`, `create-option`, `no-options`, `error`

---

## DuCheckbox

**Fichiers :** `components/DataInput/du-checkbox/du-checkbox.vue` | `.types.ts` | `.stories.ts`

**Props :**
- `modelValue?`: boolean (v-model, via `defineModel()`)
- `disabled?`: boolean
- `indeterminate?`: boolean
- `variant?`: Variant
- `size?`: Size

---

## DuRadio

**Fichiers :** `components/DataInput/du-radio/du-radio.vue` | `.types.ts` | `.stories.ts`

**Props :**
- `checked?`: boolean
- `disabled?`: boolean
- `variant?`: Variant
- `size?`: Size

---

## DuRange

**Fichiers :** `components/DataInput/du-range/du-range.vue` | `.types.ts` | `.stories.ts`

A native `<input type="range">`, deliberately: the browser already provides the
keyboard, the drag, the step arithmetic and the `slider` role. What it cannot
provide is what the number *means*.

**Props :**
- `modelValue?`: number (v-model)
- `min?` / `max?` / `step?`: number
- `disabled?`: boolean
- `variant?`: Variant
- `size?`: Size
- `ariaLabel?` / `ariaLabelledby?`: string — a slider with no visible label needs one
- `valueText?`: `(value: number) => string` — sets `aria-valuetext`. `"12"` alone is meaningless to someone who cannot see what it is 12 *of*
- `ticks?`: `(number | { value, label? })[]` — rendered as a `<datalist>` the input points at, which is what makes browser tick marks appear

---

## DuRating

**Fichiers :** `components/DataInput/du-rating/du-rating.vue` | `.types.ts` | `.stories.ts`

daisyUI's radio-group pattern is kept — it is the right one for a rating — with
the group named and every star named.

**Props :**
- `modelValue?`: number | null (v-model) — `null` is *not rated*. Clearing a `clearable` rating emits `null`, never `0`: the scale starts at 1, so `0` was only ever an absence in disguise. The default stays `0`, which renders the same empty row of stars
- `items?`: DuRatingItemData[]
- `count?`: number - Nombre d'étoiles (si pas d'items)
- `name?`: string
- `halfStar?`: boolean
- `clearable?`: boolean
- `disabled?`: boolean
- `readonly?`: boolean — renders plain elements and exposes the group as `role="img"` with the value as its name. A disabled radio says "you may not touch this"; a displayed rating is a value, not a control someone is kept away from
- `ariaLabel?`: string — names the group
- `itemLabel?`: `(value, max) => string` — names each star, default `"3 out of 5"`
- `size?`: Size
- `shape?`: `'star'` | `'star-2'` | `'heart'` | `'circle'`
- `color?`: string
- `customClass?`: string

**Types :**
```typescript
export interface DuRatingItemData {
  value: number
  checked?: boolean
}
```

---

## DuTextArea

**Fichiers :** `components/DataInput/du-text-area/du-text-area.vue` | `.types.ts` | `.stories.ts`

**Props :**
- `modelValue?`: string (v-model)
- `placeholder?`: string
- `disabled?`: boolean
- `variant?`: Variant
- `size?`: Size
- `ghost?`: boolean

---

## DuFilter

**Files:** `components/DataInput/du-filter/du-filter.vue` | `.types.ts` | `.stories.ts`

A radio group of mutually exclusive filters, in a `<fieldset>` — daisyUI's
radio pattern is right here; what it lacked was a name for the group as a whole
and a way for the parent to *hold* the selection rather than merely hear about
it. Generic over the item type.

**Props:**
- `items?`: DuFilterItem[]
- `modelValue?`: string | number | null — the selected filter. Omit it and the component owns its state
- `legend?`: string (default `'Filter'`) — the group's name, rendered as a `<legend>`
- `showLegend?`: boolean — show it rather than only expose it (`sr-only` otherwise)
- `resetLabel?`: string — accessible name of the `×` button
- `name?`: string
- `buttonsArgs?`: DuFilterButtonArgs

**Emits:** `update:modelValue`, `change`

There is no "always show the reset" prop: daisyUI hides `.filter-reset` with
`visibility: hidden` whenever nothing is checked, so such a prop could not
deliver. The component removes it from the DOM on the same condition, which
only makes the markup agree with what was already true.

**Types :**
```typescript
export interface DuFilterItem {
  title?: string
  value?: string | number   // identity for v-model; falls back to title, then index
  checked?: boolean
  customClass?: string
  buttonsArgs?: DuFilterButtonArgs
  [key: string]: unknown
}

export interface DuFilterButtonArgs {
  variant?: Variant
  size?: Size
  outline?: boolean
  soft?: boolean
  dash?: boolean
  active?: boolean
  ghost?: boolean
  link?: boolean
  wide?: boolean
  disabled?: boolean
  square?: boolean
  circle?: boolean
}
```

---

## DuFieldset

**Fichiers :** `components/DataInput/du-fieldset/du-fieldset.vue` | `.types.ts` | `.stories.ts`

**Props :**
- `legend?`: string
- `label?`: string

---

## DuFileInput

**Fichiers :** `components/DataInput/du-file-input/du-file-input.vue` | `.types.ts` | `.stories.ts`

**Props :**
- `disabled?`: boolean
- `variant?`: Variant
- `size?`: Size
- `ghost?`: boolean

---

## DuLabel

**Fichiers :** `components/DataInput/du-label/du-label.vue` | `.types.ts` | `.stories.ts`

**Props :**
- `type?`: `'label'` | `'input'` | `'select'` | `'floating-label'` | `'fieldset-label'`

A nested `DuInputField` hands its validation message to the label, which renders
it **after** the `<label>` — never inside, where the flex row would squeeze the
field. With `type="input"` / `"select"` the label also turns red.

```vue
<DuLabel type="floating-label">
  <span>Email</span>
  <DuInputField v-model="email" type="email" placeholder="you@example.com" required />
</DuLabel>
```

---

