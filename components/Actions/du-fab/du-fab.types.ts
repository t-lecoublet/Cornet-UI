import { type Size } from '../../../composables/useSizeProps'
import { type Variant } from '../../../composables/useVariantProps'

export const FAB_MODIFIERS = ['fab-flower'] as const

export type DuFabModifier = (typeof FAB_MODIFIERS)[number]

export interface DuFabItem {
  label?: string
  icon?: any
  customClass?: string
  onClick?: () => void
  tooltip?: string
  tooltipPosition?: 'left' | 'top' | 'right' | 'bottom'
  [key: string]: any
}

export interface DuFabMainAction {
  label?: string
  icon?: any
  customClass?: string
  variant?: string
  onClick?: () => void
}

export interface DuFabCloseButton {
  label?: string
  icon?: string
  customClass?: string
  variant?: string
}

export interface DuFabProps {
  items?: DuFabItem[]
  modifier?: DuFabModifier
  customClass?: string
  size?: Size
  variant?: Variant
  circle?: boolean
  mainAction?: DuFabMainAction
  closeButton?: DuFabCloseButton
  absolute?: boolean
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}
