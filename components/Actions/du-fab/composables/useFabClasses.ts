import { computed } from 'vue'
import type { DuFabModifier } from '../du-fab.types'

interface FabClassesProps {
  modifier?: DuFabModifier
  absolute?: boolean
  customClass?: string
}

/** Derives the fab container's modifier/position/root class lists from its layout props. */
export function useFabClasses(props: FabClassesProps) {
  const modifierClass = computed(() => {
    return props.modifier ? props.modifier : ''
  })

  // FABs only ever sit in the bottom-right corner (standard FAB placement).
  const positionClass = computed(() => {
    return props.absolute ? 'absolute bottom-4 right-4' : ''
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
