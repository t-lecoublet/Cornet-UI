import { type Size } from "../../../composables/useSizeProps"
import { type Variant } from "../../../composables/useVariantProps"

export const SEARCH_VARIANTS = ['default', 'input-primary', 'input-secondary', 'input-accent', 'input-info', 'input-success', 'input-warning', 'input-error'] as const
export const SEARCH_SIZES = ['default', 'input-xs', 'input-sm', 'input-md', 'input-lg', 'input-xl'] as const

export type SEARCHVariant = (typeof SEARCH_VARIANTS)[number]
export type SEARCHSize = (typeof SEARCH_SIZES)[number]

export interface SearchOption {
  id: any
  name: string
}

export interface SEARCHProps {
  modelValue?: any | any[]
  name: string
  id: string
  placeholder?: string
  listValues: SearchOption[]
  limit?: number
  addOption?: boolean
  autoCommit?: boolean
  type?: string
  required?: boolean
  pattern?: string
  multiple?: boolean
  size?: Size
  subSize?: Size
  variant?: Variant
  ghost?: boolean
  disabled?: boolean
  customClass?: string
}