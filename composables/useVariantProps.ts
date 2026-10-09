import { computed } from 'vue'

export type Variant = 'default' | 'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error'

/**
 * `mapVariant('primary', 'btn')` → `'btn-primary'`; `'default'` and `undefined`
 * → `''`. For a variant that is not a prop — one per item of a list — where
 * `useVariantMapping` cannot be called. Keep the `suffix` a string literal: the
 * class checks read it from the call.
 */
export function mapVariant(variant: Variant | undefined, suffix: string): string {
  return !variant || variant === 'default' ? '' : suffix + '-' + variant
}

export function useVariantMapping(props: { variant: Variant }, suffix: string) {
  const colorClass = computed(() => mapVariant(props.variant, suffix))

  return { colorClass }
}

export const useVariantStoriesControl = {
  variant: {
    control: { type: 'select' },
    options: ['default', 'primary', 'secondary', 'accent', 'neutral', 'info', 'success', 'warning', 'error'],
  },
}
