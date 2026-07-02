import { type Variant } from "../../../composables/useVariantProps";

export interface DuStepItemProps {
  label?: string;
  active?: boolean;
  customClass?: string;
  dataContent?: string;
  variant?: Variant;
} 