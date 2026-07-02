export type DuFabIconKind = 'component' | 'image' | 'html'

/** Resolves how a fab item/action icon (component, http image URL, or inline HTML string) should be rendered, and the default tooltip side. */
export function useFabIcon() {
  function resolveIconKind(icon: unknown): DuFabIconKind | null {
    if (typeof icon === 'object' || typeof icon === 'function') return 'component'
    if (typeof icon === 'string' && (icon.startsWith('http') || icon.startsWith('/'))) return 'image'
    if (typeof icon === 'string') return 'html'
    return null
  }

  function getTooltipPosition(position?: 'left' | 'top' | 'right' | 'bottom') {
    return position || 'left'
  }

  return { resolveIconKind, getTooltipPosition }
}
