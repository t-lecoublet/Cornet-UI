<script setup lang="ts">
import { computed, inject, ref, watch, type Ref } from 'vue'
import { useRoute, RouterLink, RouterView } from 'vue-router'
import { docsNav, docsCounts } from '@/data/docs/nav'
import {
  levelByPath,
  LEVEL_GUIDANCE,
  LEVEL_ICON,
  LEVEL_ORDER,
  LEVEL_STYLE,
  type ComponentLevel,
} from '@/data/component-levels'

const route = useRoute()
const sidebarOpen = inject<Ref<boolean>>('sidebarOpen', ref(false))

function isActive(path: string) {
  return route.path === path
}

// The window never scrolls in the docs layout — <main> does — so the router's
// `scrollBehavior: { top: 0 }` has nothing to reset, and this layout is reused
// across doc pages rather than remounted, which is why the scroll position used
// to carry over. Reset the scrollport ourselves on every page change, unless the
// URL carries a hash: that navigation is targeting a specific section.
const scrollPort = ref<HTMLElement | null>(null)

watch(
  () => route.path,
  () => {
    if (route.hash) return
    scrollPort.value?.scrollTo({ top: 0 })
  },
)

const isGallery = computed(() => route.path === '/docs/components')

function levelTitle(level: ComponentLevel) {
  return `${level} — ${LEVEL_GUIDANCE[level]}`
}

// docsNav is static, so merge each item's level in once at module scope rather
// than looking it up on every render. Guide pages have no level and stay untagged.
// The tooltip carries this component's own audit line, which is why the guide
// no longer needs to repeat all 54 of them in a table.
const nav = docsNav.map((cat) => ({
  ...cat,
  items: cat.items.map((item) => {
    const entry = levelByPath[item.path]
    return {
      ...item,
      level: entry?.level,
      levelTooltip: entry ? `${entry.level} — ${entry.reason}\n\n${LEVEL_GUIDANCE[entry.level]}` : undefined,
    }
  }),
}))
</script>

<template>
  <div class="flex flex-1 h-full overflow-hidden">

    <!-- Overlay (mobile) -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/30 z-30 lg:hidden"
      @click="sidebarOpen = false"
    />

    <!-- ─── Sidebar ────────────────────────────────────── -->
    <aside
      class="fixed lg:sticky top-16 lg:top-0 h-[calc(100dvh-4rem)] lg:h-full z-40 w-64 shrink-0 border-r border-base-300 bg-base-100 flex flex-col transition-transform duration-200"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
    >
      <!-- Nav -->
      <nav class="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        <!-- Above the categories: the one page that shows all of them at once. -->
        <RouterLink
          to="/docs/components"
          class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors"
          :class="isActive('/docs/components')
            ? 'bg-primary/10 text-primary font-semibold'
            : 'text-base-content/60 hover:text-base-content hover:bg-base-200/70'"
          @click="sidebarOpen = false"
        >
          <svg class="w-4 h-4 shrink-0 opacity-70" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 15.75V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
          </svg>
          <span class="truncate">All Components</span>
          <span class="ml-auto shrink-0 text-[10px] font-mono text-base-content/30">{{ docsCounts.components }}</span>
        </RouterLink>

        <div
          v-for="cat in nav"
          :key="cat.category"
        >
          <div class="px-2 mb-1.5">
            <span class="text-xs font-bold uppercase tracking-widest text-base-content/35">{{ cat.category }}</span>
          </div>
          <ul class="space-y-0.5">
            <li v-for="item in cat.items" :key="item.path">
              <RouterLink
                :to="item.path"
                class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors"
                :class="isActive(item.path)
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-base-content/60 hover:text-base-content hover:bg-base-200/70'"
                @click="sidebarOpen = false"
              >
                <span class="truncate">{{ item.label }}</span>

                <!-- Internal-complexity tag: icon only — the footer legend decodes it. -->
                <span
                  v-if="item.level"
                  class="ml-auto shrink-0 flex items-center justify-center p-1 rounded-full"
                  :class="LEVEL_STYLE[item.level]"
                  :title="item.levelTooltip"
                >
                  <svg
                    class="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" :d="LEVEL_ICON[item.level]" />
                  </svg>
                  <span class="sr-only">{{ item.level }}</span>
                </span>
              </RouterLink>
            </li>
          </ul>
        </div>
      </nav>

      <!-- Footer -->
      <div class="border-t border-base-300">
        <!-- Legend for the per-component complexity tags -->
        <RouterLink
          to="/docs/guides/when-to-use"
          class="flex flex-wrap items-center gap-x-2 gap-y-1 px-4 pt-3 pb-2 hover:bg-base-200/70 transition-colors"
          :title="'What these tags mean — ' + LEVEL_ORDER.map(levelTitle).join(' · ')"
          @click="sidebarOpen = false"
        >
          <span
            v-for="level in LEVEL_ORDER"
            :key="level"
            class="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold tracking-tight"
            :class="LEVEL_STYLE[level]"
          >
            <svg class="w-2.5 h-2.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" :d="LEVEL_ICON[level]" />
            </svg>
            {{ level }}
          </span>
        </RouterLink>

        <div class="px-4 pb-3 text-xs text-base-content/30">
          {{ docsCounts.components }} components · {{ docsCounts.guides }} guides
        </div>
      </div>
    </aside>

    <!-- ─── Content ────────────────────────────────────── -->
    <!-- `relative`: an absolutely positioned descendant with no positioned ancestor
         (the gallery cards' sr-only labels) is otherwise placed against <body>, escapes
         this scrollport's clipping and makes the window scroll past the page too. -->
    <main ref="scrollPort" class="relative flex-1 overflow-y-scroll h-full">
      <!-- A prose column for a doc page; a wider one for the component grid. -->
      <div class="mx-auto px-6 py-10" :class="isGallery ? 'max-w-6xl' : 'max-w-3xl'">
        <RouterView />
      </div>
    </main>

  </div>
</template>
