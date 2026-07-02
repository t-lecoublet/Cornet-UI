import type { Ref } from 'vue'
import type { DuMenuDirection } from '../du-menu.types'

interface MenuKeyboardNavProps {
  direction: DuMenuDirection
}

const OPTION_SELECTOR = ':scope > li > [role="option"]'

/**
 * Arrow-key roving navigation between sibling `role="option"` items of the
 * nearest `role="listbox"` ancestor of the focused element. Nested submenus
 * (their own `role="listbox"`) are navigated independently, since each
 * keydown re-scopes to `event.target`'s closest listbox.
 */
export function useMenuKeyboardNav(root: Ref<HTMLElement | null>, props: MenuKeyboardNavProps) {
  const isHorizontal = () => props.direction === 'horizontal' || props.direction === 'responsive'

  function getScopeItems(target: HTMLElement): HTMLElement[] {
    const scopeList = target.closest('ul[role="listbox"]')
    if (!scopeList) return []
    return Array.from(scopeList.querySelectorAll(OPTION_SELECTOR)) as HTMLElement[]
  }

  function onKeydown(event: KeyboardEvent) {
    if (!root.value) return
    const target = event.target as HTMLElement
    if (!target?.closest) return

    const nextKey = isHorizontal() ? 'ArrowRight' : 'ArrowDown'
    const prevKey = isHorizontal() ? 'ArrowLeft' : 'ArrowUp'

    if (![nextKey, prevKey, 'Home', 'End'].includes(event.key)) return

    const items = getScopeItems(target)
    if (items.length === 0) return

    const currentIndex = items.indexOf(target)
    let nextIndex = currentIndex

    if (event.key === nextKey) {
      nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % items.length
    } else if (event.key === prevKey) {
      nextIndex = currentIndex < 0 ? items.length - 1 : (currentIndex - 1 + items.length) % items.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = items.length - 1
    }

    event.preventDefault()
    items[nextIndex]?.focus()
  }

  return { onKeydown }
}
