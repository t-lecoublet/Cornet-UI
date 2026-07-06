import { type Size } from "../../../composables/useSizeProps";


export const RATING_SIZES = ["rating-xs", "rating-sm", "rating-md", "rating-lg", "rating-xl"] as const;
export type DuRatingSize = (typeof RATING_SIZES)[number];
export interface DuRatingItemData {
  value: number;
  checked?: boolean;
}

export const DU_RATING_SHAPES = ["star", "star-2", "heart", "circle"] as const;
export type DuRatingShape = (typeof DU_RATING_SHAPES)[number];

export interface DuRatingProps {
  modelValue?: number;
  items?: DuRatingItemData[];
  count?: number;
  name?: string;
  halfStar?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  size?: Size;
  shape?: DuRatingShape;
  color?: string;
  customClass?: string;

}

export interface DuRatingItemProps {
  value?: number;
  checked?: boolean;
  disabled?: boolean;
  shape?: DuRatingShape;
  color?: string;
  halfMask?: 1 | 2;
  customClass?: string;
}

export interface DuRatingEmits {
  (e: "update:modelValue", value: number): void;
  (e: "change", value: number): void;
}

export interface DuRatingItemEmits {
  (e: "change", value: number): void;
} 