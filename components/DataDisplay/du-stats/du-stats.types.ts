import { type DuStatItem } from '../du-stat/du-stat.types'

export type DuStatsItem = DuStatItem

export interface DuStatsProps {
  items?: DuStatsItem[]
  vertical?: boolean
  shadow?: boolean
  dash?: boolean
}
