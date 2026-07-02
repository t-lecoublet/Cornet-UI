import { onBeforeUnmount, onMounted, type Ref } from 'vue'

/** Wires document-level click-outside and focus-out/focus-in dismissal behavior. */
export function useSelectDismiss(
  root: Ref<HTMLElement | null>,
  open: Ref<boolean>,
  openDropdown: () => void,
  close: () => void,
) {
  function onClickOutside(e: Event) {
    if (!root.value) return
    if (!root.value.contains(e.target as Node)) close()
  }

  function onFocusOut(_e: FocusEvent) {
    setTimeout(() => {
      if (!root.value) return

      const activeElement = document.activeElement
      if (!activeElement || !root.value.contains(activeElement)) {
        close()
      }
    }, 0)
  }

  function onFocus(_e: FocusEvent) {
    if (!open.value) {
      openDropdown()
    }
  }

  onMounted(() => {
    document.addEventListener('click', onClickOutside)
    root.value?.addEventListener('focusout', onFocusOut)
  })
  onBeforeUnmount(() => {
    document.removeEventListener('click', onClickOutside)
    root.value?.removeEventListener('focusout', onFocusOut)
  })

  return { onFocus }
}
