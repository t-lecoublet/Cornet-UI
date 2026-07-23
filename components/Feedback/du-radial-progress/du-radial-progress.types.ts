import { type Variant } from "../../../composables/useVariantProps";
import { type Size } from "../../../composables/useSizeProps";

// Tailwind-scan safelist: useVariantMapping(props, 'text') builds these
// literals at runtime; keep them here so they're always scanned.
export const RADIAL_PROGRESS_VARIANTS = ['default', 'text-primary', 'text-secondary', 'text-accent', 'text-neutral', 'text-info', 'text-success', 'text-warning', 'text-error'] as const;
export type DuRadialProgressVariant = (typeof RADIAL_PROGRESS_VARIANTS)[number];

export interface DuRadialProgressProps {
  value?: number;
  variant?: Variant;
  size?: Size | string;
  thickness?: string;
} 