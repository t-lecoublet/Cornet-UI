import { type Size } from "../../../composables/useSizeProps"
import { type Variant } from "../../../composables/useVariantProps"

export const INPUTFIELD_VARIANTS = ['default', 'input-primary', 'input-secondary', 'input-accent', 'input-info', 'input-success', 'input-warning', 'input-error'] as const
export const INPUTFIELD_SIZES = ['default', 'input-xs', 'input-sm', 'input-md', 'input-lg', 'input-xl'] as const

export type DuInputFieldVariant = (typeof INPUTFIELD_VARIANTS)[number]
export type DuInputFieldSize = (typeof INPUTFIELD_SIZES)[number]

export type DuInputFieldType =
  | "text"
  | "password"
  | "email"
  | "number"
  | "date"
  | "datetime-local"
  | "week"
  | "month"
  | "tel"
  | "url"
  | "search"
  | "time"

export type DuInputFieldValidatorProps = {
  pattern?: string
  minlength?: number
  maxlength?: number
  title?: string
}

export type DuInputFieldProps = {
  type?: DuInputFieldType
  placeholder?: string
  size?: Size
  ghost?: boolean
  invalid?: boolean
  variant?: Variant
  disabled?: boolean
  suggestionName?: string
  suggestionList?: string[]
  required?: boolean
  class?: string
} & DuInputFieldValidatorProps 