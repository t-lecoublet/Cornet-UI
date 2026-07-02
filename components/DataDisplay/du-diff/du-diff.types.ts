export const DIFF_ASPECT_RATIOS = [
  'aspect-16/9',
  'aspect-4/3',
  'aspect-1/1',
  'aspect-video',
  'aspect-square',
] as const

export type DuDiffAspectRatio = (typeof DIFF_ASPECT_RATIOS)[number] 