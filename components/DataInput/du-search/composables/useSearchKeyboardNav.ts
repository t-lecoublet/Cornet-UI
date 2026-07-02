import { nextTick, type ComputedRef, type Ref } from 'vue'
import type { DuSearchEmit, DuSearchOption } from '../du-search.types'

interface SearchKeyboardNavProps {
  addOption?: boolean
  multiple?: boolean
}

/** Owns highlighted-index navigation and the keydown handler driving it. */
export function useSearchKeyboardNav(
  props: SearchKeyboardNavProps,
  emit: DuSearchEmit,
  root: Ref<HTMLElement | null>,
  listId: string,
  open: Ref<boolean>,
  highlightedIndex: Ref<number>,
  query: Ref<string>,
  isEditing: Ref<boolean>,
  selectedValues: Ref<any[]>,
  filteredValues: ComputedRef<DuSearchOption[]>,
  queryValue: ComputedRef<DuSearchOption | null>,
  selectValue: (val: any) => void,
  handleOptionClick: (val: DuSearchOption) => void,
  updateModel: () => void,
) {
  function scrollHighlightedIntoView() {
    nextTick(() => {
      const list = root.value?.querySelector(`#${listId}`)
      const active = list?.querySelectorAll('li')[highlightedIndex.value]
      if (active && 'scrollIntoView' in active) {
        ;(active as HTMLElement).scrollIntoView({ block: 'nearest' })
      }
    })
  }

  function onKeydown(e: KeyboardEvent) {
    const len =
      filteredValues.value.length + (props.addOption && queryValue.value ? 1 : 0)

    if (!open.value && ['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
      open.value = true
      e.preventDefault()
      return
    }

    if (e.key === 'ArrowDown') {
      highlightedIndex.value = (highlightedIndex.value + 1 + len) % len
      scrollHighlightedIntoView()
      e.preventDefault()
    } else if (e.key === 'ArrowUp') {
      highlightedIndex.value = (highlightedIndex.value - 1 + len) % len
      scrollHighlightedIntoView()
      e.preventDefault()
    } else if (e.key === 'Enter') {
      if (highlightedIndex.value >= 0 && highlightedIndex.value < len) {
        if (props.addOption && queryValue.value) {
          if (highlightedIndex.value === 0) {
            selectValue(queryValue.value)
          } else {
            const option = filteredValues.value[highlightedIndex.value - 1]
            if (option) handleOptionClick(option)
          }
        } else {
          const option = filteredValues.value[highlightedIndex.value]
          if (option) handleOptionClick(option)
        }
      }
      e.preventDefault()
    } else if (e.key === 'Escape') {
      open.value = false
      highlightedIndex.value = -1
      // In single mode, stop editing
      if (!props.multiple && isEditing.value) {
        // If the query is empty, keep the selection empty
        if (query.value === '') {
          selectedValues.value = []
          updateModel()
        }
        isEditing.value = false
        query.value = ''
      }
      e.preventDefault()
    } else if (e.key === 'Backspace' && props.multiple) {
      // Only remove a selected value when the query is empty
      if (query.value === '' && selectedValues.value.length > 0) {
        const removed = selectedValues.value.pop()
        emit('remove', removed)
        updateModel()
        e.preventDefault()
      }
    }
  }

  return { onKeydown, scrollHighlightedIntoView }
}
