import type { Meta, StoryObj } from "@storybook/vue3"
import DuCheckbox from "./du-checkbox.vue"
import { useVariantStoriesControl } from "../../../composables/useVariantProps"
import { useSizeStoriesControl } from "../../../composables/useSizeProps"
import type { ArgTypes } from "@storybook/vue3";

const meta: Meta<typeof DuCheckbox> = {
  title: "Components/DataInput/Checkbox",
  component: DuCheckbox,
  tags: ['autodocs'],
  argTypes: {
    ...(() => {
      const { size, ...restSize } = useSizeStoriesControl as ArgTypes;
      const { variant, ...restVariant } = useVariantStoriesControl as ArgTypes;
      return { ...restSize, ...restVariant };
    })(),
    size: {
      control: { type: 'select' },
      options: ['default', 'xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Taille de la checkbox',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error'],
      description: 'Couleur de la checkbox',
    },
    disabled: { control: "boolean" },
    indeterminate: { control: "boolean" },
  },
}

export default meta

type Story = StoryObj<typeof DuCheckbox>

const defaultTplStr = `
  <DuCheckbox v-bind="args" />
`

const TemplateCheckbox: Story = {
  render: (args: any) => ({
    components: { DuCheckbox },
    setup() {
      return { args }
    },
    template: defaultTplStr,
  }),
  args: {},
}
export const Default = { ...TemplateCheckbox }

const CheckboxColorsTplStr = `
<div class="flex gap-4">
    <DuCheckbox :modelValue="true" variant="primary" />
    <DuCheckbox :modelValue="true" variant="secondary" />
    <DuCheckbox :modelValue="true" variant="accent" />
    <DuCheckbox :modelValue="true" variant="info" />
    <DuCheckbox :modelValue="true" variant="success" />
    <DuCheckbox :modelValue="true" variant="warning" />
    <DuCheckbox :modelValue="true" variant="error" />
</div>`

const CheckboxColorsTemplate: Story = {
  render: (args: any) => ({
    components: { DuCheckbox },
    setup() {
      return { args }
    },
    template: CheckboxColorsTplStr,
  }),
  parameters: {
    docs: {
      source: {
        code: CheckboxColorsTplStr,
        language: 'html',
      },
    },
  },
}
export const CheckboxColors = { ...CheckboxColorsTemplate }

const CheckboxSizesTplStr = `
<div class="flex items-center gap-4">
  <div class="flex items-center gap-2">
    <DuCheckbox size="xs" />
    <span>XS</span>
  </div>
  <div class="flex items-center gap-2">
    <DuCheckbox size="sm" />
    <span>SM</span>
  </div>
  <div class="flex items-center gap-2">
    <DuCheckbox size="md" />
    <span>MD</span>
  </div>
  <div class="flex items-center gap-2">
    <DuCheckbox size="lg" />
    <span>LG</span>
  </div>
</div>`

const CheckboxSizesTemplate: Story = {
  render: (args: any) => ({
    components: { DuCheckbox },
    setup() {
      return { args }
    },
    template: CheckboxSizesTplStr,
  }),
  parameters: {
    docs: {
      source: {
        code: CheckboxSizesTplStr,
        language: 'html',
      },
    },
  },
}
export const CheckboxSizes = { ...CheckboxSizesTemplate }

const CheckboxStatesTplStr = `
<div class="flex flex-col gap-4">
  <div class="flex items-center gap-2">
    <DuCheckbox :modelValue="true" />
    <span>Checked</span>
  </div>
  <div class="flex items-center gap-2">
    <DuCheckbox />
    <span>Unchecked</span>
  </div>
  <div class="flex items-center gap-2">
    <DuCheckbox indeterminate />
    <span>Indeterminate</span>
  </div>
  <div class="flex items-center gap-2">
    <DuCheckbox disabled />
    <span>Disabled</span>
  </div>
  <div class="flex items-center gap-2">
    <DuCheckbox :modelValue="true" disabled />
    <span>Checked & Disabled</span>
  </div>
</div>`

const CheckboxStatesTemplate: Story = {
  render: (args: any) => ({
    components: { DuCheckbox },
    setup() {
      return { args }
    },
    template: CheckboxStatesTplStr,
  }),
  parameters: {
    docs: {
      source: {
        code: CheckboxStatesTplStr,
        language: 'html',
      },
    },
  },
}
export const CheckboxStates = { ...CheckboxStatesTemplate } 