// DuToast: the corner of the screen, the two live regions inside it, and the
// queue behind them.
//
// The old component was the corner alone — positioning classes and a slot, no
// `aria-live` at all, so a message announced itself to nobody. It also had no
// notion of a queue or a duration; every app rebuilt those.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import DuToast from '../components/Feedback/du-toast/du-toast.vue'
import { useToasts } from '../composables/useToasts'

const { toasts, push, dismiss, clear, pause, resume } = useToasts()

const mounted: { unmount: () => void }[] = []

beforeEach(() => clear())

afterEach(() => {
  clear()
  mounted.splice(0).forEach((wrapper) => wrapper.unmount())
  document.body.innerHTML = ''
  vi.useRealTimers()
})

function toaster(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  const wrapper = mount(DuToast, { attachTo: document.body, props, slots })
  mounted.push(wrapper)
  return {
    wrapper,
    region: (live: 'polite' | 'assertive') => wrapper.find(`[aria-live="${live}"]`),
    items: () => wrapper.findAll('.du-toast-item'),
    dismissButtons: () => wrapper.findAll('button'),
    /** The listeners live on the container itself, not on template bindings. */
    hover: (type: 'mouseenter' | 'mouseleave') =>
      wrapper.find('.toast').element.dispatchEvent(new MouseEvent(type)),
    focusIn: () => wrapper.find('.toast').element
      .dispatchEvent(new FocusEvent('focusin', { bubbles: true })),
  }
}

describe('the queue', () => {
  it('starts empty and takes what it is given', () => {
    expect(toasts.value).toHaveLength(0)

    push({ message: 'Saved' })

    expect(toasts.value).toHaveLength(1)
    expect(toasts.value[0]!.message).toBe('Saved')
  })

  it('hands back an id that dismisses that one toast', () => {
    const first = push({ message: 'One' })
    push({ message: 'Two' })

    dismiss(first)

    expect(toasts.value.map((t) => t.message)).toEqual(['Two'])
  })

  it('gives every toast its own id', () => {
    expect(push({ message: 'a' })).not.toBe(push({ message: 'b' }))
  })

  it('announces an error assertively, and everything else politely', () => {
    push({ message: 'Saved', variant: 'success' })
    push({ message: 'Could not save', variant: 'error' })

    expect(toasts.value[0]!.politeness).toBe('polite')
    expect(toasts.value[1]!.politeness, 'an error may interrupt').toBe('assertive')
  })

  it('lets the caller overrule the politeness', () => {
    push({ message: 'Could not save', variant: 'error', politeness: 'polite' })
    expect(toasts.value[0]!.politeness).toBe('polite')
  })
})

describe('durations', () => {
  it('clears itself after the default five seconds', () => {
    vi.useFakeTimers()
    push({ message: 'Saved' })

    vi.advanceTimersByTime(4999)
    expect(toasts.value).toHaveLength(1)

    vi.advanceTimersByTime(1)
    expect(toasts.value).toHaveLength(0)
  })

  it('stays for as long as it is told', () => {
    vi.useFakeTimers()
    push({ message: 'Saved', duration: 100 })

    vi.advanceTimersByTime(100)
    expect(toasts.value).toHaveLength(0)
  })

  it('stays forever on duration 0', () => {
    vi.useFakeTimers()
    push({ message: 'Could not save', duration: 0 })

    vi.advanceTimersByTime(60_000)
    expect(toasts.value).toHaveLength(1)
  })

  it('holds the clock while paused, and picks up where it stopped', () => {
    // WCAG 2.2.1: a time limit has to be pausable. A toast that vanishes while
    // it is being read is the everyday version of that failure.
    vi.useFakeTimers()
    push({ message: 'Saved', duration: 1000 })

    vi.advanceTimersByTime(400)
    pause()
    vi.advanceTimersByTime(10_000)
    expect(toasts.value, 'the clock is held').toHaveLength(1)

    resume()
    vi.advanceTimersByTime(599)
    expect(toasts.value, '600ms were left, not 1000').toHaveLength(1)
    vi.advanceTimersByTime(1)
    expect(toasts.value).toHaveLength(0)
  })

  it('drops the countdown with the toast', () => {
    vi.useFakeTimers()
    const id = push({ message: 'Saved', duration: 1000 })
    dismiss(id)

    expect(() => vi.advanceTimersByTime(2000)).not.toThrow()
    expect(toasts.value).toHaveLength(0)
  })
})

describe('the live regions', () => {
  it('renders both of them before there is anything to say', () => {
    // A live region only announces what arrives after it exists. One created
    // together with its first message is usually missed.
    const t = toaster()
    expect(t.region('polite').exists()).toBe(true)
    expect(t.region('assertive').exists()).toBe(true)
  })

  it('gives them the matching roles', () => {
    const t = toaster()
    expect(t.region('polite').attributes('role')).toBe('status')
    expect(t.region('assertive').attributes('role')).toBe('alert')
  })

  it('files each toast under the right one', async () => {
    const t = toaster()
    push({ message: 'Saved', variant: 'success' })
    push({ message: 'Could not save', variant: 'error' })
    await nextTick()

    expect(t.region('polite').text()).toContain('Saved')
    expect(t.region('polite').text()).not.toContain('Could not save')
    expect(t.region('assertive').text()).toContain('Could not save')
  })

  it('does not let the regions disturb the layout', () => {
    // `display: contents`: they group the toasts for assistive tech without
    // becoming a flex item between the container and them.
    const t = toaster()
    expect(t.region('polite').classes()).toContain('contents')
  })
})

describe('rendering', () => {
  it('shows the title and the message', async () => {
    toaster()
    push({ title: 'Saved', message: 'Your changes are safe' })
    await nextTick()

    expect(document.body.textContent).toContain('Saved')
    expect(document.body.textContent).toContain('Your changes are safe')
  })

  it('gives each toast a named close button', async () => {
    const t = toaster({ dismissLabel: 'Close notification' })
    push({ message: 'Saved' })
    await nextTick()

    const button = t.dismissButtons()[0]!
    expect(button.attributes('aria-label')).toBe('Close notification')

    await button.trigger('click')
    expect(toasts.value).toHaveLength(0)
  })

  it('colours the toast from its variant', async () => {
    const t = toaster()
    push({ message: 'Could not save', variant: 'error' })
    await nextTick()

    expect(t.items()[0]!.find('.alert').classes()).toContain('alert-error')
  })

  it('lets the consumer render a toast their own way', async () => {
    const t = toaster({}, { toast: '<template #toast="{ toast }"><span class="mine">{{ toast.message }}</span></template>' })
    push({ message: 'Saved' })
    await nextTick()

    expect(t.wrapper.find('.mine').text()).toBe('Saved')
  })

  it('still supports writing the toasts by hand', () => {
    // The queue is additive: the old slot-only usage keeps working.
    const t = toaster({}, { default: '<div class="manual">Handwritten</div>' })
    expect(t.wrapper.find('.manual').exists()).toBe(true)
  })

  it('keeps the daisyUI position classes', () => {
    const t = toaster({ horizontalPosition: 'end', verticalPosition: 'top' })
    const container = t.wrapper.find('.toast')
    expect(container.classes()).toEqual(expect.arrayContaining(['toast-end', 'toast-top']))
  })

  it('bounds the leave/enter transitions with an explicit duration', () => {
    // A dropped `transitionend` (throttled tab, headless compositor) would leave
    // items stuck in leave-active forever — the JS timeout is the safety net.
    const t = toaster()
    push({ message: 'Saved' })
    const group = t.wrapper.findComponent({ name: 'TransitionGroup' })
    expect(group.props('duration')).toBe(220)
  })
})

describe('pausing from the page', () => {
  it('stops the clock while the pointer is on the container', async () => {
    vi.useFakeTimers()
    const t = toaster()
    push({ message: 'Saved', duration: 1000 })
    await nextTick()

    t.hover('mouseenter')
    vi.advanceTimersByTime(5000)
    expect(toasts.value, 'held while hovered').toHaveLength(1)

    t.hover('mouseleave')
    vi.advanceTimersByTime(1000)
    expect(toasts.value).toHaveLength(0)
  })

  it('stops it while focus is inside, for the keyboard user reaching the close button', async () => {
    vi.useFakeTimers()
    const t = toaster()
    push({ message: 'Saved', duration: 1000 })
    await nextTick()

    t.focusIn()
    vi.advanceTimersByTime(5000)
    expect(toasts.value).toHaveLength(1)
  })
})
