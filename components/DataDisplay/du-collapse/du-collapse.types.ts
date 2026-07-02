export const COLLAPSE_MODIFIERS = [
  'collapse-arrow',
  'collapse-plus',
  'collapse-open',
  'collapse-close',
] as const

export interface DuCollapseItem {
  title?: string
  content?: string
  open?: boolean
  customClass?: string
}

export type DuCollapseModifier = (typeof COLLAPSE_MODIFIERS)[number] 