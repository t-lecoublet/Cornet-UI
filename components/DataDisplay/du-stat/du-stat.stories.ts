import type { Meta, StoryObj } from '@storybook/vue3'
import DuStat from './du-stat.vue'
import DuButton from '../../Actions/du-button/du-button.vue'

const meta = {
  title: 'Components/DataDisplay/Stat',
  component: DuStat,
  tags: ['autodocs'],
  argTypes: {
    figureClass: { control: 'text' },
    titleClass: { control: 'text' },
    valueClass: { control: 'text' },
    descClass: { control: 'text' },
  },
} satisfies Meta<typeof DuStat>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { DuStat },
    setup() {
      return { args }
    },
    template: `
      <div class="stats shadow">
        <DuStat v-bind="args">
          <template #title>Total Page Views</template>
          <template #value>89,400</template>
          <template #desc>21% more than last month</template>
        </DuStat>
      </div>
    `,
  }),
}

export const WithFigure: Story = {
  render: (args) => ({
    components: { DuStat },
    setup() {
      return { args }
    },
    template: `
      <div class="stats shadow">
        <DuStat v-bind="args" figureClass="text-primary" valueClass="text-primary">
          <template #figure>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </template>
          <template #title>Total Likes</template>
          <template #value>25.6K</template>
          <template #desc>21% more than last month</template>
        </DuStat>
      </div>
    `,
  }),
}

export const WithActions: Story = {
  render: (args) => ({
    components: { DuStat, DuButton },
    setup() {
      return { args }
    },
    template: `
      <div class="stats shadow">
        <DuStat v-bind="args">
          <template #title>Account balance</template>
          <template #value>$89,400</template>
          <template #actions>
            <DuButton size="xs" variant="success">Add funds</DuButton>
            <DuButton size="xs">Withdraw</DuButton>
          </template>
        </DuStat>
      </div>
    `,
  }),
}
