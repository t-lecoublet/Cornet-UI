<script setup lang="ts">
import { type Size, useSizeMapping } from "../../../composables/useSizeProps"
import { type Variant, useVariantMapping } from "../../../composables/useVariantProps"
import { computed } from "vue"

// Définition des types pour les props
const props = withDefaults(
  defineProps<{
    size?: Size
    variant?: Variant
    bounce?: boolean
    ping?: boolean
  }>(),
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
const animateBounceClass = computed(() => {
  return props.bounce ? "animate-bounce" : ""
})
</script>

<template>
  <div
    v-if="!ping"
    :aria-label="ariaLabel"
    :class="['status', sizeClass, colorClass, animateBounceClass]"
  ></div>
  <div class="inline-grid *:[grid-area:1/1]" v-else>
    <div :class="['status', sizeClass, colorClass, 'animate-ping']"></div>
    <div :class="['status', sizeClass, colorClass]"></div>
  </div>
</template> 