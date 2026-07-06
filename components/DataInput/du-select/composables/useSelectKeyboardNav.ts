import { nextTick, type ComputedRef, type Ref } from 'vue'

interface SelectKeyboardNavProps {
  multiple: boolean
}

/** Owns highlighted-index navigation and the keydown handler driving it. */
export function useSelectKeyboardNav(
  props: SelectKeyboardNavProps,
  root: Ref<HTMLElement | null>,
  listId: string,
  open: Ref<boolean>,
  highlightedIndex: Ref<number>,
  query: Ref<string>,
  filteredOptions: ComputedRef<any[]>,
  selectedValues: Ref<any[]>,
  openDropdown: () => void,
  close: () => void,
  toggleOption: (opt: any) => void,
  removeValue: (val: any) => void,
) {
  function scrollHighlightedIntoView() {
    nextTick(() => {
      const list = root.value?.querySelector(`#${listId}`)
      const active = list?.querySelectorAll('li')[highlightedIndex.value]
      if (active && active.scrollIntoView) active.scrollIntoView({ block: 'nearest' })
    })
  }

  function onKeydown(e: KeyboardEvent) {
    if (!open.value && ['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
      openDropdown()
      e.preventDefault()
      return
    }
    const len = filteredOptions.value.length
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
        toggleOption(filteredOptions.value[highlightedIndex.value])
      }
      e.preventDefault()
    } else if (e.key === 'Escape') {
      close()
      e.preventDefault()
    } else if (e.key === 'Backspace' && props.multiple && query.value === '') {
      const last = selectedValues.value[selectedValues.value.length - 1]
      if (last !== undefined) removeValue(last)
    }
  }

  return { onKeydown }
}
