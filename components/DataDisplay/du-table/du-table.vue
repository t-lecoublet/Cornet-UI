<script setup lang="ts">
import { computed } from "vue"
import { type DuTableProps } from './du-table.types'
import { useSizeMapping } from "../../../composables/useSizeProps"

const props = withDefaults(
  defineProps<DuTableProps>(),
  {
    columns: undefined,
    rows: undefined,
    zebra: false,
    pinRows: false,
    pinCols: false,
    size: "default",
    customClass: "",
    header: true,
    footer: false,
  },
)


const { sizeClass } = useSizeMapping(props, "table")

const zebraClass = computed(() => {
  return props.zebra ? "table-zebra" : ""
})

const pinRowsClass = computed(() => {
  return props.pinRows ? "table-pin-rows" : ""
})

const pinColsClass = computed(() => {
  return props.pinCols ? "table-pin-cols" : ""
})

const customClassValue = computed(() => {
  return props.customClass || ""
})
</script>

<template>
  <div class="overflow-x-auto">
    <!-- Dynamic mode -->
    <table
      v-if="columns && rows"
      :class="[
        'table',
        sizeClass,
        zebraClass,
        pinRowsClass,
        pinColsClass,
        customClassValue,
      ]"
    >
      <thead v-if="$slots.header || header">
        <template v-if="$slots.header">
          <slot name="header"></slot>
        </template>
        <tr v-else>
          <th
            v-for="(column, index) in columns"
            :key="index"
            :class="column.customClass"
          >
            <slot :name="`header-${column.key}`" :column="column">
              {{ column.label }}
            </slot>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, rowIndex) in rows"
          :key="row.id"
          :class="row.customClass"
        >
          <td
            v-for="(column, colIndex) in columns"
            :key="`${rowIndex}-${colIndex}`"
          >
            <slot
              :name="`cell-${column.key}`"
              :row="row"
              :column="column"
              :value="row[column.key]"
            >
              {{ row[column.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
      <tfoot v-if="$slots.footer || footer">
        <template v-if="$slots.footer">
          <slot name="footer"></slot>
        </template>
        <tr v-else>
          <th
            v-for="(column, index) in columns"
            :key="index"
            :class="column.customClass"
          >
            <slot :name="`footer-${column.key}`" :column="column">
              {{ column.label }}
            </slot>
          </th>
        </tr>
      </tfoot>
    </table>

    <!-- Manual mode -->
    <table
      v-else
      :class="[
        'table',
        sizeClass,
        zebraClass,
        pinRowsClass,
        pinColsClass,
        customClassValue,
      ]"
    >
      <slot></slot>
    </table>
  </div>
</template> 