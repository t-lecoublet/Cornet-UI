<script setup lang="ts">
import { useSizeMapping } from '../../../composables/useSizeProps'
import { type DuCardProps } from './du-card.types'

const props = withDefaults(
  defineProps<DuCardProps>(),
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
</script>

<template>
  <div
    :class="[
      'card',
      sizeClass,
      bordered && 'card-border',
      dash && 'card-dash',
      side && 'card-side',
      responsive && 'card-compact sm:card-normal',
      imageFull && 'image-full',
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