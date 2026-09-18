# Changelog

All notable changes to Cornet are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/) and the project follows [Semantic Versioning](https://semver.org/).

## [0.1.0-beta.27]

### Added

- `DuSelect` / `DuSearch`: the trigger carries `aria-required` when the field
  is `required` — the constraint a screen reader could not see.

## [0.1.0-beta.26]

### Changed (breaking)

- `DuSelect` / `DuSearch`: no default validation text. The engine spelled an
  English `Selection is required.` / `Select at least N options.` when a
  touched field failed its constraints — a library cannot guess the
  consumer's language, and one hardcoded English sentence among otherwise
  message-less fields reads as an accident. The error **state** is unchanged
  (`valid`, `errors`, the red styling, the `error` slot with `message` in its
  scope); what changed is that the default text is now empty. A consumer who
  wants a message passes `errorMessages` — e.g.
  `:error-messages="{ required: 'Ce champ est obligatoire.' }"` — or renders
  the slot. The fallback `<span>` no longer renders when the message is
  empty, so an untouched contract leaves no gap in the layout.

## [0.1.0-beta.25]

### Fixed

- `DuSearch`: a committed created option (`creatable` + `commitOnClose`) no
  longer displays as an empty string (single mode) or `[object Object]`
  (chips). The created option is its own key — the v-model holds the object
  itself, and no lookup in `options` could find it — so the field showed
  nothing for a perfectly valid committed value. `optionOf` now resolves a
  created option from the model value directly.

## [0.1.0-beta.23]

An empty field now says so with `null`, everywhere it can. `''` and `0` were
standing in for "no value" in places where neither is one, and both travelled
into API payloads as if they were real answers.

### Changed (breaking)

- `DuRating`: clearing a `clearable` rating emits **`null`**, not `0`. A scale that starts at 1 has no number for "not rated", so `0` could only ever be an absence in disguise — and it left "nobody rated this" and "somebody rated it zero" impossible to tell apart, or rejected outright by a `ge=1` constraint. `modelValue` is `number | null`; **the default stays `0`**, which renders the same empty row of stars, so a rating that is not `clearable` is unaffected.

### Fixed

- `DuInputField`: an emptied `number`, `date`, `datetime-local`, `time`, `week` or `month` field emits `null` instead of `''`. The browser hands back `''` to mean *nothing* for all of these, and `''` is never a valid one of them, so it was an absence wearing a value's clothes — a server asked for an optional integer or date received `""` and refused to parse it. Text types (`text`, `email`, `url`, `tel`, `search`, `password`) still emit `''`, which for them is a real answer.
- `DuInputField`: `v-model.number` is implemented rather than silently dropped. The component declared no modifiers, so Vue handed it `modelModifiers` and it ignored them — the modifier looked like it worked. It now casts on any `type`, following Vue's own `looseToNumber` semantics (`'abc'` stays `'abc'`), with the empty case going to `null` like the rest.

### Internal

- `DuRating`'s read-only group names itself from the value; an unrated one announces "0 out of 5" rather than "null out of 5".

## [0.1.0-beta.22]

`DuSelect` and `DuSearch` are rebuilt on a shared headless combobox engine (`components/core/combobox/`) implementing the WAI-ARIA combobox pattern once — popup lifecycle, filtering, keyboard navigation, focus management and the ARIA prop bags — with the two components as styled facades over it. The engine is internal: the components stay the public API. The twelve `useSelect*` / `useSearch*` composables are gone.

### Removed (breaking)

- `DuTabs`: the `name` prop is removed with the radio inputs it grouped. Its default was the literal `"my_tabs"`, so two tab groups on a page shared one radio group and picking a tab in one cleared the other.
- `DuAccordion`: the `name` prop and the `accordionName` provide are removed for the same reason. `DuAccordionItem` reads the accordion through a context now.
- `DuAccordion` / `DuCollapse`: `'collapse-open'` and `'collapse-close'` are no longer accepted as `modifier` values. The open state drives those classes; passing them would be a second, silent source of truth.

- `DuMenu`: the `onItemClick` / `onSubItemClick` **props** are removed — they duplicated the `itemClick` / `subItemClick` emits. Use `@item-click` / `@sub-item-click`.
- `DuMenu`: `role="listbox"` and `role="option"` are gone. A list of navigation links is not a listbox, and axe reported the mismatch four different ways (`aria-required-children`, `aria-required-parent`, `aria-input-field-name`, `listitem`). See the `role` prop below.
- `DuMenuItem`: the hidden `<input type="checkbox">` that carried multi-select state is replaced by `role="menuitemcheckbox"` + `aria-checked`.
- The local `useMenuKeyboardNav` composable is deleted; `core/navigation/useRovingIndex` replaces it.

- `DuDropdown`: the `isDropdownTrigger` provide is gone, and with it `DuButton`'s hidden `<div role="button" tabindex="0">` rendering inside a dropdown trigger. A `DuButton` in a trigger slot is now a real `<button>` — the open state is driven in JS, so the div-with-a-role was only ever there to satisfy daisyUI's CSS.

- `DuCollapse`: the `collapseId` injection key is removed. It was provided but never injected — no component read it, and the value it carried was a fresh random string on every render.
- `DuSelect`: the `search` prop is removed — it was declared but never read.
- `DuSearch`: the `DuSearchOption` type is removed. Both components are now generic over their option type (`DuSelectProps<O, V>`, `DuSearchProps<O, V>`), so any option shape works.
- `DuSearch`: `name` and `id` are no longer required props. `id` defaults to Vue's `useId()`.

### Changed (breaking)

- `DuLoading`, `DuSkeleton`, `DuRatingItem`, `DuCarouselItem` (and `DuCarouselItemData`): the accessible-name prop is `ariaLabel`, not `label`. `label` means *visible text* everywhere else in the library — a button's, a menu item's, a tab's — and one name with two meanings is how an API stops being guessable.
- `DuButton`: `label` no longer becomes `aria-label` when the default slot is filled. Replacing visible text with a different accessible name is the "label in name" failure (WCAG 2.5.3): someone saying "click Save" to a voice assistant needs the two to match. `label` still names the `<input>` form and a button used without content; the new `ariaLabel` names an icon-only button explicitly.

- `DuStatus`: the automatic `aria-label` derived from the variant (`"success"`, `"warning"`) is gone. It named the colour rather than the meaning, and sat on a plain `<div>` where no assistive tech would read it. Pass `ariaLabel` to say what the dot means; without one it is hidden.
- `DuDock`: the root element is a `<nav>` instead of a `<div>`. Selectors targeting `div.dock` need updating.

- `DuCarousel`: an item with `src` and no `alt` renders `alt=""` instead of `alt="Slide 2"`. The position of a picture is not a description of it, and an empty alt at least tells a screen reader to skip it.

- `DuFilter` is a `<fieldset>` with a `<legend>` (visually hidden unless `showLegend`) and takes a `v-model`: `modelValue` is the selected filter's value, alongside the `change` emit it already had. A radio group without a name for the whole set leaves a screen reader unable to say what the buttons have in common. It is also generic over its item type, and each item can carry a stable `value`.
- `DuFilter`: the reset button is no longer rendered when nothing is selected. daisyUI already hid it with `visibility: hidden` on that same condition, so this only makes the markup agree with what was already visually true.

- `DuTabs` follows the WAI-ARIA tabs pattern: `role="tablist"` / `tab` / `tabpanel`, one tab stop with arrow keys, `Home`/`End`, and `activation: 'automatic' | 'manual'`. **`modelValue` is now the selected tab's `value`, not its index** (it falls back to the index when an item has no `value`). daisyUI 5 already styles `.tab[aria-selected=true]`, so the selected state is carried by the attribute a screen reader reads. New per-item `value` and `disabled`; the `bottom` prop, previously declared and never used, now applies `tabs-bottom`.
- `DuAccordion` and `DuCollapse` follow the accordion / disclosure patterns: each header is a `<button aria-expanded>` naming a `role="region"`, with no hidden input anywhere. Both take a `v-model` — `modelValue` is the open panel's value (or an array) for the accordion, always an array for the collapse, whose panels are independent. New `multiple` and `collapsible` on the accordion, per-item `value` and `disabled` on both.
- `DuTabs`, `DuAccordion`, `DuCollapse`: an indexed slot (`content-0`, `title-0`) now beats the global one (`content`, `title`). It was the other way round, which made the indexed override unusable as soon as a global slot was given.

- `DuDrawer`: `open` and `modelValue` no longer default to `false`, so the controlled/uncontrolled contract can tell the two apart. **Omit both and the drawer owns its state; pass either one and yours decides** — `<DuDrawer :open="x">` without an `@update:open` listener (or a `v-model`) will now emit and stay put instead of closing itself. `v-model` users are unaffected.
- `DuDrawer`: below the pinned breakpoint the sidebar is a dialog — `role="dialog"`, `aria-modal="true"`, an accessible name from `ariaLabel`, focus trapped inside it, and the content behind it `inert`. Above the breakpoint it stays a plain part of the page, with none of that. `useDrawerDismiss` is gone, replaced by `core/popover` + `core/focus`.
- `DuDrawer`: the layout checkbox is `aria-hidden` and out of the tab order. It is daisyUI's mechanism, not a control — the state lives in JS.

- `DuTooltip` is rebuilt on `core/popover` + `core/positioning`. It was classes only: no ARIA, no keyboard trigger, no way to dismiss it — a tooltip that answers to the mouse alone fails WCAG 1.4.13 twice over.
  - The tip is a real element carrying `role="tooltip"`, rendered **only while shown**, and `aria-describedby` is wired onto the first focusable element in the default slot for as long as it is up.
  - The **`data-tip` attribute is no longer set on the root** (the `dataTip` prop is unchanged). daisyUI reveals a tip from that attribute on `:hover` alone, instantly and undismissably — the delays and Escape below only work if the tip is not in the DOM when closed. Styling that targeted `[data-tip]` needs to target `.tooltip-content`.
  - `open` no longer defaults to `false`. Omit it and the tooltip owns its state; pass it and yours decides, with `update:open` emitted.

- `DuMenu` gains a **`role` prop** that decides what it is. `nav` (the default) is a list of links: plain `<ul>`, no ARIA role, native Tab, `aria-current="page"` on the active item. `menu` is the WAI-ARIA menu pattern: `role="menu"` / `menuitem` / `menuitemcheckbox` over presentational `<li>`s, one tab stop with arrow keys, `Home`/`End`, typeahead and `Enter`/`Space`, and submenus that collapse behind `aria-expanded` (ArrowRight opens and focuses the first child, ArrowLeft closes and steps back).
  - Arrow-key navigation therefore no longer applies in the default mode. A sidebar of links is walked with Tab, which is what it always should have been.
  - Submenus are always visible in `nav` mode, as before; they start collapsed in `menu` mode.

- `DuDropdown` is rebuilt on `core/popover` + `core/positioning`. It had no state at all: an `open` prop that added a class, no dismissal, no keyboard, and a `triggerProps` slot scope its own template comment promised but never provided.
  - **The trigger must now spread `triggerProps`** (`<DuButton v-bind="triggerProps">`) — without it nothing opens. The scope is real now: `aria-expanded`, `aria-haspopup`, `aria-controls`, the click toggle and ArrowDown-to-open.
  - `open` no longer defaults to `false`. Omit it and the dropdown owns its state; pass it and yours decides, with `update:open` emitted — the library-wide controlled/uncontrolled contract.
  - `hover` is driven in JS with `openDelay` / `closeDelay` (100 ms) instead of daisyUI's `dropdown-hover`, so the panel and `aria-expanded` cannot disagree, and it opens on **keyboard focus** as well as on hover.
  - The root always carries `dropdown-open` or `dropdown-close`. daisyUI also reveals the panel on `:focus-within`, which used to show it while `aria-expanded` said false.

- `DuSearch`: `listValues` → `options`, `limit` → `resultsLimit`, `remoteSearch` → `externalFilter`, `addOption` → `creatable`, `addOptionText` → `createOptionText`.
- `DuSearch`: `autoCommit: boolean` → `commitOnClose: 'none' | 'match' | 'auto'`. `autoCommit: true` becomes `commitOnClose="auto"`; the default `'none'` matches the old `autoCommit: false`. Emptying the field and leaving it still clears the selection in every mode.
- `DuSearch`: slots `add-option` → `create-option` and `no-results` → `no-options`.
- `DuSearch`: multiple mode renders chips plus an input, instead of joining the selected labels with commas inside one text input. Typing a comma still validates the segment before it.
- `DuSearch`: the "Add «query»" row no longer appears when an option already carries that exact label.
- `DuSelect`: `searchNoResultsText` → `noResultsText` (aligned with `DuSearch`).
- `DuSelect`: `closeOnSelect` now defaults to `null`, meaning "close in single mode, stay open in multiple". It used to close in multiple mode too.
- `DuSelect`: `searchableInside` no longer needs `searchable` alongside it.
- `DuSelect`: the field's trigger is a real `<button>` instead of a `<div tabindex="0">`, and the chevron is a `tabindex="-1"` button, so the field is a single tab stop.
- Both: the highlighted option is styled through `data-highlighted` and the selected one through `aria-selected`, instead of index comparisons — custom styling should target those attributes.
- `DuSwap`: with `useCheckbox: false` the toggle renders a `<button type="button" aria-pressed>` instead of a `<div @click>`. It was unreachable by keyboard and announced nothing; a consumer styling `div.swap` should target `button.swap`.
- `DuDrawer`: the overlay `<label>` no longer carries `aria-label="close sidebar"` — ARIA prohibits naming a `<label>`, and axe flags it. It is `aria-hidden` now: the overlay is a click surface, and Escape or the toggle closes the drawer for keyboard users.
- Item types no longer use `any`: `icon` / `figure` / `actions` are `IconSource`, and the `[key: string]: any` index signatures on `DuStatItem`, `DuFabItem`, `DuTabItem`, `DuDockItem`, `DuDrawerItem` and `DuTableRow` are `unknown`. Reading an unlisted key now needs a narrowing step.
- `DuMenuItemData.subItems` is `this[]` instead of `DuMenuItemData[]`, so a consumer's own fields survive one level down.
- `DuAccordion`: the `name` prop no longer defaults to the literal `"accordion"`. Two accordions on a page shared that radio-group name, so opening a panel in one closed a panel in the other. Each instance now derives its own; pass `name` explicitly to keep a fixed one.

### Added

- `DuInputField`: `errorMessages` (per-code overrides), an `error` slot, and `valid` / `errors` / `validationMessage` / `markTouched()` / `reset()` on the instance — the same surface `DuSelect` and `DuSearch` expose, so a form of mixed fields reports errors one way. The **checking** stays native: already localized, already what the form decides on submit, and already covering the cases a hand-rolled version forgets. Nothing is shown until the field has been visited, which is what `:user-invalid` means, mirrored into JS.
- `DuFileInput`: `modelValue` / `update:modelValue` / `change` carrying `File[]`, plus `multiple`, `accept` and `ariaLabel`. It emitted nothing at all before, so there was no way to read what the user had chosen. A file input's value cannot be set from script — the browser forbids it — so the model reports, and clearing it clears the field, which is what a form reset needs.

- `DuLoading`, `DuSkeleton`, `DuStatus`: a `label` / `ariaLabel` prop announcing what is happening. Without one they are now `aria-hidden` — a spinner or a coloured dot means nothing to someone who cannot see it, and hiding it beats announcing a blank.
- `DuCountdown`: `role="timer"`. `DuRadialProgress`: `aria-valuemin` / `aria-valuemax` (it had `aria-valuenow` alone, which a progressbar cannot be read from) and an `ariaLabel`.
- `DuSteps`: `aria-current="step"` on the furthest active step, plus an `ariaLabel` for the sequence.
- `DuDock`: it is a `<nav>` now, with an `ariaLabel`, and the active item carries `aria-current="page"`.

- `DuTable`: `caption` (and `hideCaption`, or a `caption` slot). Every `<th>` in the header and footer now carries `scope="col"` — without it a screen reader has to guess whether a header cell heads a column or a row.
- `DuCarousel`: `role="region"` + `aria-roledescription="carousel"` + `ariaLabel`, each slide a named `role="group"` + `aria-roledescription="slide"` (`slideLabel`, default `"2 of 5"`), and `tabindex="0"` on the strip — a scrollable region nothing inside can focus cannot be scrolled by keyboard at all. New `controls` renders named previous/next buttons that scroll one slide, measured from the slide rather than assumed; `next()` / `previous()` are exposed.
- `DuDiff`: `ariaLabel`, `revealLabel`, `item1Alt` / `item2Alt`, and a `tabindex` on both elements daisyUI's comparison reacts to. The keyboard mechanism was in the stylesheet and nowhere else: nothing could take the focus it needed.

- `DuRating`: `itemLabel` names each star (`"3 out of 5"` by default, and replaceable for another language or scale), `ariaLabel` names the group, and `readonly` renders plain elements exposing the group as `role="img"` with the value as its name — a disabled radio announces "you may not touch this", which is not what a displayed rating means.
- `DuRange`: `valueText` sets `aria-valuetext` (`"12"` alone means nothing to someone who cannot see what it is 12 *of*), `ariaLabel` / `ariaLabelledby`, and `ticks` rendering a `<datalist>` the input points at.

- `useToasts()`, exported from the package root: a module-scope toast queue (`push`, `dismiss`, `clear`, plus `pause` / `resume`), rendered by a single `<DuToast />` anywhere in the layout. `duration` defaults to 5000 ms, `0` means until dismissed.
- `DuToast` now renders that queue, inside **two live regions** — `role="status"` / `aria-live="polite"` and `role="alert"` / `aria-live="assertive"` — that exist whether or not they hold anything, because a live region only announces what arrives after it exists. An `error` toast goes to the assertive one unless `politeness` says otherwise. Each toast gets a named close button (`dismissLabel`), and hovering the container or tabbing into it holds every countdown (WCAG 2.2.1), resuming from where it stopped. New `toast` slot for rendering a queued toast yourself; the handwritten-toasts slot still works unchanged.

- `DuDrawer`: `ariaLabel`, `inertTarget`, `closeOnEscape`, `closeOnClickOutside`, and `open()` / `close()` alongside the exposed `toggleDrawer()`.

- `DuTooltip`: opens on keyboard focus as well as hover, and dismisses on Escape. New props `openDelay` / `closeDelay` (300 / 100 ms), `popover` (top layer, so a tip inside `overflow: hidden` is not clipped) and `disabled`. The tip stays hoverable — moving the pointer from the trigger onto it does not close it.

- `DuMenu`: `ariaLabel`, and the `MenuButton` story pairing `DuDropdown` with `DuMenu role="menu"` — the APG menu-button pattern.

- `DuDropdown`: `popover` (top layer via the Popover API + CSS anchor positioning, so an `overflow: hidden` ancestor cannot clip the panel), `closeOnClickOutside`, `closeOnEscape`, `disabled`, `contentClass`, `openDelay` / `closeDelay`, the `open` / `close` emits, and a `content` slot alongside the default one. Escape and outside presses dismiss; Escape hands focus back to the trigger; tabbing out closes.

- `DuSelect` / `DuSearch`: `ariaLabel` and `ariaLabelledby`. The field's trigger took its accessible name from the placeholder or the current selection, so a select with neither had none.
- `DuAlert`: `dismissLabel` (default `'Dismiss'`) — the dismiss button's only content is an icon, so it had no accessible name.
- `DuProgress`: `ariaLabel`.
- `DuSwap`: `ariaLabel`.
- `IconSource`, `IconKind`, `resolveIconKind` and `iconAsText` are exported from the package root: one shared type for the `icon` / `figure` fields, which may hold a Vue component, an image URL, or an HTML string. `nestedSize` is exported too.
- `DuTable`, `DuMenu`, `DuTimeline` and `DuChat` are generic over their item type, like `DuSelect` and `DuSearch`: a consumer's own fields survive into the scoped slots and the emit payloads. `DuTableColumn.key` is now checked against the row type, so a typo in a column no longer renders a blank cell.
- Both: `readonly`, `required`, `minSelected`, `maxSelected`, `errorMessages` and an `error` slot rendering the validation message once the field has been visited. `valid`, `errors` and `validationMessage` are also exposed to a parent through the component instance.
- Both: `optionValue`, `optionLabel`, `optionFilter` and `optionDisabled` callbacks for option shapes `trackBy`/`labelBy` cannot describe. Disabled options are a new concept — `option.disabled === true` by default — and are skipped by the keyboard, marked `aria-disabled` and inert on click.
- Both: `popover` renders the dropdown in the top layer (Popover API + CSS anchor positioning), so it is no longer clipped by an `overflow: hidden` ancestor.
- Both: `closeOnClickOutside`, `selectOnTab`, `subSize`, and the `open` / `close` / `query` emits (`query` is new on `DuSelect`; `open`/`close` are new on `DuSearch`).
- `DuSelect`: the `tag` slot scope gains the resolved `option` and a pre-wired `remove()`; the `option` slot scope gains `selected`, `highlighted` and `disabled`.
- `DuSearch`: a `tag` slot for the chips, and a `createOption` prop to build the created option yourself.

### Fixed

- `DuTableColumn.key` was `Extract<keyof Row, string>`, which rejected the ordinary way of writing columns: `const columns = [{ key: 'name', label: 'Name' }]` widens `'name'` to `string` before the type sees it, so every consumer declaring their columns in a variable would have failed to compile. It is `Extract<keyof Row, string> | (string & {})` now — the row's keys are still suggested in an editor, but they are not enforced. The changelog entry claiming a typo in a column would be caught was wrong, and is corrected.

- `DuButton` rendered as an `<input>` (inside a `DuFilter`) declared a child node the server correctly omitted, because an `<input>` is a void element and may hold none. Every such button reported a hydration mismatch. The template branches on the element instead of hiding a slot behind a `v-if` inside it.

- `DuTooltip`: `variant="neutral"` produced a `tooltip-neutral` class daisyUI does not define. The rule now lives in the component. It happened to look right because neutral is daisyUI's tooltip default, so nothing would have caught it before `npm run check:css`.
- `DuInputField`: attributes passed by the consumer (`aria-label`, `aria-describedby`, `autocomplete`, …) now reach the `<input>`. The template's root is a fragment, so Vue could not auto-inherit them and they landed nowhere — the field could not be given an accessible name outside a wrapping `<label>`.
- `DuAccordion`, `DuCollapse`, `DuFilter`, `DuRating`, `DuDrawer`: element ids and radio-group names come from `useId()` instead of `Math.random()`. A random id differs between the server render and the client render, which Vue reports as a hydration mismatch and which breaks every `for`/`id` and `aria-controls` pair spanning the boundary.
- Both: an empty result list no longer produces a `NaN` highlight index.
- Both: element ids come from `useId()` instead of `Math.random()`, so server-rendered markup matches on hydration.
- Both: options now carry ids and the field exposes `aria-activedescendant`, so screen readers follow the highlight. `aria-selected` reflects the actual selection — it used to mirror the highlight on `DuSearch`.
- Both: full keyboard support — `Home`, `End`, `PageUp`, `PageDown`, wrapping arrows that skip unselectable options, `Backspace`/`Delete` removing the last selection, and `Tab` leaving the widget instead of walking into the listbox.
- Both: closing is driven by the popup lifecycle instead of a `focusout` + `setTimeout(0)` race, and the click-outside listener is only meaningful while open.
- `DuSearch`: `role="combobox"` and `aria-expanded` are on the input (they were on the wrapping `<div>`), and `aria-controls` replaces the deprecated `aria-owns`.
- `DuSearch`: `labelBy` now applies to filtering and to the comma parsing — both were hardcoded to `name`.
- `DuSearch`: clicking an option no longer depends on the mousedown/blur ordering.
- `DuSelect`: the per-option checkbox no longer double-toggles the selection.

### Internal

- `tests/` is type-checked. It was excluded from `tsconfig.json` during the typing pass and the exclusion outlived its reason: a test is the only place a component is used the way a consumer uses it, so it is the only place a props type is exercised at all. Turning it on immediately surfaced the `DuTableColumn` bug above.

- The axe sweep and the SSR suite are driven from `index.ts` through one fixture table (`tests/helpers/component-fixtures.ts`) and **fail if a component is exported without an entry**. The axe sweep covered 31 of 61 components before; it covers all of them now.
- `tests/ssr.spec.ts` also hydrates every component and fails on a mismatch warning, mounts each one on the client, and asserts that no server render reaches `addEventListener` — a guard on the guard, since happy-dom would otherwise hide a `document` access at a module's top level.
- **Known gap, recorded rather than papered over**: `DuTabs` fails axe's `aria-required-children`. A `tablist` may own only `tab`s, but daisyUI reveals a panel through `.tabs > .tab + .tab-content`, so the panel has to be a child of the tablist; `aria-owns` does not satisfy the rule. Fixing it means rendering the panels outside `.tabs` and giving up daisyUI's panel box styling — a product decision, not an implementation one.

- `tests/ssr.spec.ts`: every exported component is rendered on a server, twice — catching both `document` access during `setup()` and markup that differs between two renders of the same input, which is a hydration mismatch. All 61 pass.
- `tests/api-consistency.spec.ts`: one spelling for accessible-name props, `update:x` paired with an `x` prop, props interfaces named after their component.
- Line coverage on `components/core/` is a CI threshold (80%; currently 96%). `npm run test:coverage`.
- `tests/helpers/environment.ts` holds the Popover API and `matchMedia` mocks, opt-in rather than a global setup — several suites depend on a capability being absent.

- `tests/template-root-invariant.spec.ts`: no component template may open with a comment. A leading comment adds a vnode, and Vue only auto-inherits attributes onto a single root — so the component silently stops passing a consumer's `class` or `aria-*`, and only in development, since production strips comments. Nine components carried one; all are fixed, and the three lint exemptions that forced the position moved to `eslint.config.js`.

- `components/core/` gains `popover/usePopoverState`, `positioning/useAnchorPosition`, `navigation/useRovingIndex` and `shared/useControllableState`, extracted from the combobox engine as its second consumers arrived. The engine now leans on the first two, with its own tests unchanged.
- `components/core/focus/` adds `useFocusReturn` (remember what had focus before opening, hand it back after) and `useFocusTrap` (keep Tab inside a container). `DuDrawer` now uses the first instead of its own copy; the trap lands with the drawer's overlay mode. `focusableWithin(root)` joins `focusableInDocument()` in `core/shared/dom`.

- `npm run check:css` (`scripts/check-embedded-css.mjs`), blocking in CI: compiles Tailwind + daisyUI over the library sources the way a consumer's embedded build does, and fails on any class `useSizeMapping`/`useVariantMapping` builds at runtime that produces no CSS rule. The existing invariant test proves the literals are scannable; this proves they are real.
- `eslint-plugin-vuejs-accessibility` (recommended config) and an axe-core pass over a representative mount of every component (`tests/a11y.spec.ts`), both blocking in CI. Components with a structural bug scheduled for a later phase carry a documented allowlist, and the spec fails if an allowlisted rule stops firing — so the entry cannot outlive the bug.
- `@typescript-eslint/no-explicit-any` is an error on shipped code (`.stories.ts` excluded — `render: (args: any)` is Storybook's own signature). The only survivors are the `O = any, V = any` generic defaults of `DuSelect`/`DuSearch`, with the reasoning recorded next to them.
- `DuDock`, `DuTabs`, `DuStats`, `DuMenuItem` and `DuFab` share one icon-narrowing helper instead of three divergent `typeof` chains — the old ones each recognized a different subset (one missed function components, another missed root-relative image paths).
- The combobox engine moved from `components/DataInput/core/` to `components/core/`, alongside a new `components/core/shared/` holding `useComponentId`. `core/` stays internal — it is not exported from the package barrel.
- The engine's document-level `mousedown` and `keydown` listeners are attached when the popup opens and removed when it closes, instead of living for the lifetime of every instance. A page holding fifty closed comboboxes now holds no idle listeners.
- `types/types.sh` keeps generic type aliases (`export type X<O> = …`) in the public type barrel; they were silently dropped before.

## [0.1.0-beta.21]

### Fixed

- `plugin-vite`: `scanSourceContent` no longer counts a commented-out import (`// import { X } from 'cornet-ui'`) or a commented-out template tag (`<!-- <X /> -->`) as real component usage. This could previously pull in a whole unused component's CSS (and its dependencies') into a "tree-shaken" build — e.g. a single leftover commented-out `<DuSearch>` reference added ~20 KB of unrelated CSS to a build that only actually used `DuPagination`.
- `DuPagination`, `DuChatItem`, `DuLoading`, `DuRadialProgress`, `DuTooltip`, `DuTable`, `DuProgress`, `DuTextArea`, `DuLink`, `DuTabs`: added local Tailwind-scan safelists for `useSizeMapping`/`useVariantMapping` suffixes that had no literal source anywhere in the library — in embedded mode, Tailwind never generated these classes because no scanned file contained them as literal strings (e.g. `DuPagination`'s own `btn-*` classes, since it doesn't import `DuButton`).
- `DuCheckbox`, `DuRadio`, `DuRange`, `DuSelect`: their local variant safelists were missing the `-neutral` entry (same root cause as the already-fixed `input-neutral` gap on `DuSearch`/`DuInputField`); `DuSelect` was also missing an `input-*` size safelist for its own search input.

### Added

- `tests/class-literals-invariant.spec.ts`: regression test verifying that every `useSizeMapping`/`useVariantMapping` call in the library has its full set of literal classes reachable (in the calling component's own directory, or a directly-imported dependency's) — guards against this class of embedded-mode tree-shaking bug reappearing on future components.

## [0.1.0-beta.19] - 2026-07-06

### Removed (breaking)

- `DuFab`: the `position` prop has been removed. A FAB is now always positioned in the bottom-right corner (standard FAB placement) when `absolute` is `true`.
- `DuButtonLink` has been removed entirely. It duplicated `DuButton`'s class logic without `customClass`/`disabled`/RouterLink-NuxtLink support — use `<DuButton as="a" href="...">` (or `as="RouterLink"`/`as="NuxtLink"`) instead.
- `DuCheckbox`: the `checked` prop has been removed — it was never wired to the template and had no effect. Use `v-model`/`modelValue` (via `defineModel()`).

### Changed (breaking)

- Public type names across all `.types.ts` files have been normalized to the `Du{Component}{Name}` PascalCase convention (e.g. `MenuItem` → `DuMenuItemData`, `SELECTProps` → `DuSelectProps`, `BUTTONSize` → `DuButtonSize`, `PlacementValue` → `DuDropdownPlacementValue`). Update any type imports from `cornet-ui` / `cornet-ui/types` accordingly.
- `DuChat`: `DuChatItemData.variant` now takes a plain variant (`'primary'`, `'secondary'`, …) like the rest of the library, instead of an already-prefixed `'chat-bubble-primary'` string.
- `DuTimeline`: `modifier` no longer accepts `'timeline-box'` — DaisyUI applies that class per start/end box, not on the root `<ul>`. Use the new `boxed` prop (or per-item `item.boxed`) instead.

### Added

- `DuMenu`: arrow-key and Home/End keyboard navigation between sibling items, correctly scoped per nesting level (a horizontal root with vertical submenus now uses the right axis at each level). Items without `href` (driven purely by `onClick`) are now focusable.
- `DuDrawer`: pressing Escape now closes an open drawer; opening moves focus into the sidebar, and closing restores focus to whatever was focused before.
- `DuDropdown` / `DuMenu` / `DuTabs` / `DuFab`: icon/image props now also accept root-relative local asset paths (e.g. `/logo.svg`), not just absolute `http(s)` URLs.
- `DuDropdown`: `.dropdown-content` now has a default `bg-base-100 rounded-box shadow-sm`, and `DuMenu` always keeps its own background regardless of dropdown context (previously `DuMenu` suppressed its own background when nested in a dropdown, assuming the dropdown supplied one — it never did).
- `DuTimeline`: new `boxed` prop (and per-item `item.boxed` override) applying `timeline-box` to the start/end boxes.
- `DuFilter`: new `change` emit, fired with the clicked item (or `undefined` for the reset button).
- `DuAlert`: new `close` emit, fired on manual dismiss and on auto-dismiss.
- `DuBreadcrumbs`: new `ariaLabel` prop (default `"Breadcrumb"`); the root element is now a `<nav>` and the last item gets `aria-current="page"`.

### Fixed

- `DuDropdown`: the object form of `placement` (e.g. `{ top: true, end: false }`) now correctly applies only the keys set to `true` (previously applied every key present regardless of its value).
- `DuTabs`: clicking a tab no longer fires `onClick` / `update:modelValue` twice (native label→radio-input click forwarding was double-firing it).
- `plugin-vite`: `scanSourceContent` no longer mis-parses `//` or `/* */` comments inside a named-import block as part of the next component's name.
- `DuChat`: dynamic `items` mode double-prefixed the bubble color class (`chat-bubble-chat-bubble-primary`), so a bubble's `variant` never actually applied. Fixed together with the type change above.
- `DuStats`: a stat with a legitimate `value` of `0` no longer disappears (was hidden by a truthy check).
- `DuDock` / `DuStats`: an item's `icon`/`figure`/`actions` explicitly set to `null` is no longer misclassified as a component (`typeof null === 'object'`).
- `DuCheckbox`: removed a redundant `modelValue` declaration that duplicated what `defineModel()` already provides; `indeterminate` is now reactive after mount, not just applied once on mount.
- `DuFilter`: per-item `buttonsArgs` now correctly takes priority over the shared component-level ones (the precedence was inverted); fixed every `DuFilter` instance's radio group sharing the literal name `"[object Object]"` instead of a real per-instance name (a `provide()` was passing a ref instead of its value).
- `DuTimeline`: the `timeline-box` class was unconditionally applied to the end box regardless of any prop (a dead `|| true`); the connecting-line/icon color for `valid` now consistently uses `success`/`error` in both dynamic items mode and manual (`DuTimelineItem`) mode (was `primary`/`error` in manual mode).
- `DuFieldset`: an empty `<legend>` is no longer rendered when no `legend` prop is given.
- `DuFab`: `mainAction.variant`/`closeButton.variant` are now typed as `Variant` instead of a raw `string` (the code already treated them as `Variant` via an internal cast, so an invalid value could previously slip past type-checking and silently produce no color class).

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
