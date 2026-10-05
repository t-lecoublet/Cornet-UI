// The pure DOM helpers the core primitives lean on. They hold no state, so
// they are exercised directly on plain elements — the primitives that use them
// are covered in core-combobox.spec.ts and core-popover.spec.ts.
import { describe, expect, it } from 'vitest'
import {
  focusableInDocument,
  hasEditableText,
  hugPreviousSibling,
  isTextField,
  revealInContainer,
} from '../components/core/shared/dom'

describe('hasEditableText', () => {
  it('counts the value of an input or a textarea', () => {
    const input = document.createElement('input')
    expect(hasEditableText(input)).toBe(false)
    input.value = 'x'
    expect(hasEditableText(input)).toBe(true)

    const textarea = document.createElement('textarea')
    textarea.value = 'y'
    expect(hasEditableText(textarea)).toBe(true)
  })

  it('counts the text content of a contenteditable', () => {
    const div = document.createElement('div')
    div.contentEditable = 'true'
    expect(hasEditableText(div)).toBe(false)
    div.textContent = 'hello'
    expect(hasEditableText(div)).toBe(true)
  })
})

describe('isTextField', () => {
  it('tells text entry apart from button-like inputs', () => {
    const text = document.createElement('input')
    expect(isTextField(text)).toBe(true)

    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    expect(isTextField(checkbox)).toBe(false)

    expect(isTextField(document.createElement('textarea'))).toBe(true)

    const editable = document.createElement('div')
    editable.contentEditable = 'true'
    expect(isTextField(editable)).toBe(true)

    expect(isTextField(null)).toBe(false)
  })
})

describe('focusableInDocument', () => {
  it('skips what Tab would skip: disabled and negative tabindex', () => {
    const host = document.createElement('div')
    const reachable = document.createElement('button')
    const off = document.createElement('button')
    off.disabled = true
    const skipped = document.createElement('div')
    skipped.tabIndex = -1
    host.append(reachable, off, skipped)
    document.body.appendChild(host)

    const found = focusableInDocument()
    expect(found).toContain(reachable)
    expect(found).not.toContain(off)
    expect(found).not.toContain(skipped)

    host.remove()
  })
})

describe('revealInContainer', () => {
  /** A container stub: client rects are what the helper measures, scrollTop what it writes. */
  function container(layoutWidth = 100) {
    return {
      scrollTop: 0,
      offsetWidth: layoutWidth,
      getBoundingClientRect: () => ({ top: 0, bottom: 100, width: 100 }),
    } as unknown as HTMLElement
  }

  const rowAt = (top: number, bottom: number) =>
    ({ getBoundingClientRect: () => ({ top, bottom }) }) as unknown as HTMLElement

  it('scrolls down to a row below the viewport', () => {
    const list = container()
    revealInContainer(rowAt(120, 140), list)
    expect(list.scrollTop).toBe(40)
  })

  it('scrolls up to a row above the viewport', () => {
    const list = container()
    list.scrollTop = 50
    revealInContainer(rowAt(-20, 0), list)
    expect(list.scrollTop).toBe(30)
  })

  it('divides out the CSS scale an opening animation applies', () => {
    // Rects come back at twice the layout width, so the correction halves.
    const scaled = container(50)
    revealInContainer(rowAt(120, 140), scaled)
    expect(scaled.scrollTop).toBe(20)
  })

  it('does nothing without a container', () => {
    expect(() => revealInContainer(rowAt(120, 140), null)).not.toThrow()
  })
})

describe('hugPreviousSibling', () => {
  function inParent(style: Partial<CSSStyleDeclaration>) {
    const parent = document.createElement('div')
    Object.assign(parent.style, style)
    const field = document.createElement('input')
    const message = document.createElement('p')
    parent.append(field, message)
    document.body.append(parent)
    return message
  }

  it('cancels the gap of a column flex', () => {
    const message = inParent({ display: 'flex', flexDirection: 'column', rowGap: '16px' })
    hugPreviousSibling(message)
    expect(message.style.marginTop).toBe('calc(0.25rem - 16px)')
  })

  it('cancels the row gap of a grid', () => {
    const message = inParent({ display: 'grid', rowGap: '12px' })
    hugPreviousSibling(message)
    expect(message.style.marginTop).toBe('calc(0.25rem - 12px)')
  })

  it('leaves a plain small margin where there is no gap to cancel', () => {
    const block = inParent({ display: 'block' })
    hugPreviousSibling(block)
    expect(block.style.marginTop).toBe('0.25rem')

    // A row flex puts the message beside the field: its gap is not between them vertically.
    const row = inParent({ display: 'flex', rowGap: '16px' })
    hugPreviousSibling(row)
    expect(row.style.marginTop).toBe('0.25rem')
  })

  it('ignores a missing or detached element', () => {
    expect(() => hugPreviousSibling(null)).not.toThrow()
    expect(() => hugPreviousSibling(document.createElement('p'))).not.toThrow()
  })
})
