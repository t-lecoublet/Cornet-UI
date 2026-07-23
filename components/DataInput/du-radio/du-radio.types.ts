import { type Variant } from "../../../composables/useVariantProps"
import { type Size } from "../../../composables/useSizeProps"

export const RADIO_VARIANTS = ['default', 'radio-primary', 'radio-secondary', 'radio-accent', 'radio-neutral', 'radio-info', 'radio-success', 'radio-warning', 'radio-error'] as const
export const RADIO_SIZES = ['default', 'radio-xs', 'radio-sm', 'radio-md', 'radio-lg', 'radio-xl'] as const

export type DuRadioVariant = (typeof RADIO_VARIANTS)[number]
export type DuRadioSize = (typeof RADIO_SIZES)[number]

export interface DuRadioProps {
  checked?: boolean
  disabled?: boolean
  variant?: Variant
  size?: Size
} 