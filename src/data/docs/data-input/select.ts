import type { DocPageData } from '@/types/docs'

export default {
  title: 'Select',
  description: 'Select is a custom dropdown for picking a single or multiple values from a list of options.',
  category: 'Data Input',
  source: 'https://daisyui.com/components/select/',
  props: [
    {
      title: 'options',
      description: 'Array of options (strings or objects)',
      type: '(string | object)[]',
      required: true,
    },
    {
      title: 'modelValue',
      description: 'Selected value(s)',
      type: 'any',
    },
    {
      title: 'multiple',
      description: 'Allow selecting multiple values',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'placeholder',
      description: 'Placeholder text when nothing is selected',
      type: 'string',
      default: '"Choisissez..."',
    },
    {
      title: 'searchable',
      description: 'Enable search input above dropdown',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'searchableInside',
      description: 'Enable search input inside dropdown',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'checkboxes',
      description: 'Show checkboxes for multi-select options',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'closeOnSelect',
      description: 'Close dropdown after selecting (single select only)',
      type: 'boolean',
      default: 'true',
    },
    {
      title: 'trackBy',
      description: 'Property name to use as value for object options',
      type: 'string',
      default: '"id"',
    },
    {
      title: 'labelBy',
      description: 'Property name to use as label for object options',
      type: 'string',
      default: '"name"',
    },
    {
      title: 'returnObject',
      description: 'Return full object instead of just the trackBy value',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'clearable',
      description: 'Show a clear button to deselect (single) or clear all (multiple)',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'ghost',
      description: 'Use ghost/transparent style',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'variant',
      description: 'Color variant',
      type: 'string',
      options: ['default', 'primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error'],
    },
    {
      title: 'size',
      description: 'Size of the select',
      type: 'string',
      default: '"default"',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      title: 'disabled',
      description: 'Disable the select',
      type: 'boolean',
      default: 'false',
    },
  ],
  slots: [
    {
      title: 'Slot #selected',
      description: 'Custom display for selected value (single select)',
      preview: `<DuSelect
  :modelValue="{ id: 1, name: 'Vue' }"
  :options="[
    { id: 1, name: 'Vue' },
    { id: 2, name: 'React' },
    { id: 3, name: 'Angular' },
  ]"
  trackBy="id"
  labelBy="name"
  placeholder="Choose..."
  class="w-72"
>
  <template #selected="{ selected }">
    <span v-if="selected" class="text-primary flex-1">{{ selected.name }}</span>
    <span v-else class="text-base-content/50 flex-1">Choose...</span>
  </template>
</DuSelect>`,
      code: `<DuSelect v-model="selected" :options="options">
  <template #selected="{ selected }">
    <span v-if="selected" class="text-primary">{{ selected.name }}</span>
    <span v-else>Choose...</span>
  </template>
</DuSelect>`,
    },
    {
      title: 'Slot #option',
      description: 'Custom display for dropdown options with slot props: option, index',
      preview: `<DuSelect
  :options="[
    { id: 1, name: 'Vue', active: true },
    { id: 2, name: 'React', active: false },
    { id: 3, name: 'Angular', active: true },
  ]"
  trackBy="id"
  labelBy="name"
  placeholder="Choose..."
  class="w-72"
>
  <template #option="{ option }">
    <span class="flex items-center gap-2">
      <span class="w-2 h-2 rounded-full" :class="option.active ? 'bg-success' : 'bg-base-300'"></span>
      {{ option.name }}
    </span>
  </template>
</DuSelect>`,
      code: `<DuSelect v-model="selected" :options="options">
  <template #option="{ option, index }">
    <span class="text-primary">{{ option.name }}</span>
  </template>
</DuSelect>`,
    },
    {
      title: 'Slot #tag',
      description: 'Custom display for selected tags (multi-select) with slot props: value, index',
      preview: `<DuSelect
  :modelValue="[1, 2]"
  :options="[
    { id: 1, name: 'Vue' },
    { id: 2, name: 'React' },
    { id: 3, name: 'Angular' },
  ]"
  trackBy="id"
  labelBy="name"
  multiple
  placeholder="Select..."
  class="w-72"
>
  <template #tag="{ value, index }">
    <span class="badge badge-primary badge-sm">{{ value.name }}</span>
  </template>
</DuSelect>`,
      code: `<DuSelect v-model="selected" :options="options" multiple>
  <template #tag="{ value, index }">
    <span class="badge badge-primary badge-sm">{{ value.name }}</span>
  </template>
</DuSelect>`,
    },
    {
      title: 'Slot #no-options',
      description: 'Content shown when no options match search',
      preview: `<DuSelect
  :options="[
    { id: 1, name: 'Vue' },
    { id: 2, name: 'React' },
  ]"
  trackBy="id"
  labelBy="name"
  searchable
  placeholder="Type something that doesn't match..."
  class="w-72"
>
  <template #no-options>
    <span class="text-error">No results found</span>
  </template>
</DuSelect>`,
      code: `<DuSelect v-model="selected" :options="options" searchable>
  <template #no-options>
    <span class="text-error">No results found</span>
  </template>
</DuSelect>`,
    },
  ],
  classnames: {
    style: [
      { class: 'select-ghost', desc: 'Transparent ghost style' },
    ],
    color: [
      { class: 'select-primary', desc: 'Primary border on focus' },
      { class: 'select-secondary', desc: 'Secondary border' },
      { class: 'select-accent', desc: 'Accent border' },
      { class: 'select-error', desc: 'Error state' },
      { class: 'select-success', desc: 'Success state' },
    ],
    size: [
      { class: 'select-xs', desc: 'Extra small' },
      { class: 'select-sm', desc: 'Small' },
      { class: 'select-md', desc: 'Medium', default: true },
      { class: 'select-lg', desc: 'Large' },
      { class: 'select-xl', desc: 'Extra large' },
    ],
  },
  sections: [
    {
      title: 'Basic (string options)',
      links: [
        { label: 'Vue v-model docs', href: 'https://vuejs.org/guide/components/v-model.html' },
      ],
      preview: `<DuSelect
  :options="['Apple', 'Banana', 'Cherry']"
  placeholder="Choose a fruit"
  class="w-72"
/>`,
      code: `<script setup lang="ts">
import { ref } from 'vue'
const selected = ref(null)
</script>

<template>
  <DuSelect
    v-model="selected"
    :options="['Apple', 'Banana', 'Cherry']"
    placeholder="Choose a fruit"
  />
</template>`,
    },
    {
      title: 'Object options',
      description: 'Use `trackBy` to specify which property is used as value, and `labelBy` for the display text.',
      preview: `<DuSelect
  :options="[
    { id: 1, name: 'Vue' },
    { id: 2, name: 'React' },
    { id: 3, name: 'Angular' },
  ]"
  trackBy="id"
  labelBy="name"
  placeholder="Choose a framework"
  class="w-72"
/>`,
      code: `<script setup lang="ts">
import { ref } from 'vue'

const frameworks = [
  { id: 1, name: 'Vue' },
  { id: 2, name: 'React' },
  { id: 3, name: 'Angular' },
]
const selected = ref(null) // will hold the id (trackBy value)
</script>

<template>
  <DuSelect
    v-model="selected"
    :options="frameworks"
    trackBy="id"
    labelBy="name"
    placeholder="Choose a framework"
  />
</template>`,
    },
    {
      title: 'Return full object',
      description: 'By default, `v-model` receives only the `trackBy` value (e.g. the id). Set `returnObject` to get the full option object instead.',
      preview: `<DuSelect
  :options="[
    { id: 1, name: 'Vue', color: 'green' },
    { id: 2, name: 'React', color: 'blue' },
    { id: 3, name: 'Angular', color: 'red' },
  ]"
  trackBy="id"
  labelBy="name"
  returnObject
  placeholder="Choose a framework"
  class="w-72"
/>`,
      code: `<DuSelect
  v-model="selectedItem"
  :options="items"
  trackBy="id"
  labelBy="name"
  returnObject
/>
<!-- selectedItem will be the full object, not just the id -->`,
    },
    {
      title: 'Multi-select',
      preview: `<DuSelect
  :options="['Vue', 'React', 'Angular', 'Svelte']"
  multiple
  placeholder="Select frameworks..."
  class="w-72"
/>`,
      code: `<DuSelect
  v-model="selectedTags"
  :options="tags"
  multiple
  trackBy="id"
  labelBy="name"
  placeholder="Select tags..."
/>`,
    },
    {
      title: 'Multi-select with checkboxes',
      preview: `<DuSelect
  :options="['Vue', 'React', 'Angular', 'Svelte']"
  multiple
  checkboxes
  placeholder="Select frameworks..."
  class="w-72"
/>`,
      code: `<DuSelect
  v-model="selectedTags"
  :options="tags"
  multiple
  checkboxes
  trackBy="id"
  labelBy="name"
  placeholder="Select tags..."
/>`,
    },
    {
      title: 'Searchable',
      preview: `<DuSelect
  :options="['Apple', 'Banana', 'Cherry', 'Grape', 'Mango', 'Orange']"
  searchable
  placeholder="Choose a fruit"
  class="w-72"
/>`,
      code: `<!-- Search field above the dropdown -->
<DuSelect
  v-model="selected"
  :options="countries"
  searchable
  trackBy="code"
  labelBy="name"
  placeholder="Choose a country"
/>

<!-- Search field inside the dropdown -->
<DuSelect
  v-model="selected"
  :options="countries"
  searchableInside
  trackBy="code"
  labelBy="name"
  placeholder="Choose a country"
/>`,
    },
    {
      title: 'Clearable',
      description: 'Add `clearable` to show an ✕ button that clears the selection. For multi-select, it clears all selected values at once.',
      preview: `<div class="flex flex-col gap-2 w-72">
  <DuSelect :options="['Apple', 'Banana', 'Cherry']" clearable placeholder="Choose a fruit" />
  <DuSelect :options="['Apple', 'Banana', 'Cherry']" multiple clearable placeholder="Select fruits..." />
</div>`,
      code: `<!-- Single clearable -->
<DuSelect v-model="selected" :options="options" clearable placeholder="Choose..." />

<!-- Multi-select clearable -->
<DuSelect v-model="selected" :options="options" multiple clearable placeholder="Select..." />`,
    },
    {
      title: 'Sizes',
      preview: `<div class="flex flex-col gap-2 w-72">
  <DuSelect :options="['Apple', 'Banana']" size="xs" placeholder="XSmall" />
  <DuSelect :options="['Apple', 'Banana']" size="sm" placeholder="Small" />
  <DuSelect :options="['Apple', 'Banana']" placeholder="Medium" />
  <DuSelect :options="['Apple', 'Banana']" size="lg" placeholder="Large" />
</div>`,
      code: `<DuSelect v-model="val" :options="opts" size="xs" />
<DuSelect v-model="val" :options="opts" size="sm" />
<DuSelect v-model="val" :options="opts" />
<DuSelect v-model="val" :options="opts" size="lg" />`,
    },
    {
      title: 'Variants',
      preview: `<div class="flex flex-col gap-2 w-72">
  <DuSelect :options="['Apple', 'Banana']" variant="primary" placeholder="Primary" />
  <DuSelect :options="['Apple', 'Banana']" variant="success" placeholder="Success" />
  <DuSelect :options="['Apple', 'Banana']" variant="error" placeholder="Error" />
</div>`,
      code: `<DuSelect v-model="val" :options="opts" variant="primary" />
<DuSelect v-model="val" :options="opts" variant="success" />
<DuSelect v-model="val" :options="opts" variant="error" />`,
    },
  ],
} satisfies DocPageData
