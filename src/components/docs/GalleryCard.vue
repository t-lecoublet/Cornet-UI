<script setup lang="ts">
/**
 * One cell of the All Components gallery: a live miniature of the component,
 * and a link to its page.
 *
 * The preview only mounts once the card is near the viewport. Fifty
 * runtime-compiled templates on one route is enough work to be felt on a slow
 * machine, and all but a handful are below the fold on arrival.
 */
import { onBeforeUnmount, onMounted, ref, shallowRef, type ComponentPublicInstance } from 'vue'
import { RouterLink } from 'vue-router'
import LivePreview from '@/components/docs/LivePreview.vue'
import { LEVEL_ICON, LEVEL_STYLE, type ComponentLevelEntry } from '@/data/component-levels'

defineProps<{
  label: string
  path: string
  code?: string
  level?: ComponentLevelEntry
}>()

// A template ref on a component gives its instance, not its element, so the
// element is picked out here rather than reached for as `.value` later.
const card = shallowRef<Element | null>(null)
function setCard(target: Element | ComponentPublicInstance | null) {
  card.value = target != null && '$el' in target ? (target.$el as Element) : (target as Element | null)
}

const visible = ref(false)
let observer: IntersectionObserver | null = null

onMounted(() => {
  // No IntersectionObserver (older browser, a test environment): render
  // everything rather than an empty page.
  if (typeof IntersectionObserver === 'undefined') {
    visible.value = true
    return
  }
  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        visible.value = true
        observer?.disconnect()
        observer = null
      }
    },
    { rootMargin: '400px' },
  )
  if (card.value) observer.observe(card.value)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <RouterLink
    :ref="setCard"
    :to="path"
    class="group flex flex-col rounded-xl border border-base-300 bg-base-100 overflow-hidden transition-colors hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
  >
    <!--
      `pointer-events-none` and `aria-hidden`: the miniature is a picture of the
      component, not a working copy. Without it a click would land on the
      component's own button instead of the link, and a screen reader would walk
      an entire second widget before reaching the name of the page it leads to.
    -->
    <div
      class="h-36 px-4 py-3 flex items-center justify-center overflow-hidden bg-base-200/40 border-b border-base-300 pointer-events-none select-none"
      aria-hidden="true"
    >
      <div v-if="visible && code" class="scale-90 w-full flex items-center justify-center">
        <LivePreview :code="code" />
      </div>
      <span v-else-if="visible" class="text-xs text-base-content/30">No preview yet</span>
    </div>

    <div class="flex items-center gap-2 px-4 py-2.5">
      <span class="font-semibold text-sm group-hover:text-primary transition-colors">{{ label }}</span>

      <span
        v-if="level"
        class="ml-auto shrink-0 flex items-center justify-center p-1 rounded-full"
        :class="LEVEL_STYLE[level.level]"
        :title="level.reason"
      >
        <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" :d="LEVEL_ICON[level.level]" />
        </svg>
        <span class="sr-only">{{ level.level }}</span>
      </span>
    </div>
  </RouterLink>
</template>
