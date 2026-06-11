import { describe, expect, it } from 'vitest'
import { reactive } from 'vue'
import { useSizeMapping, type Size } from '../composables/useSizeProps'
import { useVariantMapping, type Variant } from '../composables/useVariantProps'

describe('useSizeMapping', () => {
  it('maps a size to the suffixed DaisyUI class', () => {
    const props = reactive({ size: 'sm' as Size })
    const { sizeClass } = useSizeMapping(props, 'btn')
    expect(sizeClass.value).toBe('btn-sm')
  })

  it('returns an empty string for the default size', () => {
    const props = reactive({ size: 'default' as Size })
    const { sizeClass } = useSizeMapping(props, 'btn')
    expect(sizeClass.value).toBe('')
  })

  it('is reactive to prop changes', () => {
    const props = reactive({ size: 'default' as Size })
    const { sizeClass } = useSizeMapping(props, 'input')
    props.size = 'xl'
    expect(sizeClass.value).toBe('input-xl')
  })
})

describe('useVariantMapping', () => {
  it('maps a variant to the suffixed DaisyUI class', () => {
    const props = reactive({ variant: 'primary' as Variant })
    const { colorClass } = useVariantMapping(props, 'btn')
    expect(colorClass.value).toBe('btn-primary')
  })

  it('returns an empty string for the default variant (no btn-default ghost class)', () => {
    const props = reactive({ variant: 'default' as Variant })
    const { colorClass } = useVariantMapping(props, 'btn')
    expect(colorClass.value).toBe('')
  })

  it('is reactive to prop changes', () => {
    const props = reactive({ variant: 'default' as Variant })
    const { colorClass } = useVariantMapping(props, 'alert')
    props.variant = 'error'
    expect(colorClass.value).toBe('alert-error')
  })
})
