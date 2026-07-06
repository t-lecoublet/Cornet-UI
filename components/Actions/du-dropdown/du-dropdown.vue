<script setup lang="ts">
import { computed, provide } from 'vue'
import { type DuDropdownProps, type DuDropdownPlacementInput, type DuDropdownPlacementValue } from './du-dropdown.types'

const props = withDefaults(
  defineProps<DuDropdownProps>(),
  {
    hover: false,
    open: false,
    placement: 'bottom',
  },
)

provide('isDropdownTrigger', true)

const placementToClass = (value: DuDropdownPlacementValue): string => {
  return `dropdown-${value}`
}

const getPlacementClasses = (input: DuDropdownPlacementInput): string[] => {
  if (!input) return []

  if (typeof input === 'string') {
    if (input.includes(',')) {
      return input.split(',').map(s => s.trim()).filter(Boolean).map(s => placementToClass(s as DuDropdownPlacementValue))
    }
    return [placementToClass(input as DuDropdownPlacementValue)]
  }

  if (Array.isArray(input)) {
    return input.map(placementToClass)
  }

  if (typeof input === 'object') {
    return Object.entries(input)
      .filter(([, enabled]) => enabled)
      .map(([key]) => placementToClass(key as DuDropdownPlacementValue))
  }

  return []
}

const placementClass = computed(() => {
  const classes = getPlacementClasses(props.placement)
  return classes.join(' ')
})

const hoverClass = computed(() => {
  return props.hover ? 'dropdown-hover' : ''
})

const openClass = computed(() => {
  return props.open ? 'dropdown-open' : ''
})
</script>

<template>
  <div :class="['dropdown', placementClass, hoverClass, openClass]">
    <!-- Bind triggerProps on your trigger element (v-bind="triggerProps")
         to get the expected role/tabindex/aria attributes for free. -->
    <slot name="trigger" :trigger-props="{ role: 'button', tabindex: 0, 'aria-haspopup': 'true' }"></slot>
    <div class="dropdown-content bg-base-100 rounded-box shadow-sm" tabindex="0">
      <slot name="content"></slot>
      <slot></slot>
    </div>
  </div>
</template>