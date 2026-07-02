import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import DuFab from '../components/Actions/du-fab/du-fab.vue'

describe('DuFab', () => {
  it('renders the default slot in manual mode', () => {
    const wrapper = mount(DuFab, { slots: { default: 'Manual content' } })
    expect(wrapper.text()).toContain('Manual content')
    expect(wrapper.find('.fab').exists()).toBe(true)
  })

  it('applies the corner-specific position classes', () => {
    const corners: Array<[string, string[]]> = [
      ['bottom-right', ['bottom-4', 'right-4']],
      ['bottom-left', ['bottom-4', 'left-4']],
      ['top-right', ['top-4', 'right-4']],
      ['top-left', ['top-4', 'left-4']],
    ]
    for (const [position, expectedClasses] of corners) {
      const wrapper = mount(DuFab, { props: { position: position as any } })
      const classes = wrapper.find('.fab').classes()
      expect(classes).toContain('absolute')
      for (const expected of expectedClasses) {
        expect(classes).toContain(expected)
      }
    }
  })

  it('does not apply absolute classes when absolute is false', () => {
    const wrapper = mount(DuFab, { props: { absolute: false } })
    expect(wrapper.find('.fab').classes().join(' ')).not.toContain('absolute')
  })

  it('renders speed dial items with default index label when no icon/label', async () => {
    const wrapper = mount(DuFab, {
      props: { items: [{}, {}] },
    })
    expect(wrapper.text()).toContain('1')
    expect(wrapper.text()).toContain('2')
  })

  it('renders speed dial item label wrapper when item has a label and no modifier', () => {
    const wrapper = mount(DuFab, {
      props: { items: [{ label: 'Settings' }] },
    })
    expect(wrapper.text()).toContain('Settings')
  })

  it('suppresses the label wrapper when modifier is set', () => {
    const wrapper = mount(DuFab, {
      props: { items: [{ label: 'Settings' }], modifier: 'fab-flower' },
    })
    // label text should not appear as a standalone label-wrapper text node
    expect(wrapper.html()).not.toContain('<div>Settings')
  })

  it('renders an http image icon for items', () => {
    const wrapper = mount(DuFab, {
      props: { items: [{ icon: 'http://example.com/icon.png', label: 'Pic' }] },
    })
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('http://example.com/icon.png')
  })

  it('renders a root-relative image icon (local asset) for items', () => {
    const wrapper = mount(DuFab, {
      props: { items: [{ icon: '/logo.svg', label: 'Pic' }] },
    })
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('/logo.svg')
  })

  it('renders an inline svg/html string icon via v-html for items', () => {
    const wrapper = mount(DuFab, {
      props: { items: [{ icon: '<svg data-testid="inline-icon"></svg>' }] },
    })
    expect(wrapper.find('[data-testid="inline-icon"]').exists()).toBe(true)
  })

  it('renders a component icon for items', () => {
    const IconComp = { render: () => h('span', { class: 'my-icon' }) }
    const wrapper = mount(DuFab, {
      props: { items: [{ icon: IconComp }] },
    })
    expect(wrapper.find('.my-icon').exists()).toBe(true)
  })

  it('wraps items with a tooltip when item.tooltip is set', () => {
    const wrapper = mount(DuFab, {
      props: { items: [{ label: 'Tip me', tooltip: 'Hello tooltip' }] },
    })
    expect(wrapper.html()).toContain('Hello tooltip')
  })

  it('triggers item onClick handler', async () => {
    let clicked = false
    const wrapper = mount(DuFab, {
      props: { items: [{ label: 'Click me', onClick: () => { clicked = true } }] },
    })
    await wrapper.find('button').trigger('click')
    expect(clicked).toBe(true)
  })

  it('renders the main action button with default variant when unset', () => {
    const wrapper = mount(DuFab, {
      props: { mainAction: { label: 'Main' } },
    })
    expect(wrapper.text()).toContain('Main')
  })

  it('renders a close button with custom label', () => {
    const wrapper = mount(DuFab, {
      props: { mainAction: { label: 'Main' }, closeButton: { label: 'Shut' } },
    })
    expect(wrapper.text()).toContain('Shut')
  })
})
