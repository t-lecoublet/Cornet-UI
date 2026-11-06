import type { DocPageData } from '@/types/docs'

// Demo data shared by the previews below. Kept as template source, since the
// previews are compiled at runtime.
const PEOPLE = `[
    { id: 1, name: 'Ada Lovelace', team: 'Research', salary: 98000, status: 'active' },
    { id: 2, name: 'Grace Hopper', team: 'Platform', salary: 112000, status: 'active' },
    { id: 3, name: 'Alan Turing', team: 'Research', salary: 104000, status: 'on leave' },
    { id: 4, name: 'Margaret Hamilton', team: 'Platform', salary: 125000, status: 'active' },
    { id: 5, name: 'Linus Torvalds', team: 'Kernel', salary: 99000, status: 'left' },
    { id: 6, name: 'Barbara Liskov', team: 'Research', salary: 131000, status: 'active' },
    { id: 7, name: 'Ken Thompson', team: 'Kernel', salary: 88000, status: 'active' },
    { id: 8, name: 'Élodie Martin', team: 'Design', salary: 76000, status: 'active' },
  ]`

const PEOPLE_COLUMNS = `[
    { key: 'name', label: 'Name', sortable: true, rowHeader: true },
    { key: 'team', label: 'Team', sortable: true },
    { key: 'salary', label: 'Salary', sortable: true, align: 'end', format: (v) => '$' + v.toLocaleString('en-US') },
    { key: 'status', label: 'Status', searchable: false },
  ]`

export default {
  title: 'Table',
  description: 'Table displays tabular data — from a static grid to a full data table with sorting, selection, expandable rows, search, paging, loading and empty states, client-side or against a server. Every feature is opt-in and every state can be bound with `v-model`. It follows the WAI-ARIA sortable-table pattern, and is generic over your row type, so your own fields survive into the scoped slots.',
  category: 'Data Display',
  source: 'https://daisyui.com/components/table/',
  props: [
    // ---- data & structure
    {
      title: 'columns',
      description: 'Column definitions. Passing `columns` turns on the dynamic mode; without it the default slot is the table body (manual mode). Each column takes `key` (unique — it also names the `cell-{key}` slots), `label`, and optionally `accessor(row)`, `format(value, row)`, `sortable`, `sortFn(a, b)`, `searchable`, `filter(value, row, query)`, `align` (`start` | `center` | `end`), `width`, `rowHeader`, `headerClass`, `cellClass` (string or `(row) => string`) and `customClass` (header cell).',
      type: 'DuTableColumn<R>[]',
    },
    {
      title: 'rows',
      description: 'Row objects. Each needs a unique, stable `id` — it is the `v-for` key and what selection and expansion are keyed by — and may carry a `customClass`. The component is generic over `R`, so a row of your own interface keeps its type in the slots.',
      type: 'R[]',
      default: '[]',
    },
    {
      title: 'caption',
      description: 'What the table is about, rendered as a `<caption>`. It also names the scroll region when the table overflows. A data table with no caption leaves someone arriving at it by keyboard with a grid of numbers and no idea what they count.',
      type: 'string',
    },
    {
      title: 'hideCaption',
      description: 'Expose the caption to assistive tech without showing it.',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'header',
      description: 'Show the header row.',
      type: 'boolean',
      default: 'true',
    },
    {
      title: 'footer',
      description: 'Show a footer row repeating the column labels.',
      type: 'boolean',
      default: 'false',
    },
    // ---- look
    {
      title: 'panel',
      description: 'The bordered-panel preset: a rounded bordered surface, the toolbar and the pagination bar separated by borders, a tinted header, the sorted header in full colour, hovered rows and `loadingOverlay`. Built from theme tokens only, so it follows your daisyUI theme.',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'zebra',
      description: 'Apply alternating row colors.',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'pinRows',
      description: 'Pin header and footer rows on scroll.',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'pinCols',
      description: 'Pin the row-header columns on horizontal scroll.',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'size',
      description: 'Size of the table. Controls inside it (checkboxes, expand buttons, search field, page-size select, pagination) follow one step down.',
      type: 'string',
      default: '"default"',
      options: ['default', 'xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      title: 'customClass',
      description: 'Additional classes on the `<table>`.',
      type: 'string',
    },
    {
      title: 'wrapperClass',
      description: 'Classes on the scroll container around the `<table>` — a `max-h-*` for `pinRows`, for instance.',
      type: 'string',
    },
    {
      title: 'rowClass',
      description: 'Classes on each body row, on top of the row\'s own `customClass`.',
      type: 'string | (row: R, index: number) => string | undefined',
    },
    {
      title: 'toolbarClass / headClass / footerClass',
      description: 'Classes of the toolbar row, the `<thead>`, and the bar holding the range text and the pagination. Each **replaces** its part\'s default (plain or `panel`) rather than adding to it, so two utilities never fight over one property.',
      type: 'string',
    },
    // ---- sorting
    {
      title: 'sort',
      description: '`v-model:sort` — the sorted columns, as `{ key, direction }` entries. Leave it out and the table keeps its own.',
      type: 'DuTableSort[]',
    },
    {
      title: 'sortMode',
      description: '`single` replaces the sort on each click; `multiple` stacks columns, the first entry sorting first.',
      type: 'string',
      default: '"single"',
      options: ['single', 'multiple'],
    },
    {
      title: 'sortRequired',
      description: 'Clicks alternate ascending ↔ descending; the sort is never cleared. Without it a click cycles none → ascending → descending → none.',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'sortAnnouncement',
      description: 'The polite live-region text after a sort change. Receives the column label and the new direction (`null` once removed).',
      type: '(label: string, direction: "asc" | "desc" | null) => string',
      default: '"Sorted by Name, ascending"',
    },
    // ---- selection
    {
      title: 'selectionMode',
      description: '`multiple` adds a checkbox column with a select-all; `single` adds radios.',
      type: 'string',
      default: '"none"',
      options: ['none', 'single', 'multiple'],
    },
    {
      title: 'selected',
      description: '`v-model:selected` — the ids of the selected rows, across every page.',
      type: '(string | number)[]',
    },
    {
      title: 'isRowSelectable',
      description: 'Rows it returns `false` for get a disabled control and are skipped by select-all.',
      type: '(row: R) => boolean',
    },
    {
      title: 'selectAllLabel / selectRowLabel / selectColumnLabel',
      description: 'Accessible names: the select-all checkbox, each row\'s control (completed by the row header — "Select row Ada"), and the selection column\'s hidden header in single mode.',
      type: 'string',
      default: '"Select all rows" / "Select row" / "Selection"',
    },
    // ---- expansion
    {
      title: 'expanded',
      description: '`v-model:expanded` — the ids of the expanded rows. Rows expand only when the `expanded` slot is provided.',
      type: '(string | number)[]',
    },
    {
      title: 'expandLabel / expandColumnLabel',
      description: 'Accessible names of each expand button (completed by the row header) and of the expand column\'s hidden header.',
      type: 'string',
      default: '"Show details" / "Details"',
    },
    // ---- search
    {
      title: 'search',
      description: '`v-model:search` — the query rows are matched against. By default a row matches when any searchable column\'s shown text contains it, ignoring case and accents. A new query returns to page 1.',
      type: 'string',
    },
    {
      title: 'searchable',
      description: 'Show a search field above the table.',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'searchLabel / searchPlaceholder',
      description: 'Accessible name and placeholder of the built-in search field.',
      type: 'string',
      default: '"Search" / "Search…"',
    },
    {
      title: 'filter',
      description: 'Replaces the whole search predicate.',
      type: '(row: R, query: string) => boolean',
    },
    // ---- paging
    {
      title: 'pageSize',
      description: '`v-model:page-size` — rows per page. Leave it out to show every row, or, with `pageSizeOptions`, to start at the first option.',
      type: 'number',
    },
    {
      title: 'page',
      description: '`v-model:page`, 1-based. Pulled back into range when rows disappear.',
      type: 'number',
    },
    {
      title: 'pageSizeOptions / pageSizeLabel',
      description: 'Offer these page sizes in a native select next to the range text, under a visible label. A new size returns to page 1.',
      type: 'number[] / string',
      default: '— / "Rows per page"',
    },
    {
      title: 'rangeText',
      description: 'The "1–10 of 42" text next to the pagination.',
      type: '(start: number, end: number, total: number) => string',
    },
    {
      title: 'paginationProps',
      description: 'Handed to the embedded DuPagination — its labels, `ariaLabel`, `variant`, `showFirst`… `modelValue`, `total` and `perPage` stay the table\'s.',
      type: 'Partial<DuPaginationProps>',
    },
    // ---- server
    {
      title: 'manual',
      description: 'The rows arrive already searched, sorted and paged (from a server). The table keeps emitting `update:search`, `update:sort`, `update:page` and `update:pageSize` but applies none of them.',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'total',
      description: 'Rows across every page, in `manual` mode — only the server knows.',
      type: 'number',
    },
    // ---- states
    {
      title: 'loading',
      description: 'Sets `aria-busy`. With no rows yet, shows placeholder rows; with rows on screen, dims them (or covers them, with `loadingOverlay`).',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'loadingOverlay',
      description: 'Cover rows being reloaded with a spinner instead of dimming them. On by default with `panel`.',
      type: 'boolean',
    },
    {
      title: 'loadingRows / loadingText',
      description: 'How many placeholder rows to show, and the text announced while loading.',
      type: 'number / string',
      default: '5 / "Loading…"',
    },
    {
      title: 'emptyText / noResultsText',
      description: 'Shown when there are no rows at all, and when a search matched nothing.',
      type: 'string',
      default: '"No data" / "No results"',
    },
  ],
  slots: [
    {
      title: 'Cell slots (#cell-{key})',
      description: 'Customize cells by column key. Slot props: `row`, `column`, `value` (after `accessor`), `index`. A column that shows no field of its own (`actions`) simply uses its slot.',
      preview: `<DuTable
  class="w-full"
  :columns="[
    { key: 'name', label: 'Name' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions', align: 'end' },
  ]"
  :rows="[
    { id: 1, name: 'Alice', status: 'active' },
    { id: 2, name: 'Bob', status: 'inactive' },
  ]"
>
  <template #cell-status="{ value }">
    <DuBadge :variant="value === 'active' ? 'success' : 'error'" size="sm">
      {{ value }}
    </DuBadge>
  </template>
  <template #cell-actions="{ row }">
    <DuButton size="xs" ghost>Edit</DuButton>
  </template>
</DuTable>`,
      code: `<DuTable :columns="columns" :rows="rows">
  <template #cell-status="{ value }">
    <DuBadge :variant="value === 'active' ? 'success' : 'error'" size="sm">
      {{ value }}
    </DuBadge>
  </template>
  <template #cell-actions="{ row }">
    <DuButton size="xs" ghost @click="edit(row)">Edit</DuButton>
  </template>
</DuTable>`,
    },
    {
      title: 'Header slots (#header-{key}, #sort-icon)',
      description: 'Customize header cells. Slot props: `column`, `direction` (`asc` | `desc` | `null`). On a sortable column the content sits inside the sort button. `#sort-icon` replaces the direction icon of every sortable column.',
      preview: `<DuTable
  class="w-full"
  :columns="[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
  ]"
  :rows="[
    { id: 1, name: 'Alice', role: 'Admin' },
    { id: 2, name: 'Bob', role: 'User' },
  ]"
>
  <template #header-name="{ column }">
    <span class="uppercase tracking-wide">{{ column.label }}</span>
  </template>
  <template #sort-icon="{ direction }">
    <span class="text-xs">{{ direction === 'asc' ? '▲' : direction === 'desc' ? '▼' : '⇅' }}</span>
  </template>
</DuTable>`,
      code: `<DuTable :columns="columns" :rows="rows">
  <template #header-name="{ column }">
    <span class="uppercase tracking-wide">{{ column.label }}</span>
  </template>
  <template #sort-icon="{ direction }">
    {{ direction === 'asc' ? '▲' : direction === 'desc' ? '▼' : '⇅' }}
  </template>
</DuTable>`,
    },
    {
      title: 'Toolbar (#toolbar)',
      description: 'A row above the table, after the built-in search field. Slot props: `search`, `setSearch`, `selected`, `clearSelection`, `total`. Put your filters and bulk actions here.',
      code: `<DuTable v-model:selected="selected" selection-mode="multiple" searchable :columns="columns" :rows="rows">
  <template #toolbar="{ selected, clearSelection }">
    <template v-if="selected.length">
      <span class="text-sm">{{ selected.length }} selected</span>
      <DuButton size="sm" variant="error" soft @click="remove(selected)">Delete</DuButton>
      <DuButton size="sm" ghost @click="clearSelection">Clear</DuButton>
    </template>
  </template>
</DuTable>`,
    },
    {
      title: 'Selection controls (#select-all, #select)',
      description: 'Replace the select-all checkbox (props: `state` — `none` | `some` | `all`, `toggle`) and each row\'s control (props: `row`, `selected`, `selectable`, `toggle`, `controlProps` — spread it to keep the accessible name).',
      code: `<DuTable selection-mode="multiple" :columns="columns" :rows="rows">
  <template #select="{ selected, toggle, controlProps }">
    <DuSwap :model-value="selected" v-bind="controlProps" @update:model-value="toggle">
      <template #on>★</template>
      <template #off>☆</template>
    </DuSwap>
  </template>
</DuTable>`,
    },
    {
      title: 'Expansion (#expanded, #expand-toggle)',
      description: '`#expanded` (props: `row`, `index`) is the detail row, spanning every column; providing it adds an expand button per row. `#expand-toggle` replaces that button (props: `row`, `expanded`, `toggle`, `buttonProps` — spread it to keep `aria-expanded` and `aria-controls`).',
      code: `<DuTable :columns="columns" :rows="rows">
  <template #expanded="{ row }">
    <p class="text-sm">{{ row.name }} joined in {{ row.year }}.</p>
  </template>
</DuTable>`,
    },
    {
      title: 'States (#empty, #loading, #loading-overlay)',
      description: '`#empty` (props: `searching`) replaces the empty-state text. `#loading` (props: `colspan`, `count`) replaces the placeholder rows. `#loading-overlay` replaces the spinner of `loadingOverlay`.',
      preview: `<DuTable
  class="w-full"
  :columns="[{ key: 'name', label: 'Name' }, { key: 'role', label: 'Role' }]"
  :rows="[]"
>
  <template #empty>
    <div class="py-4">🗂️ Nothing here yet — add the first member.</div>
  </template>
</DuTable>`,
      code: `<DuTable :columns="columns" :rows="rows">
  <template #empty="{ searching }">
    {{ searching ? 'Nothing matches.' : 'Nothing here yet — add the first member.' }}
  </template>
</DuTable>`,
    },
    {
      title: 'Pagination bar (#pagination)',
      description: 'Replaces the range text, the page-size select and the pagination. Slot props: `page`, `pageCount`, `pageSize`, `total`, `setPage`, `setPageSize`, `rangeText`.',
      code: `<DuTable :columns="columns" :rows="rows" :page-size="10">
  <template #pagination="{ page, pageCount, setPage, rangeText }">
    <span class="text-sm"><strong>{{ rangeText }}</strong></span>
    <DuButton size="sm" :disabled="page === 1" @click="setPage(page - 1)">Previous</DuButton>
    <DuButton size="sm" :disabled="page === pageCount" @click="setPage(page + 1)">Next</DuButton>
  </template>
</DuTable>`,
    },
    {
      title: 'Footer slots (#footer-{key})',
      description: 'Customize footer cells with slot props: column',
      preview: `<DuTable
  class="w-full"
  :columns="[
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
  ]"
  :rows="[
    { id: 1, name: 'Alice', role: 'Admin' },
    { id: 2, name: 'Bob', role: 'User' },
  ]"
  :footer="true"
>
  <template #footer-name>
    <span class="font-bold">Total</span>
  </template>
</DuTable>`,
      code: `<DuTable
  :columns="columns"
  :rows="rows"
  :footer="true"
>
  <template #footer-name>
    <span class="font-bold">Total: {{ rows.length }}</span>
  </template>
</DuTable>`,
    },
    {
      title: 'Custom header slot (#header)',
      description: 'Replace the entire header row with custom content. Built-in sort buttons and select-all are not rendered then.',
      preview: `<DuTable
  class="w-full"
  :columns="[
    { key: 'name', label: 'Name' },
    { key: 'job', label: 'Job' },
    { key: 'status', label: 'Status' },
  ]"
  :rows="[
    { id: 1, name: 'Alice', job: 'Developer', status: 'Active' },
    { id: 2, name: 'Bob', job: 'Designer', status: 'Away' },
  ]"
>
  <template #header>
    <tr>
      <th scope="col" class="bg-primary text-primary-content">Name</th>
      <th scope="col" class="bg-primary text-primary-content">Job</th>
      <th scope="col" class="bg-primary text-primary-content">Status</th>
    </tr>
  </template>
</DuTable>`,
      code: `<DuTable :columns="columns" :rows="rows">
  <template #header>
    <tr>
      <th scope="col">Custom Header</th>
      <th scope="col">Custom Header</th>
    </tr>
  </template>
</DuTable>`,
    },
    {
      title: 'Custom footer slot (#footer)',
      description: 'Replace the entire footer with custom content',
      preview: `<DuTable
  class="w-full"
  :columns="[
    { key: 'name', label: 'Name' },
    { key: 'job', label: 'Job' },
    { key: 'status', label: 'Status' },
  ]"
  :rows="[
    { id: 1, name: 'Alice', job: 'Developer', status: 'Active' },
    { id: 2, name: 'Bob', job: 'Designer', status: 'Away' },
  ]"
  :footer="true"
>
  <template #footer>
    <tr>
      <td colspan="3" class="text-right font-bold">
        Total employees: 2
      </td>
    </tr>
  </template>
</DuTable>`,
      code: `<DuTable :columns="columns" :rows="rows" :footer="true">
  <template #footer>
    <tr>
      <td colspan="3" class="text-right font-bold">
        Total: {{ rows.length }} rows
      </td>
    </tr>
  </template>
</DuTable>`,
    },
    {
      title: 'Manual mode (default slot)',
      description: 'Without `columns`, the default slot is the table body: write the markup yourself, with `DuTableItem` for cells (`isHeader`, `scope` — `col` by default on a header cell, `colspan`, `rowspan`). Only the styling props apply.',
      preview: `<DuTable zebra class="w-full">
  <thead>
    <tr>
      <DuTableItem isHeader>Name</DuTableItem>
      <DuTableItem isHeader>Job</DuTableItem>
      <DuTableItem isHeader>Status</DuTableItem>
    </tr>
  </thead>
  <tbody>
    <tr>
      <DuTableItem isHeader scope="row">Alice</DuTableItem>
      <DuTableItem>Developer</DuTableItem>
      <DuTableItem><DuBadge variant="success" size="sm">Active</DuBadge></DuTableItem>
    </tr>
    <tr>
      <DuTableItem isHeader scope="row">Bob</DuTableItem>
      <DuTableItem>Designer</DuTableItem>
      <DuTableItem><DuBadge variant="warning" size="sm">Away</DuBadge></DuTableItem>
    </tr>
  </tbody>
</DuTable>`,
      code: `<DuTable zebra>
  <thead>
    <tr>
      <DuTableItem isHeader>Name</DuTableItem>
      <DuTableItem isHeader>Job</DuTableItem>
    </tr>
  </thead>
  <tbody>
    <tr>
      <DuTableItem isHeader scope="row">Alice</DuTableItem>
      <DuTableItem>Developer</DuTableItem>
    </tr>
  </tbody>
</DuTable>`,
    },
  ],
  classnames: {
    component: [
      { class: 'table', desc: 'Base class, always applied. size="default" adds no extra class.' },
    ],
    size: [
      { class: 'table-xs', desc: 'size="xs"' },
      { class: 'table-sm', desc: 'size="sm"' },
      { class: 'table-md', desc: 'size="md"' },
      { class: 'table-lg', desc: 'size="lg"' },
      { class: 'table-xl', desc: 'size="xl"' },
    ],
    modifier: [
      { class: 'table-zebra', desc: 'Alternating row colors — zebra' },
      { class: 'table-pin-rows', desc: 'Sticky header/footer rows — pinRows' },
      { class: 'table-pin-cols', desc: 'Sticky row-header columns — pinCols' },
    ],
  },
  sections: [
    {
      title: 'Basic',
      preview: `<DuTable
  class="w-full"
  :columns="[
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
  ]"
  :rows="[
    { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin' },
    { id: 2, name: 'Bob', email: 'bob@example.com', role: 'User' },
  ]"
/>`,
      code: `<DuTable
  :columns="[
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
  ]"
  :rows="[
    { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin' },
    { id: 2, name: 'Bob', email: 'bob@example.com', role: 'User' },
  ]"
/>`,
    },
    {
      title: 'Caption',
      description: 'Give every data table a caption. `hideCaption` keeps it out of the layout while leaving it readable — use that when the surrounding heading already says what the table is, and a visible caption would repeat it.',
      preview: `<DuTable
  caption="Open invoices, Q3 2026"
  :columns="[
    { key: 'ref', label: 'Reference' },
    { key: 'client', label: 'Client' },
    { key: 'total', label: 'Total' },
  ]"
  :rows="[
    { id: 1, ref: 'INV-104', client: 'Northwind', total: '€1,240' },
    { id: 2, ref: 'INV-105', client: 'Contoso', total: '€860' },
  ]"
  class="w-full"
/>`,
      code: `<!-- visible -->
<DuTable caption="Open invoices, Q3 2026" :columns="columns" :rows="rows" />

<!-- exposed but not shown -->
<DuTable caption="Open invoices, Q3 2026" hideCaption :columns="columns" :rows="rows" />

<!-- or as a slot, for markup -->
<DuTable :columns="columns" :rows="rows">
  <template #caption>
    Open invoices, <strong>Q3 2026</strong>
  </template>
</DuTable>`,
    },
    {
      title: 'Typed rows',
      description: 'DuTable is generic over the row type. Declare your own interface and the scoped slots and column callbacks are typed against it — `row.total` is a number in the template, not `any`. The row only has to carry an `id`.',
      lang: 'vue',
      code: `<script setup lang="ts">
import type { DuTableColumn } from 'cornet-ui/types'

interface Invoice {
  id: number
  reference: string
  client: { name: string }
  total: number
}

const rows: Invoice[] = [
  { id: 1, reference: 'INV-104', client: { name: 'Northwind' }, total: 1240 },
]

const columns: DuTableColumn<Invoice>[] = [
  { key: 'reference', label: 'Reference', rowHeader: true },
  { key: 'client', label: 'Client', accessor: (row) => row.client.name },
  { key: 'total', label: 'Total', align: 'end', sortable: true },
]
</script>

<template>
  <DuTable :columns="columns" :rows="rows" caption="Open invoices">
    <!-- row is an Invoice here -->
    <template #cell-total="{ row }">
      {{ row.total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) }}
    </template>
  </DuTable>
</template>`,
    },
    {
      title: 'Sorting',
      description: 'Mark columns `sortable`: each header becomes a button, and a click cycles none → ascending → descending → none (`sortRequired` keeps it to ascending ↔ descending). Values compare as numbers, dates or text — numeric-aware and accent-insensitive — and empty values go last both ways. `sortFn` overrides the order of one column; `sortMode="multiple"` stacks columns. `aria-sort` sits on the sorted column, and the change is announced politely.',
      script: `
      const sort = ref([{ key: 'salary', direction: 'desc' }])
      return { sort }
      `,
      preview: `<div class="w-full">
  <DuTable
    v-model:sort="sort"
    caption="Employees"
    hide-caption
    :columns="${PEOPLE_COLUMNS}"
    :rows="${PEOPLE}"
  />
  <p class="mt-2 text-xs opacity-60">sort: {{ JSON.stringify(sort) }}</p>
</div>`,
      code: `<script setup lang="ts">
import { ref } from 'vue'
import type { DuTableSort } from 'cornet-ui/types'

const sort = ref<DuTableSort[]>([{ key: 'salary', direction: 'desc' }])
const columns = [
  { key: 'name', label: 'Name', sortable: true, rowHeader: true },
  { key: 'team', label: 'Team', sortable: true },
  { key: 'salary', label: 'Salary', sortable: true, align: 'end' },
  // a custom order: by length of the name
  { key: 'nickname', label: 'Nickname', sortable: true, sortFn: (a, b) => a.nickname.length - b.nickname.length },
]
</script>

<template>
  <DuTable v-model:sort="sort" :columns="columns" :rows="rows" />
</template>`,
    },
    {
      title: 'Selection',
      description: '`selection-mode="multiple"` adds a checkbox per row and a select-all that turns indeterminate on a partial selection. Select-all covers the rows on screen; selections on other pages are kept. `v-model:selected` holds row ids, so it survives sorting and paging. `isRowSelectable` disables rows. `selection-mode="single"` uses radios instead.',
      script: `
      const selected = ref([2])
      return { selected }
      `,
      preview: `<div class="w-full">
  <DuTable
    v-model:selected="selected"
    selection-mode="multiple"
    :is-row-selectable="(row) => row.status !== 'left'"
    caption="Employees"
    hide-caption
    :columns="${PEOPLE_COLUMNS}"
    :rows="${PEOPLE}"
  >
    <template #toolbar="{ selected, clearSelection }">
      <template v-if="selected.length">
        <span class="text-sm">{{ selected.length }} selected</span>
        <DuButton size="xs" ghost @click="clearSelection">Clear</DuButton>
      </template>
    </template>
  </DuTable>
  <p class="mt-2 text-xs opacity-60">selected: {{ JSON.stringify(selected) }}</p>
</div>`,
      code: `<DuTable
  v-model:selected="selected"
  selection-mode="multiple"
  :is-row-selectable="(row) => row.status !== 'left'"
  :columns="columns"
  :rows="rows"
>
  <template #toolbar="{ selected, clearSelection }">
    <template v-if="selected.length">
      {{ selected.length }} selected
      <DuButton size="xs" ghost @click="clearSelection">Clear</DuButton>
    </template>
  </template>
</DuTable>`,
    },
    {
      title: 'Expandable rows',
      description: 'Provide the `expanded` slot and each row gets a disclosure button (`aria-expanded`, `aria-controls`) opening a detail row that spans every column. `v-model:expanded` holds the open row ids.',
      preview: `<DuTable
  class="w-full"
  caption="Employees"
  hide-caption
  :columns="${PEOPLE_COLUMNS}"
  :rows="${PEOPLE}.slice(0, 4)"
>
  <template #expanded="{ row }">
    <p class="py-1 text-sm">{{ row.name }} works in <b>{{ row.team }}</b> and is currently {{ row.status }}.</p>
  </template>
</DuTable>`,
      code: `<DuTable v-model:expanded="expanded" :columns="columns" :rows="rows">
  <template #expanded="{ row }">
    <p class="text-sm">{{ row.name }} works in <b>{{ row.team }}</b>.</p>
  </template>
</DuTable>`,
    },
    {
      title: 'Search and paging',
      description: '`searchable` adds a search field; `v-model:search` drives it from outside. `pageSize` pages the rows through an embedded DuPagination, with a "1–4 of 8" range; `pageSizeOptions` adds a rows-per-page select. A new query, or a new page size, goes back to page 1. Try `elo` — the match ignores accents.',
      script: `
      const search = ref('')
      const page = ref(1)
      return { search, page }
      `,
      preview: `<div class="w-full">
  <DuTable
    v-model:search="search"
    v-model:page="page"
    searchable
    :page-size="4"
    :page-size-options="[4, 8]"
    caption="Employees"
    hide-caption
    :columns="${PEOPLE_COLUMNS}"
    :rows="${PEOPLE}"
  />
  <p class="mt-2 text-xs opacity-60">search: "{{ search }}" · page: {{ page }}</p>
</div>`,
      code: `<DuTable
  v-model:search="search"
  v-model:page="page"
  v-model:page-size="pageSize"
  searchable
  :page-size-options="[10, 25, 50]"
  :columns="columns"
  :rows="rows"
/>`,
    },
    {
      title: 'Server-side data (manual)',
      description: 'With `manual`, the table applies nothing: it emits `update:search`, `update:sort`, `update:page` and `update:pageSize`, and you pass back the rows of the page and the `total`. Keep the state wherever suits you — often the URL — and fetch when it changes. Filters the table does not know about must reset the page themselves. While reloading, the rows stay on screen, dimmed (or covered, with `loadingOverlay`).',
      script: `
      const all = ${PEOPLE}
      const sort = ref([])
      const search = ref('')
      const page = ref(1)
      const loading = ref(false)
      const result = ref({ rows: all.slice(0, 3), total: all.length })
      let ticket = 0
      watch([sort, search, page], () => {
        const mine = ++ticket
        loading.value = true
        setTimeout(() => {
          if (mine !== ticket) return
          const q = search.value.toLowerCase()
          let rows = all.filter((p) => p.name.toLowerCase().includes(q))
          const s = sort.value[0]
          if (s) rows = [...rows].sort((a, b) => (a[s.key] > b[s.key] ? 1 : -1) * (s.direction === 'asc' ? 1 : -1))
          result.value = { rows: rows.slice((page.value - 1) * 3, page.value * 3), total: rows.length }
          loading.value = false
        }, 600)
      }, { deep: true })
      return { sort, search, page, loading, result }
      `,
      preview: `<DuTable
  v-model:sort="sort"
  v-model:search="search"
  v-model:page="page"
  manual
  searchable
  loading-overlay
  :page-size="3"
  :total="result.total"
  :rows="result.rows"
  :loading="loading"
  caption="Employees (from the server)"
  hide-caption
  class="w-full"
  :columns="${PEOPLE_COLUMNS}"
/>`,
      code: `<script setup lang="ts">
import { ref, watch } from 'vue'
import type { DuTableSort } from 'cornet-ui/types'

const sort = ref<DuTableSort[]>([])
const search = ref('')
const page = ref(1)
const loading = ref(false)
const result = ref({ items: [], total: 0 })

let ticket = 0
watch([sort, search, page], async () => {
  const mine = ++ticket
  loading.value = true
  const params = new URLSearchParams({ q: search.value, page: String(page.value) })
  if (sort.value[0]) params.set('sort', sort.value[0].key + ':' + sort.value[0].direction)
  const data = await fetch('/api/employees?' + params).then((r) => r.json())
  if (mine === ticket) { // drop answers to older requests
    result.value = data
    loading.value = false
  }
}, { deep: true, immediate: true })
</script>

<template>
  <DuTable
    v-model:sort="sort" v-model:search="search" v-model:page="page"
    manual searchable :page-size="25"
    :rows="result.items" :total="result.total" :loading="loading"
    :columns="columns"
  />
</template>`,
    },
    {
      title: 'Panel preset',
      description: '`panel` gives the table a finished look: a rounded bordered surface, the toolbar and the pagination bar separated by borders, a tinted header, the sorted column in full colour, hovered rows and a spinner over rows being reloaded. It uses theme tokens only, so it follows your daisyUI theme. Every label can be translated — here in French, with a required sort and a rows-per-page choice.',
      preview: `<DuTable
  panel
  sort-required
  searchable
  :page-size-options="[4, 8]"
  page-size-label="par page"
  search-label="Rechercher un employé"
  search-placeholder="Rechercher…"
  :range-text="(start, end, total) => start + '–' + end + ' sur ' + total"
  :pagination-props="{ ariaLabel: 'Pages des employés', previousAriaLabel: 'Page précédente', nextAriaLabel: 'Page suivante' }"
  :sort-announcement="(label, dir) => 'Trié par ' + label + ', ' + (dir === 'asc' ? 'croissant' : 'décroissant')"
  no-results-text="Aucun résultat"
  :sort="[{ key: 'name', direction: 'asc' }]"
  caption="Employés"
  hide-caption
  class="w-full"
  :columns="${PEOPLE_COLUMNS}"
  :rows="${PEOPLE}"
>
  <template #cell-status="{ value }">
    <DuBadge :variant="value === 'active' ? 'success' : value === 'left' ? 'neutral' : 'warning'" size="sm" soft>{{ value }}</DuBadge>
  </template>
</DuTable>`,
      code: `<DuTable
  v-model:sort="sort" v-model:page="page" v-model:page-size="perPage"
  :columns="columns" :rows="result.items" :total="result.total" :loading="loading"
  manual panel sort-required hide-caption
  :page-size-options="[10, 25, 50, 100]" page-size-label="par page"
  :range-text="(s, e, t) => s + '–' + e + ' sur ' + t"
  :pagination-props="{ ariaLabel: 'Pages des inscrits', previousAriaLabel: 'Page précédente', nextAriaLabel: 'Page suivante' }"
  :sort-announcement="(label, d) => 'Trié par ' + label + ', ' + (d === 'asc' ? 'croissant' : 'décroissant')"
  loading-text="Chargement…"
>
  <template #caption>Inscrits</template>
  <template #toolbar>
    <!-- search field with an icon, DuSelect filters, a reset button… -->
  </template>
</DuTable>`,
    },
    {
      title: 'The panel look, part by part',
      description: 'One preset ships; everything else is a recipe. `toolbarClass`, `headClass` and `footerClass` each replace their part\'s default, `wrapperClass` styles the scroll container and `rowClass` every row — so the same look can be rebuilt, or bent, without the preset. To colour the sorted column with a token of your own, target `button[data-sort]`.',
      lang: 'vue',
      code: `<DuTable
  class="rounded-box border border-base-300 bg-base-100 shadow-xs overflow-hidden"
  toolbar-class="flex flex-wrap items-center gap-3 border-b border-base-300 p-4"
  head-class="bg-base-200/60"
  footer-class="flex items-center justify-between border-t border-base-300 p-4"
  row-class="transition-colors hover:bg-base-200/50"
  loading-overlay
  :columns="columns"
  :rows="rows"
/>

<style>
/* the sorted column, in a colour of your theme */
.table button[data-sort="asc"],
.table button[data-sort="desc"] { color: var(--color-primary); }
</style>`,
    },
    {
      title: 'Loading and empty states',
      description: 'While `loading` with no rows yet, placeholder rows stand in for the data; the table carries `aria-busy` and `loadingText` is announced. With no rows at all the table says so (`emptyText`), and with a search that matched nothing it says that instead (`noResultsText`).',
      preview: `<div class="grid w-full gap-6 md:grid-cols-2">
  <DuTable
    loading
    :loading-rows="3"
    :columns="[{ key: 'name', label: 'Name' }, { key: 'team', label: 'Team' }]"
    :rows="[]"
  />
  <DuTable
    empty-text="No employee yet"
    :columns="[{ key: 'name', label: 'Name' }, { key: 'team', label: 'Team' }]"
    :rows="[]"
  />
</div>`,
      code: `<DuTable :loading="loading" :loading-rows="3" :columns="columns" :rows="rows" />
<DuTable empty-text="No employee yet" no-results-text="Nobody matches" :columns="columns" :rows="rows" />`,
    },
    {
      title: 'Columns: accessor, format, alignment, row header',
      description: '`accessor` reads a value that is not `row[key]` — a nested field, a derived number — and that value is what sorting and searching use. `format` turns it into the shown (and searched) text. `align` and `width` lay the column out, `cellClass` styles its cells. A `rowHeader` column renders as `<th scope="row">`, so a screen reader announces the name before the figures, and names the row\'s controls after it.',
      preview: `<DuTable
  class="w-full"
  :columns="[
    { key: 'name', label: 'Name', rowHeader: true },
    { key: 'city', label: 'City', accessor: (row) => row.address.city },
    { key: 'joined', label: 'Joined', format: (value) => new Date(value).toLocaleDateString('en-GB') },
    { key: 'score', label: 'Score', align: 'end', width: '6rem', cellClass: (row) => (row.score < 50 ? 'text-error' : undefined) },
  ]"
  :rows="[
    { id: 1, name: 'Ada', address: { city: 'London' }, joined: '2019-03-04', score: 92 },
    { id: 2, name: 'Grace', address: { city: 'New York' }, joined: '2017-09-12', score: 41 },
  ]"
/>`,
      code: `const columns: DuTableColumn<Member>[] = [
  { key: 'name', label: 'Name', rowHeader: true },
  { key: 'city', label: 'City', accessor: (row) => row.address.city },
  { key: 'joined', label: 'Joined', format: (value) => new Date(value as string).toLocaleDateString() },
  { key: 'score', label: 'Score', align: 'end', width: '6rem', cellClass: (row) => (row.score < 50 ? 'text-error' : undefined) },
]`,
    },
    {
      title: 'Events and methods',
      description: 'Every state has its `update:` event, so each one works with `v-model:` or a plain listener. `row-click` fires on a click on a row, but not on a control inside it — a `<tr>` is not focusable, so whatever it does must also be reachable through a link or a button in the row. Through a template ref, the table also exposes `toggleSort(key)`, `toggleRow(row)`, `toggleAll()`, `clearSelection()`, `toggleExpanded(row)` and `setPageSize(size)`.',
      lang: 'vue',
      code: `<DuTable
  ref="table"
  :columns="columns"
  :rows="rows"
  @update:sort="(sort) => saveToUrl({ sort })"
  @update:selected="(ids) => (selectedIds = ids)"
  @update:expanded="(ids) => (openIds = ids)"
  @update:search="(query) => track('search', query)"
  @update:page="(page) => saveToUrl({ page })"
  @update:page-size="(size) => saveToUrl({ size })"
  @row-click="(row) => router.push('/employees/' + row.id)"
/>

<!-- table.value.clearSelection() after a bulk action -->`,
    },
    {
      title: 'Accessibility',
      description: 'DuTable follows the WAI-ARIA sortable-table pattern rather than a `grid`: Tab moves between the controls, and a screen reader\'s table commands move between cells. Every header cell is scoped, the sorted column carries `aria-sort`, sort changes and loading are announced in a polite live region, and row controls are named after the row header ("Select row Ada", "Show details Ada"). The scroll container becomes a focusable region — named by the caption — only while the table overflows it, so a wide table can be scrolled by keyboard and one that fits is not a dead tab stop.',
    },
    {
      title: 'Zebra stripes',
      preview: `<DuTable
  zebra
  class="w-full"
  :columns="[
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
  ]"
  :rows="[
    { id: 1, name: 'Alice', role: 'Admin' },
    { id: 2, name: 'Bob', role: 'User' },
    { id: 3, name: 'Charlie', role: 'User' },
  ]"
/>`,
      code: `<DuTable zebra :columns="columns" :rows="rows" />`,
    },
    {
      title: 'With footer',
      preview: `<DuTable
  class="w-full"
  :columns="[
    { key: 'name', label: 'Name' },
    { key: 'job', label: 'Job' },
  ]"
  :rows="[
    { id: 1, name: 'Alice', job: 'Developer' },
    { id: 2, name: 'Bob', job: 'Designer' },
  ]"
  :footer="true"
/>`,
      code: `<DuTable
  :columns="columns"
  :rows="rows"
  :footer="true"
/>`,
    },
    {
      title: 'Pinned rows',
      description: 'Header and footer stay fixed while the rows scroll. Give the table a height — on the component, or on its scroll container through `wrapperClass`.',
      preview: `<DuTable
  class="w-full"
  wrapper-class="max-h-48"
  :columns="[
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
  ]"
  :rows="[
    { id: 1, name: 'Alice', role: 'Admin' },
    { id: 2, name: 'Bob', role: 'User' },
    { id: 3, name: 'Charlie', role: 'User' },
    { id: 4, name: 'Diana', role: 'Admin' },
    { id: 5, name: 'Eve', role: 'User' },
    { id: 6, name: 'Frank', role: 'User' },
  ]"
  :pinRows="true"
/>`,
      code: `<DuTable
  :columns="columns"
  :rows="rows"
  :pinRows="true"
  wrapper-class="max-h-48"
/>`,
    },
    {
      title: 'Pinned columns',
      description: 'Row-header columns (`rowHeader`) stay fixed on horizontal scroll.',
      preview: `<DuTable
  class="w-full max-w-md"
  :pinCols="true"
  :columns="[
    { key: 'name', label: 'Name', rowHeader: true },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'department', label: 'Department' },
    { key: 'location', label: 'Location' },
  ]"
  :rows="[
    { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin', department: 'IT', location: 'Bordeaux' },
    { id: 2, name: 'Bob', email: 'bob@example.com', role: 'User', department: 'Sales', location: 'Limoges' },
  ]"
/>`,
      code: `<DuTable
  :columns="columns"
  :rows="rows"
  :pinCols="true"
/>`,
    },
    {
      title: 'Sizes',
      preview: `<div class="flex w-full flex-col gap-4">
  <DuTable size="xs"
    :columns="[{ key: 'name', label: 'Name' }, { key: 'role', label: 'Role' }]"
    :rows="[{ id: 1, name: 'Alice', role: 'Admin' }, { id: 2, name: 'Bob', role: 'User' }]"
  />
  <DuTable size="lg"
    :columns="[{ key: 'name', label: 'Name' }, { key: 'role', label: 'Role' }]"
    :rows="[{ id: 1, name: 'Alice', role: 'Admin' }, { id: 2, name: 'Bob', role: 'User' }]"
  />
</div>`,
      code: `<DuTable size="xs" :columns="columns" :rows="rows" />
<DuTable size="sm" :columns="columns" :rows="rows" />
<DuTable size="md" :columns="columns" :rows="rows" />
<DuTable size="lg" :columns="columns" :rows="rows" />`,
    },
    {
      title: 'Without header',
      preview: `<DuTable
  class="w-full"
  :columns="[
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
  ]"
  :rows="[
    { id: 1, name: 'Alice', role: 'Admin' },
    { id: 2, name: 'Bob', role: 'User' },
  ]"
  :header="false"
/>`,
      code: `<DuTable
  :columns="columns"
  :rows="rows"
  :header="false"
/>`,
    },
  ],
} satisfies DocPageData
