import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DuChat from '../components/DataDisplay/du-chat/du-chat.vue'
import DuChatItem from '../components/DataDisplay/du-chat/du-chat-item.vue'
import type { DuChatItemData } from '../components/DataDisplay/du-chat/du-chat.types'

describe('DuChat (dynamic items mode)', () => {
  it('applies the correct chat-bubble-{variant} class, not a double-prefixed one', () => {
    const items: DuChatItemData[] = [{ message: 'Hi', variant: 'primary' }]
    const wrapper = mount(DuChat, { props: { items } })
    const bubble = wrapper.find('.chat-bubble')
    expect(bubble.classes()).toContain('chat-bubble-primary')
    expect(bubble.classes().some((c) => c.includes('chat-bubble-chat-bubble'))).toBe(false)
  })

  it('adds no color class for the default variant', () => {
    const items: DuChatItemData[] = [{ message: 'Hi' }]
    const wrapper = mount(DuChat, { props: { items } })
    const bubble = wrapper.find('.chat-bubble')
    expect(bubble.classes()).toEqual(['chat-bubble'])
  })

  it('places the bubble on start/end based on item.placement or the component default', () => {
    const items: DuChatItemData[] = [
      { message: 'A' },
      { message: 'B', placement: 'end' },
    ]
    const wrapper = mount(DuChat, { props: { items, placement: 'start' } })
    const chats = wrapper.findAll('.chat')
    expect(chats[0].classes()).toContain('chat-start')
    expect(chats[1].classes()).toContain('chat-end')
  })
})

describe('DuChatItem (manual mode)', () => {
  it('applies the correct chat-bubble-{variant} class via useVariantMapping', () => {
    const wrapper = mount(DuChatItem, { props: { message: 'Hi', variant: 'secondary' } })
    expect(wrapper.find('.chat-bubble').classes()).toContain('chat-bubble-secondary')
  })
})
