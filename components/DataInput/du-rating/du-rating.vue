<script setup lang="ts">
import { computed, provide } from "vue";
import { useSizeMapping } from "../../../composables/useSizeProps";
import DuRatingItem from "./du-rating-item.vue";
import { type DuRatingProps, type DuRatingEmits } from "./du-rating.types";
import { useRatingValue } from "./composables/useRatingValue";

const props = withDefaults(
  defineProps<DuRatingProps>(),
  {
    modelValue: 0,
    items: undefined,
    count: 5,
    name: undefined,
    halfStar: false,
    clearable: false,
    disabled: false,
    shape: "star-2",
    color: "bg-secondary",
    customClass: "",
    size: "md"
  },
);

const emit = defineEmits<DuRatingEmits>();

const { internalValue, handleChange } = useRatingValue(props, emit);

const ratingName = computed(() => {
  return props.name || `rating-${Math.random().toString(36).substring(2, 9)}`;
});

provide("ratingName", ratingName.value);

const { sizeClass } = useSizeMapping(props, "rating");

const ratingClass = computed(() => {
  const classes = ["rating"];
  
  if (props.halfStar) {
    classes.push("rating-half");
  }
  
  if (sizeClass.value) {
    classes.push(sizeClass.value);
  }
  
  if (props.customClass) {
    classes.push(props.customClass);
  }
  
  return classes;
});

defineExpose({
  value: computed(() => internalValue.value),
});
</script>

<template>
  <!-- Dynamic items mode -->
  <div v-if="items && !$slots.default" :class="ratingClass">
    <template v-for="(item, index) in items" :key="index">
      <DuRatingItem
        :value="item.value"
        :checked="internalValue === item.value"
        :shape="shape"
        :color="color"
        :half-mask="(halfStar && index % 2 === 0) ? 1 : (halfStar && index % 2 === 1) ? 2 : undefined"
        :disabled="disabled"
        @change="handleChange"
      />
    </template>
  </div>

  <!-- Auto-generated mode -->
  <div v-else-if="count > 0 && !$slots.default" :class="ratingClass">
    <template v-for="i in count" :key="i">
      <DuRatingItem
        v-if="halfStar"
        :value="i - 0.5"
        :checked="internalValue === i - 0.5"
        :shape="shape"
        :color="color"
        :half-mask="1"
        :disabled="disabled"
        @change="handleChange"
      />

      <DuRatingItem
        :value="i"
        :checked="internalValue === i"
        :shape="shape"
        :color="color"
        :half-mask="halfStar ? 2 : undefined"
        :disabled="disabled"
        @change="handleChange"
      />
    </template>
  </div>

  <!-- Manual mode -->
  <div v-else :class="ratingClass">
    <slot></slot>
  </div>
</template> 