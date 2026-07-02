import { ref, watch } from 'vue'
import type { DuDrawerEmit } from '../du-drawer.types'

interface DrawerOpenStateProps {
  open: boolean
  modelValue: boolean
}

/** Owns the drawer's open/closed state, kept in sync with either the `open` or `modelValue` prop (whichever the parent drives), and mirrors changes back out through both events. */
export function useDrawerOpenState(props: DrawerOpenStateProps, emit: DuDrawerEmit) {
  const internalOpen = ref(props.open || props.modelValue)

  watch(
    () => props.open,
    (newValue) => {
      internalOpen.value = newValue
    },
  )

  watch(
    () => props.modelValue,
    (newValue) => {
      internalOpen.value = newValue
    },
  )

  watch(internalOpen, (newValue) => {
    emit('update:modelValue', newValue)
    emit('update:open', newValue)
  })

  const toggleDrawer = () => {
    internalOpen.value = !internalOpen.value
  }

  return { internalOpen, toggleDrawer }
}
