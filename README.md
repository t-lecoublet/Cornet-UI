<div align="center">
  <img src="./public/logoLong.svg" alt="Cornet logo" width="320" />
</div>

<h1 align="center">Cornet</h1>

<p align="center">
  Vue 3 component library built on
  <a href="https://daisyui.com/">DaisyUI 5</a> and
  <a href="https://tailwindcss.com/">Tailwind CSS 4</a>.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/cornet-ui">
    <img src="https://img.shields.io/npm/v/cornet-ui?color=cb3837&label=npm" alt="npm version" />
  </a>
  <a href="https://www.npmjs.com/package/cornet-ui">
    <img src="https://img.shields.io/npm/dm/cornet-ui?color=informational&label=downloads" alt="npm downloads" />
  </a>
  <a href="https://cornet-ui.com/">
    <img src="https://img.shields.io/badge/docs-cornet--ui.com-0ea5e9" alt="documentation" />
  </a>
  <a href="./LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-22c55e" alt="license MIT" />
  </a>
</p>

<p align="center">
  <strong>Documentation & live previews:</strong>
  <a href="https://cornet-ui.com/">cornet-ui.com</a>
</p>

---

## Why Cornet?

**Cornet** (formerly `daisyui-vue-kit`) adds a Vue-native layer on top of DaisyUI:

- typed props / emits / slots
- ready-to-use Vue components (`DuButton`, `DuSelect`, `DuModal`, ...)
- composables and centralized exports
- optional Vite plugin to reduce shipped CSS
- flexible distribution:
  - **npm package mode**
  - **embedded source mode** (local editable library in your project)

---

## Installation

Cornet supports multiple workflows:

| Mode | Command / Source | Best for |
|------|------------------|----------|
| **npm package** (recommended) | `npm install cornet-ui` | Standard dependency management |
| **Git submodule (GitLab source)** | `git submodule add -b lib git@gitlab.limos.fr:hub-isima/daisyui-vue-kit.git lib` | Full local control and customization |
| **Git submodule (GitHub mirror)** | `git submodule add -b lib https://github.com/t-lecoublet/Cornet.git lib` | GitHub-only workflows |
| **Full clone** | `git clone --recurse-submodules <repo-url>` | Contributing / exploration |

### Embedded mode (`file:lib`)

If you use submodule mode, add a local dependency:

```json
{
  "dependencies": {
    "cornet-ui": "file:lib"
  }
}
```

> In embedded/source mode, Cornet ships raw `.ts` / `.vue` source files.  
> A compatible bundler setup is required (Vite + Vue plugin recommended).

---

## Quick start

### 1) Configure Vite

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import cornetPlugin from 'cornet-ui/plugin-vite'

export default defineConfig({
  plugins: [cornetPlugin(), vue(), tailwindcss()],
})
```

> `cornetPlugin()` is optional — it tree-shakes unused component CSS. Without it, Cornet still works and ships the full CSS.

### 2) Import CSS

```css
/* src/main.css */
@import "tailwindcss";
@plugin "daisyui";
@import "cornet-ui/css";
```

### 3) Use a component

```vue
<script setup lang="ts">
import { DuButton } from 'cornet-ui'
</script>

<template>
  <DuButton variant="primary">Hello Cornet</DuButton>
</template>
```

---

## Types

Types are available from:

- `cornet-ui`
- `cornet-ui/types`

```ts
import type { MenuItem, SELECTProps } from 'cornet-ui/types'
```

---

## Peer dependencies

- `vue` >= 3.5
- `daisyui` >= 5.5
- `tailwindcss` >= 4.0
- `vite` >= 6.0 (required for plugin, recommended for embedded/source mode)

---

## Repository model (GitLab + GitHub)

Cornet is maintained across two platforms:

- **Primary source (CNRS/LIMOS GitLab):**  
  https://gitlab.limos.fr/hub-isima/daisyui-vue-kit
- **Public mirror (GitHub):**  
  https://github.com/t-lecoublet/Cornet

### Issues and contributions

- If your team uses CNRS/LIMOS workflows, open issues/MRs on GitLab.
- If your team uses GitHub workflows, open issues/PRs on GitHub.
- Maintainers can sync changes between both platforms depending on constraints.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

---

## License

[MIT](./LICENSE)
