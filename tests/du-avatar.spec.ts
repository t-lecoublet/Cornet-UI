import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DuAvatar from '../components/DataDisplay/du-avatar/du-avatar.vue'

const ringed = (props: Record<string, unknown> = {}) =>
  mount(DuAvatar, { props: { ring: true, ...props } }).find('.avatar > div')

describe('DuAvatar ring', () => {
  it('draws a 2px primary ring, offset by 2px, by default', () => {
    expect(ringed().classes()).toEqual(
      expect.arrayContaining(['ring-2', 'ring-primary', 'ring-offset-base-100', 'ring-offset-2']),
    )
  })

  it('colours the ring with ringVariant', () => {
    const classes = ringed({ ringVariant: 'success' }).classes()
    expect(classes).toContain('ring-success')
    expect(classes).not.toContain('ring-primary')
  })

  it('adds no ring colour class for ringVariant="default"', () => {
    const classes = ringed({ ringVariant: 'default' }).classes()
    expect(classes).toContain('ring-2')
    expect(classes).not.toContain('ring-default')
    expect(classes).not.toContain('ring-primary')
  })

  it('sets the offset with ringOffset, leaving the ring width alone', () => {
    const classes = ringed({ ringOffset: 4 }).classes()
    expect(classes).toContain('ring-offset-4')
    expect(classes).not.toContain('ring-offset-2')
    expect(classes).toContain('ring-2')
    expect(classes).not.toContain('ring-4')
  })

  it('accepts a zero offset', () => {
    const classes = ringed({ ringOffset: 0 }).classes()
    expect(classes).toContain('ring-offset-0')
    expect(classes).not.toContain('ring-offset-2')
  })

  it('draws no ring without the ring prop', () => {
    const inner = mount(DuAvatar).find('.avatar > div')
    expect(inner.classes().some((c) => c.startsWith('ring'))).toBe(false)
  })
})
