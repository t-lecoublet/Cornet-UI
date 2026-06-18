import type { Meta, StoryObj } from '@storybook/vue3'
import DuSteps from './du-steps.vue'
import { DU_STEPS_DIRECTIONS } from './du-steps.types'
import { useVariantStoriesControl } from '../../../composables/useVariantProps'

const meta = {
  title: 'Components/Navigation/Steps',
  component: DuSteps,
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: { type: 'select' },
      options: DU_STEPS_DIRECTIONS,
    },
    responsive: { control: 'boolean' },
    ...useVariantStoriesControl,
  },
} satisfies Meta<typeof DuSteps>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items: [
      { label: 'Register' },
      { label: 'Choose plan' },
      { label: 'Purchase' },
      { label: 'Receive product' },
    ],
    activeSteps: [0, 1],
    variant: 'primary',
  },
}

export const Vertical: Story = {
  args: {
    items: [
      { label: 'Register' },
      { label: 'Choose plan' },
      { label: 'Purchase' },
    ],
    activeSteps: [0],
    direction: 'steps-vertical',
    variant: 'primary',
  },
}

export const WithDataContent: Story = {
  args: {
    items: [
      { label: 'Step 1', dataContent: '?' },
      { label: 'Step 2', dataContent: '!' },
      { label: 'Step 3', dataContent: '✓' },
      { label: 'Step 4', dataContent: '✕' },
    ],
    activeSteps: [0, 1, 2],
    variant: 'info',
  },
}

export const Responsive: Story = {
  args: {
    items: [
      { label: 'Register' },
      { label: 'Choose plan' },
      { label: 'Purchase' },
    ],
    activeSteps: [0, 1],
    responsive: true,
    variant: 'success',
  },
}
