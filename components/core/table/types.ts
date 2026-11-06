// The table engine's type surface.
//
// Named `types.ts`, not `*.types.ts`, on purpose: `types/types.sh` sweeps
// `components/**/*.types.ts` into the public type barrel, and the engine is
// internal. The facade's public types (`DuTableColumn`, `DuTableSort`, …) are
// declared in `du-table.types.ts` and are structurally assignable to these.
import type { ComputedRef, Ref } from 'vue'

export type TableRowKey = string | number

/** The minimum the engine needs from a row: a key that survives sorting and paging. */
export interface TableRowBase {
  id: TableRowKey
}

export type TableSortDirection = 'asc' | 'desc'

export interface TableSortEntry {
  key: string
  direction: TableSortDirection
}

export type TableSortMode = 'single' | 'multiple'
export type TableSelectionMode = 'none' | 'single' | 'multiple'
export type TableSelectAllState = 'none' | 'some' | 'all'

/** What the engine reads from a column. Display concerns stay in the facade. */
export interface TableColumnDef<R> {
  key: string
  label: string
  accessor?: (row: R) => unknown
  format?: (value: unknown, row: R) => string
  sortable?: boolean
  sortFn?: (a: R, b: R) => number
  searchable?: boolean
  filter?: (value: unknown, row: R, query: string) => boolean
  rowHeader?: boolean
}

/**
 * One state the engine reads and changes, owned by whoever passes it. The
 * facade wires each to a prop and its `update:` emit; the engine turns it into
 * a `useControllableState` ref, so both modes of §5 hold.
 */
export interface TableModel<T> {
  value: () => T | undefined
  onChange: (value: T) => void
}

type Get<T> = () => T

export interface TableOptions<R extends TableRowBase> {
  rows: Get<R[]>
  columns: Get<TableColumnDef<R>[]>
  /**
   * The rows are already filtered, sorted and sliced by the consumer (a server,
   * usually). The engine still owns the state and emits it; it only stops
   * applying it to the rows.
   */
  manual?: Get<boolean>
  /** Row count across every page, in manual mode. Defaults to `rows.length`. */
  total?: Get<number | undefined>
  /**
   * Rows per page, controllable like the other states. Absent or `0`: no
   * paging. `fallback` is the size an uncontrolled table starts with.
   */
  pageSize?: Partial<TableModel<number>> & { fallback?: number }
  sortMode?: Get<TableSortMode>
  /** Off: a click alternates ascending ↔ descending and never clears the sort. */
  allowUnsorted?: Get<boolean>
  selectionMode?: Get<TableSelectionMode>
  isRowSelectable?: Get<((row: R) => boolean) | undefined>
  /** Replaces the whole search predicate. */
  filter?: Get<((row: R, query: string) => boolean) | undefined>
  /** Base for every generated id. */
  id: string
  labels?: {
    selectRow?: Get<string>
    expandRow?: Get<string>
    sortAnnouncement?: Get<((column: string, direction: TableSortDirection | null) => string) | undefined>
  }
  sort: TableModel<TableSortEntry[]>
  selected: TableModel<TableRowKey[]>
  page: TableModel<number>
  expanded: TableModel<TableRowKey[]>
  search: TableModel<string>
}

export interface TableHeaderCellProps {
  'aria-sort': 'ascending' | 'descending' | undefined
}

export interface TableSortButtonProps {
  type: 'button'
  'data-sort': TableSortDirection | 'none'
  onClick: () => void
}

export interface TableRowProps {
  'data-selected': true | undefined
  'data-expanded': true | undefined
}

export interface TableRowControlProps {
  id: string
  'aria-label': string
  'aria-labelledby': string | undefined
}

export interface TableExpandButtonProps extends TableRowControlProps {
  type: 'button'
  'aria-expanded': boolean
  'aria-controls': string
  onClick: () => void
}

export interface Table<R extends TableRowBase> {
  sort: Ref<TableSortEntry[]>
  selected: Ref<TableRowKey[]>
  page: Ref<number>
  /** Rows per page; `0` when the table is not paged. */
  pageSize: Ref<number>
  expanded: Ref<TableRowKey[]>
  search: Ref<string>

  /** The rows to render: filtered, sorted and sliced (or untouched in manual mode). */
  visibleRows: ComputedRef<R[]>
  /** Rows across every page after filtering. */
  totalCount: ComputedRef<number>
  pageCount: ComputedRef<number>
  /** Index (0-based) of the first visible row within `totalCount`. */
  pageStart: ComputedRef<number>
  /** A query or a filter narrowed the rows down. */
  isFiltering: ComputedRef<boolean>
  selectAllState: ComputedRef<TableSelectAllState>
  /** Rows on the current page that can be selected. */
  selectableRows: ComputedRef<R[]>
  /** Polite live-region text: the latest sort change, or empty. */
  announcement: Ref<string>

  valueOf: (row: R, column: TableColumnDef<R>) => unknown
  textOf: (row: R, column: TableColumnDef<R>) => string
  sortDirection: (key: string) => TableSortDirection | null
  toggleSort: (key: string) => void
  isSelected: (row: R) => boolean
  isSelectable: (row: R) => boolean
  toggleRow: (row: R) => void
  toggleAll: () => void
  clearSelection: () => void
  /** Changes the page size and goes back to page 1. */
  setPageSize: (size: number) => void
  isExpanded: (row: R) => boolean
  toggleExpanded: (row: R) => void

  headerCellProps: (column: TableColumnDef<R>) => TableHeaderCellProps
  sortButtonProps: (column: TableColumnDef<R>) => TableSortButtonProps
  rowProps: (row: R) => TableRowProps
  rowHeaderId: (row: R) => string
  detailId: (row: R) => string
  selectControlProps: (row: R) => TableRowControlProps
  expandButtonProps: (row: R) => TableExpandButtonProps
}
