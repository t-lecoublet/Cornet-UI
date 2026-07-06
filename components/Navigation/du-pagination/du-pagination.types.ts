import { type Size } from "../../../composables/useSizeProps";
import { type Variant } from "../../../composables/useVariantProps";

export interface DuPaginationProps {
  modelValue?: number;
  total: number;
  perPage?: number;
  showNext?: boolean;
  showPrevious?: boolean;
  showFirst?: boolean;
  showLast?: boolean;
  size?: Size;
  nextLabel?: string;
  previousLabel?: string;
  firstLabel?: string;
  lastLabel?: string;
  variant?: Variant;
  outline?: boolean;
  manual?: boolean;
  showEllipsis?: boolean;
  maxPages?: number;
  soft?: boolean;
  /** Accessible name of the navigation landmark. */
  ariaLabel?: string;
  /** Accessible labels for the symbol-only buttons. */
  previousAriaLabel?: string;
  nextAriaLabel?: string;
  firstAriaLabel?: string;
  lastAriaLabel?: string;
} 