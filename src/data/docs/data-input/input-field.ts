import type { DocPageData } from '@/types/docs'

export default {
  title: 'InputField',
  description: 'InputField is a styled text input. Validation is **native** — already localized, already what the form decides on submit — and the component only dresses the result: an error surface identical to DuSelect\'s and DuSearch\'s, so a form of mixed fields reports errors one way. Any other attribute (`aria-label`, `autocomplete`, `inputmode`…) is passed straight to the `<input>`.',
  category: 'Data Input',
  source: 'https://daisyui.com/components/input/',
  props: [
    {
      title: 'modelValue',
      description: 'Input value (use with `v-model`). A `number` for a numeric field, and **`null`** whenever a number, date or time field is emptied — see "An emptied field binds null" below.',
      type: 'string | number | null',
    },
    {
      title: 'type',
      description: 'Native input type',
      type: 'DuInputFieldType',
      default: '"text"',
      options: ['text', 'password', 'email', 'number', 'date', 'datetime-local', 'week', 'month', 'tel', 'url', 'search', 'time'],
    },
    {
      title: 'placeholder',
      description: 'Placeholder text',
      type: 'string',
      default: "''",
    },
    {
      title: 'variant',
      description: 'Color variant of the component',
      type: 'Variant',
      default: '"default"',
      options: ['default', 'neutral', 'primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error'],
    },
    {
      title: 'size',
      description: 'Size of the component',
      type: 'Size',
      default: '"default"',
      options: ['default', 'xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      title: 'ghost',
      description: 'Ghost style — no background until focused',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'invalid',
      description: 'Force the invalid styling regardless of native validity',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'showValid',
      description: 'Turn the field green once it has been visited and holds a valid, non-empty value. Off by default.',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'disabled',
      description: 'Disable the input',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'required',
      description: 'Mark the input as required',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'pattern',
      description: 'HTML5 validation pattern',
      type: 'string',
    },
    {
      title: 'minlength',
      description: 'Minimum accepted length',
      type: 'number',
    },
    {
      title: 'maxlength',
      description: 'Maximum accepted length',
      type: 'number',
    },
    {
      title: 'title',
      description: 'Native validation message shown when the pattern fails',
      type: 'string',
    },
    {
      title: 'suggestionName',
      description: 'Id of the generated `<datalist>`. Set it to enable suggestions.',
      type: 'string',
    },
    {
      title: 'suggestionList',
      description: 'Values offered in the `<datalist>`',
      type: 'string[]',
    },
    {
      title: 'errorMessages',
      description: "Override the browser's wording for a failed constraint, by code: `required`, `pattern`, `minlength`, `maxlength`, `min`, `max`, `step`, `type` — the same shape DuSelect and DuSearch take.",
      type: 'Partial<Record<NativeErrorCode, string>>',
    },
    {
      title: 'class',
      description: 'Additional CSS classes for the input element',
      type: 'string',
    },
  ],
  slots: [
    {
      title: 'Slot #error',
      description: 'Replaces the validation message under the field. Scope: `{ errors, message }`. Nothing renders until the field has been visited — which is what `:user-invalid` means, mirrored into JS.',
      code: `<DuInputField v-model="email" type="email" required>
  <template #error="{ message }">
    <p class="text-error text-xs mt-1">⚠ {{ message }}</p>
  </template>
</DuInputField>`,
    },
  ],
  classnames: {
    component: [
      { class: 'input', desc: 'Base class, always applied. size="default" and variant="default" add no extra class.' },
    ],
    style: [
      { class: 'input-ghost', desc: 'Transparent ghost style' },
    ],
    color: [
      { class: 'input-primary', desc: 'Primary border on focus' },
      { class: 'input-secondary', desc: 'Secondary border' },
      { class: 'input-accent', desc: 'Accent border' },
      { class: 'input-neutral', desc: 'Neutral border' },
      { class: 'input-info', desc: 'Info state' },
      { class: 'input-success', desc: 'Success state (green border)' },
      { class: 'input-warning', desc: 'Warning state' },
      { class: 'input-error', desc: 'Error state (red border)' },
    ],
    size: [
      { class: 'input-xs', desc: 'Extra small' },
      { class: 'input-sm', desc: 'Small' },
      { class: 'input-md', desc: 'Medium' },
      { class: 'input-lg', desc: 'Large' },
      { class: 'input-xl', desc: 'Extra large' },
    ],
  },
  sections: [
    {
      title: 'Basic',
      preview: `<DuInputField placeholder="Type here..." class="w-72" />`,
      code: `<DuInputField v-model="value" placeholder="Type here..." />`,
    },
    {
      title: 'Variants',
      preview: `<div class="flex flex-col gap-2 w-72">
  <DuInputField variant="primary" placeholder="Primary" />
  <DuInputField variant="secondary" placeholder="Secondary" />
  <DuInputField variant="accent" placeholder="Accent" />
  <DuInputField variant="error" placeholder="Error" />
  <DuInputField variant="success" placeholder="Success" />
</div>`,
      code: `<DuInputField v-model="val" variant="primary" placeholder="Primary" />
<DuInputField v-model="val" variant="secondary" placeholder="Secondary" />
<DuInputField v-model="val" variant="accent" placeholder="Accent" />
<DuInputField v-model="val" variant="error" placeholder="Error" />
<DuInputField v-model="val" variant="success" placeholder="Success" />`,
    },
    {
      title: 'Sizes',
      preview: `<div class="flex flex-col gap-2 w-72">
  <DuInputField size="xs" placeholder="XSmall" />
  <DuInputField size="sm" placeholder="Small" />
  <DuInputField placeholder="Medium" />
  <DuInputField size="lg" placeholder="Large" />
  <DuInputField size="xl" placeholder="XLarge" />
</div>`,
      code: `<DuInputField v-model="val" size="xs" placeholder="XSmall" />
<DuInputField v-model="val" size="sm" placeholder="Small" />
<DuInputField v-model="val" placeholder="Medium" />
<DuInputField v-model="val" size="lg" placeholder="Large" />
<DuInputField v-model="val" size="xl" placeholder="XLarge" />`,
    },
    {
      title: 'Ghost style',
      preview: `<DuInputField ghost placeholder="Ghost input" class="w-72" />`,
      code: `<DuInputField v-model="val" ghost placeholder="Ghost input" />`,
    },
    {
      title: 'Disabled',
      preview: `<DuInputField disabled placeholder="Disabled" class="w-72" />`,
      code: `<DuInputField v-model="val" disabled placeholder="Disabled" />`,
    },
    {
      title: 'Input types',
      preview: `<div class="flex flex-col gap-2 w-72">
  <DuInputField type="email" placeholder="your@email.com" />
  <DuInputField type="password" placeholder="Password" />
  <DuInputField type="number" placeholder="0" />
  <DuInputField type="date" />
</div>`,
      code: `<DuInputField v-model="email" type="email" placeholder="your@email.com" />
<DuInputField v-model="password" type="password" placeholder="Password" />
<DuInputField v-model="number" type="number" placeholder="0" />
<DuInputField v-model="date" type="date" />`,
    },
    {
      title: 'With HTML validation',
      description: 'Use `pattern`, `minlength`, `maxlength`, `required` and `title` for native browser validation. Add `invalid` to apply the error style regardless of browser state.',
      links: [
        { label: 'HTML constraint validation docs', href: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Constraint_validation' },
        { label: 'MDN pattern attribute', href: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/pattern' },
      ],
      preview: `<div class="flex flex-col gap-2 w-72">
  <DuInputField
    type="email"
    placeholder="your@email.com"
    required
    :invalid="true"
    variant="error"
  />
  <DuInputField
    type="text"
    placeholder="Min 3 chars"
    :minlength="3"
    :maxlength="20"
  />
</div>`,
      code: `<!-- invalid applies error styling without waiting for native validation -->
<DuInputField
  v-model="email"
  type="email"
  placeholder="your@email.com"
  required
  :pattern="'[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$'"
  title="Please enter a valid email"
  :invalid="hasError"
/>

<!-- character limits -->
<DuInputField
  v-model="username"
  type="text"
  placeholder="Username"
  :minlength="3"
  :maxlength="20"
/>`,
    },
    {
      title: 'An emptied field binds null',
      description: 'Clear a `number`, `date`, `datetime-local`, `time`, `week` or `month` field and the model becomes **`null`**. For these the browser hands back `""` to mean *nothing*, and `""` is never a valid one of them — so it was an absence wearing a value\'s clothes, and it is what makes a server reject an optional field the user simply left alone (`Input should be a valid integer, unable to parse string as an integer`). A **text** field keeps binding `""`, which for it is a real answer.',
      script: `
      const quantity = ref(5)
      const dueDate = ref('2026-09-09')
      const nickname = ref('Ada')
      return { quantity, dueDate, nickname }
      `,
      preview: `<div class="flex flex-col gap-3 w-72 text-sm">
  <div>
    <DuInputField type="number" v-model="quantity" size="sm" placeholder="Quantity" />
    <p class="mt-1"><code>{{ quantity === null ? 'null' : JSON.stringify(quantity) }}</code> — <code>{{ typeof quantity }}</code></p>
  </div>
  <div>
    <DuInputField type="date" v-model="dueDate" size="sm" />
    <p class="mt-1"><code>{{ dueDate === null ? 'null' : JSON.stringify(dueDate) }}</code> — <code>{{ typeof dueDate }}</code></p>
  </div>
  <div>
    <DuInputField type="text" v-model="nickname" size="sm" placeholder="Nickname" />
    <p class="mt-1"><code>{{ JSON.stringify(nickname) }}</code> — <code>{{ typeof nickname }}</code></p>
  </div>
</div>`,
      code: `<script setup lang="ts">
const quantity = ref<number | null>(5)
const dueDate = ref<string | null>('2026-09-09')
const nickname = ref('')          // text keeps ""
</script>

<template>
  <DuInputField type="number" v-model="quantity" />
  <DuInputField type="date" v-model="dueDate" />
  <DuInputField type="text" v-model="nickname" />
</template>`,
    },
    {
      title: 'v-model.number on any field',
      description: 'The `.number` modifier is implemented, so it casts on a `type="text"` field too — it used to be handed to the component and silently ignored, which is worse than not supporting it. The cast follows Vue\'s own rules (`"abc"` stays `"abc"`, `"12ab"` becomes `12`); only the empty case departs from them, going to `null` like everything else here.',
      code: `<!-- casts even though the input is text -->
<DuInputField type="text" v-model.number="amount" inputmode="decimal" />`,
    },
    {
      title: 'Reporting the error',
      description: 'The **checking** stays native: the browser already knows what "not an email" means, in the user\'s language, and already covers the cases a hand-rolled version forgets. What the component adds is the reporting — a message under the field, shown only once the field has been visited. Override the wording per code with `errorMessages`, or replace the whole thing with the `#error` slot.',
      links: [
        { label: 'HTML constraint validation', href: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Constraint_validation' },
        { label: ':user-invalid', href: 'https://developer.mozilla.org/en-US/docs/Web/CSS/:user-invalid' },
      ],
      preview: `<div class="flex flex-col gap-3 w-72">
  <DuInputField
    type="email"
    placeholder="your@email.com"
    required
    :errorMessages="{ required: 'We need an email to reach you.', type: 'That does not look like an email.' }"
  />
  <p class="text-xs text-base-content/60">Type something, then click away.</p>
</div>`,
      code: `<DuInputField
  v-model="email"
  type="email"
  required
  :errorMessages="{
    required: 'We need an email to reach you.',
    type: 'That does not look like an email.',
  }"
/>`,
    },
    {
      title: 'Showing success',
      description: 'Errors always show; success is opt-in. With `showValid`, the field turns green once it has been left with a valid, non-empty value — the same moment an error would appear. An empty optional field stays neutral. Inside a `DuLabel type="input"`, the label turns green instead.',
      preview: `<div class="flex flex-col gap-3 w-72">
  <DuInputField
    type="email"
    placeholder="your@email.com"
    required
    showValid
  />
  <DuLabel type="floating-label">
    <span>Username</span>
    <DuInputField placeholder="3 to 16 letters" required pattern="[A-Za-z]{3,16}" showValid />
  </DuLabel>
  <p class="text-xs text-base-content/60">Type a valid value, then click away.</p>
</div>`,
      code: `<DuInputField v-model="email" type="email" required showValid />`,
    },
    {
      title: 'With a label',
      description: 'Inside a `DuLabel`, the message is rendered after the label rather than inside it — every daisyUI label is a flex row, which would otherwise squeeze the field. Works the same for a floating label, a stacked one or a prefixed `type="input"`.',
      links: [
        { label: 'DuLabel docs', href: '/docs/data-input/label' },
      ],
      preview: `<div class="flex flex-col gap-4 w-72">
  <DuLabel type="floating-label">
    <span>Email</span>
    <DuInputField type="email" placeholder="you@example.com" required />
  </DuLabel>
  <DuLabel type="label" class="flex-col items-start gap-1">
    Password
    <DuInputField type="password" placeholder="At least 12 characters" required :minlength="12" />
  </DuLabel>
</div>`,
      code: `<DuLabel type="floating-label">
  <span>Email</span>
  <DuInputField v-model="email" type="email" placeholder="you@example.com" required />
</DuLabel>

<DuLabel type="label" class="flex-col items-start gap-1">
  Password
  <DuInputField v-model="password" type="password" required :minlength="12" />
</DuLabel>`,
    },
    {
      title: 'Reading validity from a parent',
      description: 'The instance exposes `valid`, `errors`, `validationMessage`, plus `markTouched()` and `reset()` — the same surface DuSelect and DuSearch expose. Call `markTouched()` on submit to reveal messages on fields the user never visited.',
      lang: 'vue',
      code: `<script setup lang="ts">
import { ref } from 'vue'

const emailField = ref()
const email = ref('')

function submit() {
  emailField.value.markTouched()
  if (!emailField.value.valid) return
  // …
}
</script>

<template>
  <DuInputField ref="emailField" v-model="email" type="email" required />
  <DuButton @click="submit">Submit</DuButton>
</template>`,
    },
    {
      title: 'Suggestions (datalist)',
      description: 'Pass `suggestionList` (the values) and `suggestionName` (the id of the generated `<datalist>`) and the browser offers those values as you type. The field stays free text: any value is accepted. To pick from a filtered list with keyboard navigation and a real selection, use DuSearch.',
      links: [
        { label: 'MDN datalist element', href: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist' },
        { label: 'DuSearch docs', href: '/docs/data-input/search' },
      ],
      preview: `<DuInputField
  placeholder="Search a country..."
  suggestionName="countries-list"
  :suggestionList="['France', 'Germany', 'Italy', 'Spain', 'Portugal']"
  class="w-72"
/>`,
      code: `<script setup lang="ts">
const country = ref('')
const countries = [
  'France', 'Germany', 'Italy', 'Spain', 'Portugal', 'Netherlands', 'Belgium',
]
</script>

<template>
  <DuInputField
    v-model="country"
    placeholder="Search a country..."
    suggestionName="countries-list"
    :suggestionList="countries"
  />
</template>`,
    },
    {
      title: 'Inside a fieldset with label',
      description: 'Combine with DuFieldset and DuLabel for accessible form groups with error messages.',
      links: [
        { label: 'DuFieldset docs', href: '/docs/data-input/fieldset' },
        { label: 'DuLabel docs', href: '/docs/data-input/label' },
      ],
      preview: `<DuFieldset legend="Account" class="bg-base-200 border border-base-300 rounded-box p-4">
  <DuLabel> Email </DuLabel>
    <DuInputField type="email" placeholder="you@example.com" />
  <DuLabel type="label"> Option </DuLabel>

  <DuLabel>Password</DuLabel>
    <DuInputField type="password" placeholder="••••••••" />
  <DuLabel type="label"> Min 12 characters</DuLabel>
</DuFieldset>`,
      code: `<DuFieldset legend="Account" class="bg-base-200 border border-base-300 rounded-box p-4">
  <DuLabel> Email </DuLabel>
    <DuInputField type="email" placeholder="you@example.com" />
  <DuLabel type="label"> Option </DuLabel>

  <DuLabel>Password</DuLabel>
    <DuInputField type="password" placeholder="••••••••" />
  <DuLabel type="label"> Min 12 characters</DuLabel>
</DuFieldset>`,
    },
  ],
} satisfies DocPageData
