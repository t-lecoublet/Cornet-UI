# Cornet architecture

How a Cornet component is built, and why. This is the reference the review
checklist points at: if a component disagrees with this document, one of the
two is wrong and it is usually the component.

Cornet is in beta. Where a convention is not yet applied everywhere, it says
so — an aspiration written as a fact is worse than no document.

---

## 1. Two layers

```
┌──────────────────────────────────────────────────────────┐
│  du-* facades — daisyUI markup, variants, sizes          │  ← the public API
├──────────────────────────────────────────────────────────┤
│  components/core/ — state, keyboard, focus, dismiss,     │  ← internal, no CSS,
│  positioning, ARIA prop bags                             │     no dependency
└──────────────────────────────────────────────────────────┘
```

**`core/` is internal.** It is not exported from `index.ts` and carries no
semver promise. Consumers use components; `core/` exists so that the popup
behaviour of a dropdown, a select and a tooltip is written and tested once.

Rules that hold without exception:

- `core/` imports Vue and nothing else. No daisyUI class, no Tailwind
  utility, no import from a facade.
- A facade owns markup, classes and daisyUI conventions. It holds no state
  that `core/` already holds — no local `isOpen`, no local highlight index.
- Anything a facade must put on an element for accessibility comes from a
  **prop bag** it spreads (`v-bind="triggerProps"`), never from `aria-*`
  attributes hand-written in the template. The bag is where the pattern
  lives; a hand-written attribute is where it drifts.

### What `core/` holds today

| Module | Contract | Consumers |
| --- | --- | --- |
| `combobox/useCombobox` | the whole combobox state machine, in one closure | DuSelect, DuSearch |
| `popover/usePopoverState` | open flag, Popover API, outside/Escape dismissal, focus return | combobox, DuDropdown |
| `positioning/useAnchorPosition` | CSS anchor positioning: `side` × `align` × `matchWidth` → inline style | combobox, DuDropdown |
| `navigation/useRovingIndex` | roving tabindex: arrows, Home/End, typeahead, skip disabled | DuMenu |
| `focus/useFocusReturn` | remembers what had focus before opening, hands it back after | DuDrawer |
| `focus/useFocusTrap` | keeps Tab inside a container while it is open | — (DuDrawer overlay, G5) |
| `shared/useControllableState` | the controlled/uncontrolled contract of §5 | DuDropdown |
| `shared/useComponentId` | SSR-safe ids (§6) | combobox, five facades |
| `shared/useNativeValidation` | native constraint validation, wearing the combobox's error surface | DuInputField |
| `shared/dom` | `focusableInDocument`, `isTextField`, `hasEditableText`, `revealInContainer` | combobox |

Four notes that are easy to lose:

- **`usePopoverState` can follow a flag it does not own.** Pass `state` — a
  `useControllableState` ref — and the consumer's prop is the single truth: in
  controlled mode a request to open only emits, the flag does not move, and
  nothing is shown. Its four hooks run `onOpening` → paint → `onOpened` and
  `onClosing` → hide → `onClosed`; `onClosing` runs *while still open*, so in
  controlled mode it can run without a close following.
- **`useAnchorPosition` never sets `position`.** A top-layer element gets
  `fixed` from the UA stylesheet and an inline one keeps the consumer's;
  setting it here would fight both.
- **`useRovingIndex` returns whether it consumed the key**, and does not call
  `preventDefault` itself — only the caller knows what else the key means in
  its widget.
- **The two focus primitives answer different questions.** `useFocusReturn`
  remembers where focus *was*; `usePopoverState`'s `returnFocusTo` names one
  element up front. The named version is right for a dropdown, whose trigger is
  part of the widget. It is wrong the moment an overlay can be opened from
  somewhere it cannot name — a keyboard shortcut, a row action, another dialog —
  and then only the remembered element is correct.
- **A native `<dialog>` opened with `showModal()` needs no trap.** The top
  layer makes the rest of the document inert for free. `useFocusTrap` is for
  overlays built out of ordinary elements, where nothing stops Tab from walking
  out of the panel into the page behind it. Only one trap may be active at a
  time; two would pull focus at each other.

### When to extract a primitive

Only when a **second real consumer** needs it. The combobox engine is
deliberately one closure: its features are coupled (selecting closes the
popup, closing commits the pending query, typing re-highlights, Tab needs to
know the widget boundary) and a shared scope makes that wiring direct.
Splitting it into seven modules "for later" would buy back the indirection
that writing it as one closure removed.

So: DuDropdown arrives, `popover/` gets extracted. Not before.

---

## 2. Files of a component

```
components/{Category}/du-{name}/
├── du-{name}.vue          # markup + wiring
├── du-{name}.types.ts     # every exported type, plus the scanner constants
└── du-{name}.stories.ts   # one story per variant
```

Categories: `Actions`, `DataDisplay`, `DataInput`, `Feedback`, `Layout`,
`Navigation`. Never ship fewer than three files.

A local `composables/` folder next to the `.vue` is allowed for logic that is
genuinely this component's own (`useRatingValue`, `usePaginationPages`,
`useFabClasses`). It is **not** the place for popup lifecycle, focus, dismiss
or keyboard navigation: those belong in `core/`, or the library grows six
subtly different implementations of Escape-to-close. `useMenuKeyboardNav` and
`useDrawerDismiss` used to break this rule and are gone; `useDrawerOpenState`
and `useDrawerClasses` remain because they are the drawer's own — one wraps
`useControllableState` for its two props, the other derives class lists.

Export from `index.ts`, then `npm run generate:types` — CI fails on drift.

### Never open a template with a comment

```vue
<template>
  <!-- why this element is like this -->   <!-- ✗ -->
  <div class="thing">
```

A `<template>` whose first node is a comment renders one vnode more than its
author counted, and Vue only auto-inherits attributes onto a **single** root.
The component then silently stops passing a consumer's `class`, `aria-label` or
`data-*` to anything — and only in development, because production builds strip
comments and the root becomes single again. A dev-only difference in attribute
inheritance is about the worst shape a bug can take.

Put the explanation in the `<script>`, where it costs nothing. A lint directive
that would have to sit above the root goes in `eslint.config.js` instead, with
its reason. `tests/template-root-invariant.spec.ts` enforces this; it exists
because the mistake has been made three separate times here.

---

## 3. Typing

**Generic whenever consumer data flows through.** If a component takes
`items` and hands them back through a slot or an emit, it is generic over the
item type, or the consumer's own fields are erased at the boundary:

```vue
<script setup lang="ts" generic="T extends DuChatItemData = DuChatItemData">
const props = withDefaults(defineProps<DuChatProps<T>>(), { items: undefined })
</script>
```

The matching interface takes the parameter with the same default, so
`DuChatProps` still means something written bare.

Constrain on the **minimum the component needs**, not on the default shape.
`DuTableProps<R extends DuTableRowBase>` accepts a consumer's
`interface Invoice { id: number }`; constraining on `DuTableRow` would not,
because an interface has no implicit index signature.

**`any` is a lint error** (`@typescript-eslint/no-explicit-any`), with two
exemptions:

- `.stories.ts` — `render: (args: any)` is Storybook's own signature.
- The `O = any, V = any` defaults on `DuSelect`/`DuSearch`, justified in a
  comment next to them: both are inferred at every real call site, and
  `unknown` there would only force casts in consumer code.

`unknown` is the right type for an index signature (`[key: string]: unknown`)
— reading an unlisted key should require a narrowing step.

`strict` is on (inherited from `@vue/tsconfig`), and `npm run type-check`
blocks CI over `components/`, `composables/`, `index.ts`, `plugin-vite.ts`,
`types/` **and `tests/`**.

Type-checking the tests is not tidiness: a test is the only place a component
is used the way a consumer uses it, so it is the only place a props type is
exercised at all. Leaving `tests/` out hid a real one — `DuTableColumn.key`
was `Extract<keyof Row, string>`, which reads well and rejects
`const columns = [{ key: 'name' }]`, because TypeScript widens that `'name'` to
`string` before the type ever sees it. Every ordinary consumer would have hit
it. `.vue` files are checked by `vue-tsc`, so a spec that mounts a component
checks its props.

---

## 4. Naming

| Thing | Convention |
| --- | --- |
| Component | `DuButton`, file `du-button.vue` |
| Types | `Du{Component}Props`, `Du{Component}Size`, `Du{Component}Emit` |
| Constants | `UPPER_SNAKE_CASE` (`BUTTON_SIZES`, `MODAL_PLACEMENTS`) |
| Boolean props | no `is` prefix — `disabled`, `open`, `readonly` |
| Controllable state | the prop plus `update:{prop}` |
| Slots | kebab-case (`no-options`, `create-option`), scope typed |

Default UI strings are English and every one of them is overridable through a
prop or a slot. Code comments are in English.

---

## 5. State a consumer can control

Every prop that represents state a consumer might want to drive — `open`,
`modelValue`, `activeIndex` — follows one contract:

- Prop absent (`undefined`): the component keeps the state internally and
  emits changes.
- Prop present: the component follows the prop and only emits; it never
  writes its own copy.

Do not invent a local variant of this per component. (`core/shared/
useControllableState` is planned to hold it — see `PLAN-REFACTO-GLOBAL.md`
§2.1; until it lands, follow the contract by hand.)

An emit-only component with no `v-model` is a bug, not a design: a consumer
who cannot set the state cannot restore it.

---

## 6. Ids

`useId()` through `core/shared/useComponentId`, never `Math.random()`.

A random id is a different string on the server and on the client, so Vue
reports a hydration mismatch and every `for`/`id` and `aria-controls` pair
spanning the boundary breaks. `useComponentId` also strips `:`, which is legal
in an `id` attribute but not in a CSS custom property name.

Two properties are worth testing for anything that generates one, and
`tests/generated-ids.spec.ts` does: two instances on a page do not collide,
and two identical renders produce the same value.

A literal default for a group name (`name: 'accordion'`) is the same bug in
disguise: two instances on a page share the group.

---

## 7. Accessibility

Name the WAI-ARIA APG pattern the component implements in a comment at the top
of its template, and implement that pattern rather than an approximation of it.

- Roles and `aria-*` come from prop bags provided by `core/`.
- Full keyboard support means arrows, `Home`/`End`, `PageUp`/`PageDown` where
  the list is long, `Escape` to dismiss, and `Tab` leaving the widget instead
  of walking into it.
- `role="menu"` is for menus of actions. A navigation sidebar is a list of
  links; giving it `role="menu"` tells a screen reader user to expect
  application menu behaviour that is not there.
- Icon-only controls take an accessible label through a prop with an English
  default.
- **A control's accessible name must contain its visible text** (WCAG 2.5.3):
  someone saying "click Save" to a voice assistant needs the two to match. So a
  prop that sets `aria-label` on a *control* applies only when there is nothing
  visible to name it — `DuButton`'s `label` is ignored once its slot is filled,
  and `ariaLabel` is the explicit escape hatch for an icon-only button. On a
  *container* — a dialog, a group, a slide — `aria-label` names the region and
  does not compete with anything, so the rule does not apply. No test enforces
  this: telling the two cases apart is a judgement about what the element *is*,
  which static analysis gets wrong in both directions.
- Anything that appears on hover must also appear on keyboard focus, and must
  be dismissible with `Escape` (WCAG 1.4.13).

**Document-level listeners** (click-outside, `Escape`) are attached when the
popup opens and removed when it closes, with an `onUnmounted` safety net. A
page holding fifty closed comboboxes must hold zero idle listeners. The
combobox engine's `watch(isOpen)` is the reference implementation.

---

## 8. Styling state

State is styled through data attributes, not through class ternaries driven by
index comparisons:

```html
<li :class="'data-highlighted:bg-base-200 aria-selected:font-medium'">
```

`data-highlighted`, `aria-selected` and `aria-disabled` are already on the
element for accessibility reasons; reusing them for styling means the visual
state and the announced state cannot disagree. A consumer restyling a
component targets the same attributes.

### Nested sizes

A control rendered **inside** a sized component follows it, one step down,
through `nestedSize()`:

```ts
const inner = reactive({ get size() { return nestedSize(props.size) } })
const { sizeClass } = useSizeMapping(inner, 'btn')
```

A hardcoded `btn-sm` inside a component that exposes `size` is a bug. (A
hardcoded one inside a component with no size scale — `DuModal`, `DuAlert`,
neither of which daisyUI gives sizes to — is just a choice of size.)

---

## 9. The Tailwind scanner invariant

Cornet ships in two modes. In **embedded** mode the consumer's Tailwind scans
the library source, and Tailwind only generates a utility whose class name
appears **as a literal string** in a scanned file. A class built at runtime —
`` `btn-${props.size}` ``, which is what `useSizeMapping` does — appears
nowhere, so it is never generated, and the component renders unstyled in a
consumer's build while looking fine in the repo.

The fix is a constant in the component's own `.types.ts`:

```ts
// Tailwind-scan safelist: useSizeMapping(props, 'btn') builds these literals
// at runtime; keep them here so they're always scanned.
export const BUTTON_SIZES = ['btn-xs', 'btn-sm', 'btn-md', 'btn-lg', 'btn-xl'] as const
```

`tests/class-literals-invariant.spec.ts` enforces it: for every
`useSizeMapping(props, 'x')` / `useVariantMapping(props, 'x')` call, the
`x-xs`…`x-xl` (or `x-primary`…`x-error`) literals must be reachable in the
component's own directory or in a directly imported component's directory.
The directory matters — a `btn-*` list in DuButton does not cover DuPagination
unless DuPagination imports DuButton.

Adding a `useSizeMapping` call with a new suffix therefore means adding the
matching constant in the same commit. `mapVariant(value, 'x')` — the same
mapping for one value, such as a variant per list item — counts as a call too.

These checks only see the mapping calls, so a class built by hand
(`` `step-${props.variant}` ``) slipped past all of them: DuSteps' colours were
never generated. The same spec therefore also rejects any size/variant/colour
class built by hand — template literal or concatenation.

The invariant proves a class is *scannable*. It cannot prove daisyUI defines
it — a safelist can be complete and still name a class that does not exist, in
which case the prop silently does nothing. `npm run check:css`
(`scripts/check-embedded-css.mjs`) closes that: it compiles Tailwind plus the
daisyUI plugin over the library sources, exactly as a consumer's embedded
build does, and fails on any runtime class that produces no rule — counting a
component's own `<style>` block as a valid definition, which is how DuAvatar's
size scale and DuTooltip's neutral variant are styled. It runs in CI.

---

## 10. Test bar

Every interactive component ships black-box tests — mount it, drive it like a
user, assert what a user or a screen reader would observe. Reaching into
internals means the test will survive a refactor that breaks the component.

Cover:

- `v-model` in both modes, controlled and uncontrolled;
- every emit, including the ones that fire on dismissal;
- the whole keyboard surface, not the happy path;
- the ARIA attributes the pattern requires;
- two instances mounted together, for id collisions.

`core/` primitives get their own spec on top of the facade tests that exercise
them.

`tests/a11y.spec.ts` runs axe-core over a representative mount of every
component and blocks on `serious` and `critical` findings. Treat it as a
floor: automated rules see a missing accessible name, not a navigation list
wearing listbox semantics. A component with a structural bug scheduled for a
later phase carries a `knownIssues` entry naming the rule and the plan section
— and the spec asserts each listed rule *still fires*, so an entry cannot
outlive the bug it documents.

`eslint-plugin-vuejs-accessibility` runs in the same pass as the rest of the
lint. Its exemptions are per line with the reason written next to them; the
one config-level exemption is `form-control-has-label` on the form primitives,
which render the bare control and leave the label to the consumer.

`tests/ssr.spec.ts` renders every exported component on a server, twice. It
catches the one class of failure a browser-shaped test cannot see: a component
that touches `document` during `setup()`, and markup that differs between two
renders of the same input — which is a hydration mismatch and quietly breaks
every `for`/`id` pair.

`tests/api-consistency.spec.ts` checks the names rather than the behaviour: one
spelling for an accessible-name prop, `update:x` paired with an `x` prop, props
interfaces named after their component. It is the check an API freeze is for.

Environment gaps (the Popover API, `matchMedia`) live in
`tests/helpers/environment.ts` and are **opt-in**, not a global setup: several
suites depend on a capability being *absent* — `useDrawerPinned` answers
"floating" when `matchMedia` is missing, and the drawer's dialog tests rely on
that. A global mock would retire them silently.

`core/` carries a line-coverage threshold (80%, currently 96%) because it is the
only code with no styling to look at and no story to click through: what is not
covered by a test is not covered at all. The facades are held to the
behavioural bar above instead, which line coverage measures badly.

The green bar before any merge request — all of it blocking in CI:

```bash
npm run lint          # + eslint-plugin-vuejs-accessibility
npm run type-check
npm run test:coverage
npm run check:css     # embedded-mode control build
npm run build
npm run generate:types && git diff --exit-code types/index.ts
```
