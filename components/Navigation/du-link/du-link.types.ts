import { type Variant } from "../../../composables/useVariantProps";

// Tailwind-scan safelist: useVariantMapping(props, 'link') builds these
// literals at runtime; keep them here so they're always scanned.
export const LINK_VARIANTS = ['default', 'link-primary', 'link-secondary', 'link-accent', 'link-neutral', 'link-info', 'link-success', 'link-warning', 'link-error'] as const;
export type DuLinkVariant = (typeof LINK_VARIANTS)[number];

export interface DuLinkProps {
  variant?: Variant;
  onlyUnderlineOnHover?: boolean;
  ghost?: boolean;
} 