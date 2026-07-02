import { ref, watch, type Ref } from 'vue'
import type { DuSearchEmit, DuSearchOption } from '../du-search.types'

interface SearchSelectionProps {
  modelValue?: any
  multiple?: boolean
  addOption?: boolean
  clearable?: boolean
}

/** Owns selected value(s) and the select/deselect/model-sync logic around them. */
export function useSearchSelection(
  props: SearchSelectionProps,
  emit: DuSearchEmit,
  open: Ref<boolean>,
  query: Ref<string>,
  isEditing: Ref<boolean>,
) {
  const selectedValues = ref<any[]>([])

  watch(
    () => props.modelValue,
    (val) => {
      if (props.multiple) {
        selectedValues.value = Array.isArray(val) ? [...val] : []
      } else {
        selectedValues.value = val ? [val] : []
      }
    },
    { immediate: true }
  )

  function isSelected(option: DuSearchOption) {
    if (props.multiple) {
      return selectedValues.value.some((v) => v.id === option.id && v.name === option.name)
    } else {
      const selected = selectedValues.value[0]
      return selected && selected.id === option.id && selected.name === option.name
    }
  }

  function updateModel() {
    if (props.multiple) {
      emit('update:modelValue', [...selectedValues.value])
    } else {
      emit('update:modelValue', selectedValues.value[0] ?? null)
    }
  }

  function selectValue(val: any) {
    const isNew = props.addOption && val.id === null
    if (props.multiple) {
      if (!selectedValues.value.find((v) => v.id === val.id && v.name === val.name)) {
        selectedValues.value.push(val)
        if (isNew) emit('add', val)
        else emit('select', val)
        updateModel()
      }
      query.value = ''
    } else {
      selectedValues.value = [val]
      if (isNew) emit('add', val)
      else emit('select', val)
      updateModel()
      open.value = false
      query.value = ''
      isEditing.value = false
    }
  }

  function deselectValue(val: DuSearchOption) {
    if (props.multiple) {
      const idx = selectedValues.value.findIndex((v) => v.id === val.id && v.name === val.name)
      if (idx > -1) {
        selectedValues.value.splice(idx, 1)
        emit('remove', val)
        updateModel()
      }
    } else {
      selectedValues.value = []
      updateModel()
      open.value = false
      query.value = ''
      isEditing.value = false
    }
  }

  function handleOptionClick(val: DuSearchOption) {
    if (isSelected(val) && (props.clearable || props.multiple)) {
      deselectValue(val)
    } else {
      selectValue(val)
    }
  }

  return { selectedValues, isSelected, updateModel, selectValue, handleOptionClick }
}
