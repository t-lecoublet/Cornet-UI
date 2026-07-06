export const TIMELINE_DIRECTIONS = [
  'timeline-vertical',
  'timeline-horizontal',
] as const

// Root-level layout modifiers only. `timeline-box` is NOT one of these in
// real DaisyUI: it applies per-box (.timeline-start/.timeline-end), not to
// the root <ul> — see the `boxed` prop/field below instead.
export const TIMELINE_MODIFIERS = [
  'timeline-snap-icon',
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
  /** Applies `timeline-box` to this item's start/end boxes, overriding the parent's `boxed` prop. */
  boxed?: boolean
}

export interface DuTimelineProps {
  items?: DuTimelineItemData[]
  direction?: DuTimelineDirection
  modifier?: DuTimelineModifier
  customClass?: string
  responsive?: boolean
  validItems?: (boolean | undefined)[]
  hrClasses?: string[]
  /** Default `timeline-box` styling for every item's start/end boxes (per-item `boxed` overrides this). */
  boxed?: boolean
}