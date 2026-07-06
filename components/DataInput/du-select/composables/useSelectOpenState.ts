import { nextTick, type Ref } from 'vue'
import type { DuSelectEmit } from '../du-select.types'

interface SelectOpenStateProps {
  searchable: boolean
  searchableInside: boolean
  multiple: boolean
}

/** Owns open/closed state and the transitions between them. */
export function useSelectOpenState(
  props: SelectOpenStateProps,
  emit: DuSelectEmit,
  open: Ref<boolean>,
  highlightedIndex: Ref<number>,
  searchInput: Ref<HTMLInputElement | null>,
  searchInputInside: Ref<HTMLInputElement | null>,
  resetQuery: () => void,
) {
  function focusSearchInputs() {
    if (searchInput.value) searchInput.value.focus()
    if (searchInputInside.value) searchInputInside.value.focus()
  }

  function openDropdown() {
    open.value = true
    emit('open')
    highlightedIndex.value = 0
    nextTick(() => {
      if (props.searchable && (props.searchableInside || props.multiple)) {
        focusSearchInputs()
      }
    })
  }

  function close() {
    open.value = false
    resetQuery()
    highlightedIndex.value = -1
    emit('close')
  }

  function toggle() {
    if (open.value) close()
    else openDropdown()
  }

  function focusToggle() {
    if (!open.value) openDropdown()
    else nextTick(focusSearchInputs)
  }

  return { openDropdown, close, toggle, focusToggle }
}
