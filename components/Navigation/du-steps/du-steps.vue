<script setup lang="ts">
import { computed } from "vue";
import { type DuStepsProps } from './du-steps.types';
import { useVariantMapping } from "../../../composables/useVariantProps";

const props = withDefaults(
  defineProps<DuStepsProps>(),
  {
    items: undefined,
    direction: "steps-horizontal",
    customClass: "",
    responsive: false,
    activeSteps: undefined,
    variant: "primary",
    ariaLabel: undefined,
  },
);

/**
 * The step you are on: the furthest one marked active. Everything before it is
 * done, everything after is to come — `aria-current="step"` is what says which
 * of the three a step is, and only one may carry it.
 */
const currentStep = computed(() => {
  const marked = (props.items ?? [])
    .map((item, index) => (item.active === true ? index : -1))
    .filter((index) => index >= 0)
  const active = [...(props.activeSteps ?? []), ...marked]
  return active.length > 0 ? Math.max(...active) : -1
})

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

const { colorClass: variantClass } = useVariantMapping(props, "step");

const getStepClass = (index: number): string[] => {
  const classes = ["step"];

  if (props.activeSteps && props.activeSteps.includes(index)) {
    if (variantClass.value) classes.push(variantClass.value);
  }

  if (props.items && props.items[index] && props.items[index].active) {
    if (variantClass.value) classes.push(variantClass.value);
  }

  if (props.items && props.items[index] && props.items[index].customClass) {
    classes.push(props.items[index].customClass!);
  }

  return classes;
};
</script>

<template>
  <ul :class="stepsClasses" :aria-label="ariaLabel">
    <!-- Dynamic items mode -->
    <template v-if="items">
      <li
        v-for="(item, index) in items"
        :key="index"
        :class="getStepClass(index)"
        :data-content="item.dataContent"
        :aria-current="index === currentStep ? 'step' : undefined"
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