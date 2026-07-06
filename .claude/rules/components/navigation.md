---
paths:
  - "components/Navigation/**"
---

# Navigation Components

## DuMenu

**Files:** `components/Navigation/du-menu/du-menu.vue` | `du-menu-item.vue` | `.types.ts` | `.stories.ts`

> **Complex component**: Submenu management and custom slots. Read `du-menu.vue` AND `du-menu-item.vue`.

**Props:**
- `direction?`: `'default'` | `'vertical'` | `'horizontal'` | `'responsive'`
- `size?`: Size
- `rounded?`: boolean
- `items?`: DuMenuItemData[]
- `activeItem?`: string
- `onItemClick?`: (item: DuMenuItemData) => void
- `onSubItemClick?`: (item: DuMenuItemData) => void

**Types :**
```typescript
export interface DuMenuItemData {
  label: string
  href?: string
  disabled?: boolean
  isTitle?: boolean
  subItems?: DuMenuItemData[]
  value?: string | number
  onClick?: () => void
  checked?: boolean
  multiple?: boolean
  active?: boolean
}
```

**Note:** DuMenuItemData is also used by DuDrawer (Layout).

---

## DuPagination

**Files:** `components/Navigation/du-pagination/du-pagination.vue` | `.types.ts` | `.stories.ts`

> **Complex component**: Page calculation logic and ellipsis.

**Props:**
- `modelValue?`: number (v-model, current page)
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

> **Complex component**: Dynamic content management. Available slots: `#tab-{index}`, `#content-{index}`.

**Props:**
- `size?`: Size
- `items?`: DuTabItem[]
- `type?`: `'lift'` | `'border'` | `'box'`
- `bottom?`: boolean
- `name?`: string

**Types :**
```typescript
export interface DuTabItem {
  label?: string
  icon?: any
  class?: string
  active?: boolean
  onClick?: () => void
  content?: string
  [key: string]: any
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
  icon?: any
  class?: string
  active?: boolean
  onClick?: () => void
  [key: string]: any
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
