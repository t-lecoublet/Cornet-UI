import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DuCard from '../components/DataDisplay/du-card/du-card.vue'

describe('DuCard', () => {
  it('applies card-side unconditionally when side is true', () => {
    const wrapper = mount(DuCard, { props: { side: true } })
    expect(wrapper.classes()).toContain('card-side')
  })

  it('applies card-compact sm:card-normal when responsive is true', () => {
    const wrapper = mount(DuCard, { props: { responsive: true } })
    expect(wrapper.classes()).toContain('card-compact')
    expect(wrapper.classes()).toContain('sm:card-normal')
  })

  it('applies no side/responsive classes by default', () => {
    const wrapper = mount(DuCard)
    expect(wrapper.classes()).not.toContain('card-side')
    expect(wrapper.classes()).not.toContain('card-compact')
  })

  it('applies bordered/dash/imageFull classes', () => {
    const wrapper = mount(DuCard, { props: { bordered: true, dash: true, imageFull: true } })
    expect(wrapper.classes()).toContain('card-border')
    expect(wrapper.classes()).toContain('card-dash')
    expect(wrapper.classes()).toContain('image-full')
  })

  it('renders the title and default slot inside card-body when no body slot is given', () => {
    const wrapper = mount(DuCard, { props: { title: 'Hello' }, slots: { default: 'Content' } })
    expect(wrapper.find('.card-body .card-title').text()).toBe('Hello')
    expect(wrapper.find('.card-body').text()).toContain('Content')
  })

  it('uses the body slot verbatim when provided, bypassing the default card-body wrapper', () => {
    const wrapper = mount(DuCard, { slots: { body: '<div class="custom-body">Custom</div>' } })
    expect(wrapper.find('.custom-body').exists()).toBe(true)
    expect(wrapper.find('.card-body').exists()).toBe(false)
  })
})
