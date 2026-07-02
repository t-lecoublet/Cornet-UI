import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DuDrawer from '../components/Layout/du-drawer/du-drawer.vue'

function mountDrawer(props: Record<string, unknown> = {}) {
  return mount(DuDrawer, { props })
}

describe('DuDrawer', () => {
  it('starts closed by default', () => {
    const wrapper = mountDrawer()
    const checkbox = wrapper.find('input.drawer-toggle')
    expect((checkbox.element as HTMLInputElement).checked).toBe(false)
  })

  it('respects the open prop', () => {
    const wrapper = mountDrawer({ open: true })
    const checkbox = wrapper.find('input.drawer-toggle')
    expect((checkbox.element as HTMLInputElement).checked).toBe(true)
  })

  it('toggleDrawer() exposed method flips state and emits both update events', async () => {
    const wrapper = mountDrawer()
    await (wrapper.vm as any).toggleDrawer()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([true])
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([true])
    const checkbox = wrapper.find('input.drawer-toggle')
    expect((checkbox.element as HTMLInputElement).checked).toBe(true)
  })

  it('reacts to external open prop changes', async () => {
    const wrapper = mountDrawer({ open: false })
    await wrapper.setProps({ open: true })
    const checkbox = wrapper.find('input.drawer-toggle')
    expect((checkbox.element as HTMLInputElement).checked).toBe(true)
  })

  it('reacts to external modelValue prop changes', async () => {
    const wrapper = mountDrawer({ modelValue: false })
    await wrapper.setProps({ modelValue: true })
    const checkbox = wrapper.find('input.drawer-toggle')
    expect((checkbox.element as HTMLInputElement).checked).toBe(true)
  })

  it('adds drawer-end class when position is end', () => {
    const wrapper = mountDrawer({ position: 'end' })
    expect(wrapper.find('.drawer').classes()).toContain('drawer-end')
  })

  it('applies responsive breakpoint classes for each responsive value', () => {
    const xl = mountDrawer({ responsive: 'xl' })
    expect(xl.find('.drawer').classes()).toContain('xl:drawer-open')

    const boolTrue = mountDrawer({ responsive: true })
    expect(boolTrue.find('.drawer').classes()).toContain('lg:drawer-open')

    const md = mountDrawer({ responsive: 'md' })
    expect(md.find('.drawer').classes()).toContain('md:drawer-open')

    const sm = mountDrawer({ responsive: 'sm' })
    expect(sm.find('.drawer').classes()).toContain('sm:drawer-open')
  })

  it('applies alwaysOpenOnLarge class only when responsive is falsy', () => {
    const wrapper = mountDrawer({ alwaysOpenOnLarge: true })
    expect(wrapper.find('.drawer').classes()).toContain('lg:drawer-open')
  })

  it('applies iconOnly sidebar wrapper classes', () => {
    const wrapper = mountDrawer({ iconOnly: true })
    const wrapperDiv = wrapper.findAll('.drawer-side > div')[0]
    expect(wrapperDiv.classes()).toContain('is-drawer-close:w-14')
    expect(wrapperDiv.classes()).toContain('is-drawer-open:w-64')
  })

  it('forwards sidebarClass/contentClass/overlayClass', () => {
    const wrapper = mountDrawer({
      sidebarClass: 'my-sidebar',
      contentClass: 'my-content',
      overlayClass: 'my-overlay',
    })
    expect(wrapper.find('.drawer-side').classes()).toContain('my-sidebar')
    expect(wrapper.find('.drawer-content').classes()).toContain('my-content')
    expect(wrapper.find('.drawer-overlay').classes()).toContain('my-overlay')
  })

  it('renders DuMenu in dynamic items mode', () => {
    const wrapper = mountDrawer({ items: [{ label: 'A' }, { label: 'B' }] })
    expect(wrapper.text()).toContain('A')
    expect(wrapper.text()).toContain('B')
  })

  it('renders the sidebar slot in manual mode', () => {
    const wrapper = mount(DuDrawer, {
      slots: { sidebar: '<div class="my-sidebar-content">Manual sidebar</div>' },
    })
    expect(wrapper.text()).toContain('Manual sidebar')
  })
})
