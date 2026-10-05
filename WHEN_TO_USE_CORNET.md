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

A `Rich` component's logic lives in `components/core/` when another component
could want it — popup lifecycle, focus, keyboard navigation, controllable state
— and in a local `composables/` folder next to the `.vue` only when it is
genuinely that component's own. See `docs/architecture.md` for where the line
falls and why.

## Actions

| Component | Level | Reason | Status |
|---|---|---|---|
| DuButton | Simple | Thin polymorphic wrapper resolving element tag/attrs from injected context, no state/keyboard/dismiss. | Keep as is |
| DuDropdown | Rich | Controlled/uncontrolled open state, outside + Escape dismissal, focus return, hover with delays, optional top layer. | Facade over `core/popover` + `core/positioning` |
| DuModal | Intermediate | Imperative `<dialog>` open/close sync via ref + watcher, plus Escape key handling. | Polish only |
| DuSwap | Intermediate | Model sync (ref + watch + computed get/set) combined with a checkbox-vs-click mode switch. | Polish only |
| DuFab | Intermediate (in truth) | No internal state/modelValue/keyboard — class composition and icon-kind resolution only. | Split (composables: `useFabClasses`, `useFabIcon`) |

## DataDisplay

| Component | Level | Reason | Status |
|---|---|---|---|
| DuAccordion | Rich | Single/multiple open state with `collapsible`, `v-model`, `aria-expanded` disclosure buttons, a context for hand-written panels. | Facade over `core/shared/useControllableState` |
| DuAvatar | Simple | Pure presentational class-mapping wrapper. | Keep as is |
| DuBadge | Simple | Thin wrapper choosing a static SVG icon by variant. | Keep as is |
| DuCard | Intermediate | Slot-presence driven structural branching, no internal state. | Polish only |
| DuCarousel | Intermediate | Items-vs-slot rendering, position classes, and scroll-by-one controls measured from the slide. | Polish only |
| DuCarouselItem | Simple | Trivial presentational wrapper. | Keep as is |
| DuChat | Intermediate | Dynamic-items vs manual mode with per-item placement/variant resolution. | Polish only |
| DuCollapse | Rich | Independent open state per panel (the difference from DuAccordion), `v-model`, disclosure buttons. | Facade over `core/shared/useControllableState` |
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
| DuFileInput | Simple | Class mapping plus reading `FileList` back out as an array. | Keep as is |
| DuFilter | Intermediate | Generic items, `v-model` over a radio group, fieldset/legend, conditional reset. | Polish only |
| DuInputField | Intermediate | `defineModel()` passthrough plus the shared validation surface over native ValidityState. | Facade over `core/shared/useNativeValidation` |
| DuLabel | Simple | Type-based class mapping plus `provide()`. | Keep as is |
| DuRadio | Simple | Pure class-mapping wrapper. | Keep as is |
| DuRange | Intermediate | Manual model sync (ref + watch + dual emit) plus exposed computed value. | Polish only |
| DuRating | Intermediate/Rich borderline | Value sync + clear-on-reclick business rule, multiple rendering modes. | Split (composable: `useRatingValue`) |
| DuSearch | Rich | Typeahead: query/filter, selection, creatable entry, commit on close, keyboard nav, dismiss. | Facade over the shared combobox engine (`components/core/combobox/`) |
| DuSelect | Rich | Open state, selection, options normalization, keyboard nav, dismiss. | Facade over the shared combobox engine (`components/core/combobox/`) |
| DuTextArea | Simple | Manual value/input passthrough, no independent state. | Keep as is |

## Feedback

| Component | Level | Reason | Status |
|---|---|---|---|
| DuAlert | Intermediate | Visibility/dismiss state combined with auto-dismiss timeout on mount, plus variant lookups. | Polish only |
| DuLoading | Simple | Pure animation/size/variant class mapping. | Keep as is |
| DuProgress | Simple | Pure class-mapping wrapper. | Keep as is |
| DuRadialProgress | Simple | Style-variable computation, no state. | Keep as is |
| DuSkeleton | Simple | Trivial class wrapper. | Keep as is |
| DuToast | Rich | Two live regions, the module-scope queue, durations paused on hover and focus. | Facade over `composables/useToasts` |
| DuTooltip | Rich | Hover and focus triggers with delays, Escape dismissal, `aria-describedby` wiring, optional top layer. | Facade over `core/popover` + `core/positioning` |

## Layout

| Component | Level | Reason | Status |
|---|---|---|---|
| DuDrawer | Rich | Controlled/uncontrolled open state, Escape and outside dismissal, and a dialog role with focus trap + `inert` below the pinned breakpoint. | Facade over `core/popover` + `core/focus`; local `useDrawerOpenState`, `useDrawerClasses`, `useDrawerPinned` |
| DuJoin | Simple | Direction-class mapping plus `provide()`. | Keep as is |

## Navigation

| Component | Level | Reason | Status |
|---|---|---|---|
| DuBreadcrumbs | Intermediate | Router-component detection/tag resolution plus custom separator mechanism. | Polish only |
| DuDock | Intermediate | Internal active-item state plus icon-kind resolution. | Polish only |
| DuLink | Simple | Pure class-mapping wrapper. | Keep as is |
| DuMenu | Rich | Two roles (nav list vs APG menu), roving tabindex, typeahead, collapsible submenus, recursive rendering through a context. | Facade over `core/navigation` |
| DuNavbar | Simple | Pure slot-presence layout wrapper. | Keep as is |
| DuPagination | Intermediate (in truth) | No internal state/modelValue/keyboard — just a page-range/ellipsis algorithm. | Split (composable: `usePaginationPages`) |
| DuStepItem | Simple | Pure class-composition wrapper. | Keep as is |
| DuSteps | Intermediate | Dynamic-items vs manual mode with per-index class resolution. | Polish only |
| DuTabs | Rich | APG tablist with roving tabindex, `v-model` by stable value, automatic/manual activation. | Facade over `core/navigation` |

## Summary

> **Rewritten after the Phase 2–5 refactor.** Nine components moved from
> `Simple`/`Intermediate` to `Rich` because they gained the state they had been
> faking with CSS — a dropdown that only toggled a class, tabs driven by hidden
> radios, a toast that was a positioned box. The classification below describes
> what they are now.

- **Simple:** presentational wrappers — no state, no keyboard, no ARIA beyond a name. No action needed.
- **Intermediate:** rendering modes and class resolution, but nothing to extract.
- **Rich, built on `components/core/`:** DuSelect and DuSearch (`core/combobox`), DuDropdown and DuTooltip (`core/popover` + `core/positioning`), DuMenu and DuTabs (`core/navigation`), DuDrawer (`core/popover` + `core/focus`), DuAccordion and DuCollapse (`core/shared/useControllableState`), DuInputField (`core/shared/useNativeValidation`), DuToast (`composables/useToasts`).
- **Rich, with their own local composables:** DuFab, DuRating, DuPagination, DuCountdown, DuDrawer — logic that is genuinely theirs (class derivation, a page-range algorithm, a timer), which is what a local composable is for.
- **`Factorize later`:** DuTimeline (multi-layer line-class fallback logic).
