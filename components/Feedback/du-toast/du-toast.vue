<script setup lang="ts">
// The toast container: a fixed corner of the screen, and the two live regions
// a screen reader watches.
//
// Both regions are rendered whether or not they hold anything. A live region
// only announces what is added to it *after* it exists — one created at the
// same moment as its first message is usually missed entirely.
import { computed, ref, watch } from 'vue'
import { useToasts, type Toast } from '../../../composables/useToasts'
import { TOAST_ALERT_VARIANTS, type DuToastProps } from './du-toast.types'

// One Teleport, disabled when there is nowhere to send it: `<component :is>`
// cannot stand in for a `<template>`, and duplicating the container would
// duplicate the live regions with it.
const props = withDefaults(
  defineProps<DuToastProps>(),
  {
    horizontalPosition: undefined,
    verticalPosition: undefined,
    to: undefined,
    dismissLabel: 'Dismiss',
  },
)

const { toasts, dismiss, pause, resume } = useToasts()

const regions = computed((): { key: string, role: string, live: 'polite' | 'assertive', items: Toast[] }[] => [
  {
    key: 'polite',
    role: 'status',
    live: 'polite',
    items: toasts.value.filter((toast) => toast.politeness !== 'assertive'),
  },
  {
    key: 'assertive',
    role: 'alert',
    live: 'assertive',
    items: toasts.value.filter((toast) => toast.politeness === 'assertive'),
  },
])

const alertClass = (variant: Toast['variant']) => TOAST_ALERT_VARIANTS[variant ?? 'default'] ?? ''

const horizontalClass = computed(() => (
  props.horizontalPosition ? `toast-${props.horizontalPosition}` : ''
))

const verticalClass = computed(() => (
  props.verticalPosition ? `toast-${props.verticalPosition}` : ''
))

// Hovering a toast or tabbing into one holds every countdown: a message that
// disappears while it is being read, or reached for, is the everyday version
// of WCAG 2.2.1's un-pausable time limit.
const container = ref<HTMLElement | null>(null)

watch(container, (el, _old, onCleanup) => {
  if (el == null) {
    return
  }
  el.addEventListener('mouseenter', pause)
  el.addEventListener('mouseleave', resume)
  el.addEventListener('focusin', pause)
  el.addEventListener('focusout', resume)
  onCleanup(() => {
    el.removeEventListener('mouseenter', pause)
    el.removeEventListener('mouseleave', resume)
    el.removeEventListener('focusin', pause)
    el.removeEventListener('focusout', resume)
  })
}, { immediate: true, flush: 'sync' })

defineSlots<{
  /** Manual mode: write the toasts yourself. Still supported, still additive. */
  default?: () => unknown
  /** Replace how a queued toast is rendered. */
  toast?: (props: { toast: Toast, dismiss: () => void }) => unknown
}>()
</script>

<template>
  <Teleport :to="to ?? 'body'" :disabled="!to" defer>
    <div
      ref="container"
      :class="['toast z-999', to && 'absolute max-w-full', horizontalClass, verticalClass]"
    >
      <!-- `display: contents` so a region groups its toasts for assistive tech
           without becoming a flex item between the container and them. -->
      <div
        v-for="region in regions"
        :key="region.key"
        :role="region.role"
        :aria-live="region.live"
        aria-atomic="false"
        class="contents"
      >
        <TransitionGroup :duration="220" name="du-toast">
          <div v-for="toast in region.items" :key="toast.id" class="du-toast-item">
            <slot name="toast" :toast="toast" :dismiss="() => dismiss(toast.id)">
              <div :class="['alert', alertClass(toast.variant)]">
                <div>
                  <p v-if="toast.title" class="font-bold">{{ toast.title }}</p>
                  <p v-if="toast.message">{{ toast.message }}</p>
                </div>
                <button
                  type="button"
                  class="btn btn-sm btn-square btn-ghost"
                  :aria-label="dismissLabel"
                  @click="dismiss(toast.id)"
                >
                  ✕
                </button>
              </div>
            </slot>
          </div>
        </TransitionGroup>
      </div>

      <slot />
    </div>
  </Teleport>
</template>

<style scoped>
.du-toast-enter-active,
.du-toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.du-toast-enter-from,
.du-toast-leave-to {
  opacity: 0;
  transform: translateY(0.5rem);
}

/* Motion is a preference, not a detail: honour it. */
@media (prefers-reduced-motion: reduce) {
  .du-toast-enter-active,
  .du-toast-leave-active {
    transition: none;
  }

  .du-toast-enter-from,
  .du-toast-leave-to {
    transform: none;
  }
}
</style>
