import { type NativeErrorCode } from "../../core/shared"
import { type Size } from "../../../composables/useSizeProps"
import { type Variant } from "../../../composables/useVariantProps"

export const INPUTFIELD_VARIANTS = ['default', 'input-primary', 'input-secondary', 'input-accent', 'input-neutral', 'input-info', 'input-success', 'input-warning', 'input-error'] as const
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

/**
 * The `v-model` modifiers the field actually implements.
 *
 * Declared rather than left implicit because an unimplemented modifier is a
 * silent trap: Vue hands `modelModifiers` to the child whether or not it reads
 * them, so a `v-model.number` the component ignores looks like it works.
 */
export type DuInputFieldModelModifier = 'number'

/**
 * The types whose value is a structure rather than text.
 *
 * For these the browser hands back `''` to mean *nothing*, and `''` is never a
 * valid one of them — so it is an absence wearing a value's clothes, and it is
 * what makes a server reject an optional field the user simply left alone. An
 * empty text field, by contrast, really did receive an empty string; saying so
 * is not the same mistake.
 */
export const NULL_WHEN_EMPTY_TYPES = [
  'number',
  'date',
  'datetime-local',
  'time',
  'week',
  'month',
] as const satisfies readonly DuInputFieldType[]

export type DuInputFieldProps = {
  type?: DuInputFieldType
  /**
   * Override the browser's wording for a failed constraint, by code — the same
   * shape `DuSelect` and `DuSearch` take, so a form of mixed fields reads as
   * one thing.
   */
  errorMessages?: Partial<Record<NativeErrorCode, string>>
  placeholder?: string
  size?: Size
  ghost?: boolean
  invalid?: boolean
  /**
   * Turn the field green once it has been visited and holds a valid, non-empty
   * value. Off by default: a field that simply did its job rarely needs
   * applause, and an empty optional field is not an achievement.
   */
  showValid?: boolean
  variant?: Variant
  disabled?: boolean
  suggestionName?: string
  suggestionList?: string[]
  required?: boolean
  class?: string
} & DuInputFieldValidatorProps 