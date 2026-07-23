import { type Variant } from "../../../composables/useVariantProps";

// Tailwind-scan safelist: useVariantMapping(props, 'progress') builds these
// literals at runtime; keep them here so they're always scanned.
export const PROGRESS_VARIANTS = ['default', 'progress-primary', 'progress-secondary', 'progress-accent', 'progress-neutral', 'progress-info', 'progress-success', 'progress-warning', 'progress-error'] as const;
export type DuProgressVariant = (typeof PROGRESS_VARIANTS)[number];

export interface DuProgressProps {
  value?: number;
  max?: number;
  indeterminate?: boolean;
  variant?: Variant;
} 