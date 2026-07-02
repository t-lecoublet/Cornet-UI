import { ref } from 'vue'
import type { DuCountdownFormat } from '../du-countdown.types'

interface CountdownValueProps {
  value?: number
  targetDate?: Date
  format: DuCountdownFormat
}

const calculators: Record<DuCountdownFormat, (difference: number) => number> = {
  days: (difference) => Math.floor(difference / (1000 * 60 * 60 * 24)),
  hours: (difference) => Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
  minutes: (difference) => Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
  seconds: (difference) => Math.floor((difference % (1000 * 60)) / 1000),
}

/** Owns the current displayed value and the targetDate-based time-remaining calculation. */
export function useCountdownValue(props: CountdownValueProps) {
  const currentValue = ref(props.value !== undefined ? props.value : 0)

  const getTotalTimeRemaining = () => {
    if (!props.targetDate) return 0
    const now = new Date().getTime()
    const target = props.targetDate.getTime()
    return Math.max(0, target - now)
  }

  const calculateTimeRemaining = () => {
    if (!props.targetDate) return 0
    const difference = getTotalTimeRemaining()
    const calculator = calculators[props.format] || calculators.seconds
    return calculator(difference)
  }

  const updateFromTargetDate = () => {
    if (props.targetDate) {
      currentValue.value = calculateTimeRemaining()
    }
  }

  return { currentValue, calculateTimeRemaining, getTotalTimeRemaining, updateFromTargetDate }
}
