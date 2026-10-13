import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DuCheckbox from '../components/DataInput/du-checkbox/du-checkbox.vue'

describe('DuCheckbox', () => {
  it('reflects modelValue on the checkbox', async () => {
    const wrapper = mount(DuCheckbox, { props: { modelValue: true } })
    const input = wrapper.find('input').element as HTMLInputElement
    expect(input.checked).toBe(true)
  })

  it('emits update:modelValue on change', async () => {
    const wrapper = mount(DuCheckbox, { props: { modelValue: false } })
    await wrapper.find('input').setValue(true)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })

  it('sets the DOM indeterminate state on mount', () => {
    const wrapper = mount(DuCheckbox, { props: { indeterminate: true } })
    const input = wrapper.find('input').element as HTMLInputElement
    expect(input.indeterminate).toBe(true)
  })

  it('reacts to indeterminate changing after mount', async () => {
    const wrapper = mount(DuCheckbox, { props: { indeterminate: false } })
    const input = wrapper.find('input').element as HTMLInputElement
    expect(input.indeterminate).toBe(false)

    await wrapper.setProps({ indeterminate: true })
    expect(input.indeterminate).toBe(true)

    await wrapper.setProps({ indeterminate: false })
    expect(input.indeterminate).toBe(false)
  })

  it('disables the input when disabled is true', () => {
    const wrapper = mount(DuCheckbox, { props: { disabled: true } })
    expect((wrapper.find('input').element as HTMLInputElement).disabled).toBe(true)
  })

  it('readonly: a click changes neither the state nor the model', async () => {
    const wrapper = mount(DuCheckbox, { props: { modelValue: true, readonly: true } })
    const input = wrapper.find('input').element as HTMLInputElement

    input.click()
    await wrapper.vm.$nextTick()

    expect(input.checked).toBe(true)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('readonly: stays enabled and announces itself as read-only', () => {
    const wrapper = mount(DuCheckbox, { props: { readonly: true } })
    const input = wrapper.find('input')
    expect((input.element as HTMLInputElement).disabled).toBe(false)
    expect(input.attributes('aria-readonly')).toBe('true')
  })

  it('omits aria-readonly when not readonly', () => {
    const wrapper = mount(DuCheckbox)
    expect(wrapper.find('input').attributes('aria-readonly')).toBeUndefined()
  })
})
