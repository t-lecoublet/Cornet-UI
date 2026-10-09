import type { DocPageData } from '@/types/docs'

export default {
  title: 'Dropdown',
  description: 'Dropdown opens a panel — a menu, a form, a card — from a trigger. It follows the WAI-ARIA disclosure pattern: the trigger carries `aria-expanded`, Escape and outside presses dismiss, and focus goes back where it came from.',
  category: 'Actions',
  source: 'https://daisyui.com/components/dropdown/',
  props: [
    {
      title: 'open',
      description: 'Open state. Omit it and the dropdown owns its own; pass it (with `@update:open`, or `v-model:open`) and yours decides.',
      type: 'boolean | undefined',
      default: 'undefined',
    },
    {
      title: 'hover',
      description: 'Also open on pointer hover and on keyboard focus, not only on click.',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'openDelay',
      description: 'How long a pointer must rest on the trigger before it opens, in ms. Stops a pointer crossing the trigger from flashing the panel.',
      type: 'number',
      default: '100',
    },
    {
      title: 'closeDelay',
      description: 'How long the panel lingers after the pointer leaves, in ms — long enough to reach it.',
      type: 'number',
      default: '100',
    },
    {
      title: 'placement',
      description: 'Dropdown position. Accepts a single value, a comma-separated string, an array, or an object — in object form only the keys set to `true` are applied.',
      type: 'DuDropdownPlacementInput',
      default: '"bottom"',
      options: ['start', 'center', 'end', 'top', 'bottom', 'left', 'right'],
    },
    {
      title: 'popover',
      description: 'Render the panel in the top layer (Popover API + CSS anchor positioning), so an `overflow: hidden` ancestor cannot clip it.',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'closeOnClickOutside',
      description: 'Close when a press lands outside the dropdown.',
      type: 'boolean',
      default: 'true',
    },
    {
      title: 'closeOnEscape',
      description: 'Close on Escape, handing focus back to the trigger.',
      type: 'boolean',
      default: 'true',
    },
    {
      title: 'disabled',
      description: 'The dropdown cannot be opened at all.',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'contentClass',
      description: 'Extra classes on the panel itself.',
      type: 'string',
      default: "''",
    },
  ],
  slots: [
    {
      title: 'Slot #trigger',
      description: 'The element that opens the dropdown. **Spread `triggerProps` on it** — that scope carries `aria-expanded`, `aria-haspopup`, `aria-controls`, the click toggle and ArrowDown-to-open. Without it nothing opens. The scope also gives you `open` and `toggle()`.',
      preview: `<DuDropdown>
  <template #trigger="{ triggerProps, open }">
    <DuButton soft v-bind="triggerProps">{{ open ? 'Close' : 'Open' }}</DuButton>
  </template>
  <DuMenu :items="[{ label: 'Item 1' }, { label: 'Item 2' }]" class="w-40" />
</DuDropdown>`,
      code: `<DuDropdown>
  <template #trigger="{ triggerProps, open }">
    <DuButton v-bind="triggerProps">{{ open ? 'Close' : 'Open' }}</DuButton>
  </template>
  <DuMenu :items="[{ label: 'Item 1' }, { label: 'Item 2' }]" class="w-40" />
</DuDropdown>`,
    },
    {
      title: 'Slot #content',
      description: 'Content displayed in the dropdown panel — the same as the default slot, plus an `{ open, close }` scope so a panel can dismiss itself.',
      preview: `<DuDropdown>
  <template #trigger="{ triggerProps }">
    <DuButton soft v-bind="triggerProps">Menu</DuButton>
  </template>
  <template #content="{ close }">
    <div class="p-4 w-52 flex flex-col gap-2">
      <p class="text-sm">Pick something, then close.</p>
      <DuButton size="sm" variant="primary" @click="close">Done</DuButton>
    </div>
  </template>
</DuDropdown>`,
      code: `<DuDropdown>
  <template #trigger="{ triggerProps }">
    <DuButton v-bind="triggerProps">Menu</DuButton>
  </template>
  <template #content="{ close }">
    <div class="p-4 w-52">
      <DuButton size="sm" @click="close">Done</DuButton>
    </div>
  </template>
</DuDropdown>`,
    },
  ],
  classnames: {
    component: [
      { class: 'dropdown', desc: 'Base class on the wrapper, always applied.' },
      { class: 'dropdown-content', desc: 'The panel. Ships with bg-base-100 rounded-box shadow-sm.' },
    ],
    modifier: [
      { class: 'dropdown-open', desc: 'Applied whenever the panel is up — including in hover mode.' },
      { class: 'dropdown-close', desc: 'Applied whenever it is down. One of the two is always present, so daisyUI\'s :focus-within rule can never reveal a panel aria-expanded says is closed.' },
    ],
    placement: [
      { class: 'dropdown-top', desc: 'placement="top"' },
      { class: 'dropdown-bottom', desc: 'placement="bottom"' },
      { class: 'dropdown-left', desc: 'placement="left"' },
      { class: 'dropdown-right', desc: 'placement="right"' },
      { class: 'dropdown-start', desc: 'placement="start"' },
      { class: 'dropdown-center', desc: 'placement="center"' },
      { class: 'dropdown-end', desc: 'placement="end"' },
    ],
  },
  sections: [
    {
      title: 'The trigger must spread triggerProps',
      description: 'This is the one thing to get right. `#trigger` hands you a `triggerProps` object; bind it to whatever opens the dropdown. It carries the ARIA wiring (`aria-expanded`, `aria-haspopup`, `aria-controls`) *and* the handlers — click to toggle, ArrowDown to open. A trigger without it renders fine and does nothing.',
      links: [
        { label: 'WAI-ARIA disclosure pattern', href: 'https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/' },
        { label: 'Vue scoped slots', href: 'https://vuejs.org/guide/components/slots.html#scoped-slots' },
      ],
      preview: `<DuDropdown>
  <template #trigger="{ triggerProps }">
    <DuButton soft v-bind="triggerProps">Click me</DuButton>
  </template>
  <DuMenu
    :items="[
      { label: 'Item 1' },
      { label: 'Item 2' }
    ]"
    class="w-40"
  />
</DuDropdown>`,
      code: `<DuDropdown>
  <template #trigger="{ triggerProps }">
    <DuButton v-bind="triggerProps">Click me</DuButton>
  </template>
  <DuMenu
    :items="[
      { label: 'Item 1' },
      { label: 'Item 2' }
    ]"
    class="w-40"
  />
</DuDropdown>

<!-- Any element works, as long as it takes the props -->
<DuDropdown>
  <template #trigger="{ triggerProps }">
    <button class="btn" v-bind="triggerProps">Click me</button>
  </template>
  <div class="p-4">Panel</div>
</DuDropdown>`,
    },
    {
      title: 'Menu button',
      description: 'Pair it with `<DuMenu role="menu">` for the APG menu-button pattern: the trigger says `aria-haspopup`, the panel is a real `role="menu"` walked with the arrow keys, and Escape closes it and returns focus to the trigger.',
      links: [
        { label: 'APG menu button pattern', href: 'https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/' },
        { label: 'DuMenu docs', href: '/docs/navigation/menu' },
      ],
      preview: `<DuDropdown>
  <template #trigger="{ triggerProps }">
    <DuButton soft v-bind="triggerProps">Actions</DuButton>
  </template>
  <DuMenu
    role="menu"
    ariaLabel="Actions"
    :items="[
      { label: 'Edit' },
      { label: 'Duplicate' },
      { label: 'Delete', disabled: true }
    ]"
    class="w-40"
  />
</DuDropdown>`,
      code: `<DuDropdown>
  <template #trigger="{ triggerProps }">
    <DuButton v-bind="triggerProps">Actions</DuButton>
  </template>
  <DuMenu
    role="menu"
    ariaLabel="Actions"
    :items="[
      { label: 'Edit', onClick: edit },
      { label: 'Duplicate', onClick: duplicate },
      { label: 'Delete', disabled: true }
    ]"
    class="w-40"
  />
</DuDropdown>`,
    },
    {
      title: 'Open on hover',
      description: '`hover` is driven in JS, not by daisyUI\'s `dropdown-hover` class, so the panel and `aria-expanded` can never disagree. It also opens on **keyboard focus** — a pointer-only affordance is not one. `openDelay` / `closeDelay` (100 ms each) keep a pointer crossing the trigger from flashing it, and give you time to travel to the panel.',
      preview: `<DuDropdown hover>
  <template #trigger="{ triggerProps }">
    <DuButton soft v-bind="triggerProps">Hover me</DuButton>
  </template>
  <DuMenu
    :items="[
      { label: 'Item 1' },
      { label: 'Item 2' }
    ]"
    class="w-40"
  />
</DuDropdown>`,
      code: `<DuDropdown hover :openDelay="200" :closeDelay="150">
  <template #trigger="{ triggerProps }">
    <DuButton v-bind="triggerProps">Hover me</DuButton>
  </template>
  <DuMenu
    :items="[
      { label: 'Item 1' },
      { label: 'Item 2' }
    ]"
    class="w-40"
  />
</DuDropdown>`,
    },
    {
      title: 'Placement',
      preview: `<div class="flex gap-4 flex-wrap justify-center">
  <DuDropdown placement="left">
    <template #trigger="{ triggerProps }"><DuButton v-bind="triggerProps">Left</DuButton></template>
    <DuMenu :items="[{ label: 'Item 1' }]" class="w-40" />
  </DuDropdown>
  <DuDropdown placement="top">
    <template #trigger="{ triggerProps }"><DuButton v-bind="triggerProps">Top</DuButton></template>
    <DuMenu :items="[{ label: 'Item 1' }]" class="w-40" />
  </DuDropdown>
  <DuDropdown placement="bottom">
    <template #trigger="{ triggerProps }"><DuButton v-bind="triggerProps">Bottom</DuButton></template>
    <DuMenu :items="[{ label: 'Item 1' }]" class="w-40" />
  </DuDropdown>
  <DuDropdown placement="right">
    <template #trigger="{ triggerProps }"><DuButton v-bind="triggerProps">Right</DuButton></template>
    <DuMenu :items="[{ label: 'Item 1' }]" class="w-40" />
  </DuDropdown>
</div>`,
      code: `<DuDropdown placement="left">
  <template #trigger="{ triggerProps }">
    <DuButton v-bind="triggerProps">Left</DuButton>
  </template>
  <DuMenu :items="[{ label: 'Item 1' }]" class="w-40" />
</DuDropdown>

<DuDropdown placement="top">…</DuDropdown>
<DuDropdown placement="bottom">…</DuDropdown>
<DuDropdown placement="right">…</DuDropdown>`,
    },
    {
      title: 'Controlled open state',
      description: 'Omit `open` and the dropdown owns its state. Pass it — with `v-model:open`, or with `@update:open` — and yours decides. Passing `:open="true"` **without** a listener pins it open: the dropdown emits and stays put rather than overruling you. That is the same controlled/uncontrolled contract every stateful Cornet component follows.',
      preview: `<div class="flex gap-4 items-start">
  <DuDropdown v-model:open="isOpen">
    <template #trigger="{ triggerProps }">
      <DuButton soft v-bind="triggerProps">v-model</DuButton>
    </template>
    <div class="p-4 w-44 text-sm">Open is {{ isOpen }}</div>
  </DuDropdown>
  <DuButton size="sm" variant="primary" @click="isOpen = !isOpen">Toggle from outside</DuButton>
</div>`,
      script: `const isOpen = ref(false)
return { isOpen }`,
      code: `<script setup>
const isOpen = ref(false)
</script>

<template>
  <DuDropdown v-model:open="isOpen">
    <template #trigger="{ triggerProps }">
      <DuButton v-bind="triggerProps">v-model</DuButton>
    </template>
    <div class="p-4">Open is {{ isOpen }}</div>
  </DuDropdown>

  <DuButton @click="isOpen = !isOpen">Toggle from outside</DuButton>
</template>`,
    },
    {
      title: 'Escaping an overflow: hidden parent',
      description: '`popover` renders the panel in the browser\'s top layer (Popover API) and anchors it with CSS anchor positioning. Use it whenever the dropdown lives inside a scrolling container, a table cell, or a card with `overflow: hidden` — the panel would otherwise be clipped by it.',
      preview: `<div class="w-64 h-24 overflow-hidden border border-base-300 rounded-box p-4 flex items-start">
  <DuDropdown popover placement="bottom">
    <template #trigger="{ triggerProps }">
      <DuButton size="sm" soft v-bind="triggerProps">Not clipped</DuButton>
    </template>
    <div class="p-4 w-44 text-sm">Rendered in the top layer.</div>
  </DuDropdown>
</div>`,
      code: `<div class="overflow-hidden">
  <DuDropdown popover placement="bottom">
    <template #trigger="{ triggerProps }">
      <DuButton v-bind="triggerProps">Not clipped</DuButton>
    </template>
    <div class="p-4">Rendered in the top layer.</div>
  </DuDropdown>
</div>`,
    },
    {
      title: 'Custom content (not DuMenu)',
      description: 'The content slot accepts anything — a card, a form, a profile panel. The trigger needs no `tabindex` any more: spread `triggerProps` and it becomes a real control, focusable and operable by keyboard.',
      preview: `<DuDropdown placement="bottom,end">
  <template #trigger="{ triggerProps }">
    <DuButton ghost circle v-bind="triggerProps" ariaLabel="Account menu">
      <DuAvatar size="sm" rounded="full" ring ringVariant="primary" placeholder variant="primary">JD</DuAvatar>
    </DuButton>
  </template>
  <div class="bg-base-100 border border-base-300 rounded-xl shadow-lg p-4 w-56 flex flex-col gap-3 mt-2">
    <div class="flex items-center gap-3">
      <DuAvatar size="sm" rounded="full" placeholder variant="primary">JD</DuAvatar>
      <div>
        <div class="font-semibold text-sm">John Doe</div>
        <div class="text-xs text-base-content/50">john@example.com</div>
      </div>
    </div>
    <div class="divider my-0"></div>
    <DuButton ghost size="sm" class="justify-start">Profile</DuButton>
    <DuButton ghost size="sm" class="justify-start">Settings</DuButton>
    <DuButton variant="error" soft size="sm" class="justify-start">Sign out</DuButton>
  </div>
</DuDropdown>`,
      code: `<DuDropdown placement="bottom,end">
  <template #trigger="{ triggerProps }">
    <DuButton ghost circle v-bind="triggerProps" ariaLabel="Account menu">
      <DuAvatar size="sm" rounded="full" placeholder variant="primary">JD</DuAvatar>
    </DuButton>
  </template>
  <div class="bg-base-100 border border-base-300 rounded-xl shadow-lg p-4 w-56">
    <div class="flex items-center gap-3 mb-3">
      <DuAvatar size="sm" rounded="full" placeholder variant="primary">JD</DuAvatar>
      <div>
        <div class="font-semibold text-sm">{{ user.name }}</div>
        <div class="text-xs text-base-content/50">{{ user.email }}</div>
      </div>
    </div>
    <div class="divider my-0"></div>
    <DuButton ghost size="sm" class="w-full justify-start" @click="goToProfile">Profile</DuButton>
    <DuButton variant="error" soft size="sm" class="w-full justify-start" @click="signOut">Sign out</DuButton>
  </div>
</DuDropdown>`,
    },
    {
      title: 'Combined placement',
      description: 'In object form only the keys set to `true` are applied — `{ top: true, end: false }` yields `dropdown-top` alone.',
      preview: `<div class="flex gap-4 flex-wrap justify-center">
  <DuDropdown placement="top,end">
    <template #trigger="{ triggerProps }"><DuButton v-bind="triggerProps">top,end</DuButton></template>
    <DuMenu :items="[{ label: 'Item' }]" class="w-32" />
  </DuDropdown>
  <DuDropdown :placement="['bottom', 'start']">
    <template #trigger="{ triggerProps }"><DuButton v-bind="triggerProps">Array</DuButton></template>
    <DuMenu :items="[{ label: 'Item' }]" class="w-32" />
  </DuDropdown>
  <DuDropdown :placement="{ top: true, end: false }">
    <template #trigger="{ triggerProps }"><DuButton v-bind="triggerProps">Object</DuButton></template>
    <DuMenu :items="[{ label: 'Item' }]" class="w-32" />
  </DuDropdown>
</div>`,
      code: `<!-- String with comma -->
<DuDropdown placement="top,end">…</DuDropdown>

<!-- Array -->
<DuDropdown :placement="['bottom', 'start']">…</DuDropdown>

<!-- Object: only truthy keys apply → dropdown-top -->
<DuDropdown :placement="{ top: true, end: false }">…</DuDropdown>`,
    },
    {
      title: 'Dismissal and focus',
      description: 'Escape closes the panel and hands focus back to the trigger. A press outside closes it. Tabbing past the last element in the panel closes it too, so the dropdown never traps you. `closeOnEscape` and `closeOnClickOutside` turn the first two off for a panel that must stay put — a filter builder, say — but leave the trigger able to close it.',
      code: `<DuDropdown :closeOnClickOutside="false">
  <template #trigger="{ triggerProps }">
    <DuButton v-bind="triggerProps">Filters</DuButton>
  </template>
  <template #content="{ close }">
    <form class="p-4 w-64" @submit.prevent="apply(); close()">
      <!-- clicking around in here will not dismiss it -->
      <DuButton type="submit" variant="primary" size="sm">Apply</DuButton>
    </form>
  </template>
</DuDropdown>`,
    },
    {
      title: 'Events and exposed methods',
      description: '`@open` and `@close` fire once the panel has actually opened or closed — after the paint, so a measurement in the handler sees the real thing. `@update:open` fires on every state change. The component instance exposes `open()`, `close()` and `toggle()` for the rare case where a ref is easier than a model.',
      code: `<script setup>
const dropdown = ref()
</script>

<template>
  <DuDropdown ref="dropdown" @open="onOpen" @close="onClose">
    <template #trigger="{ triggerProps }">
      <DuButton v-bind="triggerProps">Menu</DuButton>
    </template>
    <div class="p-4">Panel</div>
  </DuDropdown>

  <DuButton @click="dropdown.close()">Close it</DuButton>
</template>`,
    },
    {
      title: 'Default content styling',
      description: 'The `.dropdown-content` wrapper ships with `bg-base-100 rounded-box shadow-sm`, so a dropdown looks right out of the box — you do not need to add a background to whatever you put inside it. Use `contentClass` to add your own.',
      preview: `<DuDropdown placement="bottom" contentClass="ring ring-primary/30">
  <template #trigger="{ triggerProps }"><DuButton v-bind="triggerProps">Open</DuButton></template>
  <div class="p-4 w-52 text-sm">
    <p class="font-medium">No background needed</p>
    <p class="text-base-content/60 text-xs mt-1">The dropdown supplies it.</p>
  </div>
</DuDropdown>`,
      code: `<DuDropdown placement="bottom" contentClass="ring ring-primary/30">
  <template #trigger="{ triggerProps }">
    <DuButton v-bind="triggerProps">Open</DuButton>
  </template>
  <!-- .dropdown-content already has bg-base-100 rounded-box shadow-sm -->
  <div class="p-4 w-52">
    Any content
  </div>
</DuDropdown>`,
    },
  ],
} satisfies DocPageData
