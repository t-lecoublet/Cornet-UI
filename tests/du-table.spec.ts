// DuTable driven like a user: clicking headers, checkboxes and expand buttons,
// typing a search, paging — and asserting what a screen reader would find.
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import DuTable from '../components/DataDisplay/du-table/du-table.vue'
import type { DuTableColumn, DuTableRowBase } from '../components/DataDisplay/du-table/du-table.types'

// `mount` instantiates a generic component at its constraint, so a scoped
// slot sees `DuTableRowBase` rather than the row type a template would infer.
const asRep = (row: DuTableRowBase) => row as Rep

interface Rep {
  id: number
  name: string
  total: number
}

const columns: DuTableColumn<Rep>[] = [
  { key: 'name', label: 'Name' },
  { key: 'total', label: 'Total' },
]

const rows: Rep[] = [
  { id: 1, name: 'Ada', total: 12 },
  { id: 2, name: 'Grace', total: 7 },
]

const many: Rep[] = Array.from({ length: 12 }, (_, i) => ({ id: i + 1, name: `Rep ${i + 1}`, total: i }))

const sortable: DuTableColumn<Rep>[] = [
  { key: 'name', label: 'Name', sortable: true, rowHeader: true },
  { key: 'total', label: 'Total', sortable: true, align: 'end' },
]

const bodyNames = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findAll('tbody tr:not([data-detail])').map((tr) => tr.find('th, td:not(:has(input, button))').text())

describe('DuTable — structure', () => {
  it('ties every header to the column beneath it', () => {
    // Without `scope`, a screen reader has to guess whether a `<th>` heads a
    // column or a row, and announces the wrong one on complex tables.
    const wrapper = mount(DuTable, { props: { columns, rows } })
    const headers = wrapper.findAll('thead th')

    expect(headers).toHaveLength(2)
    expect(headers.every((th) => th.attributes('scope') === 'col')).toBe(true)
  })

  it('says what the table is about', () => {
    const wrapper = mount(DuTable, { props: { columns, rows, caption: 'Sales by rep' } })
    const caption = wrapper.find('caption')

    expect(caption.text()).toBe('Sales by rep')
    expect(caption.element.tagName).toBe('CAPTION')
  })

  it('can expose the caption without showing it', () => {
    const wrapper = mount(DuTable, { props: { columns, rows, caption: 'Sales', hideCaption: true } })
    expect(wrapper.find('caption').classes()).toContain('sr-only')
  })

  it('has no caption at all when there is nothing to say', () => {
    const wrapper = mount(DuTable, { props: { columns, rows } })
    expect(wrapper.find('caption').exists()).toBe(false)
  })

  it('takes the caption from a slot too', () => {
    const wrapper = mount(DuTable, {
      props: { columns, rows },
      slots: { caption: '<span class="rich">Sales <b>2024</b></span>' },
    })
    expect(wrapper.find('caption .rich').exists()).toBe(true)
  })

  it('still renders the cells through their column keys', () => {
    const wrapper = mount(DuTable, { props: { columns, rows } })
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    expect(wrapper.text()).toContain('Ada')
    expect(wrapper.text()).toContain('12')
  })

  it('is not a tab stop when nothing scrolls', () => {
    // A focusable container that does not scroll is a dead tab stop with a
    // focus ring around nothing.
    const wrapper = mount(DuTable, { props: { columns, rows, caption: 'Sales' } })
    expect(wrapper.find('[tabindex]').exists()).toBe(false)
    expect(wrapper.find('[role="region"]').exists()).toBe(false)
  })

  it('renders columns with no rows instead of falling back to the manual mode', () => {
    const wrapper = mount(DuTable, { props: { columns } })
    expect(wrapper.findAll('thead th')).toHaveLength(2)
    expect(wrapper.find('tbody').text()).toBe('No data')
  })

  it('keeps the manual mode for hand-written markup', () => {
    const wrapper = mount(DuTable, {
      props: { zebra: true },
      slots: { default: '<tbody><tr><td>Hand made</td></tr></tbody>' },
    })
    expect(wrapper.find('table').classes()).toContain('table-zebra')
    expect(wrapper.find('td').text()).toBe('Hand made')
  })

  it('renders a row header column as th scope=row', () => {
    const wrapper = mount(DuTable, { props: { columns: sortable, rows } })
    const header = wrapper.find('tbody th')
    expect(header.attributes('scope')).toBe('row')
    expect(header.text()).toBe('Ada')
  })
})

describe('DuTable — customising', () => {
  it('formats, aligns and classes cells', () => {
    const wrapper = mount(DuTable, {
      props: {
        rows,
        columns: [
          { key: 'name', label: 'Name', headerClass: 'head', cellClass: (row: Rep) => (row.id === 1 ? 'first' : undefined) },
          { key: 'total', label: 'Total', align: 'end', width: '6rem', format: (value: unknown) => `€${value}` },
        ],
        rowClass: (_row: Rep, index: number) => `row-${index}`,
        wrapperClass: 'max-h-40',
      },
    })
    expect(wrapper.find('thead th').classes()).toContain('head')
    expect(wrapper.find('thead th:nth-child(2)').attributes('style')).toContain('width: 6rem')
    expect(wrapper.find('tbody td').classes()).toContain('first')
    expect(wrapper.find('tbody td:nth-child(2)').classes()).toContain('text-end')
    expect(wrapper.find('tbody td:nth-child(2)').text()).toBe('€12')
    expect(wrapper.find('tbody tr').classes()).toContain('row-0')
    expect(wrapper.find('.overflow-auto').classes()).toContain('max-h-40')
  })

  it('reads a value through an accessor', () => {
    const wrapper = mount(DuTable, {
      props: { rows, columns: [{ key: 'double', label: 'Double', accessor: (row: Rep) => row.total * 2 }] },
    })
    expect(wrapper.find('tbody td').text()).toBe('24')
  })

  it('hands cell, header and sort-icon slots what they need', () => {
    const wrapper = mount(DuTable, {
      props: { columns: sortable, rows, sort: [{ key: 'name', direction: 'asc' }] },
      slots: {
        'cell-total': ({ value, row, index }: { value: unknown, row: DuTableRowBase, index: number }) =>
          `${asRep(row).name}:${String(value)}:${index}`,
        'header-name': ({ direction }: { direction: string | null }) => `Name (${direction})`,
        'sort-icon': ({ direction }: { direction: string | null }) => h('i', { class: 'icon' }, direction ?? '-'),
      },
    })
    expect(wrapper.find('tbody td').text()).toBe('Ada:12:0')
    expect(wrapper.find('thead th button').text()).toContain('Name (asc)')
    expect(wrapper.findAll('.icon').map((i) => i.text())).toEqual(['asc', '-'])
  })
})

describe('DuTable — sorting', () => {
  it('sorts on a header click and sets aria-sort on that header only', async () => {
    const wrapper = mount(DuTable, { props: { columns: sortable, rows } })
    const [name, total] = wrapper.findAll('thead th')

    await total!.find('button').trigger('click')
    expect(total!.attributes('aria-sort')).toBe('ascending')
    expect(name!.attributes('aria-sort')).toBeUndefined()
    expect(bodyNames(wrapper)).toEqual(['Grace', 'Ada'])
    expect(wrapper.emitted('update:sort')?.[0]).toEqual([[{ key: 'total', direction: 'asc' }]])

    await total!.find('button').trigger('click')
    expect(total!.attributes('aria-sort')).toBe('descending')
    expect(bodyNames(wrapper)).toEqual(['Ada', 'Grace'])
  })

  it('announces the sort politely', async () => {
    const wrapper = mount(DuTable, { props: { columns: sortable, rows } })
    await wrapper.find('thead th button').trigger('click')
    const live = wrapper.find('[aria-live="polite"][aria-atomic="true"]')
    expect(live.text()).toBe('Sorted by Name, ascending')
  })

  it('lets the announcement be rewritten', async () => {
    const wrapper = mount(DuTable, {
      props: { columns: sortable, rows, sortAnnouncement: (label: string) => `Trié par ${label}` },
    })
    await wrapper.find('thead th button').trigger('click')
    expect(wrapper.find('[aria-atomic="true"]').text()).toBe('Trié par Name')
  })

  it('does not reorder rows itself in manual mode', async () => {
    const wrapper = mount(DuTable, { props: { columns: sortable, rows, manual: true } })
    await wrapper.findAll('thead th')[1]!.find('button').trigger('click')
    expect(wrapper.emitted('update:sort')).toHaveLength(1)
    expect(bodyNames(wrapper)).toEqual(['Ada', 'Grace'])
  })
})

describe('DuTable — selection', () => {
  it('selects rows and reflects it on select-all as indeterminate, then all', async () => {
    const wrapper = mount(DuTable, { props: { columns, rows, selectionMode: 'multiple' } })
    const all = () => wrapper.find('thead input[type="checkbox"]').element as HTMLInputElement
    const boxes = () => wrapper.findAll('tbody input[type="checkbox"]')

    await boxes()[0]!.setValue(true)
    expect(wrapper.emitted('update:selected')?.[0]).toEqual([[1]])
    expect(all().indeterminate).toBe(true)
    expect(wrapper.find('tbody tr').attributes('data-selected')).toBe('true')

    await boxes()[1]!.setValue(true)
    expect(all().indeterminate).toBe(false)
    expect(all().checked).toBe(true)

    await wrapper.find('thead input[type="checkbox"]').setValue(false)
    expect(wrapper.emitted('update:selected')?.at(-1)).toEqual([[]])
  })

  it('names the select-all box and each row box after its row', () => {
    const wrapper = mount(DuTable, { props: { columns: sortable, rows, selectionMode: 'multiple' } })
    expect(wrapper.find('thead input').attributes('aria-label')).toBe('Select all rows')

    const box = wrapper.find('tbody input')
    const rowHeader = wrapper.find('tbody th')
    expect(box.attributes('aria-label')).toBe('Select row')
    expect(box.attributes('aria-labelledby')).toBe(`${box.attributes('id')} ${rowHeader.attributes('id')}`)
  })

  it('uses radios sharing one name in single mode', async () => {
    const wrapper = mount(DuTable, { props: { columns, rows, selectionMode: 'single' } })
    const radios = wrapper.findAll('tbody input[type="radio"]')
    expect(radios).toHaveLength(2)
    expect(radios[0]!.attributes('name')).toBe(radios[1]!.attributes('name'))
    expect(wrapper.find('thead th .sr-only').text()).toBe('Selection')

    await radios[1]!.trigger('change')
    expect(wrapper.emitted('update:selected')?.[0]).toEqual([[2]])
  })

  it('disables rows that cannot be selected', () => {
    const wrapper = mount(DuTable, {
      props: { columns, rows, selectionMode: 'multiple', isRowSelectable: (row: Rep) => row.id !== 2 },
    })
    expect(wrapper.findAll('tbody input')[1]!.attributes('disabled')).toBeDefined()
  })

  it('follows a controlled selection', async () => {
    const wrapper = mount(DuTable, { props: { columns, rows, selectionMode: 'multiple', selected: [2] } })
    const boxes = () => wrapper.findAll('tbody input').map((i) => (i.element as HTMLInputElement).checked)
    expect(boxes()).toEqual([false, true])
    await wrapper.setProps({ selected: [1, 2] })
    expect(boxes()).toEqual([true, true])
  })

  it('lets the select slot replace the control', async () => {
    const wrapper = mount(DuTable, {
      props: { columns, rows, selectionMode: 'multiple' },
      slots: {
        select: ({ selected, toggle }: { selected: boolean, toggle: () => void }) =>
          h('button', { class: 'pick', type: 'button', onClick: toggle }, selected ? 'on' : 'off'),
      },
    })
    await wrapper.find('.pick').trigger('click')
    expect(wrapper.find('.pick').text()).toBe('on')
  })
})

describe('DuTable — expansion and row clicks', () => {
  const expandable = (props: Record<string, unknown> = {}) =>
    mount(DuTable, {
      props: { columns: sortable, rows, ...props },
      slots: { expanded: ({ row }: { row: DuTableRowBase }) => h('p', { class: 'detail' }, `Details of ${asRep(row).name}`) },
    })

  it('shows a detail row wired to its button', async () => {
    const wrapper = expandable()
    const button = wrapper.find('tbody button')
    expect(button.attributes('aria-expanded')).toBe('false')
    expect(wrapper.find('.detail').exists()).toBe(false)

    await button.trigger('click')
    expect(button.attributes('aria-expanded')).toBe('true')
    const detail = wrapper.find('tr[data-detail]')
    expect(detail.attributes('id')).toBe(button.attributes('aria-controls'))
    expect(detail.find('td').attributes('colspan')).toBe('3')
    expect(detail.text()).toBe('Details of Ada')
    expect(wrapper.emitted('update:expanded')?.[0]).toEqual([[1]])
  })

  it('names the expand button after its row and its column for screen readers', () => {
    const wrapper = expandable()
    const button = wrapper.find('tbody button')
    expect(button.attributes('aria-label')).toBe('Show details')
    expect(button.attributes('aria-labelledby')).toContain(wrapper.find('tbody th').attributes('id'))
    expect(wrapper.find('thead th .sr-only').text()).toBe('Details')
  })

  it('emits row-click on the row, not on its controls', async () => {
    const wrapper = expandable({ selectionMode: 'multiple' })
    await wrapper.find('tbody th').trigger('click')
    expect(wrapper.emitted('row-click')?.[0]?.[0]).toEqual(rows[0])

    await wrapper.find('tbody button').trigger('click')
    await wrapper.find('tbody input').trigger('click')
    expect(wrapper.emitted('row-click')).toHaveLength(1)
  })
})

describe('DuTable — search and paging', () => {
  it('filters through the built-in search and says when nothing matched', async () => {
    const wrapper = mount(DuTable, { props: { columns, rows, searchable: true } })
    const input = wrapper.find('input[type="search"]')
    expect(input.attributes('aria-label')).toBe('Search')

    await input.setValue('gra')
    expect(bodyNames(wrapper)).toEqual(['Grace'])
    expect(wrapper.emitted('update:search')?.[0]).toEqual(['gra'])

    await input.setValue('zzz')
    expect(wrapper.find('tbody').text()).toBe('No results')
  })

  it('pages the rows and shows the range', async () => {
    const wrapper = mount(DuTable, { props: { columns, rows: many, pageSize: 5 } })
    expect(wrapper.findAll('tbody tr')).toHaveLength(5)
    expect(wrapper.text()).toContain('1–5 of 12')

    await wrapper.find('nav [aria-label="Next page"]').trigger('click')
    expect(wrapper.emitted('update:page')?.[0]).toEqual([2])
    expect(bodyNames(wrapper)[0]).toBe('Rep 6')
    expect(wrapper.text()).toContain('6–10 of 12')
  })

  it('returns to page 1 when the search changes', async () => {
    const wrapper = mount(DuTable, { props: { columns, rows: many, pageSize: 5, searchable: true } })
    await wrapper.find('nav [aria-label="Next page"]').trigger('click')
    await wrapper.find('input[type="search"]').setValue('Rep 1')
    expect(wrapper.emitted('update:page')?.at(-1)).toEqual([1])
    expect(bodyNames(wrapper)).toEqual(['Rep 1', 'Rep 10', 'Rep 11', 'Rep 12'])
  })

  it('uses the server total in manual mode', () => {
    const wrapper = mount(DuTable, { props: { columns, rows, manual: true, pageSize: 2, total: 40, page: 3 } })
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    expect(wrapper.text()).toContain('5–6 of 40')
    expect(wrapper.find('[aria-current="page"]').text()).toBe('3')
  })

  it('lets the toolbar and pagination slots take over', () => {
    const wrapper = mount(DuTable, {
      props: { columns, rows: many, pageSize: 5, selectionMode: 'multiple', selected: [1, 2] },
      slots: {
        toolbar: ({ selected }: { selected: (string | number)[] }) => h('span', { class: 'count' }, `${selected.length} selected`),
        pagination: ({ page, pageCount }: { page: number, pageCount: number }) => h('span', { class: 'pager' }, `${page}/${pageCount}`),
      },
    })
    expect(wrapper.find('.count').text()).toBe('2 selected')
    expect(wrapper.find('.pager').text()).toBe('1/3')
    expect(wrapper.find('nav').exists()).toBe(false)
  })
})

describe('DuTable — loading and empty states', () => {
  it('shows placeholder rows and marks the table busy while loading with no rows', () => {
    const wrapper = mount(DuTable, { props: { columns, rows: [] as Rep[], loading: true, loadingRows: 3 } })
    expect(wrapper.find('table').attributes('aria-busy')).toBe('true')
    expect(wrapper.findAll('tbody tr')).toHaveLength(3)
    expect(wrapper.findAll('tbody .skeleton')).toHaveLength(6)
    expect(wrapper.text()).toContain('Loading…')
  })

  it('keeps the rows on screen while reloading', () => {
    const wrapper = mount(DuTable, { props: { columns, rows, loading: true } })
    expect(wrapper.find('.skeleton').exists()).toBe(false)
    expect(wrapper.find('tbody tr').classes()).toContain('opacity-50')
  })

  it('renders the empty slot across every column', () => {
    const wrapper = mount(DuTable, {
      props: { columns, rows: [] as Rep[], selectionMode: 'multiple' },
      slots: { empty: '<em>Nothing yet</em>' },
    })
    expect(wrapper.find('tbody td').attributes('colspan')).toBe('3')
    expect(wrapper.find('tbody em').text()).toBe('Nothing yet')
    expect(wrapper.find('thead input').attributes('disabled')).toBeDefined()
  })
})

describe('DuTable — ids', () => {
  it('gives two tables different ids', () => {
    const wrapper = mount({
      components: { DuTable },
      setup: () => ({ columns: sortable, rows }),
      template: `
        <DuTable :columns="columns" :rows="rows" selection-mode="single" caption="A" />
        <DuTable :columns="columns" :rows="rows" selection-mode="single" caption="B" />
      `,
    })
    const tables = wrapper.findAll('table').map((t) => t.attributes('id'))
    const names = wrapper.findAll('input[type="radio"]').map((r) => r.attributes('name'))
    expect(new Set(tables).size).toBe(2)
    expect(new Set(names).size).toBe(2)
  })
})

describe('DuTable — scrolling', () => {
  let resize: (() => void) | undefined

  afterEach(() => {
    vi.unstubAllGlobals()
    resize = undefined
  })

  it('becomes a named, focusable region once the table overflows', async () => {
    vi.stubGlobal('ResizeObserver', class {
      constructor(callback: () => void) { resize = callback }
      observe() {}
      disconnect() {}
    })
    const wrapper = mount(DuTable, { props: { columns, rows, caption: 'Sales' } })
    const scroller = wrapper.find('.overflow-auto').element as HTMLElement
    expect(scroller.hasAttribute('tabindex')).toBe(false)

    Object.defineProperty(scroller, 'scrollWidth', { configurable: true, value: 900 })
    Object.defineProperty(scroller, 'clientWidth', { configurable: true, value: 300 })
    resize!()
    await nextTick()

    expect(scroller.getAttribute('tabindex')).toBe('0')
    expect(scroller.getAttribute('role')).toBe('region')
    expect(scroller.getAttribute('aria-labelledby')).toBe(wrapper.find('caption').attributes('id'))
  })

  it('stops observing once unmounted', () => {
    const disconnect = vi.fn()
    vi.stubGlobal('ResizeObserver', class {
      observe() {}
      disconnect = disconnect
    })
    mount(DuTable, { props: { columns, rows } }).unmount()
    expect(disconnect).toHaveBeenCalled()
  })

  it('renders no live region in manual mode', () => {
    const wrapper = mount(DuTable, { slots: { default: '<tbody><tr><td>x</td></tr></tbody>' } })
    expect(wrapper.find('[aria-live]').exists()).toBe(false)
  })
})

describe('DuTable — pinCols', () => {
  it('keeps only the row-header columns pinned, header and footer included', () => {
    // daisyUI pins every <th> of a pinned-columns table. Without this the
    // column headers — all <th> — would stack at the left edge.
    const wrapper = mount(DuTable, {
      props: { columns: sortable, rows, pinCols: true, footer: true, selectionMode: 'multiple' },
    })
    const [select, name, total] = wrapper.findAll('thead th')
    expect(select!.classes()).toContain('static')
    expect(name!.classes()).not.toContain('static')
    expect(total!.classes()).toContain('static')

    const footer = wrapper.findAll('tfoot th')
    expect(footer[0]!.classes()).not.toContain('static')
    expect(footer[1]!.classes()).toContain('static')
  })

  it('leaves header cells alone without pinCols', () => {
    const wrapper = mount(DuTable, { props: { columns: sortable, rows } })
    expect(wrapper.findAll('thead th').some((th) => th.classes().includes('static'))).toBe(false)
  })
})

describe('DuTable — sortRequired', () => {
  it('alternates ascending and descending without clearing', async () => {
    const wrapper = mount(DuTable, { props: { columns: sortable, rows, sortRequired: true } })
    const header = () => wrapper.find('thead th')
    for (const expected of ['ascending', 'descending', 'ascending']) {
      await header().find('button').trigger('click')
      expect(header().attributes('aria-sort')).toBe(expected)
    }
  })
})

describe('DuTable — page size and pagination props', () => {
  it('offers page sizes, starting at the first one when uncontrolled', async () => {
    const wrapper = mount(DuTable, {
      props: { columns, rows: many, pageSizeOptions: [5, 10], pageSizeLabel: 'Lignes par page' },
    })
    expect(wrapper.findAll('tbody tr')).toHaveLength(5)
    const select = wrapper.find('select')
    expect(wrapper.find(`label[for="${select.attributes('id')}"]`).text()).toContain('Lignes par page')

    await wrapper.find('nav [aria-label="Next page"]').trigger('click')
    await select.setValue('10')
    expect(wrapper.emitted('update:pageSize')?.[0]).toEqual([10])
    expect(wrapper.emitted('update:page')?.at(-1)).toEqual([1])
    expect(wrapper.findAll('tbody tr')).toHaveLength(10)
  })

  it('hands its props to the embedded pagination, keeping the page its own', () => {
    const wrapper = mount(DuTable, {
      props: {
        columns,
        rows: many,
        pageSize: 5,
        page: 2,
        paginationProps: { ariaLabel: 'Pages des inscrits', nextAriaLabel: 'Page suivante', modelValue: 99 },
      },
    })
    expect(wrapper.find('nav').attributes('aria-label')).toBe('Pages des inscrits')
    expect(wrapper.find('[aria-label="Page suivante"]').exists()).toBe(true)
    expect(wrapper.find('[aria-current="page"]').text()).toBe('2')
  })
})

describe('DuTable — panel and class hooks', () => {
  it('applies the panel look to every part', () => {
    const wrapper = mount(DuTable, { props: { columns, rows: many, pageSize: 5, searchable: true, panel: true } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['rounded-box', 'border', 'border-base-300']))
    expect(wrapper.find('thead').classes()).toContain('bg-base-200/60')
    expect(wrapper.find('tbody tr').classes()).toContain('hover:bg-base-200/50')
    expect(wrapper.find('input[type="search"]').element.parentElement!.className).toContain('border-b')
    expect(wrapper.find('nav').element.parentElement!.className).toContain('border-t')
  })

  it('lets a class prop replace the default of its part', () => {
    const wrapper = mount(DuTable, {
      props: {
        columns, rows: many, pageSize: 5, searchable: true, panel: true,
        toolbarClass: 'my-toolbar', headClass: 'my-head', footerClass: 'my-footer',
      },
    })
    expect(wrapper.find('input[type="search"]').element.parentElement!.className).toBe('my-toolbar')
    expect(wrapper.find('thead').attributes('class')).toBe('my-head')
    expect(wrapper.find('nav').element.parentElement!.className).toBe('my-footer')
  })

  it('covers reloading rows with a spinner instead of dimming them', () => {
    const wrapper = mount(DuTable, { props: { columns, rows, loading: true, panel: true } })
    expect(wrapper.find('.loading-spinner').exists()).toBe(true)
    expect(wrapper.find('tbody tr').classes()).not.toContain('opacity-50')

    const plain = mount(DuTable, { props: { columns, rows, loading: true, loadingOverlay: true } })
    expect(plain.find('.loading-spinner').exists()).toBe(true)
  })

  it('takes a custom overlay', () => {
    const wrapper = mount(DuTable, {
      props: { columns, rows, loading: true, loadingOverlay: true },
      slots: { 'loading-overlay': '<span class="custom">…</span>' },
    })
    expect(wrapper.find('.custom').exists()).toBe(true)
  })
})
