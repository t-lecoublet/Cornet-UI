import { describe, expect, it } from 'vitest'
import { reactive } from 'vue'
import { usePaginationPages } from '../components/Navigation/du-pagination/composables/usePaginationPages'

describe('usePaginationPages', () => {
  it('computes totalPages from total/perPage', () => {
    const props = reactive({ modelValue: 1, total: 95, perPage: 10, maxPages: 0, showEllipsis: true })
    const { totalPages } = usePaginationPages(props)
    expect(totalPages.value).toBe(10)
  })

  it('shows no ellipsis when the page range is short', () => {
    const props = reactive({ modelValue: 1, total: 30, perPage: 10, maxPages: 0, showEllipsis: true })
    const { pages } = usePaginationPages(props)
    expect(pages.value).toEqual([1, 2, 3])
  })

  it('shows a trailing ellipsis near the start of a long range', () => {
    const props = reactive({ modelValue: 1, total: 500, perPage: 10, maxPages: 0, showEllipsis: true })
    const { pages } = usePaginationPages(props)
    expect(pages.value).toEqual([1, 2, '...', 50])
  })

  it('shows both ellipses when in the middle of a long range', () => {
    const props = reactive({ modelValue: 25, total: 500, perPage: 10, maxPages: 0, showEllipsis: true })
    const { pages } = usePaginationPages(props)
    expect(pages.value).toEqual([1, '...', 24, 25, 26, '...', 50])
  })

  it('shows a leading ellipsis near the end of a long range', () => {
    const props = reactive({ modelValue: 50, total: 500, perPage: 10, maxPages: 0, showEllipsis: true })
    const { pages } = usePaginationPages(props)
    expect(pages.value).toEqual([1, '...', 49, 50])
  })

  it('omits ellipses entirely when showEllipsis is false', () => {
    const props = reactive({ modelValue: 25, total: 500, perPage: 10, maxPages: 0, showEllipsis: false })
    const { pages } = usePaginationPages(props)
    expect(pages.value).not.toContain('...')
  })

  it('windows to exactly maxPages entries around the current page when set', () => {
    const props = reactive({ modelValue: 10, total: 500, perPage: 10, maxPages: 5, showEllipsis: true })
    const { pages } = usePaginationPages(props)
    expect(pages.value).toEqual([8, 9, 10, 11, 12])
  })

  it('clamps the maxPages window at the start of the range', () => {
    const props = reactive({ modelValue: 1, total: 500, perPage: 10, maxPages: 5, showEllipsis: true })
    const { pages } = usePaginationPages(props)
    expect(pages.value).toEqual([1, 2, 3, 4, 5])
  })

  it('clamps the maxPages window at the end of the range', () => {
    const props = reactive({ modelValue: 50, total: 500, perPage: 10, maxPages: 5, showEllipsis: true })
    const { pages } = usePaginationPages(props)
    expect(pages.value).toEqual([46, 47, 48, 49, 50])
  })
})
