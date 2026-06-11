<script setup lang="ts">
import { computed, provide } from 'vue'
import { type PlacementInput, type PlacementValue } from './du-dropdown.types'

const props = withDefaults(
  defineProps<{
    hover?: boolean
    open?: boolean
    placement?: PlacementInput
  }>(),
  {
    hover: false,
    open: false,
    placement: 'bottom',
  },
)

provide('isDropdownTrigger', true)

const placementToClass = (value: PlacementValue): string => {
  return `dropdown-${value}`
}

const getPlacementClasses = (input: PlacementInput): string[] => {
  if (!input) return []

  if (typeof input === 'string') {
    if (input.includes(',')) {
      return input.split(',').map(s => s.trim()).filter(Boolean).map(s => placementToClass(s as PlacementValue))
    }
    return [placementToClass(input as PlacementValue)]
  }

  if (Array.isArray(input)) {
    return input.map(placementToClass)
  }

  if (typeof input === 'object') {
    const keys = Object.keys(input)
    if (keys.every(key => key in { start: 1, center: 1, end: 1, top: 1, bottom: 1, left: 1, right: 1 })) {
      return keys.map(key => placementToClass(key as PlacementValue))
    }
    return Object.entries(input)
      .filter(([, enabled]) => enabled)
      .map(([key]) => placementToClass(key as PlacementValue))
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
    <slot name="trigger"></slot>
    <div class="dropdown-content">
      <slot name="content"></slot>
      <slot></slot>
    </div>
  </div>
</template>