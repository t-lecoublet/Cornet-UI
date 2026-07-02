<script setup lang="ts">
import { computed } from "vue"
import { type DuCarouselProps } from './du-carousel.types'
import DuCarouselItem from './du-carousel-item.vue'

const props = withDefaults(
  defineProps<DuCarouselProps>(),
  {
    items: undefined,
    start: true,
    center: false,
    end: false,
    vertical: false,
  },
)

const positionClass = computed(() => {
  if (props.center) return "carousel-center"
  if (props.end) return "carousel-end"
  if (props.start) return "carousel-start"
  return null
})
</script>

<template>
  <div :class="['carousel', positionClass, { 'carousel-vertical': vertical }]">
    <template v-if="items && items.length">
      <DuCarouselItem
        v-for="(item, index) in items"
        :key="item.id ?? index"
        :id="item.id"
        :class="item.customClass"
      >
        <img v-if="item.src" :src="item.src" :alt="item.alt ?? `Slide ${index + 1}`" />
        <template v-else-if="item.content">{{ item.content }}</template>
      </DuCarouselItem>
    </template>
    <slot v-else></slot>
  </div>
</template> 