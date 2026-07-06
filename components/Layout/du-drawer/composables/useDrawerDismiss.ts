import { onBeforeUnmount, onMounted, watch, type Ref } from 'vue'

/**
 * Closes the drawer on Escape while it's open, and moves focus into the
 * sidebar when it opens, restoring focus to whatever was focused before on
 * close. On breakpoints where a `*:drawer-open` class keeps the sidebar
 * visually pinned open regardless of `internalOpen`, Escape still flips the
 * underlying state (and its events) even though nothing changes visually.
 */
export function useDrawerDismiss(internalOpen: Ref<boolean>, sidebarRef: Ref<HTMLElement | null>) {
  let lastFocused: HTMLElement | null = null

  watch(internalOpen, (isOpen) => {
    if (isOpen) {
      lastFocused = document.activeElement as HTMLElement | null
      sidebarRef.value?.focus()
    } else {
      if (lastFocused && document.contains(lastFocused)) {
        lastFocused.focus()
      }
      lastFocused = null
    }
  })

  function onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && internalOpen.value) {
      internalOpen.value = false
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', onKeydown)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeydown)
  })
}
