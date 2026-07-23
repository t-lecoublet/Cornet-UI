import { type Variant } from "../../../composables/useVariantProps";

export const DU_TOOLTIP_POSITIONS = ["top", "right", "bottom", "left"] as const;
export type DuTooltipPosition = (typeof DU_TOOLTIP_POSITIONS)[number];

// Tailwind-scan safelist: useVariantMapping(props, 'tooltip') builds these
// literals at runtime; keep them here so they're always scanned.
export const TOOLTIP_VARIANTS = ['default', 'tooltip-primary', 'tooltip-secondary', 'tooltip-accent', 'tooltip-neutral', 'tooltip-info', 'tooltip-success', 'tooltip-warning', 'tooltip-error'] as const;
export type DuTooltipVariant = (typeof TOOLTIP_VARIANTS)[number];

export interface DuTooltipProps {
  variant?: Variant;
  dataTip?: string;
  open?: boolean;
  position?: DuTooltipPosition;
  responsive?: boolean;
} 