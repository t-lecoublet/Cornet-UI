---
paths:
  - "components/Layout/**"
---

# Layout Components

## DuDrawer

**Files:** `components/Layout/du-drawer/du-drawer.vue` | `.types.ts` | `.stories.ts`

> **Complex component**: Responsive management and overlay. Read the complete source before modifying.

**Props:**
- `id?`: string
- `position?`: `'start'` | `'end'`
- `open?`: boolean
- `responsive?`: boolean
- `alwaysOpenOnLarge?`: boolean
- `modelValue?`: boolean (v-model)
- `sidebarClass?`: string
- `contentClass?`: string
- `overlayClass?`: string
- `items?`: DuDrawerItem[]

**Types :**
```typescript
import { type DuMenuItemData } from '../../Navigation/du-menu/du-menu.types'

export interface DuDrawerItem extends DuMenuItemData {
  icon?: any
  customClass?: string
  [key: string]: any
}
```

**Note:** DuDrawerItem extends DuMenuItemData from DuMenu. Any modification to DuMenuItemData also impacts DuDrawer.

---

## DuJoin

**Files:** `components/Layout/du-join/du-join.vue` | `.types.ts` | `.stories.ts`

Group of joined elements without spacing (grouped buttons, input + button, etc.)

**Props:**
- `as?`: string - Container HTML element type
- `direction?`: `'horizontal'` | `'vertical'`

**Usage:** Children must have the `join-item` class to be properly joined.
