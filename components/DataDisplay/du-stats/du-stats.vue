<script setup lang="ts">
import { computed } from "vue"
import DuStat from "../du-stat/du-stat.vue"
import { type DuStatsItem } from './du-stats.types'

const props = defineProps<{
  items?: DuStatsItem[]
  vertical?: boolean
  shadow?: boolean
  dash?: boolean
}>()

const verticalClass = computed(() => {
  return props.vertical ? "stats-vertical" : "stats-horizontal"
})

const shadowClass = computed(() => {
  return props.shadow ? "shadow" : ""
})

const dashClass = computed(() => {
  return props.dash ? "stats-dash" : ""
})
</script>

<template>
  <div :class="['stats', verticalClass, shadowClass, dashClass]">
    <template v-if="$slots.default">
      <slot></slot>
    </template>
    <template v-else-if="items">
      <DuStat
        v-for="(item, index) in items"
        :key="index"
        :figureClass="item.figureClass"
        :valueClass="item.valueClass"
        :descClass="item.descClass"
        :titleClass="item.titleClass"
      >
        <template v-if="item.figure || $slots.figure" #figure>
          <slot name="figure" :item="item">
            <component
              :is="item.figure"
              v-if="typeof item.figure === 'object'"
            />
            <img
              v-else-if="
                typeof item.figure === 'string' &&
                item.figure.startsWith('http')
              "
              :src="item.figure"
              :alt="item.title"
            />
            <div
              v-else-if="typeof item.figure === 'string'"
              v-html="item.figure"
            ></div>
          </slot>
        </template>

        <template v-if="item.title || $slots.title" #title>
          <slot name="title" :item="item">{{ item.title }}</slot>
        </template>

        <template v-if="item.value || $slots.value" #value>
          <slot name="value" :item="item">{{ item.value }}</slot>
        </template>

        <template v-if="item.description || $slots.desc" #desc>
          <slot name="desc" :item="item">{{ item.description }}</slot>
        </template>

        <template v-if="item.actions || $slots.actions" #actions>
          <slot name="actions" :item="item">
            <component
              :is="item.actions"
              v-if="typeof item.actions === 'object'"
            />
          </slot>
        </template>
      </DuStat>
    </template>
  </div>
</template> 


<style scoped>
.stats-dash {
  border:var(--border)dashed color-mix(in oklab,currentColor 10%,#0000);
}
</style>