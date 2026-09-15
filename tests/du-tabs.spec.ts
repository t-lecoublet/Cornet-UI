// DuTabs on the WAI-ARIA tabs pattern.
//
// It used to be daisyUI's radio-group trick: hidden `<input type="radio">`
// sharing a `name` that defaulted to the literal "my_tabs", so two tab groups
// on a page fought over one radio group. The radios did buy arrow keys for
// free, which is why the replacement has to provide them before the trick can
// go — that debt is paid by `core/navigation/useRovingIndex`.
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import DuTabs from '../components/Navigation/du-tabs/du-tabs.vue'
import type { DuTabItem } from '../components/Navigation/du-tabs/du-tabs.types'

const mounted: { unmount: () => void }[] = []

afterEach(() => {
  mounted.splice(0).forEach((wrapper) => wrapper.unmount())
  document.body.innerHTML = ''
})

const items: DuTabItem[] = [
  { label: 'One', value: 'one', content: 'Content one' },
  { label: 'Two', value: 'two', content: 'Content two', active: true },
  { label: 'Three', value: 'three' },
]

function tabs(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  const wrapper = mount(DuTabs, {
    attachTo: document.body,
    props: { items, ariaLabel: 'Sections', ...props },
    slots,
  })
  mounted.push(wrapper)

  return {
    wrapper,
    list: () => wrapper.find('[role="tablist"]'),
    tabs: () => wrapper.findAll('[role="tab"]'),
    elements: () => wrapper.findAll('[role="tab"]').map((w) => w.element as HTMLElement),
    panels: () => wrapper.findAll('[role="tabpanel"]'),
    selected: () => wrapper.findAll('[role="tab"]')
      .filter((w) => w.attributes('aria-selected') === 'true')
      .map((w) => w.text()),
    focused: () => (document.activeElement as HTMLElement | null)?.textContent?.trim(),
  }
}

async function fire(element: EventTarget, key: string): Promise<KeyboardEvent> {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
  element.dispatchEvent(event)
  await nextTick()
  return event
}

async function press(element: HTMLElement, key: string) {
  await fire(element, key)
}

describe('roles and wiring', () => {
  it('is a tablist of tabs and panels', () => {
    const t = tabs()
    expect(t.list().attributes('aria-label')).toBe('Sections')
    expect(t.tabs()).toHaveLength(3)
    expect(t.panels()).toHaveLength(2)
  })

  it('points each tab at its panel and back', () => {
    const t = tabs()
    const tab = t.tabs()[0]!
    const panel = t.panels()[0]!

    expect(tab.attributes('aria-controls')).toBe(panel.attributes('id'))
    expect(panel.attributes('aria-labelledby')).toBe(tab.attributes('id'))
  })

  it('leaves the panel reachable when nothing inside it is', () => {
    expect(tabs().panels()[0]!.attributes('tabindex')).toBe('0')
  })

  it('gives two tab groups on a page different ids', () => {
    // The old radio `name` defaulted to "my_tabs" for everyone, so picking a
    // tab in one group cleared the other.
    const page = mount(defineComponent({
      render: () => [h(DuTabs, { items }), h(DuTabs, { items })],
    }))
    mounted.push(page)

    const ids = page.findAllComponents(DuTabs)
      .map((instance) => instance.find('[role="tab"]').attributes('id'))

    expect(ids[0]).toBeTruthy()
    expect(ids[0]).not.toBe(ids[1])
  })

  it('has no radio inputs left', () => {
    expect(tabs().wrapper.findAll('input')).toHaveLength(0)
  })
})

describe('selection', () => {
  it('starts on the item marked active', () => {
    expect(tabs().selected()).toEqual(['Two'])
  })

  it('falls back to the first usable tab', () => {
    const t = tabs({ items: [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }] })
    expect(t.selected()).toEqual(['A'])
  })

  it('skips a disabled tab when choosing where to start', () => {
    const t = tabs({ items: [{ label: 'A', value: 'a', disabled: true }, { label: 'B', value: 'b' }] })
    expect(t.selected()).toEqual(['B'])
  })

  it('selects on click and emits the value, not the index', async () => {
    const t = tabs()
    await t.tabs()[2]!.trigger('click')

    expect(t.wrapper.emitted('update:modelValue')).toEqual([['three']])
    expect(t.selected()).toEqual(['Three'])
  })

  it('falls back to the index when an item has no value', async () => {
    const t = tabs({ items: [{ label: 'A' }, { label: 'B' }] })
    await t.tabs()[1]!.trigger('click')
    expect(t.wrapper.emitted('update:modelValue')).toEqual([[1]])
  })

  it('follows a modelValue it is given, and does not move on its own', async () => {
    const t = tabs({ modelValue: 'one' })

    await t.tabs()[2]!.trigger('click')
    expect(t.wrapper.emitted('update:modelValue'), 'it asks').toEqual([['three']])
    expect(t.selected(), 'the parent decides').toEqual(['One'])

    await t.wrapper.setProps({ modelValue: 'three' })
    expect(t.selected()).toEqual(['Three'])
  })

  it('calls the item callback once per click', async () => {
    const onClick = vi.fn()
    const t = tabs({ items: [{ label: 'A', value: 'a', onClick }] })

    await t.tabs()[0]!.trigger('click')

    expect(onClick).toHaveBeenCalledOnce()
  })

  it('refuses a disabled tab', async () => {
    const t = tabs({ items: [{ label: 'A', value: 'a' }, { label: 'B', value: 'b', disabled: true }] })

    await t.tabs()[1]!.trigger('click')

    expect(t.wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(t.tabs()[1]!.attributes('aria-disabled')).toBe('true')
  })
})

describe('the tab stop', () => {
  it('sits on the selected tab, so the group is one stop', () => {
    // Tab into the group and you land on what is showing, not on wherever the
    // focus happened to be last.
    expect(tabs().tabs().map((w) => w.attributes('tabindex'))).toEqual(['-1', '0', '-1'])
  })

  it('moves with the selection', async () => {
    const t = tabs()
    await t.tabs()[0]!.trigger('click')
    expect(t.tabs().map((w) => w.attributes('tabindex'))).toEqual(['0', '-1', '-1'])
  })

  it('never sits on a disabled tab', () => {
    const t = tabs({ items: [{ label: 'A', value: 'a', disabled: true }, { label: 'B', value: 'b' }] })
    expect(t.tabs().map((w) => w.attributes('tabindex'))).toEqual(['-1', '0'])
  })
})

describe('keyboard', () => {
  it('moves along the row with the horizontal arrows, and wraps', async () => {
    const t = tabs()
    const els = t.elements()
    els[0]!.focus()

    await press(els[0]!, 'ArrowRight')
    expect(t.focused()).toBe('Two')

    await press(els[1]!, 'ArrowLeft')
    expect(t.focused()).toBe('One')

    await press(els[0]!, 'ArrowLeft')
    expect(t.focused(), 'wraps to the end').toBe('Three')
  })

  it('jumps to the ends on Home and End', async () => {
    const t = tabs()
    const els = t.elements()
    els[1]!.focus()

    await press(els[1]!, 'End')
    expect(t.focused()).toBe('Three')

    await press(document.activeElement as HTMLElement, 'Home')
    expect(t.focused()).toBe('One')
  })

  it('steps over a disabled tab', async () => {
    const t = tabs({
      items: [{ label: 'A', value: 'a' }, { label: 'B', value: 'b', disabled: true }, { label: 'C', value: 'c' }],
    })
    const els = t.elements()
    els[0]!.focus()

    await press(els[0]!, 'ArrowRight')

    expect(t.focused()).toBe('C')
  })

  it('selects as it moves, by default', async () => {
    // What the radio group did. Right while the panels are cheap.
    const t = tabs()
    const els = t.elements()
    els[0]!.focus()

    await press(els[0]!, 'ArrowRight')

    expect(t.selected()).toEqual(['Two'])
  })

  it('waits for Enter or Space in manual mode', async () => {
    const t = tabs({ activation: 'manual', modelValue: undefined })
    const els = t.elements()
    els[1]!.focus()

    await press(els[1]!, 'ArrowRight')
    expect(t.focused(), 'focus moved').toBe('Three')
    expect(t.selected(), 'the selection did not').toEqual(['Two'])

    await press(document.activeElement as HTMLElement, 'Enter')
    expect(t.selected()).toEqual(['Three'])
  })

  it('accepts Space as well as Enter', async () => {
    const t = tabs({ activation: 'manual' })
    const els = t.elements()
    els[1]!.focus()

    await press(els[1]!, 'ArrowRight')
    await press(document.activeElement as HTMLElement, ' ')

    expect(t.selected()).toEqual(['Three'])
  })
})

describe('keys from inside a panel', () => {
  // The panels live inside the tablist (daisyUI's `.tab + .tab-content`
  // reveal), so their keydowns bubble to the tablist's listener. The tab
  // interface must only speak for the tabs: once the roving index is armed by
  // an arrow on a tab, a Space in a textarea used to be swallowed (and re-select
  // the tab), and the caret arrows used to steal focus.
  const panelItems: DuTabItem[] = [
    { label: 'A', value: 'a' },
    { label: 'B', value: 'b' },
    { label: 'C', value: 'c' },
  ]

  function tabsWithPanel(props: Record<string, unknown> = {}) {
    return tabs({ items: panelItems, ...props }, { content: '<textarea class="prompt"></textarea>' })
  }

  it('leaves Space in a textarea alone', async () => {
    const t = tabsWithPanel({ activation: 'manual' })
    const els = t.elements()
    const textarea = t.wrapper.find('.prompt').element as HTMLTextAreaElement
    els[0]!.focus()

    await press(els[0]!, 'ArrowRight')
    expect(t.focused(), 'armed like a keyboard user would').toBe('B')

    textarea.focus()
    const event = await fire(textarea, ' ')
    expect(event.defaultPrevented, 'the space belongs to the textarea').toBe(false)
    expect(t.selected(), 'and does not select a tab').toEqual(['A'])
    expect(document.activeElement).toBe(textarea)
  })

  it('leaves the caret arrows alone', async () => {
    const t = tabsWithPanel()
    const textarea = t.wrapper.find('.prompt').element as HTMLTextAreaElement
    textarea.focus()

    const event = await fire(textarea, 'ArrowRight')

    expect(event.defaultPrevented, 'the caret move is the textarea\'s').toBe(false)
    expect(document.activeElement, 'focus did not jump to a tab').toBe(textarea)
    expect(t.selected(), 'and no tab was activated').toEqual(['A'])
  })
})

describe('rendering', () => {
  it('keeps a panel next to its tab, which is how daisyUI reveals it', () => {
    const t = tabs()
    const tab = t.tabs()[0]!.element
    expect(tab.nextElementSibling?.getAttribute('role')).toBe('tabpanel')
  })

  it('applies the type, size and placement classes', () => {
    expect(tabs({ type: 'border' }).list().classes()).toContain('tabs-border')
    expect(tabs({ size: 'lg' }).list().classes()).toContain('tabs-lg')
    expect(tabs({ bottom: true }).list().classes()).toContain('tabs-bottom')
  })

  it('renders the default slot instead of items, roles included', () => {
    const t = tabs({}, { default: '<div class="manual-tab">Manual</div>' })
    expect(t.wrapper.find('.manual-tab').exists()).toBe(true)
    expect(t.wrapper.findAll('[role="tab"]')).toHaveLength(0)
    expect(t.wrapper.find('[role="tablist"]').exists(), 'the consumer owns the roles').toBe(false)
  })

  it('lets an indexed slot beat the global one', () => {
    const t = tabs({}, {
      content: '<p class="global">Global</p>',
      'content-0': '<p class="indexed">Indexed</p>',
    })
    expect(t.panels()[0]!.find('.indexed').exists()).toBe(true)
    expect(t.panels()[1]!.find('.global').exists()).toBe(true)
  })

  it('renders each icon shape', () => {
    expect(tabs({ items: [{ label: 'A', icon: '<svg class="my-icon"></svg>' }] })
      .wrapper.find('.my-icon').exists()).toBe(true)

    const url = tabs({ items: [{ label: 'A', icon: 'https://example.com/icon.png' }] }).wrapper.find('img')
    expect(url.attributes('src')).toBe('https://example.com/icon.png')
    expect(url.attributes('alt')).toBe('A')

    expect(tabs({ items: [{ label: 'A', icon: '/logo.svg' }] })
      .wrapper.find('img').attributes('src')).toBe('/logo.svg')
  })
})
