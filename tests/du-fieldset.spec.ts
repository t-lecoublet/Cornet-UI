import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DuFieldset from '../components/DataInput/du-fieldset/du-fieldset.vue'

describe('DuFieldset', () => {
  it('does not render an empty legend when legend is not provided', () => {
    const wrapper = mount(DuFieldset)
    expect(wrapper.find('legend').exists()).toBe(false)
  })

  it('renders the legend when provided', () => {
    const wrapper = mount(DuFieldset, { props: { legend: 'Personal info' } })
    expect(wrapper.find('legend').text()).toBe('Personal info')
  })

  it('does not render the label when not provided', () => {
    const wrapper = mount(DuFieldset)
    expect(wrapper.find('.fieldset-label').exists()).toBe(false)
  })

  it('renders the label when provided', () => {
    const wrapper = mount(DuFieldset, { props: { label: 'Helper text' } })
    expect(wrapper.find('.fieldset-label').text()).toBe('Helper text')
  })

  it('renders the default slot content', () => {
    const wrapper = mount(DuFieldset, { slots: { default: '<input class="my-input" />' } })
    expect(wrapper.find('.my-input').exists()).toBe(true)
  })
})
