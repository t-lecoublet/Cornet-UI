import type { DocPageData } from '@/types/docs'

export default {
  title: 'Quick Start',
  description: 'Start using components in minutes. A practical introduction to the most common patterns.',
  category: 'Guides',
  sections: [
    {
      title: 'Your first component',
      description: 'Import a component directly.',
      links: [
        { label: 'Cornet button', href: '/docs/actions/button' },
        { label: 'Vue basic usage docs', href: 'https://vuejs.org/api/composition-api-setup.html#basic-usage' },
      ],
      preview: `<div class="flex flex-wrap gap-3 items-center">
  <DuButton>Default</DuButton>
  <DuButton variant="primary">Primary</DuButton>
  <DuButton variant="secondary">Secondary</DuButton>
</div>`,
      code: `<script setup lang="ts">
import { DuButton } from 'cornet-ui'
</script>

<template>
  <DuButton variant="primary">Click me</DuButton>
</template>`,
    },
    {
      title: 'Variants',
      description: 'Most components accept a `variant` prop to change their color.',
      links: [
        { label: 'DaisyUI variants docs', href: 'https://daisyui.com/docs/colors' },
        { label: 'Vue props docs', href: 'https://vuejs.org/guide/components/props.html#props' },
      ],
      preview: `<div class="flex flex-wrap gap-2 items-center">
  <DuButton variant="neutral">Neutral</DuButton>
  <DuButton variant="primary">Primary</DuButton>
  <DuButton variant="secondary">Secondary</DuButton>
  <DuButton variant="accent">Accent</DuButton>
  <DuButton variant="info">Info</DuButton>
  <DuButton variant="success">Success</DuButton>
  <DuButton variant="warning">Warning</DuButton>
  <DuButton variant="error">Error</DuButton>
</div>`,
      code: `<DuButton variant="primary">Primary</DuButton>
<DuButton variant="success">Success</DuButton>
<DuButton variant="error">Error</DuButton>`,
    },
    {
      title: 'Sizes',
      description: `Use the 'size' prop to scale components: 'xs', 'sm', 'md', 'lg', 'xl'.`,
      preview: `<div class="flex flex-wrap gap-3 items-center">
  <DuButton size="xs">XS</DuButton>
  <DuButton size="sm">SM</DuButton>
  <DuButton>Default</DuButton>
  <DuButton size="lg">LG</DuButton>
  <DuButton size="xl">XL</DuButton>
</div>`,
      code: `<DuButton size="sm">Small</DuButton>
<DuButton>Default</DuButton>
<DuButton size="lg">Large</DuButton>`,
    },
    {
      title: 'Reactive state with v-model',
      description: 'Components that hold state (inputs, selects, modals) support `v-model`.',
      links: [
        { label: 'Vue reactivity docs', href: 'https://vuejs.org/guide/essentials/reactivity-fundamentals' },
        { label: 'Vue v-model docs', href: 'https://vuejs.org/guide/components/v-model.html' },
        { label: 'Vue form input bindings docs', href: 'https://vuejs.org/guide/essentials/forms' },
      ],
      code: `<script setup lang="ts">
import { ref } from 'vue'

const name = ref('')
const agreed = ref(false)
</script>

<template>
  <DuInputField v-model="name" placeholder="Your name" />
  <DuCheckbox v-model="agreed">I agree to the terms</DuCheckbox>
  <p>Hello, {{ name }}!</p>
</template>`,
    },
    {
      title: 'Composing a form',
      description: 'Combine DuButton, DuInputField, and DuLabel to build a simple form.',
      links: [
        { label: 'DuInputField docs', href: 'http://localhost:5173/docs/form/input-field' },
        { label: 'DuLabel docs', href: 'http://localhost:5173/docs/form/label' },
        { label: 'DuCheckbox docs', href: 'http://localhost:5173/docs/form/checkbox' },
      ],
      script: `
      const email = ref('')
      const password = ref('')
      function submit() {
        alert('forme submitted with email: ' + email.value + ' and password: ' + password.value)
      }
      return { email, password, submit }
      `,
      preview: `<form class="flex flex-col gap-4 w-80" @submit.prevent="submit">
<DuFieldset legend="Email">
      <DuInputField v-model="email" type="email" required />
    </DuFieldset>

<DuFieldset legend="Password">
      <DuInputField v-model="password" type="password" required />
    </DuFieldset>

    <DuButton type="submit" variant="primary">Log in</DuButton>
  </form>`,
      code: `<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const password = ref('')

async function submit() {
  // handle login
}
</script>

<template>
  <form class="flex flex-col gap-4 w-80" @submit.prevent="submit">
    <DuFieldset legend="Email">
      <DuInputField v-model="email" type="email" required />
    </DuFieldset>

    <DuFieldset legend="Password">
      <DuInputField v-model="password" type="password" required />
    </DuFieldset>

    <DuButton type="submit" variant="primary">Log in</DuButton>
  </form>
</template>`,
    },
  ],
} satisfies DocPageData
