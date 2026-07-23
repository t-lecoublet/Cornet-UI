import { type Variant } from "../../../composables/useVariantProps"
import { type Size } from "../../../composables/useSizeProps"

export const CHECKBOX_VARIANTS = ['default', 'checkbox-primary', 'checkbox-secondary', 'checkbox-accent', 'checkbox-neutral', 'checkbox-info', 'checkbox-success', 'checkbox-warning', 'checkbox-error'] as const
export const CHECKBOX_SIZES = ['default', 'checkbox-xs', 'checkbox-sm', 'checkbox-md', 'checkbox-lg', 'checkbox-xl'] as const

export type DuCheckboxVariant = (typeof CHECKBOX_VARIANTS)[number]
export type DuCheckboxSize = (typeof CHECKBOX_SIZES)[number]

export interface DuCheckboxProps {
  disabled?: boolean
  indeterminate?: boolean
  variant?: Variant
  size?: Size
}