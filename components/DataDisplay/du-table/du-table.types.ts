export const TABLE_SIZES = ['default', 'xs', 'sm', 'md', 'lg', 'xl'] as const
export type DuTableSize = (typeof TABLE_SIZES)[number]

// Tailwind-scan safelist: useSizeMapping(props, 'table') builds these prefixed
// literals at runtime (TABLE_SIZES above holds the bare prop values instead).
export const TABLE_SIZE_CLASSES = ['table-xs', 'table-sm', 'table-md', 'table-lg', 'table-xl'] as const
export type DuTableSizeClass = (typeof TABLE_SIZE_CLASSES)[number]

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