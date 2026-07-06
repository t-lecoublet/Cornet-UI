import type { Meta, StoryObj } from '@storybook/vue3'
import DuTimeline from './du-timeline.vue'
import DuTimelineItem from './du-timeline-item.vue'
import DuButton from '../../Actions/du-button/du-button.vue'

const meta = {
  title: 'Components/DataDisplay/Timeline',
  component: DuTimeline,
  tags: ['autodocs'],
  argTypes: {
    items: {
      control: 'object',
      description:
        'Array of timeline items with start, middle, and end properties',
    },
    direction: {
      control: { type: 'select' },
      options: ['timeline-vertical', 'timeline-horizontal'],
      description: 'Direction of the timeline (vertical or horizontal)',
    },
    modifier: {
      control: { type: 'select' },
      options: [
        undefined,
        'timeline-snap-icon',
        'timeline-compact',
      ],
      description: 'Optional root-level layout modifier for the timeline',
    },
    boxed: {
      control: 'boolean',
      description: 'Applies timeline-box to every item\'s start/end boxes (overridable per-item via item.boxed)',
    },
    customClass: {
      control: 'text',
      description: 'Custom class to apply to the timeline element',
    },
    responsive: {
      control: 'boolean',
      description:
        'Whether the timeline should be responsive (vertical on mobile, horizontal on large screens)',
    },
    validItems: {
      control: 'object',
      description:
        'Array of boolean values indicating whether each item is valid',
    },
    hrClasses: {
      control: 'object',
      description: 'Array of CSS classes to apply to hr elements between items',
    },
  },
  args: {
    items: [
      {
        start: '1984',
        end: 'First Macintosh computer',
      },
      {
        start: '1998',
        end: 'iMac',
      },
      {
        start: '2001',
        end: 'iPod',
      },
      {
        start: '2007',
        end: 'iPhone',
      },
      {
        start: '2015',
        end: 'Apple Watch',
      },
    ],
    direction: 'timeline-vertical',
    modifier: undefined,
    customClass: '',
    responsive: false,
  },
} satisfies Meta<typeof DuTimeline>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Horizontal: Story = {
  args: {
    direction: 'timeline-horizontal',
    items: [
      {
        start: '1984',
        end: 'First Macintosh',
      },
      {
        start: '1998',
        end: 'iMac',
      },
      {
        start: '2001',
        end: 'iPod',
      },
    ],
  },
}

export const WithSnapIcon: Story = {
  args: {
    modifier: 'timeline-snap-icon',
  },
}

export const WithBox: Story = {
  args: {
    boxed: true,
  },
}

export const Compact: Story = {
  args: {
    modifier: 'timeline-compact',
  },
}

export const Responsive: Story = {
  args: {
    responsive: true,
    items: [
      {
        start: '1984',
        end: 'First Macintosh',
      },
      {
        start: '1998',
        end: 'iMac',
      },
      {
        start: '2001',
        end: 'iPod',
      },
    ],
  },
}

export const WithValidItems: Story = {
  args: {
    items: [
      {
        start: '1984',
        end: 'First Macintosh computer',
        valid: true,
      },
      {
        start: '1998',
        end: 'iMac',
        valid: true,
      },
      {
        start: '2001',
        end: 'iPod',
        valid: false,
      },
      {
        start: '2007',
        end: 'iPhone',
      },
    ],
  },
}

export const WithValidItemsArray: Story = {
  args: {
    items: [
      {
        start: '1984',
        end: 'First Macintosh computer',
      },
      {
        start: '1998',
        end: 'iMac',
      },
      {
        start: '2001',
        end: 'iPod',
      },
      {
        start: '2007',
        end: 'iPhone',
      },
    ],
    validItems: [true, true, false, undefined],
  },
}

export const WithCustomHrClasses: Story = {
  args: {
    items: [
      {
        start: '1984',
        end: 'First Macintosh computer',
      },
      {
        start: '1998',
        end: 'iMac',
      },
      {
        start: '2001',
        end: 'iPod',
      },
      {
        start: '2007',
        end: 'iPhone',
      },
    ],
    hrClasses: ['bg-primary', 'bg-secondary', 'bg-accent'],
  },
}

export const WithItemHrClasses: Story = {
  args: {
    items: [
      {
        start: '1984',
        end: 'First Macintosh computer',
        hrClass: 'bg-primary',
      },
      {
        start: '1998',
        end: 'iMac',
        hrClass: 'bg-secondary',
      },
      {
        start: '2001',
        end: 'iPod',
        hrClass: 'bg-accent',
      },
      {
        start: '2007',
        end: 'iPhone',
        hrClass: 'bg-error',
      },
    ],
  },
}

const withCustomMiddleTplStr = `
<script setup lang="ts">
const items = [
  {
    start: '1984',
    middle: '🍎',
    end: 'First Macintosh computer',
  },
  {
    start: '1998',
    middle: '🖥️',
    end: 'iMac',
  },
  {
    start: '2001',
    middle: '🎵',
    end: 'iPod',
  },
  {
    start: '2007',
    middle: '📱',
    end: 'iPhone',
  },
]
</script>
<DuTimeline :items="items" />
`

export const WithCustomMiddle: Story = {
  render: (args: any) => ({
    components: { DuTimeline },
    setup() {
      const items = [
        {
          start: '1984',
          middle: '🍎',
          end: 'First Macintosh computer',
        },
        {
          start: '1998',
          middle: '🖥️',
          end: 'iMac',
        },
        {
          start: '2001',
          middle: '🎵',
          end: 'iPod',
        },
        {
          start: '2007',
          middle: '📱',
          end: 'iPhone',
        },
      ]
      return { items }
    },
    template: `<DuTimeline :items="items" />`,
  }),
  parameters: {
    docs: {
      source: {
        code: withCustomMiddleTplStr,
        language: 'html',
      },
    },
  },
}

const withSlotsTplStr = `
<script setup lang="ts">
import DuButton from '../../Actions/du-button/du-button.vue'
const items = [
  {
    start: '1984',
    end: 'First Macintosh computer',
  },
  {
    start: '1998',
    end: 'iMac',
  },
  {
    start: '2001',
    end: 'iPod',
  },
]
</script>
<DuTimeline :items="items">
  <template #middle-1="{ item }">
    <span class="text-2xl">💻</span>
  </template>
  <template #end-1="{ item }">
    <div>
      <h3 class="font-bold">{{ item.end }}</h3>
      <p>The iMac was a revolutionary all-in-one computer.</p>
      <DuButton variant="primary" size="xs" class="mt-2">Learn More</DuButton>
    </div>
  </template>
</DuTimeline>
`

export const WithSlots: Story = {
  render: (args: any) => ({
    components: { DuTimeline, DuButton },
    setup() {
      const items = [
        {
          start: '1984',
          end: 'First Macintosh computer',
        },
        {
          start: '1998',
          end: 'iMac',
        },
        {
          start: '2001',
          end: 'iPod',
        },
      ]
      return { items }
    },
    template: `
      <DuTimeline :items="items">
        <template #middle-1="{ item }">
          <span class="text-2xl">💻</span>
        </template>
        <template #end-1="{ item }">
          <div>
            <h3 class="font-bold">{{ item.end }}</h3>
            <p>The iMac was a revolutionary all-in-one computer.</p>
            <DuButton variant="primary" size="xs" class="mt-2">Learn More</DuButton>
          </div>
        </template>
      </DuTimeline>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: withSlotsTplStr,
        language: 'html',
      },
    },
  },
}

const manualModeTplStr = `
<script setup lang="ts">
import DuButton from '../../Actions/du-button/du-button.vue'
import DuTimelineItem from './du-timeline-item.vue'
</script>
<DuTimeline>
  <DuTimelineItem start="1984" end="First Macintosh" boxed>
    <template #middle>
      <span class="text-xl">🍎</span>
    </template>
  </DuTimelineItem>
  <DuTimelineItem start="1998" boxed>
    <template #middle>
      <span class="text-xl">💻</span>
    </template>
    <template #end>
      <div>
        <h3 class="font-bold">iMac</h3>
        <p>Revolutionary all-in-one computer.</p>
        <DuButton variant="primary" size="xs" class="mt-2">Learn More</DuButton>
      </div>
    </template>
  </DuTimelineItem>
  <DuTimelineItem
    start="2001"
    end="iPod"
    valid="true"
    boxed
  />
  <DuTimelineItem
    start="2007"
    end="iPhone"
    valid="false"
    boxed
  />
</DuTimeline>
`

export const ManualMode: Story = {
  render: (args: any) => ({
    components: { DuTimeline, DuTimelineItem, DuButton },
    setup() {
      return {}
    },
    template: manualModeTplStr,
  }),
  parameters: {
    docs: {
      source: {
        code: manualModeTplStr,
        language: 'html',
      },
    },
  },
}

const nestedItemsTplStr = `
<script setup lang="ts">
import DuTimelineItem from './du-timeline-item.vue'
</script>
<DuTimeline>
  <DuTimelineItem start="2020" end="Main Event">
    <DuTimeline>
      <DuTimelineItem start="Jan" end="Sub-event 1" />
      <DuTimelineItem start="Apr" end="Sub-event 2" />
      <DuTimelineItem start="Dec" end="Sub-event 3" />
    </DuTimeline>
  </DuTimelineItem>
  <DuTimelineItem start="2021" end="Main Event 2">
    <DuTimeline>
      <DuTimelineItem start="Mar" end="Sub-event 1" />
      <DuTimelineItem start="Jun" end="Sub-event 2" />
    </DuTimeline>
  </DuTimelineItem>
</DuTimeline>
`

export const NestedItems: Story = {
  render: (args: any) => ({
    components: { DuTimeline, DuTimelineItem },
    setup() {
      return {}
    },
    template: nestedItemsTplStr,
  }),
  parameters: {
    docs: {
      source: {
        code: nestedItemsTplStr,
        language: 'html',
      },
    },
  },
} 