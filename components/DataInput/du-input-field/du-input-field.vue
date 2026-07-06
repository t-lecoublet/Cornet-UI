<script setup lang="ts">
import { useSizeMapping } from "../../../composables/useSizeProps"
import { useVariantMapping } from "../../../composables/useVariantProps"
import { computed, inject } from "vue"
import { type DuInputFieldProps } from "./du-input-field.types"

const model = defineModel()

const props = withDefaults(defineProps<DuInputFieldProps>(), {
  placeholder: "",
  type: "text",
  size: "default",
  ghost: false,
  variant: "default",
  disabled: false,
  required: false,
})

const { colorClass } = useVariantMapping(props, "input")
const { sizeClass } = useSizeMapping(props, "input")
const ghostClass = computed(() => (props.ghost ? "input-ghost" : ""))
const invalidClass = computed(() => (props.invalid ? "input-bordered focus:invalid:input-error" : ""))

const isInput = inject("isInInput", false)
const inJoin = inject("isInJoin", false)
</script>

<template>
  <input
    :disabled="disabled"
    :type="type"
    :placeholder="placeholder"
    :class="[!isInput && 'input', colorClass, sizeClass, ghostClass, invalidClass, props.class, inJoin && 'join-item']"
    :list="suggestionName"
    :required="required"
    :pattern="pattern"
    :minlength="minlength"
    :maxlength="maxlength"
    :title="title"
    v-model="model"
  />
  <datalist v-if="suggestionName" :id="suggestionName">
    <option v-for="suggestion in suggestionList" :key="suggestion">
      {{ suggestion }}
    </option>
  </datalist>
</template> 