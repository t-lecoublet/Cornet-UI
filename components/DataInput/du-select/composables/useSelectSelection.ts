import { computed, ref, watch } from 'vue'
import type { DuSelectEmit } from '../du-select.types'

interface SelectSelectionProps {
  modelValue?: any
  multiple: boolean
  returnObject: boolean
  clearable: boolean
  closeOnSelect: boolean
}

interface SelectOptionsAdapter {
  optionValue: (opt: any) => any
  optionFromValue: (v: any) => any
}

/** Owns selected value(s) and the toggle/remove/model-sync logic around them. */
export function useSelectSelection(
  props: SelectSelectionProps,
  emit: DuSelectEmit,
  adapter: SelectOptionsAdapter,
  close: () => void,
) {
  const selectedValues = ref<any[]>([])
  const selectedSingle = ref<any>(null)

  function syncFromModel() {
    if (props.multiple) {
      selectedValues.value = Array.isArray(props.modelValue)
        ? props.modelValue.map((v) => (v && typeof v === 'object' ? adapter.optionValue(v) : v))
        : []
    } else {
      selectedSingle.value =
        props.modelValue && typeof props.modelValue === 'object'
          ? adapter.optionValue(props.modelValue)
          : props.modelValue
    }
  }

  watch(() => props.modelValue, syncFromModel, { immediate: true })

  function isSelected(opt: any): boolean {
    const v = adapter.optionValue(opt)
    return props.multiple ? selectedValues.value.includes(v) : selectedSingle.value === v
  }

  function emitModelForMultiple() {
    const out = props.returnObject
      ? selectedValues.value.map((v) => adapter.optionFromValue(v))
      : [...selectedValues.value]
    emit('update:modelValue', out)
  }

  function emitModelForSingle(val: any) {
    emit('update:modelValue', props.returnObject ? adapter.optionFromValue(val) : val)
  }

  function toggleOption(opt: any) {
    const v = adapter.optionValue(opt)
    if (props.multiple) {
      const idx = selectedValues.value.indexOf(v)
      if (idx === -1) {
        selectedValues.value.push(v)
        emit('select', adapter.optionFromValue(v))
      } else {
        selectedValues.value.splice(idx, 1)
        emit('remove', adapter.optionFromValue(v))
      }
      emitModelForMultiple()
    } else {
      if (props.clearable && selectedSingle.value === v) {
        selectedSingle.value = null
        emit('update:modelValue', null)
        close()
      } else {
        selectedSingle.value = v
        emit('select', adapter.optionFromValue(v))
        emitModelForSingle(v)
        if (props.closeOnSelect) close()
      }
    }
  }

  function removeValue(val: any) {
    if (!props.multiple) return
    const idx = selectedValues.value.indexOf(val)
    if (idx > -1) {
      selectedValues.value.splice(idx, 1)
      emit('remove', adapter.optionFromValue(val))
      emitModelForMultiple()
    }
  }

  const selectedOption = computed(() => adapter.optionFromValue(selectedSingle.value))

  return { selectedValues, selectedOption, isSelected, toggleOption, removeValue }
}
