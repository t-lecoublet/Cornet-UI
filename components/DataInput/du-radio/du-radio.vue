<script setup lang="ts">
import { type DuRadioProps } from './du-radio.types'
import { useVariantMapping } from "../../../composables/useVariantProps"
import { useSizeMapping } from "../../../composables/useSizeProps"

const props = withDefaults(
  defineProps<DuRadioProps>(),
  {
    checked: false,
    disabled: false,
    readonly: false,
    variant: "default",
    size: "default",
  },
)

const { colorClass } = useVariantMapping(props, "radio")
const { sizeClass } = useSizeMapping(props, "radio")

// A cancelled click leaves `checked` untouched and fires no change event.
function onClick(event: MouseEvent) {
  if (props.readonly) event.preventDefault()
}
</script>

<template>
  <input
    type="radio"
    :checked="checked"
    :disabled="disabled"
    :aria-readonly="readonly || undefined"
    :class="['radio', colorClass, sizeClass, readonly && 'cursor-default']"
    @click="onClick"
  />
</template> 