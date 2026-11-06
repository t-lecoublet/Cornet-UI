// The data-display components that carry structure a screen reader has to make
// sense of: a carousel's slides, a comparison's two states. (DuTable has its
// own spec, `du-table.spec.ts`.)
//
// None of them was wrong about its *markup* — they were silent about what the
// markup meant, which is a different failure and an easier one to overlook.
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DuCarousel from '../components/DataDisplay/du-carousel/du-carousel.vue'
import DuDiff from '../components/DataDisplay/du-diff/du-diff.vue'

const slides = [
  { src: '/a.png', alt: 'A' },
  { src: '/b.png', alt: 'B' },
  { src: '/c.png', alt: 'C' },
]

function carousel(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  const wrapper = mount(DuCarousel, { props: { items: slides, ariaLabel: 'Photos', ...props }, slots })
  return {
    wrapper,
    strip: () => wrapper.find('.carousel'),
    items: () => wrapper.findAll('.carousel-item'),
    buttons: () => wrapper.findAll('button'),
  }
}

describe('DuCarousel', () => {
  it('announces itself as a carousel, by name', () => {
    const c = carousel()
    expect(c.strip().attributes('role')).toBe('region')
    expect(c.strip().attributes('aria-roledescription')).toBe('carousel')
    expect(c.strip().attributes('aria-label')).toBe('Photos')
  })

  it('is focusable, because a scrollable region that is not cannot be scrolled by keyboard', () => {
    expect(carousel().strip().attributes('tabindex')).toBe('0')
  })

  it('announces each slide, and where it sits in the set', () => {
    const c = carousel()
    expect(c.items().map((w) => w.attributes('aria-roledescription'))).toEqual(['slide', 'slide', 'slide'])
    expect(c.items().map((w) => w.attributes('aria-label'))).toEqual(['1 of 3', '2 of 3', '3 of 3'])
  })

  it('lets the caller write those, for another language', () => {
    const c = carousel({ slideLabel: (i: number, n: number) => `${i} sur ${n}` })
    expect(c.items()[0]!.attributes('aria-label')).toBe('1 sur 3')
  })

  it('prefers a per-slide label', () => {
    const c = carousel({ items: [{ src: '/a.png', ariaLabel: 'The kitchen' }] })
    expect(c.items()[0]!.attributes('aria-label')).toBe('The kitchen')
  })

  it('leaves a decorative image without a made-up alt', () => {
    // `alt="Slide 2"` describes the position, not the picture; an empty alt at
    // least tells a screen reader to skip it rather than read a lie.
    const c = carousel({ items: [{ src: '/a.png' }] })
    expect(c.wrapper.find('img').attributes('alt')).toBe('')
  })

  it('offers no controls unless asked', () => {
    expect(carousel().buttons()).toHaveLength(0)
  })

  it('gives the controls names, since they are arrows', () => {
    const c = carousel({ controls: true, previousLabel: 'Précédent', nextLabel: 'Suivant' })
    expect(c.buttons().map((b) => b.attributes('aria-label'))).toEqual(['Précédent', 'Suivant'])
  })

  it('scrolls the strip by one slide, measured rather than assumed', async () => {
    // Nothing has a layout in the test DOM, so the slide's width is stubbed:
    // what is being checked is that the step comes from the slide and carries
    // the direction, not that happy-dom can do layout.
    const c = carousel({ controls: true })
    const strip = c.strip().element as HTMLElement
    Object.defineProperty(c.items()[0]!.element, 'offsetWidth', { value: 320 })
    const scrolled: { left: number }[] = []
    strip.scrollBy = (options: unknown) => { scrolled.push(options as { left: number }) }

    await c.buttons()[1]!.trigger('click')
    await c.buttons()[0]!.trigger('click')

    expect(scrolled.map((s) => s.left)).toEqual([320, -320])
  })

  it('scrolls the other axis when vertical', async () => {
    const c = carousel({ controls: true, vertical: true })
    const strip = c.strip().element as HTMLElement
    let received: Record<string, number> = {}
    strip.scrollBy = (options: unknown) => { received = options as Record<string, number> }

    await c.buttons()[1]!.trigger('click')

    expect(received).toHaveProperty('top')
    expect(received).not.toHaveProperty('left')
  })

  it('renders the default slot when there are no items', () => {
    const c = carousel({ items: undefined }, { default: '<div class="manual">Manual</div>' })
    expect(c.wrapper.find('.manual').exists()).toBe(true)
  })
})

describe('DuDiff', () => {
  it('is a named group', () => {
    const wrapper = mount(DuDiff, { props: { ariaLabel: 'Before and after' } })
    const figure = wrapper.find('figure')
    expect(figure.attributes('role')).toBe('group')
    expect(figure.attributes('aria-label')).toBe('Before and after')
  })

  it('makes both of daisyUI’s focus stops reachable', () => {
    // The comparison is driven by `:focus-visible` on the figure and on
    // `.diff-item-1`. Neither could take focus before, so the mechanism
    // existed in the stylesheet and nowhere else.
    const wrapper = mount(DuDiff)
    expect(wrapper.find('figure').attributes('tabindex')).toBe('0')
    expect(wrapper.find('.diff-item-1').attributes('tabindex')).toBe('0')
  })

  it('names the second stop by what focusing it does', () => {
    const wrapper = mount(DuDiff, { props: { revealLabel: 'Show the after' } })
    expect(wrapper.find('.diff-item-1').attributes('aria-label')).toBe('Show the after')
  })

  it('does not claim to be a button it cannot honour', () => {
    // Focus reveals; there is nothing to activate. `role="button"` would
    // promise an Enter key that does nothing.
    expect(mount(DuDiff).find('.diff-item-1').attributes('role')).toBeUndefined()
  })

  it('hides the resizer, which is a visual handle and nothing else', () => {
    expect(mount(DuDiff).find('.diff-resizer').attributes('aria-hidden')).toBe('true')
  })

  it('takes alternative text for the two images', () => {
    const wrapper = mount(DuDiff, {
      props: { item1: '/a.png', item2: '/b.png', item1Alt: 'Kitchen before', item2Alt: 'Kitchen after' },
    })
    expect(wrapper.findAll('img').map((i) => i.attributes('alt'))).toEqual(['Kitchen before', 'Kitchen after'])
  })
})
