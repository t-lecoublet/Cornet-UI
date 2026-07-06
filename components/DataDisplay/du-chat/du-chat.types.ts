import { type Variant } from "../../../composables/useVariantProps"

export const DU_CHAT_PLACEMENTS = ["start", "end"] as const;
export type DuChatPlacement = (typeof DU_CHAT_PLACEMENTS)[number];

export interface DuChatItemData {
  message?: string;
  image?: string;
  header?: string;
  footer?: string;
  placement?: DuChatPlacement;
  variant?: Variant;
  customClass?: string;
}

export interface DuChatProps {
  items?: DuChatItemData[];
  placement?: DuChatPlacement;
  customClass?: string;
} 