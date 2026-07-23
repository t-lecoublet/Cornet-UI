import { type Size } from "../../../composables/useSizeProps";

export const DU_TABS_TYPES = ["lift", "border", "box"] as const;
export type DuTabsType = (typeof DU_TABS_TYPES)[number];

// Tailwind-scan safelist: useSizeMapping(props, 'tabs') builds these literals
// at runtime; keep them here so they're always scanned.
export const TABS_SIZES = ["default", "tabs-xs", "tabs-sm", "tabs-md", "tabs-lg", "tabs-xl"] as const;
export type DuTabsSize = (typeof TABS_SIZES)[number];

export interface DuTabItem {
  label?: string;
  icon?: any;
  class?: string;
  active?: boolean;
  onClick?: () => void;
  content?: string;
  [key: string]: any;
}

export interface DuTabsProps {
  size?: Size;
  items?: DuTabItem[];
  type?: DuTabsType;
  bottom?: boolean;
  name?: string;
  modelValue?: number;
  /** Accessible name of the tab group. */
  ariaLabel?: string;
} 