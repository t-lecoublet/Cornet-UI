<script setup lang="ts">
import { type DuTableItemProps } from './du-table-item.types'

withDefaults(
  defineProps<DuTableItemProps>(),
  {
    customClass: "",
    isHeader: false,
    scope: "col",
    colspan: undefined,
    rowspan: undefined,
  },
)
</script>

<template>
  <component
    :is="isHeader ? 'th' : 'td'"
    :class="customClass"
    :scope="isHeader ? scope : undefined"
    :colspan="colspan"
    :rowspan="rowspan"
  >
    <slot></slot>
  </component>
</template>
