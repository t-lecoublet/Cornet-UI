<script setup lang="ts">
import { type DuCheckboxProps } from './du-checkbox.types'
import { useVariantMapping } from "../../../composables/useVariantProps"
import { useSizeMapping } from "../../../composables/useSizeProps"
import { onMounted, ref, watch } from "vue"

const model = defineModel<boolean>()

const props = withDefaults(
  defineProps<DuCheckboxProps>(),
  {
    disabled: false,
    indeterminate: false,
    variant: "default",
    size: "default",
  },
)

const currentCheckbox = ref()

const { colorClass } = useVariantMapping(props, "checkbox")
const { sizeClass } = useSizeMapping(props, "checkbox")

onMounted(() => {
  currentCheckbox.value.indeterminate = props.indeterminate
})

// Keeps the DOM's indeterminate state in sync with later prop changes —
// onMounted above only covers the initial render.
watch(() => props.indeterminate, (indeterminate) => {
  currentCheckbox.value.indeterminate = indeterminate
})
</script>

<template>
  <input
    ref="currentCheckbox"
    type="checkbox"
    v-model="model"
    :disabled="disabled"
    :class="['checkbox', colorClass, sizeClass]"
  />
</template>