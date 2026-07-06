import { type Variant } from "../../../composables/useVariantProps";
import { type Size } from "../../../composables/useSizeProps";

export interface DuFilterButtonArgs {
  variant?: Variant;
  size?: Size;
  outline?: boolean;
  soft?: boolean;
  dash?: boolean;
  active?: boolean;
  ghost?: boolean;
  link?: boolean;
  wide?: boolean;
  disabled?: boolean;
  square?: boolean;
  circle?: boolean;
}

export interface DuFilterItem {
  title?: string;
  checked?: boolean;
  customClass?: string;
  buttonsArgs?: DuFilterButtonArgs;
}

export interface DuFilterProps {
  items?: DuFilterItem[];
  name?: string;
  buttonsArgs?: DuFilterButtonArgs;
} 