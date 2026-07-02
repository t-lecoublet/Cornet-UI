import { type Size } from "../../../composables/useSizeProps"
import { type Variant } from "../../../composables/useVariantProps"

export const STATUS_SIZES = [
  'status-xs',
  'status-sm',
  'status-md',
  'status-lg',
  'status-xl',
] as const

export const STATUS_VARIANTS = [
  'status-primary',
  'status-secondary',
  'status-accent',
  'status-neutral',
  'status-info',
  'status-success',
  'status-warning',
  'status-error',
] as const

export type DuStatusSize = (typeof STATUS_SIZES)[number]
export type DuStatusVariant = (typeof STATUS_VARIANTS)[number]

export interface DuStatusProps {
  size?: Size
  variant?: Variant
  bounce?: boolean
  ping?: boolean
}
