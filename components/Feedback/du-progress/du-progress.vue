<script setup lang="ts">
import { useVariantMapping } from "../../../composables/useVariantProps";
import { type DuProgressProps } from "./du-progress.types";

const props = withDefaults(
  defineProps<DuProgressProps>(),
  {
    variant: "default",
    value: 0,
    max: 100,
    indeterminate: false,
  },
);
const { colorClass } = useVariantMapping(props, "progress");
</script>

<template>
  <progress
    :class="['progress', 'w-56', colorClass]"
    :value="!indeterminate ? value : undefined"
    :max="!indeterminate ? max : undefined"
  ></progress>
</template> 