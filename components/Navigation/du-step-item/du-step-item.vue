<script setup lang="ts">
import { computed } from "vue";
import { type DuStepItemProps } from './du-step-item.types';
import { useVariantMapping } from "../../../composables/useVariantProps";

const props = withDefaults(
  defineProps<DuStepItemProps>(),
  {
    label: "",
    active: false,
    customClass: "",
    dataContent: undefined,
    variant: "primary",
  },
);

const { colorClass: variantClass } = useVariantMapping(props, "step");

const stepClass = computed(() => {
  const classes = ["step"];

  if (props.active && variantClass.value) {
    classes.push(variantClass.value);
  }

  if (props.customClass) {
    classes.push(props.customClass);
  }

  return classes;
});
</script>

<template>
  <li :class="stepClass" :data-content="dataContent">
    <slot name="step-icon" v-if="$slots['step-icon']">
      <span class="step-icon">
        <slot name="step-icon"></slot>
      </span>
    </slot>

    <slot>
      {{ label }}
    </slot>
  </li>
</template> 