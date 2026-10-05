<script setup lang="ts">
import { type DuCountdownProps, type DuCountdownEmit } from './du-countdown.types'
import { useCountdownValue } from './composables/useCountdownValue'
import { useCountdownDisplay } from './composables/useCountdownDisplay'
import { useCountdownTimer } from './composables/useCountdownTimer'

// `role="timer"` is a live region by definition; the explicit `aria-live`
// on the element keeps older assistive tech in step.
//
// The comment lives here rather than above the root: a leading template
// comment makes the component a fragment, and a fragment cannot inherit
// the attributes a consumer passes.
const props = withDefaults(
  defineProps<DuCountdownProps>(),
  {
    value: undefined,
    targetDate: undefined,
    format: "seconds",
    separator: ":",
    customClass: "",
    autoStart: true,
  },
)

const emit = defineEmits<DuCountdownEmit>()

const { currentValue, getTotalTimeRemaining, updateFromTargetDate } = useCountdownValue(props)
const { formattedValue, ariaLabel, cssVars } = useCountdownDisplay(props, currentValue)
const { startCountdown, stopCountdown, resetCountdown } = useCountdownTimer(
  props,
  emit,
  currentValue,
  updateFromTargetDate,
  getTotalTimeRemaining,
)

// Expose the methods for external control
defineExpose({
  start: startCountdown,
  stop: stopCountdown,
  reset: resetCountdown,
})
</script>

<template>
  <span
    role="timer"
    :class="['countdown', customClass]"
    aria-live="polite"
    :aria-label="ariaLabel"
  >
    <span :style="cssVars">{{ formattedValue }}</span>
  </span>
</template>
