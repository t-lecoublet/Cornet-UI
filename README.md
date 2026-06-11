# Cornet

> Vue 3 component library built on [DaisyUI 5](https://daisyui.com/) and [Tailwind CSS 4](https://tailwindcss.com/).

**Cornet** (formerly `daisyui-vue-kit`) provides 55+ typed components (`DuButton`, `DuSelect`, `DuModal`, …), composables, and a Vite plugin. It is designed to work both as a **regular package** and as **embedded source** copied directly into your project — readable, modifiable, no build step required.

📖 Documentation & live previews: **[cornet-ui.com](https://cornet-ui.com)**

## Installation

Cornet is distributed in several ways — pick the one that fits your workflow:

| Mode | How | Best for |
|------|-----|----------|
| **Git submodule (embedded)** | `git submodule add -b lib git@gitlab.limos.fr:hub-isima/daisyui-vue-kit.git lib` | Full control, local modifications |
| **Full clone** | `git clone --recurse-submodules git@gitlab.limos.fr:hub-isima/daisyui-vue-kit.git` | Contributing, exploring |
| **GitHub mirror** | [t-lecoublet/Cornet](https://github.com/t-lecoublet/Cornet) | GitHub-based workflows |
| **npm registry** | _coming soon_ (`cornet-ui`) | Classic dependency management |

> **Note:** the source distribution ships raw `.ts`/`.vue` files (ESM only). Your project needs Vite (or another bundler) with `@vitejs/plugin-vue` and TypeScript.

After adding the submodule, declare the local dependency:

```json
{
  "dependencies": {
    "cornet-ui": "file:lib"
  }
}
```

## Quick start

```ts
// vite.config.ts
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
})
```

```css
/* main.css */
@import "tailwindcss";
@plugin "daisyui";
@import "cornet-ui/css";
```

```vue
<script setup lang="ts">
import { DuButton } from 'cornet-ui'
</script>

<template>
  <DuButton variant="primary">Hello Cornet</DuButton>
</template>
```

Types are available from the main entry or from `cornet-ui/types`:

```ts
import type { MenuItem, SELECTProps } from 'cornet-ui/types'
```

## Peer dependencies

- `vue` >= 3.5
- `daisyui` >= 5.5
- `tailwindcss` >= 4.0
- `vite` >= 6.0 (optional — required for the Vite plugin and source mode)

## Project structure

```
lib/
├── index.ts          # All components & composables
├── index.css         # CSS entry
├── plugin-vite.ts    # Optional Vite plugin (unused-component CSS exclusion)
├── types/index.ts    # All TypeScript types (generated)
├── composables/      # useSizeMapping, useVariantMapping
└── components/       # Actions, DataDisplay, DataInput, Feedback, Layout, Navigation
```

Every component follows the same triplet: `du-{name}.vue` + `du-{name}.types.ts` + `du-{name}.stories.ts`.

## Repositories

- **Source of truth:** [GitLab LIMOS](https://gitlab.limos.fr/hub-isima/daisyui-vue-kit) (CNRS/LIMOS)
- **Mirror:** [GitHub — t-lecoublet/Cornet](https://github.com/t-lecoublet/Cornet)

## License

[MIT](./LICENSE)
