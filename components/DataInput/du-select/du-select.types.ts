import { type Size } from "../../../composables/useSizeProps"
import { type Variant } from "../../../composables/useVariantProps"

export const SELECT_VARIANTS = ['default', 'select-primary', 'select-secondary', 'select-accent', 'select-neutral', 'select-info', 'select-success', 'select-warning', 'select-error'] as const
export const SELECT_SIZES = ['default', 'select-xs', 'select-sm', 'select-md', 'select-lg', 'select-xl'] as const

// du-select.vue also sizes its own <input> (search box) via
// useSizeMapping(props, 'input'), but those literals otherwise only live in
// du-input-field.types.ts / du-search.types.ts, which DuSelect doesn't import.
export const SELECT_INPUT_SIZES = ['default', 'input-xs', 'input-sm', 'input-md', 'input-lg', 'input-xl'] as const
export type DuSelectInputSize = (typeof SELECT_INPUT_SIZES)[number]

// du-select.vue sizes its dropdown list via useSizeMapping(props, 'menu')
// (menu-xs..menu-xl), but those literals otherwise only live in du-menu.types.ts.
// In embedded mode Tailwind's scanner excludes a component's whole directory
// (including its .types.ts) when the app doesn't use it directly, so if DuMenu
// isn't imported anywhere, menu-{size} would never be generated even though
// DuSelect's dropdown needs it. This local copy keeps them scanned regardless.
export const SELECT_MENU_SIZES = ['menu-xs', 'menu-sm', 'menu-md', 'menu-lg', 'menu-xl'] as const

export type DuSelectVariant = (typeof SELECT_VARIANTS)[number]
export type DuSelectSize = (typeof SELECT_SIZES)[number]
export type DuSelectMenuSize = (typeof SELECT_MENU_SIZES)[number]

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