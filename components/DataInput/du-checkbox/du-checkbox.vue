<script setup lang="ts">
import { type DuCheckboxProps } from './du-checkbox.types'
import { useVariantMapping } from "../../../composables/useVariantProps"
import { useSizeMapping } from "../../../composables/useSizeProps"
import { onMounted, ref } from "vue"

const model = defineModel()

const props = withDefaults(
  defineProps<DuCheckboxProps>(),
  {
    checked: false,
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
  if (props.indeterminate) {
    currentCheckbox.value.indeterminate = true
  }
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