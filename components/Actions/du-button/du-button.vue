<script setup lang="ts">
import { useSizeMapping } from '../../../composables/useSizeProps'
import { useVariantMapping } from '../../../composables/useVariantProps'
import { computed, inject } from 'vue'
import { type DuButtonProps, type DuButtonElementTag } from './du-button.types'

const props = withDefaults(
  defineProps<DuButtonProps>(),
  {
    customClass: undefined,
    size: 'default',
    variant: 'default',
    outline: false,
    soft: false,
    dash: false,
    active: false,
    ghost: false,
    link: false,
    wide: false,
    disabled: undefined,
    square: false,
    circle: false,
    block: false,
    type: undefined,
    href: undefined,
    value: undefined,
    inputType: undefined,
    label: undefined,
  },
)

const isInDropdownTrigger = inject('isDropdownTrigger', false)
const inJoin = inject("isInJoin", false)
const filterName = inject('filterName', undefined)

const { sizeClass } = useSizeMapping(props, 'btn')
const { colorClass } = useVariantMapping(props, 'btn')

const elementTag = computed((): DuButtonElementTag => {
  if (props.as) return props.as
  if (isInDropdownTrigger) return 'div'
  if (filterName) return 'input'

  return 'button'
})

const isInputElement = computed(() => elementTag.value === 'input')
const isAnchorElement = computed(() => elementTag.value === 'a')

const buttonAttributes = computed(() => {
  const attrs: Record<string, any> = {}

  if (filterName) {
    attrs.name = filterName
    attrs.type = 'radio'
  } else if (isInputElement.value) {
    attrs.type = props.inputType || 'button'
    attrs.value = props.value || ''
  } else if (isAnchorElement.value) {
    attrs.href = props.href || '#'
    attrs.role = 'button'
  } else if (isInDropdownTrigger) {
    attrs.tabindex = '0'
    attrs.role = 'button'
  } else {
    attrs.type = props.type || 'button'
  }
  return attrs
})
</script>
<template>
  <component
    :is="elementTag"
    v-bind="buttonAttributes"
    :class="[
      'btn',
      customClass,
      sizeClass,
      colorClass,
      soft && 'btn-soft',
      outline && 'btn-outline',
      dash && 'btn-dash',
      active && 'btn-active',
      ghost && 'btn-ghost',
      link && 'btn-link',
      wide && 'btn-wide',
      square && 'btn-square',
      circle && 'btn-circle',
      block && 'btn-block',
      inJoin && 'join-item',
    ]"
    :aria-label="props.label"
    :disabled="props.disabled"
  >
    <slot v-if="!isInputElement"></slot>
  </component>
</template>
