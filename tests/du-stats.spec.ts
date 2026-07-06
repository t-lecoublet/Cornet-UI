import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import DuStats from '../components/DataDisplay/du-stats/du-stats.vue'
import type { DuStatsItem } from '../components/DataDisplay/du-stats/du-stats.types'

describe('DuStats', () => {
  it('renders a value of 0 (falsy but legitimate)', () => {
    const items: DuStatsItem[] = [{ title: 'Downloads', value: 0 }]
    const wrapper = mount(DuStats, { props: { items } })
    expect(wrapper.text()).toContain('0')
  })

  it('renders a non-zero value normally', () => {
    const items: DuStatsItem[] = [{ title: 'Downloads', value: 42 }]
    const wrapper = mount(DuStats, { props: { items } })
    expect(wrapper.text()).toContain('42')
  })

  it('does not render the value slot when value is undefined', () => {
    const items: DuStatsItem[] = [{ title: 'Downloads' }]
    const wrapper = mount(DuStats, { props: { items } })
    expect(wrapper.find('.stat-value').exists()).toBe(false)
  })

  it('renders a component figure without warning when figure is a real component', () => {
    const FigureComp = { render: () => h('span', { class: 'my-figure' }) }
    const items: DuStatsItem[] = [{ title: 'X', figure: FigureComp }]
    const wrapper = mount(DuStats, { props: { items } })
    expect(wrapper.find('.my-figure').exists()).toBe(true)
  })

  it('does not crash or render <null> when figure/actions is explicitly null', () => {
    const items: DuStatsItem[] = [{ title: 'X', figure: null, actions: null }]
    expect(() => mount(DuStats, { props: { items } })).not.toThrow()
  })
})
