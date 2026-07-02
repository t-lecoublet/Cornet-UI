<script setup lang="ts">
import { computed } from "vue";
import { useVariantMapping } from "../../../composables/useVariantProps";
import { useSizeMapping } from "../../../composables/useSizeProps";
import { type DuLoadingProps } from "./du-loading.types";

const props = withDefaults(
  defineProps<DuLoadingProps>(),
  {
    animation: "spinner",
    size: "default",
    variant: "default",
  },
);

const animationClass = computed(() => {
  return {
    spinner: "loading-spinner",
    dots: "loading-dots",
    ring: "loading-ring",
    ball: "loading-ball",
    bars: "loading-bars",
    infinity: "loading-infinity",
  }[props.animation];
});

const { sizeClass } = useSizeMapping(props, "loading");
const { colorClass } = useVariantMapping(props, "text");
</script>

<template>
  <span :class="['loading', sizeClass, animationClass, colorClass]"></span>
</template> 