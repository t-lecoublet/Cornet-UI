import { type Variant } from "../../../composables/useVariantProps";

// Literals for Tailwind: `useVariantMapping(props, "step")` builds these at runtime.
export const DU_STEP_ITEM_VARIANTS = ["default", "step-primary", "step-secondary", "step-accent", "step-neutral", "step-info", "step-success", "step-warning", "step-error"] as const;

export interface DuStepItemProps {
  label?: string;
  active?: boolean;
  customClass?: string;
  dataContent?: string;
  variant?: Variant;
} 