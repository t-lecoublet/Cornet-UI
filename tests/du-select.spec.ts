import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import DuSelect from '../components/DataInput/du-select/du-select.vue'

const options = [
  { id: 1, name: 'One' },
  { id: 2, name: 'Two' },
  { id: 3, name: 'Three' },
]

function mountSelect(props: Record<string, unknown> = {}, extra: Record<string, unknown> = {}) {
  return mount(DuSelect, {
    props: { options, ...props },
    attachTo: document.body,
    ...extra,
  })
}

/** The combobox element — the trigger button, or the field itself when searchable. */
const combobox = (wrapper: ReturnType<typeof mountSelect>) => wrapper.find('[role="combobox"]')
const optionsOf = (wrapper: ReturnType<typeof mountSelect>) => wrapper.findAll('[role="option"]')

async function openSelect(wrapper: ReturnType<typeof mountSelect>) {
  await combobox(wrapper).trigger('click')
}

describe('DuSelect rendering', () => {
  it('shows the English default placeholder', () => {
    expect(mountSelect().text()).toContain('Select...')
  })

  it('shows the selected label instead of the placeholder', () => {
    const wrapper = mountSelect({ modelValue: 2 })
    expect(wrapper.text()).toContain('Two')
    expect(wrapper.text()).not.toContain('Select...')
  })

  it('opens the listbox and renders the options', async () => {
    const wrapper = mountSelect()
    await openSelect(wrapper)
    expect(optionsOf(wrapper)).toHaveLength(3)
    expect(wrapper.text()).toContain('Two')
  })

  it('scales the controls inside the field with its size', async () => {
    const large = mountSelect({ size: 'lg', multiple: true, modelValue: [1] })
    // One step below the field, so a chip still fits inside it.
    expect(large.find('.badge').classes()).toContain('badge-md')
    expect(large.find('.badge button').classes()).toContain('btn-md')

    const tiny = mountSelect({ size: 'xs', multiple: true, modelValue: [1] })
    expect(tiny.find('.badge').classes()).toContain('badge-xs')

    // The default field is md-sized, so its chips stay sm as they always were.
    const untouched = mountSelect({ multiple: true, modelValue: [1] })
    expect(untouched.find('.badge').classes()).toContain('badge-sm')
  })

  it('sizes the dropdown controls from subSize, independently of the field', async () => {
    // Tiny field, huge list: nothing in the dropdown should follow the field.
    const wrapper = mountSelect({
      size: 'xs',
      subSize: 'xl',
      checkboxes: true,
      searchableInside: true,
      multiple: true,
      modelValue: [],
    })
    await openSelect(wrapper)

    expect(wrapper.find('[role="searchbox"]').classes()).toContain('input-xl')
    expect(wrapper.find('[role="option"] input[type="checkbox"]').classes()).toContain('checkbox-lg')
  })

  it('renders a chip per selection in multiple mode', () => {
    const wrapper = mountSelect({ multiple: true, modelValue: [1, 3] })
    expect(wrapper.findAll('.badge')).toHaveLength(2)
    expect(wrapper.text()).toContain('One')
    expect(wrapper.text()).toContain('Three')
  })

  it('falls back through value/id and label/name when trackBy/labelBy miss', async () => {
    const wrapper = mountSelect({ options: [{ value: 'a', label: 'Alpha' }] })
    await openSelect(wrapper)
    expect(wrapper.text()).toContain('Alpha')
    await optionsOf(wrapper)[0]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['a'])
  })

  it('handles plain string options', async () => {
    const wrapper = mountSelect({ options: ['Apple', 'Pear'] })
    await openSelect(wrapper)
    await optionsOf(wrapper)[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['Pear'])
  })
})

describe('DuSelect selection', () => {
  it('emits the trackBy value and the option on selection', async () => {
    const wrapper = mountSelect()
    await openSelect(wrapper)
    await optionsOf(wrapper)[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2])
    expect(wrapper.emitted('select')?.[0]).toEqual([options[1]])
  })

  it('emits the whole option when returnObject is set', async () => {
    const wrapper = mountSelect({ returnObject: true })
    await openSelect(wrapper)
    await optionsOf(wrapper)[0]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([options[0]])
  })

  it('resolves a model holding whole options', async () => {
    const wrapper = mountSelect({ returnObject: true, modelValue: options[2] })
    await openSelect(wrapper)
    expect(optionsOf(wrapper)[2]!.attributes('aria-selected')).toBe('true')
  })

  it('resolves a model option that is a copy, not the same object', async () => {
    // What a parent hands back after a round trip through an API or a store:
    // same identity under trackBy, different object. Matching by reference
    // would miss it.
    const wrapper = mountSelect({ returnObject: true, modelValue: { id: 3, name: 'Three' } })
    await openSelect(wrapper)
    expect(optionsOf(wrapper)[2]!.attributes('aria-selected')).toBe('true')
  })

  it('honours a custom optionValue over trackBy', async () => {
    const wrapper = mountSelect({ optionValue: (o: { name: string }) => o.name })
    await openSelect(wrapper)
    await optionsOf(wrapper)[0]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['One'])
  })

  it('accumulates values in multiple mode', async () => {
    const wrapper = mountSelect({ multiple: true, modelValue: [] })
    await openSelect(wrapper)
    await optionsOf(wrapper)[0]!.trigger('click')
    await optionsOf(wrapper)[2]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[1, 3]])
  })

  it('toggles a selected option off in multiple mode and emits remove', async () => {
    const wrapper = mountSelect({ multiple: true, modelValue: [1] })
    await openSelect(wrapper)
    await optionsOf(wrapper)[0]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[]])
    expect(wrapper.emitted('remove')?.[0]).toEqual([options[0]])
  })

  it('removes a chip through its ✕ button', async () => {
    const wrapper = mountSelect({ multiple: true, modelValue: [1, 2] })
    await wrapper.findAll('.badge button')[0]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[2]])
    expect(wrapper.emitted('remove')?.[0]).toEqual([options[0]])
  })

  it('opens when the field is clicked beside the chips', async () => {
    // Chips take up most of the field, so a click rarely lands on the trigger.
    const wrapper = mountSelect({ multiple: true, modelValue: [1] })
    await wrapper.find('.input').trigger('click')
    expect(optionsOf(wrapper)).toHaveLength(3)
  })

  it('leaves a chip removal alone instead of opening', async () => {
    const wrapper = mountSelect({ multiple: true, modelValue: [1, 2] })
    await wrapper.findAll('.badge button')[0]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[2]])
    expect(optionsOf(wrapper)).toHaveLength(0)
  })

  it('still lets the trigger close what it opened', async () => {
    const wrapper = mountSelect({ multiple: true, modelValue: [1] })
    await combobox(wrapper).trigger('click')
    expect(optionsOf(wrapper)).toHaveLength(3)
    await combobox(wrapper).trigger('click')
    expect(optionsOf(wrapper)).toHaveLength(0)
  })

  it('clears the selection when re-picking it with clearable', async () => {
    const wrapper = mountSelect({ clearable: true, modelValue: 2 })
    await openSelect(wrapper)
    await optionsOf(wrapper)[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([null])
  })

  it('keeps the selection when re-picking it without clearable', async () => {
    const wrapper = mountSelect({ modelValue: 2 })
    await openSelect(wrapper)
    await optionsOf(wrapper)[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('select')?.[0]).toEqual([options[1]])
  })

  it('closes after selecting in single mode, stays open in multiple', async () => {
    const single = mountSelect()
    await openSelect(single)
    await optionsOf(single)[0]!.trigger('click')
    expect(optionsOf(single)).toHaveLength(0)

    const multi = mountSelect({ multiple: true, modelValue: [] })
    await openSelect(multi)
    await optionsOf(multi)[0]!.trigger('click')
    expect(optionsOf(multi).length).toBeGreaterThan(0)
  })

  it('blocks selecting past maxSelected', async () => {
    const wrapper = mountSelect({ multiple: true, maxSelected: 1, modelValue: [1] })
    await openSelect(wrapper)
    expect(optionsOf(wrapper)[1]!.attributes('aria-disabled')).toBe('true')
    await optionsOf(wrapper)[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})

describe('DuSelect keyboard', () => {
  it('opens with ArrowDown and selects with Enter', async () => {
    const wrapper = mountSelect()
    await combobox(wrapper).trigger('keydown', { key: 'ArrowDown' })
    await combobox(wrapper).trigger('keydown', { key: 'ArrowDown' })
    await combobox(wrapper).trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2])
  })

  it('wraps with the arrows and jumps with Home/End', async () => {
    const wrapper = mountSelect()
    await openSelect(wrapper)
    await combobox(wrapper).trigger('keydown', { key: 'End' })
    expect(optionsOf(wrapper)[2]!.attributes('data-highlighted')).toBe('true')
    await combobox(wrapper).trigger('keydown', { key: 'ArrowDown' })
    expect(optionsOf(wrapper)[0]!.attributes('data-highlighted')).toBe('true')
    await combobox(wrapper).trigger('keydown', { key: 'Home' })
    expect(optionsOf(wrapper)[0]!.attributes('data-highlighted')).toBe('true')
    await combobox(wrapper).trigger('keydown', { key: 'PageDown' })
    expect(optionsOf(wrapper)[2]!.attributes('data-highlighted')).toBe('true')
  })

  it('skips disabled options', async () => {
    const wrapper = mountSelect({ options: [options[0], { ...options[1], disabled: true }, options[2]] })
    await openSelect(wrapper)
    expect(optionsOf(wrapper)[1]!.attributes('aria-disabled')).toBe('true')
    await combobox(wrapper).trigger('keydown', { key: 'ArrowDown' })
    expect(optionsOf(wrapper)[2]!.attributes('data-highlighted')).toBe('true')
  })

  it('refuses to select a disabled option', async () => {
    const wrapper = mountSelect({ options: [{ ...options[0], disabled: true }] })
    await openSelect(wrapper)
    await optionsOf(wrapper)[0]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('closes on Escape', async () => {
    const wrapper = mountSelect()
    await openSelect(wrapper)
    await combobox(wrapper).trigger('keydown', { key: 'Escape' })
    expect(optionsOf(wrapper)).toHaveLength(0)
  })

  it('leaves the widget on Tab and closes', async () => {
    const wrapper = mountSelect()
    await openSelect(wrapper)
    await combobox(wrapper).trigger('keydown', { key: 'Tab' })
    await nextTick()
    expect(optionsOf(wrapper)).toHaveLength(0)
  })

  it('drops the last chip on Backspace in multiple mode', async () => {
    const wrapper = mountSelect({ multiple: true, modelValue: [1, 2] })
    await combobox(wrapper).trigger('keydown', { key: 'Backspace' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[1]])
    expect(wrapper.emitted('remove')?.[0]).toEqual([options[1]])
  })

  it('survives an empty result list (no NaN highlight)', async () => {
    const wrapper = mountSelect({ searchableInside: true })
    await openSelect(wrapper)
    await wrapper.findAll('input').at(-1)!.setValue('zzz')
    expect(optionsOf(wrapper)).toHaveLength(0)
    await combobox(wrapper).trigger('keydown', { key: 'ArrowDown' })
    await combobox(wrapper).trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.text()).toContain('No options found')
  })
})

describe('DuSelect search', () => {
  it('filters from the field itself when searchable', async () => {
    const wrapper = mountSelect({ searchable: true })
    await combobox(wrapper).setValue('thr')
    expect(optionsOf(wrapper)).toHaveLength(1)
    expect(wrapper.emitted('query')?.at(-1)).toEqual(['thr'])
  })

  it('filters from a box inside the dropdown when searchableInside', async () => {
    const wrapper = mountSelect({ searchableInside: true })
    await openSelect(wrapper)
    const search = wrapper.findAll('input').at(-1)!
    expect(search.attributes('role')).toBe('searchbox')
    await search.setValue('one')
    expect(optionsOf(wrapper)).toHaveLength(1)
  })

  it('applies labelBy to the filtering', async () => {
    const wrapper = mountSelect({
      searchableInside: true,
      labelBy: 'title',
      options: [{ id: 1, title: 'Alpha' }, { id: 2, title: 'Beta' }],
    })
    await openSelect(wrapper)
    await wrapper.findAll('input').at(-1)!.setValue('alp')
    expect(optionsOf(wrapper)).toHaveLength(1)
    expect(wrapper.text()).toContain('Alpha')
  })

  it('takes a custom optionFilter', async () => {
    const wrapper = mountSelect({
      searchableInside: true,
      optionFilter: (option: { id: number }, query: string) => String(option.id) === query,
    })
    await openSelect(wrapper)
    await wrapper.findAll('input').at(-1)!.setValue('3')
    expect(optionsOf(wrapper)).toHaveLength(1)
    expect(wrapper.text()).toContain('Three')
  })
})

describe('DuSelect accessibility', () => {
  it('wires the combobox to its listbox', async () => {
    const wrapper = mountSelect()
    const trigger = combobox(wrapper)
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(trigger.attributes('aria-haspopup')).toBe('listbox')
    await openSelect(wrapper)
    const listbox = wrapper.find('[role="listbox"]')
    expect(combobox(wrapper).attributes('aria-expanded')).toBe('true')
    expect(combobox(wrapper).attributes('aria-controls')).toBe(listbox.attributes('id'))
  })

  it('points aria-activedescendant at the highlighted option', async () => {
    const wrapper = mountSelect()
    await openSelect(wrapper)
    await combobox(wrapper).trigger('keydown', { key: 'ArrowDown' })
    const highlighted = optionsOf(wrapper).find((o) => o.attributes('data-highlighted') === 'true')!
    expect(combobox(wrapper).attributes('aria-activedescendant')).toBe(highlighted.attributes('id'))
  })

  it('reflects the real selection in aria-selected, not the highlight', async () => {
    const wrapper = mountSelect({ modelValue: 3 })
    await openSelect(wrapper)
    await combobox(wrapper).trigger('keydown', { key: 'Home' })
    const items = optionsOf(wrapper)
    expect(items[0]!.attributes('data-highlighted')).toBe('true')
    expect(items[0]!.attributes('aria-selected')).toBe('false')
    expect(items[2]!.attributes('aria-selected')).toBe('true')
  })

  it('marks the listbox multi-selectable only in multiple mode', async () => {
    const single = mountSelect()
    await openSelect(single)
    expect(single.find('[role="listbox"]').attributes('aria-multiselectable')).toBeUndefined()

    const multi = mountSelect({ multiple: true, modelValue: [] })
    await openSelect(multi)
    expect(multi.find('[role="listbox"]').attributes('aria-multiselectable')).toBe('true')
  })

  it('gives each instance its own deterministic ids', async () => {
    const wrapper = mount({
      components: { DuSelect },
      data: () => ({ options }),
      template: '<div><DuSelect :options="options" /><DuSelect :options="options" /></div>',
    }, { attachTo: document.body })

    for (const trigger of wrapper.findAll('[role="combobox"]')) {
      await trigger.trigger('click')
    }
    const ids = wrapper.findAll('[role="listbox"]').map((listbox) => listbox.attributes('id')!)
    expect(ids).toHaveLength(2)
    expect(new Set(ids).size).toBe(2)
    // Vue's useId, not Math.random: the ids are stable across renders (SSR-safe).
    ids.forEach((id) => expect(id).toMatch(/^v-\d+-listbox$/))
  })

  it('takes an explicit id', async () => {
    const wrapper = mountSelect({ id: 'fruits' })
    await openSelect(wrapper)
    expect(wrapper.find('[role="listbox"]').attributes('id')).toBe('fruits-listbox')
  })

  it('cannot be opened when disabled or readonly', async () => {
    for (const props of [{ disabled: true }, { readonly: true }]) {
      const wrapper = mountSelect(props)
      await openSelect(wrapper)
      expect(optionsOf(wrapper), JSON.stringify(props)).toHaveLength(0)
    }
  })
})

describe('DuSelect validation', () => {
  it('shows no default message once the field has been visited; errorMessages override', async () => {
    const wrapper = mountSelect({ required: true })
    await openSelect(wrapper)
    await combobox(wrapper).trigger('keydown', { key: 'Escape' })
    expect(wrapper.text()).not.toContain('Selection is required.')

    const localized = mountSelect({
      required: true,
      errorMessages: { required: 'Ce champ est obligatoire.' },
    })
    await openSelect(localized)
    await combobox(localized).trigger('keydown', { key: 'Escape' })
    expect(localized.text()).toContain('Ce champ est obligatoire.')
  })

  it('reports minSelected through errorMessages', async () => {
    const wrapper = mountSelect({
      multiple: true,
      modelValue: [],
      minSelected: 2,
      errorMessages: { minlength: 'Choisis-en deux' },
    })
    await openSelect(wrapper)
    await combobox(wrapper).trigger('keydown', { key: 'Escape' })
    expect(wrapper.text()).toContain('Choisis-en deux')
  })

  it('exposes the validity to a parent', async () => {
    const wrapper = mountSelect({ required: true })
    expect((wrapper.vm as unknown as { valid: boolean }).valid).toBe(false)
    await openSelect(wrapper)
    await optionsOf(wrapper)[0]!.trigger('click')
    expect((wrapper.vm as unknown as { valid: boolean }).valid).toBe(true)
  })
})

describe('DuSelect events and slots', () => {
  it('emits open and close', async () => {
    const wrapper = mountSelect()
    await openSelect(wrapper)
    expect(wrapper.emitted('open')).toHaveLength(1)
    await combobox(wrapper).trigger('keydown', { key: 'Escape' })
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('renders the option slot with its state', async () => {
    const wrapper = mountSelect({ modelValue: 1 }, {
      slots: {
        option: '<template #option="{ option, selected }">{{ option.name }}{{ selected ? " ✓" : "" }}</template>',
      },
    })
    await openSelect(wrapper)
    expect(optionsOf(wrapper)[0]!.text()).toBe('One ✓')
    expect(optionsOf(wrapper)[1]!.text()).toBe('Two')
  })

  it('renders the tag slot with a pre-wired remove', async () => {
    const wrapper = mountSelect({ multiple: true, modelValue: [1] }, {
      slots: {
        tag: '<template #tag="{ option, remove }"><button class="chip" @click="remove">{{ option.name }}</button></template>',
      },
    })
    await wrapper.find('.chip').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[]])
  })

  it('renders the no-options slot with the query', async () => {
    const wrapper = mountSelect({ searchableInside: true }, {
      slots: { 'no-options': '<template #no-options="{ query }">Rien pour {{ query }}</template>' },
    })
    await openSelect(wrapper)
    await wrapper.findAll('input').at(-1)!.setValue('zzz')
    expect(wrapper.text()).toContain('Rien pour zzz')
  })

  it('renders the error slot with an errorMessages override', async () => {
    const wrapper = mountSelect({
      required: true,
      errorMessages: { required: 'Selection is required.' },
    }, {
      slots: { error: '<template #error="{ message }"><em class="err">{{ message }}</em></template>' },
    })
    await openSelect(wrapper)
    await combobox(wrapper).trigger('keydown', { key: 'Escape' })
    expect(wrapper.find('.err').text()).toBe('Selection is required.')
  })
})
