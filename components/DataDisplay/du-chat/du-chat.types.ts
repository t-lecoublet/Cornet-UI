export const CHAT_COLORS = [
  'chat-bubble-primary',
  'chat-bubble-secondary',
  'chat-bubble-accent',
  'chat-bubble-neutral',
  'chat-bubble-info',
  'chat-bubble-success',
  'chat-bubble-warning',
  'chat-bubble-error',
] as const

export type DuChatColor = (typeof CHAT_COLORS)[number]

export const DU_CHAT_PLACEMENTS = ["start", "end"] as const;
export type DuChatPlacement = (typeof DU_CHAT_PLACEMENTS)[number];

export interface DuChatItemData {
  message?: string;
  image?: string;
  header?: string;
  footer?: string;
  placement?: DuChatPlacement;
  variant?: DuChatColor;
  customClass?: string;
}

export interface DuChatProps {
  items?: DuChatItemData[];
  placement?: DuChatPlacement;
  customClass?: string;
} 