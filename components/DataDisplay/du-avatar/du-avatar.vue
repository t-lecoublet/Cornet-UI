<script setup lang="ts">
import { type Size, useSizeMapping} from '../../../composables/useSizeProps'
import { useVariantMapping, type Variant } from '../../../composables/useVariantProps'
import { computed } from 'vue'
import { type DuAvatarRoundedClass, type DuAvatarRounded, type DuAvatarMaskClass, type DuAvatarMask } from './du-avatar.types'

const props = withDefaults(
  defineProps<{
    size?: Size
    variant?: Variant
    rounded?: DuAvatarRounded
    offline?: boolean
    online?: boolean
    placeholder?: boolean
    ring?: boolean
    ringColor?: string
    ringOffset?: number
    mask?: DuAvatarMask
  }>(),
  {
    size: 'default',
    variant: 'default',
    rounded: 'default',
    offline: false,
    online: false,
    placeholder: false,
    ring: false,
    ringColor: 'primary',
    ringOffset: 2
  },
)

const { sizeClass } = useSizeMapping(props, 'avatar')
const { colorClass } = useVariantMapping(props, 'avatar')

const roundedClass = computed(() => {
  return {
    default: '',
    rounded: 'rounded',
    full: 'rounded-full',
    xs: 'rounded-xs',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
  }[props.rounded] as DuAvatarRoundedClass
})

const maskClass = computed(() => {
  if (!props.mask) return ''
  return 'mask ' + `mask-${props.mask}` as DuAvatarMaskClass
})

const ringClass = computed(() => {
  if (!props.ring) return ''
  return `ring-${props.ringOffset} ring-${props.ringColor} ring-offset-base-100 ring-offset-2 ring-2`
})

const statusClass = computed(() => {
  if (props.online) return 'avatar-online'
  if (props.offline) return 'avatar-offline'
  return ''
})

const placeholderClass = computed(() => {
  return props.placeholder ? 'avatar-placeholder' : ''
})
</script>

<template>
  <div :class="['avatar', statusClass, placeholderClass]">
    <div :class="['bg-base-300', sizeClass, roundedClass, maskClass, ringClass, colorClass]">
      <slot />
    </div>
  </div>
</template>

<style scoped>

.avatar-xs {
  width: calc(var(--spacing)*8);
}

.avatar-sm {
  width: calc(var(--spacing)*12);
}

.avatar-md {
  width: calc(var(--spacing)*16);
}

.avatar-lg {
  width: calc(var(--spacing)*24);
}

.avatar-xl {
  width: calc(var(--spacing)*28);
}

.avatar-primary {
  background-color: var(--color-primary);
  color: var(--color-primary-content);
}

.avatar-secondary {
  background-color: var(--color-secondary);
  color: var(--color-secondary-content);
}

.avatar-accent {
  background-color: var(--color-accent);
  color: var(--color-accent-content);
}

.avatar-neutral {
  background-color: var(--color-neutral);
  color: var(--color-neutral-content);
}

.avatar-info {
  background-color: var(--color-info);
  color: var(--color-info-content);
}

.avatar-success {
  background-color: var(--color-success);
  color: var(--color-success-content);
}

.avatar-warning {
  background-color: var(--color-warning);
  color: var(--color-warning-content);
}

.avatar-error {
  background-color: var(--color-error);
  color: var(--color-error-content);
}
</style>