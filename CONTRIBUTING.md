# Contributing to Cornet

Thanks for your interest in Cornet!

## Where to contribute

- **Source of truth:** [GitLab LIMOS](https://gitlab.limos.fr/hub-isima/daisyui-vue-kit) — merge requests and CI run here.
- **GitHub mirror:** [t-lecoublet/Cornet](https://github.com/t-lecoublet/Cornet) — issues are welcome here; pull requests will be re-routed to GitLab by a maintainer.

## Getting started

```bash
git clone --recurse-submodules git@gitlab.limos.fr:hub-isima/daisyui-vue-kit.git
cd daisyui-vue-kit/lib   # or work directly on the `lib` branch
npm install
```

The green bar before any merge request:

```bash
npm run lint        # ESLint (flat config)
npm run type-check  # vue-tsc, strict
npm test            # Vitest
npm run build       # dist build (vite + declaration emit)
```

## Project conventions

- **One component = three files** in `components/{Category}/du-{name}/`:
  `du-{name}.vue`, `du-{name}.types.ts`, `du-{name}.stories.ts`. Never skip one.
- Components are prefixed `Du` (`DuButton`); types live in the `.types.ts`
  file, constants in `UPPER_SNAKE_CASE`, files in `kebab-case`.
- Export every new component from `index.ts`, then run
  `npm run generate:types` to refresh `types/index.ts` (CI fails on drift).
- Use the `useSizeMapping` / `useVariantMapping` composables for the common
  `size` / `variant` props.
- Default UI texts are in English and must be overridable via props or slots.
- Code comments are in English.
- Follow [Conventional Commits](https://www.conventionalcommits.org/)
  (`feat:`, `fix:`, `refactor:`, `chore:`, with `!` for breaking changes).

## Accessibility

New interactive components should follow the
[WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/):
keyboard navigation, visible focus, `aria-*` attributes, and configurable
accessible labels for icon-only controls.

## Releases (maintainers)

1. Update `CHANGELOG.md` and bump `version` in `package.json`.
2. Tag `vX.Y.Z` and push the tag to GitLab.
3. The manual `publish` CI job publishes to npm (`prepack` switches the
   package to the compiled `dist/` entry points automatically).
