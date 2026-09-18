// The combobox engine's type surface, in one leaf module so nothing in the
// engine imports its own orchestrator just for a type.
//
// The file is deliberately named `types.ts`, not `*.types.ts`: `types/types.sh`
// sweeps `components/**/*.types.ts` into the public type barrel, and the engine
// is internal — it must not leak into `cornet-ui/types`.
import type { AnchorPopupStyle } from '../positioning'

import type { ComputedRef, Ref } from 'vue'

export type ComboboxErrorCode = 'required' | 'minlength' | 'maxlength'

export interface ComboboxTriggerProps {
  id: string
  role: 'combobox'
  'aria-controls': string
  'aria-expanded': boolean
  'aria-haspopup': 'listbox'
  'aria-activedescendant': string | undefined
  disabled: true | undefined
  'aria-disabled': true | undefined
  'aria-readonly': true | undefined
  'aria-required': true | undefined
  onClick: () => void
  onKeydown: (event: KeyboardEvent) => void
}

export interface ComboboxInputProps {
  id: string
  role: 'searchbox'
  'aria-autocomplete': 'list'
  'aria-controls': string
  'aria-activedescendant': string | undefined
  onInput: (event: Event) => void
  onKeydown: (event: KeyboardEvent) => void
}

/** Typeahead pattern: the text input itself is the combobox. */
export interface ComboboxTypeaheadInputProps {
  id: string
  role: 'combobox'
  'aria-autocomplete': 'list'
  'aria-controls': string
  'aria-expanded': boolean
  'aria-haspopup': 'listbox'
  'aria-activedescendant': string | undefined
  'aria-disabled': true | undefined
  'aria-readonly': true | undefined
  disabled: true | undefined
  readonly: true | undefined
  onClick: () => void
  onFocus: () => void
  onInput: (event: Event) => void
}

export interface ComboboxListboxProps {
  id: string
  role: 'listbox'
  'aria-multiselectable': true | undefined
}

export interface ComboboxOptionProps {
  id: string
  role: 'option'
  'aria-selected': boolean
  'aria-disabled': true | undefined
  'data-highlighted': true | undefined
  onClick: () => void
  onMousedown: (event: MouseEvent) => void
  onMousemove: () => void
  onFocus: () => void
  onKeydown: (event: KeyboardEvent) => void
}

/**
 * The dropdown's inline style, from `core/positioning`. Open-ended: which
 * edges are pinned depends on the placement, so a consumer spreads it whole
 * rather than reading fields off it.
 */
export type ComboboxPopupStyle = AnchorPopupStyle

export interface ComboboxProps<O, V = O, Q = string> {
  modelValue: V | V[] | null
  options: O[]
  /** Enable multiple selection. `modelValue` becomes an array. */
  multiple?: boolean
  /** Multiple: minimum number of selected options (validation). */
  minLength?: number
  /** Multiple: maximum number of selected options. Blocks adding beyond it. */
  maxLength?: number
  /** Require a selection (single: a value; multiple: at least one). */
  required?: boolean
  /** Disable the control: not focusable, cannot open or change. */
  disabled?: boolean
  /** Read-only: still focusable and shows the value, but cannot open or change. */
  readonly?: boolean
  /** Close the dropdown after selecting. Defaults to `true` for single, `false` for multiple. */
  closeOnSelect?: boolean | null
  /** Close the dropdown when clicking outside the widget boundary. Defaults to `true`. */
  closeOnClickOutside?: boolean
  /** On Tab, when focus leaves the widget: select the highlighted option and close the popup. Defaults to `false`. */
  selectOnTab?: boolean
  /** Maps an option to the value stored in `modelValue` / emitted on select. Defaults to the option itself. */
  optionValue?: (option: O) => V
  /** Maps an option object to a string for default filtering and rendering */
  optionLabel?: (option: O) => string
  /** Custom filter function. Defaults to case-insensitive substring search */
  optionFilter?: (option: O, query: Q) => boolean
  /** Skip the local filter: `options` already are the search result (server-side search). */
  externalFilter?: boolean
  /** Cap how many options are shown. Applied after filtering, before the creatable entry. */
  resultsLimit?: number
  /** Called on every user-driven query change — not on the resets around open/close. */
  onQueryChange?: (query: Q | undefined) => void
  /** Offer a synthetic "create <query>" option when no option label matches the query exactly. */
  creatable?: boolean
  /** Builds the synthetic option from the current query. Required for `creatable`. */
  createOption?: (query: Q) => O
  /** Tells a synthetic (created) option apart from a real one. */
  isCreatedOption?: (option: O) => boolean
  /** Called *instead of* `onSelect` when a created option is selected. */
  onCreate?: (option: O) => void
  /** Called when an option becomes selected. */
  onSelect?: (option: O) => void
  /** Called when a selected option is removed — toggled off, backspaced, or re-selected under `deselectOnReselect`. */
  onRemove?: (option: O) => void
  /** Single: selecting the option that is already selected clears the selection. */
  deselectOnReselect?: boolean
  /** Options that cannot be picked: skipped by the keyboard, `aria-disabled`, inert on click. */
  optionDisabled?: (option: O) => boolean
  /**
   * What happens to a pending query when the popup closes (single only):
   * - `none` (default): the query is dropped, the selection is untouched;
   * - `match`: an exact label match is selected, anything else is dropped;
   * - `auto`: exact match, else the first result under `externalFilter`, else a
   *   created option under `creatable`, else the selection is cleared.
   *
   * In every mode, emptying the input and closing clears the selection.
   */
  commitOnClose?: 'none' | 'match' | 'auto'
  /** Optional base ID for accessibility. Auto-generated if not provided */
  id?: string
  /** Override default validation messages. */
  errorMessages?: Partial<Record<ComboboxErrorCode, string>>
}

/** `ComboboxScope` with its refs unwrapped — the shape a `reactive()` proxy of it exposes. */
export interface ComboboxSlotProps<O, V, Q = string> {
  // State
  isOpen: boolean
  searchQuery: Q | undefined
  filteredOptions: O[]
  /** What to render: `filteredOptions`, plus the created option in front when `creatable` offers one. */
  visibleOptions: O[]
  highlightedIndex: number
  cssAnchorName: string
  popupStyle: ComboboxPopupStyle
  /** The currently selected values (single mode: a single-element array). */
  selectedList: V[]
  isSelected: (option: O) => boolean
  valid: boolean
  errors: ComboboxErrorCode[]
  validationMessage: string
  // ARIA prop bags (spread with v-bind)
  triggerProps: ComboboxTriggerProps
  inputProps: ComboboxInputProps
  comboboxInputProps: ComboboxTypeaheadInputProps
  listboxProps: ComboboxListboxProps
  getOptionProps: (option: O, index: number) => ComboboxOptionProps
  // Actions
  setSearchQuery: (value: Q | undefined) => void
  setHighlightedIndex: (index: number) => void
  toggle: () => void
  open: () => void
  close: (returnFocus?: boolean) => void
  select: (option: O) => void
  clear: () => void
  handleKeydown: (event: KeyboardEvent) => void
  // Ref setters
  setContainerRef: (el: unknown) => void
  setTriggerRef: (el: unknown) => void
  setDropdownRef: (el: unknown) => void
  setInputRef: (el: unknown) => void
  setListRef: (el: unknown) => void
  setOptionRef: (option: O, el: unknown) => void
}

/** What `useCombobox` returns: the same members as `ComboboxSlotProps`, with refs for state. */
export interface ComboboxScope<O, V, Q = string> {
  // State
  isOpen: Ref<boolean>
  searchQuery: Ref<Q | undefined>
  filteredOptions: ComputedRef<O[]>
  /** What to render: `filteredOptions`, plus the created option in front when `creatable` offers one. */
  visibleOptions: ComputedRef<O[]>
  highlightedIndex: Ref<number>
  cssAnchorName: string
  popupStyle: ComputedRef<ComboboxPopupStyle>
  selectedList: ComputedRef<V[]>
  isSelected: (option: O) => boolean
  valid: ComputedRef<boolean>
  errors: ComputedRef<ComboboxErrorCode[]>
  validationMessage: ComputedRef<string>
  // ARIA prop bags (spread with v-bind)
  triggerProps: ComputedRef<ComboboxTriggerProps>
  inputProps: ComputedRef<ComboboxInputProps>
  comboboxInputProps: ComputedRef<ComboboxTypeaheadInputProps>
  listboxProps: ComputedRef<ComboboxListboxProps>
  getOptionProps: (option: O, index: number) => ComboboxOptionProps
  // Actions
  setSearchQuery: (value: Q | undefined) => void
  setHighlightedIndex: (index: number) => void
  toggle: () => void
  open: (selectText?: boolean) => Promise<void>
  close: (returnFocus?: boolean) => void
  select: (option: O) => void
  clear: () => void
  handleKeydown: (event: KeyboardEvent) => void
  // Ref setters
  setContainerRef: (el: unknown) => void
  setTriggerRef: (el: unknown) => void
  setDropdownRef: (el: unknown) => void
  setInputRef: (el: unknown) => void
  setListRef: (el: unknown) => void
  setOptionRef: (option: O, el: unknown) => void
}

/**
 * The props argument of `useCombobox`: a props object whose fields may be refs
 * or computeds — they are unwrapped and tracked internally, so no `reactive()`
 * wrapper is needed by callers.
 */
export type ComboboxPropsSource<O, V = O, Q = string>
  = { [K in keyof ComboboxProps<O, V, Q>]: ComboboxProps<O, V, Q>[K] | Ref<ComboboxProps<O, V, Q>[K]> }
