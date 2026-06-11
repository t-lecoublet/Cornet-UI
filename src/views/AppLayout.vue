<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, provide, ref, watch } from 'vue'
import { useRoute, useRouter, RouterLink, RouterView } from 'vue-router'
import { DuButton, DuModal, DuNavbar, DuSearch } from 'cornet-ui'
import { docsNav } from '@/data/docs/registry'
import Logo from '@/components/logos/logo.vue'
import RepoChoiceModal from '@/components/RepoChoiceModal.vue'
import { useRepoPreference } from '@/composables/useRepoPreference'

const { preference, repoUrl, set } = useRepoPreference()

const route = useRoute()
const router = useRouter()

const isDocsRoute = computed(() => route.path.startsWith('/docs'))

// Sidebar state — provided to DocsLayout
const sidebarOpen = ref(false)
provide('sidebarOpen', sidebarOpen)

// Search modal
const searchOpen = ref(false)
const searchItems = docsNav.flatMap(cat =>
  cat.items.map(item => ({
    id: item.path,
    name: item.label,
    category: cat.category,
    description: item.description ?? '',
  }))
)
const navSearch = ref<{ id: string; name: string } | null>(null)

watch(navSearch, (val) => {
  if (val?.id) {
    router.push(val.id)
    searchOpen.value = false
    nextTick(() => { navSearch.value = null })
  }
})

function openSearch() {
  searchOpen.value = true
  setTimeout(() => {
    (document.getElementById('modal-search') as HTMLInputElement)?.focus()
  }, 300)
}

function closeSearch() {
  searchOpen.value = false
  navSearch.value = null
}

function onKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    searchOpen.value ? closeSearch() : openSearch()
  }
  if (e.key === 'Escape' && searchOpen.value) {
    closeSearch()
  }
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="h-dvh flex flex-col bg-base-100 text-base-content">

    <!-- ─── Navbar ──────────────────────────────────────── -->
    <DuNavbar class="sticky top-0 z-50 shadow-none! bg-base-100/80 backdrop-blur border-b-2 border-base-300 shrink-0">
      <template #start>
        <div class="flex items-center gap-3 px-2">
          <button
            v-if="isDocsRoute"
            aria-label="Toggle sidebar navigation"
            class="lg:hidden p-1.5 rounded-lg hover:bg-base-200 transition-colors cursor-pointer"
            @click="sidebarOpen = !sidebarOpen"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <RouterLink to="/" class="relative flex items-center pr-2">
            <Logo class="h-9 w-auto" />
            <span class="beta-badge">Beta</span>
          </RouterLink>
          <span v-if="isDocsRoute" class="hidden sm:inline text-xs font-mono text-base-content/30 border border-base-300 rounded-md px-2 py-0.5">docs</span>
        </div>
      </template>

      <template #center>
        <!-- Fake search button -->
        <div class="hidden md:flex flex-1 px-6">
          <button
            aria-label="Open search"
            class="flex items-center gap-2 w-full max-w-sm px-3 py-1.5 rounded-lg bg-base-200/60 border border-base-300 text-sm text-base-content/40 hover:border-base-content/20 hover:bg-base-200 transition-colors cursor-pointer"
            @click="openSearch"
          >
            <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <span class="flex-1 text-left">Search components & guides...</span>
            <kbd class="hidden lg:inline-flex items-center gap-0.5 text-xs font-mono bg-base-100 border border-base-300 rounded px-1.5 py-0.5 text-base-content/30">Ctrl K</kbd>
          </button>
        </div>
        <!-- Mobile search icon -->
        <button aria-label="Open search" class="md:hidden p-1.5 rounded-lg hover:bg-base-200 transition-colors cursor-pointer" @click="openSearch">
          <svg class="w-5 h-5 text-base-content/50" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </button>
      </template>

      <template #end>
        <div class="flex items-center gap-1.5 px-2">
          <!-- Active repo link -->
          <a
            :href="repoUrl"
            target="_blank"
            rel="noopener"
            :title="`Open on ${preference === 'gitlab' ? 'GitLab' : 'GitHub'}`"
            class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors"
            :class="preference === 'gitlab'
              ? 'border-warning/50 text-warning hover:bg-warning/5'
              : 'border-primary/50 text-primary hover:bg-primary/5'"
          >
            <!-- GitLab icon -->
            <svg v-if="preference === 'gitlab'" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 448 512" fill="currentColor"><path d="M0 96v320c0 35.3 28.7 64 64 64h320c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64C28.7 32 0 60.7 0 96m337.5 12.5l44.6 116.4l.4 1.2c5.6 16.8 7.2 35.2 2.3 52.5c-5 17.2-15.4 32.4-29.8 43.3l-.2.1l-68.4 51.2l-54.1 40.9c-.5.2-1.1.5-1.7.8c-2 1-4.4 2-6.7 2c-3 0-6.8-1.8-8.3-2.8l-54.2-40.9l-67.9-50.9l-.4-.3l-.2-.1c-14.3-10.8-24.8-26-29.7-43.3s-4.2-35.7 2.2-52.5l.5-1.2l44.7-116.4c.9-2.3 2.5-4.3 4.5-5.6c1.6-1 3.4-1.6 5.2-1.8c1.3-.7 2.1-.4 3.4.1c.6.2 1.2.5 2 .7c1 .4 1.6.9 2.4 1.5c.6.4 1.2 1 2.1 1.5c1.2 1.4 2.2 3 2.7 4.8l29.2 92.2H285l30.2-92.2c.5-1.8 1.4-3.4 2.6-4.8s2.8-2.4 4.5-3.1c1.7-.6 3.6-.9 5.4-.7s3.6.8 5.2 1.8c2 1.3 3.7 3.3 4.6 5.6"/></svg>
            <!-- GitHub icon -->
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"/></svg>
            <span class="hidden sm:inline">{{ preference === 'gitlab' ? 'GitLab' : 'GitHub' }}</span>
          </a>

          <!-- Switch source button -->
          <div
            class="tooltip tooltip-left"
            :data-tip="`Switch to ${preference === 'gitlab' ? 'GitHub' : 'GitLab'}`"
          >
            <button
              :aria-label="`Switch to ${preference === 'gitlab' ? 'GitHub' : 'GitLab'}`"
              class="p-1.5 rounded-lg border border-base-300 text-base-content/50 hover:text-base-content/80 hover:border-base-content/20 hover:bg-base-200 transition-colors cursor-pointer"
              @click="set(preference === 'gitlab' ? 'github' : 'gitlab')"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
            </button>
          </div>
        </div>
      </template>
    </DuNavbar>

    <!-- ─── Repo choice modal (first visit) ─────────────── -->
    <RepoChoiceModal v-if="preference === null" />

    <!-- ─── Page content ──────────────────────────────── -->
    <div :class="isDocsRoute ? 'flex-1 overflow-hidden flex flex-col' : 'flex-1 overflow-y-auto'">
      <RouterView />
    </div>

    <!-- ─── Search modal ──────────────────────────────── -->
    <DuModal v-model:open="searchOpen" placement="top" closeOnEscape classBox="overflow-visible" customClass="w-full max-w-lg">
      <!-- Détourne l'auto-focus du dialog loin du DuSearch -->
      <span tabindex="0" autofocus class="sr-only" />
      <div class="flex items-center gap-3">
        <svg class="w-4 h-4 shrink-0 text-base-content/40" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <DuSearch
          v-model="navSearch"
          name="modal-search"
          id="modal-search"
          placeholder="Search components & guides..."
          :listValues="searchItems"
          :limit="10"
          ghost
          class="w-full"
          customClass="border-none shadow-none focus:outline-none text-sm"
        >
          <template #option="{ option }">
            <div class="flex flex-col gap-0.5 w-full py-0.5">
              <div class="flex items-center justify-between gap-2">
                <span class="font-medium text-sm">{{ option.name }}</span>
                <span class="text-xs text-base-content/35 shrink-0 font-mono">{{ (option as any).category }}</span>
              </div>
              <p v-if="(option as any).description" class="text-xs text-base-content/45 truncate">
                {{ (option as any).description }}
              </p>
            </div>
          </template>
        </DuSearch>
        <button aria-label="Close search" class="shrink-0 text-xs text-base-content/30 hover:text-base-content/60 transition-colors cursor-pointer" @click="closeSearch">
          Esc
        </button>
      </div>
    </DuModal>

  </div>
</template>

<style scoped>
.beta-badge {
  position: absolute;
  top: -6px;
  right: -4px;
  font-size: 10px;
  font-weight: 900;
  font-style: italic;
  letter-spacing: 0.05em;
  line-height: 1;
  color: var(--color-primary);
  text-shadow:
    -1px -1px 0 color-mix(in srgb, var(--color-primary), black 60%),
     1px -1px 0 color-mix(in srgb, var(--color-primary), black 60%),
    -1px  1px 0 color-mix(in srgb, var(--color-primary), black 60%),
     1px  1px 0 color-mix(in srgb, var(--color-primary), black 60%),
     1px  2px 0 color-mix(in srgb, var(--color-primary), black 75%);
  user-select: none;
  pointer-events: none;
}
</style>
