<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { type DuDrawerProps, type DuDrawerEmit } from './du-drawer.types'
import DuMenu from '../../Navigation/du-menu/du-menu.vue'
import { useDrawerOpenState } from './composables/useDrawerOpenState'
import { useDrawerClasses } from './composables/useDrawerClasses'

const slots = useSlots()

const props = withDefaults(
    defineProps<DuDrawerProps>(),
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

const emit = defineEmits<DuDrawerEmit>()

const {
    drawerId,
    drawerClasses,
    drawerSideClasses,
    sidebarWrapperClasses,
    drawerContentClasses,
    drawerOverlayClasses,
} = useDrawerClasses(props)

const { internalOpen, toggleDrawer } = useDrawerOpenState(props, emit)

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
