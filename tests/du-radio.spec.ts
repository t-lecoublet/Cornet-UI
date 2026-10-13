import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DuRadio from '../components/DataInput/du-radio/du-radio.vue'

describe('DuRadio', () => {
  it('reflects checked on the radio', () => {
    const wrapper = mount(DuRadio, { props: { checked: true } })
    expect((wrapper.find('input').element as HTMLInputElement).checked).toBe(true)
  })

  it('disables the input when disabled is true', () => {
    const wrapper = mount(DuRadio, { props: { disabled: true } })
    expect((wrapper.find('input').element as HTMLInputElement).disabled).toBe(true)
  })

  it('readonly: a click neither checks it nor fires change', () => {
    const wrapper = mount(DuRadio, { props: { readonly: true } })
    const input = wrapper.find('input').element as HTMLInputElement
    let changed = false
    input.addEventListener('change', () => { changed = true })

    input.click()

    expect(input.checked).toBe(false)
    expect(changed).toBe(false)
  })

  it('readonly: stays enabled and announces itself as read-only', () => {
    const wrapper = mount(DuRadio, { props: { readonly: true } })
    const input = wrapper.find('input')
    expect((input.element as HTMLInputElement).disabled).toBe(false)
    expect(input.attributes('aria-readonly')).toBe('true')
  })

  it('a regular radio still checks on click', () => {
    const wrapper = mount(DuRadio)
    const input = wrapper.find('input').element as HTMLInputElement
    input.click()
    expect(input.checked).toBe(true)
  })
})
