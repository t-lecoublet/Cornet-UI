# When to Use Cornet (vs Plain DaisyUI)

Snapshot classification of internal logic complexity for all 55 components, audited 2026-07-02.
This is a point-in-time snapshot, not a guarantee — re-audit after significant refactors rather than
hand-editing entries in place.

## Purpose

Besides tracking refactor priority, this file doubles as a usage guide for performance-conscious
consumers of Cornet UI. Since Cornet is a thin Vue layer over DaisyUI/Tailwind classes, a `Simple`
component adds component-instantiation overhead (props, reactivity, a render function) without
providing any logic you couldn't get from raw markup:

- **`Rich` components (and some `Intermediate` ones with real logic — see `Status` column):**
  worth using as Cornet components. The value is in the JS behavior (state, keyboard nav,
  dismiss handling, model sync, composables), not just the classes.
- **`Simple` components (and `Intermediate` ones that are just structural/slot branching):**
  prefer writing plain HTML with the DaisyUI classes directly instead of importing the Cornet
  wrapper. You lose nothing behavior-wise and skip a component instantiation for what is,
  functionally, just a `<div class="...">`.

This isn't a hard rule — for consistency/DX across a large app it can still be worth standardizing
on Cornet components everywhere. But if bundle size or render overhead matters, the `Level`/`Status`
columns below tell you where Cornet is actually earning its keep versus where it's a convenience
wrapper you could inline yourself.

## Levels

- **Simple** — thin wrapper around markup/DaisyUI classes, little/no internal state, no keyboard nav,
  no focus management, no click-outside/dismiss, no non-trivial model sync.
- **Intermediate** — some real internal state/computed logic, some model sync, some mode switching,
  but still conceptually unified in one file (one or two behavior systems at most).
- **Rich** — multiple (3-6+) distinct internal behavior subsystems coexist (state, model sync,
  keyboard nav, focus management, dismiss handling, search/filter, selection, data normalization,
  multiple coordinated rendering modes). Behaves like a small internal engine.

`Rich` components are split into a local `composables/` folder next to the `.vue` file. See
[[.claude/CLAUDE.md]] for the naming/file conventions used in those composables.

## Actions

| Component | Level | Reason | Status |
|---|---|---|---|
| DuButton | Simple | Thin polymorphic wrapper resolving element tag/attrs from injected context, no state/keyboard/dismiss. | Keep as is |
| DuDropdown | Intermediate | Placement input normalization plus hover/open class toggles, no state engine. | Polish only |
| DuModal | Intermediate | Imperative `<dialog>` open/close sync via ref + watcher, plus Escape key handling. | Polish only |
| DuSwap | Intermediate | Model sync (ref + watch + computed get/set) combined with a checkbox-vs-click mode switch. | Polish only |
| DuFab | Intermediate (in truth) | No internal state/modelValue/keyboard — class composition and icon-kind resolution only. | Split (composables: `useFabClasses`, `useFabIcon`) |

## DataDisplay

| Component | Level | Reason | Status |
|---|---|---|---|
| DuAccordion | Intermediate | Dynamic-items vs manual-slot mode plus generated group name for exclusive behavior. | Polish only |
| DuAvatar | Simple | Pure presentational class-mapping wrapper. | Keep as is |
| DuBadge | Simple | Thin wrapper choosing a static SVG icon by variant. | Keep as is |
| DuCard | Intermediate | Slot-presence driven structural branching, no internal state. | Polish only |
| DuCarousel | Intermediate | Structured items-vs-slot rendering plus position-class resolution. | Polish only |
| DuCarouselItem | Simple | Trivial presentational wrapper. | Keep as is |
| DuChat | Intermediate | Dynamic-items vs manual mode with per-item placement/variant resolution. | Polish only |
| DuCollapse | Intermediate | Same dynamic/manual pattern as DuAccordion with generated id. | Polish only |
| DuCountdown | Rich | Timer/interval lifecycle, multi-format time calculation, mount/unmount cleanup, prop watchers, exposed imperative API. | Split (composables: `useCountdownValue`, `useCountdownDisplay`, `useCountdownTimer`) |
| DuCountdownGroup | Simple | Pure composition wrapper rendering up to 4 DuCountdown instances. | Keep as is |
| DuDiff | Simple | Static presentational figure. | Keep as is |
| DuKbd | Simple | Trivial size-class wrapper. | Keep as is |
| DuList | Simple | Trivial wrapper. | Keep as is |
| DuStat | Simple | Pure slot-presence conditional wrapper. | Keep as is |
| DuStats | Intermediate | Item-type resolution (component/image/HTML) for figure and actions. | Polish only |
| DuStatus | Simple | Conditional markup plus class mapping. | Keep as is |
| DuTable | Intermediate | Dynamic columns/rows vs manual-slot mode, purely structural. | Polish only |
| DuTimeline | Intermediate | Non-trivial multi-layer fallback logic in `getLineClass` plus dynamic/manual modes. | Factorize later |

## DataInput

| Component | Level | Reason | Status |
|---|---|---|---|
| DuCheckbox | Simple | `defineModel()` passthrough plus one-time indeterminate flag on mount. | Keep as is |
| DuFieldset | Simple | Static markup wrapper. | Keep as is |
| DuFileInput | Simple | Pure class-mapping wrapper. | Keep as is |
| DuFilter | Intermediate | Dynamic-items vs manual mode with generated radio-group name. | Polish only |
| DuInputField | Simple | Basic `defineModel()` passthrough with class composition. | Keep as is |
| DuLabel | Simple | Type-based class mapping plus `provide()`. | Keep as is |
| DuLabelInputValidator | Intermediate | Composes DuLabel + DuInputField with one mode switch; most logic lives in children. | Polish only |
| DuRadio | Simple | Pure class-mapping wrapper. | Keep as is |
| DuRange | Intermediate | Manual model sync (ref + watch + dual emit) plus exposed computed value. | Polish only |
| DuRating | Intermediate/Rich borderline | Value sync + clear-on-reclick business rule, multiple rendering modes. | Split (composable: `useRatingValue`) |
| DuSearch | Rich | Query/filter, selection, input parsing, commit, keyboard nav, dismiss. | Split (composables: `useSearchQuery`, `useSearchSelection`, `useSearchInput`, `useSearchCommit`, `useSearchKeyboardNav`, `useSearchDismiss`) |
| DuSelect | Rich | Open state, selection, options normalization, keyboard nav, dismiss. | Split (composables: `useSelectOpenState`, `useSelectOptions`, `useSelectSelection`, plus keyboard nav/dismiss) |
| DuTextArea | Simple | Manual value/input passthrough, no independent state. | Keep as is |

## Feedback

| Component | Level | Reason | Status |
|---|---|---|---|
| DuAlert | Intermediate | Visibility/dismiss state combined with auto-dismiss timeout on mount, plus variant lookups. | Polish only |
| DuLoading | Simple | Pure animation/size/variant class mapping. | Keep as is |
| DuProgress | Simple | Pure class-mapping wrapper. | Keep as is |
| DuRadialProgress | Simple | Style-variable computation, no state. | Keep as is |
| DuSkeleton | Simple | Trivial class wrapper. | Keep as is |
| DuToast | Simple | Position-class mapping plus conditional Teleport. | Keep as is |
| DuTooltip | Simple | Class mapping plus slot-presence check. | Keep as is |

## Layout

| Component | Level | Reason | Status |
|---|---|---|---|
| DuDrawer | Rich | Open-state sync (dual `open`/`modelValue`) plus responsive class coordination; CSS-checkbox driven, no keyboard/dismiss logic. | Split (composables: `useDrawerOpenState`, `useDrawerClasses`) |
| DuJoin | Simple | Direction-class mapping plus `provide()`. | Keep as is |

## Navigation

| Component | Level | Reason | Status |
|---|---|---|---|
| DuBreadcrumbs | Intermediate | Router-component detection/tag resolution plus custom separator mechanism. | Polish only |
| DuDock | Intermediate | Internal active-item state plus icon-kind resolution. | Polish only |
| DuLink | Simple | Pure class-mapping wrapper. | Keep as is |
| DuMenu | Intermediate | Recursive item-rendering, router-tag resolution, active/checked state, multi-select — mostly conditional markup, not a stateful engine. | Factorize later |
| DuNavbar | Simple | Pure slot-presence layout wrapper. | Keep as is |
| DuPagination | Intermediate (in truth) | No internal state/modelValue/keyboard — just a page-range/ellipsis algorithm. | Split (composable: `usePaginationPages`) |
| DuStepItem | Simple | Pure class-composition wrapper. | Keep as is |
| DuSteps | Intermediate | Dynamic-items vs manual mode with per-index class resolution. | Polish only |
| DuTabs | Intermediate | Item-mode vs slot-mode switch plus icon-kind resolution. | Polish only |

## Summary

- **Simple:** 27 components — no action needed.
- **Intermediate:** 20 components — `Polish only` unless flagged below.
- **Rich, split into composables:** DuSelect, DuSearch, DuDrawer, DuFab, DuRating, DuPagination, DuCountdown (7 total).
- **`Factorize later` (real but non-urgent complexity):** DuTimeline (multi-layer line-class fallback logic), DuMenu (recursive rendering + router resolution + slot forwarding).
