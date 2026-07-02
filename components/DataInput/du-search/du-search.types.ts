import { type Size } from "../../../composables/useSizeProps"
import { type Variant } from "../../../composables/useVariantProps"

export const SEARCH_VARIANTS = ['default', 'input-primary', 'input-secondary', 'input-accent', 'input-info', 'input-success', 'input-warning', 'input-error'] as const
export const SEARCH_SIZES = ['default', 'input-xs', 'input-sm', 'input-md', 'input-lg', 'input-xl'] as const

export type DuSearchVariant = (typeof SEARCH_VARIANTS)[number]
export type DuSearchSize = (typeof SEARCH_SIZES)[number]

export interface DuSearchOption {
  id: any
  name: string
  [key: string]: any
}

export type DuSearchEmit = {
  (e: 'update:modelValue', value: any): void
  (e: 'select', option: DuSearchOption): void
  (e: 'remove', option: DuSearchOption): void
  (e: 'add', option: DuSearchOption): void
  (e: 'query', query: string): void
}

export interface DuSearchProps {
  modelValue?: any | any[]
  name: string
  id: string
  placeholder?: string
  listValues: DuSearchOption[]
  limit?: number
  addOption?: boolean
  /** Label prefix shown before the query in the "add option" entry (default: 'Add') */
  addOptionText?: string
  /** Text shown when no option matches the query (default: 'No results') */
  noResultsText?: string
  autoCommit?: boolean
  /** Disables internal filtering — results come from an external search */
  remoteSearch?: boolean
  /** Option key used as the displayed label (default: 'name') */
  labelBy?: string
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
  clearable?: boolean
}