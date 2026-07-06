import { type Variant } from "../../../composables/useVariantProps"
import { type Size } from "../../../composables/useSizeProps"

export interface DuFileInputProps {
  disabled?: boolean
  variant?: Variant
  size?: Size
  ghost?: boolean
} 

export const FILEINPUT_SIZES = [
  'file-input-xs',
  'file-input-sm',
  'file-input-md',
  'file-input-lg',
  'file-input-xl',
] as const

export const FILEINPUT_VARIANTS = [
  'file-input-primary',
  'file-input-secondary',
  'file-input-accent',
  'file-input-neutral',
  'file-input-info',
  'file-input-success',
  'file-input-warning',
  'file-input-error',
] as const

