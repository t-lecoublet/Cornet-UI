import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DuFilter from '../components/DataInput/du-filter/du-filter.vue'
import type { DuFilterItem } from '../components/DataInput/du-filter/du-filter.types'

describe('DuFilter', () => {
  it('renders one radio input per item plus the reset button', () => {
    const items: DuFilterItem[] = [{ title: 'All' }, { title: 'Active' }, { title: 'Done' }]
    const wrapper = mount(DuFilter, { props: { items } })
    expect(wrapper.findAll('input[type="radio"]')).toHaveLength(4)
  })

  it('groups all radios under the same name (including the reset button)', () => {
    const items: DuFilterItem[] = [{ title: 'All' }, { title: 'Active' }]
    const wrapper = mount(DuFilter, { props: { items, name: 'my-filter' } })
    const names = wrapper.findAll('input[type="radio"]').map((i) => i.attributes('name'))
    expect(names.every((n) => n === 'my-filter')).toBe(true)
  })

  it('emits change with the clicked item', async () => {
    const items: DuFilterItem[] = [{ title: 'All' }, { title: 'Active' }]
    const wrapper = mount(DuFilter, { props: { items } })
    const radios = wrapper.findAll('input[type="radio"]')
    // radios[0] is the reset button; item radios start at index 1
    await radios[2].trigger('change')
    expect(wrapper.emitted('change')?.[0]).toEqual([items[1]])
  })

  it('emits change with undefined when the reset button is clicked', async () => {
    const items: DuFilterItem[] = [{ title: 'All' }]
    const wrapper = mount(DuFilter, { props: { items } })
    await wrapper.findAll('input[type="radio"]')[0].trigger('change')
    expect(wrapper.emitted('change')?.[0]).toEqual([undefined])
  })

  it('prefers the per-item buttonsArgs over the shared component-level ones', () => {
    const items: DuFilterItem[] = [{ title: 'A', buttonsArgs: { variant: 'secondary' } }]
    const wrapper = mount(DuFilter, { props: { items, buttonsArgs: { variant: 'primary' } } })
    const itemInput = wrapper.findAll('input[type="radio"]')[1]
    expect(itemInput.classes()).toContain('btn-secondary')
    expect(itemInput.classes()).not.toContain('btn-primary')
  })

  it('falls back to the shared buttonsArgs when an item has none', () => {
    const items: DuFilterItem[] = [{ title: 'A' }]
    const wrapper = mount(DuFilter, { props: { items, buttonsArgs: { variant: 'primary' } } })
    const itemInput = wrapper.findAll('input[type="radio"]')[1]
    expect(itemInput.classes()).toContain('btn-primary')
  })

  it('renders the default slot in manual mode', () => {
    const wrapper = mount(DuFilter, { slots: { default: '<button class="manual">Manual</button>' } })
    expect(wrapper.find('.manual').exists()).toBe(true)
  })
})
