<script setup lang="ts">
import { useVariantMapping } from "../../../composables/useVariantProps";
import { AvailableSizes } from "../../../composables/useSizeProps";
import { type RadialProgressProps } from "./du-radial-progress.types";
import { computed } from "vue";

const props = withDefaults(
  defineProps<RadialProgressProps>(),
  {
    variant: "default",
    value: 0,
    size: undefined,
    thickness: undefined,
  },
);
const { colorClass } = useVariantMapping(props, "text");

const styleVar = computed(() => {
  const styleObject: any = {
    "--value": props.value?.toString() || "0",
  }
  // let styles = `--value: ${props.value};`;

  if (props.size && AvailableSizes.indexOf(props.size as any) === -1) {
    // styles += `--size: ${props.size};`;
    styleObject["--size"] = props.size;
  }

  if (props.thickness) {
    styleObject["--thickness"] = props.thickness;
  }

  return styleObject;
});
</script>

<template>
  <div
    :class="['radial-progress', colorClass, size]"
    :style="styleVar"
    :aria-valuenow="value"
    role="progressbar"
  >
    <slot> {{ value }}% </slot>
  </div>
</template>

<style scoped>
.radial-progress.xs {
  --size: 3rem;
}
.radial-progress.sm {
  --size: 5rem;
}
.radial-progress.md {
  --size: 7.5rem;
}
.radial-progress.lg {
  --size: 10rem;
}
.radial-progress.xl {
  --size: 12rem;
}
</style> 