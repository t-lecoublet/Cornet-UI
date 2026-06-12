import type { DocPageData } from '@/types/docs'

export default {
  title: 'Installation',
  description: 'No npm publish, no registry — just Git. Pick your setup and go.',
  category: 'Guides',
  sections: [
    {
      title: '1. Add to Your project',
      description: 'Add only the lib as a Git submodule — no npm publish needed.',
      lang: 'bash',
      links: [
        { label: 'Git submodules docs', href: 'https://git-scm.com/docs/gitsubmodules' },
      ],
      code: `git submodule add -b lib \\
  git@gitlab.limos.fr:hub-isima/daisyui-vue-kit.git lib
git submodule update --init --recursive
npm install ./lib`,
    },
    {
      title: 'Or with New project',
      description: 'Clone the full repo — Vite + Vue already wired up.',
      lang: 'bash',
      code: `git clone --recurse-submodules \\
  git@gitlab.limos.fr:hub-isima/daisyui-vue-kit.git`,
    },
    {
      title: 'Or with Nuxt',
      links: [
        { label: 'Nuxt starter repo', href: 'https://gitlab.limos.fr/hub-isima/daisyui-vue-kit-nuxt-starter' },
        { label: 'Nuxt docs', href: 'https://nuxt.com/docs/getting-started/installation' },
      ],
      description: 'Grab our ready-made Nuxt starter instead.',
      lang: 'bash',
      code: `git clone git@gitlab.limos.fr:hub-isima/daisyui-vue-kit-nuxt-starter.git`,
    },
    {
      title: '2. Add the Vite plugin (optional)',
      description: 'At build time, the plugin detects which Cornet components your app uses and excludes the unused ones from Tailwind scanning, reducing the generated CSS. It is fail-safe: without it everything still works, you just ship a bit more CSS. Options: srcDirs (source folders to scan, default [\'src\']), libPath and packageNames for custom layouts, showOutput, failOnError.',
      links: [
        { label: 'Vite plugin docs', href: 'https://vite.dev/guide/using-plugins#adding-a-plugin' },
      ],
      lang: 'ts',
      code: `// vite.config.ts
import cornetPlugin from 'cornet-ui/plugin-vite'

export default defineConfig({
  plugins: [cornetPlugin({ showOutput: true }), vue(), tailwindcss()]
})`,
    },
    {
      title: '3. Import the CSS',
      lang: 'css',
      links: [
        { label: 'Tailwind directives docs', href: 'https://tailwindcss.com/docs/functions-and-directives#import-directive' },
        { label: 'DaisyUI installation docs', href: 'https://daisyui.com/docs/install/vue' },
      ],
      code: `/* your main CSS file */
@import "tailwindcss";
@import "cornet-ui/css";
@plugin "daisyui";`,
    },
    {
      title: 'Use a component',
      lang: 'vue',
      links: [
        { label: 'Cornet button', href: '/docs/actions/button' },
        { label: 'Vue components docs', href: 'https://vuejs.org/guide/essentials/component-basics' },
      ],
      code: `import { DuButton } from 'cornet-ui'

<DuButton variant="primary">Hello World!</DuButton>`,
    },
  ],
} satisfies DocPageData
