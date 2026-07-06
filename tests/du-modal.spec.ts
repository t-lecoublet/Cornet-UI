import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DuModal from '../components/Actions/du-modal/du-modal.vue'

describe('DuModal', () => {
  it('does not call showModal on mount when closed', () => {
    const wrapper = mount(DuModal)
    const dialog = wrapper.find('dialog').element as HTMLDialogElement
    expect(dialog.open).toBe(false)
  })

  it('calls showModal on mount when open is true', () => {
    const wrapper = mount(DuModal, { props: { open: true } })
    const dialog = wrapper.find('dialog').element as HTMLDialogElement
    expect(dialog.open).toBe(true)
  })

  it('opens/closes the dialog when the open prop changes', async () => {
    const wrapper = mount(DuModal, { props: { open: false } })
    const dialog = wrapper.find('dialog').element as HTMLDialogElement

    await wrapper.setProps({ open: true })
    expect(dialog.open).toBe(true)

    await wrapper.setProps({ open: false })
    expect(dialog.open).toBe(false)
  })

  it('exposes showModal/closeModal for external control', () => {
    const wrapper = mount(DuModal)
    const dialog = wrapper.find('dialog').element as HTMLDialogElement
    const vm = wrapper.vm as unknown as { showModal: () => void; closeModal: () => void }

    vm.showModal()
    expect(dialog.open).toBe(true)

    vm.closeModal()
    expect(dialog.open).toBe(false)
  })

  it('applies the placement class', () => {
    const wrapper = mount(DuModal, { props: { placement: 'top' } })
    expect(wrapper.find('dialog').classes()).toContain('modal-top')
  })

  it('renders the close button only when closeButton is true', () => {
    const withButton = mount(DuModal, { props: { closeButton: true } })
    expect(withButton.find('.btn-circle').exists()).toBe(true)

    const withoutButton = mount(DuModal, { props: { closeButton: false } })
    expect(withoutButton.find('.btn-circle').exists()).toBe(false)
  })

  it('renders the backdrop close form only when closeBackdrop is true', () => {
    const withBackdrop = mount(DuModal, { props: { closeBackdrop: true } })
    expect(withBackdrop.find('.modal-backdrop').exists()).toBe(true)

    const withoutBackdrop = mount(DuModal, { props: { closeBackdrop: false } })
    expect(withoutBackdrop.find('.modal-backdrop').exists()).toBe(false)
  })

  it('emits update:open false on native close event', async () => {
    const wrapper = mount(DuModal, { props: { open: true } })
    await wrapper.find('dialog').trigger('close')
    expect(wrapper.emitted('update:open')).toEqual([[false]])
  })

  it('closes on Escape when closeOnEscape is true', async () => {
    const wrapper = mount(DuModal, { props: { open: true, closeOnEscape: true } })
    const dialog = wrapper.find('dialog').element as HTMLDialogElement
    await wrapper.find('dialog').trigger('keydown', { key: 'Escape' })
    expect(dialog.open).toBe(false)
  })

  it('does not close on Escape when closeOnEscape is false', async () => {
    const wrapper = mount(DuModal, { props: { open: true, closeOnEscape: false } })
    const dialog = wrapper.find('dialog').element as HTMLDialogElement
    await wrapper.find('dialog').trigger('keydown', { key: 'Escape' })
    expect(dialog.open).toBe(true)
  })

  it('renders the actions slot only when provided', () => {
    const withActions = mount(DuModal, { slots: { actions: '<button>OK</button>' } })
    expect(withActions.find('.modal-action').exists()).toBe(true)

    const withoutActions = mount(DuModal)
    expect(withoutActions.find('.modal-action').exists()).toBe(false)
  })

  it('renders the default slot content', () => {
    const wrapper = mount(DuModal, { slots: { default: '<p class="body">Content</p>' } })
    expect(wrapper.find('.body').exists()).toBe(true)
  })

  it('forwards aria-label and aria-labelledby', () => {
    const wrapper = mount(DuModal, { props: { ariaLabel: 'My dialog', ariaLabelledby: 'title-id' } })
    const dialog = wrapper.find('dialog')
    expect(dialog.attributes('aria-label')).toBe('My dialog')
    expect(dialog.attributes('aria-labelledby')).toBe('title-id')
  })
})
