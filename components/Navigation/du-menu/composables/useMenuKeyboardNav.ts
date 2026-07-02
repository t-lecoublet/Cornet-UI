import type { Ref } from 'vue'

const OPTION_SELECTOR = ':scope > li > [role="option"]'

/**
 * Arrow-key roving navigation between sibling `role="option"` items of the
 * nearest `role="listbox"` ancestor of the focused element.
 *
 * The axis (Left/Right vs Up/Down) is derived per-scope from that listbox's
 * own `menu-horizontal` class rather than a single global direction: nested
 * submenu `<ul role="listbox">`s never receive a direction class (they're
 * always rendered vertically, regardless of the root menu's direction), so a
 * horizontal root with dropdown submenus still gets correct Up/Down keys
 * inside those submenus.
 *
 * Only applies to items-array mode, since `role="option"` is exclusively
 * applied by du-menu-item.vue — manual-slot-mode menus (no `items` prop) get
 * no keyboard navigation from this composable.
 */
export function useMenuKeyboardNav(root: Ref<HTMLElement | null>) {
  function isHorizontalScope(scopeList: Element): boolean {
    return Array.from(scopeList.classList).some((c) => c.endsWith('menu-horizontal'))
  }

  function getScopeItems(scopeList: Element): HTMLElement[] {
    return Array.from(scopeList.querySelectorAll(OPTION_SELECTOR)) as HTMLElement[]
  }

  function onKeydown(event: KeyboardEvent) {
    if (!root.value) return
    const target = event.target as HTMLElement
    if (!target?.closest) return

    const scopeList = target.closest('ul[role="listbox"]')
    if (!scopeList) return

    const horizontal = isHorizontalScope(scopeList)
    const nextKey = horizontal ? 'ArrowRight' : 'ArrowDown'
    const prevKey = horizontal ? 'ArrowLeft' : 'ArrowUp'

    if (![nextKey, prevKey, 'Home', 'End'].includes(event.key)) return

    const items = getScopeItems(scopeList)
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
