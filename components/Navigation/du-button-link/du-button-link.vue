<script setup lang="ts">
import { computed } from "vue";
import { type DuButtonLinkProps } from './du-button-link.types';
import { useVariantMapping } from "../../../composables/useVariantProps";
import { useSizeMapping } from "../../../composables/useSizeProps";

const props = withDefaults(
  defineProps<DuButtonLinkProps>(),
  {
    size: "default",
    variant: "default",
    outline: false,
    soft: false,
    dash: false,
    active: false,
    ghost: false,
    link: false,
    wide: false,
    square: false,
    circle: false,
    block: false,
  },
);
const { sizeClass } = useSizeMapping(props, "btn");
const { colorClass } = useVariantMapping(props, "btn");
const softClass = computed(() => {
  return props.soft ? "btn-soft" : "";
});
const outlineClass = computed(() => {
  return props.outline ? "btn-outline" : "";
});
const dashClass = computed(() => {
  return props.dash ? "btn-dash" : "";
});
const activeClass = computed(() => {
  return props.active ? "btn-active" : "";
});
const ghostClass = computed(() => {
  return props.ghost ? "btn-ghost" : "";
});
const linkClass = computed(() => {
  return props.link ? "btn-link" : "";
});
const wideClass = computed(() => {
  return props.wide ? "btn-wide" : "";
});
const squareClass = computed(() => {
  return props.square ? "btn-square" : "";
});
const circleClass = computed(() => {
  return props.circle ? "btn-circle" : "";
});
const blockClass = computed(() => {
  return props.block ? "btn-block" : "";
});
</script>
<template>
  <a
    :class="[
      'btn',
      sizeClass,
      colorClass,
      softClass,
      outlineClass,
      dashClass,
      activeClass,
      ghostClass,
      linkClass,
      wideClass,
      squareClass,
      circleClass,
      blockClass,
    ]"
  >
    <slot></slot>
  </a>
</template> 