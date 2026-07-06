import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'
import type { DuCountdownEmit } from '../du-countdown.types'

interface CountdownTimerProps {
  value?: number
  targetDate?: Date
  autoStart: boolean
}

/** Owns the setInterval lifecycle (start/stop/reset), prop-driven restarts, and the `end` emit. */
export function useCountdownTimer(
  props: CountdownTimerProps,
  emit: DuCountdownEmit,
  currentValue: Ref<number>,
  updateFromTargetDate: () => void,
  getTotalTimeRemaining: () => number,
) {
  const intervalId = ref<number | null>(null)

  const stopCountdown = () => {
    if (intervalId.value !== null) {
      clearInterval(intervalId.value)
      intervalId.value = null
    }
  }

  const startCountdown = () => {
    if (intervalId.value !== null) return

    updateFromTargetDate()

    intervalId.value = window.setInterval(() => {
      if (props.targetDate) {
        updateFromTargetDate()
        if (getTotalTimeRemaining() === 0) {
          emit('end')
          stopCountdown()
        }
      } else if (currentValue.value > 0) {
        currentValue.value--
        if (currentValue.value === 0) {
          emit('end')
          stopCountdown()
        }
      } else {
        stopCountdown()
      }
    }, 1000)
  }

  const resetCountdown = () => {
    stopCountdown()
    if (props.value !== undefined) {
      currentValue.value = props.value
    } else if (props.targetDate) {
      updateFromTargetDate()
    } else {
      currentValue.value = 0
    }
  }

  watch(
    () => props.value,
    (newValue) => {
      if (newValue !== undefined) {
        currentValue.value = newValue
      }
    },
  )

  watch(
    () => props.targetDate,
    () => {
      resetCountdown()
      if (props.autoStart) {
        startCountdown()
      }
    },
  )

  onMounted(() => {
    if (props.autoStart) {
      startCountdown()
    }
  })

  onBeforeUnmount(() => {
    stopCountdown()
  })

  return { startCountdown, stopCountdown, resetCountdown }
}
