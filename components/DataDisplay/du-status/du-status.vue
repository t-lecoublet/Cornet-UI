<script setup lang="ts">
import { useSizeMapping } from "../../../composables/useSizeProps"
import { useVariantMapping } from "../../../composables/useVariantProps"
import { computed } from "vue"
import { type DuStatusProps } from './du-status.types'

const props = withDefaults(
  defineProps<DuStatusProps>(),
  {
    size: "default",
    variant: "default",
    bounce: false,
    ping: false,
  },
)

const ariaLabel = computed(() => {
  switch (props.variant) {
    case "info":
    case "success":
    case "warning":
    case "error":
      return props.variant
    default:
      return "status"
  }
})

const { colorClass } = useVariantMapping(props, "status")
const { sizeClass } = useSizeMapping(props, "status")
</script>

<template>
  <div
    v-if="!ping"
    :aria-label="ariaLabel"
    :class="['status', sizeClass, colorClass, bounce && 'animate-bounce']"
  ></div>
  <div class="inline-grid *:[grid-area:1/1]" v-else>
    <div :class="['status', sizeClass, colorClass, 'animate-ping']"></div>
    <div :class="['status', sizeClass, colorClass]"></div>
  </div>
</template> 