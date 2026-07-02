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
