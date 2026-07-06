# Cornet — source reference

This is the **source branch** of Cornet, a Vue 3 component library built on [DaisyUI 5](https://daisyui.com/) and [Tailwind CSS 4](https://tailwindcss.com/).

You are reading this because you either:
- added `lib` as a **Git submodule** and want to understand or modify the source
- are **contributing** to the library

For installation instructions and usage examples, see the [main README](https://github.com/t-lecoublet/Cornet-UI/blob/master/README.md) or [cornet-ui.com](https://cornet-ui.com).

---

## Repository layout

```
lib/
├── index.ts              # Single entry point — re-exports everything
├── index.css             # CSS entry (@source inline safelist)
├── plugin-vite.ts        # Optional Vite plugin (CSS tree-shaking)
├── types/
│   └── index.ts          # Auto-generated — run `npm run generate:types`
├── composables/
│   ├── useSizeProps.ts   # size prop → DaisyUI modifier class
│   └── useVariantProps.ts # variant prop → DaisyUI color class
└── components/
    ├── Actions/           # DuButton, DuDropdown, DuModal, DuSwap, DuFab
    ├── DataDisplay/       # DuCard, DuTable, DuBadge, DuAvatar, …
    ├── DataInput/         # DuSelect, DuInputField, DuCheckbox, …
    ├── Feedback/          # DuAlert, DuToast, DuLoading, …
    ├── Layout/            # DuDrawer, DuJoin
    └── Navigation/        # DuMenu, DuNavbar, DuTabs, DuPagination, …
```

---

## Component anatomy

Every component lives in `components/{Category}/du-{name}/` and always consists of exactly three files:

```
du-{name}.vue          # The Vue component (Composition API, <script setup>)
du-{name}.types.ts     # TypeScript types and DaisyUI class constants
du-{name}.stories.ts   # Storybook stories
```

### Example — `DuButton`

**`du-button.types.ts`** — declares the DaisyUI class lists and derives TypeScript types from them:

```ts
export const BUTTON_SIZES = ['btn-xs', 'btn-sm', 'btn-md', 'btn-lg', 'btn-xl'] as const
export type BUTTONSize = (typeof BUTTON_SIZES)[number]
```

**`du-button.vue`** — uses `withDefaults(defineProps<{...}>(), {...})`, applies composables for `size` and `variant`, then assembles the class list on a dynamic `<component :is="...">`:

```vue
<script setup lang="ts">
const { sizeClass } = useSizeMapping(props, 'btn')
const { colorClass } = useVariantMapping(props, 'btn')
</script>

<template>
  <component :is="elementTag" :class="['btn', sizeClass, colorClass, ...]">
    <slot />
  </component>
</template>
```

**`du-button.stories.ts`** — standard Storybook meta + story objects, reusing the composable controls:

```ts
argTypes: {
  ...useVariantStoriesControl,
  ...useSizeStoriesControl,
}
```

---

## Composables

Two composables handle the two props shared by almost every component.

### `useSizeMapping(props, suffix)`

Maps `size: Size` → a DaisyUI modifier class.

```ts
// useSizeMapping(props, 'btn') with size='lg' → 'btn-lg'
// useSizeMapping(props, 'badge') with size='sm' → 'badge-sm'
// size='default' → '' (no class added)
const { sizeClass } = useSizeMapping(props, 'btn')
```

`Size = 'default' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'`

### `useVariantMapping(props, suffix)`

Maps `variant: Variant` → a DaisyUI color class.

```ts
// useVariantMapping(props, 'btn') with variant='primary' → 'btn-primary'
// variant='default' → '' (no class added)
const { colorClass } = useVariantMapping(props, 'btn')
```

`Variant = 'default' | 'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error'`

Both composables also export `useSizeStoriesControl` / `useVariantStoriesControl` — ready-made Storybook `argTypes` objects to spread into stories.

---

## Adding a component

1. **Create the three files** in `components/{Category}/du-{name}/`
2. **Types file** — declare your DaisyUI class constants and derive types from them
3. **Vue file** — use `useSizeMapping` / `useVariantMapping` for `size` / `variant`; default them to `'default'`
4. **Stories file** — spread `useSizeStoriesControl` and `useVariantStoriesControl` into `argTypes`
5. **Export** the component from `index.ts`
6. **Regenerate types**: `npm run generate:types` — this updates `types/index.ts`; CI fails on drift

---

## Dev commands

```bash
npm install

npm run dev          # Storybook (component development)
npm run lint         # ESLint (flat config)
npm run type-check   # vue-tsc strict
npm test             # Vitest
npm run build        # Production build (dist/ + declaration emit)
npm run generate:types  # Regenerate types/index.ts
```

---

## Modifying a component (submodule workflow)

When `lib` is a submodule in your project, changes you make here are **local** by default. To share them upstream:

1. Work in `lib/`, commit there on its own branch
2. Open a merge request on [GitLab](https://gitlab.limos.fr/hub-isima/daisyui-vue-kit) or a PR on [GitHub](https://github.com/t-lecoublet/Cornet-UI)
3. Once merged, update the submodule pointer in the parent project

See [CONTRIBUTING.md](./CONTRIBUTING.md) for conventions and the release process.

---

## License

[MIT](./LICENSE)
