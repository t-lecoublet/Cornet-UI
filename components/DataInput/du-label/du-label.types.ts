import type { InjectionKey } from "vue"

export type DuLabelProps = {
  type?: "label" | "input" | "select" | "floating-label" | "fieldset-label"
}

/** A field's error, as handed to the label that wraps it. */
export interface DuLabelFieldError {
  /** id of the message element, for the field's `aria-describedby`. */
  id: string
  message: string
}

/**
 * How a field inside a `DuLabel` hands its error message up.
 *
 * Every daisyUI label is a flex row (`.floating-label`, `.input`, `.label`), so
 * a message rendered *inside* it becomes a flex item beside the field —
 * squeezing it to half its width — and is never a sibling of the field, which
 * daisyUI's `.validator ~ .validator-hint` rule needs. The label renders it
 * after itself instead.
 */
export const LABEL_FIELD_ERROR: InjectionKey<{
  report: (error: DuLabelFieldError | null) => void
  /** The field opted into `showValid` and is currently valid. */
  reportValid: (valid: boolean) => void
}> = Symbol("DuLabelFieldError")
