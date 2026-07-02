import { type Size } from "../../../composables/useSizeProps";

export const DU_TABS_TYPES = ["lift", "border", "box"] as const;
export type DuTabsType = (typeof DU_TABS_TYPES)[number];

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