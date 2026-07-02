import { ref, watch } from 'vue'
import type { DuRatingEmits } from '../du-rating.types'

interface RatingValueProps {
  modelValue: number
  clearable?: boolean
  disabled?: boolean
}

/** Owns the selected rating value, kept in sync with `modelValue`, and the click-to-select/clear business rule. */
export function useRatingValue(props: RatingValueProps, emit: DuRatingEmits) {
  const internalValue = ref(props.modelValue)

  watch(
    () => props.modelValue,
    (newValue) => {
      internalValue.value = newValue
    },
  )

  const handleChange = (value: number) => {
    if (props.disabled) {
      return
    }
    if (value === internalValue.value && props.clearable) {
      internalValue.value = 0
      emit('update:modelValue', 0)
      emit('change', 0)
    } else {
      internalValue.value = value
      emit('update:modelValue', value)
      emit('change', value)
    }
  }

  return { internalValue, handleChange }
}
