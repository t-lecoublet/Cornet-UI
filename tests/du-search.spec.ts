import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import DuSearch from '../components/DataInput/du-search/du-search.vue'

const options = [
  { id: 1, name: 'One' },
  { id: 2, name: 'Two' },
  { id: 3, name: 'Three' },
]

function mountSearch(props: Record<string, unknown> = {}, extra: Record<string, unknown> = {}) {
  return mount(DuSearch, {
    props: { options, ...props },
    attachTo: document.body,
    ...extra,
  })
}

type Wrapper = ReturnType<typeof mountSearch>

const field = (wrapper: Wrapper) => wrapper.find('input')
const optionsOf = (wrapper: Wrapper) => wrapper.findAll('[role="option"]')

describe('DuSearch typing and filtering', () => {
  it('opens and filters as the user types', async () => {
    const wrapper = mountSearch()
    await field(wrapper).setValue('T')
    expect(optionsOf(wrapper)).toHaveLength(2)
    expect(wrapper.text()).toContain('Two')
    expect(wrapper.text()).toContain('Three')
  })

  it('emits the query on every keystroke', async () => {
    const wrapper = mountSearch()
    await field(wrapper).setValue('Tw')
    expect(wrapper.emitted('query')?.at(-1)).toEqual(['Tw'])
  })

  it('opens on focus without a query', async () => {
    const wrapper = mountSearch()
    await field(wrapper).trigger('focus')
    expect(optionsOf(wrapper)).toHaveLength(3)
  })

  it('shows the no-results text when nothing matches', async () => {
    const wrapper = mountSearch({ noResultsText: 'Nothing found' })
    await field(wrapper).setValue('zzz')
    expect(optionsOf(wrapper)).toHaveLength(0)
    expect(wrapper.text()).toContain('Nothing found')
  })

  it('bypasses local filtering with externalFilter', async () => {
    const wrapper = mountSearch({ externalFilter: true })
    await field(wrapper).setValue('matches nothing locally')
    expect(optionsOf(wrapper)).toHaveLength(options.length)
  })

  it('caps the results with resultsLimit', async () => {
    const wrapper = mountSearch({ resultsLimit: 2 })
    await field(wrapper).trigger('focus')
    expect(optionsOf(wrapper)).toHaveLength(2)
  })

  it('filters on labelBy', async () => {
    const wrapper = mountSearch({
      labelBy: 'title',
      options: [{ id: 1, title: 'Alpha' }, { id: 2, title: 'Beta' }],
    })
    await field(wrapper).setValue('alp')
    expect(optionsOf(wrapper)).toHaveLength(1)
    expect(wrapper.text()).toContain('Alpha')
  })

  it('shows the selected label when closed, the query while typing', async () => {
    const wrapper = mountSearch({ modelValue: options[1] })
    expect(field(wrapper).element.value).toBe('Two')
    await field(wrapper).setValue('Thr')
    expect(field(wrapper).element.value).toBe('Thr')
    await field(wrapper).trigger('keydown', { key: 'Escape' })
    await nextTick()
    expect(field(wrapper).element.value).toBe('Two')
  })
})

describe('DuSearch selection', () => {
  it('emits the whole option by default', async () => {
    const wrapper = mountSearch()
    await field(wrapper).setValue('Two')
    await optionsOf(wrapper)[0]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([options[1]])
    expect(wrapper.emitted('select')?.at(-1)).toEqual([options[1]])
  })

  it('emits the trackBy value when returnObject is off', async () => {
    const wrapper = mountSearch({ returnObject: false })
    await field(wrapper).setValue('Two')
    await optionsOf(wrapper)[0]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([2])
  })

  it('accumulates options in multiple mode', async () => {
    const wrapper = mountSearch({ multiple: true, modelValue: [] })
    await field(wrapper).setValue('One')
    await optionsOf(wrapper)[0]!.trigger('click')
    await field(wrapper).setValue('Three')
    await optionsOf(wrapper)[0]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[options[0], options[2]]])
  })

  it('scales the chips and their buttons with the field size', () => {
    const large = mountSearch({ size: 'lg', multiple: true, modelValue: [options[0]] })
    // One step below the field, so a chip still fits inside it.
    expect(large.find('.badge').classes()).toContain('badge-md')
    expect(large.find('.badge button').classes()).toContain('btn-md')

    // The default field is md-sized, so its chips stay sm as they always were.
    const untouched = mountSearch({ multiple: true, modelValue: [options[0]] })
    expect(untouched.find('.badge').classes()).toContain('badge-sm')
  })

  it('renders a chip per selection and removes it through its ✕', async () => {
    const wrapper = mountSearch({ multiple: true, modelValue: [options[0], options[1]] })
    expect(wrapper.findAll('.badge')).toHaveLength(2)
    await wrapper.findAll('.badge button')[0]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[options[1]]])
    expect(wrapper.emitted('remove')?.at(-1)).toEqual([options[0]])
  })

  it('validates a comma-separated segment in multiple mode', async () => {
    const wrapper = mountSearch({ multiple: true, modelValue: [] })
    await field(wrapper).setValue('One,')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[options[0]]])
    expect(field(wrapper).element.value).toBe('')
  })

  it('keeps the trailing segment as the pending query', async () => {
    const wrapper = mountSearch({ multiple: true, modelValue: [] })
    await field(wrapper).setValue('One, Thr')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[options[0]]])
    expect(field(wrapper).element.value).toBe('Thr')
  })

  it('opens when the field is clicked beside the chips', async () => {
    // Chips take up most of the field, so a click rarely lands on the input.
    const wrapper = mountSearch({ multiple: true, modelValue: [options[0]] })
    await wrapper.find('.input').trigger('click')
    expect(optionsOf(wrapper)).toHaveLength(3)
  })

  it('leaves a chip removal alone instead of opening', async () => {
    const wrapper = mountSearch({ multiple: true, modelValue: [options[0], options[1]] })
    await wrapper.findAll('.badge button')[0]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[options[1]]])
    expect(optionsOf(wrapper)).toHaveLength(0)
  })

  it('clears the selection when re-picking it with clearable', async () => {
    const wrapper = mountSearch({ clearable: true, modelValue: options[1] })
    await field(wrapper).trigger('focus')
    await optionsOf(wrapper)[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([null])
  })

  it('drops the last chip on Backspace when the field is empty', async () => {
    const wrapper = mountSearch({ multiple: true, modelValue: [options[0], options[1]] })
    await field(wrapper).trigger('keydown', { key: 'Backspace' })
    expect(wrapper.emitted('remove')?.at(-1)).toEqual([options[1]])
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[options[0]]])
  })

  it('selects with ArrowDown then Enter', async () => {
    const wrapper = mountSearch()
    await field(wrapper).trigger('focus')
    await field(wrapper).trigger('keydown', { key: 'ArrowDown' })
    await field(wrapper).trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([options[1]])
  })
})

describe('DuSearch creatable', () => {
  const created = { id: null, name: 'Brand New' }

  it('offers the entry when nothing matches exactly', async () => {
    const wrapper = mountSearch({ creatable: true })
    await field(wrapper).setValue('Brand New')
    expect(optionsOf(wrapper)).toHaveLength(1)
    expect(wrapper.text()).toContain('Add "Brand New"')
  })

  it('keeps it in front of the partial matches', async () => {
    const wrapper = mountSearch({ creatable: true })
    await field(wrapper).setValue('T')
    expect(optionsOf(wrapper)).toHaveLength(3)
    expect(optionsOf(wrapper)[0]!.text()).toContain('Add "T"')
  })

  it('hides it when an option already has that label', async () => {
    const wrapper = mountSearch({ creatable: true })
    await field(wrapper).setValue('two')
    expect(optionsOf(wrapper)).toHaveLength(1)
    expect(wrapper.text()).not.toContain('Add')
  })

  it('emits add — not select — when it is picked', async () => {
    const wrapper = mountSearch({ creatable: true })
    await field(wrapper).setValue('Brand New')
    await optionsOf(wrapper)[0]!.trigger('click')
    expect(wrapper.emitted('add')?.at(-1)).toEqual([created])
    expect(wrapper.emitted('select')).toBeUndefined()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([created])
  })

  it('is reachable with the keyboard like any option', async () => {
    const wrapper = mountSearch({ creatable: true })
    await field(wrapper).setValue('Brand New')
    await field(wrapper).trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('add')?.at(-1)).toEqual([created])
  })

  it('renders the create-option slot', async () => {
    const wrapper = mountSearch({ creatable: true }, {
      slots: { 'create-option': '<template #create-option="{ query }">Créer {{ query }}</template>' },
    })
    await field(wrapper).setValue('Zed')
    expect(wrapper.text()).toContain('Créer Zed')
  })

  it('uses a custom createOption', async () => {
    const wrapper = mountSearch({
      creatable: true,
      createOption: (query: string) => ({ id: null, name: query.toUpperCase() }),
    })
    await field(wrapper).setValue('zed')
    await optionsOf(wrapper)[0]!.trigger('click')
    expect(wrapper.emitted('add')?.at(-1)).toEqual([{ id: null, name: 'ZED' }])
  })
})

describe('DuSearch commitOnClose', () => {
  async function typeAndClose(props: Record<string, unknown>, query: string) {
    const wrapper = mountSearch(props)
    await field(wrapper).trigger('focus')
    await field(wrapper).setValue(query)
    await field(wrapper).trigger('keydown', { key: 'Escape' })
    await nextTick()
    return wrapper
  }

  it('none (default): drops the query, keeps the selection', async () => {
    const wrapper = await typeAndClose({ modelValue: options[0] }, 'Two')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(field(wrapper).element.value).toBe('One')
  })

  it('clears the selection when the field was emptied', async () => {
    const wrapper = await typeAndClose({ modelValue: options[0] }, '')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([null])
  })

  it('match: selects an exact label match', async () => {
    const wrapper = await typeAndClose({ commitOnClose: 'match' }, 'two')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([options[1]])
  })

  it('match: keeps the selection when nothing matches', async () => {
    const wrapper = await typeAndClose({ commitOnClose: 'match', modelValue: options[0] }, 'Zed')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('auto: falls back to the first result of an external search', async () => {
    const wrapper = await typeAndClose({ commitOnClose: 'auto', externalFilter: true }, 'zed')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([options[0]])
  })

  it('auto: falls back to creating the option', async () => {
    const wrapper = await typeAndClose({ commitOnClose: 'auto', creatable: true }, 'Zed')
    expect(wrapper.emitted('add')?.at(-1)).toEqual([{ id: null, name: 'Zed' }])
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([{ id: null, name: 'Zed' }])
  })

  it('auto: clears the selection when nothing can be committed', async () => {
    const wrapper = await typeAndClose({ commitOnClose: 'auto', modelValue: options[0] }, 'Zed')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([null])
  })
})

describe('DuSearch accessibility and validation', () => {
  it('puts the combobox role on the input, wired to the listbox', async () => {
    const wrapper = mountSearch()
    const input = field(wrapper)
    expect(input.attributes('role')).toBe('combobox')
    expect(input.attributes('aria-autocomplete')).toBe('list')
    expect(input.attributes('aria-expanded')).toBe('false')
    await input.trigger('focus')
    expect(field(wrapper).attributes('aria-expanded')).toBe('true')
    expect(field(wrapper).attributes('aria-controls')).toBe(wrapper.find('[role="listbox"]').attributes('id'))
  })

  it('tracks the highlight with aria-activedescendant and the selection with aria-selected', async () => {
    const wrapper = mountSearch({ modelValue: options[2] })
    await field(wrapper).trigger('focus')
    await field(wrapper).trigger('keydown', { key: 'ArrowDown' })
    const items = optionsOf(wrapper)
    const highlighted = items.find((item) => item.attributes('data-highlighted') === 'true')!
    expect(field(wrapper).attributes('aria-activedescendant')).toBe(highlighted.attributes('id'))
    expect(items[2]!.attributes('aria-selected')).toBe('true')
    expect(items[0]!.attributes('aria-selected')).toBe('false')
  })

  it('works without an id or a name', async () => {
    const wrapper = mountSearch()
    await field(wrapper).trigger('focus')
    expect(wrapper.find('[role="listbox"]').attributes('id')).toMatch(/^v-\d+-listbox$/)
  })

  it('keeps the native input attributes', () => {
    const wrapper = mountSearch({ name: 'author', type: 'search', pattern: '[A-Z].*' })
    const input = field(wrapper)
    expect(input.attributes('name')).toBe('author')
    expect(input.attributes('type')).toBe('search')
    expect(input.attributes('pattern')).toBe('[A-Z].*')
    expect(input.attributes('autocomplete')).toBe('off')
  })

  it('cannot be opened when disabled or readonly', async () => {
    for (const props of [{ disabled: true }, { readonly: true }]) {
      const wrapper = mountSearch(props)
      await field(wrapper).trigger('focus')
      expect(optionsOf(wrapper), JSON.stringify(props)).toHaveLength(0)
    }
  })

  it('shows no default message once the field has been visited; errorMessages override', async () => {
    const wrapper = mountSearch({ required: true })
    await field(wrapper).trigger('focus')
    await field(wrapper).trigger('keydown', { key: 'Escape' })
    expect(wrapper.text()).not.toContain('Selection is required.')

    const localized = mountSearch({
      required: true,
      errorMessages: { required: 'Ce champ est obligatoire.' },
    })
    await field(localized).trigger('focus')
    await field(localized).trigger('keydown', { key: 'Escape' })
    expect(localized.text()).toContain('Ce champ est obligatoire.')
  })

  it('emits open and close', async () => {
    const wrapper = mountSearch()
    await field(wrapper).trigger('focus')
    expect(wrapper.emitted('open')).toHaveLength(1)
    await field(wrapper).trigger('keydown', { key: 'Escape' })
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('renders the option slot with its state', async () => {
    const wrapper = mountSearch({ modelValue: options[0] }, {
      slots: { option: '<template #option="{ option, selected }">{{ option.name }}{{ selected ? " ✓" : "" }}</template>' },
    })
    await field(wrapper).trigger('focus')
    expect(optionsOf(wrapper)[0]!.text()).toBe('One ✓')
  })
})
