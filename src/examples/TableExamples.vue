<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { DuBadge, DuButton, DuCard, DuInputField, DuLabel, DuSelect, DuTable, DuTableItem } from 'cornet-ui'
import type { DuTableColumn, DuTableRowKey, DuTableSort } from 'cornet-ui/types'

interface Employee {
  id: number
  name: string
  email: string
  team: { name: string }
  role: string
  salary: number
  startedAt: Date
  status: 'active' | 'on leave' | 'left'
}

const employees: Employee[] = [
  { id: 1, name: 'Ada Lovelace', email: 'ada@acme.dev', team: { name: 'Research' }, role: 'Lead engineer', salary: 98000, startedAt: new Date(2019, 2, 4), status: 'active' },
  { id: 2, name: 'Grace Hopper', email: 'grace@acme.dev', team: { name: 'Platform' }, role: 'Staff engineer', salary: 112000, startedAt: new Date(2017, 8, 12), status: 'active' },
  { id: 3, name: 'Alan Turing', email: 'alan@acme.dev', team: { name: 'Research' }, role: 'Scientist', salary: 104000, startedAt: new Date(2018, 0, 22), status: 'on leave' },
  { id: 4, name: 'Margaret Hamilton', email: 'margaret@acme.dev', team: { name: 'Platform' }, role: 'Engineering manager', salary: 125000, startedAt: new Date(2016, 5, 1), status: 'active' },
  { id: 5, name: 'Linus Torvalds', email: 'linus@acme.dev', team: { name: 'Kernel' }, role: 'Maintainer', salary: 99000, startedAt: new Date(2020, 10, 9), status: 'left' },
  { id: 6, name: 'Barbara Liskov', email: 'barbara@acme.dev', team: { name: 'Research' }, role: 'Principal engineer', salary: 131000, startedAt: new Date(2015, 3, 17), status: 'active' },
  { id: 7, name: 'Ken Thompson', email: 'ken@acme.dev', team: { name: 'Kernel' }, role: 'Engineer', salary: 88000, startedAt: new Date(2021, 6, 5), status: 'active' },
  { id: 8, name: 'Élodie Martin', email: 'elodie@acme.dev', team: { name: 'Design' }, role: 'Product designer', salary: 76000, startedAt: new Date(2022, 1, 14), status: 'active' },
  { id: 9, name: 'Dennis Ritchie', email: 'dennis@acme.dev', team: { name: 'Kernel' }, role: 'Engineer', salary: 91000, startedAt: new Date(2019, 9, 30), status: 'on leave' },
  { id: 10, name: 'Katherine Johnson', email: 'katherine@acme.dev', team: { name: 'Data' }, role: 'Data scientist', salary: 102000, startedAt: new Date(2018, 11, 3), status: 'active' },
  { id: 11, name: 'Tim Berners-Lee', email: 'tim@acme.dev', team: { name: 'Platform' }, role: 'Architect', salary: 118000, startedAt: new Date(2016, 7, 8), status: 'active' },
  { id: 12, name: 'Hedy Lamarr', email: 'hedy@acme.dev', team: { name: 'Design' }, role: 'Design lead', salary: 95000, startedAt: new Date(2020, 4, 19), status: 'left' },
]

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const day = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' })

const statusVariant = { active: 'success', 'on leave': 'warning', left: 'neutral' } as const

const columns: DuTableColumn<Employee>[] = [
  { key: 'name', label: 'Name', sortable: true, rowHeader: true },
  { key: 'team', label: 'Team', sortable: true, accessor: (row) => row.team.name },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'salary', label: 'Salary', sortable: true, align: 'end', format: (value) => money.format(Number(value)) },
  { key: 'startedAt', label: 'Started', sortable: true, format: (value) => day.format(value as Date) },
  { key: 'status', label: 'Status', searchable: false },
]

// ---- 1. Client-side: everything on, every state bound -------------------------

const sort = ref<DuTableSort[]>([{ key: 'salary', direction: 'desc' }])
const selected = ref<DuTableRowKey[]>([])
const expanded = ref<DuTableRowKey[]>([])
const search = ref('')
const page = ref(1)
const lastClicked = ref<string>('—')

const selectedNames = computed(() =>
  employees.filter((e) => selected.value.includes(e.id)).map((e) => e.name.split(' ')[0]),
)

// ---- 2. Server-side: the table only emits, a fake API answers -----------------

const PAGE_SIZE = 4
const serverSort = ref<DuTableSort[]>([])
const serverSearch = ref('')
const serverPage = ref(1)
const serverLoading = ref(false)
const serverResult = ref<{ rows: Employee[], total: number }>({ rows: [], total: 0 })
const requests = ref(0)

/** Stands in for `fetch('/api/employees?…')`: filters, sorts and pages after a delay. */
function fakeApi(query: { search: string, sort: DuTableSort[], page: number }) {
  return new Promise<{ rows: Employee[], total: number }>((resolve) => {
    setTimeout(() => {
      const q = query.search.trim().toLowerCase()
      let rows = employees.filter((e) => !q || e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q))
      const s = query.sort[0]
      if (s) {
        const value = (e: Employee) => (s.key === 'team' ? e.team.name : e[s.key as keyof Employee]) as string | number | Date
        rows = [...rows].sort((a, b) => (value(a) > value(b) ? 1 : value(a) < value(b) ? -1 : 0) * (s.direction === 'asc' ? 1 : -1))
      }
      resolve({ rows: rows.slice((query.page - 1) * PAGE_SIZE, query.page * PAGE_SIZE), total: rows.length })
    }, 700)
  })
}

let latest = 0
async function load() {
  const ticket = ++latest
  serverLoading.value = true
  requests.value += 1
  const result = await fakeApi({ search: serverSearch.value, sort: serverSort.value, page: serverPage.value })
  // An older answer arriving after a newer request is dropped.
  if (ticket === latest) {
    serverResult.value = result
    serverLoading.value = false
  }
}

watch([serverSort, serverSearch, serverPage], load, { deep: true, immediate: true })

// ---- 2b. The `panel` preset, in the style of the inscription app ---------------

interface Rider {
  id: number
  bib: number | null
  license: string | null
  lastName: string
  firstName: string
  club: string | null
  sex: 'M' | 'F'
  category: string | null
  birthDate: Date
}

const CLUBS = ['VC Bordeaux', 'UC Limoges', 'AC Poitiers', 'Team Pau', null]
const CATEGORIES = ['Cadet', 'Junior', 'Senior', 'Master 1', 'Master 2', null]
const FIRST = ['Léa', 'Hugo', 'Chloé', 'Lucas', 'Emma', 'Nathan', 'Inès', 'Théo', 'Manon', 'Louis', 'Jade', 'Arthur']
const LAST = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent']
const riders: Rider[] = Array.from({ length: 47 }, (_, i) => ({
  id: i + 1,
  bib: i % 9 === 4 ? null : 100 + i,
  license: i % 7 === 3 ? null : `${48 + (i % 3)}${String(10_000 + i * 37).padStart(6, '0')}`,
  lastName: LAST[i % LAST.length]!.toUpperCase(),
  firstName: FIRST[(i * 5) % FIRST.length]!,
  club: CLUBS[i % CLUBS.length]!,
  sex: i % 2 ? 'F' : 'M',
  category: CATEGORIES[(i * 3) % CATEGORIES.length]!,
  birthDate: new Date(1975 + (i % 30), i % 12, 1 + (i % 27)),
}))
const SEX_OPTIONS = [{ value: 'M', label: 'Homme' }, { value: 'F', label: 'Femme' }]
const SEX_LABELS: Record<string, string> = { M: 'Homme', F: 'Femme' }
const frDate = new Intl.DateTimeFormat('fr-FR')

const riderColumns: DuTableColumn<Rider>[] = [
  { key: 'bib', label: 'Dossard', sortable: true },
  { key: 'license', label: 'Licence', sortable: true },
  { key: 'lastName', label: 'Nom', sortable: true, rowHeader: true },
  { key: 'firstName', label: 'Prénom', sortable: true },
  { key: 'club', label: 'Club', sortable: true },
  { key: 'sex', label: 'Sexe', sortable: true },
  { key: 'category', label: 'Catégorie', sortable: true },
  { key: 'birthDate', label: 'Date de naissance', sortable: true },
  { key: 'actions', label: 'Actions', align: 'end' },
]

const panel = reactive({
  q: '',
  sex: null as string | null,
  club: null as string | null,
  sort: [{ key: 'bib', direction: 'asc' }] as DuTableSort[],
  page: 1,
  pageSize: 10,
  loading: false,
  result: { rows: [] as Rider[], total: 0 },
})
const panelFiltering = computed(() => !!(panel.q.trim() || panel.sex || panel.club))

let panelTicket = 0
function loadRiders() {
  const ticket = ++panelTicket
  panel.loading = true
  setTimeout(() => {
    if (ticket !== panelTicket) return
    const q = panel.q.trim().toLowerCase()
    let rows = riders.filter((r) =>
      (!q || [r.lastName, r.firstName, r.club, r.license, r.bib].some((v) => String(v ?? '').toLowerCase().includes(q)))
      && (!panel.sex || r.sex === panel.sex)
      && (!panel.club || r.club === panel.club))
    const s = panel.sort[0]!
    const value = (r: Rider) => r[s.key as keyof Rider]
    const dir = s.direction === 'asc' ? 1 : -1
    // Empty values last whatever the direction, as DuTable does client-side.
    rows = [...rows].sort((a, b) => {
      const [x, y] = [value(a), value(b)]
      if (x == null || y == null) return x == null ? (y == null ? 0 : 1) : -1
      return (x > y ? 1 : x < y ? -1 : 0) * dir
    })
    panel.result = { rows: rows.slice((panel.page - 1) * panel.pageSize, panel.page * panel.pageSize), total: rows.length }
    panel.loading = false
  }, 600)
}
// Any filter starts again from page 1; the table already does it for sort and page size.
watch(() => [panel.q, panel.sex, panel.club], () => { panel.page = 1 })
watch(() => [panel.q, panel.sex, panel.club, panel.sort, panel.page, panel.pageSize], loadRiders, { deep: true, immediate: true })

// ---- 3. Fully customised -------------------------------------------------------

const tasks = ref([
  { id: 'T-1', title: 'Write the release notes', owner: 'Ada', priority: 2, done: false },
  { id: 'T-2', title: 'Fix the flaky CI job', owner: 'Grace', priority: 1, done: false },
  { id: 'T-3', title: 'Review the table PR', owner: 'Alan', priority: 1, done: true },
  { id: 'T-4', title: 'Update the design tokens', owner: 'Élodie', priority: 3, done: false },
  { id: 'T-5', title: 'Plan the v1 freeze', owner: 'Margaret', priority: 2, done: false },
])
type Task = (typeof tasks.value)[number]

const taskColumns: DuTableColumn<Task>[] = [
  { key: 'title', label: 'Task', sortable: true, rowHeader: true, cellClass: (row) => (row.done ? 'line-through opacity-50' : undefined) },
  { key: 'owner', label: 'Owner', sortable: true, width: '8rem' },
  { key: 'priority', label: 'Priority', sortable: true, align: 'center', width: '7rem' },
  { key: 'actions', label: 'Actions', align: 'end', searchable: false },
]
const taskSelection = ref<DuTableRowKey[]>([])
const priorityLabel = ['', 'High', 'Medium', 'Low']
const priorityVariant = ['default', 'error', 'warning', 'info'] as const

function completeSelected() {
  for (const task of tasks.value) {
    if (taskSelection.value.includes(task.id)) task.done = true
  }
  taskSelection.value = []
}

function removeTask(id: string) {
  tasks.value = tasks.value.filter((task) => task.id !== id)
  taskSelection.value = taskSelection.value.filter((key) => key !== id)
}

// ---- 4. Loading / empty --------------------------------------------------------

const demoLoading = ref(true)
const demoRows = ref<Employee[]>([])
function reloadDemo() {
  demoLoading.value = true
  demoRows.value = []
  setTimeout(() => {
    demoRows.value = employees.slice(0, 3)
    demoLoading.value = false
  }, 1500)
}
reloadDemo()
</script>

<template>
  <div class="flex flex-col gap-6">
    <DuCard dash title="DuTable — client-side, everything on">
      <p class="text-base-content/70 mb-4">
        Sorting (click a header), multi-selection, expandable rows, search across columns (accent-insensitive:
        try <code>elo</code>), paging and row clicks. Every state is bound with <code>v-model</code>.
      </p>
      <DuTable
        v-model:sort="sort"
        v-model:selected="selected"
        v-model:expanded="expanded"
        v-model:search="search"
        v-model:page="page"
        caption="Employees"
        :columns="columns"
        :rows="employees"
        selection-mode="multiple"
        :is-row-selectable="(row) => row.status !== 'left'"
        searchable
        :page-size="5"
        zebra
        row-class="cursor-pointer"
        @row-click="(row) => (lastClicked = row.name)"
      >
        <template #toolbar="{ selected: keys, clearSelection }">
          <div v-if="keys.length" class="flex items-center gap-2 text-sm">
            <span>{{ keys.length }} selected</span>
            <DuButton size="xs" ghost @click="clearSelection">Clear</DuButton>
          </div>
        </template>
        <template #cell-name="{ row }">
          <div class="font-medium">{{ row.name }}</div>
          <div class="text-xs opacity-60">{{ row.email }}</div>
        </template>
        <template #cell-status="{ row }">
          <DuBadge :variant="statusVariant[row.status]" size="sm" soft>{{ row.status }}</DuBadge>
        </template>
        <template #expanded="{ row }">
          <div class="grid gap-1 py-2 text-sm sm:grid-cols-3">
            <span><b>Email:</b> {{ row.email }}</span>
            <span><b>Team:</b> {{ row.team.name }}</span>
            <span><b>With us since:</b> {{ day.format(row.startedAt) }}</span>
          </div>
        </template>
      </DuTable>
      <pre class="mt-4 overflow-x-auto rounded-box bg-base-200 p-3 text-xs">sort: {{ JSON.stringify(sort) }}
selected: {{ JSON.stringify(selected) }} ({{ selectedNames.join(', ') || 'none' }})
expanded: {{ JSON.stringify(expanded) }} · search: "{{ search }}" · page: {{ page }} · last row clicked: {{ lastClicked }}</pre>
    </DuCard>

    <DuCard dash title="DuTable — panel (inscription-app style)">
      <p class="text-base-content/70 mb-4">
        The <code>panel</code> preset with <code>manual</code> data: filters in the toolbar, a required sort,
        a rows-per-page choice, a spinner over the rows while reloading, and French labels everywhere.
      </p>
      <DuTable
        v-model:sort="panel.sort"
        v-model:page="panel.page"
        v-model:page-size="panel.pageSize"
        :columns="riderColumns"
        :rows="panel.result.rows"
        :total="panel.result.total"
        :loading="panel.loading"
        hide-caption
        manual
        panel
        sort-required
        :page-size-options="[10, 25, 50]"
        page-size-label="par page"
        :range-text="(start, end, total) => `${start}–${end} sur ${total}`"
        :pagination-props="{ ariaLabel: 'Pages des inscrits', previousAriaLabel: 'Page précédente', nextAriaLabel: 'Page suivante' }"
        :sort-announcement="(label, dir) => `Trié par ${label}, ${dir === 'asc' ? 'croissant' : 'décroissant'}`"
        loading-text="Chargement des inscriptions…"
      >
        <template #caption>Inscrits de la compétition, triés par {{ riderColumns.find((c) => c.key === panel.sort[0]?.key)?.label }}</template>
        <template #toolbar>
          <DuLabel type="input" class="w-full lg:max-w-xs">
            <svg class="size-5 shrink-0 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.2-5.2M16 10.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0Z" />
            </svg>
            <DuInputField v-model="panel.q" type="search" placeholder="Nom, club, licence, dossard…" aria-label="Rechercher un inscrit" class="grow" />
          </DuLabel>
          <div class="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
            <DuSelect v-model="panel.sex" :options="SEX_OPTIONS" clearable placeholder="Sexe" ariaLabel="Filtrer par sexe" customClass="w-full sm:w-36" />
            <DuSelect v-model="panel.club" :options="CLUBS.filter(Boolean)" clearable searchable noResultsText="Aucun club" placeholder="Club" ariaLabel="Filtrer par club" customClass="w-full sm:w-48" />
          </div>
          <DuButton v-if="panelFiltering" ghost size="sm" class="self-start lg:ml-auto lg:self-center" @click="Object.assign(panel, { q: '', sex: null, club: null })">
            Réinitialiser
          </DuButton>
        </template>
        <template #cell-bib="{ row }">
          <span v-if="row.bib" class="inline-flex min-w-10 justify-center rounded-selector bg-base-200 px-2 py-0.5 font-mono font-semibold tabular-nums">{{ row.bib }}</span>
          <span v-else class="text-base-content/40">—</span>
        </template>
        <template #cell-license="{ row }">
          <span class="font-mono text-sm text-base-content/80">{{ row.license ?? '—' }}</span>
        </template>
        <template #cell-lastName="{ row }">
          <span class="font-semibold">{{ row.lastName }}</span>
        </template>
        <template #cell-club="{ row }">{{ row.club ?? '—' }}</template>
        <template #cell-sex="{ row }">{{ SEX_LABELS[row.sex] }}</template>
        <template #cell-category="{ row }">
          <DuBadge v-if="row.category" soft size="sm">{{ row.category }}</DuBadge>
          <span v-else class="text-base-content/40">—</span>
        </template>
        <template #cell-birthDate="{ row }">
          <span class="whitespace-nowrap tabular-nums">{{ frDate.format(row.birthDate) }}</span>
        </template>
        <template #cell-actions>
          <div class="flex justify-end gap-2">
            <DuButton size="sm" soft>Modifier</DuButton>
            <DuButton size="sm" soft variant="error">Supprimer</DuButton>
          </div>
        </template>
        <template #empty>
          <span class="block p-6 text-base-content/60">
            {{ panelFiltering ? 'Aucun inscrit ne correspond à ces critères.' : 'Aucun inscrit pour le moment.' }}
          </span>
        </template>
      </DuTable>
    </DuCard>

    <DuCard dash title="DuTable — server-side (manual)">
      <p class="text-base-content/70 mb-4">
        With <code>manual</code> the table applies nothing: it emits sort, search and page, and a fake API
        (700&nbsp;ms) returns the rows and the <code>total</code>. Rows stay visible, dimmed, while reloading.
      </p>
      <DuTable
        v-model:sort="serverSort"
        v-model:search="serverSearch"
        v-model:page="serverPage"
        caption="Employees (from the server)"
        hide-caption
        :columns="columns"
        :rows="serverResult.rows"
        :total="serverResult.total"
        :page-size="PAGE_SIZE"
        :loading="serverLoading"
        manual
        searchable
        search-placeholder="Search name or role…"
      >
        <template #cell-status="{ row }">
          <DuBadge :variant="statusVariant[row.status]" size="sm" soft>{{ row.status }}</DuBadge>
        </template>
      </DuTable>
      <p class="mt-2 text-xs opacity-60">{{ requests }} request(s) sent</p>
    </DuCard>

    <DuCard dash title="DuTable — customised">
      <p class="text-base-content/70 mb-4">
        Toolbar with a bulk action, custom sort icon, header and cell slots, an action column, per-cell classes,
        a custom empty state and French labels.
      </p>
      <DuTable
        v-model:selected="taskSelection"
        caption="Tasks"
        hide-caption
        :columns="taskColumns"
        :rows="tasks"
        selection-mode="multiple"
        searchable
        size="sm"
        wrapper-class="rounded-box border border-base-300"
        search-label="Rechercher une tâche"
        search-placeholder="Rechercher…"
        select-all-label="Tout sélectionner"
        select-row-label="Sélectionner"
        empty-text="Aucune tâche"
        no-results-text="Aucun résultat"
        :sort-announcement="(label, direction) => direction ? `Trié par ${label}, ${direction === 'asc' ? 'croissant' : 'décroissant'}` : `Tri par ${label} retiré`"
        :row-class="(row) => (row.done ? 'bg-success/5' : undefined)"
      >
        <template #toolbar="{ selected: keys, total }">
          <span class="text-sm opacity-70">{{ total }} tâche(s)</span>
          <DuButton v-if="keys.length" size="sm" variant="primary" @click="completeSelected">
            Terminer {{ keys.length }} tâche(s)
          </DuButton>
        </template>
        <template #sort-icon="{ direction }">
          <span class="text-xs">{{ direction === 'asc' ? '▲' : direction === 'desc' ? '▼' : '⇅' }}</span>
        </template>
        <template #header-priority="{ column }">
          <span class="uppercase tracking-wide">{{ column.label }}</span>
        </template>
        <template #cell-priority="{ value }">
          <DuBadge :variant="priorityVariant[Number(value)]" size="xs">{{ priorityLabel[Number(value)] }}</DuBadge>
        </template>
        <template #cell-actions="{ row }">
          <DuButton size="xs" ghost variant="error" :aria-label="`Supprimer ${row.title}`" @click="removeTask(row.id)">
            Supprimer
          </DuButton>
        </template>
        <template #empty="{ searching }">
          <div class="py-4">
            <div class="text-2xl">{{ searching ? '🔍' : '🎉' }}</div>
            {{ searching ? 'Aucune tâche ne correspond.' : 'Plus rien à faire !' }}
          </div>
        </template>
      </DuTable>
    </DuCard>

    <div class="grid gap-6 md:grid-cols-2">
      <DuCard dash title="DuTable — loading & empty">
        <p class="text-base-content/70 mb-4">Placeholder rows while the first load runs, then the data.</p>
        <DuTable
          caption="Recent hires"
          hide-caption
          :columns="columns.slice(0, 3)"
          :rows="demoRows"
          :loading="demoLoading"
          :loading-rows="3"
          size="sm"
        />
        <DuButton class="mt-3 self-start" size="sm" :disabled="demoLoading" @click="reloadDemo">Reload</DuButton>
      </DuCard>

      <DuCard dash title="DuTable — manual markup">
        <p class="text-base-content/70 mb-4">No <code>columns</code>: write the table yourself with <code>DuTableItem</code>.</p>
        <DuTable zebra size="sm" caption="Teams" hide-caption>
          <thead>
            <tr>
              <DuTableItem is-header>Team</DuTableItem>
              <DuTableItem is-header custom-class="text-end">Headcount</DuTableItem>
            </tr>
          </thead>
          <tbody>
            <tr>
              <DuTableItem is-header scope="row">Research</DuTableItem>
              <DuTableItem custom-class="text-end">3</DuTableItem>
            </tr>
            <tr>
              <DuTableItem is-header scope="row">Platform</DuTableItem>
              <DuTableItem custom-class="text-end">3</DuTableItem>
            </tr>
            <tr>
              <DuTableItem is-header scope="row">Kernel</DuTableItem>
              <DuTableItem custom-class="text-end">3</DuTableItem>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <DuTableItem is-header scope="row">Total</DuTableItem>
              <DuTableItem custom-class="text-end">9</DuTableItem>
            </tr>
          </tfoot>
        </DuTable>
      </DuCard>
    </div>
  </div>
</template>
