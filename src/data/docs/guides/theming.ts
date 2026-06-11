import type { DocPageData } from '@/types/docs'

export default {
  title: 'Theming',
  description: 'Cornet inherits DaisyUI 5 themes. Switch between built-in themes or create your own.',
  category: 'Guides',
  sections: [
    {
      title: 'Built-in themes',
      description: 'DaisyUI ships 35+ themes out of the box. Set a theme on the `<html>` element with the `data-theme` attribute.',
      lang: 'html',
      links: [
        { href: 'https://daisyui.com/docs/themes/#list-of-themes', label: 'See all themes' },
        { href: 'https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset', label: 'Learn about data attributes' },
      ],
      code: `<!-- index.html -->
<html data-theme="light">
  ...
</html>

<!-- Other popular themes -->
<html data-theme="dark">
<html data-theme="cupcake">
<html data-theme="corporate">
<html data-theme="dracula">`,
    },
    {
      title: 'Enable themes in CSS',
      description: 'By default DaisyUI loads light and dark themes. To ship only specific themes, list them explicitly in your CSS.',
      lang: 'css',
      links: [
        { href: 'https://daisyui.com/docs/themes/#enable-a-built-in-theme', label: 'DaisyUI themes configuration' },
      ],
      code: `/* src/style.css */
@import "tailwindcss";
@plugin "daisyui" {
  themes: light, dark, cupcake;
}`,
    },
    {
      title: 'Switching themes at runtime',
      description: 'Toggle the `data-theme` attribute on `<html>` to switch themes dynamically.',
      links: [
        { href: 'https://vuejs.org/guide/components/events.html', label: 'Vue event handling docs' },
      ],
      script: `
        const currentTheme = ref('cornet');
        function setTheme(theme) {
          currentTheme.value = theme
        };
        return { setTheme, currentTheme }
      `,
      preview: `<div :data-theme="currentTheme" class="flex gap-3 items-center justify-center flex-wrap py-10 w-full">
  <DuButton size="sm" @click="setTheme('light')">Light</DuButton>
  <DuButton size="sm" @click="setTheme('dark')">Dark</DuButton>
  <DuButton size="sm" @click="setTheme('cupcake')">Cupcake</DuButton>
  <DuButton size="sm" @click="setTheme('cornet')">Cornet</DuButton>
</div>`,
      code: `<script setup lang="ts">
function setTheme(theme: string) {
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}

// Restore on load
const saved = localStorage.getItem('theme')
if (saved) document.documentElement.setAttribute('data-theme', saved)
</script>

<template>
  <DuButton @click="setTheme('light')">Light</DuButton>
  <DuButton @click="setTheme('dark')">Dark</DuButton>
</template>`,
    },
    {
      title: 'Custom theme',
      description: 'Define your own theme by overriding DaisyUI CSS variables.',
      lang: 'css',
      links: [
        { href: 'https://daisyui.com/docs/themes/#how-to-add-a-new-custom-theme', label: 'DaisyUI custom themes docs' },
        { href: 'https://daisyui.com/theme-generator', label: 'DaisyUI theme generator' },
      ],
      // preview:`
      // <!-- check directly the theme genertor on daisyui.com #href https://daisyui.com/theme-generator -->
      // <DuButton as="a" target="_blank" size="sm" href="https://daisyui.com/theme-generator" link>Click here to see theme generator</DuButton>
      // `,
      code: `/* src/style.css */
@import "tailwindcss";
@plugin "daisyui" {
  themes: light --default, myTheme;
}

@plugin "daisyui/theme" {
  name: "myTheme";
  --color-primary: #6d28d9;
  --color-primary-content: #ffffff;
  --color-secondary: #db2777;
  --color-secondary-content: #ffffff;
  --color-accent: #0891b2;
  --color-base-100: #ffffff;
  --color-base-200: #f3f4f6;
  --color-base-300: #e5e7eb;
  --color-base-content: #111827;
  --rounded-box: 0.5rem;
  --rounded-btn: 0.375rem;
}`,
    },
    {
      title: 'Using theme variables in your CSS',
      description: 'All DaisyUI theme colors are available as CSS variables and Tailwind utilities.',
      lang: 'html',
      links: [
        { href: 'https://daisyui.com/docs/colors/#how-to-use', label: 'DaisyUI colors docs' },
        { href: 'https://daisyui.com/docs/utilities/#component-specific-css-variables', label: 'DaisyUI component CSS variables' },
        { href: 'https://tailwindcss.com/docs/theme', label: 'Tailwind theme docs' },
      ],
      code: `<!-- Tailwind utility classes -->
<div class="bg-primary text-primary-content p-4">
  Primary background
</div>

<div class="bg-base-200 border border-base-300 rounded-box p-4">
  Themed card
</div>

<!-- CSS variables -->
<style>
.my-element {
  background: var(--color-primary);
  color: var(--color-primary-content);
  border-radius: var(--rounded-btn);
}
</style>`,
    },
  ],
} satisfies DocPageData
