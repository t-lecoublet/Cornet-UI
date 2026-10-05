import type { DocPageData } from '@/types/docs'

export default {
  title: 'Select',
  description: 'Select is a dropdown for picking one or several values from a list. It implements the WAI-ARIA combobox pattern: a single tab stop, full keyboard navigation, `aria-activedescendant` so screen readers follow the highlight, and it is generic over your option type.',
  category: 'Data Input',
  source: 'https://daisyui.com/components/select/',
  props: [
    {
      title: 'options',
      description: 'The options — strings, numbers, or objects of any shape. The component is generic over them, so your own fields survive into the slots and the emit payloads.',
      type: 'O[]',
      required: true,
    },
    {
      title: 'modelValue',
      description: 'Selected value, or an array of them in `multiple` mode.',
      type: 'V | V[] | null',
    },
    {
      title: 'multiple',
      description: 'Allow selecting several options.',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'placeholder',
      description: 'Placeholder text when nothing is selected.',
      type: 'string',
      default: '"Select..."',
    },
    {
      title: 'searchable',
      description: 'Type the query in the field itself.',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'searchableInside',
      description: 'Type the query in a box at the top of the dropdown instead. No longer needs `searchable` alongside it.',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'searchPlaceholder',
      description: 'Placeholder of the search box.',
      type: 'string',
    },
    {
      title: 'noResultsText',
      description: 'Shown when no option matches the query. Renamed from `searchNoResultsText`, to line up with DuSearch.',
      type: 'string',
    },
    {
      title: 'checkboxes',
      description: 'Show a checkbox on each option.',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'closeOnSelect',
      description: '`null` (the default) means "close in single mode, stay open in multiple" — it used to close in multiple mode too. Pass `true` or `false` to decide for yourself.',
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
      description: 'Object key displayed for an option. Falls back to `label`, then `name`, then `String(option)`.',
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
      description: 'Emit whole options instead of their `trackBy` value.',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'clearable',
      description: 'Single mode: picking the selected option again clears it, and the selected row shows a ✕.',
      type: 'boolean',
      default: 'false',
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
      type: 'Partial<Record<DuSelectErrorCode, string>>',
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
      description: 'Base id for the ARIA wiring. Derived from `useId()` when omitted, so a server render and a client render agree.',
      type: 'string',
    },
    {
      title: 'ghost',
      description: 'Use ghost/transparent style.',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'variant',
      description: 'Color variant',
      type: 'string',
      options: ['default', 'neutral', 'primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error'],
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
      title: 'disabled',
      description: 'Disable the select.',
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
      description: 'Custom display for a dropdown option. Scope: `{ option, index, selected, highlighted, disabled }` — the three booleans let you style a row without comparing indexes yourself.',
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
  <template #option="{ option, selected, highlighted, disabled }">
    <span :class="{ 'font-semibold': selected, 'opacity-40': disabled }">
      {{ option.name }}
    </span>
  </template>
</DuSelect>`,
    },
    {
      title: 'Slot #tag',
      description: 'Custom display for a selected chip (multiple mode). Scope: `{ option, value, index, remove }` — `option` is the resolved option (it can be `undefined` if the model holds a value no longer in `options`), `value` is the raw model value, and `remove()` is pre-wired to unselect it.',
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
  <template #tag="{ option, remove }">
    <span class="badge badge-primary badge-sm gap-1">
      {{ option?.name }}
      <button type="button" class="cursor-pointer" @click.stop="remove">✕</button>
    </span>
  </template>
</DuSelect>`,
      code: `<DuSelect v-model="selected" :options="options" multiple>
  <template #tag="{ option, remove }">
    <span class="badge badge-primary badge-sm gap-1">
      {{ option?.name }}
      <button type="button" @click.stop="remove">✕</button>
    </span>
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
  <template #no-options="{ query }">
    <span class="text-error">Nothing matches "{{ query }}"</span>
  </template>
</DuSelect>`,
    },
    {
      title: 'Slot #error',
      description: 'Replaces the validation message under the field. Scope: `{ errors, message }`. Nothing is rendered until the field has been visited — the same "only tell me once I have had a go" rule `:user-invalid` follows for native inputs.',
      code: `<DuSelect v-model="tags" :options="options" multiple required :minSelected="2">
  <template #error="{ message }">
    <p class="text-error text-xs mt-1">⚠ {{ message }}</p>
  </template>
</DuSelect>`,
    },
  ],
  classnames: {
    component: [
      { class: 'input input-bordered', desc: 'The control is an input, not a native select — always applied.' },
      { class: 'dropdown-content menu', desc: 'The options panel.' },
      { class: 'badge badge-sm badge-neutral', desc: 'One chip per selected value in multiple mode.' },
      { class: 'btn btn-ghost', desc: 'The toggle caret and the per-chip remove button.' },
      { class: 'checkbox checkbox-sm', desc: 'One per option in multiple mode.' },
      { class: '[data-highlighted]', desc: 'The option the keyboard is on. Style this attribute rather than comparing indexes.' },
      { class: '[aria-selected="true"]', desc: 'A selected option. It reflects the real selection, so it is safe to style.' },
    ],
    style: [
      { class: 'select-ghost', desc: 'No background until focused — ghost' },
      { class: 'input-ghost', desc: 'The inner search input, always ghost.' },
      { class: 'input-disabled', desc: 'disabled' },
    ],
    color: [
      { class: 'select-primary', desc: 'variant="primary"' },
      { class: 'select-secondary', desc: 'variant="secondary"' },
      { class: 'select-accent', desc: 'variant="accent"' },
      { class: 'select-neutral', desc: 'variant="neutral"' },
      { class: 'select-info', desc: 'variant="info"' },
      { class: 'select-success', desc: 'variant="success"' },
      { class: 'select-warning', desc: 'variant="warning"' },
      { class: 'select-error', desc: 'variant="error"' },
    ],
    size: [
      { class: 'input-xs', desc: 'size="xs" — sizing goes through input-*, not select-*' },
      { class: 'input-sm', desc: 'size="sm"' },
      { class: 'input-md', desc: 'size="md"' },
      { class: 'input-lg', desc: 'size="lg"' },
      { class: 'input-xl', desc: 'size="xl"' },
      { class: 'menu-xs … menu-xl', desc: 'The options panel is sized to match.' },
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
      description: '`searchable` types the query in the field itself; `searchableInside` puts a box at the top of the dropdown instead. The second no longer needs the first alongside it.',
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
      description: 'In single mode, `clearable` lets you pick the selected option again to clear it, and shows a ✕ on that row. In multiple mode a chip is always removable.',
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
      title: 'Keyboard and ARIA',
      description: 'The whole field is **one** tab stop — the trigger is a real `<button>` and the caret is `tabindex="-1"`, so Tab enters and Tab leaves. Inside: ↑ ↓ move the highlight (wrapping, and skipping disabled options), `Home` / `End` / `PageUp` / `PageDown` jump, `Enter` selects, `Escape` closes, and `Backspace` removes the last chip in multiple mode. Options carry ids and the field exposes `aria-activedescendant`, so a screen reader follows the highlight instead of going silent.',
      links: [
        { label: 'APG combobox pattern', href: 'https://www.w3.org/WAI/ARIA/apg/patterns/combobox/' },
      ],
      preview: `<DuSelect
  ariaLabel="Framework"
  :options="['Vue', 'React', 'Svelte', 'Angular']"
  placeholder="Tab here, then press ↓"
  class="w-72"
/>`,
      code: `<DuSelect
  ariaLabel="Framework"
  :options="['Vue', 'React', 'Svelte', 'Angular']"
  placeholder="Choose..."
/>`,
    },
    {
      title: 'Naming the field',
      description: 'The trigger used to take its accessible name from the placeholder or the current selection, so a select with neither had none at all. Give it `ariaLabel`, or point `ariaLabelledby` at the element that names it — or wrap it in a `DuLabel`, which does the same thing visibly.',
      preview: `<div class="flex flex-col gap-3 w-72">
  <DuSelect ariaLabel="Country" :options="['France', 'Japan', 'Brazil']" placeholder="Country" />
  <div>
    <p id="team-label" class="text-sm font-medium mb-1">Team</p>
    <DuSelect ariaLabelledby="team-label" :options="['Design', 'Platform', 'Growth']" />
  </div>
</div>`,
      code: `<DuSelect ariaLabel="Country" :options="countries" />

<p id="team-label">Team</p>
<DuSelect ariaLabelledby="team-label" :options="teams" />`,
    },
    {
      title: 'Disabled options',
      description: 'By default an option with `disabled: true` cannot be picked: the keyboard steps over it, it is marked `aria-disabled`, and a click does nothing. Pass `optionDisabled` to decide from the data instead.',
      preview: `<div class="flex flex-col gap-3 w-72">
  <DuSelect
    ariaLabel="Plan"
    :options="[
      { id: 1, name: 'Free' },
      { id: 2, name: 'Pro' },
      { id: 3, name: 'Enterprise', disabled: true },
    ]"
    trackBy="id"
    labelBy="name"
    placeholder="Pick a plan"
  />
</div>`,
      code: `<!-- from the option itself -->
<DuSelect :options="[{ id: 3, name: 'Enterprise', disabled: true }]" />

<!-- or from your own rule -->
<DuSelect
  :options="plans"
  :optionDisabled="(plan) => plan.seats > remainingSeats"
/>`,
    },
    {
      title: 'Options of any shape',
      description: '`trackBy` and `labelBy` cover the common case. When they cannot describe your data — a label built from two fields, a value that is not a key — pass `optionValue`, `optionLabel`, `optionFilter` and `optionDisabled` instead. They take precedence, and the component stays generic over your option type, so the callbacks are typed.',
      preview: `<DuSelect
  ariaLabel="Assignee"
  :options="[
    { first: 'Ada', last: 'Lovelace', team: 'Platform' },
    { first: 'Grace', last: 'Hopper', team: 'Compilers' },
    { first: 'Alan', last: 'Turing', team: 'Platform' },
  ]"
  :optionLabel="(p) => p.first + ' ' + p.last"
  :optionValue="(p) => p.first"
  searchable
  placeholder="Assign to..."
  class="w-72"
/>`,
      code: `<DuSelect
  v-model="assignee"
  :options="people"
  :optionLabel="(p) => \`\${p.first} \${p.last}\`"
  :optionValue="(p) => p.id"
  :optionFilter="(p, q) => p.email.includes(q) || p.first.includes(q)"
  searchable
/>`,
    },
    {
      title: 'Validation',
      description: 'A custom combobox has no native form constraint behind it, so the component reports its own: `required`, and `minSelected` / `maxSelected` in multiple mode. Nothing is shown until the field has been visited — closed after opening, or tabbed past. The field then turns red; the message is yours to write with `errorMessages` (there is no default wording), replace the whole thing with the `#error` slot, and read `valid`, `errors` and `validationMessage` off the component instance when the form submits.',
      preview: `<div class="flex flex-col gap-3 w-72">
  <DuSelect
    ariaLabel="Tags"
    :options="['Bug', 'Feature', 'Docs', 'Chore']"
    multiple
    required
    :minSelected="2"
    placeholder="Pick at least two"
    :errorMessages="{ required: 'Pick at least two tags.', minlength: 'Pick at least two tags.' }"
  />
  <p class="text-xs text-base-content/60">Open it, pick one, then click away.</p>
</div>`,
      code: `<script setup lang="ts">
const field = ref()
const tags = ref([])

function submit() {
  if (!field.value.valid) return
  // …
}
</script>

<template>
  <DuSelect
    ref="field"
    v-model="tags"
    :options="options"
    multiple
    required
    :minSelected="2"
    :errorMessages="{ minlength: 'Pick at least two tags.' }"
  />
</template>`,
    },
    {
      title: 'Escaping an overflow: hidden parent',
      description: '`popover` renders the dropdown in the browser\'s top layer, so a select inside a scrolling container, a table cell or a modal is no longer clipped by it.',
      preview: `<div class="w-72 h-24 overflow-hidden border border-base-300 rounded-box p-3">
  <DuSelect
    popover
    ariaLabel="Fruit"
    :options="['Apple', 'Banana', 'Cherry', 'Date']"
    placeholder="Not clipped"
  />
</div>`,
      code: `<div class="overflow-hidden">
  <DuSelect popover v-model="fruit" :options="fruits" />
</div>`,
    },
    {
      title: 'Events',
      description: '`@select` and `@remove` carry the option. `@query` fires as the search text changes — useful for fetching. `@open` and `@close` fire with the dropdown. And the instance exposes `open()`, `close()`, `toggle()`, `clear()` alongside the validation state.',
      code: `<DuSelect
  v-model="value"
  :options="options"
  searchable
  @select="onSelect"
  @remove="onRemove"
  @query="fetchOptions"
  @open="onOpen"
  @close="onClose"
/>`,
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
