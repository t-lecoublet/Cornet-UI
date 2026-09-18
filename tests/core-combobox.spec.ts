// The combobox engine, end to end: popup lifecycle, filtering, highlight,
// keyboard, focus rules, ARIA wiring, validation — and the behaviors the two
// facades are built on top of (results fetched elsewhere, a capped list, an
// entry that creates what is being typed, resolving leftover text on close).
//
// Driven from a tag picker, the shape that exercises all of it at once. The
// pure DOM helpers live in core-dom.spec.ts; du-select.spec.ts and
// du-search.spec.ts cover the styled facades.
import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed, defineComponent, h, nextTick, reactive, ref } from 'vue'
import type { VNode } from 'vue'
import Harness from './helpers/ComboboxHarness.vue'
import { useCombobox } from '../components/core/combobox'
import type { ComboboxProps, ComboboxScope, ComboboxSlotProps } from '../components/core/combobox'

interface Tag {
  /** `null` marks a tag the user is creating rather than picking. */
  id: number | null
  label: string
}

// One shared list: selections compare by option identity unless a test sets
// `optionValue`, so a model must hold the very objects that are in `options`.
const TAGS: Tag[] = [
  { id: 1, label: 'accessibility' },
  { id: 2, label: 'design-system' },
  { id: 3, label: 'performance' },
]

/** A longer list, for the tests that need more rows than a page holds. */
const manyTags = (count: number): Tag[] =>
  Array.from({ length: count }, (_, i) => ({ id: i + 1, label: `tag-${i + 1}` }))

type Scope = ComboboxSlotProps<Tag, Tag>
type Setup = Partial<ComboboxProps<Tag, Tag>>

/** Mount the harness around `render`, with the model defaulted to the mode's empty shape. */
function mountHarness(setup: Setup, render: (scope: Scope) => VNode) {
  let live!: Scope
  const wrapper = mount(Harness, {
    attachTo: document.body,
    props: {
      modelValue: setup.modelValue !== undefined ? setup.modelValue : (setup.multiple ? [] : null),
      options: TAGS,
      optionLabel: (option: unknown) => (option as Tag).label,
      ...setup,
      // `setup` is typed against `Tag`, the harness props against `unknown`:
      // the same callbacks, described from the two ends of the generic.
    } as never,
    slots: {
      default: (slotProps: unknown) => {
        live = (slotProps as { scope: Scope }).scope
        return render(live)
      },
    },
  })
  // Read through the calls, never a destructure: the scope is replaced on every render.
  return { wrapper, scope: () => live }
}

/** What every test reads: the live scope, what the v-model would hold, what is on screen. */
function accessors(wrapper: ReturnType<typeof mountHarness>['wrapper'], scope: () => Scope) {
  return {
    wrapper,
    scope,
    /** What the parent's v-model would hold now, or `undefined` if it was never written. */
    model: () => (wrapper.emitted('update:modelValue')?.at(-1) as [unknown] | undefined)?.[0],
    writes: () => wrapper.emitted('update:modelValue')?.length ?? 0,
    rendered: () => scope().visibleOptions.map((tag) => tag.label),
    results: () => scope().filteredOptions.map((tag) => tag.label),
    /** Type into the filter the way a user would, then let the list settle. */
    async type(text: string) {
      scope().setSearchQuery(text)
      await nextTick()
    },
  }
}

/** The engine alone — nothing wired beyond what the harness renders. */
function picker(setup: Setup = {}) {
  const { wrapper, scope } = mountHarness(setup, () => h('div'))
  return accessors(wrapper, scope)
}

interface WidgetSetup extends Setup {
  /** `button`: a separate trigger and filter input. `typeahead`: one input is both. */
  shape?: 'button' | 'typeahead'
  /** Render the secondary filter input (button shape only). */
  withFilter?: boolean
  /** Render an unwired button inside the container, standing in for a chip. */
  withChip?: boolean
  /** Give the dropdown a `popover` attribute. */
  asPopover?: boolean
}

/** A realistic consumer layout, every ref wired, with somewhere for Tab to land. */
function widget(setup: WidgetSetup = {}) {
  const { shape = 'button', withFilter = true, withChip = false, asPopover = false, ...engineSetup } = setup

  const { wrapper, scope } = mountHarness(engineSetup, (sc) => {
    const rows = sc.visibleOptions.map((tag, index) => h('div', {
      ref: (el: unknown) => sc.setOptionRef(tag, el),
      class: 'row',
      ...sc.getOptionProps(tag, index),
    }))
    const field = shape === 'typeahead'
      ? h('input', {
          ref: (el: unknown) => {
            sc.setTriggerRef(el)
            sc.setInputRef(el)
          },
          class: 'field',
          onKeydown: sc.handleKeydown,
          ...sc.comboboxInputProps,
        })
      : h('button', {
          ref: (el: unknown) => sc.setTriggerRef(el),
          class: 'field',
          type: 'button',
          ...sc.triggerProps,
        }, 'toggle')

    return h('div', { ref: (el: unknown) => sc.setContainerRef(el), class: 'widget' }, [
      field,
      shape === 'button' && withFilter
        ? h('input', { ref: (el: unknown) => sc.setInputRef(el), class: 'filter', ...sc.inputProps })
        : null,
      withChip ? h('button', { class: 'chip', type: 'button' }, 'x') : null,
      h('div', {
        ref: (el: unknown) => sc.setDropdownRef(el),
        class: 'popup',
        ...(asPopover ? { popover: 'manual' } : {}),
      }, [
        h('div', { ref: (el: unknown) => sc.setListRef(el), class: 'list' }, rows),
      ]),
    ])
  })

  const outside = document.createElement('button')
  outside.type = 'button'
  outside.textContent = 'outside'
  document.body.appendChild(outside)

  return {
    ...accessors(wrapper, scope),
    outside,
    field: () => wrapper.find('.field'),
    filter: () => wrapper.find('.filter'),
    chip: () => wrapper.find('.chip'),
    list: () => wrapper.find('.list').element,
    rows: () => wrapper.findAll('.row'),
    highlighted: () => wrapper.findAll('.row').find((row) => row.attributes('data-highlighted') === 'true'),
  }
}

/** A key press that bubbles, the way a real one does. */
const keypress = (key: string) => new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })

/** Wiring that turns the query into a creatable tag, the way DuSearch does. */
const creating = {
  creatable: true,
  createOption: (query: unknown) => ({ id: null, label: String(query) }),
  isCreatedOption: (option: unknown) => (option as Tag).id === null,
}

describe('popup lifecycle', () => {
  it('starts closed with no highlight and no query', () => {
    const tags = picker()
    expect(tags.scope().isOpen).toBe(false)
    expect(tags.scope().highlightedIndex).toBe(-1)
    expect(tags.scope().searchQuery).toBeUndefined()
  })

  it('open and close round-trip, resetting highlight and query', async () => {
    const tags = picker()
    await tags.scope().open()
    expect(tags.scope().isOpen).toBe(true)

    await tags.type('des')
    tags.scope().setHighlightedIndex(0)
    tags.scope().close()
    await nextTick()

    expect(tags.scope().isOpen).toBe(false)
    expect(tags.scope().highlightedIndex).toBe(-1)
    expect(tags.scope().searchQuery).toBeUndefined()
  })

  it('toggle flips the popup', async () => {
    const tags = picker()
    tags.scope().toggle()
    await nextTick()
    expect(tags.scope().isOpen).toBe(true)
    tags.scope().toggle()
    expect(tags.scope().isOpen).toBe(false)
  })

  it('never opens while disabled or readonly', async () => {
    for (const setup of [{ disabled: true }, { readonly: true }] as Setup[]) {
      const tags = picker(setup)
      await tags.scope().open()
      tags.scope().toggle()
      await nextTick()
      expect(tags.scope().isOpen, JSON.stringify(setup)).toBe(false)
    }
  })

  it('clicking the trigger toggles', async () => {
    const tags = widget()
    await tags.field().trigger('click')
    expect(tags.scope().isOpen).toBe(true)
    await tags.field().trigger('click')
    expect(tags.scope().isOpen).toBe(false)
  })

  it('Escape closes and hands focus back to the trigger', async () => {
    const tags = widget()
    await tags.scope().open()
    await tags.field().trigger('keydown', { key: 'Escape' })
    expect(tags.scope().isOpen).toBe(false)
    expect(document.activeElement).toBe(tags.field().element)
  })

  it('Escape works from an unwired element inside the widget', async () => {
    const tags = widget({ withChip: true })
    await tags.scope().open()
    tags.chip().element.dispatchEvent(keypress('Escape'))
    expect(tags.scope().isOpen).toBe(false)
  })

  it('a mousedown outside closes without stealing focus', async () => {
    const tags = widget()
    await tags.scope().open()
    const before = document.activeElement
    tags.outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    expect(tags.scope().isOpen).toBe(false)
    expect(document.activeElement).toBe(before)
  })

  it('closeOnClickOutside:false keeps it open', async () => {
    const tags = widget({ closeOnClickOutside: false })
    await tags.scope().open()
    tags.outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    expect(tags.scope().isOpen).toBe(true)
  })

  // A page can hold dozens of closed comboboxes; none of them should be
  // listening to the document until it actually has a popup to dismiss.
  it('only listens to the document while open', async () => {
    const dismissal = ['mousedown', 'keydown']
    const add = vi.spyOn(document, 'addEventListener')
    const remove = vi.spyOn(document, 'removeEventListener')
    const count = (spy: typeof add) => spy.mock.calls.filter(([type]) => dismissal.includes(type)).length

    try {
      const tags = picker()
      await nextTick()
      expect(count(add), 'closed').toBe(0)

      await tags.scope().open()
      expect(count(add), 'open').toBe(dismissal.length)

      tags.scope().close()
      await nextTick()
      expect(count(remove), 'closed again').toBe(dismissal.length)

      // Reopening subscribes afresh rather than doubling up.
      await tags.scope().open()
      expect(count(add), 'reopened').toBe(dismissal.length * 2)

      tags.wrapper.unmount()
      expect(count(remove), 'unmounted while open').toBe(dismissal.length * 2)
    }
    finally {
      add.mockRestore()
      remove.mockRestore()
    }
  })
})

describe('query and filtering', () => {
  it('shows every tag while the query is blank', async () => {
    const tags = picker()
    expect(tags.results()).toHaveLength(3)
    await tags.type('')
    expect(tags.results()).toHaveLength(3)
  })

  it('filters by case-insensitive substring on the label by default', async () => {
    const tags = picker()
    await tags.type('S')
    expect(tags.results()).toEqual(['accessibility', 'design-system'])
  })

  it('optionFilter replaces the default filter', async () => {
    const tags = picker({ optionFilter: (option, query) => String((option as Tag).id) === query })
    await tags.type('2')
    expect(tags.results()).toEqual(['design-system'])
  })

  it('typing in a closed typeahead reopens and filters', async () => {
    const tags = widget({ shape: 'typeahead' })
    expect(tags.scope().isOpen).toBe(false)
    await tags.field().setValue('des')
    expect(tags.scope().isOpen).toBe(true)
    expect(tags.scope().searchQuery).toBe('des')
    expect(tags.results()).toEqual(['design-system'])
  })

  it('a query change re-highlights the first pickable row', async () => {
    const tags = picker({ optionDisabled: (option) => (option as Tag).label === 'accessibility' })
    await tags.scope().open()
    expect(tags.scope().highlightedIndex).toBe(1)

    await tags.type('des')
    expect(tags.rendered()).toEqual(['design-system'])
    expect(tags.scope().highlightedIndex).toBe(0)
  })

  it('selects the shown text on open, but not when reopened by typing', async () => {
    const tags = widget({ shape: 'typeahead' })
    const selectText = vi.fn()
    ;(tags.field().element as HTMLInputElement).select = selectText

    await tags.scope().open()
    await nextTick()
    expect(selectText).toHaveBeenCalledTimes(1)

    tags.scope().close()
    await tags.field().setValue('des')
    await nextTick()
    expect(selectText).toHaveBeenCalledTimes(1)
  })
})

describe('results fetched elsewhere (externalFilter)', () => {
  it('shows whatever the caller supplied, however the query reads', async () => {
    const tags = picker({ externalFilter: true })
    await tags.type('nothing matches this locally')
    expect(tags.results()).toEqual(['accessibility', 'design-system', 'performance'])
  })

  it('filters locally as soon as the flag is off', async () => {
    const tags = picker()
    await tags.type('nothing matches this locally')
    expect(tags.results()).toEqual([])
  })

  it('hands each typed query to the caller so it can go fetch', async () => {
    const onQueryChange = vi.fn()
    const tags = picker({ onQueryChange })
    await tags.type('des')
    await tags.type('')
    expect(onQueryChange.mock.calls).toEqual([['des'], ['']])
  })

  it('stays silent on the resets the popup does on its own', async () => {
    // Opening and closing blank the query internally. Reporting those would
    // make the caller fetch for a query the user never typed.
    const onQueryChange = vi.fn()
    const tags = picker({ onQueryChange })
    await tags.scope().open()
    tags.scope().close()
    await nextTick()
    expect(onQueryChange).not.toHaveBeenCalled()
  })
})

describe('capping the list (resultsLimit)', () => {
  it('shows only the first few of an unfiltered list', async () => {
    const tags = picker({ resultsLimit: 2 })
    await nextTick()
    expect(tags.results()).toEqual(['accessibility', 'design-system'])
  })

  it('counts matches, not raw options', async () => {
    // The only match is the last tag: capping before filtering would take the
    // first two and leave nothing to show.
    const tags = picker({ resultsLimit: 2 })
    await tags.type('per')
    expect(tags.results()).toEqual(['performance'])
  })

  it('lets the creatable entry through the cap', async () => {
    // The cap is about how many results to show, and the entry is not one.
    const tags = picker({ ...creating, resultsLimit: 1 })
    await tags.type('i18n')
    expect(tags.rendered()).toEqual(['i18n'])
  })
})

describe('creating a tag from the query', () => {
  it('offers the entry ahead of the partial matches', async () => {
    const tags = picker(creating)
    await tags.type('design')
    expect(tags.rendered()).toEqual(['design', 'design-system'])
    // The entry exists only in what gets rendered — the results stay factual.
    expect(tags.results()).toEqual(['design-system'])
  })

  it('offers nothing to create out of an empty query', async () => {
    const tags = picker(creating)
    await nextTick()
    expect(tags.rendered()).toEqual(tags.results())
  })

  it('offers nothing when the tag already exists, whatever the casing', async () => {
    const tags = picker(creating)
    await tags.type('DESIGN-SYSTEM')
    expect(tags.rendered()).toEqual(['design-system'])
  })

  it('stays opt-in: no entry without the flag', async () => {
    const tags = picker()
    await tags.type('i18n')
    expect(tags.rendered()).toEqual([])
  })

  it('takes the highlight like a regular row', async () => {
    const tags = picker(creating)
    await tags.scope().open()
    await tags.type('design')
    // Typing re-highlights the first pickable row, which is now the entry.
    expect(tags.rendered()[tags.scope().highlightedIndex]).toBe('design')

    tags.scope().setHighlightedIndex(1)
    await nextTick()
    expect(tags.rendered()[tags.scope().highlightedIndex]).toBe('design-system')
  })

  it('announces a creation as a creation, not as a pick', async () => {
    const onCreate = vi.fn()
    const onSelect = vi.fn()
    const tags = picker({ ...creating, onCreate, onSelect })
    await tags.type('i18n')
    tags.scope().select(tags.scope().visibleOptions[0]!)
    await nextTick()

    expect(onCreate).toHaveBeenCalledWith({ id: null, label: 'i18n' })
    expect(onSelect).not.toHaveBeenCalled()
    expect(tags.model()).toEqual({ id: null, label: 'i18n' })
  })

  it('announces a real row as a pick even while the entry is on offer', async () => {
    const onCreate = vi.fn()
    const onSelect = vi.fn()
    const tags = picker({ ...creating, onCreate, onSelect })
    await tags.type('design')
    tags.scope().select(tags.scope().visibleOptions[1]!)
    await nextTick()

    expect(onSelect).toHaveBeenCalledWith(TAGS[1])
    expect(onCreate).not.toHaveBeenCalled()
  })

  it('always targets the tag as it reads right now', async () => {
    // The entry is a brand-new object on every keystroke. It is registered
    // under one stable key, so nothing goes stale as the user keeps typing.
    const onCreate = vi.fn()
    const tags = picker({ ...creating, onCreate })
    await tags.scope().open()
    const row = document.createElement('div')

    await tags.type('i18')
    tags.scope().setOptionRef(tags.scope().visibleOptions[0]!, row)
    await tags.type('i18n')
    tags.scope().setOptionRef(tags.scope().visibleOptions[0]!, row)

    tags.scope().select(tags.scope().visibleOptions[0]!)
    await nextTick()
    expect(onCreate).toHaveBeenCalledWith({ id: null, label: 'i18n' })
  })
})

describe('highlight and keyboard', () => {
  it('opening highlights the selected tag, else the first pickable row', async () => {
    const selected = picker({ modelValue: TAGS[2] })
    await selected.scope().open()
    expect(selected.scope().highlightedIndex).toBe(2)

    const none = picker()
    await none.scope().open()
    expect(none.scope().highlightedIndex).toBe(0)
  })

  it('arrows move and wrap around the edges', async () => {
    const tags = widget({ withFilter: false })
    await tags.scope().open()
    await tags.field().trigger('keydown', { key: 'ArrowUp' })
    expect(tags.scope().highlightedIndex).toBe(2) // wrapped from 0
    await tags.field().trigger('keydown', { key: 'ArrowDown' })
    expect(tags.scope().highlightedIndex).toBe(0) // and back
  })

  it('arrows skip unpickable rows', async () => {
    const tags = widget({
      withFilter: false,
      optionDisabled: (option) => (option as Tag).label === 'design-system',
    })
    await tags.scope().open()
    await tags.field().trigger('keydown', { key: 'ArrowDown' })
    expect(tags.scope().highlightedIndex).toBe(2)
  })

  it('Home and End jump to the first and last pickable rows', async () => {
    const tags = widget({ withFilter: false })
    await tags.scope().open()
    await tags.field().trigger('keydown', { key: 'End' })
    expect(tags.scope().highlightedIndex).toBe(2)
    await tags.field().trigger('keydown', { key: 'Home' })
    expect(tags.scope().highlightedIndex).toBe(0)
  })

  it('Home and End keep their native meaning inside a text input', async () => {
    const tags = widget({ shape: 'typeahead' })
    await tags.scope().open()
    tags.scope().setHighlightedIndex(1)
    const event = keypress('End')
    tags.field().element.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(false)
    expect(tags.scope().highlightedIndex).toBe(1)
  })

  it('PageDown and PageUp move by the visible page and clamp at the edges', async () => {
    const tags = widget({ withFilter: false, options: manyTags(6) })
    await tags.scope().open()
    Object.defineProperty(tags.list(), 'clientHeight', { value: 90, configurable: true })
    Object.defineProperty(tags.rows()[0]!.element, 'offsetHeight', { value: 30, configurable: true })

    await tags.field().trigger('keydown', { key: 'PageDown' }) // 0 + 3
    expect(tags.scope().highlightedIndex).toBe(3)
    await tags.field().trigger('keydown', { key: 'PageDown' }) // clamped to the end
    expect(tags.scope().highlightedIndex).toBe(5)
    await tags.field().trigger('keydown', { key: 'PageUp' })
    expect(tags.scope().highlightedIndex).toBe(2)
  })

  it('the page falls back to 10 rows when nothing is measurable', async () => {
    const tags = widget({ withFilter: false, options: manyTags(12) })
    await tags.scope().open()
    await tags.field().trigger('keydown', { key: 'PageDown' })
    expect(tags.scope().highlightedIndex).toBe(10)
  })

  it('Enter selects the highlighted row — and nothing without a highlight', async () => {
    const tags = widget({ withFilter: false })
    await tags.scope().open()
    tags.scope().setHighlightedIndex(1)
    await tags.field().trigger('keydown', { key: 'Enter' })
    expect(tags.model()).toEqual(TAGS[1])

    const empty = widget({ options: [] })
    await empty.scope().open()
    await empty.field().trigger('keydown', { key: 'Enter' })
    expect(empty.writes()).toBe(0)
  })

  it('Space is swallowed on the trigger and left alone elsewhere', async () => {
    const tags = widget({ withChip: true })
    await tags.scope().open()

    const onTrigger = keypress(' ')
    tags.field().element.dispatchEvent(onTrigger)
    expect(onTrigger.defaultPrevented).toBe(true)
    expect(tags.scope().isOpen).toBe(true)

    const onChip = keypress(' ')
    tags.chip().element.dispatchEvent(onChip)
    expect(onChip.defaultPrevented).toBe(false)
  })

  it('an empty result list clears the highlight and survives the arrows', async () => {
    const tags = widget({ withFilter: false })
    await tags.scope().open()
    await tags.type('nothing matches this')
    expect(tags.rendered()).toHaveLength(0)
    expect(tags.scope().highlightedIndex).toBe(-1)

    await tags.field().trigger('keydown', { key: 'ArrowDown' })
    expect(tags.scope().highlightedIndex).toBe(-1)
    await tags.field().trigger('keydown', { key: 'Enter' })
    expect(tags.writes()).toBe(0)
  })

  it('every key is ignored while disabled', async () => {
    const tags = widget({ disabled: true })
    await tags.field().trigger('keydown', { key: 'ArrowDown' })
    expect(tags.scope().isOpen).toBe(false)
  })
})

describe('keys pressed while closed', () => {
  it.each(['Enter', ' ', 'ArrowDown', 'ArrowUp'])('%s opens from the trigger', async (key) => {
    const tags = widget()
    await tags.field().trigger('keydown', { key })
    expect(tags.scope().isOpen).toBe(true)
  })

  it('Backspace drops the last selection', async () => {
    const tags = widget({ multiple: true, modelValue: [TAGS[0]!, TAGS[1]!], withFilter: false })
    await tags.field().trigger('keydown', { key: 'Backspace' })
    expect(tags.model()).toEqual([TAGS[0]])
  })

  it('Backspace edits text instead when the field holds some', async () => {
    const tags = widget({ shape: 'typeahead', modelValue: TAGS[0] })
    ;(tags.field().element as HTMLInputElement).value = 'acce'
    await tags.field().trigger('keydown', { key: 'Backspace' })
    expect(tags.writes()).toBe(0)
  })
})

describe('Tab', () => {
  it('skips the options list, closes, and lands outside the widget', async () => {
    const tags = widget({ shape: 'typeahead' })
    await tags.scope().open()
    await tags.field().trigger('keydown', { key: 'Tab' })
    expect(tags.scope().isOpen).toBe(false)
    expect(document.activeElement).toBe(tags.outside)
  })

  it('Shift+Tab goes backward and closes too', async () => {
    const tags = widget({ shape: 'typeahead' })
    await tags.scope().open()
    await tags.field().trigger('keydown', { key: 'Tab', shiftKey: true })
    expect(tags.scope().isOpen).toBe(false)
    expect(tags.wrapper.find('.widget').element.contains(document.activeElement)).toBe(false)
  })

  it('selectOnTab picks the highlighted row on the way out', async () => {
    const tags = widget({ shape: 'typeahead', selectOnTab: true })
    await tags.scope().open()
    tags.scope().setHighlightedIndex(2)
    await tags.field().trigger('keydown', { key: 'Tab' })
    expect(tags.model()).toEqual(TAGS[2])
    expect(tags.scope().isOpen).toBe(false)
  })

  it('unwired children keep every key but Tab', async () => {
    const tags = widget({ withFilter: false, withChip: true })
    await tags.scope().open()

    // Enter bubbling from the chip must not drive the combobox.
    tags.chip().element.dispatchEvent(keypress('Enter'))
    await nextTick()
    expect(tags.writes()).toBe(0)
    expect(tags.scope().isOpen).toBe(true)

    // Tab from the chip still skips the list and exits.
    ;(tags.chip().element as HTMLElement).focus()
    tags.chip().element.dispatchEvent(keypress('Tab'))
    await nextTick()
    expect(tags.scope().isOpen).toBe(false)
    expect(document.activeElement).toBe(tags.outside)
  })
})

describe('Backspace with the popup open', () => {
  it('never removes selections while a separate filter input exists', async () => {
    const tags = widget({ multiple: true, modelValue: [TAGS[0]!] })
    await tags.scope().open()
    await tags.filter().trigger('keydown', { key: 'Backspace' })
    expect(tags.writes()).toBe(0)
  })

  it('removes the last selection from an empty typeahead', async () => {
    const tags = widget({ shape: 'typeahead', multiple: true, modelValue: [TAGS[0]!, TAGS[2]!] })
    await tags.scope().open()
    await tags.field().trigger('keydown', { key: 'Delete' })
    expect(tags.model()).toEqual([TAGS[0]])
  })
})

describe('selection', () => {
  it('single: clicking a row emits its value and closes', async () => {
    const tags = widget()
    await tags.scope().open()
    await tags.rows()[1]!.trigger('click')
    expect(tags.model()).toEqual(TAGS[1])
    expect(tags.scope().isOpen).toBe(false)
  })

  it('multiple: clicking toggles and the popup stays open', async () => {
    const tags = widget({ multiple: true })
    await tags.scope().open()
    await tags.rows()[0]!.trigger('click')
    expect(tags.model()).toEqual([TAGS[0]])
    expect(tags.scope().isOpen).toBe(true)

    await tags.rows()[0]!.trigger('click')
    expect(tags.model()).toEqual([])
  })

  it('closeOnSelect overrides the per-mode default in both directions', async () => {
    const closing = widget({ multiple: true, closeOnSelect: true })
    await closing.scope().open()
    await closing.rows()[0]!.trigger('click')
    expect(closing.scope().isOpen).toBe(false)

    const staying = widget({ closeOnSelect: false })
    await staying.scope().open()
    await staying.rows()[0]!.trigger('click')
    expect(staying.scope().isOpen).toBe(true)
  })

  it('at maxLength the other rows are inert, selected rows still toggle', async () => {
    const tags = widget({ multiple: true, maxLength: 1, modelValue: [TAGS[0]!] })
    await tags.scope().open()
    expect(tags.rows()[1]!.attributes('aria-disabled')).toBe('true')
    expect(tags.rows()[0]!.attributes('aria-disabled')).toBeUndefined()

    await tags.rows()[1]!.trigger('click')
    expect(tags.writes()).toBe(0)
    await tags.rows()[0]!.trigger('click')
    expect(tags.model()).toEqual([])
  })

  it('clear() empties either mode', async () => {
    const single = picker({ modelValue: TAGS[0] })
    single.scope().clear()
    await nextTick()
    expect(single.model()).toBeNull()

    const multi = picker({ multiple: true, modelValue: [TAGS[0]!] })
    multi.scope().clear()
    await nextTick()
    expect(multi.model()).toEqual([])
  })

  it('optionValue drives what is stored and compared', async () => {
    const tags = widget({
      optionValue: (option) => (option as Tag).id as unknown as Tag,
      modelValue: 2 as unknown as Tag,
    })
    await tags.scope().open()
    expect(tags.rows()[1]!.attributes('aria-selected')).toBe('true')
    await tags.rows()[2]!.trigger('click')
    expect(tags.model()).toBe(3)
  })
})

describe('tags the caller marks unavailable (optionDisabled)', () => {
  const withoutPerformance = { optionDisabled: (option: unknown) => (option as Tag).label === 'performance' }

  it('says so in the ARIA props of the row', async () => {
    const tags = picker(withoutPerformance)
    await nextTick()
    expect(tags.scope().getOptionProps(TAGS[2]!, 2)['aria-disabled']).toBe(true)
    expect(tags.scope().getOptionProps(TAGS[0]!, 0)['aria-disabled']).toBeUndefined()
  })

  it('refuses the pick even when it comes from code', async () => {
    const tags = picker(withoutPerformance)
    tags.scope().select(TAGS[2]!)
    await nextTick()
    expect(tags.writes()).toBe(0)
  })
})

describe('resolving what was typed when the popup closes (commitOnClose)', () => {
  /** Open, type, close — the "typed something then clicked away" path. */
  async function typeThenLeave(setup: Setup, text: string) {
    const tags = picker({ modelValue: TAGS[0], ...setup })
    await tags.scope().open()
    await tags.type(text)
    tags.scope().close()
    await nextTick()
    return tags
  }

  it('throws the text away by default and keeps the tag that was there', async () => {
    const tags = await typeThenLeave({}, 'design')
    expect(tags.writes()).toBe(0)
    expect(tags.scope().searchQuery).toBeUndefined()
  })

  it('reads an emptied field as "remove my tag", in every mode', async () => {
    for (const commitOnClose of ['none', 'match', 'auto'] as const) {
      const tags = await typeThenLeave({ commitOnClose }, '')
      expect(tags.model(), commitOnClose).toBeNull()
    }
  })

  it('does nothing when the user never typed at all', async () => {
    const tags = picker({ modelValue: TAGS[0], commitOnClose: 'auto' })
    await tags.scope().open()
    tags.scope().close()
    await nextTick()
    expect(tags.writes()).toBe(0)
  })

  it('match: takes the tag whose label was typed out in full', async () => {
    const tags = await typeThenLeave({ commitOnClose: 'match' }, 'PERFORMANCE')
    expect(tags.model()).toEqual(TAGS[2])
  })

  it('match: keeps the current tag when the text matches nothing', async () => {
    const tags = await typeThenLeave({ commitOnClose: 'match' }, 'perf')
    expect(tags.writes()).toBe(0)
  })

  it('auto: settles for the best result of a server search', async () => {
    // Starting elsewhere, so landing on the first result is an actual change.
    const tags = await typeThenLeave(
      { commitOnClose: 'auto', externalFilter: true, modelValue: TAGS[2] },
      'whatever the server understood',
    )
    expect(tags.model()).toEqual(TAGS[0])
  })

  it('auto: creates the tag when creating is on the table', async () => {
    const onCreate = vi.fn()
    const tags = await typeThenLeave({ commitOnClose: 'auto', ...creating, onCreate }, 'i18n')
    expect(onCreate).toHaveBeenCalledWith({ id: null, label: 'i18n' })
    expect(tags.model()).toEqual({ id: null, label: 'i18n' })
  })

  it('auto: gives up and empties the field when nothing fits', async () => {
    const tags = await typeThenLeave({ commitOnClose: 'auto' }, 'i18n')
    expect(tags.model()).toBeNull()
  })

  it('leaves multiple selection alone — chips already say what was picked', async () => {
    const tags = picker({ multiple: true, modelValue: [TAGS[0]!], commitOnClose: 'auto' })
    await tags.scope().open()
    await tags.type('i18n')
    tags.scope().close()
    await nextTick()
    expect(tags.writes()).toBe(0)
  })

  it('commits once, though committing also closes the popup', async () => {
    const tags = await typeThenLeave({ commitOnClose: 'match' }, 'performance')
    expect(tags.scope().isOpen).toBe(false)
    expect(tags.writes()).toBe(1)
  })

  it('never overrules a tag the user actually clicked', async () => {
    // Typed, then picked a row anyway: the leftover text must not replace that
    // pick with whatever it would have resolved to.
    const tags = picker({ commitOnClose: 'auto', externalFilter: true })
    await tags.scope().open()
    await tags.type('whatever the server understood')
    tags.scope().select(TAGS[2]!)
    await nextTick()

    expect(tags.scope().isOpen).toBe(false)
    expect(tags.model()).toEqual(TAGS[2])
    expect(tags.writes()).toBe(1)
  })
})

describe('telling the facade what changed', () => {
  it('reports both directions of a toggle in multiple mode', async () => {
    const onSelect = vi.fn()
    const onRemove = vi.fn()
    const tags = picker({ multiple: true, modelValue: [], onSelect, onRemove })

    tags.scope().select(TAGS[1]!)
    await nextTick()
    expect(onSelect).toHaveBeenCalledWith(TAGS[1])

    tags.scope().select(TAGS[1]!)
    await nextTick()
    expect(onRemove).toHaveBeenCalledWith(TAGS[1])
    expect(tags.model()).toEqual([])
  })

  it('names the tag that Backspace dropped', async () => {
    const onRemove = vi.fn()
    const tags = picker({ multiple: true, modelValue: [TAGS[0]!, TAGS[1]!], onRemove })
    await tags.scope().open()
    tags.scope().handleKeydown(keypress('Backspace'))
    await nextTick()

    expect(onRemove).toHaveBeenCalledWith(TAGS[1])
    expect(tags.model()).toEqual([TAGS[0]])
  })

  it('treats re-picking as removal once deselectOnReselect is on', async () => {
    const onRemove = vi.fn()
    const tags = picker({ modelValue: TAGS[1], deselectOnReselect: true, onRemove })
    tags.scope().select(TAGS[1]!)
    await nextTick()

    expect(tags.model()).toBeNull()
    expect(onRemove).toHaveBeenCalledWith(TAGS[1])
  })

  it('treats it as a plain pick without the flag', async () => {
    const onRemove = vi.fn()
    const onSelect = vi.fn()
    const tags = picker({ modelValue: TAGS[1], onRemove, onSelect })
    tags.scope().select(TAGS[1]!)
    await nextTick()

    expect(onSelect).toHaveBeenCalledWith(TAGS[1])
    expect(onRemove).not.toHaveBeenCalled()
  })
})

describe('focus', () => {
  it('opening focuses the filter input', async () => {
    const tags = widget()
    await tags.scope().open()
    await nextTick()
    expect(document.activeElement).toBe(tags.filter().element)
  })

  it('selecting in multiple mode hands focus back to the filter', async () => {
    const tags = widget({ multiple: true })
    await tags.scope().open()
    await nextTick()
    await tags.rows()[0]!.trigger('click')
    await nextTick()
    expect(document.activeElement).toBe(tags.filter().element)
  })

  it('never steals focus from an outside text field', async () => {
    const tags = widget({ multiple: true })
    await tags.scope().open()
    const elsewhere = document.createElement('input')
    document.body.appendChild(elsewhere)
    elsewhere.focus()

    tags.scope().select(tags.scope().visibleOptions[0]!)
    await nextTick()
    await nextTick()
    expect(document.activeElement).toBe(elsewhere)
    elsewhere.remove()
  })
})

describe('Popover API', () => {
  it('drives showPopover and hidePopover when the dropdown is a popover', async () => {
    const tags = widget({ asPopover: true })
    const popup = tags.wrapper.find('.popup').element as HTMLElement
    let shown = false
    const show = vi.fn(() => { shown = true })
    const hide = vi.fn(() => { shown = false })
    Object.assign(popup, { showPopover: show, hidePopover: hide })
    popup.matches = (() => shown) as unknown as typeof popup.matches

    await tags.scope().open()
    expect(show).toHaveBeenCalledTimes(1)
    tags.scope().close()
    expect(hide).toHaveBeenCalledTimes(1)
  })
})

describe('positioning', () => {
  it('anchors the popup under the trigger', () => {
    const tags = picker()
    expect(tags.scope().popupStyle.top).toBe('anchor(bottom)')
    expect(tags.scope().popupStyle.width).toBe('anchor-size(width)')
    expect(tags.scope().popupStyle.positionAnchor).toBe(tags.scope().cssAnchorName)
  })

  it('sanitizes colons out of the ids and anchor name', () => {
    const tags = picker({ id: 'menu:x' })
    expect(tags.scope().listboxProps.id).toBe('menu-x-listbox')
    expect(tags.scope().cssAnchorName).toBe('--anchor-menu-x')
  })
})

describe('ARIA wiring', () => {
  it('the trigger bag wires the listbox and reflects the popup state', async () => {
    const tags = widget()
    expect(tags.field().attributes('role')).toBe('combobox')
    expect(tags.field().attributes('aria-haspopup')).toBe('listbox')
    expect(tags.field().attributes('aria-expanded')).toBe('false')
    expect(tags.field().attributes('aria-controls')).toBe(tags.scope().listboxProps.id)

    await tags.field().trigger('click')
    expect(tags.field().attributes('aria-expanded')).toBe('true')
  })

  it('the typeahead bag puts the combobox role on the input with native disabled/readonly', () => {
    const tags = widget({ shape: 'typeahead', readonly: true })
    expect(tags.field().attributes('role')).toBe('combobox')
    expect(tags.field().attributes('aria-autocomplete')).toBe('list')
    expect(tags.field().attributes('readonly')).toBeDefined()
    expect(tags.field().attributes('aria-readonly')).toBe('true')
  })

  it('the secondary filter is a searchbox', () => {
    const tags = widget()
    expect(tags.filter().attributes('role')).toBe('searchbox')
    expect(tags.filter().attributes('aria-controls')).toBe(tags.scope().listboxProps.id)
  })

  it('aria-activedescendant follows the highlight', async () => {
    const tags = widget({ withFilter: false })
    await tags.scope().open()
    await tags.field().trigger('keydown', { key: 'ArrowDown' })
    expect(tags.field().attributes('aria-activedescendant')).toBe(tags.highlighted()!.attributes('id'))
  })

  it('aria-selected reflects the selection, never the highlight', async () => {
    const tags = widget({ modelValue: TAGS[2] })
    await tags.scope().open()
    tags.scope().setHighlightedIndex(0)
    await nextTick()

    expect(tags.rows()[0]!.attributes('data-highlighted')).toBe('true')
    expect(tags.rows()[0]!.attributes('aria-selected')).toBe('false')
    expect(tags.rows()[2]!.attributes('aria-selected')).toBe('true')
  })

  it('the listbox is multi-selectable only in multiple mode', () => {
    expect(picker().scope().listboxProps['aria-multiselectable']).toBeUndefined()
    expect(picker({ multiple: true }).scope().listboxProps['aria-multiselectable']).toBe(true)
  })

  it('rows carry ids derived from the instance id', async () => {
    const tags = widget({ id: 'pick' })
    await tags.scope().open()
    expect(tags.rows().map((row) => row.attributes('id'))).toEqual(['pick-opt-0', 'pick-opt-1', 'pick-opt-2'])
  })
})

describe('validation', () => {
  it('derives the error codes from the selection count', () => {
    expect(picker({ required: true }).scope().errors).toEqual(['required'])
    expect(picker({ multiple: true, minLength: 1 }).scope().errors).toEqual(['minlength'])
    expect(
      picker({ multiple: true, maxLength: 1, modelValue: [TAGS[0]!, TAGS[1]!] }).scope().errors,
    ).toEqual(['maxlength'])
    expect(picker({ modelValue: TAGS[0], required: true }).scope().errors).toEqual([])
  })

  it('keeps the state, spells no default text, honors errorMessages', () => {
    expect(picker({ required: true }).scope().validationMessage).toBe('')
    expect(picker({ required: true, errorMessages: { required: 'Requis.' } }).scope().validationMessage)
      .toBe('Requis.')
    expect(picker({ multiple: true, minLength: 1 }).scope().validationMessage).toBe('')
    expect(picker({
      multiple: true,
      minLength: 1,
      errorMessages: { minlength: 'Au moins une option.' },
    }).scope().validationMessage).toBe('Au moins une option.')
  })

  it('errorMessages overrides the defaults', () => {
    const tags = picker({ required: true, errorMessages: { required: 'Il en faut un' } })
    expect(tags.scope().validationMessage).toBe('Il en faut un')
  })

  it('valid flips as the selection changes', async () => {
    const tags = picker({ required: true })
    expect(tags.scope().valid).toBe(false)
    tags.scope().select(tags.scope().visibleOptions[0]!)
    await nextTick()
    expect(tags.scope().valid).toBe(true)
  })
})

describe('props source forms', () => {
  it('tracks ref and computed fields', async () => {
    const options = ref([...TAGS])
    let scope!: ComboboxScope<Tag, Tag>
    mount(defineComponent({
      setup() {
        scope = useCombobox<Tag, Tag>(
          {
            modelValue: ref(null),
            options,
            multiple: computed(() => false),
          } as never,
          () => {},
        )
        return () => h('div')
      },
    }))

    expect(scope.filteredOptions.value).toHaveLength(3)
    options.value = [...options.value, { id: 4, label: 'i18n' }]
    await nextTick()
    expect(scope.filteredOptions.value).toHaveLength(4)
  })

  it('tracks a reactive props object', async () => {
    const source = reactive({ modelValue: null, options: [...TAGS] })
    let scope!: ComboboxScope<Tag, Tag>
    mount(defineComponent({
      setup() {
        scope = useCombobox<Tag, Tag>(source as never, () => {})
        return () => h('div')
      },
    }))

    expect(scope.filteredOptions.value).toHaveLength(3)
    source.options = source.options.slice(0, 1)
    await nextTick()
    expect(scope.filteredOptions.value).toHaveLength(1)
  })
})
