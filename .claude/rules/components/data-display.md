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

**Files:** `components/DataDisplay/du-table/du-table.vue` | `du-table-item.vue` | `.types.ts` | `.stories.ts`

APG *sortable table*: a plain `<table>` (not a `grid`), `scope` on every header
cell, `aria-sort` on the sorted column only, each sort control a real
`<button>`. State, search, sort, paging and the ARIA prop bags live in
`core/table/useTable` (internal); the facade owns the markup and the slots.

Two modes:
- **dynamic** — `columns` given (rows default to `[]`): the table renders itself;
- **manual** — no `columns`: the default slot is the table body
  (`<thead>`/`<tbody>` of `DuTableItem`s), and only the styling props apply.

**Pipeline** (dynamic, client side): `rows → search → sort → page`. With
`manual: true` the rows arrive already processed (a server): the table keeps
emitting `update:search` / `update:sort` / `update:page` but applies none of
them, and `total` drives the pagination.

**Props:**
- `columns?`: DuTableColumn<R>[] · `rows?`: R[] — generic over the row type; `row.id` must be unique and stable (selection and expansion are keyed by it)
- `caption?` / `hideCaption?` — the caption also names the scroll region (focusable, so a wide table scrolls by keyboard)
- `zebra?`, `pinRows?`, `pinCols?`, `size?`: DuTableSize, `header?` (default `true`), `footer?`
- Classes: `customClass` (`<table>`), `wrapperClass` (scroll container), `rowClass?`: string | (row, index) => string, and `toolbarClass`, `headClass` (`<thead>`), `footerClass` (range + pagination bar) — each **replaces** its part's default (see `TABLE_PART_CLASSES` / `TABLE_PANEL_CLASSES`) so two utilities never fight
- `panel?`: boolean — the bordered-panel preset: rounded bordered surface, toolbar and footer separated by borders with `p-4`, tinted `<thead>`, hovered rows, the sorted header in full colour, and `loadingOverlay` on. Theme tokens only, so it follows the app's daisyUI theme
- Sorting: `sort?`: DuTableSort[] (`v-model:sort`), `sortMode?`: `'single'` | `'multiple'`, `sortRequired?` (asc ↔ desc, never cleared), `sortAnnouncement?`: (label, direction | null) => string — click cycles none → asc → desc → none; empty values sort last both ways
- Selection: `selectionMode?`: `'none'` | `'single'` (radios) | `'multiple'` (checkboxes + select-all), `selected?`: id[] (`v-model:selected`), `isRowSelectable?`, `selectAllLabel?`, `selectRowLabel?`, `selectColumnLabel?` — select-all covers the **visible page**; selections on other pages are kept
- Expansion: needs the `expanded` slot; `expanded?`: id[] (`v-model:expanded`), `expandLabel?`, `expandColumnLabel?`
- Search: `search?` (`v-model:search`), `searchable?` (built-in field), `searchLabel?`, `searchPlaceholder?`, `filter?`: (row, query) => boolean — default match: any searchable column's shown text contains the query, ignoring case and accents. A new query returns to page 1
- Paging: `pageSize?` (`v-model:page-size`; absent = no paging, or the first of `pageSizeOptions`), `pageSizeOptions?`: number[] (a native select, labelled by `pageSizeLabel?`), `page?` (`v-model:page`, 1-based), `total?` (manual mode), `rangeText?`: (start, end, total) => string, `paginationProps?`: Partial<DuPaginationProps> — handed to the embedded DuPagination (labels, `ariaLabel`, `variant`…); `modelValue`, `total` and `perPage` stay the table's. Changing the page size goes back to page 1
- `manual?`: boolean
- States: `loading?` (`aria-busy`; placeholder rows when there are no rows yet, dimmed rows otherwise), `loadingOverlay?` (a spinner over the rows instead of dimming them; default with `panel`), `loadingRows?` (5), `loadingText?`, `emptyText?`, `noResultsText?`

The scroll container becomes focusable (`tabindex="0"`, and a `region` named by
the caption) **only while the table overflows** — measured after mount and on
resize. A table that fits is not a dead tab stop; the server render never is.

Every state follows §5: omit the prop and the table owns it; pass it and the
table only emits. Default UI strings are English and all overridable.

**Emits:** `update:sort`, `update:selected`, `update:expanded`, `update:search`,
`update:page`, `update:pageSize`, `row-click(row, event)` — not fired for clicks on a control
inside the row. A `<tr>` is not focusable: whatever a row click does must also
be reachable through a link or button in the row.

**Slots:** `caption`, `toolbar` ({ search, setSearch, selected, clearSelection, total }),
`header` (whole `<thead>` content), `header-{key}` ({ column, direction }),
`sort-icon` ({ column, direction }), `select-all` ({ state, toggle }),
`select` ({ row, selected, selectable, toggle, controlProps }),
`expand-toggle` ({ row, expanded, toggle, buttonProps }), `cell-{key}`
({ row, column, value, index }), `expanded` ({ row, index }), `empty`
({ searching }), `loading` ({ colspan, count }), `loading-overlay`, `footer`, `footer-{key}`,
`pagination` ({ page, pageCount, pageSize, total, setPage, setPageSize, rangeText }), default (manual mode).

**Exposes:** `toggleSort(key)`, `toggleRow(row)`, `toggleAll()`, `clearSelection()`, `toggleExpanded(row)`, `setPageSize(size)`

**Types:**
```typescript
export interface DuTableColumn<R extends DuTableRowBase = DuTableRow> {
  key: Extract<keyof R, string> | (string & {})  // unique; also names the slots
  label: string
  accessor?: (row: R) => unknown                  // value for display, sort and search
  format?: (value: unknown, row: R) => string     // shown text (and searched text)
  sortable?: boolean
  sortFn?: (a: R, b: R) => number                 // ascending; flipped for desc
  searchable?: boolean                            // default true
  filter?: (value: unknown, row: R, query: string) => boolean
  align?: 'start' | 'center' | 'end'
  width?: string
  rowHeader?: boolean                             // <th scope="row">, names the row's controls
  customClass?: string                            // header/footer cell (same as headerClass)
  headerClass?: string
  cellClass?: string | ((row: R) => string | undefined)
}

export interface DuTableRowBase { id: string | number; customClass?: string }
export interface DuTableSort { key: string; direction: 'asc' | 'desc' }
```

The row callbacks are typed bivariantly (method syntax), so a
`DuTableColumn<Invoice>[]` can be passed wherever columns over a wider row are
expected.

Styling hooks: `tr[data-selected]`, `tr[data-expanded]`, `tr[data-detail]`
(the detail row), `button[data-sort="asc|desc|none"]`.

### Recipes

One preset ships (`panel`); everything else is a recipe on the hooks above.
A preset is API to keep stable; a recipe costs nothing and shows the way.

**Server-side panel, in French** (story *Panel — server-side (FR)*): the page
owns the state (often the URL) and fetches; the table only emits.

```vue
<DuTable
  v-model:sort="state.sort" v-model:page="state.page" v-model:page-size="state.perPage"
  :columns="columns" :rows="result.items" :total="result.total" :loading="loading"
  manual panel sort-required hide-caption
  :page-size-options="[10, 25, 50, 100]" page-size-label="par page"
  :range-text="(s, e, t) => `${s}–${e} sur ${t}`"
  :pagination-props="{ ariaLabel: 'Pages des inscrits', previousAriaLabel: 'Page précédente', nextAriaLabel: 'Page suivante' }"
  :sort-announcement="(label, d) => `Trié par ${label}, ${d === 'asc' ? 'croissant' : 'décroissant'}`"
  loading-text="Chargement…"
>
  <template #caption>Inscrits, triés par …</template>
  <template #toolbar><!-- DuLabel + search icon + DuInputField, DuSelect filters, reset --></template>
  <template #cell-bib="{ row }">…</template>
  <template #empty>{{ hasFilters ? 'Aucun résultat.' : 'Aucun inscrit.' }}</template>
</DuTable>
```

Filters the table does not know about (DuSelects in the toolbar) must reset
the page themselves: `watch(filters, () => { state.page = 1 })`. Sort and page
size already do.

**The panel look without the preset**, to tweak one part:

```vue
<DuTable
  class="rounded-box border border-base-300 bg-base-100 shadow-xs overflow-hidden"
  toolbar-class="flex flex-wrap items-center gap-3 border-b border-base-300 p-4"
  head-class="bg-base-200/60"
  footer-class="flex items-center justify-between border-t border-base-300 p-4"
  row-class="transition-colors hover:bg-base-200/50"
  loading-overlay
/>
```

**Colour the sorted column** (an app token, global CSS):

```css
.table button[data-sort="asc"], .table button[data-sort="desc"] { color: var(--color-primary-ink); }
```

**DuTableItem** (manual mode): `isHeader?`, `scope?` (`'col'` default on a
header cell; `'row'`, `'colgroup'`, `'rowgroup'`), `colspan?`, `rowspan?`, `customClass?`.

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
