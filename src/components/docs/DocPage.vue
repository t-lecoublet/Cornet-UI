<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import type { DocPageData } from '@/types/docs'
import PropsTable from './PropsTable.vue'
import PropsDocs from './PropsDocs.vue'
import SlotsDocs from './SlotsDocs.vue'
import LivePreview from './LivePreview.vue'
import CodeBlock from './CodeBlock.vue'
import { useRepoPreference } from '@/composables/useRepoPreference'

const props = defineProps<{ data: DocPageData }>()

const { transformUrl, preference } = useRepoPreference()

const filteredSections = computed(() =>
  props.data.sections.filter(s => !s.showFor || s.showFor.includes(preference.value ?? 'gitlab'))
)

const copiedIdx = ref<number | null>(null)
const copiedAnchorIdx = ref<number | null>(null)

function copyCode(code: string, idx: number) {
  navigator.clipboard.writeText(code).then(() => {
    copiedIdx.value = idx
    setTimeout(() => { copiedIdx.value = null }, 2000)
  }).catch(() => {})
}

function copyAnchor(id: string, idx: number) {
  history.pushState(null, '', `#${id}`)
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  const url = window.location.href
  navigator.clipboard.writeText(url).then(() => {
    copiedAnchorIdx.value = idx
    setTimeout(() => { copiedAnchorIdx.value = null }, 2000)
  }).catch(() => {})
}

function getFullCode(section: { code: string }): string {
  return transformUrl(section.code)
}

function sectionKey(data: DocPageData, idx: number): string {
  return data.title + '-' + idx
}

function sectionId(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

onMounted(async () => {
  const hash = window.location.hash.slice(1)
  if (!hash) return
  await nextTick()
  setTimeout(() => {
    document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
  }, 400)
})
</script>

<template>
  <div class="min-h-full">

    <!-- ─── Page header ─────────────────────────────────── -->
    <div class="border-b border-base-300 pb-6 mb-8">
      <div class="flex items-start justify-between gap-4 flex-wrap relative">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xs font-mono text-base-content/40 uppercase tracking-widest">{{ data.category }}</span>
          </div>
          <h1 class="text-3xl font-black text-base-content mb-2">{{ data.title }}</h1>
          <p class="text-base-content/60 text-base max-w-2xl">{{ data.description }}</p>
        </div>
        <a
          v-if="data.source"
          :href="data.source"
          target="_blank"
          rel="noopener"
          class="flex items-center gap-1.5 text-xs text-base-content/40 hover:text-primary transition-colors mt-1 shrink-0 absolute top-0 right-0"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
          DaisyUI source
        </a>
      </div>
    </div>

    <!-- ─── Props documentation ───────────────────────── -->
    <section v-if="data.props?.length" class="mb-10">
      <h2 class="text-base font-bold text-base-content mb-3">Props</h2>
      <PropsDocs :props="data.props" />
    </section>

    <!-- ─── Slots documentation ─────────────────────── -->
    <section v-if="data.slots?.length" class="mb-10">
      <h2 class="text-base font-bold text-base-content mb-3">Slots</h2>
      <SlotsDocs :slots="data.slots" />
    </section>

    <!-- ─── Classnames / Props table ────────────────────── -->
    <section v-if="data.classnames" class="mb-10">
      <h2 class="text-base font-bold text-base-content mb-3">Props &amp; Classes</h2>
      <PropsTable :classnames="data.classnames" />
    </section>

    <!-- ─── Sections ─────────────────────────────────────── -->
    <section v-if="filteredSections.length" class="space-y-10">
      <div
        v-for="(section, idx) in filteredSections"
        :key="sectionKey(data, idx)"
        :id="sectionId(section.title)"
        class="group pt-5"
      >
        <!-- Section title -->
        <h3
          class="text-sm font-bold text-base-content/80 mb-3 flex items-center gap-2 group/heading cursor-pointer relative"
          :title="copiedAnchorIdx === idx ? 'Copied!' : 'Copy link'"
          @click="copyAnchor(sectionId(section.title), idx)"
        >
          <a
            :href="`#${sectionId(section.title)}`"
            class="w-5.5 h-5.5 bg-base-200/50  text-info/25 group-hover/heading:bg-base-200 group-hover/heading:text-primary transition-opacity absolute top-0 -left-10 shrink-0 grid place-items-center rounded-md"
            :class="copiedAnchorIdx === idx ? 'text-success' : 'text-base-content/30 hover:text-primary'"
          >
            <svg v-if="copiedAnchorIdx !== idx" class="w-full h-full" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24">
            <path fill="currentColor" d="M10.416 6.507a.5.5 0 0 1 .41.575L10.506 9h3.987l.347-2.082a.5.5 0 0 1 .986.164L15.506 9H17a.5.5 0 0 1 0 1h-1.66l-.666 4h1.493a.5.5 0 0 1 0 1h-1.66l-.347 2.082a.5.5 0 1 1-.986-.164l.32-1.918H9.506l-.347 2.082a.5.5 0 1 1-.987-.164L8.493 15H7a.5.5 0 0 1 0-1h1.66l.666-4H7.833a.5.5 0 1 1 0-1h1.66l.347-2.082a.5.5 0 0 1 .575-.411M10.34 10l-.666 4h3.986l.666-4z"/>
            </svg>
            <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </a>
          <span class="w-1 h-4 rounded-full bg-primary/50 inline-block shrink-0"></span>
          {{ section.title }}
        </h3>

        <!-- Optional description -->
        <p v-if="section.description" class="text-sm text-base-content/55 mb-3">
          {{ section.description }}
        </p>

        <!-- Optional external links -->
        <div v-if="section.links?.length" class="flex flex-wrap gap-2 mb-3">
          <a
            v-for="link in section.links"
            :key="link.href"
            :href="transformUrl(link.href)"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border border-base-300 text-base-content/55 hover:text-primary hover:border-primary/40 transition-colors"
          >
            {{ link.label }}
            <svg class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        </div>

        <!-- Live Vue preview -->
        <div
          v-if="section.preview"
          class="border border-base-300 rounded-t-xl bg-base-100 px-6 py-8"
        >
          <LivePreview :code="section.preview" :script="section.script" />
        </div>

        <!-- Code block -->
        <div :class="section.preview ? 'rounded-b-xl overflow-hidden border border-t-0 border-base-300' : 'rounded-xl overflow-hidden border border-base-300'">
          <div class="flex items-center justify-between bg-base-200/80 px-4 py-2 border-b border-base-300/60">
            <span class="text-xs font-mono text-base-content/40">{{ section.lang || 'vue' }}</span>
            <button
              class="flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg transition-all cursor-pointer"
              :class="copiedIdx === idx
                ? 'bg-success/15 text-success'
                : 'text-base-content/40 hover:text-base-content/80 hover:bg-base-300/40'"
              @click="copyCode(getFullCode(section), idx)"
            >
              <svg v-if="copiedIdx !== idx" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
              </svg>
              <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              {{ copiedIdx === idx ? 'Copied!' : 'Copy' }}
            </button>
          </div>
          <div class="bg-base-200/40 font-semibold">
            <CodeBlock :code="getFullCode(section)" :lang="section.lang" />
          </div>
        </div>
      </div>
    </section>

  </div>
</template>
