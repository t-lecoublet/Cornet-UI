import { type Size } from '../../../composables/useSizeProps'
import { type Variant } from '../../../composables/useVariantProps'

export const BADGE_SIZES = [
  'badge-xs',
  'badge-sm',
  'badge-md',
  'badge-lg',
  'badge-xl',
] as const

export const BADGE_VARIANTS = [
  'badge-primary',
  'badge-secondary',
  'badge-accent',
  'badge-neutral',
  'badge-info',
  'badge-success',
  'badge-warning',
  'badge-error',
] as const

export type DuBadgeSize = (typeof BADGE_SIZES)[number]
export type DuBadgeVariant = (typeof BADGE_VARIANTS)[number]

export interface DuBadgeProps {
  size?: Size
  variant?: Variant
  outline?: boolean
  dash?: boolean
  soft?: boolean
  ghost?: boolean
  icon?: boolean
}
