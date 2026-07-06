<script setup lang="ts">
import { type DuCarouselItemProps } from './du-carousel.types'

defineProps<DuCarouselItemProps>()
</script>

<template>
  <div :id="id" class="carousel-item">
    <slot></slot>
  </div>
</template> 