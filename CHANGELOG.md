# Changelog

All notable changes to Cornet are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/) and the project follows [Semantic Versioning](https://semver.org/).

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
