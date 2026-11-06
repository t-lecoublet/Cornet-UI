import { type DuPaginationProps } from "../../Navigation/du-pagination/du-pagination.types"

export const TABLE_SIZES = ['default', 'xs', 'sm', 'md', 'lg', 'xl'] as const
export type DuTableSize = (typeof TABLE_SIZES)[number]

// Tailwind-scan safelist: useSizeMapping(props, 'table') builds these prefixed
// literals at runtime (TABLE_SIZES above holds the bare prop values instead).
export const TABLE_SIZE_CLASSES = ['table-xs', 'table-sm', 'table-md', 'table-lg', 'table-xl'] as const
export type DuTableSizeClass = (typeof TABLE_SIZE_CLASSES)[number]

// Tailwind-scan safelist: the expand buttons are sized with
// useSizeMapping(inner, 'btn'), one step below the table's own size.
export const TABLE_BUTTON_SIZE_CLASSES = ['btn-xs', 'btn-sm', 'btn-md', 'btn-lg', 'btn-xl'] as const

// Tailwind-scan safelist: the rows-per-page <select> is sized with
// useSizeMapping(inner, 'select').
export const TABLE_SELECT_SIZE_CLASSES = ['select-xs', 'select-sm', 'select-md', 'select-lg', 'select-xl'] as const

/**
 * Default classes of the parts around the `<table>`, with and without the
 * `panel` preset. Kept as literals so Tailwind always scans them; a class prop
 * (`toolbarClass`, `headClass`, `footerClass`) replaces its entry rather than
 * adding to it, so two utilities never fight over the same property.
 */
export const TABLE_PART_CLASSES = {
  root: 'flex flex-col',
  toolbar: 'flex flex-wrap items-center gap-2 pb-2',
  head: '',
  row: '',
  footer: 'flex flex-wrap items-center justify-between gap-2 pt-2',
} as const

export const TABLE_PANEL_CLASSES = {
  root: 'flex flex-col overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-xs',
  toolbar: 'flex flex-col gap-3 border-b border-base-300 p-4 lg:flex-row lg:flex-wrap lg:items-center',
  head: 'bg-base-200/60 [&_th]:py-3 [&_button[data-sort=asc]]:text-base-content [&_button[data-sort=desc]]:text-base-content',
  row: 'transition-colors hover:bg-base-200/50',
  footer: 'flex flex-col gap-3 border-t border-base-300 p-4 sm:flex-row sm:items-center sm:justify-between',
} as const

export const TABLE_ALIGNS = ['start', 'center', 'end'] as const
export type DuTableAlign = (typeof TABLE_ALIGNS)[number]

/** Literal classes for `DuTableColumn.align`, kept here so Tailwind always scans them. */
export const TABLE_ALIGN_CLASSES: Record<DuTableAlign, string> = {
  start: 'text-start',
  center: 'text-center',
  end: 'text-end',
}

export type DuTableRowKey = string | number

/**
 * A callback over the consumer's row, checked bivariantly.
 *
 * Written as a plain arrow type, `(row: Invoice) => string` makes every
 * column — and so the whole `columns` array — invariant in the row type, and
 * a `DuTableColumn<Invoice>[]` then refuses to go anywhere that expects
 * columns over a wider row: a shared helper, a wrapper component, or the
 * test-utils `mount`, which instantiates a generic component at its
 * constraint. Method syntax is checked bivariantly, which is the variance a
 * callback that only *reads* the row actually has.
 */
type RowCallback<Args extends unknown[], T> = { bivarianceHack(...args: Args): T }['bivarianceHack']

/**
 * What the table itself needs from a row — a stable key for `v-for` and an
 * optional class. Constrain on this rather than on `DuTableRow`: a consumer's
 * own `interface Invoice { id: number; total: number }` has no index
 * signature, so it would not satisfy `DuTableRow`.
 *
 * The `id` is also what selection and expansion are keyed by, so it must be
 * unique and stable across pages — a row index is neither.
 */
export interface DuTableRowBase {
  id: DuTableRowKey
  customClass?: string
}

/** The default row shape when the consumer does not name their own. */
export interface DuTableRow extends DuTableRowBase {
  /** Cell values, addressed by `DuTableColumn.key`. */
  [key: string]: unknown
}

export interface DuTableColumn<R extends DuTableRowBase = DuTableRow> {
  /**
   * Which field of the row this column shows — and the column's identity in
   * `sort`, in slot names (`cell-{key}`) and in Vue keys, so it must be unique.
   *
   * The union suggests the row's own keys in an editor, and the trailing
   * `string` accepts anything else — because `const columns = [{ key: 'name' }]`
   * widens `'name'` to `string` before it ever reaches this type, and a
   * consumer declaring their columns in a variable (which is most of them)
   * would otherwise not compile. Autocomplete, not enforcement. A column that
   * shows no field of its own (`actions`) simply uses its slot.
   */
  key: Extract<keyof R, string> | (string & {})
  label: string
  /**
   * The cell's value, when it is not `row[key]` — a nested field, a derived
   * number. Used for display, sorting and searching alike.
   */
  accessor?: RowCallback<[row: R], unknown>
  /** The text shown for the value — and the text the search matches. */
  format?: RowCallback<[value: unknown, row: R], string>
  sortable?: boolean
  /** Ascending order of two rows; the table flips it for descending. */
  sortFn?: RowCallback<[a: R, b: R], number>
  /** Take part in the search. On by default. */
  searchable?: boolean
  /** How this column matches a search query, instead of "the shown text contains it". */
  filter?: RowCallback<[value: unknown, row: R, query: string], boolean>
  align?: DuTableAlign
  /** Any CSS width, applied to the header cell (`'8rem'`, `'20%'`). */
  width?: string
  /**
   * This column names the row — usually its first. Its cells render as
   * `<th scope="row">`, so a screen reader announces "Ada" before "12" when
   * moving along a row, and the row's checkbox and expand button are named
   * after it ("Select row Ada").
   */
  rowHeader?: boolean
  /** Class on the header (and footer) cell. Kept for compatibility; same as `headerClass`. */
  customClass?: string
  /** Class on the header (and footer) cell. */
  headerClass?: string
  /** Class on every body cell of the column. */
  cellClass?: string | RowCallback<[row: R], string | undefined>
}

export type DuTableSortDirection = 'asc' | 'desc'

/**
 * One sorted column. `sort` is always an array so that sorting by several
 * columns can arrive without changing its shape; with `sortMode: 'single'`
 * it holds at most one entry.
 */
export interface DuTableSort {
  key: string
  direction: DuTableSortDirection
}

export type DuTableSortMode = 'single' | 'multiple'
export type DuTableSelectionMode = 'none' | 'single' | 'multiple'
export type DuTableSelectAllState = 'none' | 'some' | 'all'

export interface DuTableProps<R extends DuTableRowBase = DuTableRow> {
  columns?: DuTableColumn<R>[]
  rows?: R[]
  /**
   * What the table is about, rendered as a `<caption>`. A data table with no
   * caption leaves someone arriving at it by keyboard with a grid of numbers
   * and no idea what they count. It also names the scrollable region.
   */
  caption?: string
  /** Expose the caption without showing it. */
  hideCaption?: boolean
  zebra?: boolean
  pinRows?: boolean
  pinCols?: boolean
  size?: DuTableSize
  /** Class on the `<table>`. */
  customClass?: string
  /** Class on the scroll container around the `<table>`. */
  wrapperClass?: string
  /** Class on each body row, on top of the row's own `customClass`. */
  rowClass?: string | RowCallback<[row: R, index: number], string | undefined>
  header?: boolean
  footer?: boolean
  /**
   * The bordered-panel look: a rounded, bordered surface, the toolbar and the
   * pagination bar separated by borders, a tinted header, hovered rows and a
   * spinner over the rows while loading. Built from theme tokens only, so it
   * follows each app's daisyUI theme.
   */
  panel?: boolean
  /** Class of the toolbar row (search field and `toolbar` slot). Replaces the default. */
  toolbarClass?: string
  /** Class of the `<thead>`. Replaces the default. */
  headClass?: string
  /** Class of the bar holding the range text and the pagination. Replaces the default. */
  footerClass?: string

  // ---- sorting ----
  /** `v-model:sort`. Leave it out and the table keeps its own. */
  sort?: DuTableSort[]
  sortMode?: DuTableSortMode
  /** A click alternates ascending ↔ descending; the sort is never cleared. */
  sortRequired?: boolean
  /**
   * The polite announcement after a sort change. Receives the column label and
   * the new direction (`null` once sorting is removed).
   */
  sortAnnouncement?: (column: string, direction: DuTableSortDirection | null) => string

  // ---- selection ----
  selectionMode?: DuTableSelectionMode
  /** `v-model:selected` — the ids of the selected rows, across every page. */
  selected?: DuTableRowKey[]
  isRowSelectable?: RowCallback<[row: R], boolean>
  /** Name of the select-all checkbox. */
  selectAllLabel?: string
  /** Name of each row's checkbox, completed by its row header when there is one. */
  selectRowLabel?: string
  /** Hidden header text of the selection column, when it holds no select-all box. */
  selectColumnLabel?: string

  // ---- expansion (needs the `expanded` slot) ----
  /** `v-model:expanded` — the ids of the expanded rows. */
  expanded?: DuTableRowKey[]
  /** Name of each row's expand button, completed by its row header when there is one. */
  expandLabel?: string
  /** Hidden header text of the expand-button column. */
  expandColumnLabel?: string

  // ---- search ----
  /** `v-model:search` — the query rows are matched against. */
  search?: string
  /** Show a search field above the table. */
  searchable?: boolean
  /** Accessible name of the search field. */
  searchLabel?: string
  searchPlaceholder?: string
  /** Replaces the default match (any searchable column's shown text contains the query). */
  filter?: RowCallback<[row: R, query: string], boolean>

  // ---- paging ----
  /** `v-model:page`, 1-based. */
  page?: number
  /**
   * `v-model:page-size` — rows per page. Leave it out to show every row, or,
   * with `pageSizeOptions`, to start at the first option.
   */
  pageSize?: number
  /** Offer these page sizes in a select next to the range text. */
  pageSizeOptions?: number[]
  /** Visible label of the page-size select. */
  pageSizeLabel?: string
  /**
   * Passed on to the embedded `DuPagination` — its labels, `ariaLabel`,
   * `variant`, `showFirst`… `modelValue`, `total` and `perPage` stay the table's.
   */
  paginationProps?: Partial<DuPaginationProps>
  /** Rows across every page — in `manual` mode, where only the server knows. */
  total?: number
  /** "1–10 of 42", announced next to the pagination. */
  rangeText?: (start: number, end: number, total: number) => string

  /**
   * The rows arrive already searched, sorted and paged (from a server, say).
   * The table keeps emitting `update:search`, `update:sort` and `update:page`
   * but no longer applies them; pass `total` for the pagination.
   */
  manual?: boolean

  // ---- states ----
  /** Sets `aria-busy`; with no rows yet, shows placeholder rows instead. */
  loading?: boolean
  /**
   * While reloading rows already on screen, cover them with a spinner instead
   * of dimming them. On by default with `panel`.
   */
  loadingOverlay?: boolean
  /** How many placeholder rows to show while loading. */
  loadingRows?: number
  /** Announced while loading. */
  loadingText?: string
  /** Shown when there are no rows at all. */
  emptyText?: string
  /** Shown when a search matched nothing. */
  noResultsText?: string
}

export interface DuTableEmits<R extends DuTableRowBase = DuTableRow> {
  (e: 'update:sort', value: DuTableSort[]): void
  (e: 'update:selected', value: DuTableRowKey[]): void
  (e: 'update:expanded', value: DuTableRowKey[]): void
  (e: 'update:search', value: string): void
  (e: 'update:page', value: number): void
  (e: 'update:pageSize', value: number): void
  /**
   * A click on a row, outside any control inside it. A pointer convenience
   * only — a `<tr>` is not focusable, so whatever the click does must also be
   * reachable through a link or button in the row.
   */
  (e: 'row-click', row: R, event: MouseEvent): void
}
