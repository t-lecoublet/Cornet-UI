<script setup lang="ts">
import { type DuRangeProps } from './du-range.types'
import { useVariantMapping } from "../../../composables/useVariantProps"
import { useSizeMapping } from "../../../composables/useSizeProps"
import { ref, computed, watch } from "vue"

const props = withDefaults(
  defineProps<DuRangeProps>(),
  {
    modelValue: 4,
    min: 0,
    max: 10,
    step: 1,
    disabled: false,
    variant: "default",
    size: "default",
  },
)

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void
  (e: "change", value: number): void
}>()

const internalValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newValue) => {
    internalValue.value = newValue
  },
)

const { colorClass } = useVariantMapping(props, "range")
const { sizeClass } = useSizeMapping(props, "range")

const handleInput = (event: Event) => {
  const value = Number((event.target as HTMLInputElement).value)
  internalValue.value = value
  emit("update:modelValue", value)
  emit("change", value)
}

defineExpose({
  value: computed(() => internalValue.value),
})
</script>

<template>
  <input
    type="range"
    :min="min"
    :max="max"
    :step="step"
    :disabled="disabled"
    :value="internalValue"
    @input="handleInput"
    :class="['range', colorClass, sizeClass]"
  />
</template> 