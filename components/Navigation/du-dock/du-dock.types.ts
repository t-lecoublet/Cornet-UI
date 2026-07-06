import { type Size } from "../../../composables/useSizeProps";

export const DOCK_SIZES = ['dock-xs', 'dock-sm', 'dock-md', 'dock-lg', 'dock-xl'] as const

export type DuDockSize = (typeof DOCK_SIZES)[number]
export interface DuDockItem {
  label?: string;
  icon?: any;
  class?: string;
  active?: boolean;
  onClick?: () => void;
  [key: string]: any;
}

export interface DuDockProps {
  size?: Size;
  items?: DuDockItem[];
  reverseTheme?: boolean;
} 