export const AVATAR_SIZES = ['avatar-xs', 'avatar-sm', 'avatar-md', 'avatar-lg', 'avatar-xl'] as const
export const AVATAR_ROUNDED = [
  'rounded',
  'rounded-full',
  'rounded-xs',
  'rounded-sm',
  'rounded-md',
  'rounded-lg',
  'rounded-xl',
] as const

export const AVATAR_RING_COLORS = [
  'ring-primary',
  'ring-secondary',
  'ring-accent',
  'ring-neutral',
  'ring-info',
  'ring-success',
  'ring-warning',
  'ring-error',
] as const

export const AVATAR_COLORS = [
  'avatar-primary',
  'avatar-secondary',
  'avatar-accent',
  'avatar-neutral',
  'avatar-info',
  'avatar-success',
  'avatar-warning',
  'avatar-error',
]

export type DuAvatarRounded = 'default' | 'rounded' | 'full' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type DuAvatarMask = 'default' | 'heart' | 'squircle' | 'hexagon' | 'hexagon-2' | 'decagon' | 'pentagon' | 'diamond' | 'square' | 'circle' | 'parallelogram' | 'parallelogram-2' | 'star' | 'star-2'

export type DuAvatarSize = (typeof AVATAR_SIZES)[number]
export type DuAvatarRoundedClass = (typeof AVATAR_ROUNDED)[number]
export type DuAvatarRingColor = (typeof AVATAR_RING_COLORS)[number]
export type DuAvatarColor = (typeof AVATAR_COLORS)[number]

// Types pour les masques
export const AVATAR_MASK = [
  'mask-heart',
  'mask-squircle',
  'mask-hexagon',
  'mask-hexagon-2',
  'mask-decagon',
  'mask-pentagon',
  'mask-diamond',
  'mask-square',
  'mask-circle',
  'mask-parallelogram',
  'mask-parallelogram-2',
  'mask-star',
  'mask-star-2',
] as const

export type DuAvatarMaskClass = (typeof AVATAR_MASK)[number]
