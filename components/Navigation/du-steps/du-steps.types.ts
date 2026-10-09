import { type Variant } from "../../../composables/useVariantProps";

export const DU_STEPS_DIRECTIONS = ["steps-vertical", "steps-horizontal"] as const;
export type DuStepsDirection = (typeof DU_STEPS_DIRECTIONS)[number];

// Literals for Tailwind: `useVariantMapping(props, "step")` builds these at runtime.
export const DU_STEPS_VARIANTS = ["default", "step-primary", "step-secondary", "step-accent", "step-neutral", "step-info", "step-success", "step-warning", "step-error"] as const;

export interface DuStepsItem {
  label?: string;
  active?: boolean;
  customClass?: string;
  dataContent?: string;
}

export interface DuStepsProps {
  items?: DuStepsItem[];
  /** Accessible name of the sequence. */
  ariaLabel?: string;
  direction?: DuStepsDirection;
  customClass?: string;
  responsive?: boolean;
  activeSteps?: number[];
  variant?: Variant;
} 