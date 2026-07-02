<script setup lang="ts">
import { computed, provide } from 'vue'
import { type DuAccordionItemData } from './du-accordion.types'

const props = withDefaults(
  defineProps<{
    items?: DuAccordionItemData[]
    name?: string
    modifier?:
      | 'collapse-arrow'
      | 'collapse-plus'
      | 'collapse-open'
      | 'collapse-close'
    customClass?: string
  }>(),
  {
    items: undefined,
    name: 'accordion',
    modifier: undefined,
    customClass: '',
  },
)

const accordionName = computed(() => {
  return (
    props.name || `accordion-${Math.random().toString(36).substring(2, 9)}`
  )
})

// Provide the accordion name to child components
provide('accordionName', accordionName.value)
</script>

<template>
  <!-- Dynamic items mode -->
  <template v-if="items">
    <div
      v-for="(item, index) in items"
      :key="index"
      :class="[
        'collapse',
        'bg-base-100 border border-base-300',
        modifier,
        item.customClass || customClass,
      ]"
    >
      <input
        type="radio"
        :name="accordionName"
        :checked="item.checked ? true : undefined"
      />
      <div class="collapse-title">
        <slot name="title" :item="item" :index="index">
          <slot :name="`title-${index}`" :item="item" :index="index">
            {{ item.title }}
          </slot>
        </slot>
      </div>
      <div class="collapse-content">
        <slot name="content" :item="item" :index="index">
          <slot :name="`content-${index}`" :item="item" :index="index">
            {{ item.content }}
          </slot>
        </slot>
      </div>
    </div>
  </template>

  <!-- Manual mode -->
  <template v-else>
    <slot></slot>
  </template>
</template> 