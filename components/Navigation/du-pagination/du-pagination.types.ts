import { type Size } from "../../../composables/useSizeProps";
import { type Variant } from "../../../composables/useVariantProps";

// Tailwind-scan safelist: du-pagination.vue renders its own <button class="btn">
// elements and builds their classes via useSizeMapping/useVariantMapping(*, 'btn')
// without importing DuButton, so these literals must live here too.
export const PAGINATION_BUTTON_SIZES = ["default", "btn-xs", "btn-sm", "btn-md", "btn-lg", "btn-xl"] as const;
export const PAGINATION_BUTTON_VARIANTS = ["default", "btn-primary", "btn-secondary", "btn-accent", "btn-neutral", "btn-info", "btn-success", "btn-warning", "btn-error"] as const;
export type DuPaginationButtonSize = (typeof PAGINATION_BUTTON_SIZES)[number];
export type DuPaginationButtonVariant = (typeof PAGINATION_BUTTON_VARIANTS)[number];

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