// The form fields: what a browser already does well, and what it cannot do.
//
// Constraint checking stays native — it is localized, it matches what the form
// decides on submit, and it covers the cases a hand-rolled version forgets.
// What the library adds is one *surface* over it, so a form mixing
// DuInputField with DuSelect and DuSearch reports errors the same way.
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import DuFileInput from '../components/DataInput/du-file-input/du-file-input.vue'
import DuInputField from '../components/DataInput/du-input-field/du-input-field.vue'
import DuLabel from '../components/DataInput/du-label/du-label.vue'

function field(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  const wrapper = mount(DuInputField, { attachTo: document.body, props, slots })
  const input = () => wrapper.find('input')
  return {
    wrapper,
    input,
    element: () => input().element as HTMLInputElement,
    hint: () => wrapper.find('.validator-hint'),
    async type(value: string) {
      await input().setValue(value)
    },
    async leave() {
      await input().trigger('blur')
    },
  }
}

describe('when the error shows', () => {
  it('stays quiet on an untouched field', async () => {
    // An unanswered field is not a failing one.
    const f = field({ required: true })
    await nextTick()
    expect(f.hint().exists()).toBe(false)
  })

  it('speaks up once the field has been left', async () => {
    const f = field({ required: true })
    await f.leave()
    expect(f.hint().exists()).toBe(true)
  })

  it('goes quiet again when the problem is fixed', async () => {
    const f = field({ required: true })
    await f.leave()
    expect(f.hint().exists()).toBe(true)

    await f.type('something')
    expect(f.hint().exists()).toBe(false)
  })
})

describe('what the error says', () => {
  it('reports the browser’s own code', async () => {
    const f = field({ required: true })
    await f.leave()
    expect((f.wrapper.vm as unknown as { errors: string[] }).errors).toEqual(['required'])
  })

  it('names the constraint that failed, not just “invalid”', async () => {
    const f = field({ type: 'email' })
    await f.type('not-an-email')
    await f.leave()
    expect((f.wrapper.vm as unknown as { errors: string[] }).errors).toEqual(['type'])
  })

  it('takes the consumer’s wording over the browser’s', async () => {
    const f = field({ required: true, errorMessages: { required: 'We need your email' } })
    await f.leave()
    expect(f.hint().text()).toBe('We need your email')
  })

  it('falls back to the browser’s message rather than inventing one', async () => {
    // The browser's wording is already localized, and already what the form
    // itself will say on submit. The exact string is the environment's; what
    // the component owns is deferring to it.
    const f = field({ required: true })
    await f.leave()

    const vm = f.wrapper.vm as unknown as { validationMessage: string }
    expect(vm.validationMessage).toBe(f.element().validationMessage)
  })

  it('hands the error to a slot for anyone who wants to render it themselves', async () => {
    const f = field(
      { required: true, errorMessages: { required: 'Required' } },
      { error: '<template #error="{ message, errors }"><span class="mine">{{ errors[0] }}: {{ message }}</span></template>' },
    )
    await f.leave()
    expect(f.wrapper.find('.mine').text()).toBe('required: Required')
  })
})

describe('how the error looks', () => {
  it('is visible, not left hidden by daisyUI', async () => {
    // daisyUI keeps `.validator-hint` at `visibility: hidden` unless it
    // follows a `.validator` — which the field never is.
    const f = field({ required: true })
    await f.leave()
    expect(f.hint().classes()).toContain('visible')
  })

  it('marks the field invalid and points it at the message', async () => {
    // jsdom leaves `validationMessage` empty, where a browser never does.
    const f = field({ required: true, errorMessages: { required: 'Required' }, 'aria-describedby': 'help' })
    expect(f.input().attributes('aria-invalid')).toBeUndefined()

    await f.leave()
    const hintId = f.hint().attributes('id')
    expect(f.input().classes()).toContain('input-error')
    expect(f.input().attributes('aria-invalid')).toBe('true')
    expect(f.input().attributes('aria-describedby')).toBe(`help ${hintId}`)
  })
})

describe('showValid', () => {
  it('stays neutral unless asked', async () => {
    const f = field({ required: true })
    await f.type('x')
    await f.leave()
    expect(f.input().classes()).not.toContain('input-success')
  })

  it('turns green once visited and valid', async () => {
    const f = field({ required: true, showValid: true })
    await f.type('x')
    expect(f.input().classes()).not.toContain('input-success')

    await f.leave()
    expect(f.input().classes()).toContain('input-success')
  })

  it('does not applaud an empty optional field', async () => {
    const f = field({ showValid: true })
    await f.leave()
    expect(f.input().classes()).not.toContain('input-success')
  })

  it('goes red, not green, when the value breaks a constraint', async () => {
    const f = field({ type: 'email', showValid: true })
    await f.type('nope')
    await f.leave()
    expect(f.input().classes()).toContain('input-error')
    expect(f.input().classes()).not.toContain('input-success')
  })

  it('turns the label green where the label draws the border', async () => {
    const wrapper = mount(
      { components: { DuLabel, DuInputField }, template: '<DuLabel type="input"><DuInputField required showValid /></DuLabel>' },
      { attachTo: document.body },
    )
    await wrapper.find('input').setValue('x')
    await wrapper.find('input').trigger('blur')
    expect(wrapper.find('label').classes()).toContain('input-success')
  })
})

describe('inside a DuLabel', () => {
  function labelled(type: string) {
    const wrapper = mount(
      { components: { DuLabel, DuInputField }, template: `<DuLabel type="${type}" class="mine"><span>Email</span><DuInputField required :errorMessages="{ required: 'Required' }" /></DuLabel>` },
      { attachTo: document.body },
    )
    return { wrapper, leave: () => wrapper.find('input').trigger('blur') }
  }

  it('renders the message after the label, never inside its flex row', async () => {
    // Inside, it became a flex item beside the field and squeezed it to half
    // its width.
    const l = labelled('floating-label')
    await l.leave()

    const label = l.wrapper.find('label')
    expect(label.find('.validator-hint').exists()).toBe(false)
    const hint = label.element.nextElementSibling as HTMLElement
    expect(hint.classList.contains('validator-hint')).toBe(true)
    expect(l.wrapper.find('input').attributes('aria-describedby')).toBe(hint.id)
  })

  it('keeps the consumer’s attributes on the label', () => {
    const l = labelled('floating-label')
    expect(l.wrapper.find('label').classes()).toEqual(expect.arrayContaining(['floating-label', 'mine']))
  })

  it('turns the label red where the label draws the border', async () => {
    const l = labelled('input')
    await l.leave()
    expect(l.wrapper.find('label').classes()).toContain('input-error')
  })

  it('drops the message when the field is fixed', async () => {
    const l = labelled('floating-label')
    await l.leave()
    await l.wrapper.find('input').setValue('x')
    expect(l.wrapper.find('.validator-hint').exists()).toBe(false)
  })
})

describe('what a form needs', () => {
  it('exposes validity, the way DuSelect and DuSearch do', async () => {
    const f = field({ required: true })
    const vm = f.wrapper.vm as unknown as { valid: boolean, validationMessage: string }
    await f.leave()

    expect(vm.valid).toBe(false)
    await f.type('x')
    expect(vm.valid).toBe(true)
    expect(vm.validationMessage).toBe('')
  })

  it('can be told every field was visited at once, as a submit does', async () => {
    const f = field({ required: true })
    const vm = f.wrapper.vm as unknown as { markTouched: () => void }

    vm.markTouched()
    await nextTick()

    expect(f.hint().exists()).toBe(true)
  })

  it('can be put back to untouched, as a reset does', async () => {
    const f = field({ required: true })
    const vm = f.wrapper.vm as unknown as { reset: () => void }
    await f.leave()

    vm.reset()
    await nextTick()

    expect(f.hint().exists()).toBe(false)
  })
})

/** The value the parent would be holding right now. */
function model(f: ReturnType<typeof field>) {
  const emissions = f.wrapper.emitted('update:modelValue')
  return emissions?.[emissions.length - 1]?.[0]
}

// An optional number or date nobody filled in has no value — it does not have a
// blank one. The browser hands back `''` for both, and `''` is never a valid one
// of either, so it is an absence wearing a value's clothes: it travelled into
// API payloads that a server then refused to parse.
describe('what an emptied field emits', () => {
  it('emits a number, not the text that was typed', async () => {
    const f = field({ type: 'number' })
    await f.type('12')
    expect(model(f)).toBe(12)
  })

  it('emits null once a number field is cleared', async () => {
    const f = field({ type: 'number' })
    await f.type('12')
    await f.type('')
    expect(model(f)).toBeNull()
  })

  it('emits null once a date field is cleared', async () => {
    const f = field({ type: 'date' })
    await f.type('2026-09-09')
    await f.type('')
    expect(model(f)).toBeNull()
  })

  it('emits null once a time field is cleared', async () => {
    const f = field({ type: 'time' })
    await f.type('09:30')
    await f.type('')
    expect(model(f)).toBeNull()
  })

  it('still hands back a real date when there is one', async () => {
    // Only the empty case changes: a filled date is a string, as it always was.
    const f = field({ type: 'date' })
    await f.type('2026-09-09')
    expect(model(f)).toBe('2026-09-09')
  })

  it('leaves a text field emitting the empty string', async () => {
    // An empty text field really did receive an empty string, and saying so is
    // not the same mistake.
    const f = field({ type: 'text' })
    await f.type('hello')
    await f.type('')
    expect(model(f)).toBe('')
  })

  it('leaves an email field emitting the empty string too', async () => {
    const f = field({ type: 'email' })
    await f.type('ada@example.com')
    await f.type('')
    expect(model(f)).toBe('')
  })
})

describe('the .number modifier', () => {
  // Vue hands `modelModifiers` to the child whether or not it reads them, so a
  // modifier the component ignores looks like it works. This one is read.
  it('casts on a field whose type is not number', async () => {
    const f = field({ type: 'text', modelModifiers: { number: true } })
    await f.type('12')
    expect(model(f)).toBe(12)
  })

  it('empties to null there too', async () => {
    const f = field({ type: 'text', modelModifiers: { number: true } })
    await f.type('12')
    await f.type('')
    expect(model(f)).toBeNull()
  })

  it('keeps what cannot be parsed, as Vue’s own .number does', async () => {
    // Deviating only on the empty case keeps the modifier predictable: nothing
    // the user typed is discarded behind their back.
    const f = field({ type: 'text', modelModifiers: { number: true } })
    await f.type('abc')
    expect(model(f)).toBe('abc')
  })

  it('is ignored when it was never asked for', async () => {
    const f = field({ type: 'text' })
    await f.type('12')
    expect(model(f)).toBe('12')
  })
})

describe('DuFileInput', () => {
  it('hands back the chosen files, which it could not do at all before', async () => {
    const wrapper = mount(DuFileInput)
    const input = wrapper.find('input')
    const file = new File(['x'], 'photo.png', { type: 'image/png' })
    Object.defineProperty(input.element, 'files', { value: [file] })

    await input.trigger('change')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[file]])
    expect(wrapper.emitted('change')?.[0]).toEqual([[file]])
  })

  it('reports an empty list when the choice is cleared', async () => {
    const wrapper = mount(DuFileInput)
    const input = wrapper.find('input')
    Object.defineProperty(input.element, 'files', { value: [] })

    await input.trigger('change')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[]])
  })

  it('passes multiple and accept to the browser', () => {
    const wrapper = mount(DuFileInput, { props: { multiple: true, accept: 'image/*' } })
    expect(wrapper.find('input').attributes('multiple')).toBeDefined()
    expect(wrapper.find('input').attributes('accept')).toBe('image/*')
  })

  it('clears the field when the model is emptied', async () => {
    // A file input cannot be *set* from script — the browser forbids it, so
    // nobody can slip a file into a form the user did not choose. Clearing is
    // the one direction that works, and a form reset needs it.
    const wrapper = mount(DuFileInput, { props: { modelValue: [new File(['x'], 'a.png')] } })
    const input = wrapper.find('input').element as HTMLInputElement

    await wrapper.setProps({ modelValue: [] })

    expect(input.value).toBe('')
  })
})
