<script setup lang="ts">
import { inject } from 'vue'

withDefaults(
  defineProps<{
    checked?: boolean
    customClass?: string
    title?: string
  }>(),
  {
    checked: false,
    customClass: '',
    title: '',
  },
)

// Get the accordion name from parent
const accordionName = inject('accordionName', '')
</script>

<template>
  <div :class="['collapse', 'bg-base-100 border border-base-300', customClass]">
    <input
      type="radio"
      :name="accordionName"
      :checked="checked ? true : undefined"
    />
    <div class="collapse-title">
      <slot name="title">
        {{ title }}
      </slot>
    </div>
    <div class="collapse-content">
      <slot></slot>
    </div>
  </div>
</template> 