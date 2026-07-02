import { type Variant } from "../../../composables/useVariantProps";
import { type Size } from "../../../composables/useSizeProps";

export interface DuButtonLinkProps {
  size?: Size;
  variant?: Variant;
  outline?: boolean;
  soft?: boolean;
  dash?: boolean;
  active?: boolean;
  ghost?: boolean;
  link?: boolean;
  wide?: boolean;
  square?: boolean;
  circle?: boolean;
  block?: boolean;
} 