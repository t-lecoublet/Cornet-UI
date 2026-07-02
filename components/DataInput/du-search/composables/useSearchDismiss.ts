import { onBeforeUnmount, onMounted, type Ref } from 'vue'

/** Wires document-level click-outside and focus-out/focus-in dismissal behavior. */
export function useSearchDismiss(
  root: Ref<HTMLElement | null>,
  open: Ref<boolean>,
  onBlurCleanup: () => void,
) {
  function onClickOutside(e: MouseEvent) {
    if (!root.value) return
    if (!root.value.contains(e.target as Node)) {
      open.value = false
      onBlurCleanup()
    }
  }

  function onFocusOut(_e: FocusEvent) {
    setTimeout(() => {
      if (!root.value) return

      const activeElement = document.activeElement
      if (!activeElement || !root.value.contains(activeElement)) {
        open.value = false
        onBlurCleanup()
      }
    }, 0)
  }

  function onFocus(_e: FocusEvent) {
    if (!open.value) {
      open.value = true
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
