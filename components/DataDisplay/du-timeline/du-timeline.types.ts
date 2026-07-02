export const TIMELINE_DIRECTIONS = [
  'timeline-vertical',
  'timeline-horizontal',
] as const

export const TIMELINE_MODIFIERS = [
  'timeline-snap-icon',
  'timeline-box',
  'timeline-compact',
] as const

export type DuTimelineDirection = (typeof TIMELINE_DIRECTIONS)[number]
export type DuTimelineModifier = (typeof TIMELINE_MODIFIERS)[number]

export interface DuTimelineItemData {
  start?: string
  middle?: string
  end?: string
  customClass?: string
  valid?: boolean | undefined
  hrClass?: string
}

export interface DuTimelineProps {
  items?: DuTimelineItemData[]
  direction?: DuTimelineDirection
  modifier?: DuTimelineModifier
  customClass?: string
  responsive?: boolean
  validItems?: (boolean | undefined)[]
  hrClasses?: string[]
} 