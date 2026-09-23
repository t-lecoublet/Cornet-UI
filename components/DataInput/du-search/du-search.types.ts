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

// The chips inside du-search.vue (badge) and their remove button (btn) are
// sized from the component's own size via `nestedSize`. Their literals live in
// DuBadge and DuButton, which DuSearch doesn't import, so the same
// embedded-mode scan gap applies: these local copies keep them generated.
export const SEARCH_CHIP_SIZES = ['badge-xs', 'badge-sm', 'badge-md', 'badge-lg', 'badge-xl'] as const
export const SEARCH_NESTED_BUTTON_SIZES = ['btn-xs', 'btn-sm', 'btn-md', 'btn-lg', 'btn-xl'] as const

export type DuSearchVariant = (typeof SEARCH_VARIANTS)[number]
export type DuSearchSize = (typeof SEARCH_SIZES)[number]
export type DuSearchMenuSize = (typeof SEARCH_MENU_SIZES)[number]

/** Validation failures reported by the component. */
export type DuSearchErrorCode = 'required' | 'minlength' | 'maxlength'

/** How a query still in the field is resolved when the dropdown closes (single only). */
export type DuSearchCommitMode = 'none' | 'match' | 'auto'

// The two type parameters default to `any`, not `unknown`, and that is
// deliberate. `O` and `V` are inferred from `options` and the v-model at every
// real call site; the default only applies when the type is named bare
// (`const props: DuSearchProps = …`) or when the component is used with no
// options at all. `unknown` there would type every callback parameter
// `unknown` and force a cast in consumer code for no safety gained — nothing
// inside the component ever reads a field off `O`.
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type DuSearchEmit<O = any, V = any> = {
  (e: 'update:modelValue', value: V | V[] | null): void
  (e: 'select', option: O): void
  (e: 'remove', option: O): void
  (e: 'add', option: O): void
  (e: 'query', query: string): void
  (e: 'open'): void
  (e: 'close'): void
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any -- see the note above `DuSearchEmit`. */
export interface DuSearchProps<O = any, V = any> {
  /** v-model. Whole options by default (`returnObject`), an array in `multiple` mode. */
  modelValue?: V | V[] | null
  options?: O[]
  multiple?: boolean
  disabled?: boolean
  /** Focusable and readable, but cannot open or change. */
  readonly?: boolean
  /** Requires a selection (validation only — no native form constraint). */
  required?: boolean
  /** Multiple: minimum number of selected options (validation). */
  minSelected?: number
  /** Multiple: maximum number of selected options. Blocks selecting more. */
  maxSelected?: number
  /** Override the default validation messages. */
  errorMessages?: Partial<Record<DuSearchErrorCode, string>>
  /** Object key identifying an option. Falls back to `value`, then `id`, then the option itself. */
  trackBy?: string
  /** Object key displayed for an option. Falls back to `label`, then `name`, then `String(option)`. */
  labelBy?: string
  /** Full control over the value stored in the model. Takes precedence over `trackBy` and `returnObject`. */
  optionValue?: (option: O) => V
  /** Full control over the displayed label. Takes precedence over `labelBy`. */
  optionLabel?: (option: O) => string
  /** Custom filter. Defaults to a case-insensitive substring match on the label. */
  optionFilter?: (option: O, query: string) => boolean
  /** Options that cannot be picked. Defaults to `option.disabled === true`. */
  optionDisabled?: (option: O) => boolean
  /** Emit whole options (default) instead of their `trackBy` value. */
  returnObject?: boolean
  /** Offer an "Add «query»" entry when nothing matches exactly. */
  creatable?: boolean
  /** Prefix of the creatable entry (default: 'Add'). */
  createOptionText?: string
  /** Builds the option to create from the query. Defaults to `{ [trackBy]: null, [labelBy]: query }`. */
  createOption?: (query: string) => O
  /** What to do with a query still in the field when the dropdown closes. */
  commitOnClose?: DuSearchCommitMode
  /** Skip local filtering — `options` already are the search result (listen to `query`). */
  externalFilter?: boolean
  /** Cap how many results are shown. */
  resultsLimit?: number
  /** Close after selecting. `null` (default) means `true` for single, `false` for multiple. */
  closeOnSelect?: boolean | null
  closeOnClickOutside?: boolean
  /** Tab selects the highlighted option before leaving the field. */
  selectOnTab?: boolean
  /** Single: picking the selected option again clears it. Also shows a ✕ on the selected row. */
  clearable?: boolean
  placeholder?: string
  /** Shown when no option matches the query (default: 'No results'). */
  noResultsText?: string
  /** Base id for the ARIA wiring. Auto-generated when omitted. */
  id?: string
  /** Render the dropdown in the top layer (Popover API), immune to `overflow: hidden` parents. */
  popover?: boolean
  /** Accessible name of the field, when no visible label names it. */
  ariaLabel?: string
  /** id of the element that names the field. */
  ariaLabelledby?: string
  /** Accessible label of a chip's remove button (multiple). */
  removeItemLabel?: string
  /** Native input attributes. */
  name?: string
  type?: string
  pattern?: string
  /** Value of the input's `autocomplete` attribute (default: `'off'`). */
  autocomplete?: string
  /**
   * Extra attributes set on the inner `<input>`, applied last so they win over
   * everything the component sets itself. The component's root is a wrapper, so
   * fallthrough attributes land there instead — this is the way in.
   *
   * Password managers ignore `autocomplete="off"` on anything that looks like a
   * username, and each opts out through its own attribute:
   * `{ 'data-bwignore': true, 'data-1p-ignore': true, 'data-lpignore': 'true',
   *    'data-form-type': 'other' }`.
   */
  inputAttrs?: Record<string, string | number | boolean>
  size?: Size
  /** Size of the dropdown list. Defaults to `size`. */
  subSize?: Size
  variant?: Variant
  ghost?: boolean
  customClass?: string
}
