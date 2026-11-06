# Cornet-UI — Roadmap

> **Cornet-UI is in beta.** Breaking changes are expected and embraced until v1.0.
> This roadmap tracks the industrialization of the library: stronger typing, real accessibility, serious test coverage, and a two-layer architecture — **internal headless primitives** (`core/`) powering **DaisyUI-styled facades** (`du-*`).

---

## Vision

```
┌──────────────────────────────────────────────────────────┐
│  du-* facades — DaisyUI markup, variants, sizes          │  ← public API
├──────────────────────────────────────────────────────────┤
│  core/ headless primitives — state, keyboard, focus,     │  ← internal, zero CSS,
│  dismiss, positioning, ARIA prop bags                    │     zero npm dependency
└──────────────────────────────────────────────────────────┘
```

### Guiding principles

- **Zero `any`** — generics (`generic="O, V"`) wherever user data flows through a component
- **WAI-APG compliant ARIA**, applied through *prop bags* provided by `core/` (`v-bind="triggerProps"`), never hand-rolled in facades
- **Ids via `useId()`** — `Math.random()` is banned (SSR-safe)
- **State styled through data-attributes** (`data-open`, `data-highlighted`, ...), not class ternaries
- **One `core/` primitive** for every popup / dismiss / focus / keyboard behavior — no local reimplementations, and document-level listeners live only while the popup is open
- **A verification tool is pointed at the library, not configured until it goes quiet** — every exemption carries its reason, and an allowlist for a scheduled fix expires on its own
- **Test bar** — every interactive component ships black-box tests covering v-model, emits, full keyboard support, and ARIA attributes
- **Tailwind scanner invariant** — class constants exported from `.types.ts` files (embedded mode) are maintained on all new markup

> Full conventions live in `docs/architecture.md` (deliverable of Phase 2).

---

## Phase 1 — Combobox engine + DuSelect / DuSearch rewrite

> The founding effort: it introduces `core/` and sets the standards.
> **Done.** `PLAN-REFONTE-COMBOBOX.md` planned this phase around vendoring a third-party engine; that approach was dropped mid-flight for an in-house implementation, so the document is kept only as an archive of the original intent.

- [x] **1.1** — Write the engine as original Cornet code in `core/combobox/`: one closure (`useCombobox.ts`, ~840 lines — selection, filtering, creatable entry, highlight, keyboard, popup lifecycle, commit-on-close, focus, CSS anchor positioning, ARIA prop bags, validation), plus pure DOM helpers (`dom.ts`), `types.ts` and an internal barrel. No dependency, no third-party code.
- [x] **1.2** — Engine behaviors beyond the base pattern: external filtering (`externalFilter`), creatable option, commit-on-close (`commitOnClose`), results limit, disabled options, select/remove/create callbacks — **103 tests** (`core-combobox.spec.ts` + `core-combobox-dom.spec.ts`)
- [x] **1.3** — Rewrite **DuSelect** as a thin facade over the engine (generics, ARIA prop bags, full keyboard support, validation, Popover API) — 50 tests
- [x] **1.4** — Rewrite **DuSearch** (canonical combobox-input pattern, creatable, chips-based multi mode) — 42 tests
- [x] **1.5** — Tailwind scanner audit, breaking-changes changelog, removal of the 12 legacy composables
- [ ] **1.6** — A11y audit still owed: axe on the stories + a screen-reader pass on both components

> **Exit criteria:** two reference components, a fully tested engine, conventions proven on the hardest case. Met — 420 tests across the library, `core/` holds zero `any` and zero CSS.

## Phase 2 — Cross-cutting foundation

> Generalize what Phase 1 established, without touching component behavior.

- [x] **2.1** — `docs/architecture.md`: two layers and what each may import, when a `core/` primitive is worth extracting, generics, naming, the controllable-state contract, ids, ARIA, data-attribute styling, the Tailwind scanner rule and the test bar. It marks the rules not yet applied everywhere instead of describing an ideal library
- [x] Engine moved to `components/core/`; its document listeners are attached on open and removed on close, with a dedicated test on the subscription itself. `components/core/shared/` holds `useComponentId`.
- [x] **2.2** — Extract reusable primitives out of `core/combobox/` — **one at a time, only when a second consumer actually needs one** (the engine is a single closure by design, so each extraction is a split, not a move):
  - `core/popover/` — open/close, click-outside, `clickOutsideFilter` (reintroduced), Popover API
  - `core/positioning/` — CSS anchor positioning
  - `core/focus/` — focus trap, focus return, generalized "focus past this container"
  - `core/navigation/` — generic roving index / highlight
  - Done for the consumers that arrived: `popover/usePopoverState`, `positioning/useAnchorPosition`, `shared/useControllableState` (DuDropdown) and `navigation/useRovingIndex` (DuMenu), with 62 tests of their own. The engine leans on the first two and its 96 tests passed with no assertion touched
  - `core/focus/` adds `useFocusReturn` — which `useDrawerDismiss` had rewritten by hand, and now calls — and `useFocusTrap`, written ahead of its consumer: it lands on the drawer's overlay mode in Phase 3, where Tab currently walks out of the open panel into the page behind it. A native `<dialog>` needs no trap, so DuModal will only want the return
- [x] **2.3** — `Math.random()` eradicated (du-accordion, du-collapse, du-filter, du-rating, `useDrawerClasses`), all five through `core/shared/useComponentId`, with `tests/generated-ids.spec.ts` asserting no collision between instances and determinism across renders. Two bugs surfaced: DuAccordion's literal `name: 'accordion'` default made two accordions on a page share one radio group, and DuCollapse provided a `collapseId` nobody injected
- [x] **2.4** — Typing pass: zero `any` in shipped code, with `no-explicit-any` an error (`.stories.ts` excluded). `icon` / `figure` / `actions` share one `IconSource` type; index signatures are `unknown`. DuTable, DuTimeline, DuChat and DuMenu are generic over their item type — DuList turned out to have no `items` prop at all, so there was nothing to make generic there
- [x] **2.4b** — `tests/` is type-checked. A test is the only place a component is used the way a consumer uses it, so it is the only place a props type is exercised at all — and turning it on found `DuTableColumn.key` rejecting the ordinary way of declaring columns
- [x] **2.6** — Nested sizes: audited, nothing to do. No component that exposes `size` hardcodes a suffixed daisyUI class. DuModal and DuAlert do hardcode `btn-sm`, but neither exposes `size` and daisyUI gives neither a size scale — that is a choice of size, not a bug. The rule is written down in `docs/architecture.md` §8 for future components
- [x] **2.5** — `eslint-plugin-vuejs-accessibility` plus axe-core over a representative mount of every component (`tests/a11y.spec.ts`), both blocking in CI at `serious`/`critical`. Exemptions carry their reason inline; the four components that fail structurally carry an allowlist that expires on its own — the spec fails if a listed rule stops firing. It found five real bugs: DuInputField dropped consumer attributes entirely (fragment root, no `inheritAttrs`), DuSelect/DuSearch had no accessible name without a placeholder, DuAlert's dismiss button and DuProgress had none at all, and DuSwap's non-checkbox mode was a `<div @click>`
- [x] **2.7** — Embedded-mode control build (`npm run check:css`, blocking in CI): compiles Tailwind + daisyUI over the library sources and fails on any runtime-built class that produces no CSS rule. The class-literal invariant proves a class is scannable; this proves it exists. It caught `tooltip-neutral`, which daisyUI does not define

> **Exit criteria:** standards are tooled and enforced in CI; primitives are ready for migrations. Met.

## Phase 3 — Popup widgets on `core/` primitives

> The components that share the combobox mechanics.
> Detailed plan: `PLAN-REFACTO-GLOBAL.md`

- [x] **3.1** — **DuDropdown**: real state on `core/popover` + `core/positioning`. It had none — an `open` prop that added a class, no dismissal, no keyboard, and a `triggerProps` slot scope its own template comment promised but never provided. Now: controlled/uncontrolled `open`, outside press and Escape (returning focus), tab-out, JS-driven `hover` with delays that also opens on keyboard focus, and `popover` for the top layer
- [x] **3.2** — **DuMenu**: split by a `role` prop into a nav list (default: plain `<ul>`, native Tab, `aria-current`) and an APG menu (`menuitem` / `menuitemcheckbox`, one tab stop, arrows, typeahead, collapsible submenus). It used to wear `role="listbox"` over navigation links. `useMenuKeyboardNav` is replaced by `core/navigation/useRovingIndex`; the `onItemClick` / `onSubItemClick` props are gone (they duplicated the emits); a `MenuButton` story documents the DuDropdown pairing
- [x] **3.3** — **DuTooltip**: `role="tooltip"` on a real element, `aria-describedby` wired onto the first focusable in the slot, hover **and** keyboard-focus triggers, Escape dismiss, `openDelay` / `closeDelay`, hoverable tip, optional top layer. The `data-tip` attribute had to go: daisyUI reveals a tip from it on `:hover` alone, instantly and undismissably, so no amount of JS could own the timing while it was set
- [x] **3.4** — **DuModal**: checked and deliberately left alone. `showModal()` already gives the top layer, an inert background, the focus trap and the focus return; `@close` already emits `update:open` on every close path; axe reports nothing. `initialFocus` and an automatic `aria-labelledby` would be conveniences, not fixes
- [x] **3.5** — **DuDrawer**: `useDrawerDismiss` deleted, `useDrawerOpenState` on `useControllableState`, dismissal on `core/popover`, and the floating sidebar is now a real dialog — `role="dialog"`, `aria-modal`, focus trapped, background `inert`, focus handed back. Pinned and floating are told apart by matching the same breakpoint in JS, because the difference is behavioural and CSS cannot express it. `open` / `modelValue` lose their `false` defaults so the controlled contract can tell them apart
- [x] **3.6** — **DuToast**: two live regions rendered before there is anything to say (a region only announces what arrives after it exists), a module-scope `useToasts()` queue, durations with `0` meaning persistent, countdowns held on hover and focus-within and resumed where they stopped, named close buttons, and motion that honours `prefers-reduced-motion`

## Phase 4 — Selection & value widgets

- [x] **4.1** — **DuTabs**: APG tabs pattern, roving tabindex via `core/navigation`, `v-model` by stable value, `activation: automatic | manual`, per-item `disabled`. No mirror class was needed — daisyUI 5 already styles `.tab[aria-selected=true]`. The `name` prop is gone with the radios: its `"my_tabs"` default made two tab groups on a page share one
- [x] **4.2** — **DuAccordion / DuCollapse**: `<button aria-expanded>` headers naming `role="region"` panels, no hidden inputs left, `v-model` on both, `multiple` and `collapsible` on the accordion. DuCollapse turned out to be a list of *independent* disclosures rather than one panel — the difference from the accordion that neither API expressed
- [x] **4.3** — **DuFilter**: generic over its item type, `v-model` alongside the `change` emit, `<fieldset>` + `<legend>` (sr-only unless `showLegend`), named reset button. No `alwaysShowReset`: daisyUI hides `.filter-reset` with `visibility: hidden` when nothing is checked, so the prop could not have delivered
- [x] **4.4** — **DuRating**: the radio group is kept (it is the right pattern, and the browser gives the arrows) and now named, with `itemLabel` naming each star. `readonly` renders plain elements exposed as `role="img"` with the value as its name, rather than a row of disabled radios
- [x] **4.5** — **DuRange**: `valueText` → `aria-valuetext`, `ariaLabel` / `ariaLabelledby`, `ticks` → a `<datalist>`. The keyboard is the browser's and stays that way. Dual thumb remains out of scope — it needs a `core/` primitive, not a prop
- [x] **4.6** — **DuPagination**: checked, nothing to do. The labelled nav landmark, `aria-current="page"`, i18n labels and non-focusable `aria-hidden` ellipses were all already there, with 16 tests and no `any`
  - ⚠️ *Correction (5.6)*: "nothing to do" missed §5. `modelValue` defaulted to `1` and the clicks only emitted, so a pagination without `v-model` never changed page. It now goes through `useControllableState`

## Phase 5 — Data display & polish

- [x] **5.1** — **DuTable**: generic over the row type (done in Phase 2), plus a `<caption>` and `scope="col"` on every header cell — it had neither. Sorting and selection remain out of scope; if they land they get a `core/table`, not a bigger facade
- [x] **5.2** — **DuCarousel**: `role="region"` + `aria-roledescription="carousel"` + a name, a named `role="group"` per slide, `tabindex="0"` on the strip (a scrollable region nothing inside can focus cannot be scrolled by keyboard at all), and optional named prev/next buttons. Auto-play was never implemented, so its pause button is not owed yet — the day it lands, it is mandatory (WCAG 2.2.2)
- [x] **5.3** — Hygiene pass: `role="timer"` on the countdown, the missing bounds on the radial progressbar, `aria-current="step"` on steps, DuDock as a named `<nav>` with `aria-current`, and a `label` on DuLoading / DuSkeleton / DuStatus which are `aria-hidden` without one. Plus the form plumbing: one error surface over native validation (`useNativeValidation`), and a DuFileInput that finally reports what was chosen
- [x] **5.5** — `tests/template-root-invariant.spec.ts`: no template may open with a comment. It adds a vnode, Vue only inherits attributes onto a single root, and the component then silently drops a consumer's `class` — in development only, since production strips comments. Nine components had one
- [x] **5.6** — **DuTable, rich**: the `core/table` engine the 5.1 entry called for (one closure: search → sort → page, selection and expansion keyed by row id, ARIA prop bags), and a facade with client-side or `manual` (server) data, sorting with `aria-sort` and a polite announcement, single/multiple selection with a page-scoped select-all, expandable detail rows, built-in search, paging through DuPagination, loading and empty states, a row-click that ignores the controls inside the row, and a slot for every part. Every state is `v-model`-able (§5)
  - Next batch, deliberately left out: shift-click multi-sort and range selection, column visibility / resizing / reordering, virtualisation, inline editing, grouping and aggregates, CSV export, `role="grid"` keyboard navigation, persisted state
- [x] **5.4** — Coverage: `components/core/` is at 96% against an 80% CI threshold, scoped there rather than globally because it is the only code with no styling to look at and no story to click through. Every interactive facade has black-box tests; `tests/ssr.spec.ts` renders all 61 components on a server, twice, and `tests/api-consistency.spec.ts` checks the names rather than the behaviour

## Phase 6 — Road to v1.0

- [ ] **6.1** — API freeze: cross-cutting consistency review (props/emits/slots naming across all 45 components)
- [ ] **6.2** — Documentation: beta → v1 migration guide, `core/` primitives docs (advanced internal usage), per-component a11y docs
- [ ] **6.3** — Final audit: axe on all stories, screen-reader walkthrough of interactive widgets, SSR/hydration testing
- [ ] **6.4** — Optional: merge DuSelect/DuSearch into a single `DuCombobox` with presets (decision deferred from Phase 1)

---

## Status

| Phase | Scope | Status |
| --- | --- | --- |
| 1 | Combobox engine + DuSelect/DuSearch | ✅ Done (a11y audit 1.6 still owed) |
| 2 | Foundation — docs, `core/` primitives, lint, `useId` | ✅ Done (`core/focus` waits for its first consumer) |
| 3 | Popups — dropdown, menu, tooltip, modal, drawer, toast | ✅ Done (modal deliberately left native) |
| 4 | Selection — tabs, accordion, filter, rating, range, pagination | ✅ Done (pagination was already there) |
| 5 | Data display + hygiene + coverage | ✅ Done |
| 6 | API freeze, docs, audits, v1.0 | 🔲 Todo |

> **`PLAN-REFACTO-GLOBAL.md` is executed end to end (G1–G10).** What remains is
> Phase 6 below, plus one debt: the manual accessibility audit (1.6) is still
> owed — the automated gates are a floor, not a substitute for a screen reader.
> One known structural gap is recorded in `tests/a11y.spec.ts`: DuTabs cannot
> satisfy `aria-required-children` without giving up daisyUI's panel styling,
> which is a product decision.
>
> Phases 3 and 4 are parallelizable component by component once Phase 2 is done.
> Within each phase, every checkbox maps to a self-contained PR that leaves the library shippable.
