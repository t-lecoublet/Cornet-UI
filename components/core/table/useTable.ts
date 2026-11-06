import { computed, ref, watch } from 'vue'
import { useControllableState } from '../shared'
import { compareForDirection, displayText, textMatches } from './compare'
import type {
  Table,
  TableColumnDef,
  TableRowBase,
  TableRowKey,
  TableSortDirection,
  TableSortEntry,
  TableOptions,
} from './types'

const DIRECTION_LABEL = { asc: 'ascending', desc: 'descending' } as const

const defaultAnnouncement = (column: string, direction: TableSortDirection | null): string =>
  direction ? `Sorted by ${column}, ${DIRECTION_LABEL[direction]}` : `Sorting by ${column} removed`

/** A row key as an id fragment: ids may not hold spaces, and selectors dislike most punctuation. */
const idFragment = (key: TableRowKey): string => String(key).replace(/[^\w-]/g, '_')

/**
 * The data-table engine: search → sort → page, plus selection and expansion,
 * over rows the consumer owns.
 *
 * One closure, like the combobox engine, because the parts are coupled: a new
 * search sends the table back to page 1, a shrinking result set pulls the page
 * back into range, and a selection keyed by row id survives sorting and paging
 * untouched. Split into four composables, each of those rules would live in
 * whichever one happened to notice it.
 *
 * Every state is controllable (§5): pass the prop and the engine only emits;
 * leave it out and the engine keeps it. In `manual` mode the engine still owns
 * and emits the state but stops applying it — the rows arrive already
 * searched, sorted and sliced, typically from a server.
 *
 * The pattern is the APG *sortable table*: a plain `<table>`, `aria-sort` on
 * the sorted column's header, the sort control a real `<button>` inside it. Not
 * a `grid` — a grid takes over the arrow keys and promises cell-by-cell
 * navigation, which a table of data with a few controls in it does not need.
 */
export function useTable<R extends TableRowBase>(options: TableOptions<R>): Table<R> {
  const manual = () => options.manual?.() === true
  const sortMode = () => options.sortMode?.() ?? 'single'
  const selectionMode = () => options.selectionMode?.() ?? 'none'
  const pageSizeState = useControllableState(
    () => options.pageSize?.value?.(),
    (value) => options.pageSize?.onChange?.(value),
    options.pageSize?.fallback ?? 0,
  )
  const pageSize = () => {
    const size = pageSizeState.value
    return size && size > 0 ? Math.floor(size) : 0
  }

  const sort = useControllableState(options.sort.value, options.sort.onChange, [])
  const selected = useControllableState(options.selected.value, options.selected.onChange, [])
  const page = useControllableState(options.page.value, options.page.onChange, 1)
  const expanded = useControllableState(options.expanded.value, options.expanded.onChange, [])
  const search = useControllableState(options.search.value, options.search.onChange, '')
  const announcement = ref('')

  const columnByKey = computed(() => new Map(options.columns().map((column) => [column.key, column])))

  function valueOf(row: R, column: TableColumnDef<R>): unknown {
    return column.accessor ? column.accessor(row) : (row as unknown as Record<string, unknown>)[column.key]
  }

  function textOf(row: R, column: TableColumnDef<R>): string {
    const value = valueOf(row, column)
    return column.format ? column.format(value, row) : displayText(value)
  }

  // ---- search -------------------------------------------------------------

  const query = computed(() => search.value.trim())
  const isFiltering = computed(() => query.value !== '')

  function matches(row: R, text: string): boolean {
    const predicate = options.filter?.()
    if (predicate) {
      return predicate(row, text)
    }
    return options.columns().some((column) => {
      if (column.searchable === false) {
        return false
      }
      return column.filter
        ? column.filter(valueOf(row, column), row, text)
        : textMatches(textOf(row, column), text)
    })
  }

  const filteredRows = computed(() => {
    const rows = options.rows()
    if (manual() || !isFiltering.value) {
      return rows
    }
    return rows.filter((row) => matches(row, query.value))
  })

  // ---- sort ---------------------------------------------------------------

  const sortedRows = computed(() => {
    const rows = filteredRows.value
    const entries = sort.value.filter((entry) => columnByKey.value.has(entry.key))
    if (manual() || entries.length === 0) {
      return rows
    }
    // `sort` is stable, so rows equal on every key keep the consumer's order.
    return [...rows].sort((a, b) => {
      for (const entry of entries) {
        const column = columnByKey.value.get(entry.key)!
        const order = column.sortFn
          ? (entry.direction === 'asc' ? 1 : -1) * column.sortFn(a, b)
          : compareForDirection(valueOf(a, column), valueOf(b, column), entry.direction)
        if (order !== 0) {
          return order
        }
      }
      return 0
    })
  })

  function sortDirection(key: string): TableSortDirection | null {
    return sort.value.find((entry) => entry.key === key)?.direction ?? null
  }

  /**
   * none → ascending → descending → none; or, when a sort is required,
   * ascending ↔ descending.
   */
  function toggleSort(key: string) {
    const column = columnByKey.value.get(key)
    if (!column) {
      return
    }
    const current = sortDirection(key)
    const allowUnsorted = options.allowUnsorted?.() !== false
    const next: TableSortDirection | null
      = current === null ? 'asc' : current === 'asc' ? 'desc' : allowUnsorted ? null : 'asc'

    let entries: TableSortEntry[]
    if (sortMode() === 'single') {
      entries = next ? [{ key, direction: next }] : []
    } else if (current === null) {
      entries = [...sort.value, { key, direction: 'asc' }]
    } else {
      entries = next
        ? sort.value.map((entry) => (entry.key === key ? { key, direction: next } : entry))
        : sort.value.filter((entry) => entry.key !== key)
    }

    sort.value = entries
    const announce = options.labels?.sortAnnouncement?.() ?? defaultAnnouncement
    announcement.value = announce(column.label, next)
  }

  // ---- paging -------------------------------------------------------------

  const totalCount = computed(() => {
    if (manual()) {
      return options.total?.() ?? options.rows().length
    }
    return sortedRows.value.length
  })

  const pageCount = computed(() => {
    const size = pageSize()
    return size ? Math.max(1, Math.ceil(totalCount.value / size)) : 1
  })

  /** The page actually shown: a page past the end shows the last one. */
  const currentPage = computed(() => Math.min(Math.max(1, page.value), pageCount.value))

  const pageStart = computed(() => {
    const size = pageSize()
    return size ? (currentPage.value - 1) * size : 0
  })

  const visibleRows = computed(() => {
    const size = pageSize()
    if (manual() || !size) {
      return sortedRows.value
    }
    return sortedRows.value.slice(pageStart.value, pageStart.value + size)
  })

  // A new query is a new result set: staying on page 7 of the old one would
  // show an empty table or a page the user never asked for.
  watch(query, () => {
    if (pageSize()) {
      page.value = 1
    }
  })

  // Rows removed, or a narrower search: pull the page back into range, and
  // say so through `update:page` so a controlled consumer agrees. Not in
  // manual mode — there `total` is the server's word, and it is often briefly
  // unknown while a request is in flight.
  watch(pageCount, (count) => {
    if (!manual() && pageSize() && page.value > count) {
      page.value = count
    }
  })

  // ---- selection ----------------------------------------------------------

  const selectedSet = computed(() => new Set(selected.value))

  function isSelectable(row: R): boolean {
    if (selectionMode() === 'none') {
      return false
    }
    const predicate = options.isRowSelectable?.()
    return predicate ? predicate(row) : true
  }

  const isSelected = (row: R): boolean => selectedSet.value.has(row.id)

  function toggleRow(row: R) {
    if (!isSelectable(row)) {
      return
    }
    if (selectionMode() === 'single') {
      selected.value = isSelected(row) ? [] : [row.id]
      return
    }
    selected.value = isSelected(row)
      ? selected.value.filter((key) => key !== row.id)
      : [...selected.value, row.id]
  }

  const selectableRows = computed(() => visibleRows.value.filter(isSelectable))

  /** Over the rows on screen: "select all" means what the user can see. */
  const selectAllState = computed(() => {
    const rows = selectableRows.value
    const count = rows.filter(isSelected).length
    if (count === 0) {
      return 'none' as const
    }
    return count === rows.length ? ('all' as const) : ('some' as const)
  })

  /**
   * Selects every selectable row on the page, or — when they all are —
   * deselects them. Selections on other pages are left alone either way.
   */
  function toggleAll() {
    if (selectionMode() !== 'multiple') {
      return
    }
    const pageKeys = selectableRows.value.map((row) => row.id)
    if (selectAllState.value === 'all') {
      const onPage = new Set(pageKeys)
      selected.value = selected.value.filter((key) => !onPage.has(key))
    } else {
      selected.value = [...selected.value, ...pageKeys.filter((key) => !selectedSet.value.has(key))]
    }
  }

  function clearSelection() {
    selected.value = []
  }

  function setPageSize(size: number) {
    pageSizeState.value = size
    page.value = 1
  }

  // ---- expansion ----------------------------------------------------------

  const expandedSet = computed(() => new Set(expanded.value))
  const isExpanded = (row: R): boolean => expandedSet.value.has(row.id)

  function toggleExpanded(row: R) {
    expanded.value = isExpanded(row)
      ? expanded.value.filter((key) => key !== row.id)
      : [...expanded.value, row.id]
  }

  // ---- ids and prop bags --------------------------------------------------

  const hasRowHeader = computed(() => options.columns().some((column) => column.rowHeader))
  const rowHeaderId = (row: R) => `${options.id}-rowheader-${idFragment(row.id)}`
  const detailId = (row: R) => `${options.id}-detail-${idFragment(row.id)}`

  /**
   * A row control is named "<label> <row header>" — "Select row Ada" — by
   * pointing `aria-labelledby` at itself and at the row's header cell. Without
   * a row header column there is nothing to point at, and the label alone has
   * to do.
   */
  function controlProps(row: R, kind: string, label: string) {
    const id = `${options.id}-${kind}-${idFragment(row.id)}`
    return {
      id,
      'aria-label': label,
      'aria-labelledby': hasRowHeader.value ? `${id} ${rowHeaderId(row)}` : undefined,
    }
  }

  return {
    sort,
    selected,
    page: computed({
      get: () => currentPage.value,
      set: (value: number) => {
        page.value = Math.min(Math.max(1, Math.floor(value)), pageCount.value)
      },
    }),
    pageSize: computed({
      get: pageSize,
      set: setPageSize,
    }),
    expanded,
    search,

    visibleRows,
    totalCount,
    pageCount,
    pageStart,
    isFiltering,
    selectAllState,
    selectableRows,
    announcement,

    valueOf,
    textOf,
    sortDirection,
    toggleSort,
    isSelected,
    isSelectable,
    toggleRow,
    toggleAll,
    clearSelection,
    setPageSize,
    isExpanded,
    toggleExpanded,

    headerCellProps: (column) => {
      const direction = column.sortable ? sortDirection(column.key) : null
      return { 'aria-sort': direction ? DIRECTION_LABEL[direction] : undefined }
    },
    sortButtonProps: (column) => ({
      type: 'button',
      'data-sort': sortDirection(column.key) ?? 'none',
      onClick: () => toggleSort(column.key),
    }),
    rowProps: (row) => ({
      'data-selected': isSelected(row) || undefined,
      'data-expanded': isExpanded(row) || undefined,
    }),
    rowHeaderId,
    detailId,
    selectControlProps: (row) => controlProps(row, 'select', options.labels?.selectRow?.() ?? 'Select row'),
    expandButtonProps: (row) => ({
      ...controlProps(row, 'expand', options.labels?.expandRow?.() ?? 'Show details'),
      type: 'button',
      'aria-expanded': isExpanded(row),
      'aria-controls': detailId(row),
      onClick: () => toggleExpanded(row),
    }),
  }
}
