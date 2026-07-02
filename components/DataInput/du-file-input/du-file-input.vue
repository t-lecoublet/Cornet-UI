<script setup lang="ts">
import { type DuFileInputProps } from './du-file-input.types'
import { useVariantMapping } from "../../../composables/useVariantProps"
import { useSizeMapping } from "../../../composables/useSizeProps"
import { computed } from "vue"

const props = withDefaults(
  defineProps<DuFileInputProps>(),
  {
    disabled: false,
    variant: "default",
    size: "default",
    ghost: false,
  },
)

const ghostClass = computed(() => {
  return props.ghost ? "file-input-ghost" : ""
})

const { colorClass } = useVariantMapping(props, "file-input")
const { sizeClass } = useSizeMapping(props, "file-input")
</script>

<template>
  <input
    type="file"
    :disabled="disabled"
    :class="['file-input', colorClass, sizeClass, ghostClass]"
  />
</template> 