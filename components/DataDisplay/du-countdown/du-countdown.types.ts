export const COUNTDOWN_FORMATS = [
  'days',
  'hours',
  'minutes',
  'seconds',
] as const

export type DuCountdownFormat = (typeof COUNTDOWN_FORMATS)[number]

export interface DuCountdownLabels {
  days?: string
  hours?: string
  minutes?: string
  seconds?: string
}

export interface DuCountdownProps {
  value?: number
  targetDate?: Date
  format?: DuCountdownFormat
  separator?: string
  customClass?: string
  autoStart?: boolean
}