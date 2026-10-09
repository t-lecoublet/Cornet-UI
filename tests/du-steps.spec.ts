import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DuSteps from '../components/Navigation/du-steps/du-steps.vue'
import DuStepItem from '../components/Navigation/du-step-item/du-step-item.vue'

const items = [{ label: 'Register' }, { label: 'Choose plan' }, { label: 'Purchase' }]

describe('DuSteps', () => {
  it('colours the active steps with the variant, and only them', () => {
    const wrapper = mount(DuSteps, { props: { items, activeSteps: [0, 1], variant: 'success' } })
    const steps = wrapper.findAll('li')
    expect(steps[0].classes()).toContain('step-success')
    expect(steps[1].classes()).toContain('step-success')
    expect(steps[2].classes()).not.toContain('step-success')
  })

  it('defaults to the primary variant', () => {
    const wrapper = mount(DuSteps, { props: { items: [{ label: 'Register', active: true }] } })
    expect(wrapper.find('li').classes()).toContain('step-primary')
  })

  it('adds no colour class for variant="default"', () => {
    const wrapper = mount(DuSteps, { props: { items, activeSteps: [0], variant: 'default' } })
    expect(wrapper.find('li').classes()).toEqual(['step'])
  })

  it('follows a variant change after mount', async () => {
    const wrapper = mount(DuSteps, { props: { items, activeSteps: [0], variant: 'primary' } })
    await wrapper.setProps({ variant: 'error' })
    expect(wrapper.find('li').classes()).toContain('step-error')
    expect(wrapper.find('li').classes()).not.toContain('step-primary')
  })

  it('marks the furthest active step as the current one', () => {
    const wrapper = mount(DuSteps, { props: { items, activeSteps: [0, 1] } })
    const steps = wrapper.findAll('li')
    expect(steps[1].attributes('aria-current')).toBe('step')
    expect(steps[0].attributes('aria-current')).toBeUndefined()
    expect(steps[2].attributes('aria-current')).toBeUndefined()
  })
})

describe('DuStepItem', () => {
  it('colours an active item with the variant', () => {
    const wrapper = mount(DuStepItem, { props: { label: 'Register', active: true, variant: 'warning' } })
    expect(wrapper.find('li').classes()).toContain('step-warning')
  })

  it('leaves an inactive item uncoloured', () => {
    const wrapper = mount(DuStepItem, { props: { label: 'Register', variant: 'warning' } })
    expect(wrapper.find('li').classes()).toEqual(['step'])
  })
})
