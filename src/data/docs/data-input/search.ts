import type { DocPageData } from '@/types/docs'

export default {
  title: 'Search',
  description: 'Search input with optional autocomplete suggestions. Supports single/multiple selection and adding new options.',
  category: 'Data Input',
  source: 'https://daisyui.com/components/input/',
  props: [
    {
      title: 'modelValue',
      description: 'Selected value(s)',
      type: 'SearchOption | SearchOption[]',
    },
    {
      title: 'listValues',
      description: 'Array of options for autocomplete',
      type: 'SearchOption[]',
      required: true,
    },
    {
      title: 'placeholder',
      description: 'Placeholder text',
      type: 'string',
    },
    {
      title: 'limit',
      description: 'Maximum number of suggestions to show',
      type: 'number',
    },
    {
      title: 'addOption',
      description: 'Allow adding new options not in listValues',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'multiple',
      description: 'Allow selecting multiple values. In multiple mode, clicking a selected item in the dropdown deselects it.',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'clearable',
      description: 'Show a ✕ on selected options in the dropdown. In single mode, also enables deselection by clicking.',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'size',
      description: 'Size of the search input',
      type: 'string',
      default: '"default"',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      title: 'variant',
      description: 'Color variant',
      type: 'string',
      options: ['default', 'primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error'],
    },
    {
      title: 'ghost',
      description: 'Use ghost/transparent style',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'disabled',
      description: 'Disable the search input',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'id',
      description: 'ID for the input element',
      type: 'string',
    },
    {
      title: 'name',
      description: 'Name attribute for the input',
      type: 'string',
    },
    {
      title: 'type',
      description: 'Input type',
      type: 'string',
      default: '"text"',
    },
    {
      title: 'required',
      description: 'Mark as required field',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'pattern',
      description: 'Validation pattern',
      type: 'string',
    },
  ],
  slots: [
    {
      title: 'Slot #option',
      description: 'Custom display for dropdown options with slot props: option, index',
      preview: `<DuSearch
  name="search"
  id="search-option"
  :listValues="[
    { id: 1, name: 'Alice Martin' },
    { id: 2, name: 'Bob Smith' },
    { id: 3, name: 'Charlie Brown' },
  ]"
  placeholder="Search..."
  class="w-72"
>
  <template #option="{ option }">
    <span class="flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-base-300"></span>
      {{ option.name }}
    </span>
  </template>
</DuSearch>`,
      code: `<DuSearch v-model="selected" :listValues="listValues">
  <template #option="{ option, index }">
    <span class="text-primary">{{ option.name }}</span>
  </template>
</DuSearch>`,
    },
    {
      title: 'Slot #add-option',
      description: 'Custom display for the "add new option" item with slot props: query',
      preview: `<DuSearch
  name="search"
  id="search-add"
  :listValues="[
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ]"
  :addOption="true"
  placeholder="Search or add..."
  class="w-72"
>
  <template #add-option="{ query }">
    <span class="flex items-center gap-2 text-success">
      <span>+</span>
      Add "{{ query }}"
    </span>
  </template>
</DuSearch>`,
      code: `<DuSearch v-model="selected" :listValues="listValues" :addOption="true">
  <template #add-option="{ query }">
    <span class="text-success">Add "{{ query }}"</span>
  </template>
</DuSearch>`,
    },
    {
      title: 'Slot #no-results',
      description: 'Content shown when no results match query',
      preview: `<DuSearch
  name="search"
  id="search-no-results"
  :listValues="[
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ]"
  placeholder="Type something that doesn't match..."
  class="w-72"
>
  <template #no-results>
    <span class="text-error">No results found</span>
  </template>
</DuSearch>`,
      code: `<DuSearch v-model="selected" :listValues="listValues">
  <template #no-results>
    <span class="text-error">No results found</span>
  </template>
</DuSearch>`,
    },
  ],
  sections: [
    {
      title: 'Basic',
      links: [
        { label: 'Vue v-model docs', href: 'https://vuejs.org/guide/components/v-model.html' },
      ],
      preview: `<DuSearch name="search" id="search-input" placeholder="Search..." class="w-72" :listValues="[]" />`,
      code: `<script setup lang="ts">
import { ref } from 'vue'
const query = ref(null)
</script>

<template>
  <DuSearch v-model="query" placeholder="Search..." :listValues="[]" />
</template>`,
    },
    {
      title: 'With autocomplete list',
      preview: `<DuSearch
  name="author"
  id="author-search"
  placeholder="Search author..."
  :listValues="[
    { id: 1, name: 'Alice Martin' },
    { id: 2, name: 'Bob Smith' },
    { id: 3, name: 'Charlie Brown' },
  ]"
  :limit="5"
  class="w-72"
/>`,
      code: `<DuSearch
  v-model="author"
  name="author"
  id="author-search"
  placeholder="Search author..."
  :listValues="[
    { id: 1, name: 'Alice Martin' },
    { id: 2, name: 'Bob Smith' },
    { id: 3, name: 'Charlie Brown' },
  ]"
  :limit="5"
/>`,
    },
    {
      title: 'Variant and size',
      preview: `<DuSearch name="search" id="search-lg" variant="primary" size="lg" placeholder="Search..." class="w-72" :listValues="[]" />`,
      code: `<DuSearch v-model="query" variant="primary" size="lg" placeholder="Search..." />`,
    },
    {
      title: 'Multiple selection',
      description: 'Set `multiple` to allow selecting more than one value. Selected values appear as tags. Clicking a selected item in the dropdown deselects it. Press Backspace to remove the last selected value.',
      preview: `<DuSearch
  name="tags"
  id="tags-search"
  multiple
  placeholder="Select tags..."
  :listValues="[
    { id: 1, name: 'Vue' },
    { id: 2, name: 'React' },
    { id: 3, name: 'TypeScript' },
    { id: 4, name: 'Tailwind' },
  ]"
  class="w-72"
/>`,
      code: `<script setup lang="ts">
import { ref } from 'vue'
const selectedTags = ref([])
</script>

<template>
  <DuSearch
    v-model="selectedTags"
    name="tags"
    id="tags-search"
    multiple
    placeholder="Select tags..."
    :listValues="[
      { id: 1, name: 'Vue' },
      { id: 2, name: 'React' },
      { id: 3, name: 'TypeScript' },
    ]"
  />
</template>`,
    },
    {
      title: 'Clearable',
      description: 'Add `clearable` to display a ✕ on selected options in the dropdown. In single mode, this also enables click-to-deselect. In multiple mode, deselection by click is always active — `clearable` only adds the visual ✕ indicator.',
      preview: `<div class="flex flex-col gap-2 w-72">
  <DuSearch
    name="fruit"
    id="search-clearable"
    clearable
    placeholder="Search a fruit..."
    :listValues="[
      { id: 1, name: 'Apple' },
      { id: 2, name: 'Banana' },
      { id: 3, name: 'Cherry' },
    ]"
  />
  <DuSearch
    name="tags"
    id="search-clearable-multiple"
    multiple
    clearable
    placeholder="Select tags..."
    :listValues="[
      { id: 1, name: 'Vue' },
      { id: 2, name: 'React' },
      { id: 3, name: 'TypeScript' },
    ]"
  />
</div>`,
      code: `<!-- Single clearable -->
<DuSearch v-model="selected" name="fruit" id="fruit" clearable :listValues="fruits" />

<!-- Multiple clearable -->
<DuSearch v-model="selected" name="tags" id="tags" multiple clearable :listValues="tags" />`,
    },
    {
      title: 'Add new option',
      description: 'Set `addOption` to allow creating values not present in `listValues`. The `#add-option` slot customizes how the "add" row appears. The `@add` event fires with `{ id: null, name: query }` — assign a real id in the handler before pushing to the list.',
      links: [
        { label: 'Vue named slots docs', href: 'https://vuejs.org/guide/components/slots.html#named-slots' },
      ],
      script: `
      const listValues = ref([
        { id: 1, name: 'Vue' },
        { id: 2, name: 'React' },
      ])
      const selected = ref(null)
      function onAdd(newOption) {
        listValues.value.push({ id: listValues.value.length + 1, name: newOption.name })
      }
      return { listValues, selected, onAdd }`,
      preview: `<DuSearch
  id="search-add"
  name="framework"
  v-model="selected"
  :addOption="true"
  :listValues="listValues"
  placeholder="Select Tech..."
  @add="onAdd"
>
  <template #add-option="{ query }">
    <span class="flex items-center gap-2 text-success">
      <span>+</span> Add "{{ query }}"
    </span>
  </template>
</DuSearch>`,
      code: `<script setup lang="ts">
const listValues = ref([
  { id: 1, name: 'Vue' },
  { id: 2, name: 'React' },
])
const selected = ref(null)

function onAdd(newOption: { id: null; name: string }) {
  listValues.value.push({ id: listValues.value.length + 1, name: newOption.name })
}
</script>

<template>
  <DuSearch
    id="search-fw"
    name="framework"
    v-model="selected"
    :addOption="true"
    placeholder="Select Tech..."
    :listValues="listValues"
    @add="onAdd"
  >
    <template #add-option="{ query }">
      <span class="flex items-center gap-2 text-success">
        <span>+</span> Add "{{ query }}"
      </span>
    </template>
  </DuSearch>
</template>`,
    },
  ],
} satisfies DocPageData
