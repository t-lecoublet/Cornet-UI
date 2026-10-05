import { computed, inject, onBeforeUnmount, useSlots, watchEffect, type Ref } from "vue"
import { useComponentId } from "../../core/shared"
import { LABEL_FIELD_ERROR } from "./du-label.types"

interface FieldErrorState {
  /** The field has been visited and fails a constraint. */
  showError: Ref<boolean>
  /** May be empty: the combobox ships no default wording. */
  message: Ref<string>
  /** The field opted into `showValid` and currently is. */
  showValid?: Ref<boolean>
  /** Prefix of the generated message id, to keep the DOM readable. */
  idPrefix: string
}

/**
 * Where a field's error message goes, and how the field points at it.
 *
 * Inside a `DuLabel`, the message is handed to the label, which renders it
 * after the `<label>` — a daisyUI label is a flex row, and a message inside it
 * squeezes the field (see LABEL_FIELD_ERROR). Elsewhere the field renders it
 * itself. Either way a consumer's own `#error` slot stays where they put it.
 *
 * Call from `setup`: it reads the component's slots and injection context.
 */
export function useLabelledFieldError(state: FieldErrorState) {
  const slots = useSlots()
  const label = inject(LABEL_FIELD_ERROR, null)
  const errorId = useComponentId(undefined, state.idPrefix)

  /** The label renders the message; the field renders nothing. */
  const delegated = computed(() => label != null && slots.error == null)

  watchEffect(() => {
    if (!delegated.value) {
      return
    }
    label!.report(state.showError.value ? { id: errorId, message: state.message.value } : null)
  })
  watchEffect(() => {
    label?.reportValid(state.showValid?.value ?? false)
  })
  onBeforeUnmount(() => {
    label?.report(null)
    label?.reportValid(false)
  })

  /** Only when an element with that id exists: shown, non-empty, ours. */
  const describedBy = computed(() => (
    state.showError.value && state.message.value !== "" && slots.error == null ? errorId : undefined
  ))

  return { errorId, delegated, describedBy }
}
