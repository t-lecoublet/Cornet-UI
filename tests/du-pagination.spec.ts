import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DuPagination from '../components/Navigation/du-pagination/du-pagination.vue'

function mountPagination(props: Record<string, unknown> = {}) {
  return mount(DuPagination, {
    props: { total: 100, perPage: 10, modelValue: 5, ...props },
  })
}

describe('DuPagination', () => {
  it('renders a labelled navigation landmark', () => {
    const wrapper = mountPagination()
    const nav = wrapper.find('nav')
    expect(nav.exists()).toBe(true)
    expect(nav.attributes('aria-label')).toBe('Pagination')
  })

  it('marks the current page with aria-current', () => {
    const wrapper = mountPagination()
    const current = wrapper.find('[aria-current="page"]')
    expect(current.exists()).toBe(true)
    expect(current.text()).toBe('5')
  })

  it('hides ellipsis buttons from keyboard and screen readers', () => {
    const wrapper = mountPagination()
    const ellipsis = wrapper.findAll('button').filter((b) => b.text() === '...')
    expect(ellipsis.length).toBeGreaterThan(0)
    for (const b of ellipsis) {
      expect(b.attributes('aria-hidden')).toBe('true')
      expect(b.attributes('disabled')).toBeDefined()
    }
  })

  it('labels the symbol-only previous/next buttons', () => {
    const wrapper = mountPagination()
    expect(wrapper.find('[aria-label="Previous page"]').exists()).toBe(true)
    expect(wrapper.find('[aria-label="Next page"]').exists()).toBe(true)
  })

  it('emits the new page on click', async () => {
    const wrapper = mountPagination()
    await wrapper.find('[aria-label="Next page"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([6])
  })

  it('does not navigate when clicking an ellipsis', async () => {
    const wrapper = mountPagination()
    const ellipsis = wrapper.findAll('button').filter((b) => b.text() === '...')[0]
    await ellipsis.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('renders two ellipses with unique keys without warnings', () => {
    // current page in the middle of a long range -> '...' on both sides
    const wrapper = mountPagination({ total: 500, modelValue: 25 })
    const ellipsis = wrapper.findAll('button').filter((b) => b.text() === '...')
    expect(ellipsis).toHaveLength(2)
  })
})
