/**
 * One miniature preview per documented component, for the "All Components"
 * gallery.
 *
 * Keyed by doc path. The gallery iterates `docsNav`, not this map, so a newly
 * documented component shows up on the page immediately — with a visible
 * "no preview yet" cell rather than silently going missing.
 *
 * Two rules for a snippet:
 *
 *  - **It is a picture, not a demo.** The gallery renders every cell with
 *    `pointer-events: none` so a click lands on the card's link instead of the
 *    component. Anything that needs a state to be worth looking at is shown in
 *    that state (`:open="true"`, a filled `modelValue`), never waiting for an
 *    interaction that cannot happen.
 *  - **It stays inside its cell.** Components daisyUI positions with `fixed`
 *    (toast, dock) or that the browser puts in the top layer (modal) would
 *    otherwise escape onto the page, so they are shown bounded — `absolute`
 *    inside a `relative` box, or as the markup they produce.
 */
export const componentGallery: Record<string, string> = {
  // ─── Actions ──────────────────────────────────────────────
  '/docs/actions/button': `<div class="flex flex-wrap gap-2 justify-center">
  <DuButton variant="primary" size="sm">Primary</DuButton>
  <DuButton variant="secondary" size="sm" outline>Outline</DuButton>
  <DuButton size="sm" ghost>Ghost</DuButton>
</div>`,

  // The panel is absolutely positioned below the trigger and would fall out
  // of a vertically centred tile, so the trigger sits at the top instead.
  '/docs/actions/dropdown': `<div class="h-28 w-full flex items-start justify-center">
  <DuDropdown :open="true" placement="bottom">
    <template #trigger="{ triggerProps }">
      <DuButton size="sm" v-bind="triggerProps">Menu</DuButton>
    </template>
    <DuMenu size="sm" class="w-32" :items="[{ label: 'Edit' }, { label: 'Delete' }]" />
  </DuDropdown>
</div>`,

  // daisyUI reveals a FAB's actions on `:focus-within`, and nothing in a
  // `pointer-events: none` tile can take focus — so the gallery's own
  // `gallery-fab-open` rule pins the open state.
  '/docs/actions/fab': `<div class="relative h-24 w-full gallery-fab-open">
  <DuFab
    absolute
    size="xs"
    circle
    :mainAction="{ label: '+', variant: 'primary' }"
    :items="[{ label: 'Share' }, { label: 'Copy' }]"
  />
</div>`,

  // A real <dialog> would take the top layer and cover the gallery. The cell
  // draws the box instead — with plain utilities, not `.modal-box`, which
  // daisyUI keeps at `opacity: 0` until an open `.modal` reveals it.
  '/docs/actions/modal': `<div class="bg-base-100 border border-base-300 rounded-box shadow-xl w-56 p-4">
  <h3 class="font-bold">Confirm</h3>
  <p class="text-xs text-base-content/60 mt-1">Are you sure?</p>
  <div class="flex gap-2 justify-end mt-3">
    <DuButton size="xs" ghost>Cancel</DuButton>
    <DuButton size="xs" variant="primary">OK</DuButton>
  </div>
</div>`,

  '/docs/actions/swap': `<div class="flex gap-4 text-3xl">
  <DuSwap rotate ariaLabel="Toggle theme">
    <template #on>🌙</template>
    <template #off>☀️</template>
  </DuSwap>
</div>`,

  // ─── Data Display ─────────────────────────────────────────
  '/docs/data-display/accordion': `<div class="w-56">
  <DuAccordion
    modifier="collapse-arrow"
    :items="[
      { title: 'What is Cornet?', content: 'A Vue 3 library.', checked: true },
      { title: 'Is it free?', content: 'Yes.' },
    ]"
  />
</div>`,

  // The last one pairs a ring with a DuStatus placed bottom-right. DuAvatar's
  // own `online` prop is daisyUI's indicator and sits *top*-right, so a dot in
  // the other corner is composed rather than configured.
  // Masks need an image: they clip a box, and a placeholder gives them no
  // height to clip. `online` and `offline` are daisyUI's own indicator, drawn
  // top-right on the `.avatar` itself — no wrapper, no second component.
  '/docs/data-display/avatar': `<div class="flex items-center gap-3">
  <DuAvatar size="sm" rounded="full">
    <img src="https://i.pravatar.cc/96?img=12" alt="" />
  </DuAvatar>
  <DuAvatar size="sm" mask="squircle">
    <img src="https://i.pravatar.cc/96?img=32" alt="" />
  </DuAvatar>
  <DuAvatar size="sm" mask="hexagon" offline>
    <img src="https://i.pravatar.cc/96?img=15" alt="" />
  </DuAvatar>
  <DuAvatar size="sm" rounded="full" ring ringColor="primary" online placeholder variant="neutral">
    CD
  </DuAvatar>
</div>`,

  '/docs/data-display/badge': `<div class="flex flex-wrap gap-2 justify-center">
  <DuBadge variant="primary">Primary</DuBadge>
  <DuBadge variant="success" size="sm">New</DuBadge>
  <DuBadge variant="error" soft>Error</DuBadge>
</div>`,

  '/docs/data-display/card': `<DuCard bordered class="w-48">
  <template #title>Card title</template>
  <p class="text-xs text-base-content/60">A short description.</p>
  <template #actions>
    <DuButton size="xs" variant="primary">Buy</DuButton>
  </template>
</DuCard>`,

  // The width goes on each item, not on DuCarousel: its root is a wrapper
  // div, so a consumer's `class` no longer reaches the `.carousel` strip.
  '/docs/data-display/carousel': `<DuCarousel
  ariaLabel="Preview"
  class="max-w-full rounded-lg"
  :items="[
    { id: 'g1', content: '1', customClass: 'w-24 h-20 bg-primary/20 items-center justify-center font-bold text-lg rounded-lg mr-2' },
    { id: 'g2', content: '2', customClass: 'w-24 h-20 bg-secondary/20 items-center justify-center font-bold text-lg rounded-lg mr-2' },
    { id: 'g3', content: '3', customClass: 'w-24 h-20 bg-accent/20 items-center justify-center font-bold text-lg rounded-lg' },
  ]"
/>`,

  '/docs/data-display/chat': `<div class="w-56">
  <DuChat
    :items="[
      { message: 'Hi there', placement: 'start' },
      { message: 'Hello!', placement: 'end', variant: 'primary' },
    ]"
  />
</div>`,

  '/docs/data-display/collapse': `<div class="w-56">
  <DuCollapse
    modifier="collapse-plus"
    :items="[
      { title: 'Filters', content: 'Filter controls.', open: true },
      { title: 'Sorting', content: 'Sort controls.' },
    ]"
  />
</div>`,

  // `autoStart` is on by default: without turning it off the tile counts
  // itself down to 00:00 and stays there.
  '/docs/data-display/countdown': `<div class="flex gap-2 text-3xl font-mono">
  <DuCountdown :value="12" :autoStart="false" />
  <span>:</span>
  <DuCountdown :value="34" :autoStart="false" />
</div>`,

  '/docs/data-display/diff': `<DuDiff
  class="rounded-lg w-52 aspect-video"
  ariaLabel="Before and after"
  item1="https://img.daisyui.com/images/stock/photo-1560717789-0ac7c58ac90a.webp"
  item2="https://img.daisyui.com/images/stock/photo-1560717789-0ac7c58ac90a-blur.webp"
  item1Alt="Sharp"
  item2Alt="Blurred"
/>`,

  '/docs/data-display/kbd': `<div class="flex gap-1 items-center">
  <DuKbd>⌘</DuKbd>
  <span class="text-xs">+</span>
  <DuKbd>K</DuKbd>
</div>`,

  '/docs/data-display/list': `<DuList class="w-52 bg-base-100">
  <DuListRow>First item</DuListRow>
  <DuListRow>Second item</DuListRow>
</DuList>`,

  '/docs/data-display/stat': `<DuStat class="w-48">
  <template #title>Downloads</template>
  <template #value>31K</template>
  <template #desc>Jan 1st – Feb 1st</template>
</DuStat>`,

  '/docs/data-display/stats': `<DuStats
  shadow
  :items="[
    { title: 'Users', value: '4.2K', description: '↗ 40 (2%)' },
    { title: 'Churn', value: '1.2%', description: '↘ 3%' },
  ]"
/>`,

  '/docs/data-display/status': `<div class="flex gap-4 items-center text-sm">
  <span class="flex items-center gap-1.5"><DuStatus variant="success" /> Online</span>
  <span class="flex items-center gap-1.5"><DuStatus variant="warning" /> Idle</span>
  <span class="flex items-center gap-1.5"><DuStatus variant="error" /> Down</span>
</div>`,

  '/docs/data-display/table': `<DuTable
  size="xs"
  zebra
  class="w-52"
  :columns="[{ key: 'name', label: 'Name' }, { key: 'role', label: 'Role' }]"
  :rows="[
    { id: 1, name: 'Ada', role: 'Admin' },
    { id: 2, name: 'Grace', role: 'Dev' },
  ]"
/>`,

  '/docs/data-display/timeline': `<DuTimeline
  class="w-52"
  :items="[
    { start: '2024', end: 'First release' },
    { start: '2026', end: 'Version 2' },
  ]"
/>`,

  // ─── Data Input ───────────────────────────────────────────
  '/docs/data-input/checkbox': `<div class="flex gap-3 items-center">
  <DuCheckbox :modelValue="true" variant="primary" />
  <DuCheckbox :modelValue="true" variant="secondary" />
  <DuCheckbox :modelValue="false" />
</div>`,

  '/docs/data-input/fieldset': `<DuFieldset legend="Profile" class="w-52">
  <DuInputField placeholder="Your name" size="sm" />
</DuFieldset>`,

  '/docs/data-input/file-input': `<DuFileInput class="w-52" size="sm" ariaLabel="Attachment" />`,

  '/docs/data-input/filter': `<DuFilter
  legend="Status"
  :items="[{ title: 'All', checked: true }, { title: 'Active' }, { title: 'Done' }]"
/>`,

  '/docs/data-input/input-field': `<div class="flex flex-col gap-2 w-52">
  <DuInputField placeholder="Your name" size="sm" />
  <DuInputField placeholder="Primary" variant="primary" size="sm" />
</div>`,

  '/docs/data-input/label': `<DuLabel type="label" class="w-52">
  Email
  <DuInputField type="email" placeholder="you@example.com" size="sm" />
</DuLabel>`,

  '/docs/data-input/label-input-validator': `<DuLabelInputValidator
  type="label"
  inputType="email"
  placeholder="you@example.com"
  class="w-52"
>
  Email
</DuLabelInputValidator>`,

  '/docs/data-input/radio': `<div class="flex gap-3 items-center">
  <DuRadio name="gallery-radio" value="a" :checked="true" variant="primary" />
  <DuRadio name="gallery-radio" value="b" variant="secondary" />
  <DuRadio name="gallery-radio" value="c" />
</div>`,

  '/docs/data-input/range': `<DuRange
  class="w-52"
  :modelValue="60"
  variant="primary"
  ariaLabel="Volume"
/>`,

  '/docs/data-input/rating': `<DuRating :modelValue="4" readonly ariaLabel="Rated 4 out of 5" />`,

  '/docs/data-input/search': `<DuSearch
  class="w-52"
  size="sm"
  ariaLabel="Search"
  placeholder="Search…"
  :options="[{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]"
/>`,

  '/docs/data-input/select': `<DuSelect
  class="w-52"
  size="sm"
  ariaLabel="Fruit"
  placeholder="Choose…"
  :options="['Apple', 'Banana', 'Cherry']"
/>`,

  '/docs/data-input/textarea': `<DuTextArea class="w-52" size="sm" placeholder="Write something…" />`,

  // ─── Feedback ─────────────────────────────────────────────
  '/docs/feedback/alert': `<DuAlert variant="success" icon class="w-56 text-sm">
  Saved successfully
</DuAlert>`,

  '/docs/feedback/loading': `<div class="flex gap-4 items-center">
  <DuLoading animation="spinner" variant="primary" ariaLabel="Loading" />
  <DuLoading animation="dots" variant="secondary" ariaLabel="Loading" />
  <DuLoading animation="ring" variant="accent" ariaLabel="Loading" />
</div>`,

  '/docs/feedback/progress': `<div class="flex flex-col gap-2 w-52">
  <DuProgress :value="70" variant="primary" ariaLabel="Upload" />
  <DuProgress :value="40" variant="success" ariaLabel="Sync" />
</div>`,

  '/docs/feedback/radial-progress': `<div class="flex gap-3">
  <DuRadialProgress :value="70" variant="primary" ariaLabel="Storage used">70%</DuRadialProgress>
  <DuRadialProgress :value="35" variant="warning" ariaLabel="Quota used">35%</DuRadialProgress>
</div>`,

  '/docs/feedback/skeleton': `<div class="flex flex-col gap-2 w-52">
  <DuSkeleton class="h-16 w-full rounded-lg" ariaLabel="Loading" />
  <DuSkeleton class="h-3 w-3/4" />
  <DuSkeleton class="h-3 w-1/2" />
</div>`,

  // `.toast` is fixed-positioned; bounded here so it stays in its cell.
  '/docs/feedback/toast': `<div class="relative h-24 w-full overflow-hidden">
  <DuToast class="absolute" horizontalPosition="end" verticalPosition="bottom">
    <DuAlert variant="success" icon>Saved</DuAlert>
  </DuToast>
</div>`,

  '/docs/feedback/tooltip': `<div class="h-28 w-full flex items-end justify-center pb-2">
  <DuTooltip dataTip="A helpful hint" :open="true">
    <DuButton size="sm">Hover me</DuButton>
  </DuTooltip>
</div>`,

  // ─── Layout ───────────────────────────────────────────────
  // An open DuDrawer is a modal: its focus trap grabs focus on mount and pulls
  // it back on every click elsewhere, scrolling the gallery to this tile and
  // swallowing the click. The cell draws the open layout instead.
  '/docs/layout/drawer': `<div class="relative h-28 w-full overflow-hidden rounded-lg border border-base-300 flex">
  <nav class="p-3 bg-base-200 h-full w-28 shrink-0">
    <ul class="menu menu-xs p-0">
      <li><span>Home</span></li>
      <li><span>Settings</span></li>
    </ul>
  </nav>
  <div class="p-3 text-xs text-base-content/50">Page content</div>
</div>`,

  '/docs/layout/join': `<DuJoin direction="horizontal">
  <DuButton size="sm" class="join-item">Left</DuButton>
  <DuButton size="sm" class="join-item" variant="primary">Mid</DuButton>
  <DuButton size="sm" class="join-item">Right</DuButton>
</DuJoin>`,

  // ─── Navigation ───────────────────────────────────────────
  '/docs/navigation/breadcrumbs': `<DuBreadcrumbs
  class="text-sm"
  :items="[{ label: 'Home', href: '#' }, { label: 'Docs', href: '#' }, { label: 'Breadcrumbs' }]"
/>`,

  // `.dock` is fixed-positioned; bounded here so it stays in its cell.
  '/docs/navigation/dock': `<div class="relative h-24 w-full overflow-hidden rounded-lg border border-base-300">
  <DuDock
    class="absolute"
    size="sm"
    ariaLabel="Sections"
    :items="[
      { label: 'Home', active: true },
      { label: 'Search' },
      { label: 'Profile' },
    ]"
  />
</div>`,

  '/docs/navigation/link': `<div class="flex gap-3 text-sm">
  <DuLink href="#" variant="primary">Primary</DuLink>
  <DuLink href="#" variant="secondary">Secondary</DuLink>
  <DuLink href="#">Default</DuLink>
</div>`,

  '/docs/navigation/menu': `<DuMenu
  size="sm"
  class="w-40 bg-base-200 rounded-lg"
  ariaLabel="Sections"
  activeItem="Projects"
  :items="[{ label: 'Dashboard' }, { label: 'Projects' }, { label: 'Team' }]"
/>`,

  '/docs/navigation/navbar': `<DuNavbar class="border border-base-300 rounded-lg w-full text-sm">
  <template #start><span class="font-bold px-2">Cornet</span></template>
  <template #end><DuButton size="xs" variant="primary">Sign in</DuButton></template>
</DuNavbar>`,

  '/docs/navigation/pagination': `<DuPagination
  :modelValue="2"
  :total="50"
  :perPage="10"
  size="sm"
  variant="primary"
  ariaLabel="Pages"
/>`,

  '/docs/navigation/steps': `<DuSteps
  ariaLabel="Checkout"
  :activeSteps="[0, 1]"
  variant="primary"
  :items="[{ label: 'Cart' }, { label: 'Pay' }, { label: 'Done' }]"
/>`,

  '/docs/navigation/tabs': `<DuTabs
  type="box"
  ariaLabel="Sections"
  class="w-52"
  :items="[{ label: 'Tab 1', active: true }, { label: 'Tab 2' }]"
/>`,
}
