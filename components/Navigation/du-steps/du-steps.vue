<script setup lang="ts">
import { computed } from "vue";
import { type DuStepsProps } from './du-steps.types';

const props = withDefaults(
  defineProps<DuStepsProps>(),
  {
    items: undefined,
    direction: "steps-horizontal",
    customClass: "",
    responsive: false,
    activeSteps: undefined,
    variant: "primary",
  },
);

const stepsClasses = computed(() => {
  const classes = ["steps", props.direction];

  if (props.customClass) {
    classes.push(props.customClass);
  }

  if (props.responsive) {
    classes.push("steps-vertical lg:steps-horizontal");
  }

  return classes;
});

const getStepClass = (index: number): string[] => {
  const classes = ["step"];

  const variantClass =
    props.variant === "default" ? "" : `step-${props.variant}`;

  if (props.activeSteps && props.activeSteps.includes(index)) {
    if (variantClass) classes.push(variantClass);
  }

  if (props.items && props.items[index] && props.items[index].active) {
    if (variantClass) classes.push(variantClass);
  }

  if (props.items && props.items[index] && props.items[index].customClass) {
    classes.push(props.items[index].customClass!);
  }

  return classes;
};
</script>

<template>
  <ul :class="stepsClasses">
    <!-- Dynamic items mode -->
    <template v-if="items">
      <li
        v-for="(item, index) in items"
        :key="index"
        :class="getStepClass(index)"
        :data-content="item.dataContent"
      >
        <slot :name="`step-${index}`" :item="item" :index="index">
          <slot name="step" :item="item" :index="index">
            <slot v-if="item.label">
              {{ item.label }}
            </slot>
            <slot
              v-if="$slots[`step-icon-${index}`]"
              :name="`step-icon-${index}`"
            ></slot>
            <span v-else-if="$slots['step-icon']" class="step-icon">
              <slot name="step-icon" :item="item" :index="index"></slot>
            </span>
          </slot>
        </slot>
      </li>
    </template>

    <!-- Manual mode -->
    <template v-else>
      <slot></slot>
    </template>
  </ul>
</template> 