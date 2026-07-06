<script setup lang="ts">
import { type DuFileInputProps } from './du-file-input.types'
import { useVariantMapping } from "../../../composables/useVariantProps"
import { useSizeMapping } from "../../../composables/useSizeProps"

const props = withDefaults(
  defineProps<DuFileInputProps>(),
  {
    disabled: false,
    variant: "default",
    size: "default",
    ghost: false,
  },
)

const { colorClass } = useVariantMapping(props, "file-input")
const { sizeClass } = useSizeMapping(props, "file-input")
</script>

<template>
  <input
    type="file"
    :disabled="disabled"
    :class="['file-input', colorClass, sizeClass, ghost && 'file-input-ghost']"
  />
</template> 