import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import DuMenu from '../components/Navigation/du-menu/du-menu.vue'
import type { DuMenuItemData } from '../components/Navigation/du-menu/du-menu.types'

// Dispatches directly on the focused element with bubbles:true, mirroring real
// browser behavior where a bubbled keydown keeps event.target as the focused
// element (unlike @vue/test-utils' `.trigger()`, which sets target to the
// queried element itself).
async function pressKey(element: HTMLElement, key: string) {
  element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
  await nextTick()
}

const items: DuMenuItemData[] = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'About', href: '/about', disabled: true },
  { label: 'Contact', href: '/contact' },
]

describe('DuMenu', () => {
  it('renders one option per item', () => {
    const wrapper = mount(DuMenu, { props: { items } })
    expect(wrapper.findAll('[role="option"]')).toHaveLength(3)
  })

  it('does not give a disabled item role=option', () => {
    const wrapper = mount(DuMenu, { props: { items } })
    const links = wrapper.findAll('a')
    const aboutLink = links.find((l) => l.text().includes('About'))
    expect(aboutLink?.attributes('role')).toBeUndefined()
  })

  it('emits itemClick when a top-level item is clicked', async () => {
    const wrapper = mount(DuMenu, { props: { items } })
    await wrapper.findAll('[role="option"]')[0].trigger('click')
    expect(wrapper.emitted('itemClick')?.[0]).toEqual([items[0]])
  })

  it('emits subItemClick when a nested item is clicked', async () => {
    const nested: DuMenuItemData[] = [
      { label: 'Parent', subItems: [{ label: 'Child', href: '/child' }] },
    ]
    const wrapper = mount(DuMenu, { props: { items: nested } })
    const options = wrapper.findAll('[role="option"]')
    await options[options.length - 1].trigger('click')
    expect(wrapper.emitted('subItemClick')?.[0]).toEqual([nested[0].subItems![0]])
  })

  it('renders the default slot in manual mode', () => {
    const wrapper = mount(DuMenu, { slots: { default: '<li class="manual">Manual</li>' } })
    expect(wrapper.find('.manual').exists()).toBe(true)
  })

  it('sets aria-orientation based on direction', () => {
    const vertical = mount(DuMenu, { props: { items, direction: 'vertical' } })
    expect(vertical.find('ul').attributes('aria-orientation')).toBe('vertical')

    const horizontal = mount(DuMenu, { props: { items, direction: 'horizontal' } })
    expect(horizontal.find('ul').attributes('aria-orientation')).toBe('horizontal')
  })

  it('moves focus to the next option on ArrowDown (vertical)', async () => {
    const wrapper = mount(DuMenu, { props: { items }, attachTo: document.body })
    const options = wrapper.findAll('[role="option"]').map((w) => w.element as HTMLElement)
    options[0].focus()
    await pressKey(options[0], 'ArrowDown')
    expect(document.activeElement).toBe(options[1])
    wrapper.unmount()
  })

  it('wraps to the first option on ArrowDown from the last option', async () => {
    const wrapper = mount(DuMenu, { props: { items }, attachTo: document.body })
    const options = wrapper.findAll('[role="option"]').map((w) => w.element as HTMLElement)
    options[options.length - 1].focus()
    await pressKey(options[options.length - 1], 'ArrowDown')
    expect(document.activeElement).toBe(options[0])
    wrapper.unmount()
  })

  it('moves focus to the previous option on ArrowUp and wraps at the start', async () => {
    const wrapper = mount(DuMenu, { props: { items }, attachTo: document.body })
    const options = wrapper.findAll('[role="option"]').map((w) => w.element as HTMLElement)
    options[0].focus()
    await pressKey(options[0], 'ArrowUp')
    expect(document.activeElement).toBe(options[options.length - 1])
    wrapper.unmount()
  })

  it('jumps to first/last option on Home/End', async () => {
    const wrapper = mount(DuMenu, { props: { items }, attachTo: document.body })
    const options = wrapper.findAll('[role="option"]').map((w) => w.element as HTMLElement)
    options[1].focus()
    await pressKey(options[1], 'End')
    expect(document.activeElement).toBe(options[options.length - 1])

    await pressKey(options[options.length - 1], 'Home')
    expect(document.activeElement).toBe(options[0])
    wrapper.unmount()
  })

  it('uses ArrowRight/ArrowLeft instead of ArrowDown/ArrowUp when horizontal', async () => {
    const wrapper = mount(DuMenu, { props: { items, direction: 'horizontal' }, attachTo: document.body })
    const options = wrapper.findAll('[role="option"]').map((w) => w.element as HTMLElement)
    options[0].focus()
    await pressKey(options[0], 'ArrowDown')
    expect(document.activeElement).toBe(options[0])

    await pressKey(options[0], 'ArrowRight')
    expect(document.activeElement).toBe(options[1])
    wrapper.unmount()
  })

  it('makes onClick-only items (no href) focusable and keyboard-navigable', async () => {
    const onClickItems: DuMenuItemData[] = [
      { label: 'Save', onClick: () => {} },
      { label: 'Delete', onClick: () => {} },
    ]
    const wrapper = mount(DuMenu, { props: { items: onClickItems }, attachTo: document.body })
    const options = wrapper.findAll('[role="option"]').map((w) => w.element as HTMLElement)
    expect(options[0].getAttribute('tabindex')).toBe('0')

    options[0].focus()
    expect(document.activeElement).toBe(options[0])
    await pressKey(options[0], 'ArrowDown')
    expect(document.activeElement).toBe(options[1])
    wrapper.unmount()
  })

  it('does not make disabled items focusable', () => {
    const withDisabled: DuMenuItemData[] = [{ label: 'Off', disabled: true, href: '/off' }]
    const wrapper = mount(DuMenu, { props: { items: withDisabled } })
    const link = wrapper.find('a')
    expect(link.attributes('tabindex')).toBeUndefined()
  })

  it('uses vertical keys inside a nested submenu even when the root menu is horizontal', async () => {
    // Nested submenu <ul>s never get a direction class (always laid out
    // vertically), so they must navigate with Up/Down regardless of the
    // root menu's own (horizontal) direction.
    const nested: DuMenuItemData[] = [
      { label: 'Parent', subItems: [{ label: 'Child A', href: '/a' }, { label: 'Child B', href: '/b' }] },
    ]
    const wrapper = mount(DuMenu, {
      props: { items: nested, direction: 'horizontal' },
      attachTo: document.body,
    })
    const options = wrapper.findAll('[role="option"]').map((w) => w.element as HTMLElement)
    // options[0] = Parent (root level, horizontal), options[1] = Child A, options[2] = Child B (submenu, vertical)

    // Root level still uses horizontal keys.
    options[0].focus()
    await pressKey(options[0], 'ArrowDown')
    expect(document.activeElement).toBe(options[0])

    // Submenu level uses vertical keys, not horizontal ones.
    options[1].focus()
    await pressKey(options[1], 'ArrowRight')
    expect(document.activeElement).toBe(options[1])
    await pressKey(options[1], 'ArrowDown')
    expect(document.activeElement).toBe(options[2])
    wrapper.unmount()
  })

  it('scopes ArrowDown navigation to the focused submenu level', async () => {
    const nested: DuMenuItemData[] = [
      { label: 'Parent', subItems: [{ label: 'Child A', href: '/a' }, { label: 'Child B', href: '/b' }] },
    ]
    const wrapper = mount(DuMenu, { props: { items: nested }, attachTo: document.body })
    const options = wrapper.findAll('[role="option"]').map((w) => w.element as HTMLElement)
    // options[0] = Parent, options[1] = Child A, options[2] = Child B
    options[1].focus()
    await pressKey(options[1], 'ArrowDown')
    expect(document.activeElement).toBe(options[2])
    // wraps back within the submenu, not up to Parent
    await pressKey(options[2], 'ArrowDown')
    expect(document.activeElement).toBe(options[1])
    wrapper.unmount()
  })
})
