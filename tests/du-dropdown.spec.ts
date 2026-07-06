import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DuDropdown from '../components/Actions/du-dropdown/du-dropdown.vue'

describe('DuDropdown', () => {
  it('applies a single string placement class', () => {
    const wrapper = mount(DuDropdown, { props: { placement: 'top' } })
    expect(wrapper.classes()).toContain('dropdown-top')
  })

  it('applies multiple placement classes from a comma-separated string', () => {
    const wrapper = mount(DuDropdown, { props: { placement: 'top,end' } })
    expect(wrapper.classes()).toContain('dropdown-top')
    expect(wrapper.classes()).toContain('dropdown-end')
  })

  it('applies placement classes from an array', () => {
    const wrapper = mount(DuDropdown, { props: { placement: ['top', 'end'] } })
    expect(wrapper.classes()).toContain('dropdown-top')
    expect(wrapper.classes()).toContain('dropdown-end')
  })

  it('applies placement classes only for keys enabled (true) in a placement object', () => {
    const wrapper = mount(DuDropdown, { props: { placement: { top: true, end: false, start: true } } })
    expect(wrapper.classes()).toContain('dropdown-top')
    expect(wrapper.classes()).toContain('dropdown-start')
    expect(wrapper.classes()).not.toContain('dropdown-end')
  })

  it('defaults to bottom placement', () => {
    const wrapper = mount(DuDropdown)
    expect(wrapper.classes()).toContain('dropdown-bottom')
  })

  it('applies dropdown-hover when hover is true', () => {
    const wrapper = mount(DuDropdown, { props: { hover: true } })
    expect(wrapper.classes()).toContain('dropdown-hover')
  })

  it('applies dropdown-open when open is true', () => {
    const wrapper = mount(DuDropdown, { props: { open: true } })
    expect(wrapper.classes()).toContain('dropdown-open')
  })

  it('exposes role/tabindex/aria-haspopup via the trigger slot scope', () => {
    const wrapper = mount(DuDropdown, {
      slots: {
        trigger: `<template #trigger="{ triggerProps }"><button v-bind="triggerProps" class="my-trigger">Open</button></template>`,
      },
    })
    const trigger = wrapper.find('.my-trigger')
    expect(trigger.attributes('role')).toBe('button')
    expect(trigger.attributes('tabindex')).toBe('0')
    expect(trigger.attributes('aria-haspopup')).toBe('true')
  })

  it('renders the content slot inside dropdown-content', () => {
    const wrapper = mount(DuDropdown, { slots: { content: '<p class="body">Hi</p>' } })
    expect(wrapper.find('.dropdown-content .body').exists()).toBe(true)
  })

  it('renders the default slot inside dropdown-content', () => {
    const wrapper = mount(DuDropdown, { slots: { default: '<p class="body">Hi</p>' } })
    expect(wrapper.find('.dropdown-content .body').exists()).toBe(true)
  })

  it('applies a default background/rounding/shadow to dropdown-content', () => {
    const wrapper = mount(DuDropdown, { slots: { default: '<p>Hi</p>' } })
    const content = wrapper.find('.dropdown-content')
    expect(content.classes()).toContain('bg-base-100')
    expect(content.classes()).toContain('rounded-box')
    expect(content.classes()).toContain('shadow-sm')
  })
})
