<script setup lang="ts">
import { computed } from 'vue'
import { type Size, useSizeMapping } from '../../../composables/useSizeProps'

const props = withDefaults(
  defineProps<{
    size?: Size
    bordered?: boolean
    dash?: boolean
    side?: boolean
    imageFull?: boolean
    responsive?: boolean
    title?: string
  }>(),
  {
    size: 'default',
    bordered: false,
    dash: false,
    side: false,
    imageFull: false,
    responsive: false,
    title: '',
  },
)

const { sizeClass } = useSizeMapping(props, 'card')

const borderedClass = computed(() => {
  return props.bordered ? 'card-border' : ''
})

const dashClass = computed(() => {
  return props.dash ? 'card-dash' : ''
})

const sideClass = computed(() => {
  return props.side ? 'card-side' : ''
})

const responsiveClass = computed(() => {
  return props.responsive ? 'card-compact sm:card-normal' : ''
})

const imageFullClass = computed(() => {
  return props.imageFull ? 'image-full' : ''
})
</script>

<template>
  <div
    :class="[
      'card',
      sizeClass,
      borderedClass,
      dashClass,
      sideClass,
      responsiveClass,
      imageFullClass,
    ]"
  >
    <slot name="figure"></slot>

    <template v-if="$slots.body">
      <slot name="body"></slot>
      <slot name="default"></slot>
    </template>

    <div
      v-else-if="$slots.title || $slots.actions || $slots.default || title"
      class="card-body"
    >
      <h2 v-if="title || $slots.title" class="card-title flex-wrap">
        <template v-if="title">{{ title }}</template>
        <slot name="title"></slot>
      </h2>

      <slot></slot>

      <div v-if="$slots.actions" class="card-actions">
        <slot name="actions"></slot>
      </div>
    </div>

    <slot name="content"></slot>
  </div>
</template> 