import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DuRating from '../components/DataInput/du-rating/du-rating.vue'

describe('DuRating', () => {
  it('renders `count` auto-generated stars by default', () => {
    const wrapper = mount(DuRating, { props: { count: 5 } })
    expect(wrapper.findAll('input[type="radio"]').length).toBe(5)
  })

  it('checks the star matching modelValue', () => {
    const wrapper = mount(DuRating, { props: { count: 5, modelValue: 3 } })
    const inputs = wrapper.findAll('input[type="radio"]')
    expect((inputs[2].element as HTMLInputElement).checked).toBe(true)
  })

  it('emits update:modelValue and change on click', async () => {
    const wrapper = mount(DuRating, { props: { count: 5, modelValue: 0 } })
    const inputs = wrapper.findAll('input[type="radio"]')
    await inputs[3].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([4])
    expect(wrapper.emitted('change')?.at(-1)).toEqual([4])
  })

  it('clears to 0 when clicking the currently selected star with clearable', async () => {
    const wrapper = mount(DuRating, { props: { count: 5, modelValue: 3, clearable: true } })
    const inputs = wrapper.findAll('input[type="radio"]')
    await inputs[2].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([0])
  })

  it('does not clear when clicking selected star without clearable', async () => {
    const wrapper = mount(DuRating, { props: { count: 5, modelValue: 3, clearable: false } })
    const inputs = wrapper.findAll('input[type="radio"]')
    await inputs[2].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([3])
  })

  it('ignores clicks when disabled', async () => {
    const wrapper = mount(DuRating, { props: { count: 5, modelValue: 0, disabled: true } })
    const inputs = wrapper.findAll('input[type="radio"]')
    await inputs[3].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('reacts to external modelValue changes', async () => {
    const wrapper = mount(DuRating, { props: { count: 5, modelValue: 1 } })
    await wrapper.setProps({ modelValue: 5 })
    const inputs = wrapper.findAll('input[type="radio"]')
    expect((inputs[4].element as HTMLInputElement).checked).toBe(true)
  })

  it('renders two inputs per star in halfStar mode', () => {
    const wrapper = mount(DuRating, { props: { count: 5, halfStar: true } })
    expect(wrapper.findAll('input[type="radio"]').length).toBe(10)
  })

  it('renders items in dynamic items mode', () => {
    const wrapper = mount(DuRating, { props: { items: [{ value: 1 }, { value: 2 }, { value: 3 }] } })
    expect(wrapper.findAll('input[type="radio"]').length).toBe(3)
  })

  it('renders the default slot in manual mode', () => {
    const wrapper = mount(DuRating, { props: { count: 0 }, slots: { default: '<span class="manual">Manual</span>' } })
    expect(wrapper.find('.manual').exists()).toBe(true)
  })

  it('exposes the current value via defineExpose', () => {
    const wrapper = mount(DuRating, { props: { count: 5, modelValue: 4 } })
    expect((wrapper.vm as any).value).toBe(4)
  })
})
