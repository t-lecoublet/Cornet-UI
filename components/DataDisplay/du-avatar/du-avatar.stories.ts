import type { Meta, StoryObj } from '@storybook/vue3'
import DuAvatar from './du-avatar.vue'
import { useSizeStoriesControl } from '../../../composables/useSizeProps'
import type { ArgTypes } from "@storybook/vue3";
import { AVATAR_ROUNDED } from './du-avatar.types';

const meta: Meta<typeof DuAvatar> = {
  title: 'Components/DataDisplay/Avatar',
  component: DuAvatar,
  tags: ['autodocs'],
  argTypes: {
    ...useSizeStoriesControl as ArgTypes,
    rounded: {
      control: { type: 'select' },
      options: ['default', 'rounded', 'full', 'xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Controls the border radius of the avatar'
    },
    online: { 
      control: 'boolean',
      description: 'Shows online status indicator'
    },
    offline: { 
      control: 'boolean',
      description: 'Shows offline status indicator'
    },
    placeholder: { 
      control: 'boolean',
      description: 'For showing letters as avatar placeholder'
    },
    ring: { 
      control: 'boolean',
      description: 'Adds a ring around the avatar'
    },
    ringVariant: { 
      control: { type: 'select' },
      options: ['default', 'primary', 'secondary', 'accent', 'neutral', 'info', 'success', 'warning', 'error'],
      description: 'Color of the ring',
      if: { arg: 'ring', truthy: true }
    },
    ringOffset: { 
      control: { type: 'select' },
      options: [0, 1, 2, 4, 8],
      description: 'Gap in px between the avatar and its ring',
      if: { arg: 'ring', truthy: true }
    },
    mask: {
      control: { type: 'select' },
      options: [undefined, 'heart', 'squircle', 'hexagon', 'hexagon-2', 'decagon', 'pentagon', 'diamond', 'square', 'circle', 'parallelogram', 'parallelogram-2', 'star', 'star-2'],
      description: 'Applies a mask shape to the avatar'
    }
  },
}

export default meta

type Story = StoryObj<typeof DuAvatar>

// Templates for each story
const defaultTplStr = `
  <DuAvatar size="lg" rounded="rounded">
    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Avatar" />
  </DuAvatar>
`

const avatarSizesTplStr = `
<div class="flex items-center gap-4">
  <DuAvatar size="xs" rounded="rounded">
    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Avatar" />
  </DuAvatar>
  <DuAvatar size="sm" rounded="rounded">
    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Avatar" />
  </DuAvatar>
  <DuAvatar size="md" rounded="rounded">
    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Avatar" />
  </DuAvatar>
  <DuAvatar size="lg" rounded="rounded">
    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Avatar" />
  </DuAvatar>
  <DuAvatar size="xl" rounded="rounded">
    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Avatar" />
  </DuAvatar>
</div>
`

const avatarRoundedTplStr = `
<div class="flex items-center gap-4">
  <DuAvatar size="lg" rounded="default">
    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Avatar" />
  </DuAvatar>
  <DuAvatar size="lg" rounded="rounded">
    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Avatar" />
  </DuAvatar>
  <DuAvatar size="lg" rounded="full">
    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Avatar" />
  </DuAvatar>
  <DuAvatar size="lg" rounded="lg">
    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Avatar" />
  </DuAvatar>
  <DuAvatar size="lg" rounded="xl">
    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Avatar" />
  </DuAvatar>
</div>
`

const avatarWithPresenceTplStr = `
<div class="flex items-center gap-4">
  <DuAvatar size="lg" rounded="full" online>
    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Avatar" />
  </DuAvatar>
  <DuAvatar size="lg" rounded="full" offline>
    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Avatar" />
  </DuAvatar>
</div>
`

const avatarWithRingTplStr = `
<div class="flex items-center gap-4">
  <DuAvatar size="lg" rounded="full" ring ringVariant="primary">
    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Avatar" />
  </DuAvatar>
  <DuAvatar size="lg" rounded="full" ring ringVariant="secondary">
    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Avatar" />
  </DuAvatar>
  <DuAvatar size="lg" rounded="full" ring ringVariant="accent">
    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Avatar" />
  </DuAvatar>
</div>
`

const avatarWithMaskTplStr = `
<div class="flex items-center gap-4">
  <DuAvatar size="lg" mask="heart">
    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Avatar" />
  </DuAvatar>
  <DuAvatar size="lg" mask="squircle">
    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Avatar" />
  </DuAvatar>
  <DuAvatar size="lg" mask="hexagon">
    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Avatar" />
  </DuAvatar>
</div>
`

const avatarPlaceholderTplStr = `
<div class="flex items-center gap-4">
  <DuAvatar size="lg" rounded="full" placeholder>
    <span class="text-3xl">AA</span>
  </DuAvatar>
  <DuAvatar size="lg" rounded="full" placeholder online>
    <span class="text-3xl">BB</span>
  </DuAvatar>
  <DuAvatar size="lg" rounded="full" placeholder offline>
    <span class="text-3xl">CC</span>
  </DuAvatar>
</div>
`

const avatarWithIconTplStr = `
<div class="flex items-center gap-4">
  <DuAvatar size="lg" rounded="full">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" />
    </svg>
  </DuAvatar>
  <DuAvatar size="lg" rounded="full" placeholder>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" />
    </svg>
  </DuAvatar>
</div>
`

const avatarGroupTplStr = `
<div class="avatar-group -space-x-4">
  <DuAvatar size="md" rounded="full">
    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Avatar" />
  </DuAvatar>
  <DuAvatar size="md" rounded="full">
    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Avatar" />
  </DuAvatar>
  <DuAvatar size="md" rounded="full">
    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Avatar" />
  </DuAvatar>
  <DuAvatar size="md" variant="neutral" rounded="full" placeholder>
    <span>+99</span>
  </DuAvatar>
</div>
`

// Stories
export const DefaultAvatar: Story = {
  render: (args) => ({
    components: { DuAvatar },
    setup() {
      return { args }
    },
    template: `
      <DuAvatar v-bind="args">
        <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Avatar" />
      </DuAvatar>
    `,
  }),
  args: {
    size: 'lg',
    rounded: 'rounded',
  },
  parameters: {
    docs: {
      source: {
        code: defaultTplStr,
        language: 'html',
      },
    },
  },
}

export const AvatarSizes: Story = {
  render: (args) => ({
    components: { DuAvatar },
    setup() {
      return { }
    },
    template: avatarSizesTplStr,
  }),
  parameters: {
    docs: {
      source: {
        code: avatarSizesTplStr,
        language: 'html',
      },
    },
  },
}

export const AvatarRoundedStyles: Story = {
  render: (args) => ({
    components: { DuAvatar },
    setup() {
      return { }
    },
    template: avatarRoundedTplStr,
  }),
  parameters: {
    docs: {
      source: {
        code: avatarRoundedTplStr,
        language: 'html',
      },
    },
  },
}

export const AvatarWithPresence: Story = {
  render: (args) => ({
    components: { DuAvatar },
    setup() {
      return { }
    },
    template: avatarWithPresenceTplStr,
  }),
  parameters: {
    docs: {
      source: {
        code: avatarWithPresenceTplStr,
        language: 'html',
      },
    },
  },
}

export const AvatarWithRing: Story = {
  render: (args) => ({
    components: { DuAvatar },
    setup() {
      return { }
    },
    template: avatarWithRingTplStr,
  }),
  parameters: {
    docs: {
      source: {
        code: avatarWithRingTplStr,
        language: 'html',
      },
    },
  },
}

export const AvatarWithMask: Story = {
  render: (args) => ({
    components: { DuAvatar },
    setup() {
      return { }
    },
    template: avatarWithMaskTplStr,
  }),
  parameters: {
    docs: {
      source: {
        code: avatarWithMaskTplStr,
        language: 'html',
      },
    },
  },
}

export const AvatarPlaceholder: Story = {
  render: (args) => ({
    components: { DuAvatar },
    setup() {
      return { }
    },
    template: avatarPlaceholderTplStr,
  }),
  parameters: {
    docs: {
      source: {
        code: avatarPlaceholderTplStr,
        language: 'html',
      },
    },
  },
}

export const AvatarWithIcon: Story = {
  render: (args) => ({
    components: { DuAvatar },
    setup() {
      return { }
    },
    template: avatarWithIconTplStr,
  }),
  parameters: {
    docs: {
      source: {
        code: avatarWithIconTplStr,
        language: 'html',
      },
    },
  },
}

export const AvatarGroup: Story = {
  render: (args) => ({
    components: { DuAvatar },
    setup() {
      return { }
    },
    template: avatarGroupTplStr,
  }),
  parameters: {
    docs: {
      source: {
        code: avatarGroupTplStr,
        language: 'html',
      },
    },
  },
}