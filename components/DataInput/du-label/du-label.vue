<script setup lang="ts">
import { computed, provide } from "vue"
import { type DuLabelProps } from "./du-label.types"

const props = defineProps<DuLabelProps>()

if (props.type == "input") {
  provide("isInInput", true)
}

if(props.type == "select") {
  provide("isInLabel", true)
}
const typeClass = computed(() => {
  switch (props.type) {
    case "select":
      return "input pr-0"
    default:
      return props.type
  }
})
</script>

<template>
  <label :class="[typeClass]">
    <slot />
  </label>
</template> 