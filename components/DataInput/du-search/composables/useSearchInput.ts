import { computed, type ComputedRef, type Ref } from 'vue'
import type { DuSearchEmit, DuSearchOption } from '../du-search.types'

interface SearchInputProps {
  multiple?: boolean
  listValues: DuSearchOption[]
}

/** Owns the text-input value derivation and the raw keystroke parsing (incl. comma-separated multi-add). */
export function useSearchInput(
  props: SearchInputProps,
  emit: DuSearchEmit,
  selectedValues: Ref<any[]>,
  query: Ref<string>,
  isEditing: Ref<boolean>,
  labelField: ComputedRef<string>,
  open: Ref<boolean>,
  highlightedIndex: Ref<number>,
  updateModel: () => void,
) {
  const inputValue = computed(() => {
    if (props.multiple) {
      const selectedPart = selectedValues.value.map((v) => v[labelField.value]).join(', ')
      if (selectedPart && query.value) {
        return `${selectedPart}, ${query.value}`
      } else if (selectedPart) {
        return selectedPart
      } else {
        return query.value
      }
    }
    if (isEditing.value) {
      return query.value
    }
    return selectedValues.value[0]?.[labelField.value] || ''
  })

  function onInput(e: Event) {
    const val = (e.target as HTMLInputElement).value

    // In single mode, start editing as soon as the user types
    if (!props.multiple) {
      isEditing.value = true
    }

    if (props.multiple) {
      // Rebuild the selected-values part of the input
      const selectedPart = selectedValues.value.map((v) => v.name).join(', ')

      // Extract the query by stripping the selected-values part
      let newQuery = ''
      if (selectedPart && val.startsWith(selectedPart)) {
        // Strip the selected part plus the trailing comma and space
        const remainder = val.slice(selectedPart.length)
        if (remainder.startsWith(', ')) {
          newQuery = remainder.slice(2) // Strip ", "
        } else if (remainder === '') {
          newQuery = ''
        } else {
          // Editing right after the selected values
          newQuery = remainder
        }
      } else if (!selectedPart) {
        // No selected value, the whole input is the query
        newQuery = val
      }

      // A comma in the query adds a new value
      if (newQuery.includes(',')) {
        const parts = newQuery.split(',').map((p) => p.trim()).filter(Boolean)
        const lastPart = parts.pop()

        for (const part of parts) {
          const match = props.listValues.find(
            (o) => o.name.toLowerCase() === part.toLowerCase()
          )
          if (match && !selectedValues.value.some((v) => v.id === match.id)) {
            selectedValues.value.push(match)
            emit('select', match)
          }
        }
        updateModel()
        query.value = lastPart ?? ''
      } else {
        query.value = newQuery
      }
    } else {
      query.value = val
      // In single mode, an empty input clears the selection
      if (val === '') {
        selectedValues.value = []
        updateModel()
      }
    }

    emit('query', query.value)
    open.value = true
    highlightedIndex.value = 0
  }

  return { inputValue, onInput }
}
