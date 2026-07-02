<script setup lang="ts">
import { computed, ref, watch, useSlots } from 'vue'
import { type DuDrawerItem } from './du-drawer.types'
import DuMenu from '../../Navigation/du-menu/du-menu.vue'

const slots = useSlots()

const props = withDefaults(
    defineProps<{
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
    }>(),
    {
        id: undefined,
        position: 'start',
        open: false,
        responsive: false,
        alwaysOpenOnLarge: false,
        modelValue: false,
        sidebarClass: '',
        sidebarWrapperClass: '',
        contentClass: '',
        overlayClass: '',
        items: undefined,
        iconOnly: false,
    },
)

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'update:open': [value: boolean]
}>()

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

const menuSlots = computed(() => {
    const excludedSlots = ['default', 'content', 'sidebar', 'side']
    return Object.keys(slots).filter(name => !excludedSlots.includes(name))
})

defineExpose({
    toggleDrawer,
})
</script>

<template>
    <div :class="drawerClasses">
        <input :id="drawerId" type="checkbox" class="drawer-toggle" v-model="internalOpen" />

        <!-- Drawer Content -->
        <div :class="drawerContentClasses">
            <slot name="content">
                <slot></slot>
            </slot>
        </div>

        <!-- Drawer Side -->
        <div :class="drawerSideClasses">
            <label :for="drawerId" aria-label="close sidebar" :class="drawerOverlayClasses"></label>

            <div :class="sidebarWrapperClasses">
                <!-- Dynamic items mode -->
                <template v-if="items">
                    <!-- Forward menu customization slots (item, title, submenu, indexed) to DuMenu -->
                    <DuMenu :items="items" class="w-full">
                        <template
                            v-for="name in menuSlots"
                            :key="name"
                            #[name]="slotProps"
                        >
                            <slot :name="name" v-bind="slotProps" />
                        </template>
                    </DuMenu>
                </template>

                <!-- Manual/Slot mode -->
                <template v-else>
                    <slot name="sidebar">
                        <slot name="side"></slot>
                    </slot>
                </template>
            </div>
        </div>
    </div>
</template>
