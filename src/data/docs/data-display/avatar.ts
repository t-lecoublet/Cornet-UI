import type { DocPageData } from '@/types/docs'

export default {
  title: 'Avatar',
  description: 'Avatars are used to show a thumbnail representation of a person or object. DuAvatar is slot-based — pass an image or text inside the default slot.',
  category: 'Data Display',
  source: 'https://daisyui.com/components/avatar/',
  props: [
    {
      title: 'size',
      description: 'Size of the component',
      type: 'Size',
      default: '"default"',
      options: ['default', 'xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      title: 'variant',
      description: 'Color variant of the component',
      type: 'Variant',
      default: '"default"',
      options: ['default', 'neutral', 'primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error'],
    },
    {
      title: 'rounded',
      description: 'Corner rounding of the avatar image',
      type: 'DuAvatarRounded',
      default: '"default"',
      options: ['default', 'rounded', 'full', 'xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      title: 'mask',
      description: 'Apply a DaisyUI mask shape instead of plain rounding',
      type: 'DuAvatarMask',
      options: ['heart', 'squircle', 'hexagon', 'hexagon-2', 'decagon', 'pentagon', 'diamond', 'square', 'circle', 'parallelogram', 'parallelogram-2', 'star', 'star-2'],
    },
    {
      title: 'online',
      description: 'Show the online status indicator',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'offline',
      description: 'Show the offline status indicator',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'placeholder',
      description: 'Placeholder mode — renders initials or an icon instead of an image',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'ring',
      description: 'Draw a ring around the avatar',
      type: 'boolean',
      default: 'false',
    },
    {
      title: 'ringVariant',
      description: 'Color variant of the ring',
      type: 'Variant',
      default: '"primary"',
      options: ['default', 'neutral', 'primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error'],
    },
    {
      title: 'ringOffset',
      description: 'Gap in pixels between the avatar and its ring',
      type: 'DuAvatarRingOffset',
      default: '2',
      options: ['0', '1', '2', '4', '8'],
    },
  ],
  classnames: {
    component: [
      { class: 'avatar', desc: 'Base class, always applied. size="default" and variant="default" add no extra class.' },
    ],
    color: [
      { class: 'avatar-primary', desc: 'variant="primary"' },
      { class: 'avatar-secondary', desc: 'variant="secondary"' },
      { class: 'avatar-accent', desc: 'variant="accent"' },
      { class: 'avatar-neutral', desc: 'variant="neutral"' },
      { class: 'avatar-info', desc: 'variant="info"' },
      { class: 'avatar-success', desc: 'variant="success"' },
      { class: 'avatar-warning', desc: 'variant="warning"' },
      { class: 'avatar-error', desc: 'variant="error"' },
    ],
    size: [
      { class: 'avatar-xs', desc: 'size="xs"' },
      { class: 'avatar-sm', desc: 'size="sm"' },
      { class: 'avatar-md', desc: 'size="md"' },
      { class: 'avatar-lg', desc: 'size="lg"' },
      { class: 'avatar-xl', desc: 'size="xl"' },
    ],
    modifier: [
      { class: 'avatar-online', desc: 'Online indicator — online' },
      { class: 'avatar-offline', desc: 'Offline indicator — offline' },
      { class: 'avatar-placeholder', desc: 'Initials/icon instead of an image — placeholder' },
      { class: 'mask mask-{shape}', desc: 'Mask shape — mask="heart", mask="squircle", …' },
      { class: 'rounded-{size}', desc: 'Corner rounding — rounded="full", rounded="lg", …' },
      { class: 'ring-2 ring-offset-base-100', desc: 'Ring around the avatar — ring' },
      { class: 'ring-{variant}', desc: 'Ring color — ringVariant="primary" (default), ringVariant="success", …' },
      { class: 'ring-offset-{0|1|2|4|8}', desc: 'Gap between the avatar and its ring — ringOffset (default 2)' },
    ],
  },
  sections: [
    {
      title: 'With image',
      preview: `<DuAvatar size="lg" rounded="full">
  <img src="https://i.pravatar.cc/64" alt="avatar" />
</DuAvatar>`,
      code: `<DuAvatar size="lg" rounded="full">
  <img src="https://i.pravatar.cc/64" alt="User" />
</DuAvatar>`,
    },
    {
      title: 'Placeholder (initials)',
      description: 'Set `placeholder` and use `variant` to color the background. Pass the initials text inside the slot.',
      preview: `<div class="flex items-center gap-3">
  <DuAvatar placeholder variant="primary" size="md" rounded="full">JD</DuAvatar>
  <DuAvatar placeholder variant="secondary" size="md" rounded="full">AB</DuAvatar>
</div>`,
      code: `<DuAvatar placeholder variant="primary" size="md" rounded="full">
  JD
</DuAvatar>

<DuAvatar placeholder variant="secondary" size="md" rounded="full">
  AB
</DuAvatar>`,
    },
    {
      title: 'Online / offline status',
      preview: `<div class="flex gap-4 items-center">
  <DuAvatar size="md" rounded="full" online>
    <img src="https://i.pravatar.cc/48?img=1" alt="user" />
  </DuAvatar>
  <DuAvatar size="md" rounded="full" offline>
    <img src="https://i.pravatar.cc/48?img=2" alt="user" />
  </DuAvatar>
</div>`,
      code: `<DuAvatar size="md" rounded="full" online>
  <img src="/user1.jpg" alt="User" />
</DuAvatar>

<DuAvatar size="md" rounded="full" offline>
  <img src="/user2.jpg" alt="User" />
</DuAvatar>`,
    },
    {
      title: 'Sizes',
      preview: `<div class="flex flex-wrap items-center gap-3">
  <DuAvatar size="xs" rounded="full"><img src="https://i.pravatar.cc/32" /></DuAvatar>
  <DuAvatar size="sm" rounded="full"><img src="https://i.pravatar.cc/40" /></DuAvatar>
  <DuAvatar size="md" rounded="full"><img src="https://i.pravatar.cc/64" /></DuAvatar>
  <DuAvatar size="lg" rounded="full"><img src="https://i.pravatar.cc/80" /></DuAvatar>
</div>`,
      code: `<DuAvatar size="xs" rounded="full"><img src="/user.jpg" /></DuAvatar>
<DuAvatar size="sm" rounded="full"><img src="/user.jpg" /></DuAvatar>
<DuAvatar size="md" rounded="full"><img src="/user.jpg" /></DuAvatar>
<DuAvatar size="lg" rounded="full"><img src="/user.jpg" /></DuAvatar>`,
    },
    {
      title: 'Avatar group',
      links: [
        { label: 'DaisyUI avatar group docs', href: 'https://daisyui.com/components/avatar/#avatar-group' },
      ],
      preview: `<div class="avatar-group -space-x-4 rtl:space-x-reverse">
  <DuAvatar size="sm" rounded="full"><img src="https://i.pravatar.cc/40?img=1" /></DuAvatar>
  <DuAvatar size="sm" rounded="full"><img src="https://i.pravatar.cc/40?img=2" /></DuAvatar>
  <DuAvatar size="sm" rounded="full"><img src="https://i.pravatar.cc/40?img=3" /></DuAvatar>
  <DuAvatar size="sm" rounded="full" placeholder variant="neutral">+5</DuAvatar>
</div>`,
      code: `<div class="avatar-group -space-x-4">
  <DuAvatar size="sm" rounded="full"><img src="/u1.jpg" /></DuAvatar>
  <DuAvatar size="sm" rounded="full"><img src="/u2.jpg" /></DuAvatar>
  <DuAvatar size="sm" rounded="full"><img src="/u3.jpg" /></DuAvatar>
  <DuAvatar size="sm" rounded="full" placeholder variant="neutral">+5</DuAvatar>
</div>`,
    },
    {
      title: 'Ring border',
      description: 'Set `ring` to add a colored ring. Use `ringVariant` to pick its color and `ringOffset` (0, 1, 2, 4 or 8 px) to set the gap between the avatar and the ring.',
      links: [
        { label: 'Tailwind ring utilities', href: 'https://tailwindcss.com/docs/ring-color' },
      ],
      preview: `<div class="flex items-center gap-4">
  <DuAvatar size="md" rounded="full" ring ringVariant="primary">
    <img src="https://i.pravatar.cc/64?img=5" alt="user" />
  </DuAvatar>
  <DuAvatar size="md" rounded="full" ring ringVariant="success">
    <img src="https://i.pravatar.cc/64?img=6" alt="user" />
  </DuAvatar>
  <DuAvatar size="md" rounded="full" ring ringVariant="error">
    <img src="https://i.pravatar.cc/64?img=7" alt="user" />
  </DuAvatar>
  <DuAvatar size="md" rounded="full" ring ringVariant="warning" :ringOffset="4">
    <img src="https://i.pravatar.cc/64?img=8" alt="user" />
  </DuAvatar>
</div>`,
      code: `<!-- ring applies a colored border around the avatar -->
<DuAvatar size="md" rounded="full" ring ringVariant="primary">
  <img src="/user.jpg" alt="User" />
</DuAvatar>

<!-- wider gap between the avatar and its ring -->
<DuAvatar size="md" rounded="full" ring ringVariant="success" :ringOffset="4">
  <img src="/user.jpg" alt="User" />
</DuAvatar>`,
    },
    {
      title: 'Mask shapes',
      description: 'Use the `mask` prop to clip the avatar into different shapes. Works best without `rounded`.',
      links: [
        { label: 'DaisyUI mask docs', href: 'https://daisyui.com/components/mask/' },
      ],
      preview: `<div class="flex flex-wrap items-center gap-4">
  <DuAvatar size="md" mask="heart">
    <img src="https://i.pravatar.cc/64?img=9" alt="heart" />
  </DuAvatar>
  <DuAvatar size="md" mask="squircle">
    <img src="https://i.pravatar.cc/64?img=10" alt="squircle" />
  </DuAvatar>
  <DuAvatar size="md" mask="hexagon">
    <img src="https://i.pravatar.cc/64?img=11" alt="hexagon" />
  </DuAvatar>
  <DuAvatar size="md" mask="star">
    <img src="https://i.pravatar.cc/64?img=12" alt="star" />
  </DuAvatar>
  <DuAvatar size="md" mask="diamond">
    <img src="https://i.pravatar.cc/64?img=13" alt="diamond" />
  </DuAvatar>
</div>`,
      code: `<!-- Available masks: heart, squircle, hexagon, hexagon-2, decagon, pentagon, diamond, square, circle, parallelogram, star, star-2 -->
<DuAvatar size="md" mask="heart">
  <img src="/user.jpg" alt="User" />
</DuAvatar>

<DuAvatar size="md" mask="squircle">
  <img src="/user.jpg" alt="User" />
</DuAvatar>

<DuAvatar size="md" mask="hexagon">
  <img src="/user.jpg" alt="User" />
</DuAvatar>`,
    },
    {
      title: 'Rounded variants',
      description: 'Control the border radius with the `rounded` prop.',
      preview: `<div class="flex flex-wrap items-center gap-3">
  <DuAvatar size="md" rounded="sm"><img src="https://i.pravatar.cc/64?img=14" alt="sm" /></DuAvatar>
  <DuAvatar size="md" rounded="md"><img src="https://i.pravatar.cc/64?img=15" alt="md" /></DuAvatar>
  <DuAvatar size="md" rounded="lg"><img src="https://i.pravatar.cc/64?img=16" alt="lg" /></DuAvatar>
  <DuAvatar size="md" rounded="xl"><img src="https://i.pravatar.cc/64?img=17" alt="xl" /></DuAvatar>
  <DuAvatar size="md" rounded="full"><img src="https://i.pravatar.cc/64?img=18" alt="full" /></DuAvatar>
</div>`,
      code: `<!-- rounded values: sm | md | lg | xl | full -->
<DuAvatar size="md" rounded="sm"><img src="/user.jpg" /></DuAvatar>
<DuAvatar size="md" rounded="md"><img src="/user.jpg" /></DuAvatar>
<DuAvatar size="md" rounded="xl"><img src="/user.jpg" /></DuAvatar>
<DuAvatar size="md" rounded="full"><img src="/user.jpg" /></DuAvatar>`,
    },
  ],
} satisfies DocPageData
