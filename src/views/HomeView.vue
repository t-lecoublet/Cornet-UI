<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRepoPreference } from '@/composables/useRepoPreference'

const { transformUrl } = useRepoPreference()
import { DuButton, DuBadge, DuCard, DuTabs, DuLink } from 'daisyui-vue-kit'
import CodeBlock from '@/components/CodeBlock.vue'
import Logo from '@/components/logos/logo.vue'

// ─── SVG icon paths (Heroicons 24 outline) ───────────────
const icons = {
  sparkles:   'M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z',
  folder:     'M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776',
  cube:       'M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9',
  book:       'M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25',
  arrowRight: 'M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3',
  git:        'M6 3v12m0 0a3 3 0 1 0 3 3m-3-3a3 3 0 0 0 3 3m0 0V9m0 0a3 3 0 1 0 3-3m-3 3a3 3 0 0 1 3-3m0 0V3',
  puzzle:     'M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.959.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z',
}

function svgIcon(path: string, cls = 'w-4 h-4') {
  return `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" class="${cls}"><path stroke-linecap="round" stroke-linejoin="round" d="${path}"/></svg>`
}

// ─── Flavor categories ────────────────────────────────────
const flavors = [
  {
    name: 'Actions',
    count: 5,
    cardClass: 'bg-primary/10 border-primary/20 hover:border-primary/40',
    tagClass: 'text-primary',
    components: ['DuButton', 'DuModal', 'DuDropdown', 'DuSwap', 'DuFab'],
    iconPath: 'M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5',
  },
  {
    name: 'Data Display',
    count: 18,
    cardClass: 'bg-secondary/10 border-secondary/20 hover:border-secondary/40',
    tagClass: 'text-secondary',
    components: ['DuCard', 'DuTable', 'DuBadge', 'DuAvatar', 'DuAccordion'],
    iconPath: 'M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125',
  },
  {
    name: 'Data Input',
    count: 13,
    cardClass: 'bg-accent/10 border-accent/20 hover:border-accent/40',
    tagClass: 'text-accent',
    components: ['DuInputField', 'DuSelect', 'DuCheckbox', 'DuRadio', 'DuRange'],
    iconPath: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10',
  },
  {
    name: 'Feedback',
    count: 7,
    cardClass: 'bg-error/10 border-error/20 hover:border-error/40',
    tagClass: 'text-base-content/70',
    components: ['DuAlert', 'DuToast', 'DuLoading', 'DuProgress', 'DuTooltip'],
    iconPath: 'M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0',
  },
  {
    name: 'Layout',
    count: 2,
    cardClass: 'bg-neutral/10 border-neutral/20 hover:border-neutral/40',
    tagClass: 'text-neutral',
    components: ['DuDrawer', 'DuJoin'],
    iconPath: 'M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z',
  },
  {
    name: 'Navigation',
    count: 10,
    cardClass: 'bg-info/10 border-info/20 hover:border-info/40',
    tagClass: 'text-info',
    components: ['DuNavbar', 'DuTabs', 'DuMenu', 'DuPagination', 'DuSteps'],
    iconPath: 'M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z',
  },
]

// ─── Why Cornet ───────────────────────────────────────────
const whys = [
  {
    headline: 'Ready out of the box',
    body: '55 components covering every UI need — from simple buttons to complex data tables.',
    iconPath: icons.puzzle,
  },
  {
    headline: 'Fully typed',
    body: 'Every prop, size and variant is typed with TypeScript. Your IDE will thank you.',
    iconPath: 'M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5',
  },
  {
    headline: 'DaisyUI 5 + Tailwind 4',
    body: 'Built on the latest versions. No legacy baggage, just clean modern CSS.',
    iconPath: 'M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42',
  },
  {
    headline: '35+ themes',
    body: 'Switch themes at runtime. Light, dark, or your own custom palette — it just works.',
    iconPath: 'M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z',
  },
]

// ─── Install methods → DuTabs ────────────────────────────
const installMethods = computed(() => [
  {
    label: 'New project',
    iconPath: icons.sparkles,
    description: 'Clone the full repo — Vite + Vue already wired up.',
    code: transformUrl('git clone --recurse-submodules \\\n  git@gitlab.limos.fr:hub-isima/daisyui-vue-kit.git'),
  },
  {
    label: 'Existing project',
    iconPath: icons.folder,
    description: 'Add only the lib as a Git submodule — no npm publish needed.',
    code: transformUrl(`git submodule add -b lib \\
  git@gitlab.limos.fr:hub-isima/daisyui-vue-kit.git lib
git submodule update --init --recursive
npm install ./lib`),
  },
  {
    label: 'Nuxt',
    iconPath: icons.cube,
    description: 'Grab our ready-made Nuxt starter instead.',
    code: 'git clone git@gitlab.limos.fr:hub-isima/daisyui-vue-kit-nuxt-starter.git',
  },
])

const selectedTab = ref(1)

const installTabs = computed(() =>
  installMethods.value.map((m, i) => ({
    label: m.label,
    icon: svgIcon(m.iconPath),
    class: 'gap-2',
    active: i === 1,
  }))
)

// ─── Post-install steps ───────────────────────────────────
const postSteps = [
  {
    n: '02',
    label: 'Add the Vite plugin',
    code: `// vite.config.ts
import vueDaisyUI from 'daisyui-vue-kit/plugin-vite'

export default defineConfig({
  plugins: [vueDaisyUI({ showOutput: true }), vue(), tailwindcss()]
})`,
  },
  {
    n: '03',
    label: 'Import the CSS',
    code: `/* your main CSS file */
@import "tailwindcss";
@import "daisyui-vue-kit/css";
@plugin "daisyui";`,
  },
  {
    n: '04',
    label: 'Use a component',
    code: `import { DuButton } from 'daisyui-vue-kit'

<DuButton variant="primary">Hello!</DuButton>`,
  },
]
</script>

<template>
  <div>

    <!-- ─── Hero ────────────────────────────────────────── -->
    <section class="relative overflow-hidden pt-16 pb-24">
      <div class="absolute -top-32 -left-32 w-125 h-125 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div class="absolute -bottom-24 -right-24 w-100 h-100 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

      <div class="container mx-auto px-6 flex flex-col items-center text-center gap-10 relative">
        <div class="relative inline-block">
          <img
            src="/logoLong.svg"
            alt="Cornet – daisyUI + Vue component library"
            class="w-full h-min max-w-xl"
            width="2750"
            height="905"
            fetchpriority="high"
          >
          <span class="beta-badge beta-badge--hero">Beta</span>
        </div>

        <div class="max-w-2xl space-y-4">
          <h1 class="text-4xl md:text-5xl font-black leading-tight">
            <span class="text-primary">Cornet</span>,
            the sweetest way to build
            <span class="text-secondary">Vue 3</span> UIs.
          </h1>
          <p class="text-lg text-base-content/60">
            55 beautifully crafted components, powered by
            <DuLink target="_blank" href="https://daisyui.com" class="font-semibold">daisyUI 5</DuLink>
            &amp;
            <DuLink target="_blank" href="https://tailwindcss.com/" class="font-semibold">Tailwind CSS 4</DuLink>
            Pick your flavors. Stack your scoops. Ship faster.
          </p>
        </div>

        <div class="flex flex-wrap gap-3 justify-center">
          <DuButton variant="primary" size="lg" customClass="shadow-md" as="a" href="#quickstart">
            Get started
            <svg class="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" :d="icons.arrowRight" />
            </svg>
          </DuButton>
          <DuButton variant="neutral" size="lg" outline as="RouterLink" to="/docs">
            Documentation
          </DuButton>
        </div>

        <p class="flex items-center gap-2 text-sm text-base-content/75 bg-base-200/60 rounded-xl px-4 py-2.5">
          <svg class="w-3.5 h-3.5 shrink-0 text-primary" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" :d="icons.git" />
          </svg>
          <span><code class="text-primary font-semibold text-xs">git submodule</code> — the recommended way to install Cornet</span>
        </p>
      </div>
    </section>

    <!-- ─── Stats ────────────────────────────────────────── -->
    <div class="border-y border-base-300 bg-base-200/60">
      <div class="container mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <div class="text-4xl font-black text-primary">55</div>
          <div class="text-sm text-base-content/50 mt-1">Components</div>
        </div>
        <div>
          <div class="text-4xl font-black text-secondary">6</div>
          <div class="text-sm text-base-content/50 mt-1">Categories</div>
        </div>
        <div>
          <div class="text-4xl font-black text-accent">35+</div>
          <div class="text-sm text-base-content/50 mt-1">Themes</div>
        </div>
        <div>
          <div class="text-4xl font-black text-primary">100%</div>
          <div class="text-sm text-base-content/50 mt-1">TypeScript</div>
        </div>
      </div>
    </div>

    <!-- ─── Flavors / Categories ──────────────────────────── -->
    <section id="flavors" class="container mx-auto px-6 py-24">
      <div class="text-center mb-14">
        <h2 class="text-4xl font-black mb-3">Pick your flavors</h2>
        <p class="text-base-content/70 max-w-md mx-auto">
          Every category is a scoop. Mix and match to build the UI you need.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <DuCard
          v-for="flavor in flavors"
          :key="flavor.name"
          bordered
          class="group transition-all hover:shadow-md hover:-translate-y-0.5 cursor-default"
          :class="flavor.cardClass"
        >
          <template #title>
            <div class="flex w-full items-center justify-between">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 shrink-0" :class="flavor.tagClass" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" :d="flavor.iconPath" />
                </svg>
                <span class="text-base">{{ flavor.name }}</span>
              </div>
              <DuBadge variant="neutral" size="sm">{{ flavor.count }}</DuBadge>
            </div>
          </template>
          <div class="flex flex-wrap gap-1.5 mt-1">
            <span
              v-for="comp in flavor.components"
              :key="comp"
              class="text-xs font-mono px-2 py-0.5 rounded-full bg-base-100/80 text-base-content/60 group-hover:text-base-content/80 transition-colors"
            >{{ comp }}</span>
            <span v-if="flavor.count > flavor.components.length" class="text-xs text-base-content/35 px-1 self-center">
              +{{ flavor.count - flavor.components.length }} more
            </span>
          </div>
        </DuCard>
      </div>
    </section>

    <!-- ─── Why Cornet ────────────────────────────────────── -->
    <section class="bg-base-200/50 border-y border-base-300 py-24">
      <div class="container mx-auto px-6">
        <div class="text-center mb-14">
          <h2 class="text-4xl font-black mb-3">Why Cornet?</h2>
          <p class="text-base-content/70 max-w-sm mx-auto">
            Because great UIs deserve a solid cone to hold them together.
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <DuCard
            v-for="(why, i) in whys"
            :key="why.headline"
            bordered
            class="ring ring-primary/20"
          >
            <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" :d="why.iconPath" />
              </svg>
            </div>
            <h3 class="font-bold text-base mb-2">{{ why.headline }}</h3>
            <p class="text-sm text-base-content/70">{{ why.body }}</p>
          </DuCard>
        </div>
      </div>
    </section>

    <!-- ─── Quick Start ───────────────────────────────────── -->
    <section id="quickstart" class="container mx-auto px-6 py-24">
      <div class="text-center mb-14">
        <h2 class="text-4xl font-black mb-3">First scoop in 4 steps</h2>
        <p class="text-base-content/70 max-w-sm mx-auto">
          No npm publish, no registry — just Git. Pick your setup and go.
        </p>
      </div>

      <div class="max-w-2xl mx-auto space-y-8">

        <!-- Step 01: install method tabs -->
        <div class="flex flex-col sm:flex-row gap-5 items-start overflow-clip max-w-screen">
          <div class="shrink-0 w-10 h-10 rounded-xl bg-primary text-primary-content flex items-center justify-center font-mono font-bold text-sm">01</div>
          <div class="flex-1">
            <p class="font-semibold mb-3">Add the library — choose your setup</p>
            <DuTabs class="max-w-[85dvw]" v-model="selectedTab" :items="installTabs" type="box" name="install_tabs">
              <template #content-0>
                <div class="pt-3">
                  <p class="text-sm text-base-content/70 mb-2">{{ installMethods[0].description }}</p>
                  <CodeBlock :code="installMethods[0].code" />
                </div>
              </template>
              <template #content-1>
                <div class="pt-3">
                  <p class="text-sm text-base-content/70 mb-2">{{ installMethods[1].description }}</p>
                  <CodeBlock :code="installMethods[1].code" />
                </div>
              </template>
              <template #content-2>
                <div class="pt-3">
                  <p class="text-sm text-base-content/70 mb-2">{{ installMethods[2].description }}</p>
                  <CodeBlock class="max-w-[85dvw]" :code="installMethods[2].code" />
                </div>
              </template>
            </DuTabs>
          </div>
        </div>

        <!-- Steps 02–04: only needed for existing project setup -->
        <div
          v-if="selectedTab === 1"
          v-for="step in postSteps"
          :key="step.n"
          class="flex flex-col sm:flex-row gap-5 items-start max-w-screen overflow-clip"
        >
          <div class="shrink-0 w-10 h-10 rounded-xl bg-primary text-primary-content flex items-center justify-center font-mono font-bold text-sm">
            {{ step.n }}
          </div>
          <div class="flex-1 w-full">
            <p class="font-semibold mb-2">{{ step.label }}</p>
            <CodeBlock :code="step.code" />
          </div>
        </div>

        <!-- Storybook callout -->
        <div class="flex flex-col sm:flex-row gap-5 items-start max-w-screen overflow-clip">
          <div class="shrink-0 w-10 h-10 rounded-xl bg-secondary/15 border border-secondary/25 flex items-center justify-center">
            <svg class="w-5 h-5 text-secondary" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" :d="icons.book" />
            </svg>
          </div>
          <DuCard bordered customClass="flex-1 bg-secondary/5 border-secondary/20">
            <template #title>Explore with Storybook</template>
            <p class="text-sm text-base-content/60 mb-3">
              Every component ships with Storybook stories. Run them locally to browse all variants, sizes and props interactively.
            </p>
            <CodeBlock code="npx storybook dev" />
            <DuLink class="absolute top-3 right-3 flex items-center gap-1" variant="secondary" size="sm" href="https://storybook.js.org/docs/get-started/frameworks/vue3-vite" target="_blank">
              Storybook docs
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"></path></svg>
            </DuLink>
          </DuCard>
        </div>

      </div>
    </section>

    <!-- ─── CTA banner ───────────────────────────────────── -->
    <div class="bg-primary text-primary-content py-16">
      <div class="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 class="text-2xl font-black mb-1">Ready for your first scoop?</h2>
          <p class="text-primary-content/70 text-sm">Cornet is open source and free to use.</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <DuButton variant="neutral" size="lg" aria-label="View Cornet on GitLab" customClass="bg-primary-content text-primary border-0 hover:bg-primary-content/90" as="a" href="https://gitlab.limos.fr/hub-isima/daisyui-vue-kit" target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 448 512" fill="currentColor"><path d="M0 96v320c0 35.3 28.7 64 64 64h320c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64C28.7 32 0 60.7 0 96m337.5 12.5l44.6 116.4l.4 1.2c5.6 16.8 7.2 35.2 2.3 52.5c-5 17.2-15.4 32.4-29.8 43.3l-.2.1l-68.4 51.2l-54.1 40.9c-.5.2-1.1.5-1.7.8c-2 1-4.4 2-6.7 2c-3 0-6.8-1.8-8.3-2.8l-54.2-40.9l-67.9-50.9l-.4-.3l-.2-.1c-14.3-10.8-24.8-26-29.7-43.3s-4.2-35.7 2.2-52.5l.5-1.2l44.7-116.4c.9-2.3 2.5-4.3 4.5-5.6c1.6-1 3.4-1.6 5.2-1.8c1.3-.7 2.1-.4 3.4.1c.6.2 1.2.5 2 .7c1 .4 1.6.9 2.4 1.5c.6.4 1.2 1 2.1 1.5c1.2 1.4 2.2 3 2.7 4.8l29.2 92.2H285l30.2-92.2c.5-1.8 1.4-3.4 2.6-4.8s2.8-2.4 4.5-3.1c1.7-.6 3.6-.9 5.4-.7s3.6.8 5.2 1.8c2 1.3 3.7 3.3 4.6 5.6"/></svg>
            <span class="hidden sm:inline">GitLab</span>
          </DuButton>
          <DuButton variant="neutral" size="lg" aria-label="View Cornet on GitHub" customClass="bg-primary-content text-primary border-0 hover:bg-primary-content/90" as="a" href="https://github.com/t-lecoublet/Cornet" target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"/></svg>
            <span class="hidden sm:inline">GitHub</span>
          </DuButton>
          <DuButton size="lg" customClass="bg-white/15 border-white/30 text-primary-content hover:bg-white/25 border" as="RouterLink" to="/docs">
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" :d="icons.book" />
            </svg>
            Documentation
          </DuButton>
        </div>
      </div>
    </div>

    <!-- ─── Footer ───────────────────────────────────────── -->
    <footer class="bg-base-200 border-t border-base-300 py-8">
      <div class="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <Logo class="h-7 w-min" />
          <span class="text-sm text-base-content/80">Vue 3 component library for DaisyUI</span>
        </div>
        <div class="text-xs text-base-content/80">
          Built with Vue 3 · DaisyUI 5 · Tailwind CSS 4
        </div>
      </div>
    </footer>

  </div>
</template>

<style scoped>
@keyframes beta-float {
  0%, 100% { transform: rotate(12deg) translateY(0px); }
  50%       { transform: rotate(12deg) translateY(-3px); }
}

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

.beta-badge--hero {
  --outline-size: 2px;
  top: 4px;
  right: -10px;
  font-size: 1.88rem;
  transform: rotate(12deg);
  transform-origin: bottom left;
  animation: beta-float 2s ease-in-out infinite;
  color: var(--color-primary);
  text-shadow:
    calc(var(--outline-size) * -1) calc(var(--outline-size) * -1) 0 color-mix(in srgb, var(--color-primary), black 60%),
     var(--outline-size) calc(var(--outline-size) * -1) 0 color-mix(in srgb, var(--color-primary), black 60%),
    calc(var(--outline-size) * -1)  var(--outline-size) 0 color-mix(in srgb, var(--color-primary), black 60%),
     var(--outline-size)  var(--outline-size) 0 color-mix(in srgb, var(--color-primary), black 60%),
    calc(var(--outline-size) * -1)  0   0 color-mix(in srgb, var(--color-primary), black 60%),
     var(--outline-size)  0   0 color-mix(in srgb, var(--color-primary), black 60%),
     0   calc(var(--outline-size) * -1) 0 color-mix(in srgb, var(--color-primary), black 60%),
     0    var(--outline-size) 0 color-mix(in srgb, var(--color-primary), black 60%),
     var(--outline-size)  3px 0 color-mix(in srgb, var(--color-primary), black 80%);
}

@media (max-width: 500px) {
  .beta-badge--hero {
    font-size: 5vw;
    --outline-size: 1px;
  }
}
</style>
