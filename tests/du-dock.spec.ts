import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import DuDock from '../components/Navigation/du-dock/du-dock.vue'
import type { DuDockItem } from '../components/Navigation/du-dock/du-dock.types'

describe('DuDock', () => {
  it('renders a component icon', () => {
    const IconComp = { render: () => h('span', { class: 'my-icon' }) }
    const items: DuDockItem[] = [{ label: 'Home', icon: IconComp }]
    const wrapper = mount(DuDock, { props: { items } })
    expect(wrapper.find('.my-icon').exists()).toBe(true)
  })

  it('renders an http image icon', () => {
    const items: DuDockItem[] = [{ label: 'Home', icon: 'http://example.com/icon.png' }]
    const wrapper = mount(DuDock, { props: { items } })
    expect(wrapper.find('img').attributes('src')).toBe('http://example.com/icon.png')
  })

  it('renders an inline svg/html string icon', () => {
    const items: DuDockItem[] = [{ label: 'Home', icon: '<svg data-testid="inline-icon"></svg>' }]
    const wrapper = mount(DuDock, { props: { items } })
    expect(wrapper.find('[data-testid="inline-icon"]').exists()).toBe(true)
  })

  it('does not crash or render <null> when icon is explicitly null', () => {
    const items: DuDockItem[] = [{ label: 'Home', icon: null }]
    expect(() => mount(DuDock, { props: { items } })).not.toThrow()
  })

  it('sets the active item on click and emits change', async () => {
    const items: DuDockItem[] = [{ label: 'A' }, { label: 'B' }]
    const wrapper = mount(DuDock, { props: { items } })
    const buttons = wrapper.findAll('button')
    await buttons[1].trigger('click')
    expect(wrapper.emitted('change')?.[0]).toEqual([items[1]])
    expect(buttons[1].classes()).toContain('dock-active')
  })
})
