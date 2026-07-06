import { type Variant } from "../../../composables/useVariantProps";

export const DU_STEPS_DIRECTIONS = ["steps-vertical", "steps-horizontal"] as const;
export type DuStepsDirection = (typeof DU_STEPS_DIRECTIONS)[number];

export interface DuStepsItem {
  label?: string;
  active?: boolean;
  customClass?: string;
  dataContent?: string;
}

export interface DuStepsProps {
  items?: DuStepsItem[];
  direction?: DuStepsDirection;
  customClass?: string;
  responsive?: boolean;
  activeSteps?: number[];
  variant?: Variant;
} 