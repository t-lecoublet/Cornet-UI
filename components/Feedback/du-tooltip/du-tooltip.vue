<script setup lang="ts">
import { computed, useSlots } from "vue";
import { useVariantMapping } from "../../../composables/useVariantProps";
import { type DuTooltipProps } from "./du-tooltip.types";

const slots = useSlots();

const props = withDefaults(
  defineProps<DuTooltipProps>(),
  {
    variant: "default",
    dataTip: undefined,
    open: false,
    position: "top",
    responsive: false,
  },
);

const openClass = computed(() => {
  return props.open ? "tooltip-open" : "";
});

const positionClass = computed(() => {
  switch (props.position) {
    case "top":
      return "tooltip-top";
    case "right":
      return "tooltip-right";
    case "bottom":
      return "tooltip-bottom";
    case "left":
      return "tooltip-left";
    default:
      return "";
  }
});

const responsiveClass = computed(() => {
  return props.responsive ? "lg:tooltip" : "tooltip";
});

const { colorClass } = useVariantMapping(props, "tooltip");
</script>

<template>
  <div
    :class="[responsiveClass, openClass, positionClass, colorClass]"
    :data-tip="dataTip"
  >
    <div class="tooltip-content" v-if="slots.content">
      <slot name="content"></slot>
    </div>
    <slot />
  </div>
</template> 