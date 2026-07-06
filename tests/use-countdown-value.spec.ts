import { describe, expect, it, vi, afterEach } from 'vitest'
import { reactive } from 'vue'
import { useCountdownValue } from '../components/DataDisplay/du-countdown/composables/useCountdownValue'

describe('useCountdownValue', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('initializes currentValue from props.value', () => {
    const props = reactive({ value: 42, targetDate: undefined, format: 'seconds' as const })
    const { currentValue } = useCountdownValue(props)
    expect(currentValue.value).toBe(42)
  })

  it('initializes currentValue to 0 when no value is given', () => {
    const props = reactive({ value: undefined, targetDate: undefined, format: 'seconds' as const })
    const { currentValue } = useCountdownValue(props)
    expect(currentValue.value).toBe(0)
  })

  it('calculates seconds remaining until targetDate', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'))
    const props = reactive({
      value: undefined,
      targetDate: new Date('2026-01-01T00:00:07.000Z'),
      format: 'seconds' as const,
    })
    const { calculateTimeRemaining } = useCountdownValue(props)
    expect(calculateTimeRemaining()).toBe(7)
  })

  it('calculates days/hours/minutes remaining until targetDate', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'))
    const targetDate = new Date('2026-01-03T02:30:00.000Z')

    const daysProps = reactive({ value: undefined, targetDate, format: 'days' as const })
    expect(useCountdownValue(daysProps).calculateTimeRemaining()).toBe(2)

    const hoursProps = reactive({ value: undefined, targetDate, format: 'hours' as const })
    expect(useCountdownValue(hoursProps).calculateTimeRemaining()).toBe(2)

    const minutesProps = reactive({ value: undefined, targetDate, format: 'minutes' as const })
    expect(useCountdownValue(minutesProps).calculateTimeRemaining()).toBe(30)
  })

  it('returns 0 for calculateTimeRemaining and getTotalTimeRemaining without a targetDate', () => {
    const props = reactive({ value: undefined, targetDate: undefined, format: 'seconds' as const })
    const { calculateTimeRemaining, getTotalTimeRemaining } = useCountdownValue(props)
    expect(calculateTimeRemaining()).toBe(0)
    expect(getTotalTimeRemaining()).toBe(0)
  })

  it('updateFromTargetDate sets currentValue from the calculation', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'))
    const props = reactive({
      value: undefined,
      targetDate: new Date('2026-01-01T00:00:15.000Z'),
      format: 'seconds' as const,
    })
    const { currentValue, updateFromTargetDate } = useCountdownValue(props)
    expect(currentValue.value).toBe(0)
    updateFromTargetDate()
    expect(currentValue.value).toBe(15)
  })

  it('updateFromTargetDate is a no-op without a targetDate', () => {
    const props = reactive({ value: 5, targetDate: undefined, format: 'seconds' as const })
    const { currentValue, updateFromTargetDate } = useCountdownValue(props)
    updateFromTargetDate()
    expect(currentValue.value).toBe(5)
  })
})
