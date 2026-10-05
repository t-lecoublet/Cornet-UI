import type { DocPageData } from '@/types/docs'

export default {
  title: 'Search',
  description: 'Search is a text field with autocomplete: you type, it filters, you pick. It shares the WAI-ARIA combobox engine with DuSelect — the difference is that the query lives in the field itself, and a query with no match can become a new option.',
  category: 'Data Input',
  source: 'https://daisyui.com/components/input/',
  props: [
    {
      title: 'options',
      description: 'The options to filter — objects of any shape, or strings. The component is generic over them, so your own fields survive into the slots and the emit payloads. Renamed from `listValues`.',
      type: 'O[]',
    },
    {
      title: 'modelValue',
      description: 'The selection: whole options by default (`returnObject` is on), an array in `multiple` mode.',
      type: 'O | O[] | null',
    },
    {
      title: 'multiple',
      description: 'Allow selecting several options. Multiple mode renders chips plus an input, rather than joining labels with commas inside one text field. Typing a comma still validates the segment before it.',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'placeholder',
      description: 'Placeholder text.',
      type: 'string',
    },
    {
      title: 'resultsLimit',
      description: 'Cap how many results are shown. Renamed from `limit`.',
      type: 'number',
    },
    {
      title: 'externalFilter',
      description: 'Skip local filtering — `options` already are the search result. Listen to `@query` and refill them yourself. Renamed from `remoteSearch`.',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'creatable',
      description: 'Offer an "Add «query»" entry when nothing matches exactly. It no longer appears when an option already carries that exact label. Renamed from `addOption`.',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'createOptionText',
      description: 'Prefix of the creatable entry. Renamed from `addOptionText`.',
      type: 'string',
      default: "'Add'",
    },
    {
      title: 'createOption',
      description: 'Build the option to create from the query yourself. Defaults to `{ [trackBy]: null, [labelBy]: query }`.',
      type: '(query: string) => O',
    },
    {
      title: 'commitOnClose',
      description: 'What to do with a query still in the field when the dropdown closes (single mode). `none` (default) discards it; `match` keeps it only if it matches an option exactly; `auto` takes the first result. Replaces `autoCommit` — `autoCommit: true` becomes `commitOnClose="auto"`. Emptying the field and leaving still clears the selection in every mode.',
      type: 'DuSearchCommitMode',
      default: "'none'",
      options: ['none', 'match', 'auto'],
    },
    {
      title: 'clearable',
      description: 'Single mode: picking the selected option again clears it, and the selected row shows a ✕.',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'closeOnSelect',
      description: '`null` (the default) means "close in single mode, stay open in multiple".',
      type: 'boolean | null',
      default: 'null',
    },
    {
      title: 'closeOnClickOutside',
      description: 'Close when a press lands outside the field.',
      type: 'boolean',
      default: 'true',
    },
    {
      title: 'selectOnTab',
      description: 'Tab selects the highlighted option before leaving the field.',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'popover',
      description: 'Render the dropdown in the top layer (Popover API + CSS anchor positioning), so an `overflow: hidden` ancestor cannot clip it.',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'trackBy',
      description: 'Object key identifying an option. Falls back to `value`, then `id`, then the option itself.',
      type: 'string',
    },
    {
      title: 'labelBy',
      description: 'Object key displayed for an option. Falls back to `label`, then `name`, then `String(option)`. It now applies to filtering and to the comma parsing too — both used to be hardcoded to `name`.',
      type: 'string',
    },
    {
      title: 'optionValue',
      description: 'Full control over the value stored in the model: `(option) => value`. Takes precedence over `trackBy` and `returnObject`.',
      type: '(option: O) => V',
    },
    {
      title: 'optionLabel',
      description: 'Full control over the displayed label: `(option) => string`. Takes precedence over `labelBy`.',
      type: '(option: O) => string',
    },
    {
      title: 'optionFilter',
      description: 'Custom filter: `(option, query) => boolean`. Defaults to a case-insensitive substring match on the label.',
      type: '(option: O, query: string) => boolean',
    },
    {
      title: 'optionDisabled',
      description: 'Which options cannot be picked. Defaults to `option.disabled === true`. Disabled options are skipped by the keyboard, marked `aria-disabled`, and inert on click.',
      type: '(option: O) => boolean',
    },
    {
      title: 'returnObject',
      description: 'Emit whole options (the default here) instead of their `trackBy` value.',
      type: 'boolean',
      default: 'true',
    },
    {
      title: 'noResultsText',
      description: 'Shown when no option matches the query.',
      type: 'string',
      default: "'No results'",
    },
    {
      title: 'readonly',
      description: 'Focusable and readable, but cannot open or change.',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'required',
      description: 'Requires a selection. Validation only — there is no native form constraint behind a custom combobox.',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'minSelected',
      description: 'Multiple mode: minimum number of selected options, reported as a validation error.',
      type: 'number',
    },
    {
      title: 'maxSelected',
      description: 'Multiple mode: maximum number of selected options. Selecting more is blocked.',
      type: 'number',
    },
    {
      title: 'errorMessages',
      description: 'The validation messages, by code (`required`, `minlength`, `maxlength`). There is no default wording — a library cannot guess your language — so without them a failing field only turns red.',
      type: 'Partial<Record<DuSearchErrorCode, string>>',
    },
    {
      title: 'ariaLabel',
      description: 'Accessible name of the field, when no visible label names it.',
      type: 'string',
    },
    {
      title: 'ariaLabelledby',
      description: 'id of the element that names the field.',
      type: 'string',
    },
    {
      title: 'removeItemLabel',
      description: "Accessible label of a chip's remove button (multiple mode).",
      type: 'string',
      default: "'Remove'",
    },
    {
      title: 'id',
      description: 'Base id for the ARIA wiring. **No longer required** — it defaults to `useId()`, so a server render and a client render agree.',
      type: 'string',
    },
    {
      title: 'name',
      description: 'Native `name` attribute. **No longer required.**',
      type: 'string',
    },
    {
      title: 'type',
      description: 'Native input type.',
      type: 'string',
      default: '"text"',
    },
    {
      title: 'pattern',
      description: 'Native validation pattern.',
      type: 'string',
    },
    {
      title: 'size',
      description: 'Size of the field',
      type: 'string',
      default: '"default"',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      title: 'subSize',
      description: 'Size of the dropdown list. Defaults to `size`.',
      type: 'string',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      title: 'variant',
      description: 'Color variant',
      type: 'string',
      options: ['default', 'neutral', 'primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error'],
    },
    {
      title: 'ghost',
      description: 'Use ghost/transparent style',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'disabled',
      description: 'Disable the field.',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'customClass',
      description: 'Additional CSS classes on the field.',
      type: 'string',
    },
  ],
  slots: [
    {
      title: 'Slot #option',
      description: 'Custom display for a dropdown option. Scope: `{ option, index, selected, highlighted, disabled }` — the three booleans let you style a row without comparing indexes yourself.',
      preview: `<DuSearch
  ariaLabel="Person"
  :options="[
    { id: 1, name: 'Alice Martin' },
    { id: 2, name: 'Bob Smith' },
    { id: 3, name: 'Charlie Brown' },
  ]"
  placeholder="Search..."
  class="w-72"
>
  <template #option="{ option, selected }">
    <span class="flex items-center gap-2">
      <span class="w-2 h-2 rounded-full" :class="selected ? 'bg-primary' : 'bg-base-300'"></span>
      {{ option.name }}
    </span>
  </template>
</DuSearch>`,
      code: `<DuSearch v-model="selected" :options="options">
  <template #option="{ option, selected, highlighted }">
    <span :class="{ 'font-semibold': selected }">{{ option.name }}</span>
  </template>
</DuSearch>`,
    },
    {
      title: 'Slot #create-option',
      description: 'Custom display for the "add new option" row. Scope: `{ query }`. Renamed from `#add-option`.',
      preview: `<DuSearch
  ariaLabel="Framework"
  :options="[
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ]"
  creatable
  placeholder="Search or add..."
  class="w-72"
>
  <template #create-option="{ query }">
    <span class="flex items-center gap-2 text-success">
      <span>+</span>
      Add "{{ query }}"
    </span>
  </template>
</DuSearch>`,
      code: `<DuSearch v-model="selected" :options="options" creatable>
  <template #create-option="{ query }">
    <span class="text-success">Add "{{ query }}"</span>
  </template>
</DuSearch>`,
    },
    {
      title: 'Slot #no-options',
      description: 'Content shown when nothing matches the query. Scope: `{ query }`. Renamed from `#no-results`.',
      preview: `<DuSearch
  ariaLabel="Person"
  :options="[
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ]"
  placeholder="Type something that doesn't match..."
  class="w-72"
>
  <template #no-options="{ query }">
    <span class="text-error">Nothing matches "{{ query }}"</span>
  </template>
</DuSearch>`,
      code: `<DuSearch v-model="selected" :options="options">
  <template #no-options="{ query }">
    <span class="text-error">Nothing matches "{{ query }}"</span>
  </template>
</DuSearch>`,
    },
    {
      title: 'Slot #tag',
      description: 'Custom display for a selected chip (multiple mode). Scope: `{ option, value, index, remove }` — `remove()` is pre-wired to unselect it.',
      code: `<DuSearch v-model="tags" :options="options" multiple>
  <template #tag="{ option, remove }">
    <span class="badge badge-primary badge-sm gap-1">
      {{ option?.name }}
      <button type="button" @click.stop="remove">✕</button>
    </span>
  </template>
</DuSearch>`,
    },
    {
      title: 'Slot #error',
      description: 'Replaces the validation message under the field. Scope: `{ errors, message }`. Nothing is rendered until the field has been visited.',
      code: `<DuSearch v-model="author" :options="options" required>
  <template #error="{ message }">
    <p class="text-error text-xs mt-1">⚠ {{ message }}</p>
  </template>
</DuSearch>`,
    },
  ],
  classnames: {
    component: [
      { class: 'input input-bordered', desc: 'The field wrapper — always applied.' },
      { class: 'dropdown-content menu', desc: 'The results panel.' },
      { class: 'badge badge-soft', desc: 'One chip per selection in multiple mode.' },
      { class: '[data-highlighted]', desc: 'The option the keyboard is on. Style this attribute rather than comparing indexes.' },
      { class: '[aria-selected="true"]', desc: 'A selected option. It reflects the real selection — it used to mirror the highlight.' },
    ],
    color: [
      { class: 'input-primary', desc: 'variant="primary"' },
      { class: 'input-secondary', desc: 'variant="secondary"' },
      { class: 'input-accent', desc: 'variant="accent"' },
      { class: 'input-neutral', desc: 'variant="neutral"' },
      { class: 'input-info', desc: 'variant="info"' },
      { class: 'input-success', desc: 'variant="success"' },
      { class: 'input-warning', desc: 'variant="warning"' },
      { class: 'input-error', desc: 'variant="error"' },
    ],
    size: [
      { class: 'input-xs', desc: 'size="xs"' },
      { class: 'input-sm', desc: 'size="sm"' },
      { class: 'input-md', desc: 'size="md"' },
      { class: 'input-lg', desc: 'size="lg"' },
      { class: 'input-xl', desc: 'size="xl"' },
    ],
  },
  sections: [
    {
      title: 'Renamed props',
      description: 'Several props were renamed to line up with DuSelect and to say what they do. The old names are gone, not deprecated — a build using them will fail rather than silently ignore them.',
      lang: 'diff',
      code: `- :listValues="options"       + :options="options"
- :limit="5"                  + :resultsLimit="5"
- remoteSearch                + externalFilter
- :addOption="true"           + creatable
- addOptionText="Add"         + createOptionText="Add"
- :autoCommit="true"          + commitOnClose="auto"
- <template #add-option>      + <template #create-option>
- <template #no-results>      + <template #no-options>`,
    },
    {
      title: 'Basic',
      description: '`name` and `id` are no longer required — the id defaults to `useId()`, which is stable across a server render and its hydration.',
      links: [
        { label: 'Vue v-model docs', href: 'https://vuejs.org/guide/components/v-model.html' },
      ],
      preview: `<DuSearch ariaLabel="Search" placeholder="Search..." class="w-72" :options="[]" />`,
      code: `<script setup lang="ts">
import { ref } from 'vue'
const query = ref(null)
</script>

<template>
  <DuSearch v-model="query" ariaLabel="Search" placeholder="Search..." :options="[]" />
</template>`,
    },
    {
      title: 'With an autocomplete list',
      preview: `<DuSearch
  ariaLabel="Author"
  placeholder="Search author..."
  :options="[
    { id: 1, name: 'Alice Martin' },
    { id: 2, name: 'Bob Smith' },
    { id: 3, name: 'Charlie Brown' },
  ]"
  :resultsLimit="5"
  class="w-72"
/>`,
      code: `<DuSearch
  v-model="author"
  ariaLabel="Author"
  placeholder="Search author..."
  :options="[
    { id: 1, name: 'Alice Martin' },
    { id: 2, name: 'Bob Smith' },
    { id: 3, name: 'Charlie Brown' },
  ]"
  :resultsLimit="5"
/>`,
    },
    {
      title: 'Keyboard and ARIA',
      description: '`role="combobox"` and `aria-expanded` sit on the **input** (they used to sit on the wrapping `<div>`), and `aria-controls` replaces the deprecated `aria-owns`. ↑ ↓ move the highlight, wrapping and skipping disabled options; `Home` / `End` / `PageUp` / `PageDown` jump; `Enter` selects; `Escape` closes; `Backspace` removes the last chip. Options carry ids and the field exposes `aria-activedescendant`, so a screen reader follows the highlight.',
      links: [
        { label: 'APG combobox pattern', href: 'https://www.w3.org/WAI/ARIA/apg/patterns/combobox/' },
      ],
      preview: `<DuSearch
  ariaLabel="Fruit"
  :options="['Apple', 'Apricot', 'Banana', 'Blackberry', 'Cherry']"
  placeholder="Tab here, then press ↓"
  class="w-72"
/>`,
      code: `<DuSearch
  v-model="fruit"
  ariaLabel="Fruit"
  :options="['Apple', 'Apricot', 'Banana', 'Cherry']"
/>`,
    },
    {
      title: 'Variant and size',
      preview: `<DuSearch ariaLabel="Search" variant="primary" size="lg" placeholder="Search..." class="w-72" :options="[]" />`,
      code: `<DuSearch v-model="query" variant="primary" size="lg" placeholder="Search..." />`,
    },
    {
      title: 'Multiple selection',
      description: 'Multiple mode renders **chips plus an input**, rather than joining the selected labels with commas inside one text field. Typing a comma still validates the segment before it, and Backspace removes the last chip.',
      preview: `<DuSearch
  ariaLabel="Tags"
  multiple
  placeholder="Select tags..."
  :options="[
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
    ariaLabel="Tags"
    multiple
    placeholder="Select tags..."
    :options="[
      { id: 1, name: 'Vue' },
      { id: 2, name: 'React' },
      { id: 3, name: 'TypeScript' },
    ]"
  />
</template>`,
    },
    {
      title: 'Clearable',
      description: 'In single mode, `clearable` lets you pick the selected option again to clear it, and shows a ✕ on that row. In multiple mode a chip is always removable — `clearable` is not needed there.',
      preview: `<div class="flex flex-col gap-2 w-72">
  <DuSearch
    ariaLabel="Fruit"
    clearable
    placeholder="Search a fruit..."
    :options="[
      { id: 1, name: 'Apple' },
      { id: 2, name: 'Banana' },
      { id: 3, name: 'Cherry' },
    ]"
  />
  <DuSearch
    ariaLabel="Tags"
    multiple
    placeholder="Select tags..."
    :options="[
      { id: 1, name: 'Vue' },
      { id: 2, name: 'React' },
      { id: 3, name: 'TypeScript' },
    ]"
  />
</div>`,
      code: `<DuSearch v-model="fruit" clearable :options="fruits" />

<!-- chips are always removable -->
<DuSearch v-model="tags" multiple :options="allTags" />`,
    },
    {
      title: 'Creating an option',
      description: '`creatable` offers an "Add «query»" row when nothing matches exactly — and it no longer appears when an option already carries that label. `@add` fires with the new option; build it yourself with `createOption` if the default `{ [trackBy]: null, [labelBy]: query }` is not the shape you need.',
      links: [
        { label: 'Vue named slots docs', href: 'https://vuejs.org/guide/components/slots.html#named-slots' },
      ],
      script: `
      const options = ref([
        { id: 1, name: 'Vue' },
        { id: 2, name: 'React' },
      ])
      const selected = ref(null)
      function onAdd(newOption) {
        options.value.push({ id: options.value.length + 1, name: newOption.name })
      }
      return { options, selected, onAdd }`,
      preview: `<DuSearch
  ariaLabel="Framework"
  v-model="selected"
  creatable
  :options="options"
  placeholder="Select tech..."
  class="w-72"
  @add="onAdd"
>
  <template #create-option="{ query }">
    <span class="flex items-center gap-2 text-success">
      <span>+</span> Add "{{ query }}"
    </span>
  </template>
</DuSearch>`,
      code: `<script setup lang="ts">
import { ref } from 'vue'

const options = ref([
  { id: 1, name: 'Vue' },
  { id: 2, name: 'React' },
])
const selected = ref(null)

function onAdd(newOption: { id: null; name: string }) {
  options.value.push({ id: options.value.length + 1, name: newOption.name })
}
</script>

<template>
  <DuSearch
    v-model="selected"
    ariaLabel="Framework"
    creatable
    createOptionText="Create"
    :options="options"
    @add="onAdd"
  >
    <template #create-option="{ query }">
      <span class="text-success">+ Add "{{ query }}"</span>
    </template>
  </DuSearch>
</template>`,
    },
    {
      title: 'Searching a server',
      description: 'With `externalFilter` the component stops filtering locally: `options` **are** the results. Listen to `@query` and refill them. Nothing else changes — the highlight, the ARIA wiring and the keyboard work the same.',
      code: `<script setup lang="ts">
import { ref } from 'vue'

const results = ref([])

async function fetchAuthors(query: string) {
  if (!query) { results.value = []; return }
  results.value = await api.searchAuthors(query)
}
</script>

<template>
  <DuSearch
    v-model="author"
    ariaLabel="Author"
    :options="results"
    externalFilter
    :resultsLimit="10"
    @query="fetchAuthors"
  />
</template>`,
    },
    {
      title: 'What happens to a half-typed query',
      description: 'When the dropdown closes with text still in the field, `commitOnClose` decides. `none` (the default, and what `autoCommit: false` used to do) discards it. `match` keeps it only if it matches an option exactly. `auto` takes the first result — that is the old `autoCommit: true`. Emptying the field and leaving clears the selection in every mode.',
      preview: `<div class="flex flex-col gap-2 w-72">
  <DuSearch ariaLabel="Fruit, commitOnClose none" commitOnClose="none" :options="['Apple', 'Apricot', 'Banana']" placeholder="none — type 'Ap' and click away" />
  <DuSearch ariaLabel="Fruit, commitOnClose auto" commitOnClose="auto" :options="['Apple', 'Apricot', 'Banana']" placeholder="auto — same, and it commits" />
</div>`,
      code: `<DuSearch v-model="fruit" commitOnClose="auto" :options="fruits" />`,
    },
    {
      title: 'Validation',
      description: 'Like DuSelect: `required`, plus `minSelected` / `maxSelected` in multiple mode, reported by the component since a custom combobox has no native constraint. Nothing is shown until the field has been visited; the field then turns red, and the message is yours to write with `errorMessages` (there is no default wording) or to replace entirely with the `#error` slot; `valid`, `errors` and `validationMessage` are exposed on the instance.',
      code: `<script setup lang="ts">
const field = ref()

function submit() {
  if (!field.value.valid) return
  // …
}
</script>

<template>
  <DuSearch
    ref="field"
    v-model="author"
    :options="options"
    required
    :errorMessages="{ required: 'Pick an author.' }"
  />
</template>`,
    },
    {
      title: 'Events',
      description: '`@select`, `@remove` and `@add` carry the option. `@query` fires as the text changes. `@open` and `@close` follow the dropdown — both new here. The instance exposes `open()`, `close()`, `toggle()` and `clear()`.',
      code: `<DuSearch
  v-model="value"
  :options="options"
  @select="onSelect"
  @remove="onRemove"
  @add="onAdd"
  @query="fetch"
  @open="onOpen"
  @close="onClose"
/>`,
    },
  ],
} satisfies DocPageData
