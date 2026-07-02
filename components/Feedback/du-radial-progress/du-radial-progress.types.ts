import { type Variant } from "../../../composables/useVariantProps";
import { type Size } from "../../../composables/useSizeProps";

export interface DuRadialProgressProps {
  value?: number;
  variant?: Variant;
  size?: Size | string;
  thickness?: string;
} 