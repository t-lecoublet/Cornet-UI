import type { Meta, StoryObj } from '@storybook/vue3'
import DuStepItem from './du-step-item.vue'
import { useVariantStoriesControl } from '../../../composables/useVariantProps'

const meta = {
  title: 'Components/Navigation/DuStepsItem',
  component: DuStepItem,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    active: { control: 'boolean' },
    dataContent: { control: 'text' },
    ...useVariantStoriesControl,
  },
} satisfies Meta<typeof DuStepItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Register',
    active: true,
    variant: 'primary',
  },
  render: (args) => ({
    components: { DuStepItem },
    setup() {
      return { args }
    },
    template: `
      <ul class="steps">
        <DuStepItem v-bind="args" />
        <DuStepItem label="Choose plan" />
        <DuStepItem label="Purchase" />
      </ul>
    `,
  }),
}

export const ManualComposition: Story = {
  render: () => ({
    components: { DuStepItem },
    template: `
      <ul class="steps steps-vertical">
        <DuStepItem label="Register" active variant="primary" dataContent="✓" />
        <DuStepItem label="Choose plan" active variant="primary" dataContent="✓" />
        <DuStepItem label="Purchase" dataContent="3" />
      </ul>
    `,
  }),
}
