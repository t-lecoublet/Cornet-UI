<script setup lang="ts" generic="R extends DuTableRowBase = DuTableRow">
// WAI-ARIA APG: *sortable table* — a plain `<table>` with `scope`d headers,
// `aria-sort` on the sorted column, and each sort control a real `<button>`
// inside its header. Not a `grid`: a grid takes over the arrow keys, and a
// table of data with a few controls in it is navigated with Tab and a screen
// reader's table commands instead.
//
// State, paging and the ARIA prop bags live in `core/table`; this file owns
// the daisyUI markup and the slots.
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, useSlots, watch } from "vue"
import {
  TABLE_ALIGN_CLASSES,
  TABLE_PANEL_CLASSES,
  TABLE_PART_CLASSES,
  type DuTableColumn,
  type DuTableEmits,
  type DuTableProps,
  type DuTableRow,
  type DuTableRowBase,
} from './du-table.types'
import { nestedSize, useSizeMapping } from "../../../composables/useSizeProps"
import { useComponentId, isInsideControl } from "../../core/shared"
import { useTable } from "../../core/table"
import DuCheckbox from "../../DataInput/du-checkbox/du-checkbox.vue"
import DuRadio from "../../DataInput/du-radio/du-radio.vue"
import DuInputField from "../../DataInput/du-input-field/du-input-field.vue"
import DuPagination from "../../Navigation/du-pagination/du-pagination.vue"
import DuSkeleton from "../../Feedback/du-skeleton/du-skeleton.vue"
import DuLoading from "../../Feedback/du-loading/du-loading.vue"

const props = withDefaults(
  defineProps<DuTableProps<R>>(),
  {
    columns: undefined,
    rows: undefined,
    caption: undefined,
    hideCaption: false,
    zebra: false,
    pinRows: false,
    pinCols: false,
    size: "default",
    customClass: "",
    wrapperClass: "",
    rowClass: undefined,
    header: true,
    footer: false,
    panel: false,
    toolbarClass: undefined,
    headClass: undefined,
    footerClass: undefined,
    sort: undefined,
    sortMode: "single",
    sortRequired: false,
    sortAnnouncement: undefined,
    selectionMode: "none",
    selected: undefined,
    isRowSelectable: undefined,
    selectAllLabel: "Select all rows",
    selectRowLabel: "Select row",
    selectColumnLabel: "Selection",
    expanded: undefined,
    expandLabel: "Show details",
    expandColumnLabel: "Details",
    search: undefined,
    searchable: false,
    searchLabel: "Search",
    searchPlaceholder: "Search…",
    filter: undefined,
    page: undefined,
    pageSize: undefined,
    pageSizeOptions: undefined,
    pageSizeLabel: "Rows per page",
    paginationProps: undefined,
    total: undefined,
    rangeText: undefined,
    manual: false,
    loading: false,
    loadingOverlay: undefined,
    loadingRows: 5,
    loadingText: "Loading…",
    emptyText: "No data",
    noResultsText: "No results",
  },
)

const emit = defineEmits<DuTableEmits<R>>()
const slots = useSlots()

const id = useComponentId(undefined, "du-table")
const captionId = `${id}-caption`

const table = useTable<R>({
  id,
  rows: () => props.rows ?? [],
  columns: () => props.columns ?? [],
  manual: () => props.manual,
  total: () => props.total,
  pageSize: {
    value: () => props.pageSize,
    onChange: (value) => emit("update:pageSize", value),
    // Uncontrolled with a choice of sizes: start at the first one.
    fallback: props.pageSizeOptions?.[0],
  },
  sortMode: () => props.sortMode,
  allowUnsorted: () => !props.sortRequired,
  selectionMode: () => props.selectionMode,
  isRowSelectable: () => props.isRowSelectable,
  filter: () => props.filter,
  labels: {
    selectRow: () => props.selectRowLabel,
    expandRow: () => props.expandLabel,
    sortAnnouncement: () => props.sortAnnouncement,
  },
  sort: { value: () => props.sort, onChange: (value) => emit("update:sort", value) },
  selected: { value: () => props.selected, onChange: (value) => emit("update:selected", value) },
  page: { value: () => props.page, onChange: (value) => emit("update:page", value) },
  expanded: { value: () => props.expanded, onChange: (value) => emit("update:expanded", value) },
  search: { value: () => props.search, onChange: (value) => emit("update:search", value) },
})

// Top-level bindings so the template unwraps the refs.
const {
  search, page, pageSize, setPageSize, visibleRows, totalCount, pageCount, pageStart, isFiltering,
  selectAllState, selectableRows, announcement,
  valueOf, textOf, sortDirection, toggleSort, isSelected, isSelectable, toggleRow,
  toggleAll, clearSelection, isExpanded, toggleExpanded,
  headerCellProps, sortButtonProps, rowProps, rowHeaderId, detailId,
  selectControlProps, expandButtonProps,
} = table

/** Columns given: the table renders itself. Otherwise the default slot is the table body. */
const dynamic = computed(() => props.columns !== undefined)

const { sizeClass } = useSizeMapping(props, "table")

// Controls inside the table follow its size, one step down (§8).
const innerSize = computed(() => nestedSize(props.size))
const innerSizeProps = reactive({ get size() { return innerSize.value } })
const { sizeClass: buttonSizeClass } = useSizeMapping(innerSizeProps, "btn")
const { sizeClass: selectSizeClass } = useSizeMapping(innerSizeProps, "select")

/** The look of the parts around the `<table>`: the panel preset or the plain one, then the consumer's own. */
const parts = computed(() => (props.panel ? TABLE_PANEL_CLASSES : TABLE_PART_CLASSES))
const toolbarClassValue = computed(() => props.toolbarClass ?? parts.value.toolbar)
const headClassValue = computed(() => props.headClass ?? (parts.value.head || undefined))
const footerClassValue = computed(() => props.footerClass ?? parts.value.footer)
const overlay = computed(() => props.loadingOverlay ?? props.panel)

const tableClass = computed(() => [
  "table",
  sizeClass.value,
  props.zebra && "table-zebra",
  props.pinRows && "table-pin-rows",
  props.pinCols && "table-pin-cols",
  props.customClass,
])

const hasSelection = computed(() => props.selectionMode !== "none")
const expandable = computed(() => slots.expanded !== undefined)
const colspan = computed(
  () => (props.columns?.length ?? 0) + (hasSelection.value ? 1 : 0) + (expandable.value ? 1 : 0),
)
const radioName = `${id}-select`

const showSkeleton = computed(() => props.loading && visibleRows.value.length === 0)
const showOverlay = computed(() => props.loading && overlay.value && visibleRows.value.length > 0)
const showFooterBar = computed(() => pageSize.value > 0 && totalCount.value > 0)
const pageSizeId = `${id}-page-size`

function onPageSize(event: Event) {
  setPageSize(Number((event.target as HTMLSelectElement).value))
}

// The scroll container takes focus only when it actually scrolls. A region
// that nothing inside can focus has to be focusable to be scrollable by
// keyboard; one that does not scroll would just be a dead tab stop. The first
// render is never focusable — the server cannot measure, and both renders
// must agree.
const scroller = ref<HTMLElement | null>(null)
const overflowing = ref(false)
let observer: ResizeObserver | undefined

function measure() {
  const el = scroller.value
  overflowing.value = el !== null && (el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight)
}

onMounted(() => {
  measure()
  if (typeof ResizeObserver !== "undefined" && scroller.value) {
    observer = new ResizeObserver(measure)
    observer.observe(scroller.value)
    const tableEl = scroller.value.querySelector("table")
    if (tableEl) observer.observe(tableEl)
  }
})
onBeforeUnmount(() => observer?.disconnect())
// Rows and columns change the content size without resizing the container.
watch(() => [visibleRows.value.length, props.columns?.length], () => nextTick(measure))

const hasCaption = computed(() => Boolean(props.caption || slots.caption))

const rangeLabel = computed(() => {
  const total = totalCount.value
  const start = Math.min(pageStart.value + 1, total)
  const end = Math.min(pageStart.value + visibleRows.value.length, total)
  return props.rangeText ? props.rangeText(start, end, total) : `${start}–${end} of ${total}`
})

const alignClass = (column: DuTableColumn<R>) => (column.align ? TABLE_ALIGN_CLASSES[column.align] : undefined)

const cellClassFor = (column: DuTableColumn<R>, row: R) =>
  typeof column.cellClass === "function" ? column.cellClass(row) : column.cellClass

const rowClassFor = (row: R, index: number) =>
  typeof props.rowClass === "function" ? props.rowClass(row, index) : props.rowClass

function onSearch(value: unknown) {
  search.value = value === null || value === undefined ? "" : String(value)
}

function onRowClick(row: R, event: MouseEvent) {
  if (isInsideControl(event.target, event.currentTarget as Element)) {
    return
  }
  emit("row-click", row, event)
}

defineExpose({ toggleSort, toggleRow, toggleAll, clearSelection, toggleExpanded, setPageSize })
</script>

<template>
  <div :class="parts.root">
    <div
      v-if="dynamic && (searchable || $slots.toolbar)"
      :class="toolbarClassValue"
    >
      <DuInputField
        v-if="searchable"
        type="search"
        :model-value="search"
        :size="innerSize"
        :placeholder="searchPlaceholder"
        :aria-label="searchLabel"
        :aria-controls="id"
        class="w-full sm:w-64"
        @update:model-value="onSearch"
      />
      <slot
        name="toolbar"
        :search="search"
        :set-search="onSearch"
        :selected="table.selected.value"
        :clear-selection="clearSelection"
        :total="totalCount"
      ></slot>
    </div>

    <div class="relative flex min-h-0 flex-1 flex-col">
      <div
        ref="scroller"
        :class="['overflow-auto min-h-0 flex-1', wrapperClass]"
        :role="overflowing && hasCaption ? 'region' : undefined"
        :aria-labelledby="overflowing && hasCaption ? captionId : undefined"
        :tabindex="overflowing ? 0 : undefined"
      >
        <table :id="id" :class="tableClass" :aria-busy="loading || undefined">
          <caption
            v-if="caption || $slots.caption"
            :id="captionId"
            :class="hideCaption ? 'sr-only' : undefined"
          >
            <slot name="caption">{{ caption }}</slot>
          </caption>

          <template v-if="dynamic">
            <thead v-if="$slots.header || header" :class="headClassValue">
              <slot v-if="$slots.header" name="header"></slot>
              <tr v-else>
                <th v-if="hasSelection" scope="col" class="w-0">
                  <slot name="select-all" :state="selectAllState" :toggle="toggleAll">
                    <DuCheckbox
                      v-if="selectionMode === 'multiple'"
                      :model-value="selectAllState === 'all'"
                      :indeterminate="selectAllState === 'some'"
                      :disabled="selectableRows.length === 0"
                      :size="innerSize"
                      :aria-label="selectAllLabel"
                      @update:model-value="toggleAll"
                    />
                    <span v-else class="sr-only">{{ selectColumnLabel }}</span>
                  </slot>
                </th>
                <th v-if="expandable" scope="col" class="w-0">
                  <span class="sr-only">{{ expandColumnLabel }}</span>
                </th>
                <th
                  v-for="column in columns"
                  :key="column.key"
                  scope="col"
                  v-bind="headerCellProps(column)"
                  :class="[alignClass(column), column.customClass, column.headerClass]"
                  :style="column.width ? { width: column.width } : undefined"
                >
                  <button
                    v-if="column.sortable"
                    v-bind="sortButtonProps(column)"
                    class="group inline-flex items-center gap-1 cursor-pointer select-none rounded hover:text-base-content focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    <slot :name="`header-${column.key}`" :column="column" :direction="sortDirection(column.key)">
                      {{ column.label }}
                    </slot>
                    <span aria-hidden="true" class="inline-flex">
                      <slot name="sort-icon" :column="column" :direction="sortDirection(column.key)">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="size-[1.1em] group-data-[sort=none]:opacity-30"
                        >
                          <path v-if="sortDirection(column.key) === 'asc'" d="M7 14l5-5 5 5" />
                          <path v-else-if="sortDirection(column.key) === 'desc'" d="M7 10l5 5 5-5" />
                          <path v-else d="M7 15l5 5 5-5M7 9l5-5 5 5" />
                        </svg>
                      </slot>
                    </span>
                  </button>
                  <slot v-else :name="`header-${column.key}`" :column="column" :direction="null">
                    {{ column.label }}
                  </slot>
                </th>
              </tr>
            </thead>

            <tbody>
              <slot v-if="showSkeleton" name="loading" :colspan="colspan" :count="loadingRows">
                <tr v-for="n in loadingRows" :key="`loading-${n}`">
                  <td v-for="c in colspan" :key="c">
                    <DuSkeleton class="h-4 w-full" />
                  </td>
                </tr>
              </slot>

              <tr v-else-if="visibleRows.length === 0">
                <td :colspan="colspan" class="py-6 text-center opacity-70">
                  <slot name="empty" :searching="isFiltering">
                    {{ isFiltering ? noResultsText : emptyText }}
                  </slot>
                </td>
              </tr>

              <template v-else>
                <template v-for="(row, rowIndex) in visibleRows" :key="row.id">
                  <tr
                    v-bind="rowProps(row)"
                    :class="[parts.row, row.customClass, rowClassFor(row, rowIndex), loading && !overlay && 'opacity-50']"
                    @click="onRowClick(row, $event)"
                  >
                    <td v-if="hasSelection">
                      <slot
                        name="select"
                        :row="row"
                        :selected="isSelected(row)"
                        :selectable="isSelectable(row)"
                        :toggle="() => toggleRow(row)"
                        :control-props="selectControlProps(row)"
                      >
                        <DuCheckbox
                          v-if="selectionMode === 'multiple'"
                          v-bind="selectControlProps(row)"
                          :model-value="isSelected(row)"
                          :disabled="!isSelectable(row)"
                          :size="innerSize"
                          @update:model-value="toggleRow(row)"
                        />
                        <DuRadio
                          v-else
                          v-bind="selectControlProps(row)"
                          :name="radioName"
                          :checked="isSelected(row)"
                          :disabled="!isSelectable(row)"
                          :size="innerSize"
                          @change="toggleRow(row)"
                        />
                      </slot>
                    </td>
                    <td v-if="expandable">
                      <slot
                        name="expand-toggle"
                        :row="row"
                        :expanded="isExpanded(row)"
                        :toggle="() => toggleExpanded(row)"
                        :button-props="expandButtonProps(row)"
                      >
                        <button
                          v-bind="expandButtonProps(row)"
                          :class="['btn btn-ghost btn-square', buttonSizeClass]"
                        >
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            :class="['size-[1.1em] transition-transform', isExpanded(row) && 'rotate-90']"
                          >
                            <path d="M9 6l6 6-6 6" />
                          </svg>
                        </button>
                      </slot>
                    </td>
                    <component
                      :is="column.rowHeader ? 'th' : 'td'"
                      v-for="column in columns"
                      :id="column.rowHeader ? rowHeaderId(row) : undefined"
                      :key="column.key"
                      :scope="column.rowHeader ? 'row' : undefined"
                      :class="[alignClass(column), cellClassFor(column, row)]"
                    >
                      <slot
                        :name="`cell-${column.key}`"
                        :row="row"
                        :column="column"
                        :value="valueOf(row, column)"
                        :index="rowIndex"
                      >{{ textOf(row, column) }}</slot>
                    </component>
                  </tr>
                  <tr v-if="expandable && isExpanded(row)" :id="detailId(row)" data-detail>
                    <td :colspan="colspan">
                      <slot name="expanded" :row="row" :index="rowIndex"></slot>
                    </td>
                  </tr>
                </template>
              </template>
            </tbody>

            <tfoot v-if="$slots.footer || footer">
              <slot v-if="$slots.footer" name="footer"></slot>
              <tr v-else>
                <td v-if="hasSelection"></td>
                <td v-if="expandable"></td>
                <th
                  v-for="column in columns"
                  :key="column.key"
                  scope="col"
                  :class="[alignClass(column), column.customClass, column.headerClass]"
                >
                  <slot :name="`footer-${column.key}`" :column="column">
                    {{ column.label }}
                  </slot>
                </th>
              </tr>
            </tfoot>
          </template>

          <slot v-else></slot>
        </table>
      </div>
      <div
        v-if="showOverlay"
        class="absolute inset-0 z-10 flex items-center justify-center bg-base-100/60"
      >
        <slot name="loading-overlay">
          <DuLoading animation="spinner" size="lg" />
        </slot>
      </div>
    </div>

    <div v-if="dynamic && showFooterBar" :class="footerClassValue">
      <slot
        name="pagination"
        :page="page"
        :page-count="pageCount"
        :page-size="pageSize"
        :total="totalCount"
        :set-page="(value: number) => (page = value)"
        :set-page-size="setPageSize"
        :range-text="rangeLabel"
      >
        <div class="flex flex-wrap items-center gap-3 text-sm">
          <span class="opacity-70">{{ rangeLabel }}</span>
          <label v-if="pageSizeOptions?.length" :for="pageSizeId" class="flex items-center gap-2">
            <span class="opacity-70">{{ pageSizeLabel }}</span>
            <select
              :id="pageSizeId"
              :value="pageSize"
              :class="['select w-20', selectSizeClass]"
              @change="onPageSize"
            >
              <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}</option>
            </select>
          </label>
        </div>
        <DuPagination
          v-if="pageCount > 1"
          :size="innerSize"
          :max-pages="0"
          v-bind="paginationProps"
          v-model="page"
          :total="totalCount"
          :per-page="pageSize"
        />
      </slot>
    </div>

    <template v-if="dynamic">
      <div class="sr-only" aria-live="polite" aria-atomic="true">{{ announcement }}</div>
      <div class="sr-only" aria-live="polite">{{ loading ? loadingText : "" }}</div>
    </template>
  </div>
</template>
