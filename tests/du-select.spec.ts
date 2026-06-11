import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DuSelect from '../components/DataInput/du-select/du-select.vue'

const options = [
  { id: 1, name: 'One' },
  { id: 2, name: 'Two' },
  { id: 3, name: 'Three' },
]

function mountSelect(props: Record<string, unknown> = {}) {
  return mount(DuSelect, {
    props: { options, ...props },
    attachTo: document.body,
  })
}

describe('DuSelect', () => {
  it('shows the English default placeholder', () => {
    const wrapper = mountSelect()
    expect(wrapper.text()).toContain('Select...')
  })

  it('opens the listbox and renders the options', async () => {
    const wrapper = mountSelect()
    await wrapper.find('[role="combobox"]').trigger('click')
    const items = wrapper.findAll('[role="option"]')
    expect(items).toHaveLength(3)
    expect(wrapper.text()).toContain('Two')
  })

  it('emits update:modelValue with the trackBy value on selection', async () => {
    const wrapper = mountSelect()
    await wrapper.find('[role="combobox"]').trigger('click')
    await wrapper.findAll('[role="option"]')[1].trigger('mousedown')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2])
    expect(wrapper.emitted('select')?.[0]).toEqual([options[1]])
  })

  it('emits the full object when returnObject is set', async () => {
    const wrapper = mountSelect({ returnObject: true })
    await wrapper.find('[role="combobox"]').trigger('click')
    await wrapper.findAll('[role="option"]')[0].trigger('mousedown')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([options[0]])
  })

  it('accumulates values in multiple mode', async () => {
    const wrapper = mountSelect({ multiple: true, modelValue: [] })
    await wrapper.find('[role="combobox"]').trigger('click')
    await wrapper.findAll('[role="option"]')[0].trigger('mousedown')
    await wrapper.findAll('[role="option"]')[2].trigger('mousedown')
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted?.at(-1)).toEqual([[1, 3]])
  })

  it('clears the selection when clicking the selected option with clearable', async () => {
    const wrapper = mountSelect({ clearable: true, modelValue: 2 })
    await wrapper.find('[role="combobox"]').trigger('click')
    await wrapper.findAll('[role="option"]')[1].trigger('mousedown')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([null])
  })

  it('shows the no-results text when the search has no match', async () => {
    const wrapper = mountSelect({ searchable: true, searchableInside: true })
    await wrapper.find('[role="combobox"]').trigger('click')
    const search = wrapper.findAll('input').at(-1)!
    await search.setValue('zzz')
    expect(wrapper.text()).toContain('No options found')
  })

  it('supports keyboard navigation (ArrowDown + Enter)', async () => {
    const wrapper = mountSelect()
    const combobox = wrapper.find('[role="combobox"]')
    await combobox.trigger('keydown', { key: 'ArrowDown' }) // opens
    await combobox.trigger('keydown', { key: 'ArrowDown' }) // highlights index 1
    await combobox.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2])
  })
})
