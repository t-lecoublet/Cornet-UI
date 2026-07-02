<script setup lang="ts">
import { type DuTextAreaProps } from './du-text-area.types'
import { useVariantMapping } from "../../../composables/useVariantProps"
import { useSizeMapping } from "../../../composables/useSizeProps"
import { computed } from "vue"

const props = withDefaults(
  defineProps<DuTextAreaProps>(),
  {
    modelValue: "",
    placeholder: "",
    disabled: false,
    variant: "default",
    size: "default",
    ghost: false,
  },
)

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void
}>()

const ghostClass = computed(() => (props.ghost ? "textarea-ghost" : ""))
const { colorClass } = useVariantMapping(props, "textarea")
const { sizeClass } = useSizeMapping(props, "textarea")

const handleInput = (event: Event) => {
  const value = (event.target as HTMLTextAreaElement).value
  emit("update:modelValue", value)
}
</script>

<template>
  <textarea
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    @input="handleInput"
    :class="['textarea', ghostClass, colorClass, sizeClass]"
  />
</template> 