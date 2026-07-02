<script setup lang="ts">
import { ref } from "vue";
import { type DuDockItem, type DuDockProps } from './du-dock.types';
import { useSizeMapping } from "../../../composables/useSizeProps";

const props = withDefaults(
  defineProps<DuDockProps>(),
  {
    size: "default",
    items: undefined,
    reverseTheme: false,
  },
);

const { sizeClass } = useSizeMapping(props, "dock");

const emit = defineEmits<{
  change: [item: DuDockItem | undefined]
}>();

const firstActiveItem = props.items?.findIndex((item) => item.active) ?? 0;
const activeItem = ref(firstActiveItem > -1 ? firstActiveItem : 0);
const selectedItem = ref(props.items?.[activeItem.value]);

const setActiveItem = (index: number) => {
  activeItem.value = index;
  selectedItem.value = props.items?.[activeItem.value];
  emit("change", selectedItem.value);
  selectedItem.value?.onClick?.();
};
const isActive = (index: number) => {
  return activeItem.value === index;
};

defineExpose({
  activeItem,
  selectedItem,
});
</script>

<template>
  <div :class="[
    'dock',
    sizeClass,
    reverseTheme && 'bg-neutral text-neutral-content',
  ]">
    <template v-if="$slots.default">
      <slot></slot>
    </template>
    <template v-else-if="items">
      <button v-for="(item, index) in items" :key="index" @click="setActiveItem(index)"
        :class="[item.class, isActive(index) && 'dock-active']">
        <slot name="icon" :item="item" :index="index">
          <slot :name="`icon-${index}`" :item="item" :index="index">
            <component :is="item.icon" v-if="typeof item.icon === 'object'" />
            <img v-else-if="
              typeof item.icon === 'string' && item.icon.startsWith('http')
            " :src="item.icon" :alt="item.label" />
            <div v-else-if="typeof item.icon === 'string'" v-html="item.icon"></div>
          </slot>
        </slot>

        <span v-if="item.label || $slots.label" :class="'dock-label'">
          <slot name="label" :item="item" :index="index">
            <slot :name="`label-${index}`" :item="item" :index="index">
              {{ item.label }}
            </slot>
          </slot>
        </span>
      </button>
    </template>
  </div>
</template>