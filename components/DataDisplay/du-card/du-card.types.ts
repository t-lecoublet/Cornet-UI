import { type Size } from '../../../composables/useSizeProps'

export const CARD_SIZES = [
  'card-xs',
  'card-sm',
  'card-md',
  'card-lg',
  'card-xl',
] as const

export const CARD_PROPERTIES = [
  'card-border',
  'card-dash',
  'card-side',
  'lg:card-side',
  'image-full',
] as const

export type DuCardSize = (typeof CARD_SIZES)[number]
export type DuCardProperty = (typeof CARD_PROPERTIES)[number]

export interface DuCardProps {
  size?: Size
  bordered?: boolean
  dash?: boolean
  side?: boolean
  imageFull?: boolean
  responsive?: boolean
  title?: string
}
