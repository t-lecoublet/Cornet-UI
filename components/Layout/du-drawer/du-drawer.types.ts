import { type DuMenuItemData } from '../../Navigation/du-menu/du-menu.types'

export const DRAWER_POSITIONS = ['start', 'end'] as const

export type DuDrawerPosition = (typeof DRAWER_POSITIONS)[number]

export interface DuDrawerItem extends DuMenuItemData {
    icon?: any
    customClass?: string
    [key: string]: any
}

export interface DuDrawerProps {
    id?: string
    position?: 'start' | 'end'
    open?: boolean
    responsive?: boolean
    alwaysOpenOnLarge?: boolean
    modelValue?: boolean
    sidebarClass?: string
    sidebarWrapperClass?: string
    contentClass?: string
    overlayClass?: string
    items?: DuDrawerItem[]
    /** Enable icon-only collapsible mode with is-drawer-open/is-drawer-close variants */
    iconOnly?: boolean
}
