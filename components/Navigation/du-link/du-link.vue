<script setup lang="ts">
import { computed } from "vue";
import { type DuLinkProps } from './du-link.types';
import { useVariantMapping } from "../../../composables/useVariantProps";

const props = withDefaults(
  defineProps<DuLinkProps>(),
  {
    variant: "default",
    onlyUnderlineOnHover: false,
    ghost: false,
  },
);
const { colorClass } = useVariantMapping(props, "link");
const hoverClass = computed(() => {
  return props.onlyUnderlineOnHover ? "link-hover" : "";
});
const ghostClass = computed(() => {
  return props.ghost ? "link-ghost" : "";
});
</script>

<template>
  <a :class="['link', colorClass, hoverClass, ghostClass]"><slot /></a>
</template> 