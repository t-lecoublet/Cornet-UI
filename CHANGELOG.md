# Changelog

All notable changes to Cornet are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/) and the project follows [Semantic Versioning](https://semver.org/).

## [0.1.0-beta.9] - 2026-06-15

### Added
- Opt-in CSS tree-shaking on npm installs. Add `cornetPlugin()` to your
  `vite.config` and Cornet generates only the CSS of the components your app
  imports (e.g. a one-button app drops from ~200 KB to ~32 KB of Cornet CSS).
  It works by rewriting the package's `index.css` to an `@source inline(...)`
  safelist of the used components for the duration of the build, then
  restoring it — the same reliable mechanism the embedded mode uses. The
  package ships `dist/cornet-tw.json` (per-component classes + dependency
  graph) for this. Without the plugin, the full class list still ships, so
  nothing breaks.

## [0.1.0-beta.7] - 2026-06-15

### Changed
- The npm package now follows the standard Tailwind-component-library model
  and ships **compiled output only** — no raw sources. Your Tailwind +
  daisyUI generate Cornet's classes by scanning a single generated class
  list: the published `index.css` declares `@source "./dist/cornet-classes.txt"`.
  That file is produced at build time with Tailwind's own scanner
  (`@tailwindcss/oxide`), so it matches exactly what Tailwind would extract
  from the sources. As with other Tailwind component libraries (e.g.
  Flowbite), the component CSS is shipped whole — Tailwind only keeps what
  your build references.
- The Vite plugin is now an **embedded-mode optimization only**: in the
  git/submodule layout it tree-shakes unused components via `@source not`
  (and restores `index.css` after the build). On an npm install it is a
  no-op, so there is no file mutation in `node_modules`.
- Replaced the earlier per-component `dist/tw/` approach (and its index.css
  rewriting in npm mode), which depended on Tailwind read-timing that is not
  guaranteed and could ship components unstyled.

## [0.1.0-beta.6] - 2026-06-12

### Fixed
- npm installs rendered components without any styling: Tailwind ignores
  node_modules during automatic source detection, so none of Cornet's class
  literals were ever scanned. The shipped `index.css` now declares an
  explicit `@source` directive, which overrides that exclusion.

## [0.1.0-beta.1] - 2026-06-11

First release under the **cornet-ui** name (formerly `daisyui-vue-kit`).

### Changed (breaking)
- Package renamed `daisyui-vue-kit` → `cornet-ui`. Update your imports and the `file:lib` dependency key.
- Default UI texts are now in English (`DuSelect`: "Select...", "Search...", "No options found"; `DuSearch`: "Add", "No results"). All texts are overridable via props (`placeholder`, `searchPlaceholder`, `searchNoResultsText`, `removeItemLabel`, `addOptionText`, `noResultsText`) or slots.
- `useVariantMapping` now returns `''` for the `'default'` variant instead of generating non-existent classes like `btn-default` (aligns with the documented contract and `useSizeMapping`).
- Vite plugin rewritten (`cornetPlugin`, deprecated alias `vueDaisyUI` kept):
  - no longer depends on a hardcoded `./lib` path — works for npm installs, submodules and custom layouts (`libPath`/`srcDirs`/`packageNames` options);
  - detection logic integrated in TypeScript (no more spawned script, `glob` dependency removed);
  - `index.css` is restored to its committed content after each build (no more git noise, no timestamps);
  - namespace imports (`import * as`) are detected and disable exclusions (fail-safe);
  - components used internally by other components are no longer wrongly excluded (e.g. `DuButton` styles kept when only `DuFab` is imported).

### Added
- MIT license.
- Compiled distribution for npm: `npm run build` produces `dist/` (per-module ESM + `.d.ts` + injected component styles); `prepack` switches the published package to `dist/` entry points while the repo keeps source entry points for the embedded mode.
- `DuTableItem` and `DuMenuItem` exported from the main entry.
- All types re-exported from the main entry (`import type { MenuItem } from 'cornet-ui'`).
- Missing type exports added (`du-fab`, `du-stats`, `du-drawer`, `du-label-input-validator`, `SearchOption`, `PlacementValue`, ...) and the generator (`types/types.sh`) fixed to handle `interface X extends Y`.
- Typed `defineEmits` in `DuSwap`, `DuSelect`, `DuSearch`, `DuDock`.
- `DuFab`: `position` prop properly declared (`'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'`).
- Tooling: standalone `tsconfig.json` (strict type-check), ESLint flat config, Vitest suite (composables, Vite plugin, DuSelect).

### Fixed
- Type errors revealed by the first-ever full type-check (du-dropdown, du-chat-item, du-fab, types/index).
- Debug `console.log` removed from `DuRating`.
- Dead code removed (`DuCountdownGroup` unused computation).
