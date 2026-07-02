<script setup lang="ts">
import { type DuCountdownProps, type DuCountdownEmit } from './du-countdown.types'
import { useCountdownValue } from './composables/useCountdownValue'
import { useCountdownDisplay } from './composables/useCountdownDisplay'
import { useCountdownTimer } from './composables/useCountdownTimer'

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

// Exposer les méthodes pour le contrôle externe
defineExpose({
  start: startCountdown,
  stop: stopCountdown,
  reset: resetCountdown,
})
</script>

<template>
  <span
    :class="['countdown', customClass]"
    aria-live="polite"
    :aria-label="ariaLabel"
  >
    <span :style="cssVars">{{ formattedValue }}</span>
  </span>
</template>
