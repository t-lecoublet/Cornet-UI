import { type Variant } from "../../../composables/useVariantProps";

export interface DuProgressProps {
  value?: number;
  max?: number;
  indeterminate?: boolean;
  variant?: Variant;
} 