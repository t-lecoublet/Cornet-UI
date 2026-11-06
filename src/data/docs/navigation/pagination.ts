import type { DocPageData } from '@/types/docs'

export default {
  title: 'Pagination',
  description: 'Pagination navigates through pages of content. The root is a `<nav>` landmark and the current page carries `aria-current="page"`, so a screen reader can say where you are rather than reading a row of bare numbers.',
  category: 'Navigation',
  source: 'https://daisyui.com/components/pagination/',
  props: [
    {
      title: 'modelValue',
      description: 'Current page (`v-model`). Leave it out and the pagination keeps its own page, starting at 1; pass it and the pagination follows it and only emits `update:modelValue`.',
      type: 'number',
    },
    {
      title: 'total',
      description: 'Total number of items',
      type: 'number',
      required: true,
    },
    {
      title: 'perPage',
      description: 'Number of items per page',
      type: 'number',
      default: '10',
    },
    {
      title: 'showNext',
      description: 'Show next page button',
      type: 'boolean',
      default: 'true',
    },
    {
      title: 'showPrevious',
      description: 'Show previous page button',
      type: 'boolean',
      default: 'true',
    },
    {
      title: 'showFirst',
      description: 'Show first page button',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'showLast',
      description: 'Show last page button',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'size',
      description: 'Size of pagination buttons',
      type: 'string',
      default: '"default"',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    {
      title: 'nextLabel',
      description: 'Label for next button',
      type: 'string',
      default: '"\'»\'"',
    },
    {
      title: 'previousLabel',
      description: 'Label for previous button',
      type: 'string',
      default: '"\'«\'"',
    },
    {
      title: 'firstLabel',
      description: 'Label for first button',
      type: 'string',
      default: '"\'«« \'"',
    },
    {
      title: 'lastLabel',
      description: 'Label for last button',
      type: 'string',
      default: '"\' »»\'"',
    },
    {
      title: 'variant',
      description: 'Color variant for buttons',
      type: 'string',
      default: '"default"',
      options: ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error', 'ghost', 'link'],
    },
    {
      title: 'outline',
      description: 'Use outline style for buttons',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'soft',
      description: 'Use soft style for buttons',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'manual',
      description: 'Manual mode - use default slot for custom button layout',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'showEllipsis',
      description: 'Show ellipsis for omitted pages',
      type: 'boolean',
      default: 'true',
    },
    {
      title: 'ariaLabel',
      description: 'Accessible name of the navigation landmark. A page with more than one `<nav>` needs each named, or they are indistinguishable in a landmark list.',
      type: 'string',
      default: "'Pagination'",
    },
    {
      title: 'previousAriaLabel',
      description: 'Accessible name of the previous button — its visible content is a symbol, which is not a name.',
      type: 'string',
      default: "'Previous page'",
    },
    {
      title: 'nextAriaLabel',
      description: 'Accessible name of the next button.',
      type: 'string',
      default: "'Next page'",
    },
    {
      title: 'firstAriaLabel',
      description: 'Accessible name of the first-page button.',
      type: 'string',
      default: "'First page'",
    },
    {
      title: 'lastAriaLabel',
      description: 'Accessible name of the last-page button.',
      type: 'string',
      default: "'Last page'",
    },
    {
      title: 'maxPages',
      description: 'Maximum number of pages to display (0 for dynamic calculation)',
      type: 'number',
      default: '0',
    },
  ],
  slots: [
    {
      title: 'Navigation slots (#first, #previous, #next, #last)',
      description: 'Custom content for navigation buttons',
      preview: `<DuPagination
  :modelValue="2"
  :total="100"
  :perPage="10"
  showFirst
  showLast
>
  <template #first>First</template>
  <template #previous>Prev</template>
  <template #next>Next</template>
  <template #last>Last</template>
</DuPagination>`,
      code: `<DuPagination
  v-model="page"
  :total="100"
  :perPage="10"
  showFirst
  showLast
>
  <template #first>First</template>
  <template #previous>Prev</template>
  <template #next>Next</template>
  <template #last>Last</template>
</DuPagination>`,
    },
    {
      title: 'Page slots (#page-{n})',
      description: 'Custom content for specific page buttons',
      preview: `<DuPagination :modelValue="5" :total="100" :perPage="10">
  <template #page-1>One</template>
  <template #page-2>Two</template>
</DuPagination>`,
      code: `<DuPagination v-model="page" :total="100" :perPage="10">
  <template #page-1>One</template>
  <template #page-2>Two</template>
</DuPagination>`,
    },
    {
      title: 'Manual mode (default slot)',
      description: 'Full control over pagination button layout',
      preview: `<DuPagination
  :modelValue="page"
  :total="100"
  :perPage="10"
  :manual="true"
  @update:modelValue="page = $event"
>
  <button class="join-item btn" :disabled="page <= 1" @click="page = 1">««</button>
  <button class="join-item btn" :disabled="page <= 1" @click="page--">«</button>
  <button class="join-item btn" :class="{ 'btn-active': page === 1 }" @click="page = 1">1</button>
  <button class="join-item btn" :class="{ 'btn-active': page === 2 }" @click="page = 2">2</button>
  <button class="join-item btn" :class="{ 'btn-active': page === 3 }" @click="page = 3">3</button>
  <button class="join-item btn" :disabled="page >= 3" @click="page++">»</button>
  <button class="join-item btn" :disabled="page >= 3" @click="page = 3">»»</button>
</DuPagination>`,
      code: `<DuPagination
  v-model="page"
  :total="100"
  :perPage="10"
  :manual="true"
>
  <button class="join-item btn" :disabled="page <= 1" @click="page = 1">««</button>
  <button class="join-item btn" :disabled="page <= 1" @click="page--">«</button>
  <button class="join-item btn" :class="{ 'btn-active': page === 1 }" @click="page = 1">1</button>
  <button class="join-item btn" :class="{ 'btn-active': page === 2 }" @click="page = 2">2</button>
  <button class="join-item btn" :class="{ 'btn-active': page === 3 }" @click="page = 3">3</button>
  <button class="join-item btn" :disabled="page >= 3" @click="page++">»</button>
  <button class="join-item btn" :disabled="page >= 3" @click="page = 3">»»</button>
</DuPagination>`,
    },
  ],
  sections: [
    {
      title: 'Basic',
      description: 'Without `v-model` the pagination keeps its own page — click away. Bind `v-model` as soon as something else needs to know the page.',
      preview: `<DuPagination :total="100" :perPage="10" />`,
      code: `<script setup lang="ts">
import { ref } from 'vue'
const page = ref(1)
</script>

<template>
  <DuPagination v-model="page" :total="100" :perPage="10" />
</template>`,
    },
    {
      title: 'Controlled or not',
      description: 'Pass `modelValue` (or `v-model`) and the page is yours: a click only emits `update:modelValue`, and nothing moves until the prop does — so you can refuse a change, or keep the page in the URL. Leave it out and the component owns the page. A static `:modelValue` with no listener therefore never moves.',
      script: `
      const page = ref(2)
      return { page }
      `,
      preview: `<div class="flex flex-col items-center gap-3">
  <DuPagination v-model="page" :total="60" :perPage="10" />
  <span class="text-sm text-base-content/60">page = {{ page }}</span>
</div>`,
      code: `<!-- controlled: the page lives in your state (or the URL) -->
<DuPagination v-model="page" :total="60" :perPage="10" />

<!-- uncontrolled: the component keeps it -->
<DuPagination :total="60" :perPage="10" @update:modelValue="track" />`,
    },
    {
      title: 'Without navigation buttons',
      description: 'Show only page numbers',
      preview: `<DuPagination
  :modelValue="2"
  :total="100"
  :perPage="10"
  :showNext="false"
  :showPrevious="false"
/>`,
      code: `<DuPagination
  v-model="page"
  :total="100"
  :perPage="10"
  :showNext="false"
  :showPrevious="false"
/>`,
    },
    {
      title: 'With first/last buttons',
      preview: `<DuPagination :modelValue="5" :total="250" :perPage="10" showFirst showLast variant="primary" />`,
      code: `<DuPagination
  v-model="page"
  :total="250"
  :perPage="10"
  showFirst
  showLast
  variant="primary"
/>`,
    },
    {
      title: 'With ellipsis',
      description: 'Use maxPages to limit visible pages with ellipsis',
      preview: `<DuPagination :modelValue="6" :total="500" :perPage="10" showFirst showLast showEllipsis :maxPages="5" variant="primary" />`,
      code: `<DuPagination
  v-model="page"
  :total="500"
  :perPage="10"
  showFirst
  showLast
  showEllipsis
  :maxPages="5"
  variant="primary"
/>`,
    },
    {
      title: 'Naming the buttons and the landmark',
      description: '`nextLabel` and friends are the **visible** symbols; `nextAriaLabel` and friends are what a screen reader reads. Keep them in step — if you change « » to "Older" / "Newer", change the aria labels too, or voice control and the visible text stop matching. `ariaLabel` names the `<nav>` itself, which matters on a page with several.',
      preview: `<DuPagination
  :modelValue="2"
  :total="50"
  :perPage="10"
  showFirst
  showLast
  ariaLabel="Search results pages"
  previousAriaLabel="Previous results"
  nextAriaLabel="Next results"
/>`,
      code: `<DuPagination
  v-model="page"
  :total="250"
  :perPage="10"
  showFirst
  showLast
  ariaLabel="Search results pages"
  previousLabel="Older"
  nextLabel="Newer"
  previousAriaLabel="Older results"
  nextAriaLabel="Newer results"
/>`,
    },
    {
      title: 'Custom labels',
      description: 'Use text labels instead of symbols',
      preview: `<DuPagination
  :modelValue="3"
  :total="100"
  :perPage="10"
  previousLabel="Previous"
  nextLabel="Next"
  showFirst
  showLast
  firstLabel="First"
  lastLabel="Last"
/>`,
      code: `<DuPagination
  v-model="page"
  :total="100"
  :perPage="10"
  previousLabel="Previous"
  nextLabel="Next"
  showFirst
  showLast
  firstLabel="First"
  lastLabel="Last"
/>`,
    },
    {
      title: 'Variants',
      preview: `<div class="flex flex-col gap-3 items-start">
  <DuPagination :modelValue="2" :total="100" :perPage="10" variant="primary" />
  <DuPagination :modelValue="2" :total="100" :perPage="10" variant="secondary" />
  <DuPagination :modelValue="2" :total="100" :perPage="10" variant="accent" />
  <DuPagination :modelValue="2" :total="100" :perPage="10" variant="success" />
</div>`,
      code: `<DuPagination v-model="page" :total="100" :perPage="10" variant="primary" />
<DuPagination v-model="page" :total="100" :perPage="10" variant="secondary" />`,
    },
    {
      title: 'Outline style',
      preview: `<DuPagination
  :modelValue="2"
  :total="100"
  :perPage="10"
  variant="primary"
  outline
/>`,
      code: `<DuPagination
  v-model="page"
  :total="100"
  :perPage="10"
  variant="primary"
  outline
/>`,
    },
    {
      title: 'Soft style',
      preview: `<DuPagination
  :modelValue="2"
  :total="100"
  :perPage="10"
  variant="primary"
  soft
/>`,
      code: `<DuPagination
  v-model="page"
  :total="100"
  :perPage="10"
  variant="primary"
  soft
/>`,
    },
    {
      title: 'Sizes',
      preview: `<div class="flex flex-col gap-3 items-start">
  <DuPagination :modelValue="2" :total="100" :perPage="10" size="xs" />
  <DuPagination :modelValue="2" :total="100" :perPage="10" size="sm" />
  <DuPagination :modelValue="2" :total="100" :perPage="10" size="md" />
  <DuPagination :modelValue="2" :total="100" :perPage="10" size="lg" />
</div>`,
      code: `<DuPagination v-model="page" :total="100" :perPage="10" size="xs" />
<DuPagination v-model="page" :total="100" :perPage="10" size="sm" />
<DuPagination v-model="page" :total="100" :perPage="10" size="md" />
<DuPagination v-model="page" :total="100" :perPage="10" size="lg" />`,
    },
    {
      title: 'Fixed page count',
      description: 'Use maxPages to always show a specific number of page buttons',
      preview: `<DuPagination
  :modelValue="3"
  :total="500"
  :perPage="10"
  :maxPages="5"
/>`,
      code: `<DuPagination
  v-model="page"
  :total="500"
  :perPage="10"
  :maxPages="5"
/>`,
    },
  ],
} satisfies DocPageData
