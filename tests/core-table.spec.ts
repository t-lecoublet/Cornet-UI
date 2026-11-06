// The table engine on its own: search → sort → page, selection, expansion and
// the prop bags, driven the way DuTable drives it — through getters and
// controllable models — but with no markup at all.
import { describe, expect, it } from 'vitest'
import { nextTick, reactive } from 'vue'
import { useTable } from '../components/core/table'
import {
  compareForDirection,
  compareValues,
  displayText,
  textMatches,
} from '../components/core/table'
import type {
  TableColumnDef,
  TableRowKey,
  TableSelectionMode,
  TableSortEntry,
  TableSortMode,
} from '../components/core/table'

interface Person {
  id: number
  name: string
  age: number | null
  city: { name: string }
}

const people: Person[] = [
  { id: 1, name: 'Ada', age: 36, city: { name: 'London' } },
  { id: 2, name: 'Grace', age: 85, city: { name: 'New York' } },
  { id: 3, name: 'Élodie', age: null, city: { name: 'Paris' } },
  { id: 4, name: 'Alan', age: 41, city: { name: 'London' } },
  { id: 5, name: 'Barbara', age: 36, city: { name: 'Boston' } },
]

const columns: TableColumnDef<Person>[] = [
  { key: 'name', label: 'Name', sortable: true, rowHeader: true },
  { key: 'age', label: 'Age', sortable: true },
  { key: 'city', label: 'City', accessor: (row) => row.city.name, sortable: true },
]

interface State {
  rows: Person[]
  columns: TableColumnDef<Person>[]
  manual: boolean
  total: number | undefined
  pageSize: number | undefined
  sortMode: TableSortMode
  allowUnsorted: boolean
  selectionMode: TableSelectionMode
  isRowSelectable: ((row: Person) => boolean) | undefined
  filter: ((row: Person, query: string) => boolean) | undefined
  sort: TableSortEntry[] | undefined
  selected: TableRowKey[] | undefined
  page: number | undefined
  expanded: TableRowKey[] | undefined
  search: string | undefined
}

function setup(init: Partial<State> = {}) {
  const state = reactive<State>({
    rows: people,
    columns,
    manual: false,
    total: undefined,
    pageSize: undefined,
    sortMode: 'single',
    allowUnsorted: true,
    selectionMode: 'multiple',
    isRowSelectable: undefined,
    filter: undefined,
    sort: undefined,
    selected: undefined,
    page: undefined,
    expanded: undefined,
    search: undefined,
    ...init,
  }) as State

  const emitted: Record<string, unknown[]> = {}
  const record = (name: string) => (value: unknown) => {
    (emitted[name] ??= []).push(value)
  }

  const table = useTable<Person>({
    id: 't',
    rows: () => state.rows,
    columns: () => state.columns,
    manual: () => state.manual,
    total: () => state.total,
    pageSize: { value: () => state.pageSize, onChange: record('pageSize') },
    allowUnsorted: () => state.allowUnsorted,
    sortMode: () => state.sortMode,
    selectionMode: () => state.selectionMode,
    isRowSelectable: () => state.isRowSelectable,
    filter: () => state.filter,
    sort: { value: () => state.sort, onChange: record('sort') },
    selected: { value: () => state.selected, onChange: record('selected') },
    page: { value: () => state.page, onChange: record('page') },
    expanded: { value: () => state.expanded, onChange: record('expanded') },
    search: { value: () => state.search, onChange: record('search') },
  })

  const names = () => table.visibleRows.value.map((row) => row.name)
  return { state, table, emitted, names }
}

describe('compare helpers', () => {
  it('compares numbers as numbers and text numerically', () => {
    expect(compareValues(2, 10)).toBeLessThan(0)
    expect(compareValues('item 2', 'item 10')).toBeLessThan(0)
    expect(compareValues('e', 'é')).toBe(0)
  })

  it('compares dates by time and booleans false first', () => {
    expect(compareValues(new Date(2020, 0, 1), new Date(2021, 0, 1))).toBeLessThan(0)
    expect(compareValues(false, true)).toBeLessThan(0)
    expect(compareValues(BigInt(3), BigInt(2))).toBeGreaterThan(0)
  })

  it('puts empty values last in both directions', () => {
    expect(compareForDirection(null, 1, 'asc')).toBeGreaterThan(0)
    expect(compareForDirection(null, 1, 'desc')).toBeGreaterThan(0)
    expect(compareForDirection('', undefined, 'asc')).toBe(0)
    expect(compareForDirection(1, 2, 'desc')).toBeGreaterThan(0)
  })

  it('matches text ignoring case and accents', () => {
    expect(textMatches('Élodie', 'elo')).toBe(true)
    expect(textMatches('Ada', '  ADA ')).toBe(true)
    expect(textMatches('Ada', 'grace')).toBe(false)
  })

  it('shows values the way a template would', () => {
    expect(displayText(null)).toBe('')
    expect(displayText(12)).toBe('12')
    expect(displayText({ a: 1 })).toBe('{"a":1}')
  })
})

describe('useTable — sorting', () => {
  it('cycles none → ascending → descending → none', () => {
    const { table, names } = setup()
    table.toggleSort('name')
    expect(table.sortDirection('name')).toBe('asc')
    expect(names()).toEqual(['Ada', 'Alan', 'Barbara', 'Élodie', 'Grace'])

    table.toggleSort('name')
    expect(names()).toEqual(['Grace', 'Élodie', 'Barbara', 'Alan', 'Ada'])

    table.toggleSort('name')
    expect(table.sort.value).toEqual([])
    expect(names()).toEqual(['Ada', 'Grace', 'Élodie', 'Alan', 'Barbara'])
  })

  it('keeps empty values last and ties in their original order', () => {
    const { table, names } = setup()
    table.toggleSort('age')
    expect(names()).toEqual(['Ada', 'Barbara', 'Alan', 'Grace', 'Élodie'])
    table.toggleSort('age')
    expect(names()).toEqual(['Grace', 'Alan', 'Ada', 'Barbara', 'Élodie'])
  })

  it('sorts through an accessor and a custom sortFn', () => {
    const byLength: TableColumnDef<Person> = {
      key: 'name', label: 'Name', sortable: true, sortFn: (a, b) => a.name.length - b.name.length,
    }
    const { table, names, state } = setup()
    table.toggleSort('city')
    expect(names()[0]).toBe('Barbara')

    state.columns = [byLength]
    table.toggleSort('name')
    expect(names()).toEqual(['Ada', 'Alan', 'Grace', 'Élodie', 'Barbara'])
    table.toggleSort('name')
    expect(names()[0]).toBe('Barbara')
  })

  it('replaces the sort in single mode and stacks it in multiple mode', () => {
    const single = setup()
    single.table.toggleSort('age')
    single.table.toggleSort('name')
    expect(single.table.sort.value).toEqual([{ key: 'name', direction: 'asc' }])

    const multi = setup({ sortMode: 'multiple' })
    multi.table.toggleSort('age')
    multi.table.toggleSort('name')
    expect(multi.table.sort.value).toEqual([
      { key: 'age', direction: 'asc' },
      { key: 'name', direction: 'asc' },
    ])
    // Ada and Barbara tie on age; the second key breaks it.
    expect(multi.names().slice(0, 2)).toEqual(['Ada', 'Barbara'])

    multi.table.toggleSort('age')
    expect(multi.table.sort.value[0]).toEqual({ key: 'age', direction: 'desc' })
    multi.table.toggleSort('age')
    expect(multi.table.sort.value).toEqual([{ key: 'name', direction: 'asc' }])
  })

  it('never clears a required sort', () => {
    const { table } = setup({ allowUnsorted: false })
    table.toggleSort('name')
    table.toggleSort('name')
    table.toggleSort('name')
    expect(table.sort.value).toEqual([{ key: 'name', direction: 'asc' }])
    expect(table.announcement.value).toBe('Sorted by Name, ascending')
  })

  it('ignores an unknown column', () => {
    const { table, emitted } = setup()
    table.toggleSort('nope')
    expect(emitted.sort).toBeUndefined()
  })

  it('only emits when controlled, and follows the prop', async () => {
    const { table, state, emitted, names } = setup({ sort: [] })
    table.toggleSort('name')
    expect(emitted.sort).toEqual([[{ key: 'name', direction: 'asc' }]])
    expect(table.sort.value).toEqual([])

    state.sort = [{ key: 'name', direction: 'desc' }]
    await nextTick()
    expect(names()[0]).toBe('Grace')
  })

  it('announces the change by column label', () => {
    const { table } = setup()
    table.toggleSort('city')
    expect(table.announcement.value).toBe('Sorted by City, ascending')
    table.toggleSort('city')
    table.toggleSort('city')
    expect(table.announcement.value).toBe('Sorting by City removed')
  })

  it('puts aria-sort on the sorted column only', () => {
    const { table } = setup()
    table.toggleSort('age')
    table.toggleSort('age')
    expect(table.headerCellProps(columns[1]!)['aria-sort']).toBe('descending')
    expect(table.headerCellProps(columns[0]!)['aria-sort']).toBeUndefined()
    expect(table.sortButtonProps(columns[0]!)['data-sort']).toBe('none')
    expect(table.sortButtonProps(columns[1]!)['data-sort']).toBe('desc')
  })
})

describe('useTable — search', () => {
  it('matches any searchable column, through accessors, ignoring accents', () => {
    const { table, names } = setup()
    table.search.value = 'london'
    expect(names()).toEqual(['Ada', 'Alan'])
    table.search.value = 'elo'
    expect(names()).toEqual(['Élodie'])
    expect(table.isFiltering.value).toBe(true)
  })

  it('skips columns that opt out, and honours a column filter', () => {
    const { table, names, state } = setup()
    state.columns = [
      { key: 'name', label: 'Name' },
      { key: 'city', label: 'City', accessor: (row) => row.city.name, searchable: false },
      { key: 'age', label: 'Age', filter: (value, _row, query) => String(value) === query },
    ]
    table.search.value = 'London'
    expect(names()).toEqual([])
    table.search.value = '36'
    expect(names()).toEqual(['Ada', 'Barbara'])
  })

  it('takes a whole-row filter instead', () => {
    const { table, names } = setup({ filter: (row, query) => row.id === Number(query) })
    table.search.value = '4'
    expect(names()).toEqual(['Alan'])
  })

  it('does not filter in manual mode', () => {
    const { table, names, emitted } = setup({ manual: true })
    table.search.value = 'zzz'
    expect(names()).toHaveLength(5)
    expect(emitted.search).toEqual(['zzz'])
  })
})

describe('useTable — paging', () => {
  it('slices the sorted, filtered rows', () => {
    const { table, names } = setup({ pageSize: 2 })
    expect(table.pageCount.value).toBe(3)
    expect(names()).toEqual(['Ada', 'Grace'])
    table.page.value = 3
    expect(names()).toEqual(['Barbara'])
    expect(table.pageStart.value).toBe(4)
  })

  it('clamps a requested page into range', () => {
    const { table } = setup({ pageSize: 2 })
    table.page.value = 99
    expect(table.page.value).toBe(3)
    table.page.value = -4
    expect(table.page.value).toBe(1)
  })

  it('goes back to page 1 on a new search', async () => {
    const { table, emitted } = setup({ pageSize: 2 })
    table.page.value = 2
    table.search.value = 'a'
    await nextTick()
    expect(table.page.value).toBe(1)
    expect(emitted.page).toEqual([2, 1])
  })

  it('pulls the page back when rows disappear', async () => {
    const { table, state, emitted } = setup({ pageSize: 2 })
    table.page.value = 3
    state.rows = people.slice(0, 2)
    await nextTick()
    expect(table.page.value).toBe(1)
    expect(emitted.page).toEqual([3, 1])
  })

  it('changes the page size and goes back to page 1', () => {
    const { table, emitted } = setup({ pageSize: undefined })
    // Uncontrolled with no fallback: not paged.
    expect(table.pageSize.value).toBe(0)
    table.setPageSize(2)
    expect(table.pageSize.value).toBe(2)
    table.page.value = 3
    table.pageSize.value = 4
    expect(table.page.value).toBe(1)
    expect(table.visibleRows.value).toHaveLength(4)
    expect(emitted.pageSize).toEqual([2, 4])
  })

  it('follows a controlled page size and only emits', async () => {
    const { table, state, emitted } = setup({ pageSize: 2 })
    table.setPageSize(5)
    expect(emitted.pageSize).toEqual([5])
    expect(table.pageSize.value).toBe(2)
    state.pageSize = 5
    await nextTick()
    expect(table.visibleRows.value).toHaveLength(5)
  })

  it('shows every row without a page size', () => {
    const { table } = setup()
    expect(table.visibleRows.value).toHaveLength(5)
    expect(table.pageCount.value).toBe(1)
  })

  it('trusts the rows and the total in manual mode', async () => {
    const { table, state, emitted } = setup({ manual: true, pageSize: 2, total: 40, page: 3 })
    expect(table.visibleRows.value).toHaveLength(5)
    expect(table.pageCount.value).toBe(20)
    expect(table.pageStart.value).toBe(4)

    table.page.value = 4
    expect(emitted.page).toEqual([4])

    // A total briefly unknown during a request does not reset the page.
    state.total = 0
    await nextTick()
    expect(emitted.page).toEqual([4])
  })
})

describe('useTable — selection', () => {
  it('toggles rows by id, across sorting', () => {
    const { table } = setup()
    table.toggleRow(people[1]!)
    table.toggleSort('name')
    expect(table.isSelected(people[1]!)).toBe(true)
    table.toggleRow(people[1]!)
    expect(table.selected.value).toEqual([])
  })

  it('keeps one row at most in single mode', () => {
    const { table } = setup({ selectionMode: 'single' })
    table.toggleRow(people[0]!)
    table.toggleRow(people[2]!)
    expect(table.selected.value).toEqual([3])
    table.toggleAll()
    expect(table.selected.value).toEqual([3])
  })

  it('selects nothing in none mode', () => {
    const { table } = setup({ selectionMode: 'none' })
    table.toggleRow(people[0]!)
    expect(table.selected.value).toEqual([])
    expect(table.isSelectable(people[0]!)).toBe(false)
  })

  it('skips rows that cannot be selected', () => {
    const { table } = setup({ isRowSelectable: (row) => row.age !== null })
    table.toggleRow(people[2]!)
    expect(table.selected.value).toEqual([])
    table.toggleAll()
    expect(table.selected.value).toEqual([1, 2, 4, 5])
    expect(table.selectAllState.value).toBe('all')
  })

  it('reports none, some and all over the visible page', () => {
    const { table } = setup({ pageSize: 2 })
    expect(table.selectAllState.value).toBe('none')
    table.toggleRow(people[0]!)
    expect(table.selectAllState.value).toBe('some')
    table.toggleRow(people[1]!)
    expect(table.selectAllState.value).toBe('all')
    table.page.value = 2
    expect(table.selectAllState.value).toBe('none')
  })

  it('selects and deselects the page only, keeping other pages', () => {
    const { table } = setup({ pageSize: 2 })
    table.toggleRow(people[4]!)
    table.toggleAll()
    expect(table.selected.value).toEqual([5, 1, 2])
    table.toggleAll()
    expect(table.selected.value).toEqual([5])
    table.clearSelection()
    expect(table.selected.value).toEqual([])
  })

  it('only emits when controlled', () => {
    const { table, emitted } = setup({ selected: [] })
    table.toggleRow(people[0]!)
    expect(emitted.selected).toEqual([[1]])
    expect(table.selected.value).toEqual([])
  })
})

describe('useTable — expansion and ids', () => {
  it('toggles expansion by id', () => {
    const { table, emitted } = setup()
    table.toggleExpanded(people[0]!)
    expect(table.isExpanded(people[0]!)).toBe(true)
    expect(table.rowProps(people[0]!)['data-expanded']).toBe(true)
    table.toggleExpanded(people[0]!)
    expect(emitted.expanded).toEqual([[1], []])
  })

  it('wires the expand button to the detail row', () => {
    const { table } = setup()
    const props = table.expandButtonProps(people[0]!)
    expect(props['aria-expanded']).toBe(false)
    expect(props['aria-controls']).toBe(table.detailId(people[0]!))
    props.onClick()
    expect(table.expandButtonProps(people[0]!)['aria-expanded']).toBe(true)
  })

  it('names row controls after the row header when there is one', () => {
    const { table, state } = setup()
    const props = table.selectControlProps(people[0]!)
    expect(props['aria-label']).toBe('Select row')
    expect(props['aria-labelledby']).toBe(`${props.id} ${table.rowHeaderId(people[0]!)}`)

    state.columns = [{ key: 'name', label: 'Name' }]
    expect(table.selectControlProps(people[0]!)['aria-labelledby']).toBeUndefined()
  })

  it('makes ids out of any row key', () => {
    const { table } = setup()
    const odd = { ...people[0]!, id: 'a b/c' as unknown as number }
    expect(table.detailId(odd)).toBe('t-detail-a_b_c')
  })

  it('marks selected rows with a data attribute', () => {
    const { table } = setup()
    table.toggleRow(people[0]!)
    expect(table.rowProps(people[0]!)['data-selected']).toBe(true)
    expect(table.rowProps(people[1]!)['data-selected']).toBeUndefined()
  })
})
