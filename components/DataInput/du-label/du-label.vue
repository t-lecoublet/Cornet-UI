<script setup lang="ts">
import { computed, provide, shallowRef } from "vue"
import { hugPreviousSibling } from "../../core/shared"
import { LABEL_FIELD_ERROR, type DuLabelFieldError, type DuLabelProps } from "./du-label.types"

const props = defineProps<DuLabelProps>()

if (props.type == "input") {
  provide("isInInput", true)
}

if(props.type == "select") {
  provide("isInLabel", true)
}

// A nested DuInputField reports its error here rather than rendering it inside
// the label (see LABEL_FIELD_ERROR). The root becomes a fragment — label, then
// message — so attributes are bound to the label by hand.
defineOptions({ inheritAttrs: false })

const fieldError = shallowRef<DuLabelFieldError | null>(null)
const fieldValid = shallowRef(false)
provide(LABEL_FIELD_ERROR, {
  report: (error) => { fieldError.value = error },
  reportValid: (valid) => { fieldValid.value = valid },
})

// The control this labels is nested by the consumer through the slot
// (`<DuLabel>Email <DuInputField/></DuLabel>`), which no lint rule can see.
// The exemption is in eslint.config.js: see the note in du-modal.vue.
const typeClass = computed(() => {
  switch (props.type) {
    case "select":
      return "input pr-0"
    default:
      return props.type
  }
})

/** Where the label itself draws the field's border, it has to change colour too. */
const drawsBorder = computed(() => props.type === "input" || props.type === "select")
const stateClass = computed(() => {
  if (!drawsBorder.value) {
    return ""
  }
  if (fieldError.value != null) {
    return "input-error"
  }
  return fieldValid.value ? "input-success" : ""
})
</script>

<template>
  <label v-bind="$attrs" :class="[typeClass, stateClass]">
    <slot />
  </label>
  <p v-if="fieldError?.message" :id="fieldError.id" :ref="hugPreviousSibling" class="validator-hint visible text-error text-xs mt-1">{{ fieldError.message }}</p>
</template>
