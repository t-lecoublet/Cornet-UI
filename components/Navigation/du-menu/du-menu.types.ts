import type { Component } from "vue";
import { type Size } from "../../../composables/useSizeProps";

export const DU_MENU_DIRECTIONS = ["default", "vertical", "horizontal", "responsive"] as const;
export type DuMenuDirection = (typeof DU_MENU_DIRECTIONS)[number];

export const MENU_SIZES = ['menu-xs', 'menu-sm', 'menu-md', 'menu-lg', 'menu-xl'] as const
export type DuMenuSize = (typeof MENU_SIZES)[number]

export interface DuMenuItemData {
  label: string;
  href?: string;
  as?: string | Component;
  disabled?: boolean;
  isTitle?: boolean;
  subItems?: DuMenuItemData[];
  value?: string | number;
  onClick?: () => void;
  checked?: boolean;
  multiple?: boolean;
  active?: boolean;
  icon?: Component | string | object | unknown;
}

export interface DuMenuProps {
  direction?: DuMenuDirection;
  size?: Size;
  rounded?: boolean;
  items?: DuMenuItemData[];
  activeItem?: string;
  onItemClick?: (item: DuMenuItemData) => void;
  onSubItemClick?: (item: DuMenuItemData) => void;
}

export interface DuMenuItemProps {
  item: DuMenuItemData;
  index: number;
  parentIndex?: string;
  onItemClick?: (item: DuMenuItemData) => void;
  onSubItemClick?: (item: DuMenuItemData) => void;
}