<script setup lang="ts">
import { type DuListRowProps } from './du-list.types'

const props = defineProps<DuListRowProps>()
</script>

<template>
  <component :class="['list-row', props.class, (props.as == 'label') && 'cursor-pointer']" :is="props.as || 'li'">
      <slot></slot>
  </component>
</template> 