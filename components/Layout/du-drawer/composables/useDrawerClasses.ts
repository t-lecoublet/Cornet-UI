import { computed } from 'vue'

interface DrawerClassesProps {
  id?: string
  position?: 'start' | 'end'
  responsive?: boolean | 'xl' | 'lg' | 'md' | 'sm'
  alwaysOpenOnLarge?: boolean
  iconOnly?: boolean
  sidebarClass?: string
  sidebarWrapperClass?: string
  contentClass?: string
  overlayClass?: string
}

/** Derives every DaisyUI class list the drawer needs from its layout/responsive props. */
export function useDrawerClasses(props: DrawerClassesProps) {
  const drawerId = computed(() => {
    return props.id || `drawer-${Math.random().toString(36).substring(2, 11)}`
  })

  const drawerClasses = computed(() => {
    const classes = ['drawer']

    if (props.position === 'end') {
      classes.push('drawer-end')
    }

    if (props.alwaysOpenOnLarge && !props.responsive) {
      classes.push('lg:drawer-open')
    }

    switch (props.responsive) {
      case 'xl':
        classes.push('xl:drawer-open')
        break
      case 'lg':
      case true:
        classes.push('lg:drawer-open')
        break
      case 'md':
        classes.push('md:drawer-open')
        break
      case 'sm':
        classes.push('sm:drawer-open')
        break
    }

    return classes
  })

  const drawerSideClasses = computed(() => {
    const classes = ['drawer-side']

    if (props.alwaysOpenOnLarge && !props.responsive) {
      classes.push('max-lg:z-[1002]')
    }

    switch (props.responsive) {
      case 'xl':
        classes.push('xl:max-lg:z-[1002]')
        break
      case 'lg':
      case true:
        classes.push('lg:max-md:z-[1002]')
        break
      case 'md':
        classes.push('md:max-sm:z-[1002]')
        break
      case 'sm':
        classes.push('sm:max-xs:z-[1002]')
        break
    }

    if (props.iconOnly) {
      classes.push('is-drawer-close:overflow-visible')
    }

    if (props.sidebarClass) {
      classes.push(props.sidebarClass)
    }

    return classes
  })

  const sidebarWrapperClasses = computed(() => {
    const classes = ['text-base-content', 'h-full', 'min-h-full']

    if (props.iconOnly) {
      classes.push('flex', 'flex-col', 'items-start', 'bg-base-200')
      classes.push('is-drawer-close:w-14', 'is-drawer-open:w-64')
      classes.push('transition-all', 'duration-200')
    }

    if (props.sidebarWrapperClass) {
      classes.push(props.sidebarWrapperClass)
    }

    return classes
  })

  const drawerContentClasses = computed(() => {
    const classes = ['drawer-content']

    if (props.contentClass) {
      classes.push(props.contentClass)
    }

    return classes
  })

  const drawerOverlayClasses = computed(() => {
    const classes = ['drawer-overlay']

    if (props.overlayClass) {
      classes.push(props.overlayClass)
    }

    return classes
  })

  return {
    drawerId,
    drawerClasses,
    drawerSideClasses,
    sidebarWrapperClasses,
    drawerContentClasses,
    drawerOverlayClasses,
  }
}
