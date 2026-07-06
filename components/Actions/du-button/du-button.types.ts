import { type Size } from '../../../composables/useSizeProps'
import { type Variant } from '../../../composables/useVariantProps'

export const BUTTON_SIZES = ['btn-xs', 'btn-sm', 'btn-md', 'btn-lg', 'btn-xl'] as const
export const BUTTON_COLORS = [
  'btn-primary',
  'btn-secondary',
  'btn-accent',
  'btn-neutral',
  'btn-info',
  'btn-success',
  'btn-warning',
  'btn-error',
] as const

export type DuButtonSize = (typeof BUTTON_SIZES)[number]
export type DuButtonColor = (typeof BUTTON_COLORS)[number]

export type DuButtonElementTag = 'button' | 'a' | 'input' | 'div' | 'RouterLink' | 'NuxtLink' | string

export interface DuButtonProps {
  customClass?: string
  size?: Size
  variant?: Variant
  outline?: boolean
  soft?: boolean
  dash?: boolean
  active?: boolean
  ghost?: boolean
  link?: boolean
  wide?: boolean
  disabled?: boolean
  square?: boolean
  circle?: boolean
  block?: boolean
  as?: DuButtonElementTag
  type?: string
  href?: string
  value?: string
  inputType?: 'button' | 'submit' | 'reset' | 'radio' | 'checkbox'
  label?: string
}
