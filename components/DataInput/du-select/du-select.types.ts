import { type Size } from "../../../composables/useSizeProps"
import { type Variant } from "../../../composables/useVariantProps"

export const SELECT_VARIANTS = ['default', 'select-primary', 'select-secondary', 'select-accent', 'select-info', 'select-success', 'select-warning', 'select-error'] as const
export const SELECT_SIZES = ['default', 'select-xs', 'select-sm', 'select-md', 'select-lg', 'select-xl'] as const

export type DuSelectVariant = (typeof SELECT_VARIANTS)[number]
export type DuSelectSize = (typeof SELECT_SIZES)[number]

export type DuSelectEmit = {
  (e: 'update:modelValue', value: any): void
  (e: 'select', option: any): void
  (e: 'remove', option: any): void
  (e: 'open'): void
  (e: 'close'): void
}

export interface DuSelectProps {
  ghost?: boolean
  variant?: Variant
  size?: Size
  disabled?: boolean
  multiple?: boolean
  modelValue?: any
  placeholder?: string
  search?: boolean
  searchPlaceholder?: string
  searchNoResultsText?: string
  options?: any[]
  searchable?: boolean
  searchableInside?: boolean
  checkboxes?: boolean
  closeOnSelect?: boolean
  trackBy?: string
  labelBy?: string
  returnObject?: boolean
  clearable?: boolean
  removeItemLabel?: string
}