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