<script setup lang="ts">
import { useSizeMapping } from "../../../composables/useSizeProps"
import { type DuKbdProps } from './du-kbd.types'

const props = withDefaults(
  defineProps<DuKbdProps>(),
  {
    size: "default",
  },
)

const { sizeClass } = useSizeMapping(props, "kbd")
</script>

<template>
  <kbd :class="['kbd', sizeClass]">
    <slot></slot>
  </kbd>
</template> 