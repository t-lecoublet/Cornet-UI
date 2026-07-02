<script setup lang="ts">
import { type DuTableItemProps } from './du-table-item.types'

withDefaults(
  defineProps<DuTableItemProps>(),
  {
    customClass: "",
    isHeader: false,
    colspan: undefined,
    rowspan: undefined,
  },
)
</script>

<template>
  <component
    :is="isHeader ? 'th' : 'td'"
    :class="customClass"
    :colspan="colspan"
    :rowspan="rowspan"
  >
    <slot></slot>
  </component>
</template> 