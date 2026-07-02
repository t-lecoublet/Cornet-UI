import { computed, type Ref } from 'vue'
import type { DuCountdownFormat } from '../du-countdown.types'

interface CountdownDisplayProps {
  format: DuCountdownFormat
}

/** Derives digit-padding, formatted text, aria-label and CSS custom properties from the current value. */
export function useCountdownDisplay(props: CountdownDisplayProps, currentValue: Ref<number>) {
  const digits = computed(() => {
    return currentValue.value > 99 ? 3 : 2
  })

  const formattedValue = computed(() => {
    const value = Math.min(999, Math.max(0, currentValue.value))
    return value.toString().padStart(digits.value, '0')
  })

  const ariaLabel = computed(() => {
    return `${currentValue.value} ${props.format}`
  })

  const cssVars = computed(() => ({
    '--value': Math.min(999, Math.max(0, currentValue.value)),
    '--digits': digits.value,
  }))

  return { digits, formattedValue, ariaLabel, cssVars }
}
