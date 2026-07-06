import { type DuMenuItemData } from '../../Navigation/du-menu/du-menu.types'

export const DRAWER_POSITIONS = ['start', 'end'] as const

export type DuDrawerPosition = (typeof DRAWER_POSITIONS)[number]

export interface DuDrawerItem extends DuMenuItemData {
    icon?: any
    customClass?: string
    [key: string]: any
}

export type DuDrawerEmit = {
    (e: 'update:modelValue', value: boolean): void
    (e: 'update:open', value: boolean): void
}

export interface DuDrawerProps {
    id?: string
    position?: 'start' | 'end'
    open?: boolean
    responsive?: boolean | 'xl' | 'lg' | 'md' | 'sm'
    // keep alwaysOpenOnLarge due to breaking changes
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
