import { type Variant } from "../../../composables/useVariantProps"
import { type Size } from "../../../composables/useSizeProps"

// Tailwind-scan safelist: useSizeMapping/useVariantMapping(props, 'textarea')
// build these literals at runtime; keep them here so they're always scanned.
export const TEXTAREA_VARIANTS = ['default', 'textarea-primary', 'textarea-secondary', 'textarea-accent', 'textarea-neutral', 'textarea-info', 'textarea-success', 'textarea-warning', 'textarea-error'] as const
export const TEXTAREA_SIZES = ['default', 'textarea-xs', 'textarea-sm', 'textarea-md', 'textarea-lg', 'textarea-xl'] as const
export type DuTextAreaVariant = (typeof TEXTAREA_VARIANTS)[number]
export type DuTextAreaSize = (typeof TEXTAREA_SIZES)[number]

export interface DuTextAreaProps {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  variant?: Variant
  size?: Size
  ghost?: boolean
} 