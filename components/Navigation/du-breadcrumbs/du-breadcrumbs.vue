<script setup lang="ts">
import { computed } from "vue";
import { type DuBreadcrumbsProps } from './du-breadcrumbs.types';

const ROUTER_COMPONENTS = ['RouterLink', 'router-link', 'NuxtLink', 'nuxt-link'];

const props = withDefaults(
  defineProps<DuBreadcrumbsProps>(),
  {
    separator: undefined,
    ariaLabel: "Breadcrumb",
  },
);

const separatorClass = computed(() => {
  return props.separator ? "spec-seperator" : "";
});

const cssVars = computed(() => ({
  '--separator': props.separator
}));

const linkTag = computed(() => props.as || 'a');

const isRouterComponent = computed(() => {
  const tag = props.as;
  if (!tag) return false;
  if (typeof tag === 'string') return ROUTER_COMPONENTS.includes(tag);
  return tag.name ? ROUTER_COMPONENTS.includes(tag.name) : false;
});

function linkProps(href: string) {
  if (isRouterComponent.value) {
    return { to: href };
  }
  return { href };
}
</script>

<template>
  <nav
    class="breadcrumbs"
    :class="[separatorClass]"
    :style="cssVars"
    :aria-label="ariaLabel"
  >
    <ul>
      <li v-for="(item, index) in items" :key="index">
        <component
          :is="linkTag"
          v-if="item.href"
          v-bind="linkProps(item.href)"
          :aria-current="index === items.length - 1 ? 'page' : undefined"
        >
          <span v-if="item.icon" class="mr-1">{{ item.icon }}</span>
          {{ item.label }}
        </component>
        <span v-else :aria-current="index === items.length - 1 ? 'page' : undefined">
          <span v-if="item.icon" class="mr-1">{{ item.icon }}</span>
          {{ item.label }}
        </span>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
:is(
    .breadcrumbs.spec-seperator > menu,
    .breadcrumbs.spec-seperator > ul,
    .breadcrumbs.spec-seperator > ol
  )
  > li
  + ::before {
  content: var(--separator);
  opacity: 0.4;
  background-color: #0000;
  width: 0.375rem;
  margin-left: 0.5rem;
  margin-right: 0.75rem;
  display: block;
  border: unset;
  height: auto;
  rotate: 0deg;
}
</style> 