<script setup lang="ts">
import { computed } from 'vue';
import { type MenuItem } from './du-menu.types';

const props = defineProps<{
  item: MenuItem;
  index: number;
  parentIndex?: string;
  onItemClick?: (item: MenuItem) => void;
  onSubItemClick?: (item: MenuItem) => void;
}>();

// Typed via defineSlots so the recursive slot forwarding below stays type-safe.
const _slots = defineSlots();

const idx = computed(() => props.parentIndex ? `${props.parentIndex}-${props.index}` : `${props.index}`);

const ROUTER_COMPONENTS = ['RouterLink', 'router-link', 'NuxtLink', 'nuxt-link'];

const linkTag = computed(() => props.item.as || 'a');

const isRouterComponent = computed(() => {
  const tag = props.item.as;
  if (!tag) return false;
  if (typeof tag === 'string') return ROUTER_COMPONENTS.includes(tag);
  return tag.name ? ROUTER_COMPONENTS.includes(tag.name) : false;
});

const linkProps = computed(() => {
  if (isRouterComponent.value) {
    return { to: props.item.href };
  }
  return { href: props.item.href };
});

// Détermine si l'item est actif (sélectionné)
const isActive = computed(() => {
  if (props.item.multiple) {
    return props.item.checked
  } else {
    return props.item.checked || props.item.active
  }
});

function handleClick() {
  props.item.onClick?.();
  const callback = props.parentIndex ? props.onSubItemClick : props.onItemClick;
  callback?.(props.item);
}
</script>

<template>
  <!-- Titre simple (menu-title) -->
  <template v-if="item.isTitle && !item.subItems">
    <template v-if="$slots[`title-${idx}`]">
      <slot :name="`title-${idx}`" :item="item" :index="index" />
    </template>
    <template v-else-if="$slots.title">
      <slot name="title" :item="item" :index="index" />
    </template>
    <template v-else>
      <li class="menu-title">{{ item.label }}</li>
    </template>
  </template>
  <!-- Titre parent (menu-title + sous-menu) -->
  <template v-else-if="item.isTitle && item.subItems">
    <template v-if="$slots[`title-${idx}`]">
      <slot :name="`title-${idx}`" :item="item" :index="index" />
      <ul role="listbox">
        <du-menu-item v-for="(sub, subIndex) in item.subItems" :key="subIndex" :item="sub" :index="subIndex"
          :parent-index="idx" :onItemClick="onItemClick" :onSubItemClick="onSubItemClick" v-bind="$attrs">
          <template v-for="(_, name) in $slots" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps" />
          </template>
        </du-menu-item>
      </ul>
    </template>
    <template v-else-if="$slots.title">
      <slot name="title" :item="item" :index="index" />
      <ul role="listbox">
        <du-menu-item v-for="(sub, subIndex) in item.subItems" :key="subIndex" :item="sub" :index="subIndex"
          :parent-index="idx" :onItemClick="onItemClick" :onSubItemClick="onSubItemClick" v-bind="$attrs">
          <template v-for="(_, name) in $slots" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps" />
          </template>
        </du-menu-item>
      </ul>
    </template>
    <template v-else>
      <li>
        <h2 class="menu-title">{{ item.label }}</h2>
        <ul role="listbox">
          <du-menu-item v-for="(sub, subIndex) in item.subItems" :key="subIndex" :item="sub" :index="subIndex"
            :parent-index="idx" :onItemClick="onItemClick" :onSubItemClick="onSubItemClick" v-bind="$attrs">
            <template v-for="(_, name) in $slots" #[name]="slotProps">
              <slot :name="name" v-bind="slotProps" />
            </template>
          </du-menu-item>
        </ul>
      </li>
    </template>
  </template>
  <!-- Item avec sous-menu -->
  <template v-else-if="item.subItems">
    <template v-if="$slots[`submenu-${idx}`]">
      <slot :name="`submenu-${idx}`" :item="item" :index="index" />
    </template>
    <template v-else-if="$slots.submenu">
      <slot name="submenu" :item="item" :index="index" />
    </template>
    <template v-else>
      <li>
        <component :is="linkTag" :role="item.disabled ? undefined : 'option'" v-bind="linkProps" :class="{
          'menu-disabled': item.disabled,
          'menu-active': isActive
        }" @click.stop="handleClick">
          <component :is="item.icon" v-if="typeof item.icon === 'object'" />
          <img v-else-if="typeof item.icon === 'string' && item.icon.startsWith('http')" :src="item.icon"
            :alt="item.label" class="w-5 h-5" />
          <div v-else-if="typeof item.icon === 'string'" v-html="item.icon"></div>
          {{ item.label }}
          <slot name="additional" :item="item" :index="index"></slot>
        </component>
        <ul role="listbox">
          <du-menu-item v-for="(sub, subIndex) in item.subItems" :key="subIndex" :item="sub" :index="subIndex"
            :parent-index="idx" :onItemClick="onItemClick" :onSubItemClick="onSubItemClick" v-bind="$attrs">
            <template v-for="(_, name) in $slots" #[name]="slotProps">
              <slot :name="name" v-bind="slotProps" />
            </template>
          </du-menu-item>
        </ul>
      </li>
    </template>
  </template>
  <!-- Item simple -->
  <template v-else>
    <template v-if="$slots[`item-${idx}`]">
      <slot :name="`item-${idx}`" :item="item" :index="index" />
    </template>
    <template v-else-if="$slots.item">
      <slot name="item" :item="item" :index="index" />
    </template>
    <template v-else>
      <li :class="{ 'menu-disabled': item.disabled }">
        <component :is="linkTag" :role="item.disabled ? undefined : 'option'" v-bind="linkProps" :class="{ 'menu-active': isActive }"
          @click.stop="handleClick">
          <!-- Checkbox pour sélection multiple -->
          <input v-if="item.multiple && item.value !== undefined" type="checkbox"
            class="invisible w-0 h-0 overflow-clip" :checked="item.checked" disabled>
          <component :is="item.icon" v-if="typeof item.icon === 'object'" />
          <img v-else-if="typeof item.icon === 'string' && item.icon.startsWith('http')" :src="item.icon"
            :alt="item.label" class="w-5 h-5" />
          <div v-else-if="typeof item.icon === 'string'" v-html="item.icon"></div>
          {{ item.label }}
          <slot name="additional" :item="item" :index="index"></slot>
        </component>
      </li>
    </template>
  </template>
</template>