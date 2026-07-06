<script setup lang="ts">
import { inject, computed } from "vue";
import { type DuRatingItemProps, type DuRatingItemEmits } from "./du-rating.types";

const props = withDefaults(
  defineProps<DuRatingItemProps>(),
  {
    value: 0,
    checked: false,
    disabled: false,
    shape: "star-2",
    halfMask: undefined,
    customClass: "",
  },
);

const emit = defineEmits<DuRatingItemEmits>();

const ratingName = inject("ratingName", "");

const handleChange = () => {
  emit("change", props.value);
};

const shapeClass = computed(() => {
  switch (props.shape) {
    case "star":
      return "mask-star";
    case "star-2":
      return "mask-star-2";
    case "heart":
      return "mask-heart";
    case "circle":
      return "mask-circle";
    default:
      return "";
  }
});

const maskClass = computed(() => {
  const classes = ["mask", shapeClass.value, props.color];
  
  if (props.halfMask) {
    classes.push((props.halfMask == 1)?`mask-half-1`:`mask-half-2`);
  }
  
  if (props.customClass) {
    classes.push(props.customClass);
  }
  
  return classes;
});
</script>

<template>
  <input
    type="radio"
    :name="ratingName"
    :class="maskClass"
    :checked="checked"
    @click="handleChange"
    :disabled="disabled"
    :aria-label="`${value} star`"
  />
</template> 