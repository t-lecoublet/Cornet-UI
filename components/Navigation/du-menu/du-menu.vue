<script setup lang="ts">
import { computed, inject } from "vue";
import { type DuMenuProps, type DuMenuItemData } from './du-menu.types';
import { useSizeMapping } from "../../../composables/useSizeProps";
import DuMenuItem from './du-menu-item.vue';

const props = withDefaults(
  defineProps<DuMenuProps>(),
  {
    direction: "vertical",
    size: "default",
    rounded: true,
  },
);

const emit = defineEmits<{
  itemClick: [item: DuMenuItemData];
  subItemClick: [item: DuMenuItemData];
}>();

function handleItemClick(item: DuMenuItemData) {
  props.onItemClick?.(item);
  emit('itemClick', item);
}

function handleSubItemClick(item: DuMenuItemData) {
  props.onSubItemClick?.(item);
  emit('subItemClick', item);
}

const isInDropdownTrigger = inject("isDropdownTrigger", false);

const directionClass = computed(() => {
  return {
    default: "",
    vertical: "menu-vertical",
    horizontal: "menu-horizontal",
    responsive: "menu-vertical lg:menu-horizontal",
  }[props.direction];
});
const { sizeClass } = useSizeMapping(props, "menu");
const roundedClass = computed(() => {
  return props.rounded ? "rounded-box" : "[&_li>*]:rounded-none p-0";
});
const inDropdownClass = computed(() => {
  return isInDropdownTrigger ? "" : "bg-base-200";
});

const ariaOrientation = computed(() => {
  return props.direction === "horizontal" || props.direction === "responsive" ? "horizontal" : "vertical";
});
// Slots documentation : voir le template pour la gestion des slots indexés et globaux.
</script>

<template>
  <ul role="listbox" :aria-orientation="ariaOrientation" :class="['menu', inDropdownClass, roundedClass, directionClass, sizeClass]">
    <!-- Mode automatique (items) -->
    <template v-if="items && !$slots.default">
      <DuMenuItem
        v-for="(item, index) in items"
        :key="index"
        :item="item"
        :index="index"
        :onItemClick="handleItemClick"
        :onSubItemClick="handleSubItemClick"
      >
        <!-- Transmission de tous les slots au composant enfant -->
        <template v-for="(_, name) in $slots" #[name]="slotProps">
          <slot :name="name" v-bind="slotProps" />
        </template>
      </DuMenuItem>
    </template>
    <!-- Mode manuel (slot) -->
    <template v-else>
      <slot />
    </template>
  </ul>
</template>


<style>

.menu * a, .menu * button {
  margin: .125rem 0;
}

</style>