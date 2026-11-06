---
paths:
  - "components/Navigation/**"
---

# Navigation Components

## DuMenu

**Files:** `components/Navigation/du-menu/du-menu.vue` | `du-menu-item.vue` | `.types.ts` | `.stories.ts`

> **Complex component**: Submenu management and custom slots. Read `du-menu.vue` AND `du-menu-item.vue`.

**Two components, chosen by `role`:**

| `role` | What it is | Semantics | Keyboard |
| --- | --- | --- | --- |
| `nav` (default) | a list of links — a sidebar | plain `<ul>`, no ARIA role, `aria-current="page"` on the active item | native Tab between links |
| `menu` | a set of actions | `role="menu"` / `menuitem` / `menuitemcheckbox`, `<li role="none">` | one tab stop, arrows, Home/End, typeahead, Enter/Space |

**Never put `role="menu"` on navigation.** It tells a screen-reader user to
expect application-menu behaviour a list of links does not have.

**Props:**
- `role?`: `'nav'` | `'menu'` (default `'nav'`)
- `direction?`: `'default'` | `'vertical'` | `'horizontal'` | `'responsive'`
- `size?`: Size
- `rounded?`: boolean
- `items?`: DuMenuItemData[]
- `activeItem?`: string — the `value` (or `label`) of the current item
- `ariaLabel?`: string — required by the APG in `menu` mode

**Emits:** `itemClick`, `subItemClick`

In `menu` mode, submenus collapse: the parent carries `aria-haspopup="menu"` +
`aria-expanded`, ArrowRight opens it and focuses the first child, ArrowLeft
closes it and steps back to the parent. In `nav` mode every level is visible.

Pair it with `DuDropdown` for the APG menu-button pattern — see the
`MenuButton` story.

**Types :**
```typescript
export interface DuMenuItemData {
  label: string
  href?: string
  as?: string | Component
  disabled?: boolean
  isTitle?: boolean
  subItems?: this[]
  value?: string | number
  onClick?: () => void
  checked?: boolean
  multiple?: boolean   // menu mode: renders a menuitemcheckbox
  active?: boolean
  icon?: IconSource
}
```

**Note:** DuMenuItemData is also used by DuDrawer (Layout).

---

## DuPagination

**Files:** `components/Navigation/du-pagination/du-pagination.vue` | `.types.ts` | `.stories.ts`

> **Complex component**: Page calculation logic and ellipsis.

**Props:**
- `modelValue?`: number (v-model, current page) — omit it and the pagination keeps its own page, starting at 1
- `total`: number (required, total number of items)
- `perPage?`: number (default: 10)
- `showNext?`: boolean (default: true)
- `showPrevious?`: boolean (default: true)
- `showFirst?`: boolean
- `showLast?`: boolean
- `size?`: Size
- `nextLabel?`: string
- `previousLabel?`: string
- `firstLabel?`: string
- `lastLabel?`: string
- `variant?`: Variant
- `outline?`: boolean
- `soft?`: boolean
- `manual?`: boolean - No automatic calculation
- `showEllipsis?`: boolean (default: true)
- `maxPages?`: number

---

## DuTabs

**Files:** `components/Navigation/du-tabs/du-tabs.vue` | `.types.ts` | `.stories.ts`

WAI-ARIA tabs pattern: `role="tablist"` / `tab` / `tabpanel`, one tab stop,
arrow keys through `core/navigation`. daisyUI 5 already styles
`.tab[aria-selected=true]` and reveals the `.tab-content` beside it, so the
selected state lives in the attribute a screen reader reads.

**The `.tab-content` must stay the adjacent sibling of its `.tab`** — that
adjacency is how daisyUI shows the right panel.

**Props:**
- `size?`: Size
- `items?`: DuTabItem[]
- `type?`: `'lift'` | `'border'` | `'box'`
- `bottom?`: boolean — panels above the tabs (`tabs-bottom`)
- `modelValue?`: string | number — the **value** of the selected tab (its index when the item has no `value`)
- `activation?`: `'automatic'` (default, arrows select as they move) | `'manual'` (Enter or Space commits)
- `ariaLabel?`: string — required by the APG

**Emits:** `update:modelValue`

The `name` prop is gone with the radios it grouped.

**Types :**
```typescript
export interface DuTabItem {
  label?: string
  icon?: IconSource
  class?: string
  active?: boolean
  onClick?: () => void
  content?: string
  [key: string]: unknown
}
```

---

## DuBreadcrumbs

**Files:** `components/Navigation/du-breadcrumbs/du-breadcrumbs.vue` | `.types.ts` | `.stories.ts`

**Props:**
- `items`: DuBreadcrumbItem[] (required)
- `separator?`: string

**Types :**
```typescript
export interface DuBreadcrumbItem {
  label: string
  href?: string
  icon?: string
}
```

---

## DuDock

**Files:** `components/Navigation/du-dock/du-dock.vue` | `.types.ts` | `.stories.ts`

Fixed navigation bar at the bottom (macOS dock style).

**Props:**
- `size?`: Size
- `items?`: DuDockItem[]
- `reverseTheme?`: boolean

**Types :**
```typescript
export interface DuDockItem {
  label?: string
  icon?: IconSource
  class?: string
  active?: boolean
  onClick?: () => void
  [key: string]: unknown
}
```

---

## DuLink

**Fichiers :** `components/Navigation/du-link/du-link.vue` | `.types.ts` | `.stories.ts`

**Props :**
- `variant?`: Variant
- `onlyUnderlineOnHover?`: boolean
- `ghost?`: boolean

---

## DuNavbar

**Files:** `components/Navigation/du-navbar/du-navbar.vue` | `.types.ts` | `.stories.ts`

Navigation bar. No specific props, uses slots: `#start`, `#center`, `#end`.

---

## DuSteps / DuStepItem

**Files:** `components/Navigation/du-steps/du-steps.vue` | `.types.ts` | `.stories.ts`

**Props DuSteps:**
- `items?`: DuStepsItem[]
- `direction?`: `'steps-vertical'` | `'steps-horizontal'`
- `customClass?`: string
- `responsive?`: boolean
- `activeSteps?`: number[] - Indices of active steps
- `variant?`: Variant

**Props DuStepItem:**
- `label?`: string
- `active?`: boolean
- `customClass?`: string
- `dataContent?`: string
- `variant?`: Variant

**Types :**
```typescript
export interface DuStepsItem {
  label?: string
  active?: boolean
  customClass?: string
  dataContent?: string
}
```
