---
paths:
  - "components/DataDisplay/**"
---

# Data Display Components

## DuAccordion

**Files:** `components/DataDisplay/du-accordion/du-accordion.vue` | `du-accordion-item.vue` | `.types.ts` | `.stories.ts`

WAI-ARIA accordion pattern: each header is a `<button aria-expanded>` naming a
`role="region"`. **One open at a time** unless `multiple`.

**Props:**
- `items?`: DuAccordionItemData[]
- `modelValue?`: value | value[] | null — which panels are open. Omit it and the accordion owns its state
- `multiple?`: boolean — several open at once
- `collapsible?`: boolean (default `true`) — single mode may close the open panel, leaving none
- `modifier?`: `'collapse-arrow'` | `'collapse-plus'`
- `customClass?`: string

**Emits:** `update:modelValue`

`name` is gone with the radio group it named. `collapse-open` / `collapse-close`
are no longer accepted as `modifier` values — the open state drives them, and
passing them would be a second, silent source of truth.

**Types :**
```typescript
export interface DuAccordionItemData {
  title?: string
  content?: string
  value?: string | number   // identity for v-model; falls back to the index
  checked?: boolean         // open initially, when uncontrolled
  disabled?: boolean
  customClass?: string
}
```

---

## DuAvatar

**Files:** `components/DataDisplay/du-avatar/du-avatar.vue` | `.types.ts` | `.stories.ts`

**Props:**
- `size?`: Size
- `variant?`: Variant
- `rounded?`: DuAvatarRounded (`'default'` | `'rounded'` | `'full'` | `'xs'` | `'sm'` | `'md'` | `'lg'` | `'xl'`)
- `mask?`: DuAvatarMask (`'default'` | `'heart'` | `'squircle'` | `'hexagon'` | `'hexagon-2'` | `'decagon'` | `'pentagon'` | `'diamond'` | `'square'` | `'circle'` | `'parallelogram'` | `'parallelogram-2'` | `'star'` | `'star-2'`)
- `ring?`: boolean
- `ringVariant?`: Variant (default `'primary'`)
- `ringOffset?`: DuAvatarRingOffset (`0` | `1` | `2` | `4` | `8`, px gap between avatar and ring, default `2`)
- `online?`: boolean
- `offline?`: boolean
- `placeholder?`: boolean

---

## DuBadge

**Files:** `components/DataDisplay/du-badge/du-badge.vue` | `.types.ts` | `.stories.ts`

**Props:**
- `size?`: Size
- `variant?`: Variant
- `outline?`: boolean
- `soft?`: boolean
- `dash?`: boolean
- `ghost?`: boolean
- `icon?`: boolean

---

## DuCard

**Files:** `components/DataDisplay/du-card/du-card.vue` | `.types.ts` | `.stories.ts`

**Props:**
- `title?`: string
- `size?`: Size
- `bordered?`: boolean
- `dash?`: boolean
- `side?`: boolean - Horizontal layout
- `responsive?`: boolean - Side on large screens
- `imageFull?`: boolean - Background image

---

## DuCarousel / DuCarouselItem

**Files:** `components/DataDisplay/du-carousel/du-carousel.vue` | `.types.ts` | `.stories.ts`

A scrollable strip with scroll snapping. Two things follow from that which the
CSS cannot do: the region has to be **focusable** to be scrollable by keyboard
at all, and it has to say what it is.

**Props DuCarousel:**
- `items?`: DuCarouselItemData[]
- `start?` / `center?` / `end?`: boolean
- `vertical?`: boolean
- `ariaLabel?`: string — required in practice: a `region` landmark with no name is one nobody can navigate to
- `slideLabel?`: `(index, total) => string` — names each slide, default `"2 of 5"`
- `controls?`: boolean — previous/next buttons that scroll one slide
- `previousLabel?` / `nextLabel?`: string — the buttons are arrows, so they need names

**Props DuCarouselItem:** `id?`, `label?` (its accessible name)

**Exposes:** `next()`, `previous()`

An item with `src` and no `alt` gets `alt=""`. `"Slide 2"` describes the
position, not the picture; an empty alt at least tells a screen reader to skip
it rather than read a lie.

---

## DuChat

**Files:** `components/DataDisplay/du-chat/du-chat.vue` | `.types.ts` | `.stories.ts`

**Props:**
- `items?`: DuChatItemData[]
- `placement?`: `'start'` | `'end'`
- `customClass?`: string

**Types :**
```typescript
export interface DuChatItemData {
  message?: string
  image?: string
  header?: string
  footer?: string
  placement?: 'start' | 'end'
  variant?: DuChatColor
  customClass?: string
}
```

---

## DuCollapse

**Files:** `components/DataDisplay/du-collapse/du-collapse.vue` | `.types.ts` | `.stories.ts`

A list of **independent** disclosures — that is the whole difference from
DuAccordion, where opening one closes the others. Same markup: a
`<button aria-expanded>` per header, naming a `role="region"`.

**Props:**
- `items?`: DuCollapseItem[]
- `modelValue?`: (string | number)[] — the open panels. Omit it and the component owns its state
- `modifier?`: `'collapse-arrow'` | `'collapse-plus'`
- `customClass?`: string

**Emits:** `update:modelValue`

**Types :**
```typescript
export interface DuCollapseItem {
  title?: string
  content?: string
  value?: string | number   // identity for v-model; falls back to the index
  open?: boolean            // open initially, when uncontrolled
  disabled?: boolean
  customClass?: string
}
```

---

## DuCountdown / DuCountdownGroup

**Files:** `components/DataDisplay/du-countdown/du-countdown.vue` | `.types.ts` | `.stories.ts`

**Props:**
- `value?`: number
- `targetDate?`: Date
- `format?`: `'days'` | `'hours'` | `'minutes'` | `'seconds'`
- `separator?`: string
- `customClass?`: string
- `autoStart?`: boolean

---

## DuDiff

**Files:** `components/DataDisplay/du-diff/du-diff.vue` | `.types.ts` | `.stories.ts`

Before/after visual comparison.

**The comparison is driven by focus, not by a slider.** daisyUI moves
`.diff-resizer` when `.diff` has focus and again when `.diff-item-1` does —
two positions, both real, both previously unreachable because neither element
had a `tabindex`. They do now.

A continuous, arrow-driven divider is a different widget (a slider with its own
value semantics) and would belong in `core/`, not in a prop here.

**Props:**
- `item1?` / `item2?`: string
- `item1Alt?` / `item2Alt?`: string
- `aspectRatio?`: `'aspect-16/9'` | `'aspect-4/3'` | `'aspect-1/1'` | `'aspect-video'` | `'aspect-square'` | string | null
- `ariaLabel?`: string — names the comparison
- `revealLabel?`: string — names the second focus stop by what focusing it does (default `'Reveal the second image'`)

`.diff-item-1` carries no `role="button"`: it is focused, never activated, and
announcing a button would promise an Enter key that does nothing.

---

## DuKbd

**Files:** `components/DataDisplay/du-kbd/du-kbd.vue` | `.types.ts` | `.stories.ts`

Keyboard key display.

**Props:**
- `size?`: Size

---

## DuList

**Files:** `components/DataDisplay/du-list/du-list.vue` | `.types.ts` | `.stories.ts`

**Props:**
- `class?`: string

---

## DuStat

**Files:** `components/DataDisplay/du-stat/du-stat.vue` | `.types.ts` | `.stories.ts`

Individual statistic.

**Props:**
- `figureClass?`: string
- `valueClass?`: string
- `descClass?`: string
- `titleClass?`: string

**Types :**
```typescript
export interface DuStatItem {
  title?: string
  value?: string | number
  description?: string
  figure?: IconSource
  figureClass?: string
  valueClass?: string
  descClass?: string
  titleClass?: string
  actions?: IconSource
}
```

---

## DuStats

**Files:** `components/DataDisplay/du-stats/du-stats.vue` | `.types.ts` | `.stories.ts`

Statistics group.

**Props:**
- `items?`: DuStatsItem[]
- `vertical?`: boolean
- `shadow?`: boolean

---

## DuStatus

**Files:** `components/DataDisplay/du-status/du-status.vue` | `.types.ts` | `.stories.ts`

Status indicator (colored dot).

**Props:**
- `size?`: Size
- `variant?`: Variant
- `ping?`: boolean - Ping animation
- `bounce?`: boolean - Bounce animation

---

## DuTable

**Files:** `components/DataDisplay/du-table/du-table.vue` | `.types.ts` | `.stories.ts`

> **Complex component**: Supports custom slots per cell (`#cell-{columnKey}="{ row }"`).

**Props:**
- `columns?`: DuTableColumn[]
- `rows?`: R[] — generic over the row type
- `caption?`: string — what the table is about, rendered as a `<caption>`
- `hideCaption?`: boolean — expose it without showing it
- `zebra?`: boolean
- `pinRows?`: boolean
- `pinCols?`: boolean
- `size?`: DuTableSize
- `customClass?`: string
- `header?`: boolean
- `footer?`: boolean

**Types :**
```typescript
export interface DuTableColumn {
  key: string
  label: string
  customClass?: string
}

export interface DuTableRow {
  id: string | number
  [key: string]: unknown
  customClass?: string
}
```

---

## DuTimeline

**Files:** `components/DataDisplay/du-timeline/du-timeline.vue` | `.types.ts` | `.stories.ts`

**Props:**
- `items?`: DuTimelineItemData[]
- `direction?`: `'timeline-vertical'` | `'timeline-horizontal'`
- `modifier?`: `'timeline-snap-icon'` | `'timeline-box'` | `'timeline-compact'`
- `customClass?`: string
- `responsive?`: boolean
- `validItems?`: (boolean | undefined)[]
- `hrClasses?`: string[]

**Types :**
```typescript
export interface DuTimelineItemData {
  start?: string
  middle?: string
  end?: string
  customClass?: string
  valid?: boolean | undefined
  hrClass?: string
}
```
