import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import DuTabs from '../components/Navigation/du-tabs/du-tabs.vue'
import type { DuTabItem } from '../components/Navigation/du-tabs/du-tabs.types'

const items: DuTabItem[] = [
  { label: 'One', content: 'Content one' },
  { label: 'Two', content: 'Content two', active: true },
  { label: 'Three' },
]

describe('DuTabs', () => {
  it('renders one radio input per item, named after the `name` prop', () => {
    const wrapper = mount(DuTabs, { props: { items, name: 'grp' } })
    const inputs = wrapper.findAll('input[type="radio"]')
    expect(inputs).toHaveLength(3)
    inputs.forEach((input) => expect(input.attributes('name')).toBe('grp'))
  })

  it('marks the active item radio as checked', () => {
    const wrapper = mount(DuTabs, { props: { items } })
    const inputs = wrapper.findAll('input[type="radio"]')
    expect((inputs[0].element as HTMLInputElement).checked).toBe(false)
    expect((inputs[1].element as HTMLInputElement).checked).toBe(true)
  })

  it('emits update:modelValue with the clicked index exactly once', async () => {
    const wrapper = mount(DuTabs, { props: { items } })
    await wrapper.findAll('label.tab')[2].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[2]])
  })

  it('calls the item onClick callback exactly once per click', async () => {
    const onClick = vi.fn()
    const withCallback: DuTabItem[] = [{ label: 'A', onClick }]
    const wrapper = mount(DuTabs, { props: { items: withCallback } })
    await wrapper.find('label.tab').trigger('click')
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('only renders tab-content for items that have content', () => {
    const wrapper = mount(DuTabs, { props: { items } })
    expect(wrapper.findAll('.tab-content')).toHaveLength(2)
    expect(wrapper.text()).toContain('Content one')
    expect(wrapper.text()).toContain('Content two')
  })

  it('applies the type class', () => {
    const wrapper = mount(DuTabs, { props: { items, type: 'border' } })
    expect(wrapper.find('.tabs').classes()).toContain('tabs-border')
  })

  it('applies the size class', () => {
    const wrapper = mount(DuTabs, { props: { items, size: 'lg' } })
    expect(wrapper.find('.tabs').classes()).toContain('tabs-lg')
  })

  it('sets aria-label on the root', () => {
    const wrapper = mount(DuTabs, { props: { items, ariaLabel: 'Section tabs' } })
    expect(wrapper.find('.tabs').attributes('aria-label')).toBe('Section tabs')
  })

  it('renders the default slot instead of items when provided', () => {
    const wrapper = mount(DuTabs, {
      props: { items },
      slots: { default: '<div class="manual-tab">Manual</div>' },
    })
    expect(wrapper.find('.manual-tab').exists()).toBe(true)
    expect(wrapper.findAll('input[type="radio"]')).toHaveLength(0)
  })

  it('renders an inline HTML string icon via v-html', () => {
    const withIcon: DuTabItem[] = [{ label: 'A', icon: '<svg class="my-icon"></svg>' }]
    const wrapper = mount(DuTabs, { props: { items: withIcon } })
    expect(wrapper.find('.my-icon').exists()).toBe(true)
  })

  it('renders an http image icon as a sized img tag', () => {
    const withIcon: DuTabItem[] = [{ label: 'A', icon: 'https://example.com/icon.png' }]
    const wrapper = mount(DuTabs, { props: { items: withIcon } })
    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe('https://example.com/icon.png')
    expect(img.attributes('alt')).toBe('A')
    expect(img.classes()).toContain('w-5')
    expect(img.classes()).toContain('h-5')
  })

  it('renders a root-relative image icon (local asset) as an img tag', () => {
    const withIcon: DuTabItem[] = [{ label: 'A', icon: '/logo.svg' }]
    const wrapper = mount(DuTabs, { props: { items: withIcon } })
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('/logo.svg')
  })

  it('renders per-index content slot override', () => {
    const wrapper = mount(DuTabs, {
      props: { items },
      slots: { 'content-0': '<p class="custom-content">Custom</p>' },
    })
    expect(wrapper.find('.custom-content').exists()).toBe(true)
  })
})
