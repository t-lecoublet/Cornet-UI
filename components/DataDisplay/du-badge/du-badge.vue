<script setup lang="ts">
import { computed } from 'vue'
import { type Variant, useVariantMapping } from '../../../composables/useVariantProps'
import { type Size, useSizeMapping } from '../../../composables/useSizeProps'

// Définition des types pour les props
const props = withDefaults(
  defineProps<{
    size?: Size
    variant?: Variant
    outline?: boolean
    dash?: boolean
    soft?: boolean
    ghost?: boolean
    icon?: boolean
  }>(),
  {
    size: 'default',
    variant: 'default',
    outline: false,
    dash: false,
    soft: false,
    ghost: false,
    icon: false,
  },
)

const { sizeClass } = useSizeMapping(props, 'badge')
const { colorClass } = useVariantMapping(props, 'badge')
const softClass = computed(() => {
  return props.soft ? 'badge-soft' : ''
})
const outlineClass = computed(() => {
  return props.outline ? 'badge-outline' : ''
})
const dashClass = computed(() => {
  return props.dash ? 'badge-dash' : ''
})
const ghostClass = computed(() => {
  return props.ghost ? 'badge-ghost' : ''
})
// SVG en fonction du type d'alerte
const svgIcons = {
  default: '',
  success: `<svg class="size-[1em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="currentColor" stroke-linejoin="miter" stroke-linecap="butt"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></circle><polyline points="7 13 10 16 17 8" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></polyline></g></svg>`,
  error: `<svg class="size-[1em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><g fill="currentColor"><path d="M7.638,3.495L2.213,12.891c-.605,1.048,.151,2.359,1.362,2.359H14.425c1.211,0,1.967-1.31,1.362-2.359L10.362,3.495c-.605-1.048-2.119-1.048-2.724,0Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><line x1="9" y1="6.5" x2="9" y2="10" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></line></g></svg>`,
  warning: `<svg class="size-[1em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="currentColor"><rect x="1.972" y="11" width="20.056" height="2" transform="translate(-4.971 12) rotate(-45)" fill="currentColor" stroke-width="0"></rect><path d="m12,23c-6.065,0-11-4.935-11-11S5.935,1,12,1s11,4.935,11,11-4.935,11-11,11Zm0-20C7.038,3,3,7.037,3,12s4.038,9,9,9,9-4.037,9-9S16.962,3,12,3Z" stroke-width="0" fill="currentColor"></path></g></svg>`,
  info: `<svg class="size-[1em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="currentColor" stroke-linejoin="miter" stroke-linecap="butt"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></circle><path d="m12,17v-5.5c0-.276-.224-.5-.5-.5h-1.5" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></path><circle cx="12" cy="7.25" r="1.25" fill="currentColor" stroke-width="2"></circle></g></svg>`,
}
const svgIcon = computed(() => {
  if (props.icon) {
    if (
      props.variant === 'default' ||
      props.variant === 'success' ||
      props.variant === 'error' ||
      props.variant === 'warning' ||
      props.variant === 'info'
    ) {
      return svgIcons[props.variant]
    }
    return ''
  }
  return ''
})
</script>
<template>
  <div
    :class="[
      'badge',
      sizeClass,
      colorClass,
      softClass,
      outlineClass,
      dashClass,
      ghostClass,
    ]"
  >
    <template v-if="svgIcon"><span v-html="svgIcon"></span></template>
    <slot></slot>
  </div>
</template> 