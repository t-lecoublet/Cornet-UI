<div align="center">
  <img src="./public/logoLong.svg" alt="Cornet logo" width="320" />
</div>

<h1 align="center">Cornet UI</h1>

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

## Why Cornet UI?

**Cornet UI** (formerly `daisyui-vue-kit`) adds a Vue-native layer on top of DaisyUI:

- typed props / emits / slots
- ready-to-use Vue components (`DuButton`, `DuSelect`, `DuModal`, ...)
- composables and centralized exports
- optional Vite plugin to reduce shipped CSS
- flexible distribution:
  - **npm package mode** — compiled distribution, standard dependency
  - **embedded source mode** — raw `.vue` / `.ts` files, local editable library

---

## Repository structure

This repository (`master` branch) is an **integration app and live examples** — a Vite + Vue project that consumes the library and serves as its public-facing landing page.

| Where | Role |
| ----- | ---- |
| **`master` branch** (this repo) | Public-facing branch: examples, integration app, repo landing page |
| **`lib` branch** | Library source: components, composables, types, build config |
| **npm (`cornet-ui`)** | Compiled distribution built in CI — standard package consumption |
| **GitLab** | Technical source of truth: CI, merge requests, primary development |
| **GitHub** | Public mirror: issues, pull requests, community hub |

> Cornet UI was formerly named `daisyui-vue-kit`; some historical repository URLs still contain that name.

---

## How Cornet UI is distributed

Cornet UI supports two distinct distribution modes:

- **npm mode**: compiled output built in CI, published to the npm registry. Use this for standard dependency management — you consume the built artifacts, not the raw source.
- **embedded/source mode**: raw `.vue` / `.ts` files consumed directly via `file:lib` or a Git submodule. Use this for local control and customization — your bundler processes the source as part of your own project.

---

## Installation

Cornet UI supports multiple workflows:

| Mode | Command / Source | Best for |
|------|------------------|----------|
| **npm package** (recommended) | `npm install cornet-ui` | Standard dependency management |
| **Git submodule (GitLab source)** | `git submodule add -b lib git@gitlab.limos.fr:hub-isima/daisyui-vue-kit.git lib` | Full local control and customization |
| **Git submodule (GitHub mirror)** | `git submodule add -b lib https://github.com/t-lecoublet/Cornet-UI.git lib` | GitHub-only workflows |
| **Full clone** | `git clone --recurse-submodules <repo-url>` | Contributing / exploration |

### Which mode should I choose?

- **npm** — for most projects: install once, update with `npm update`
- **embedded source** — when you need to customize components or use `file:lib` locally
- **GitLab submodule** — for CNRS/LIMOS workflows where GitLab is your primary platform
- **GitHub submodule** — for GitHub-only workflows

### Embedded mode (`file:lib`)

If you use submodule mode, add a local dependency:

```json
{
  "dependencies": {
    "cornet-ui": "file:lib"
  }
}
```

> In embedded/source mode, Cornet UI ships raw `.ts` / `.vue` source files.  
> A compatible bundler setup is required (Vite + Vue plugin recommended).

---

## Quick start

### 1) Configure Vite

Minimal setup — just add the Vue plugin and Tailwind CSS:

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
})
```

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

### 4) Optional: enable `cornetPlugin()` for smaller CSS

The Vite plugin tree-shakes unused component CSS. Without it, Cornet still works and ships the full CSS.

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

---

## Types

Types are available from:

- `cornet-ui`
- `cornet-ui/types`

```ts
import type { DuMenuItemData, DuSelectProps } from 'cornet-ui/types'
```

---

## Peer dependencies

- `vue` >= 3.5
- `daisyui` >= 5.5
- `tailwindcss` >= 4.0
- `vite` >= 6.0 (required for plugin, recommended for embedded/source mode)

---

## Repository model (GitLab + GitHub)

Cornet UI is maintained across two platforms:

- **Primary source (CNRS/LIMOS GitLab):**  
  <https://gitlab.limos.fr/hub-isima/daisyui-vue-kit>
- **Public mirror (GitHub):**  
  <https://github.com/t-lecoublet/Cornet-UI>

### Where to contribute

- **Component contributions** (new components, fixes, types, tests): target the [`lib` branch on GitLab](https://gitlab.limos.fr/hub-isima/daisyui-vue-kit/-/tree/lib)
- **Issues and bug reports**: open on [GitLab](https://gitlab.limos.fr/hub-isima/daisyui-vue-kit/-/issues) or [GitHub](https://github.com/t-lecoublet/Cornet-UI/issues) — both are monitored
- **Pull requests on GitHub**: welcome — maintainers sync changes between both platforms

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

---

## License

[MIT](./LICENSE)
