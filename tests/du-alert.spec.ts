import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import DuAlert from '../components/Feedback/du-alert/du-alert.vue'

describe('DuAlert', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('is visible by default', () => {
    const wrapper = mount(DuAlert)
    expect(wrapper.find('[role="alert"]').exists()).toBe(true)
  })

  it('hides and emits close when the dismiss button is clicked', async () => {
    const wrapper = mount(DuAlert, { props: { dismissible: true } })
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('does not render a dismiss button when dismissible is false', () => {
    const wrapper = mount(DuAlert, { props: { dismissible: false } })
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('auto-dismisses and emits close after the timeout when autoDismissible is true', async () => {
    const wrapper = mount(DuAlert, { props: { autoDismissible: true } })
    expect(wrapper.find('[role="alert"]').exists()).toBe(true)

    vi.advanceTimersByTime(5000)
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('does not auto-dismiss when autoDismissible is false', async () => {
    const wrapper = mount(DuAlert, { props: { autoDismissible: false } })
    vi.advanceTimersByTime(10000)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[role="alert"]').exists()).toBe(true)
    expect(wrapper.emitted('close')).toBeUndefined()
  })
})
