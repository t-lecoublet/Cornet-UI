export const TABLE_SIZES = ['default', 'xs', 'sm', 'md', 'lg', 'xl'] as const
export type DuTableSize = (typeof TABLE_SIZES)[number]

export interface DuTableColumn {
  key: string
  label: string
  customClass?: string
}

export interface DuTableRow {
  id: string | number
  [key: string]: any
  customClass?: string
}

export interface DuTableProps {
  columns?: DuTableColumn[]
  rows?: DuTableRow[]
  zebra?: boolean
  pinRows?: boolean
  pinCols?: boolean
  size?: DuTableSize
  customClass?: string
  header?: boolean
  footer?: boolean
} 