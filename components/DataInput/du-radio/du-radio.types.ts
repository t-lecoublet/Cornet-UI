import { type Variant } from "../../../composables/useVariantProps"
import { type Size } from "../../../composables/useSizeProps"

export const RADIO_VARIANTS = ['default', 'radio-primary', 'radio-secondary', 'radio-accent', 'radio-neutral', 'radio-info', 'radio-success', 'radio-warning', 'radio-error'] as const
export const RADIO_SIZES = ['default', 'radio-xs', 'radio-sm', 'radio-md', 'radio-lg', 'radio-xl'] as const

export type DuRadioVariant = (typeof RADIO_VARIANTS)[number]
export type DuRadioSize = (typeof RADIO_SIZES)[number]

export interface DuRadioProps {
  checked?: boolean
  disabled?: boolean
  /**
   * Show the state without letting anyone change it. Unlike `disabled`, the
   * control keeps its full colour and stays focusable: a read-only value is
   * not a broken control. Native checkboxes/radios ignore the `readonly`
   * attribute, so the click (mouse or Space) is cancelled instead.
   */
  readonly?: boolean
  variant?: Variant
  size?: Size
} 