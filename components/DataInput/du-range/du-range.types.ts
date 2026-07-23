import { type Variant } from "../../../composables/useVariantProps"
import { type Size } from "../../../composables/useSizeProps"

export const RANGE_VARIANTS = ['default', 'range-primary', 'range-secondary', 'range-accent', 'range-neutral', 'range-info', 'range-success', 'range-warning', 'range-error'] as const
export const RANGE_SIZES = ['default', 'range-xs', 'range-sm', 'range-md', 'range-lg', 'range-xl'] as const

export type DuRangeVariant = (typeof RANGE_VARIANTS)[number]
export type DuRangeSize = (typeof RANGE_SIZES)[number]

export interface DuRangeProps {
  modelValue?: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  variant?: Variant
  size?: Size
} 