import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DuSearch from '../components/DataInput/du-search/du-search.vue'

const listValues = [
  { id: 1, name: 'One' },
  { id: 2, name: 'Two' },
  { id: 3, name: 'Three' },
]

function mountSearch(props: Record<string, unknown> = {}) {
  return mount(DuSearch, {
    props: { name: 'search', id: 'search', listValues, ...props },
    attachTo: document.body,
  })
}

describe('DuSearch', () => {
  it('opens the listbox and renders options on input', async () => {
    const wrapper = mountSearch()
    const input = wrapper.find('input')
    await input.setValue('T')
    const items = wrapper.findAll('[role="option"]')
    expect(items.length).toBe(2)
    expect(wrapper.text()).toContain('Two')
    expect(wrapper.text()).toContain('Three')
  })

  it('selects an option via click and emits update:modelValue/select', async () => {
    const wrapper = mountSearch()
    const input = wrapper.find('input')
    await input.setValue('Two')
    await wrapper.findAll('[role="option"]')[0].trigger('mousedown')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([listValues[1]])
    expect(wrapper.emitted('select')?.at(-1)).toEqual([listValues[1]])
  })

  it('accumulates values in multiple mode', async () => {
    const wrapper = mountSearch({ multiple: true, modelValue: [] })
    const input = wrapper.find('input')
    await input.setValue('One')
    await wrapper.findAll('[role="option"]')[0].trigger('mousedown')
    await input.setValue('One, Three')
    await wrapper.findAll('[role="option"]')[0].trigger('mousedown')
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted?.at(-1)).toEqual([[listValues[0], listValues[2]]])
  })

  it('adds a new option when addOption is set and value has no match', async () => {
    const wrapper = mountSearch({ addOption: true, modelValue: null })
    const input = wrapper.find('input')
    await input.setValue('Brand New')
    await wrapper.find('[role="option"]').trigger('mousedown')
    expect(wrapper.emitted('add')?.at(-1)).toEqual([{ id: null, name: 'Brand New' }])
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([{ id: null, name: 'Brand New' }])
  })

  it('autoCommit selects the matching option on blur', async () => {
    const wrapper = mountSearch({ autoCommit: true, modelValue: null })
    const input = wrapper.find('input')
    await input.setValue('Two')
    await input.trigger('focusout')
    await new Promise((r) => setTimeout(r, 10))
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([listValues[1]])
  })

  it('clears the selection when clicking the selected option with clearable', async () => {
    const wrapper = mountSearch({ clearable: true, modelValue: listValues[1] })
    const input = wrapper.find('input')
    await input.trigger('focus')
    await wrapper.findAll('[role="option"]')[1].trigger('mousedown')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([null])
  })

  it('shows the no-results text when the search has no match', async () => {
    const wrapper = mountSearch({ noResultsText: 'Nothing found' })
    const input = wrapper.find('input')
    await input.setValue('zzz')
    expect(wrapper.text()).toContain('Nothing found')
  })

  it('supports keyboard navigation (ArrowDown + Enter)', async () => {
    const wrapper = mountSearch({ modelValue: null })
    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.trigger('keydown', { key: 'ArrowDown' })
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([listValues[0]])
  })

  it('removes the last selected tag on Backspace in multiple mode when query is empty', async () => {
    const wrapper = mountSearch({ multiple: true, modelValue: [listValues[0], listValues[1]] })
    const input = wrapper.find('input')
    await input.trigger('keydown', { key: 'Backspace' })
    expect(wrapper.emitted('remove')?.at(-1)).toEqual([listValues[1]])
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[listValues[0]]])
  })

  it('Escape closes the dropdown and clears an empty in-progress query in single mode', async () => {
    const wrapper = mountSearch({ modelValue: listValues[0] })
    const input = wrapper.find('input')
    await input.setValue('')
    await input.trigger('keydown', { key: 'Escape' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([null])
  })

  it('bypasses internal filtering when remoteSearch is set', async () => {
    const wrapper = mountSearch({ remoteSearch: true })
    const input = wrapper.find('input')
    await input.setValue('this matches nothing locally')
    const items = wrapper.findAll('[role="option"]')
    expect(items.length).toBe(listValues.length)
  })
})
