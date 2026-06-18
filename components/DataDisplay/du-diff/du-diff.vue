<script setup lang="ts">
import { type DIFFAspectRatio } from './du-diff.types'

withDefaults(
  defineProps<{
    item1?: string
    item2?: string
    aspectRatio?: DIFFAspectRatio | string | null
  }>(),
  {
    item1: undefined,
    item2: undefined,
    aspectRatio: "",
  },
)
</script>

<template>
  <figure :class="['diff', aspectRatio]">
    <div class="diff-item-1">
      <slot name="item1">
        <img v-if="item1" :src="item1" alt="Image 1" />
        <div
          v-else
          class="bg-primary text-primary-content flex items-center justify-center h-full"
        >
          Image 1
        </div>
      </slot>
    </div>
    <div class="diff-item-2">
      <slot name="item2">
        <img v-if="item2" :src="item2" alt="Image 2" />
        <div
          v-else
          class="bg-secondary text-secondary-content flex items-center justify-center h-full"
        >
          Image 2
        </div>
      </slot>
    </div>
    <div class="diff-resizer"></div>
  </figure>
</template>