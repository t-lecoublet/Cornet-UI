import { type Variant } from "../../../composables/useVariantProps"
import { type Size } from "../../../composables/useSizeProps"

export interface DuTextAreaProps {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  variant?: Variant
  size?: Size
  ghost?: boolean
} 