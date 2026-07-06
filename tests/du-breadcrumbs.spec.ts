import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DuBreadcrumbs from '../components/Navigation/du-breadcrumbs/du-breadcrumbs.vue'
import type { DuBreadcrumbItem } from '../components/Navigation/du-breadcrumbs/du-breadcrumbs.types'

const items: DuBreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Current Page' },
]

describe('DuBreadcrumbs', () => {
  it('renders a nav landmark with a default aria-label', () => {
    const wrapper = mount(DuBreadcrumbs, { props: { items } })
    const nav = wrapper.find('nav')
    expect(nav.exists()).toBe(true)
    expect(nav.attributes('aria-label')).toBe('Breadcrumb')
  })

  it('accepts a custom aria-label', () => {
    const wrapper = mount(DuBreadcrumbs, { props: { items, ariaLabel: 'You are here' } })
    expect(wrapper.find('nav').attributes('aria-label')).toBe('You are here')
  })

  it('marks the last item as aria-current=page', () => {
    const wrapper = mount(DuBreadcrumbs, { props: { items } })
    const lis = wrapper.findAll('li')
    expect(lis[0].find('a').attributes('aria-current')).toBeUndefined()
    expect(lis[1].find('a').attributes('aria-current')).toBeUndefined()
    expect(lis[2].find('span').attributes('aria-current')).toBe('page')
  })

  it('marks the last item as current even when it has an href', () => {
    const wrapper = mount(DuBreadcrumbs, {
      props: { items: [{ label: 'Home', href: '/' }, { label: 'Here', href: '/here' }] },
    })
    const lis = wrapper.findAll('li')
    expect(lis[1].find('a').attributes('aria-current')).toBe('page')
  })
})
