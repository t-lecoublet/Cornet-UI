# Changelog

All notable changes to Cornet are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/) and the project follows [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Removed (breaking)

- `DuFab`: the `position` prop has been removed. A FAB is now always positioned in the bottom-right corner (standard FAB placement) when `absolute` is `true`.

### Changed (breaking)

- Public type names across all `.types.ts` files have been normalized to the `Du{Component}{Name}` PascalCase convention (e.g. `MenuItem` → `DuMenuItemData`, `SELECTProps` → `DuSelectProps`, `BUTTONSize` → `DuButtonSize`, `PlacementValue` → `DuDropdownPlacementValue`). Update any type imports from `cornet-ui` / `cornet-ui/types` accordingly.

### Added

- `DuMenu`: arrow-key and Home/End keyboard navigation between sibling items, correctly scoped per nesting level (a horizontal root with vertical submenus now uses the right axis at each level). Items without `href` (driven purely by `onClick`) are now focusable.
- `DuDrawer`: pressing Escape now closes an open drawer; opening moves focus into the sidebar, and closing restores focus to whatever was focused before.
- `DuDropdown` / `DuMenu` / `DuTabs` / `DuFab`: icon/image props now also accept root-relative local asset paths (e.g. `/logo.svg`), not just absolute `http(s)` URLs.
- `DuDropdown`: `.dropdown-content` now has a default `bg-base-100 rounded-box shadow-sm`, and `DuMenu` always keeps its own background regardless of dropdown context (previously `DuMenu` suppressed its own background when nested in a dropdown, assuming the dropdown supplied one — it never did).

### Fixed

- `DuDropdown`: the object form of `placement` (e.g. `{ top: true, end: false }`) now correctly applies only the keys set to `true` (previously applied every key present regardless of its value).
- `DuTabs`: clicking a tab no longer fires `onClick` / `update:modelValue` twice (native label→radio-input click forwarding was double-firing it).
- `plugin-vite`: `scanSourceContent` no longer mis-parses `//` or `/* */` comments inside a named-import block as part of the next component's name.

## [0.1.0-beta.10] - 2026-06-15

### Fixed
- Per-component class lists were corrupted: the candidate generator reused a
  single `@tailwindcss/oxide` Scanner across all components, and the Scanner
  is stateful (emits each candidate only once), so a class shared by several
  components was assigned only to whichever was scanned first. With the Vite
  plugin enabled this could drop real classes — e.g. a DuModal-only app would
  lose `.btn` for its action buttons. Each component is now scanned with a
  fresh Scanner.
- Tree-shaken builds no longer leak unrelated form-component classes
  (`input`, `checkbox`, `radio`, `select`, …). Those bare names appear as
  plain string literals in other components (DuButton can render as
  `<input type="radio">`), which Tailwind's scanner cannot distinguish from
  classes. A bare ambiguous base class is now kept only when the component
  also uses one of its modifiers (`input-bordered`, `checkbox-primary`, …) —
  a real user always styles it, a string literal does not. This keeps
  `input` for DuSelect/DuSearch (which render `class="input ..."`) while
  dropping it from DuButton.
- Cross-component dynamic classes are no longer dropped when tree-shaking.
  `useSizeMapping(props, 'X')` / `useVariantMapping(props, 'X')` build classes
  like `X-md` / `X-primary` at runtime, and the literals may belong to another
  component (DuSelect renders a `menu` and sizes it with `menu-sm`…`menu-xl`,
  which live in DuMenu). Those calls are now parsed and their full modifier
  sets added, so e.g. a DuSelect-only build keeps the `.menu-{size}` rules
  that pad its dropdown list items.

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
