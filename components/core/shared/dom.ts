// Pure DOM helpers shared by the core primitives. No state, no Vue —
// everything here is unit-testable with plain objects.

const FOCUSABLE_SELECTOR
  = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]'

/**
 * Every element inside `root` a Tab press could land on right now.
 *
 * `tabIndex >= 0` is what "Tab reaches it" means — a `tabindex="-1"` element is
 * focusable programmatically but not by keyboard. The client-rect check drops
 * what is laid out nowhere: `display: none`, a collapsed panel, an ancestor
 * that is `hidden`.
 */
export function focusableWithin(root: ParentNode): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)]
    .filter((el) => el.tabIndex >= 0 && el.getClientRects().length > 0)
}

/** Every element in the document a Tab press could land on right now. */
export function focusableInDocument(): HTMLElement[] {
  return focusableWithin(document)
}

/**
 * Whether the event target currently holds editable text. While it does,
 * Backspace/Delete keep their native meaning (edit the text) instead of
 * removing selections.
 */
export function hasEditableText(target: EventTarget | null): boolean {
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
    return target.value.length > 0
  }
  return target instanceof HTMLElement && target.isContentEditable && (target.textContent ?? '').length > 0
}

// Input types that behave like buttons/pickers rather than text entry.
const NON_TEXT_INPUT_TYPES = ['button', 'submit', 'reset', 'checkbox', 'radio', 'range', 'color', 'file']

/** Elements the user types into — focus must never be stolen from these. */
export function isTextField(el: Element | null): boolean {
  if (el instanceof HTMLTextAreaElement) {
    return true
  }
  if (el instanceof HTMLInputElement) {
    return !NON_TEXT_INPUT_TYPES.includes(el.type)
  }
  return el instanceof HTMLElement && el.isContentEditable
}

/**
 * Scroll `el` vertically into `container`'s viewport.
 *
 * Client rects carry any CSS scale an opening animation applies, while
 * `scrollTop` is in unscaled content units — so the scale divides out of the
 * correction.
 */
export function revealInContainer(el: HTMLElement, container: HTMLElement | null) {
  if (container == null) {
    return
  }
  const viewport = container.getBoundingClientRect()
  const target = el.getBoundingClientRect()
  const scale = (container.offsetWidth > 0 ? viewport.width / container.offsetWidth : 1) || 1

  if (target.top < viewport.top) {
    container.scrollTop -= (viewport.top - target.top) / scale
  } else if (target.bottom > viewport.bottom) {
    container.scrollTop += (target.bottom - viewport.bottom) / scale
  }
}

/**
 * Pull a field's message up against the field, whatever gap the parent puts
 * between its children.
 *
 * The message is the field's next sibling — no wrapper, so a consumer's
 * `flex-1` or `grow` on the field keeps working — which exposes it to the
 * parent's `gap`: 4px under one field, 28px under another. In a column flex or
 * a grid, the margin cancels that gap. Use as a function ref.
 */
export function hugPreviousSibling(target: unknown) {
  // A single parameter on purpose: Vue calls a function ref with a second
  // argument (the refs object), which must not land in anything meaningful.
  const offset = '0.25rem'
  const el = target as HTMLElement | null
  if (el?.parentElement == null) {
    return
  }
  const parent = getComputedStyle(el.parentElement)
  const stacked = parent.display.includes('grid')
    || (parent.display.includes('flex') && parent.flexDirection.startsWith('column'))
  const gap = stacked ? parent.rowGap : 'normal'
  el.style.marginTop = gap === 'normal' || gap === '0px' ? offset : `calc(${offset} - ${gap})`
}
