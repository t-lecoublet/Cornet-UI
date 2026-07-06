<script setup lang="ts">
import { type DuListProps } from './du-list.types'

const props = defineProps<DuListProps>()
</script>

<template>
  <ul :class="['list', props.class]">
    <slot></slot>
  </ul>
</template> 