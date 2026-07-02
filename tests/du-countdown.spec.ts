import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import DuCountdown from '../components/DataDisplay/du-countdown/du-countdown.vue'

describe('DuCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the initial value padded to 2 digits by default', () => {
    const wrapper = mount(DuCountdown, { props: { value: 5, autoStart: false } })
    expect(wrapper.find('span > span').text()).toBe('05')
  })

  it('pads to 3 digits when the value is over 99', () => {
    const wrapper = mount(DuCountdown, { props: { value: 150, autoStart: false } })
    expect(wrapper.find('span > span').text()).toBe('150')
  })

  it('sets aria-label from the current value and format', () => {
    const wrapper = mount(DuCountdown, { props: { value: 42, format: 'minutes', autoStart: false } })
    expect(wrapper.find('span').attributes('aria-label')).toBe('42 minutes')
  })

  it('decrements every second when autoStart is true with a plain value', async () => {
    const wrapper = mount(DuCountdown, { props: { value: 3, autoStart: true } })
    expect(wrapper.find('span > span').text()).toBe('03')
    vi.advanceTimersByTime(1000)
    await nextTick()
    expect(wrapper.find('span > span').text()).toBe('02')
    vi.advanceTimersByTime(1000)
    await nextTick()
    expect(wrapper.find('span > span').text()).toBe('01')
  })

  it('emits `end` and stops when the value reaches 0', async () => {
    const wrapper = mount(DuCountdown, { props: { value: 1, autoStart: true } })
    vi.advanceTimersByTime(1000)
    await nextTick()
    expect(wrapper.find('span > span').text()).toBe('00')
    expect(wrapper.emitted('end')).toHaveLength(1)
    vi.advanceTimersByTime(1000)
    await nextTick()
    expect(wrapper.emitted('end')).toHaveLength(1)
  })

  it('does not start automatically when autoStart is false', async () => {
    const wrapper = mount(DuCountdown, { props: { value: 3, autoStart: false } })
    vi.advanceTimersByTime(3000)
    await nextTick()
    expect(wrapper.find('span > span').text()).toBe('03')
  })

  it('starts counting down from a targetDate in seconds format', async () => {
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'))
    const targetDate = new Date('2026-01-01T00:00:05.000Z')
    const wrapper = mount(DuCountdown, { props: { targetDate, autoStart: true, format: 'seconds' } })
    await nextTick()
    expect(wrapper.find('span > span').text()).toBe('05')
    vi.advanceTimersByTime(1000)
    await nextTick()
    expect(wrapper.find('span > span').text()).toBe('04')
  })

  it('emits `end` when the targetDate is reached', async () => {
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'))
    const targetDate = new Date('2026-01-01T00:00:02.000Z')
    const wrapper = mount(DuCountdown, { props: { targetDate, autoStart: true, format: 'seconds' } })
    vi.advanceTimersByTime(2000)
    await nextTick()
    expect(wrapper.find('span > span').text()).toBe('00')
    expect(wrapper.emitted('end')).toHaveLength(1)
  })

  it('exposes start/stop/reset for external control', async () => {
    const wrapper = mount(DuCountdown, { props: { value: 5, autoStart: false } })
    const vm = wrapper.vm as unknown as { start: () => void; stop: () => void; reset: () => void }

    vm.start()
    vi.advanceTimersByTime(1000)
    await nextTick()
    expect(wrapper.find('span > span').text()).toBe('04')

    vm.stop()
    vi.advanceTimersByTime(2000)
    await nextTick()
    expect(wrapper.find('span > span').text()).toBe('04')

    vm.reset()
    await nextTick()
    expect(wrapper.find('span > span').text()).toBe('05')
  })

  it('reacts to external value prop changes', async () => {
    const wrapper = mount(DuCountdown, { props: { value: 5, autoStart: false } })
    await wrapper.setProps({ value: 20 })
    expect(wrapper.find('span > span').text()).toBe('20')
  })

  it('resets and restarts when targetDate prop changes while autoStart is true', async () => {
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'))
    const wrapper = mount(DuCountdown, {
      props: { targetDate: new Date('2026-01-01T00:00:05.000Z'), autoStart: true, format: 'seconds' },
    })
    vi.advanceTimersByTime(2000)
    await nextTick()
    expect(wrapper.find('span > span').text()).toBe('03')

    await wrapper.setProps({ targetDate: new Date('2026-01-01T00:00:12.000Z') })
    await nextTick()
    expect(wrapper.find('span > span').text()).toBe('10')
  })

  it('applies customClass to the root element', () => {
    const wrapper = mount(DuCountdown, { props: { value: 5, autoStart: false, customClass: 'my-class' } })
    expect(wrapper.classes()).toContain('my-class')
  })

  it('sets --value and --digits CSS custom properties', () => {
    const wrapper = mount(DuCountdown, { props: { value: 7, autoStart: false } })
    const style = (wrapper.find('span > span').element as HTMLElement).style
    expect(style.getPropertyValue('--value')).toBe('7')
    expect(style.getPropertyValue('--digits')).toBe('2')
  })
})
