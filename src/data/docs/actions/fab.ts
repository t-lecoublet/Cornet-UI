import type { DocPageData } from '@/types/docs'

export default {
  title: 'FAB',
  description: 'Floating Action Button — a speed-dial button that reveals multiple actions on click.',
  category: 'Actions',
  source: 'https://daisyui.com/components/fab/',
  props: [
    {
      title: 'items',
      description: 'Action items revealed when the FAB is opened. `icon` is an `IconSource` — a Vue component, an image URL, or an HTML string.',
      type: 'DuFabItem[]',
    },
    {
      title: 'mainAction',
      description: 'The always-visible main button (label / icon / variant / onClick)',
      type: 'DuFabMainAction',
    },
    {
      title: 'closeButton',
      description: 'Extra close button shown while the FAB is expanded',
      type: 'DuFabCloseButton',
    },
    {
      title: 'modifier',
      description: 'Layout modifier for the action items',
      type: 'DuFabModifier',
      options: ['fab-flower'],
    },
    {
      title: 'absolute',
      description: 'Pin the FAB to the bottom-right of the nearest positioned ancestor. Set to `false` to fall back to daisyUI\'s `position: fixed`, pinning it to the bottom-right of the viewport.',
      type: 'boolean',
      default: 'true',
    },
    {
      title: 'circle',
      description: 'Render the buttons as circles',
      type: 'boolean',
      default: 'true',
    },
    {
      title: 'size',
      description: 'Size of the FAB buttons',
      type: 'Size',
      default: '"lg"',
      options: ['default', 'xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      title: 'variant',
      description: 'Color variant of the FAB buttons',
      type: 'Variant',
      default: '"primary"',
      options: ['default', 'neutral', 'primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error'],
    },
    {
      title: 'customClass',
      description: 'Additional CSS classes for the root element',
      type: 'string',
    },
  ],
  classnames: {
    component: [
      { class: 'fab', desc: 'Base class on the wrapper, always applied.' },
      { class: 'fab-main-action', desc: 'The always-visible main button.' },
      { class: 'fab-close', desc: 'The close button, when closeButton is set.' },
    ],
    style: [
      { class: 'btn btn-circle', desc: 'Every FAB button is a DuButton — see the Button page for its btn-* classes.' },
    ],
    modifier: [
      { class: 'fab-flower', desc: 'Flower layout for the action items — modifier="fab-flower"' },
    ],
  },
  sections: [
    {
      title: 'Basic',
      preview: `<div class="relative h-32 w-64 border border-base-300 rounded-xl">
  <DuFab
    :mainAction="{ label: '+', variant: 'primary' }"
    :items="[
      { label: 'Edit' },
      { label: 'Share' },
      { label: 'Delete' },
    ]"
  />
</div>`,
      code: `<DuFab
  :mainAction="{ label: '+', variant: 'primary' }"
  :items="[
    { label: 'Edit', tooltip: 'Edit' },
    { label: 'Share', tooltip: 'Share' },
    { label: 'Delete', tooltip: 'Delete' },
  ]"
/>`,
    },
    {
      title: 'With icons',
      links: [
        { label: 'Heroicons', href: 'https://heroicons.com/' },
      ],
      preview: `<div class="relative h-32 w-64 border border-base-300 rounded-xl">
  <DuFab
    :mainAction="{ label: '+', variant: 'primary' }"
    :items="[
      { label: '✏️', tooltip: 'Edit', tooltipPosition: 'left' },
      { label: '🗑️', tooltip: 'Delete', tooltipPosition: 'left', customClass: 'btn-error' },
    ]"
  />
</div>`,
      code: `<DuFab
  :mainAction="{ icon: PlusIcon, variant: 'primary' }"
  :items="[
    { icon: PencilIcon, tooltip: 'Edit', tooltipPosition: 'left' },
    { icon: ShareIcon, tooltip: 'Share', tooltipPosition: 'left' },
    { icon: TrashIcon, tooltip: 'Delete', tooltipPosition: 'left', customClass: 'btn-error' },
  ]"
/>`,
    },
    {
      title: 'With click handlers',
      preview: `<div class="relative h-32 w-64 border border-base-300 rounded-xl">
  <DuFab
    :mainAction="{ label: '+', variant: 'primary' }"
    :items="[
      { label: 'Edit' },
      { label: 'Delete', customClass: 'btn-error' },
    ]"
  />
</div>`,
      code: `<DuFab
  :mainAction="{ label: '+', variant: 'primary', onClick: () => console.log('main') }"
  :items="[
    { label: 'Edit', onClick: () => edit() },
    { label: 'Delete', onClick: () => remove(), customClass: 'btn-error' },
  ]"
/>`,
    },
    {
      title: 'Flower modifier',
      description: 'Use `modifier="fab-flower"` for flower-style layout.',
      preview: `<div class="relative h-40 w-64 border border-base-300 rounded-xl">
  <DuFab
    modifier="fab-flower"
    :mainAction="{ label: '✕', variant: 'primary' }"
    :items="[
      { label: '📷', tooltip: 'Camera' },
      { label: '📁', tooltip: 'Folder' },
      { label: '⭐', tooltip: 'Star' },
    ]"
  />
</div>`,
      code: `<DuFab
  modifier="fab-flower"
  :mainAction="{ label: '✕', variant: 'primary' }"
  :items="[
    { label: '📷', tooltip: 'Camera' },
    { label: '📁', tooltip: 'Folder' },
    { label: '⭐', tooltip: 'Star' },
  ]"
/>`,
    },
    {
      title: 'Positioning',
      description: 'By default `absolute` is `true`, pinning the FAB to the bottom-right corner of the nearest positioned ancestor (give it `relative`). Set `:absolute="false"` for daisyUI\'s default `position: fixed`: the FAB stays in the bottom-right corner of the viewport while the page scrolls — the usual app-wide FAB. (The second box below uses `transform` to keep that fixed FAB inside the preview.)',
      preview: `<div class="flex flex-col gap-4">
  <div class="relative h-40 w-64 border border-base-300 rounded-xl">
    <DuFab
      :mainAction="{ label: '↗', variant: 'primary' }"
      :items="[{ label: 'Test' }]"
    />
  </div>
  <div class="h-40 w-64 border border-base-300 rounded-xl" style="transform: translate(0, 0)">
    <DuFab
      :absolute="false"
      :mainAction="{ label: '↗', variant: 'secondary' }"
      :items="[{ label: 'Test' }]"
    />
  </div>
</div>`,
      code: `<!-- Default: pinned bottom-right of the nearest positioned ancestor -->
<div class="relative h-40 w-64">
  <DuFab
    :mainAction="{ label: '↗', variant: 'primary' }"
    :items="[{ label: 'Test' }]"
  />
</div>

<!-- Fixed to the viewport's bottom-right corner (daisyUI default) -->
<DuFab
  :absolute="false"
  :mainAction="{ label: '↗', variant: 'secondary' }"
  :items="[{ label: 'Test' }]"
/>`,
    },
    {
      title: 'With close button',
      description: 'Show a close button when the FAB is expanded.',
      preview: `<div class="relative h-32 w-64 border border-base-300 rounded-xl">
  <DuFab
    :mainAction="{ label: '+', variant: 'primary' }"
    :items="[{ label: 'Item 1' }]"
    :closeButton="{ label: 'Close' }"
  />
</div>`,
      code: `<DuFab
  :mainAction="{ label: '+', variant: 'primary' }"
  :items="[{ label: 'Item 1' }]"
  :closeButton="{ label: 'Close', variant: 'error' }"
/>`,
    },
    {
      title: 'Sizes & variants',
      preview: `<div class="flex flex-col gap-4 items-center">
  <div class="relative w-48 h-24 border border-base-300 rounded-xl">
    <DuFab
      :mainAction="{ label: 'S', variant: 'primary' }"
      size="sm"
      :items="[{ label: '1' }]"
    />
  </div>
  <div class="relative w-48 h-24 border border-base-300 rounded-xl">
    <DuFab
      :mainAction="{ label: 'M', variant: 'secondary' }"
      size="md"
      :items="[{ label: '1' }]"
    />
  </div>
  <div class="relative w-48 h-24 border border-base-300 rounded-xl">
    <DuFab
      :mainAction="{ label: 'L', variant: 'accent' }"
      size="lg"
      :items="[{ label: '1' }]"
    />
  </div>
</div>`,
      code: `<DuFab
  :mainAction="{ label: 'S', variant: 'primary' }"
  size="sm"
  :items="[{ label: '1' }]"
/>
<DuFab
  :mainAction="{ label: 'M', variant: 'secondary' }"
  size="md"
  :items="[{ label: '1' }]"
/>
<DuFab
  :mainAction="{ label: 'L', variant: 'accent' }"
  size="lg"
  :items="[{ label: '1' }]"
/>`,
    },
  ],
} satisfies DocPageData
