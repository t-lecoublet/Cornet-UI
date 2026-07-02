import { computed } from 'vue'
import type { DuFabModifier } from '../du-fab.types'

interface FabClassesProps {
  modifier?: DuFabModifier
  absolute?: boolean
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  customClass?: string
}

/** Derives the fab container's modifier/position/root class lists from its layout props. */
export function useFabClasses(props: FabClassesProps) {
  const modifierClass = computed(() => {
    return props.modifier ? props.modifier : ''
  })

  const positionClass = computed(() => {
    if (!props.absolute) return ''

    switch (props.position) {
      case 'bottom-right':
        return 'absolute bottom-4 right-4'
      case 'bottom-left':
        return 'absolute bottom-4 left-4'
      case 'top-right':
        return 'absolute top-4 right-4'
      case 'top-left':
        return 'absolute top-4 left-4'
      default:
        return 'absolute bottom-4 right-4'
    }
  })

  const fabClasses = computed(() => {
    return [
      'fab',
      modifierClass.value,
      positionClass.value,
      'z-50',
      props.customClass,
    ]
  })

  return { fabClasses }
}
