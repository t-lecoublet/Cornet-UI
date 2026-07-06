<script lang="ts" setup>
import { computed, provide } from "vue";
import { type DuJoinProps } from "./du-join.types";

const props = withDefaults(
  defineProps<DuJoinProps>(),
  {
    as: "div",
    direction: undefined,
  },
);

const directionClass = computed(() => {
  switch (props.direction) {
    case "horizontal":
      return "join-horizontal";
    case "vertical":
      return "join-vertical";
    default:
      return "";
  }
});

provide("isInJoin", true);
</script>

<template>
  <component :is="as" :class="['join', directionClass]">
    <slot></slot>
  </component>
</template> 