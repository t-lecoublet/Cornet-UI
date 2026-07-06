import type { Meta, StoryObj } from '@storybook/vue3'
import DuFab from './du-fab.vue'
import { useSizeStoriesControl } from '../../../composables/useSizeProps'
import { useVariantStoriesControl } from '../../../composables/useVariantProps'

const meta = {
  title: 'Components/Actions/FAB',
  component: DuFab,
  tags: ['autodocs'],
  argTypes: {
    items: {
      control: 'object',
      description: 'Array of FAB items (speed dial buttons)',
    },
    modifier: {
      control: { type: 'select' },
      options: [undefined, 'fab-flower'],
      description: 'Modifier class for FAB (fab-flower for quarter circle layout)',
    },
    customClass: {
      control: 'text',
      description: 'Custom class to apply to the FAB container',
    },
    ...useSizeStoriesControl,
    ...useVariantStoriesControl,
    circle: {
      control: 'boolean',
      description: 'Whether buttons should be circular',
    },
    mainAction: {
      control: 'object',
      description: 'Main action button configuration (replaces trigger when open)',
    },
    closeButton: {
      control: 'object',
      description: 'Close button configuration (shown when FAB is open)',
    },
    absolute: {
      control: 'boolean',
      description: 'Whether FAB should be absolutely positioned (bottom-right corner)',
    },
  },
  args: {
    items: [
      { label: 'A', icon: 'A' },
      { label: 'B', icon: 'B' },
      { label: 'C', icon: 'C' },
    ],
    size: 'lg',
    variant: 'primary',
    circle: true,
    absolute: true,
  },
} satisfies Meta<typeof DuFab>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { DuFab },
    setup() {
      return { args }
    },
    template: `
      <div class="relative h-96 border border-base-300 rounded-lg">
        <DuFab v-bind="args" />
      </div>
    `,
  }),
}

export const VerticalSpeedDial: Story = {
  args: {
    items: [
      { icon: 'A' },
      { icon: 'B' },
      { icon: 'C' },
    ],
    variant: 'primary',
  },
  render: (args) => ({
    components: { DuFab },
    setup() {
      return { args }
    },
    template: `
      <div class="relative h-96 border border-base-300 rounded-lg">
        <DuFab v-bind="args">
          <template #trigger-icon>F</template>
        </DuFab>
      </div>
    `,
  }),
}

export const WithLabels: Story = {
  args: {
    items: [
      { label: 'Label A', icon: 'A' },
      { label: 'Label B', icon: 'B' },
      { label: 'Label C', icon: 'C' },
    ],
    variant: 'success',
  },
  render: (args) => ({
    components: { DuFab },
    setup() {
      return { args }
    },
    template: `
      <div class="relative h-96 border border-base-300 rounded-lg">
        <DuFab v-bind="args">
          <template #trigger-icon>F</template>
        </DuFab>
      </div>
    `,
  }),
}

export const WithCloseButton: Story = {
  args: {
    items: [
      { label: 'Label A', icon: 'A' },
      { label: 'Label B', icon: 'B' },
      { label: 'Label C', icon: 'C' },
    ],
    variant: 'info',
    closeButton: {
      label: 'Close',
      icon: '✕',
      variant: 'error',
    },
  },
  render: (args) => ({
    components: { DuFab },
    setup() {
      return { args }
    },
    template: `
      <div class="relative h-96 border border-base-300 rounded-lg">
        <DuFab v-bind="args">
          <template #trigger-icon>F</template>
        </DuFab>
      </div>
    `,
  }),
}

export const WithMainAction: Story = {
  args: {
    items: [
      { label: 'Label A', icon: 'A' },
      { label: 'Label B', icon: 'B' },
      { label: 'Label C', icon: 'C' },
    ],
    variant: 'primary',
    mainAction: {
      label: 'M',
      variant: 'secondary',
    },
  },
  render: (args) => ({
    components: { DuFab },
    setup() {
      return { args }
    },
    template: `
      <div class="relative h-96 border border-base-300 rounded-lg">
        <DuFab v-bind="args">
          <template #trigger-icon>F</template>
        </DuFab>
      </div>
    `,
  }),
}

export const FlowerLayout: Story = {
  args: {
    items: [
      { icon: 'A' },
      { icon: 'B' },
      { icon: 'C' },
      { icon: 'D' },
    ],
    modifier: 'fab-flower',
    variant: 'success',
    mainAction: {
      label: 'M',
      variant: 'primary',
    },
  },
  render: (args) => ({
    components: { DuFab },
    setup() {
      return { args }
    },
    template: `
      <div class="relative h-96 border border-base-300 rounded-lg">
        <DuFab v-bind="args">
          <template #trigger-icon>F</template>
        </DuFab>
      </div>
    `,
  }),
}

export const FlowerWithTooltips: Story = {
  args: {
    items: [
      { icon: 'A', tooltip: 'Label A', tooltipPosition: 'left' },
      { icon: 'B', tooltip: 'Label B', tooltipPosition: 'left' },
      { icon: 'C', tooltip: 'Label C', tooltipPosition: 'top' },
      { icon: 'D', tooltip: 'Label D', tooltipPosition: 'top' },
    ],
    modifier: 'fab-flower',
    variant: 'info',
    mainAction: {
      label: 'M',
      variant: 'success',
    },
  },
  render: (args) => ({
    components: { DuFab },
    setup() {
      return { args }
    },
    template: `
      <div class="relative h-96 border border-base-300 rounded-lg">
        <DuFab v-bind="args">
          <template #trigger-icon>F</template>
        </DuFab>
      </div>
    `,
  }),
}

export const SingleButton: Story = {
  args: {
    items: undefined,
    variant: 'primary',
  },
  render: (args) => ({
    components: { DuFab },
    setup() {
      return { args }
    },
    template: `
      <div class="relative h-96 border border-base-300 rounded-lg">
        <DuFab v-bind="args">
          <div tabindex="0" role="button" class="btn btn-lg btn-circle btn-primary">F</div>
        </DuFab>
      </div>
    `,
  }),
}

export const WithClickHandlers: Story = {
  args: {
    items: [
      { 
        icon: 'A',
        onClick: () => alert('Button A clicked!'),
      },
      { 
        icon: 'B',
        onClick: () => alert('Button B clicked!'),
      },
      { 
        icon: 'C',
        onClick: () => alert('Button C clicked!'),
      },
    ],
    variant: 'accent',
  },
  render: (args) => ({
    components: { DuFab },
    setup() {
      return { args }
    },
    template: `
      <div class="relative h-96 border border-base-300 rounded-lg">
        <DuFab v-bind="args">
          <template #trigger-icon>📱</template>
        </DuFab>
      </div>
    `,
  }),
}

export const NonCircular: Story = {
  args: {
    items: [
      { label: 'Button A' },
      { label: 'Button B' },
      { label: 'Button C' },
    ],
    variant: 'success',
    circle: false,
  },
  render: (args) => ({
    components: { DuFab },
    setup() {
      return { args }
    },
    template: `
      <div class="relative h-96 border border-base-300 rounded-lg">
        <DuFab v-bind="args">
          <template #trigger-icon>F</template>
        </DuFab>
      </div>
    `,
  }),
}

export const ManualMode: Story = {
  render: () => ({
    components: { DuFab },
    template: `
      <div class="relative h-96 border border-base-300 rounded-lg">
        <DuFab>
          <div tabindex="0" role="button" class="btn btn-lg btn-circle btn-primary">F</div>
          <button class="btn btn-lg btn-circle">A</button>
          <button class="btn btn-lg btn-circle">B</button>
          <button class="btn btn-lg btn-circle">C</button>
        </DuFab>
      </div>
    `,
  }),
}

export const ManualFlowerMode: Story = {
  render: () => ({
    components: { DuFab },
    template: `
      <div class="relative h-96 border border-base-300 rounded-lg">
        <DuFab modifier="fab-flower">
          <div tabindex="0" role="button" class="btn btn-lg btn-circle btn-success">F</div>
          <button class="fab-main-action btn btn-circle btn-lg btn-primary">M</button>
          <button class="btn btn-lg btn-circle">A</button>
          <button class="btn btn-lg btn-circle">B</button>
          <button class="btn btn-lg btn-circle">C</button>
          <button class="btn btn-lg btn-circle">D</button>
        </DuFab>
      </div>
    `,
  }),
}
