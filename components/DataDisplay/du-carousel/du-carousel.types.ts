export const CAROUSEL_POSITIONS = [
  'carousel-start',
  'carousel-center',
  'carousel-end',
] as const

export type DuCarouselPosition = (typeof CAROUSEL_POSITIONS)[number]

export interface DuCarouselItemData {
  id?: string
  src?: string
  alt?: string
  content?: string
  customClass?: string
} 