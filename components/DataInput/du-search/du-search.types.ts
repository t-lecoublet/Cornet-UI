import { type Size } from "../../../composables/useSizeProps"
import { type Variant } from "../../../composables/useVariantProps"

export const SEARCH_VARIANTS = ['default', 'input-primary', 'input-secondary', 'input-accent', 'input-neutral', 'input-info', 'input-success', 'input-warning', 'input-error'] as const
export const SEARCH_SIZES = ['default', 'input-xs', 'input-sm', 'input-md', 'input-lg', 'input-xl'] as const

// du-search.vue sizes its dropdown list via useSizeMapping(subSizeProps, 'menu')
// (menu-xs..menu-xl), but those literals otherwise only live in du-menu.types.ts.
// In embedded mode Tailwind's scanner excludes a component's whole directory
// (including its .types.ts) when the app doesn't use it directly, so if DuMenu
// isn't imported anywhere, menu-{size} would never be generated even though
// DuSearch's dropdown needs it. This local copy keeps them scanned regardless.
export const SEARCH_MENU_SIZES = ['menu-xs', 'menu-sm', 'menu-md', 'menu-lg', 'menu-xl'] as const

export type DuSearchVariant = (typeof SEARCH_VARIANTS)[number]
export type DuSearchSize = (typeof SEARCH_SIZES)[number]
export type DuSearchMenuSize = (typeof SEARCH_MENU_SIZES)[number]

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