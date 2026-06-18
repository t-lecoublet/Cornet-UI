<div align="center">
  <img src="./public/logoLong.svg" alt="Cornet Logo" width="300">
</div>

# Cornet

A Vue 3 component library built on DaisyUI 5 and Tailwind CSS 4.

> Docs: https://cornet-ui.com/

## Why

DaisyUI provides great CSS components, but not Vue-specific ones. Cornet wraps DaisyUI into fully typed Vue 3 components with proper props, slots, and v-model support — ready to drop into any Vue or Nuxt project.

Available on npm (`cornet-ui`) or as a Git submodule for full source access.

## Requirements

- [Vue 3](https://vuejs.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [DaisyUI 5](https://daisyui.com/)

## Installation

### Method 1: npm (recommended)

```bash
npm install cornet-ui
```

### Method 2: Git submodule (existing project)

Gives you full source access — modify components without forking or publishing.

```bash
git submodule add -b lib git@gitlab.limos.fr:hub-isima/daisyui-vue-kit.git lib
git submodule update --init --recursive
npm install ./lib
```

### Method 3: Clone (new project)

A Vite + Vue project with Cornet already wired up.

```bash
git clone --recurse-submodules git@gitlab.limos.fr:hub-isima/daisyui-vue-kit.git
```

### Method 4: Nuxt starter

```bash
git clone git@gitlab.limos.fr:hub-isima/daisyui-vue-kit-nuxt-starter.git
```

See the [Nuxt starter repo](https://gitlab.limos.fr/hub-isima/daisyui-vue-kit-nuxt-starter) for details.

## Setup

### 1. Add the Vite plugin (optional)

Reduces generated CSS by only scanning the Cornet components you actually use.

```js
// vite.config.js
import cornetPlugin from 'cornet-ui/plugin-vite'

export default defineConfig({
  plugins: [cornetPlugin({ showOutput: true }), vue(), tailwindcss()]
})
```

### 2. Import the CSS

```css
/* your main CSS file */
@import "tailwindcss";
@import "cornet-ui/css";
@plugin "daisyui";
```

### 3. Use a component

```vue
<script setup>
import { DuButton } from 'cornet-ui'
</script>

<template>
  <DuButton variant="primary">Hello World!</DuButton>
</template>
```

## Storybook

The library includes Storybook stories for every component.

See the [Storybook docs](https://storybook.js.org/docs) for installation.

> Note: Storybook v9 is not compatible with Nuxt — use Vite Storybook instead, or Storybook v8 in Nuxt projects.
