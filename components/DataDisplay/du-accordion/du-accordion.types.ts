export const ACCORDION_MODIFIERS = [
  'collapse-arrow',
  'collapse-plus',
  'collapse-open',
  'collapse-close',
] as const

export interface DuAccordionItemData {
  title?: string
  content?: string
  checked?: boolean
  customClass?: string
}

export type DuAccordionModifier = (typeof ACCORDION_MODIFIERS)[number] 