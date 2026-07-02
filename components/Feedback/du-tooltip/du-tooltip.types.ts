import { type Variant } from "../../../composables/useVariantProps";

export const DU_TOOLTIP_POSITIONS = ["top", "right", "bottom", "left"] as const;
export type DuTooltipPosition = (typeof DU_TOOLTIP_POSITIONS)[number];

export interface DuTooltipProps {
  variant?: Variant;
  dataTip?: string;
  open?: boolean;
  position?: DuTooltipPosition;
  responsive?: boolean;
} 