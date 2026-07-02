# Cornet - DaisyUI Vue Kit

Vue 3 component library based on DaisyUI 5 and Tailwind CSS 4.

## All rules

All rules are in the `./rules/` directory next to this file. Each rule has a `.md`. Each component rule has a `.md` file in the `rules/components/` directory.

## Complete component documentation

@cornet-llm.txt

## Naming conventions

- All components are prefixed with `Du`: DuButton, DuModal, DuSelect
- Exported TypeScript types are PascalCase and component-scoped: `Du{Component}Props`, `Du{Component}Size`, `Du{Component}Variant`
- Type constants stay UPPERCASE: `BUTTON_SIZES`, `MODAL_PLACEMENTS`
- Files: `du-{name}.vue`, `du-{name}.types.ts`, `du-{name}.stories.ts`

## Component file structure

```
components/{Category}/du-{name}/
├── du-{name}.vue           # Vue component
├── du-{name}.types.ts      # TypeScript types
└── du-{name}.stories.ts    # Storybook stories
```

**Categories:** Actions, DataDisplay, DataInput, Feedback, Layout, Navigation

## Common props for most components

- `size`: Size = `'default'` | `'xs'` | `'sm'` | `'md'` | `'lg'` | `'xl'`
- `variant`: Variant = `'default'` | `'neutral'` | `'primary'` | `'secondary'` | `'accent'` | `'info'` | `'success'` | `'warning'` | `'error'`
- `customClass`: string - Custom CSS classes
- `disabled`: boolean - Component disabled state

## Before modifying any component

1. ALWAYS read the complete `.vue` source file
2. Check the associated `.types.ts` file
3. Review the `.stories.ts` stories to understand use cases
4. Modify in this order: types -> component -> stories

## Exports

- **Main entry point:** `index.ts` exports all components and composables
- **Types:** `types/index.ts` exports all types (auto-generated)
- **CSS:** `index.css`
- **Vite Plugin:** `plugin-vite.ts`

## Tech stack

- Vue 3.3+ (Composition API, `<script setup>`)
- TypeScript 5.8+
- DaisyUI 5.5+
- Tailwind CSS 4+
- Vite 6+
