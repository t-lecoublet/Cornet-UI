// Cornet's headless combobox engine — the state machine behind DuSelect and
// DuSearch. It implements the WAI-ARIA combobox pattern (popup lifecycle,
// filtering, highlight, full keyboard support, focus rules) plus the library's
// own behaviors (creatable entry, commit-on-close, external filtering) and
// exposes ARIA prop bags for the facades to spread over their markup. No
// markup, no styling, no CSS classes live here.
//
// Everything sits in one closure on purpose: the features are tightly coupled
// (selecting closes the popup, closing commits the pending query, typing
// re-highlights, Tab must know the widget boundary…), and a shared scope keeps
// that wiring direct instead of threading callbacks between modules.
import { computed, nextTick, reactive, ref, toRaw, watch } from 'vue'
import { usePopoverState } from '../popover'
import { useAnchorPosition } from '../positioning'
import { focusableInDocument, hasEditableText, isTextField, revealInContainer, useComponentId } from '../shared'
import type { Ref } from 'vue'
import type {
  ComboboxErrorCode,
  ComboboxInputProps,
  ComboboxListboxProps,
  ComboboxOptionProps,
  ComboboxProps,
  ComboboxPropsSource,
  ComboboxScope,
  ComboboxTriggerProps,
  ComboboxTypeaheadInputProps,
} from './types'

// Registry key for the created option. `createOption` builds a fresh object on
// every keystroke, so the option itself cannot key the element registry — each
// render would leak an entry and lookups would miss. Every created option is
// registered under this one key instead.
const CREATED_OPTION_KEY = Symbol('cornet.combobox.createdOption')

/**
 * The combobox state machine, usable from any component.
 *
 * `propsSource` is a props object whose fields may be refs or computeds —
 * every field is unwrapped and tracked, so a `defineModel` ref can be bound
 * directly:
 *
 * ```ts
 * useCombobox({ modelValue: model, options: users }, (value) => {
 *   model.value = value
 * })
 * ```
 *
 * The second argument receives every selection change; write it back to your
 * state. Call from `setup()` — the engine derives its accessibility ids from
 * `useComponentId()` and subscribes to the document while the popup is open.
 */
export function useCombobox<O, V = O, Q = string>(
  propsSource: ComboboxPropsSource<O, V, Q>,
  emit: (value: V | V[] | null) => void,
): ComboboxScope<O, V, Q> {
  // A component's props object is already reactive and passes through as-is;
  // plain objects and objects of refs get normalized (refs unwrapped) here.
  const props = reactive(propsSource) as unknown as ComboboxProps<O, V, Q>

  // --- state ---------------------------------------------------------------
  // `isOpen` and the whole popup lifecycle live in `usePopoverState`, wired at
  // the bottom of this file once everything it calls back into exists.
  const query = ref() as Ref<Q | undefined>
  const highlightedIndex = ref(-1)
  // Whether the user edited the query since the popup opened. Commit-on-close
  // gates on it: a popup opened and closed without typing must not count as
  // "the user emptied the field".
  let queryDirty = false

  // --- accessibility ids ---------------------------------------------------
  const instanceId = useComponentId(props.id)
  const listboxId = `${instanceId}-listbox`
  const triggerId = `${instanceId}-trigger`
  const inputId = `${instanceId}-input`
  const cssAnchorName = `--anchor-${instanceId}`
  const optionId = (index: number) => `${instanceId}-opt-${index}`

  // --- wired elements ------------------------------------------------------
  const els = {
    container: null as HTMLElement | null,
    trigger: null as HTMLElement | null,
    dropdown: null as HTMLElement | null,
    input: null as HTMLInputElement | null,
    list: null as HTMLElement | null,
  }
  const optionEls = new Map<unknown, HTMLElement>()

  function setContainerRef(el: unknown) {
    els.container?.removeEventListener('keydown', handleKeydown)
    els.container = el as HTMLElement | null
    // Keys pressed on unwired elements around the trigger (chips, clear
    // buttons) must still reach the Tab handling, so focus never walks into
    // the options list.
    els.container?.addEventListener('keydown', handleKeydown)
  }
  function setTriggerRef(el: unknown) {
    els.trigger = el as HTMLElement | null
  }
  function setDropdownRef(el: unknown) {
    els.dropdown?.removeEventListener('keydown', handleKeydown)
    els.dropdown = el as HTMLElement | null
    // The popup often renders as a sibling of the container; its own controls
    // need the same Tab treatment.
    els.dropdown?.addEventListener('keydown', handleKeydown)
  }
  function setInputRef(el: unknown) {
    els.input = el as HTMLInputElement | null
  }
  function setListRef(el: unknown) {
    els.list = el as HTMLElement | null
  }
  function setOptionRef(option: O, el: unknown) {
    if (el) {
      optionEls.set(registryKey(option), el as HTMLElement)
    } else {
      optionEls.delete(registryKey(option))
    }
  }

  // --- selection -----------------------------------------------------------
  /** The value stored/emitted for an option; defaults to the option itself. */
  function valueOf(option: O): V {
    return props.optionValue ? props.optionValue(option) : option as unknown as V
  }

  function labelOf(option: O): string {
    return props.optionLabel ? props.optionLabel(option) : String(option)
  }

  const selectedList = computed<V[]>(() => {
    if (props.multiple) {
      return Array.isArray(props.modelValue) ? props.modelValue : []
    }
    return props.modelValue == null ? [] : [props.modelValue as V]
  })

  const selectedCount = computed(() => selectedList.value.length)

  const canSelectMore = computed(() =>
    !props.multiple || props.maxLength == null || selectedCount.value < props.maxLength)

  // Disabled and read-only both block opening and changing the selection.
  const locked = computed(() => props.disabled === true || props.readonly === true)

  function isSelected(option: O): boolean {
    const value = toRaw(valueOf(option))
    return selectedList.value.some((held) => toRaw(held) === value)
  }

  /** The option whose value equals `value` — resolves the model back to an option. */
  function optionForValue(value: V): O | undefined {
    return props.options.find((option) => toRaw(valueOf(option)) === toRaw(value))
  }

  // Unpickable rows: the consumer's predicate, or a full multi-select where
  // only already-selected rows stay actionable (so they can be toggled off).
  function isOptionDisabled(option: O): boolean {
    return props.optionDisabled?.(option) === true || (!isSelected(option) && !canSelectMore.value)
  }

  /** A created option is an addition, not a pick — it reports through `onCreate`. */
  function announceSelection(option: O) {
    if (props.isCreatedOption?.(option) === true) {
      props.onCreate?.(option)
    } else {
      props.onSelect?.(option)
    }
  }

  function select(option: O) {
    if (locked.value || props.optionDisabled?.(option) === true) {
      return
    }
    const value = valueOf(option)
    if (props.multiple) {
      const current = selectedList.value
      const raw = toRaw(value)
      if (current.some((held) => toRaw(held) === raw)) {
        emit(current.filter((held) => toRaw(held) !== raw))
        props.onRemove?.(option)
      } else if (canSelectMore.value) {
        emit([...current, value])
        announceSelection(option)
      }
      // At maxLength nothing changes, but the focus handling below still runs.
    } else if (props.deselectOnReselect === true && isSelected(option)) {
      emit(null)
      props.onRemove?.(option)
    } else {
      emit(value)
      announceSelection(option)
    }
    // An explicit pick resolves whatever was typed: commit-on-close must not
    // override it when the popup closes right after.
    queryDirty = false
    if (props.closeOnSelect ?? !props.multiple) {
      close(true)
    } else if (isOpen.value) {
      nextTick(refocusFilterIfSafe)
    }
  }

  function clear() {
    if (locked.value) {
      return
    }
    emit(props.multiple ? [] : null)
    queryDirty = false
    if (isOpen.value) {
      nextTick(refocusFilterIfSafe)
    }
  }

  /** Backspace/Delete: drop the trailing selection (multiple) or the sole value (single). */
  function dropLastSelected() {
    if (locked.value) {
      return
    }
    const current = selectedList.value
    const last = current[current.length - 1]
    if (last === undefined) {
      return
    }
    emit(props.multiple ? current.slice(0, -1) : null)
    const removed = optionForValue(last)
    if (removed !== undefined) {
      props.onRemove?.(removed)
    }
    queryDirty = false
    if (isOpen.value) {
      nextTick(refocusFilterIfSafe)
    }
  }

  // --- filtering -----------------------------------------------------------
  function matchesQuery(option: O, q: Q): boolean {
    if (props.optionFilter) {
      return props.optionFilter(option, q)
    }
    return labelOf(option).toLowerCase().includes(String(q).toLowerCase())
  }

  const filteredOptions = computed<O[]>(() => {
    const q = query.value
    const blank = q == null || (typeof q === 'string' && q === '')
    // `externalFilter`: the options already are the search result for this
    // query — filtering them again locally would be wrong.
    const matching = props.externalFilter === true || blank
      ? props.options
      : props.options.filter((option) => matchesQuery(option, q))
    return props.resultsLimit == null ? matching : matching.slice(0, props.resultsLimit)
  })

  function setSearchQuery(value: Q | undefined) {
    query.value = value
    queryDirty = true
    props.onQueryChange?.(value)
  }

  function setQueryFromEvent(event: Event) {
    setSearchQuery((event.target as HTMLInputElement).value as Q)
  }

  // Typing in the typeahead input reopens the popup. `open` resets the query,
  // so it must run first — and it must not select the text being typed.
  function openAndSetQueryFromEvent(event: Event) {
    open(false)
    setSearchQuery((event.target as HTMLInputElement).value as Q)
  }

  // Typing moves the highlight back to the first pickable result. The highlight
  // only means something while the popup is open — closing blanks the query,
  // and that reset must not put a highlight back on a closed list.
  watch(query, () => {
    if (isOpen.value) {
      highlightedIndex.value = firstActionable()
    }
  })

  // --- creatable entry -----------------------------------------------------
  const createdOption = computed<O | null>(() => {
    if (props.creatable !== true || props.createOption == null) {
      return null
    }
    const text = query.value == null ? '' : String(query.value)
    if (text === '') {
      return null
    }
    // Never offer to create a duplicate of an existing label.
    const lower = text.toLowerCase()
    if (props.options.some((option) => labelOf(option).toLowerCase() === lower)) {
      return null
    }
    return props.createOption(query.value as Q)
  })

  // What the consumer renders: the created entry rides in front and is never
  // dropped by `resultsLimit`.
  const visibleOptions = computed<O[]>(() => {
    const created = createdOption.value
    return created == null ? filteredOptions.value : [created, ...filteredOptions.value]
  })

  function registryKey(option: O): unknown {
    return props.isCreatedOption?.(option) === true ? CREATED_OPTION_KEY : toRaw(option)
  }

  // --- highlight -----------------------------------------------------------
  function setHighlightedIndex(index: number) {
    if (index >= 0 && index < visibleOptions.value.length) {
      highlightedIndex.value = index
    }
  }

  function firstActionable(): number {
    return visibleOptions.value.findIndex((option) => !isOptionDisabled(option))
  }

  function lastActionable(): number {
    const options = visibleOptions.value
    for (let i = options.length - 1; i >= 0; i--) {
      if (!isOptionDisabled(options[i]!)) {
        return i
      }
    }
    return -1
  }

  // Move the highlight `steps` rows in `direction`, skipping unpickable rows.
  // Wraps at the edges unless `wrap` is false, where it clamps instead. When
  // nothing is pickable the highlight clears.
  function moveHighlight(direction: 1 | -1, steps = 1, wrap = true) {
    const count = visibleOptions.value.length
    if (count === 0) {
      highlightedIndex.value = -1
      return
    }
    let candidate = highlightedIndex.value + direction * steps
    if (!wrap) {
      candidate = Math.min(count - 1, Math.max(0, candidate))
    }
    for (let hops = 0; hops < count; hops++) {
      if (candidate < 0 || candidate >= count) {
        if (!wrap) {
          return
        }
        candidate = ((candidate % count) + count) % count
      }
      if (!isOptionDisabled(visibleOptions.value[candidate]!)) {
        highlightedIndex.value = candidate
        return
      }
      candidate += direction
    }
    highlightedIndex.value = -1
  }

  /** A page = as many rows as the list viewport shows at once. */
  function pageSize(): number {
    const row = optionEls.values().next().value
    if (els.list != null && row != null && els.list.clientHeight > 0 && row.offsetHeight > 0) {
      return Math.max(1, Math.floor(els.list.clientHeight / row.offsetHeight))
    }
    return 10
  }

  async function scrollHighlightIntoView() {
    await nextTick()
    const option = visibleOptions.value[highlightedIndex.value]
    if (option == null) {
      return
    }
    const el = optionEls.get(registryKey(option))
    if (el != null) {
      revealInContainer(el, els.list)
    }
  }

  // --- keyboard ------------------------------------------------------------
  // Send focus to the next (or previous) tabbable element outside the options
  // list, wrapping around the document.
  function focusPastList(backward: boolean) {
    const candidates = focusableInDocument()
    if (candidates.length === 0) {
      return
    }
    const from = candidates.indexOf(document.activeElement as HTMLElement)
    const step = backward ? -1 : 1
    for (let hops = 1; hops <= candidates.length; hops++) {
      const at = (((from + hops * step) % candidates.length) + candidates.length) % candidates.length
      const el = candidates[at]!
      if (els.list == null || !els.list.contains(el)) {
        el.focus()
        return
      }
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    // The event bubbles from the wired controls up to the container/dropdown
    // listeners; whoever saw it first has already handled it.
    if (event.defaultPrevented || locked.value) {
      return
    }
    // The bubbled listeners only exist for Tab management: any other key aimed
    // at an unwired child (a chip's remove button, a custom control in the
    // popup) keeps its native behavior.
    if (event.currentTarget !== event.target && event.key !== 'Tab') {
      return
    }

    if (!isOpen.value) {
      // A button trigger opens on Enter/Space/arrows. A typeahead field doubles
      // as the trigger: its Space must type (the input handler opens the
      // popup), not be swallowed by the opener.
      if (
        event.key === 'Enter'
        || ((event.key === ' ' || event.key === 'ArrowDown' || event.key === 'ArrowUp')
          && !isTextField(event.target as Element | null))
      ) {
        event.preventDefault()
        open()
      } else if ((event.key === 'Backspace' || event.key === 'Delete') && !hasEditableText(event.target)) {
        event.preventDefault()
        dropLastSelected()
      }
      return
    }

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        event.preventDefault()
        moveHighlight(event.key === 'ArrowDown' ? 1 : -1)
        scrollHighlightIntoView()
        break
      }
      case 'Enter': {
        event.preventDefault()
        const row = visibleOptions.value[highlightedIndex.value]
        if (row != null) {
          select(row)
        }
        break
      }
      case ' ': {
        // Space types text and natively activates option buttons. Only on a
        // button trigger would its native click toggle the popup right back
        // closed — swallow it there. On the typeahead field the trigger IS the
        // text input: the space has to type.
        if (event.target === els.trigger && !isTextField(event.target as Element | null)) {
          event.preventDefault()
        }
        break
      }
      case 'Backspace':
      case 'Delete': {
        // With no filter input these edit the selection instead of text. The
        // typeahead input doubles as the trigger: it must be empty before the
        // keys start removing selections.
        const typeahead = event.target === els.trigger && els.trigger === els.input
        if ((els.input == null || typeahead) && !hasEditableText(event.target)) {
          event.preventDefault()
          dropLastSelected()
        }
        break
      }
      case 'PageDown':
      case 'PageUp': {
        event.preventDefault()
        moveHighlight(event.key === 'PageDown' ? 1 : -1, pageSize(), false)
        scrollHighlightIntoView()
        break
      }
      case 'Home':
      case 'End': {
        // Text fields keep their native caret jumps.
        if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
          break
        }
        event.preventDefault()
        highlightedIndex.value = event.key === 'Home' ? firstActionable() : lastActionable()
        scrollHighlightIntoView()
        break
      }
      case 'Tab': {
        // Tab never walks into the options list.
        event.preventDefault()
        const row = visibleOptions.value[highlightedIndex.value]
        if (props.selectOnTab && row != null) {
          select(row)
          if (isOpen.value) {
            close(false)
          }
          // The close may have parked focus back on the trigger; carry on to
          // the next tabbable element like a normal Tab.
          focusPastList(event.shiftKey)
          break
        }
        focusPastList(event.shiftKey)
        // Focus leaving the widget closes the popup, like a click outside.
        if (!isInsideWidget(document.activeElement)) {
          close(false)
        }
        break
      }
      case 'Escape': {
        event.preventDefault()
        close(true)
        break
      }
    }
  }

  // --- popup lifecycle -----------------------------------------------------
  // The open flag, the Popover API call, outside/Escape dismissal and the
  // focus handed back on the way out are `usePopoverState`. What is specific to
  // a combobox lives in its four hooks.
  const popover = usePopoverState({
    // Escape and outside clicks are judged against every wired part: a click on
    // a chip or on the field's own padding is inside, a click on the page is not.
    boundary: () => [els.container, els.trigger, els.dropdown],
    popoverElement: () => els.dropdown,
    returnFocusTo: () => els.trigger,
    closeOnClickOutside: () => props.closeOnClickOutside !== false,
    disabled: () => locked.value,

    onOpening() {
      queryDirty = false
      // The query resets, so the typeahead input falls back to showing the
      // current value.
      query.value = undefined

      // Start on the selected option when it is in view, else on the first
      // pickable row.
      const first = selectedList.value[0]
      const selectedAt = first == null
        ? -1
        : visibleOptions.value.findIndex((option) => toRaw(valueOf(option)) === toRaw(first))
      highlightedIndex.value = selectedAt >= 0 ? selectedAt : firstActionable()
    },
    onOpened() {
      scrollHighlightIntoView()
      els.input?.focus({ preventScroll: true })
      // Select the shown text so typing replaces it — except when the popup
      // reopened *because* of typing, which `open(false)` signals.
      if (selectShownTextOnOpen) {
        els.input?.select()
      }
    },
    // The pending text must be resolved while the query still holds it.
    onClosing: () => commitPendingQuery(),
    onClosed() {
      highlightedIndex.value = -1
      query.value = undefined
      queryDirty = false
    },
  })

  const isOpen = popover.isOpen
  const close = popover.close
  const toggle = popover.toggle

  // Whether `onOpened` should select the text it shows. Not a parameter of the
  // primitive's `open()`: it is one combobox detail, carried across the tick.
  let selectShownTextOnOpen = true

  function open(selectText = true) {
    selectShownTextOnOpen = selectText
    return popover.open()
  }

  // What happens to text still sitting in the field when the popup closes.
  // Single selection only: in multiple mode the chips already record every
  // pick, and loose text would be ambiguous.
  function commitPendingQuery() {
    if (props.multiple === true || !queryDirty) {
      return
    }
    const text = query.value == null ? '' : String(query.value)
    // The user deleted what was shown: deleting the text deletes the value.
    if (text === '') {
      emit(null)
      return
    }
    const mode = props.commitOnClose ?? 'none'
    if (mode === 'none') {
      return
    }
    const lower = text.toLowerCase()
    const match = props.options.find((option) => labelOf(option).toLowerCase() === lower)
    if (match != null) {
      select(match)
      return
    }
    if (mode === 'match') {
      return
    }
    // `auto` fallbacks: the best external result, then a created option, then
    // nothing left to keep.
    const best = filteredOptions.value[0]
    if (props.externalFilter === true && best != null) {
      select(best)
    } else if (props.creatable === true && props.createOption != null) {
      select(props.createOption(query.value as Q))
    } else {
      emit(null)
    }
  }

  // --- focus ---------------------------------------------------------------
  /** The widget boundary: any wired part (container, trigger, popup). */
  const isInsideWidget = (target: Node | null) => popover.isInside(target)

  // After an interaction that keeps the popup open, put focus back on the
  // filter input — but never steal it from a text field, nor from anything the
  // user deliberately focused outside the widget.
  function refocusFilterIfSafe() {
    const input = els.input
    if (input == null) {
      return
    }
    const active = document.activeElement
    const parked = active == null || active === document.body || active === document.documentElement
    if (active === input || parked) {
      input.focus({ preventScroll: true })
      return
    }
    if (isTextField(active) || !isInsideWidget(active)) {
      return
    }
    input.focus({ preventScroll: true })
  }

  // --- positioning ---------------------------------------------------------
  const { popupStyle } = useAnchorPosition(cssAnchorName)

  // --- validation ----------------------------------------------------------
  const errors = computed<ComboboxErrorCode[]>(() => {
    const found: ComboboxErrorCode[] = []
    if (props.required && selectedCount.value === 0) {
      found.push('required')
    }
    if (props.multiple) {
      if (props.minLength != null && selectedCount.value < props.minLength) {
        found.push('minlength')
      }
      if (props.maxLength != null && selectedCount.value > props.maxLength) {
        found.push('maxlength')
      }
    }
    return found
  })

  const valid = computed(() => errors.value.length === 0)

  const validationMessage = computed(() => {
    const code = errors.value[0]
    if (code == null) {
      return ''
    }
    const custom = props.errorMessages?.[code]
    if (custom != null) {
      return custom
    }
    if (code === 'required') {
      return 'Selection is required.'
    }
    const bound = code === 'minlength' ? props.minLength : props.maxLength
    const noun = bound === 1 ? 'option' : 'options'
    return code === 'minlength' ? `Select at least ${bound} ${noun}.` : `Select at most ${bound} ${noun}.`
  })

  // --- ARIA prop bags ------------------------------------------------------
  const activeOptionId = computed(() =>
    isOpen.value && highlightedIndex.value >= 0 ? optionId(highlightedIndex.value) : undefined)

  const triggerProps = computed<ComboboxTriggerProps>(() => ({
    id: triggerId,
    role: 'combobox',
    'aria-controls': listboxId,
    'aria-expanded': isOpen.value,
    'aria-haspopup': 'listbox',
    'aria-activedescendant': activeOptionId.value,
    disabled: props.disabled ? true : undefined,
    'aria-disabled': props.disabled ? true : undefined,
    'aria-readonly': props.readonly ? true : undefined,
    onClick: toggle,
    onKeydown: handleKeydown,
  }))

  // A secondary filter box (e.g. at the top of the dropdown).
  const inputProps = computed<ComboboxInputProps>(() => ({
    id: inputId,
    role: 'searchbox',
    'aria-autocomplete': 'list',
    'aria-controls': listboxId,
    'aria-activedescendant': activeOptionId.value,
    onInput: setQueryFromEvent,
    onKeydown: handleKeydown,
  }))

  // The canonical typeahead pattern: the text input *is* the combobox.
  const comboboxInputProps = computed<ComboboxTypeaheadInputProps>(() => ({
    id: inputId,
    role: 'combobox',
    'aria-autocomplete': 'list',
    'aria-controls': listboxId,
    'aria-expanded': isOpen.value,
    'aria-haspopup': 'listbox',
    'aria-activedescendant': activeOptionId.value,
    'aria-disabled': props.disabled ? true : undefined,
    'aria-readonly': props.readonly ? true : undefined,
    disabled: props.disabled ? true : undefined,
    readonly: props.readonly ? true : undefined,
    onClick: () => { open() },
    onFocus: () => { open() },
    onInput: openAndSetQueryFromEvent,
  }))

  const listboxProps = computed<ComboboxListboxProps>(() => ({
    id: listboxId,
    role: 'listbox',
    'aria-multiselectable': props.multiple ? true : undefined,
  }))

  function getOptionProps(option: O, index: number): ComboboxOptionProps {
    return {
      id: optionId(index),
      role: 'option',
      // The real selection — never the highlight.
      'aria-selected': isSelected(option),
      'aria-disabled': isOptionDisabled(option) ? true : undefined,
      'data-highlighted': index === highlightedIndex.value ? true : undefined,
      onClick: () => select(option),
      // Keep focus on the filter input through the click.
      onMousedown: (event: MouseEvent) => event.preventDefault(),
      // Pointer and focus drive the highlight; unpickable rows never take it.
      onMousemove: () => {
        if (!isOptionDisabled(option)) {
          setHighlightedIndex(index)
        }
      },
      onFocus: () => {
        if (!isOptionDisabled(option)) {
          setHighlightedIndex(index)
        }
      },
      // Keyboard navigation (and Tab skipping) also works from inside the list.
      onKeydown: handleKeydown,
    }
  }

  return {
    isOpen,
    searchQuery: query,
    filteredOptions,
    visibleOptions,
    highlightedIndex,
    cssAnchorName,
    popupStyle,
    selectedList,
    isSelected,
    valid,
    errors,
    validationMessage,
    triggerProps,
    inputProps,
    comboboxInputProps,
    listboxProps,
    getOptionProps,
    setSearchQuery,
    setHighlightedIndex,
    toggle,
    open,
    close,
    select,
    clear,
    handleKeydown,
    setContainerRef,
    setTriggerRef,
    setDropdownRef,
    setInputRef,
    setListRef,
    setOptionRef,
  }
}
