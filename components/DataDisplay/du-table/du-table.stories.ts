import type { Meta, StoryObj } from "@storybook/vue3"
import DuTable from "./du-table.vue"
import DuTableItem from "./du-table-item.vue"
import DuBadge from "../du-badge/du-badge.vue"
import DuButton from "../../Actions/du-button/du-button.vue"
import DuLabel from "../../DataInput/du-label/du-label.vue"
import DuInputField from "../../DataInput/du-input-field/du-input-field.vue"
import DuSelect from "../../DataInput/du-select/du-select.vue"
import { useSizeStoriesControl } from "../../../composables/useSizeProps"
import type { ArgTypes } from "@storybook/vue3";
import { computed, ref, watch } from "vue"

const meta = {
  title: "Components/DataDisplay/Table",
  component: DuTable,
  tags: ['autodocs'],
  argTypes: {
    ...(() => {
      const { size, ...rest } = useSizeStoriesControl as ArgTypes;
      return rest;
    })(),
    size: {
      control: { type: 'select' },
      options: ['default', 'xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Taille du tableau',
    },
    columns: {
      control: "object",
      description:
        "Array of column definitions with key, label and optional customClass",
    },
    rows: {
      control: "object",
      description:
        "Array of row data objects with id and values corresponding to column keys",
    },
    zebra: {
      control: "boolean",
      description: "Apply zebra-striping to table rows",
    },
    pinRows: {
      control: "boolean",
      description: "Pin header and footer rows",
    },
    pinCols: {
      control: "boolean",
      description: "Pin first column",
    },
    customClass: {
      control: "text",
      description: "Custom class to apply to the table",
    },
    wrapperClass: { control: "text", description: "Class on the scroll container" },
    selectionMode: {
      control: { type: "select" },
      options: ["none", "single", "multiple"],
      description: "Row selection: checkboxes (multiple) or radios (single)",
    },
    sortMode: {
      control: { type: "select" },
      options: ["single", "multiple"],
      description: "Sort by one column, or stack several",
    },
    searchable: { control: "boolean", description: "Show a search field above the table" },
    pageSize: { control: "number", description: "Rows per page; leave empty to show every row" },
    manual: { control: "boolean", description: "Rows arrive searched, sorted and paged by the consumer" },
    loading: { control: "boolean", description: "Busy state; placeholder rows when there are no rows yet" },
    panel: { control: "boolean", description: "Bordered-panel look: separated toolbar and footer, tinted header, hovered rows, loading overlay" },
    sortRequired: { control: "boolean", description: "Clicks alternate ascending/descending; the sort is never cleared" },
    loadingOverlay: { control: "boolean", description: "Cover reloading rows with a spinner instead of dimming them" },
    emptyText: { control: "text", description: "Shown when there are no rows" },
    noResultsText: { control: "text", description: "Shown when a search matched nothing" },
  },
  args: {
    columns: [
      { key: "name", label: "Name" },
      { key: "job", label: "Job" },
      { key: "status", label: "Status" },
      { key: "action", label: "Action" },
    ],
    rows: [
      {
        id: 1,
        name: "Cy Ganderton",
        job: "Quality Control Specialist",
        status: "active",
      },
      {
        id: 2,
        name: "Hart Hagerty",
        job: "Desktop Support Technician",
        status: "inactive",
      },
      {
        id: 3,
        name: "Brice Swyre",
        job: "Tax Accountant",
        status: "active",
      },
    ],
    zebra: false,
    pinRows: false,
    pinCols: false,
    size: "default",
    customClass: "",
  },
} satisfies Meta<typeof DuTable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Zebra: Story = {
  args: {
    zebra: true,
  },
}

export const PinnedRows: Story = {
  args: {
    pinRows: true,
  },
  render: (args: any) => ({
    components: { DuTable },
    setup() {
      return { args }
    },
    template: `
                <DuTable v-bind="args" class="h-28"></DuTable>
        `,
  }),
}

/** Only `rowHeader` columns are pinned: they render as `<th scope="row">`. */
export const PinnedColumns: Story = {
  args: {
    pinCols: true,
    wrapperClass: "max-w-md",
    columns: [
      { key: "name", label: "Name", rowHeader: true },
      { key: "job", label: "Job" },
      { key: "status", label: "Status" },
      { key: "action", label: "Action" },
    ],
  },
}

export const CompactSize: Story = {
  args: {
    size: "xs",
  },
}

export const LargeSize: Story = {
  args: {
    size: "lg",
  },
}

export const WithFooter: Story = {
  args: {
    footer: true,
  },
}

const manualModeTplStr = `
<DuTable zebra size="md">
  <thead>
    <tr>
      <DuTableItem isHeader>Name</DuTableItem>
      <DuTableItem isHeader>Job</DuTableItem>
      <DuTableItem isHeader>Status</DuTableItem>
      <DuTableItem isHeader>Action</DuTableItem>
    </tr>
  </thead>
  <tbody>
    <tr>
      <DuTableItem>Cy Ganderton</DuTableItem>
      <DuTableItem>Quality Control Specialist</DuTableItem>
      <DuTableItem>
        <DuBadge variant="success" size="sm">active</DuBadge>
      </DuTableItem>
      <DuTableItem>
        <DuButton variant="primary" size="xs">View</DuButton>
      </DuTableItem>
    </tr>
    <tr>
      <DuTableItem>Hart Hagerty</DuTableItem>
      <DuTableItem>Desktop Support Technician</DuTableItem>
      <DuTableItem>
        <DuBadge variant="error" size="sm">inactive</DuBadge>
      </DuTableItem>
      <DuTableItem>
        <DuButton variant="primary" size="xs">View</DuButton>
      </DuTableItem>
    </tr>
    <tr>
      <DuTableItem>Brice Swyre</DuTableItem>
      <DuTableItem>Tax Accountant</DuTableItem>
      <DuTableItem>
        <DuBadge variant="success" size="sm">active</DuBadge>
      </DuTableItem>
      <DuTableItem>
        <DuButton variant="primary" size="xs">View</DuButton>
      </DuTableItem>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <DuTableItem colspan="4" customClass="text-right font-bold">
        Total Employees: 3
      </DuTableItem>
    </tr>
  </tfoot>
</DuTable>
`

export const ManualMode: Story = {
  render: (args: any) => ({
    components: { DuTable, DuTableItem, DuBadge, DuButton },
    setup() {
      return { args }
    },
    template: manualModeTplStr,
  }),
  parameters: {
    docs: {
      source: {
        code: manualModeTplStr,
        language: 'html',
      },
    },
  },
}

const complexTableTplStr = `
<DuTable zebra size="sm" customClass="border border-base-300">
  <thead>
    <tr>
      <DuTableItem isHeader customClass="bg-primary text-primary-content">Product</DuTableItem>
      <DuTableItem isHeader customClass="bg-primary text-primary-content">Category</DuTableItem>
      <DuTableItem isHeader customClass="bg-primary text-primary-content">Price</DuTableItem>
      <DuTableItem isHeader customClass="bg-primary text-primary-content">Stock</DuTableItem>
    </tr>
  </thead>
  <tbody>
    <tr>
      <DuTableItem>Smartphone XYZ</DuTableItem>
      <DuTableItem>Electronics</DuTableItem>
      <DuTableItem>$599</DuTableItem>
      <DuTableItem>
        <DuBadge variant="success" size="sm">In stock</DuBadge>
      </DuTableItem>
    </tr>
    <tr>
      <DuTableItem>Laptop ABC</DuTableItem>
      <DuTableItem>Electronics</DuTableItem>
      <DuTableItem>$1299</DuTableItem>
      <DuTableItem>
        <DuBadge variant="warning" size="sm">Limited stock</DuBadge>
      </DuTableItem>
    </tr>
    <tr>
      <DuTableItem>Headphones DEF</DuTableItem>
      <DuTableItem>Accessories</DuTableItem>
      <DuTableItem>$199</DuTableItem>
      <DuTableItem>
        <DuBadge variant="error" size="sm">Out of stock</DuBadge>
      </DuTableItem>
    </tr>
    <tr>
      <DuTableItem>Smartwatch GHI</DuTableItem>
      <DuTableItem>Accessories</DuTableItem>
      <DuTableItem>$299</DuTableItem>
      <DuTableItem>
        <DuBadge variant="success" size="sm">In stock</DuBadge>
      </DuTableItem>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <DuTableItem colspan="4" customClass="text-right">
        <div class="flex justify-between">
          <span>Updated: 06/01/2023</span>
          <span class="font-bold">Total products: 4</span>
        </div>
      </DuTableItem>
    </tr>
  </tfoot>
</DuTable>
`

export const ComplexTable: Story = {
  render: (args: any) => ({
    components: { DuTable, DuTableItem, DuBadge },
    setup() {
      return { args }
    },
    template: complexTableTplStr,
  }),
  parameters: {
    docs: {
      source: {
        code: complexTableTplStr,
        language: 'html',
      },
    },
  },
} 

// ---- rich table ----------------------------------------------------------

const people = [
  { id: 1, name: "Cy Ganderton", job: "Quality Control Specialist", city: "Canada", salary: 52000, status: "active" },
  { id: 2, name: "Hart Hagerty", job: "Desktop Support Technician", city: "United States", salary: 61000, status: "inactive" },
  { id: 3, name: "Brice Swyre", job: "Tax Accountant", city: "China", salary: 48000, status: "active" },
  { id: 4, name: "Marjy Ferencz", job: "Office Assistant I", city: "Russia", salary: 39000, status: "active" },
  { id: 5, name: "Yancy Tear", job: "Community Outreach Specialist", city: "Brazil", salary: 45000, status: "inactive" },
  { id: 6, name: "Irma Vasilik", job: "Editor", city: "Indonesia", salary: 57000, status: "active" },
  { id: 7, name: "Meghann Durtnal", job: "Staff Accountant IV", city: "Philippines", salary: 66000, status: "active" },
  { id: 8, name: "Sammy Seston", job: "Accountant I", city: "Indonesia", salary: 41000, status: "inactive" },
  { id: 9, name: "Lesya Tinham", job: "Safety Technician IV", city: "Philippines", salary: 59000, status: "active" },
  { id: 10, name: "Zaneta Tewkesbury", job: "VP Marketing", city: "Chad", salary: 98000, status: "active" },
  { id: 11, name: "Andy Tipple", job: "Librarian", city: "Mexico", salary: 43000, status: "inactive" },
  { id: 12, name: "Sophi Biles", job: "Recruiting Manager", city: "Brazil", salary: 72000, status: "active" },
]

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })

const richColumns = [
  { key: "name", label: "Name", sortable: true, rowHeader: true },
  { key: "job", label: "Job", sortable: true },
  { key: "city", label: "Country", sortable: true },
  { key: "salary", label: "Salary", sortable: true, align: "end", format: (value: unknown) => money.format(Number(value)) },
  { key: "status", label: "Status", searchable: false },
]

const richTplStr = `
<DuTable
  caption="Employees"
  :columns="columns"
  :rows="rows"
  v-model:sort="sort"
  v-model:selected="selected"
  v-model:expanded="expanded"
  v-model:search="search"
  v-model:page="page"
  selection-mode="multiple"
  searchable
  :page-size="5"
  zebra
  @row-click="(row) => (last = row.name)"
>
  <template #toolbar="{ selected, clearSelection }">
    <span v-if="selected.length" class="text-sm">
      {{ selected.length }} selected
      <button type="button" class="link" @click="clearSelection">clear</button>
    </span>
  </template>
  <template #cell-status="{ value }">
    <DuBadge :variant="value === 'active' ? 'success' : 'error'" size="sm">{{ value }}</DuBadge>
  </template>
  <template #expanded="{ row }">
    <p class="text-sm">{{ row.name }} works as <b>{{ row.job }}</b> in {{ row.city }}.</p>
  </template>
</DuTable>
<p class="mt-2 text-xs opacity-70">sort: {{ sort }} · selected: {{ selected }} · page: {{ page }} · last row clicked: {{ last }}</p>
`

/** Sorting, selection, expansion, search and paging together, every state bound with v-model. */
export const RichTable: Story = {
  render: () => ({
    components: { DuTable, DuBadge },
    setup() {
      return {
        columns: richColumns,
        rows: people,
        sort: ref([{ key: "salary", direction: "desc" }]),
        selected: ref([2]),
        expanded: ref([]),
        search: ref(""),
        page: ref(1),
        last: ref("—"),
      }
    },
    template: richTplStr,
  }),
  parameters: { docs: { source: { code: richTplStr, language: "html" } } },
}

/** Uncontrolled: no v-model at all, the table keeps its own state. */
export const SortableAndPaged: Story = {
  args: {
    caption: "Employees",
    columns: richColumns,
    rows: people,
    pageSize: 5,
    searchable: true,
  },
}

export const SingleSelection: Story = {
  args: {
    caption: "Pick one employee",
    columns: richColumns,
    rows: people.slice(0, 5),
    selectionMode: "single",
    isRowSelectable: (row: { status: string }) => row.status === "active",
  },
}

const serverTplStr = `
<DuTable
  caption="Employees (server-side)"
  :columns="columns"
  :rows="rows"
  :total="total"
  :page-size="4"
  :loading="loading"
  manual
  searchable
  v-model:sort="sort"
  v-model:search="search"
  v-model:page="page"
/>
`

/** \`manual\`: the table only emits; a fake server filters, sorts and pages with a delay. */
export const ServerSide: Story = {
  render: () => ({
    components: { DuTable },
    setup() {
      const sort = ref<{ key: string, direction: "asc" | "desc" }[]>([])
      const search = ref("")
      const page = ref(1)
      const loading = ref(false)
      const result = ref({ rows: people.slice(0, 4), total: people.length })
      let timer: ReturnType<typeof setTimeout> | undefined

      const fetchPage = () => {
        loading.value = true
        clearTimeout(timer)
        timer = setTimeout(() => {
          const q = search.value.toLowerCase()
          let rows = people.filter((p) => p.name.toLowerCase().includes(q) || p.job.toLowerCase().includes(q))
          const s = sort.value[0]
          if (s) {
            const key = s.key as keyof (typeof people)[number]
            rows = [...rows].sort((a, b) => (a[key] > b[key] ? 1 : -1) * (s.direction === "asc" ? 1 : -1))
          }
          result.value = { rows: rows.slice((page.value - 1) * 4, page.value * 4), total: rows.length }
          loading.value = false
        }, 600)
      }
      watch([sort, search, page], fetchPage, { deep: true })
      return {
        columns: richColumns,
        rows: computed(() => result.value.rows),
        total: computed(() => result.value.total),
        sort, search, page, loading,
      }
    },
    template: serverTplStr,
  }),
  parameters: { docs: { source: { code: serverTplStr, language: "html" } } },
}

export const Loading: Story = {
  args: {
    caption: "Employees",
    columns: richColumns,
    rows: [],
    loading: true,
    loadingRows: 4,
  },
}

export const Empty: Story = {
  args: {
    caption: "Employees",
    columns: richColumns,
    rows: [],
    emptyText: "No employee yet",
  },
}


/** The `panel` preset: everything the bordered-panel look needs, from theme tokens only. */
export const Panel: Story = {
  args: {
    caption: "Employees",
    hideCaption: true,
    columns: richColumns,
    rows: people,
    panel: true,
    searchable: true,
    pageSize: 5,
    pageSizeOptions: [5, 10, 25],
    sortRequired: true,
    sort: undefined,
  },
}

const panelFrTplStr = `
<DuTable
  v-model:sort="sort"
  v-model:page="page"
  v-model:page-size="pageSize"
  :columns="columns"
  :rows="result.rows"
  :total="result.total"
  :loading="loading"
  manual
  panel
  sort-required
  :page-size-options="[5, 10, 25]"
  page-size-label="par page"
  :range-text="(start, end, total) => start + '–' + end + ' sur ' + total"
  :pagination-props="{ ariaLabel: 'Pages des inscrits', previousAriaLabel: 'Page précédente', nextAriaLabel: 'Page suivante' }"
  :sort-announcement="(label, dir) => 'Trié par ' + label + ', ' + (dir === 'asc' ? 'croissant' : 'décroissant')"
  loading-text="Chargement…"
  empty-text="Aucun inscrit pour le moment."
  no-results-text="Aucun inscrit ne correspond à ces critères."
>
  <template #caption>Inscrits, triés par {{ columns.find((c) => c.key === sort[0]?.key)?.label }}</template>
  <template #toolbar>
    <DuLabel type="input" class="w-full lg:max-w-xs">
      <svg class="size-5 opacity-40" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.2-5.2M16 10.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0Z" />
      </svg>
      <DuInputField v-model="q" type="search" placeholder="Nom, rôle…" aria-label="Rechercher un inscrit" class="grow" />
    </DuLabel>
    <DuSelect v-model="status" :options="statuses" clearable placeholder="Statut" ariaLabel="Filtrer par statut" customClass="w-full sm:w-40" />
    <DuButton v-if="q || status" ghost size="sm" class="lg:ml-auto" @click="q = ''; status = null">Réinitialiser</DuButton>
  </template>
  <template #cell-status="{ value }">
    <DuBadge :variant="value === 'active' ? 'success' : 'warning'" size="sm" soft>{{ value }}</DuBadge>
  </template>
</DuTable>
`

/**
 * Recipe: a server-side table in the bordered-panel look, in French — the
 * state lives with the page (a URL, typically), the table only emits.
 */
export const PanelServerSideFr: Story = {
  name: "Panel — server-side (FR)",
  render: () => ({
    components: { DuTable, DuBadge, DuButton, DuLabel, DuInputField, DuSelect },
    setup() {
      const sort = ref([{ key: "name", direction: "asc" as const }])
      const page = ref(1)
      const pageSize = ref(5)
      const q = ref("")
      const status = ref<string | null>(null)
      const loading = ref(false)
      const result = ref({ rows: people.slice(0, 5), total: people.length })
      let timer: ReturnType<typeof setTimeout> | undefined

      // A filter change starts again from page 1, like a sort change does.
      watch([q, status], () => { page.value = 1 })
      watch([sort, page, pageSize, q, status], () => {
        loading.value = true
        clearTimeout(timer)
        timer = setTimeout(() => {
          const text = q.value.toLowerCase()
          let rows = people.filter((p) =>
            (!text || p.name.toLowerCase().includes(text) || p.job.toLowerCase().includes(text))
            && (!status.value || p.status === status.value))
          const s = sort.value[0]
          if (s) {
            const key = s.key as keyof (typeof people)[number]
            rows = [...rows].sort((a, b) => (a[key] > b[key] ? 1 : -1) * (s.direction === "asc" ? 1 : -1))
          }
          const size = pageSize.value
          result.value = { rows: rows.slice((page.value - 1) * size, page.value * size), total: rows.length }
          loading.value = false
        }, 500)
      }, { deep: true })

      return {
        columns: richColumns, statuses: ["active", "inactive"],
        sort, page, pageSize, q, status, loading, result,
      }
    },
    template: panelFrTplStr,
  }),
  parameters: { docs: { source: { code: panelFrTplStr, language: "html" } } },
}
