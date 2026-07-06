import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DuTimeline from '../components/DataDisplay/du-timeline/du-timeline.vue'
import DuTimelineItem from '../components/DataDisplay/du-timeline/du-timeline-item.vue'
import type { DuTimelineItemData } from '../components/DataDisplay/du-timeline/du-timeline.types'

const items: DuTimelineItemData[] = [
  { start: 'A', end: 'B' },
  { start: 'C', end: 'D' },
]

describe('DuTimeline', () => {
  it('does not apply timeline-box by default', () => {
    const wrapper = mount(DuTimeline, { props: { items } })
    expect(wrapper.find('.timeline-start').classes()).not.toContain('timeline-box')
    expect(wrapper.find('.timeline-end').classes()).not.toContain('timeline-box')
  })

  it('applies timeline-box to every start/end box when boxed is true', () => {
    const wrapper = mount(DuTimeline, { props: { items, boxed: true } })
    const starts = wrapper.findAll('.timeline-start')
    const ends = wrapper.findAll('.timeline-end')
    expect(starts.every((s) => s.classes().includes('timeline-box'))).toBe(true)
    expect(ends.every((e) => e.classes().includes('timeline-box'))).toBe(true)
  })

  it('lets a per-item boxed override the component default', () => {
    const mixed: DuTimelineItemData[] = [
      { start: 'A', end: 'B', boxed: true },
      { start: 'C', end: 'D', boxed: false },
    ]
    const wrapper = mount(DuTimeline, { props: { items: mixed, boxed: false } })
    const ends = wrapper.findAll('.timeline-end')
    expect(ends[0].classes()).toContain('timeline-box')
    expect(ends[1].classes()).not.toContain('timeline-box')
  })

  it('only accepts root-level layout modifiers (timeline-box is not one of them)', () => {
    const wrapper = mount(DuTimeline, { props: { items, modifier: 'timeline-compact' } })
    expect(wrapper.find('ul').classes()).toContain('timeline-compact')
  })

  it('colors the connecting line success/error based on item.valid', () => {
    // Each connecting line is rendered twice (once as the trailing <hr> of
    // the item before it, once as the leading <hr> of the item after it),
    // both driven by the same getLineClass(index) value.
    const validItems: DuTimelineItemData[] = [
      { start: 'A', end: 'B', valid: true },
      { start: 'C', end: 'D', valid: false },
      { start: 'E', end: 'F' },
    ]
    const wrapper = mount(DuTimeline, { props: { items: validItems } })
    const hrs = wrapper.findAll('hr')
    expect(hrs).toHaveLength(4)
    expect(hrs[0].classes()).toContain('bg-success')
    expect(hrs[1].classes()).toContain('bg-success')
    expect(hrs[2].classes()).toContain('bg-error')
    expect(hrs[3].classes()).toContain('bg-error')
  })
})

describe('DuTimelineItem (manual mode)', () => {
  it('does not apply timeline-box by default', () => {
    const wrapper = mount(DuTimelineItem, { props: { start: 'A', end: 'B' } })
    expect(wrapper.find('.timeline-start').classes()).not.toContain('timeline-box')
    expect(wrapper.find('.timeline-end').classes()).not.toContain('timeline-box')
  })

  it('applies timeline-box to both boxes when boxed is true', () => {
    const wrapper = mount(DuTimelineItem, { props: { start: 'A', end: 'B', boxed: true } })
    expect(wrapper.find('.timeline-start').classes()).toContain('timeline-box')
    expect(wrapper.find('.timeline-end').classes()).toContain('timeline-box')
  })

  it('uses the same success/error color convention as DuTimeline for valid (middle icon)', () => {
    const valid = mount(DuTimelineItem, { props: { start: 'A', end: 'B', valid: true } })
    expect(valid.find('svg').classes()).toContain('text-success')

    const invalid = mount(DuTimelineItem, { props: { start: 'A', end: 'B', valid: false } })
    expect(invalid.find('svg').classes()).toContain('text-error')
  })
})
