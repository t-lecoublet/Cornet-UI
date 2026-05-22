import type { Meta, StoryObj } from "@storybook/vue3"
import DuSelect from "./du-select.vue"
import { useVariantStoriesControl } from "../../../composables/useVariantProps"
import { useSizeStoriesControl } from "../../../composables/useSizeProps"
import type { ArgTypes } from "@storybook/vue3"

const meta: Meta<typeof DuSelect> = {
  title: "Components/DataInput/Select",
  component: DuSelect,
  tags: ['autodocs'],
  argTypes: {
    ...(() => {
      const { size, ...restSize } = useSizeStoriesControl as ArgTypes
      const { variant, ...restVariant } = useVariantStoriesControl as ArgTypes
      return { ...restSize, ...restVariant }
    })(),
    size: {
      control: { type: 'select' },
      options: ['default', 'xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Taille du select',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error'],
      description: 'Couleur du select',
    },
    multiple: { control: "boolean", description: "Sélection multiple" },
    searchable: { control: "boolean", description: "Recherche activée" },
    searchableInside: { control: "boolean", description: "Recherche à l'intérieur du dropdown" },
    ghost: { control: "boolean", description: "Style fantôme" },
    disabled: { control: "boolean", description: "Désactivé" },
    checkboxes: { control: "boolean", description: "Afficher des checkboxes" },
    clearable: { control: "boolean", description: "Permettre la déselection" },
    placeholder: { control: "text", description: "Texte de placeholder" },
    searchPlaceholder: { control: "text", description: "Placeholder de la recherche" },
    returnObject: { control: "boolean", description: "Retourner l'objet complet" },
  },
}

export default meta

type Story = StoryObj<typeof DuSelect>

const sampleOptions = [
  { id: 1, name: "Option 1", category: "Groupe A" },
  { id: 2, name: "Option 2", category: "Groupe A" },
  { id: 3, name: "Option 3", category: "Groupe B" },
  { id: 4, name: "Option très longue qui peut déborder", category: "Groupe B" },
  { id: 5, name: "Option 5", category: "Groupe C" },
]

const simpleOptions = ["Pomme", "Banane", "Orange", "Fraise", "Ananas"]

const defaultTplStr = `
  <DuSelect v-bind="args" />
`

export const Default: Story = {
  render: (args: any) => ({
    components: { DuSelect },
    setup() {
      return { args }
    },
    template: defaultTplStr,
  }),
  args: {
    options: sampleOptions,
    placeholder: "Choisissez une option...",
  },
}

export const Simple: Story = {
  render: (args: any) => ({
    components: { DuSelect },
    setup() {
      return { args }
    },
    template: defaultTplStr,
  }),
  args: {
    options: simpleOptions,
    placeholder: "Choisissez un fruit...",
    trackBy: "",
    labelBy: "",
  },
}

export const Multiple: Story = {
  render: (args: any) => ({
    components: { DuSelect },
    setup() {
      return { args }
    },
    template: defaultTplStr,
  }),
  args: {
    options: sampleOptions,
    multiple: true,
    placeholder: "Sélectionnez plusieurs options...",
  },
}

export const Searchable: Story = {
  render: (args: any) => ({
    components: { DuSelect },
    setup() {
      return { args }
    },
    template: defaultTplStr,
  }),
  args: {
    options: sampleOptions,
    searchable: true,
    placeholder: "Recherchez et sélectionnez...",
  },
}

export const WithCheckboxes: Story = {
  render: (args: any) => ({
    components: { DuSelect },
    setup() {
      return { args }
    },
    template: defaultTplStr,
  }),
  args: {
    options: sampleOptions,
    multiple: true,
    checkboxes: true,
    placeholder: "Sélectionnez avec des checkboxes...",
  },
}

export const Sizes: Story = {
  render: (args: any) => ({
    components: { DuSelect },
    setup() {
      return { args }
    },
    template: `
      <div class="flex flex-col gap-4">
        <DuSelect size="xs" v-bind="args" placeholder="Extra Small" />
        <DuSelect size="sm" v-bind="args" placeholder="Small" />
        <DuSelect size="md" v-bind="args" placeholder="Medium" />
        <DuSelect size="lg" v-bind="args" placeholder="Large" />
        <DuSelect size="xl" v-bind="args" placeholder="Extra Large" />
      </div>
    `,
  }),
  args: {
    options: sampleOptions,
  },
}

export const Variants: Story = {
  render: (args: any) => ({
    components: { DuSelect },
    setup() {
      return { args }
    },
    template: `
      <div class="flex flex-col gap-4">
        <DuSelect variant="default" v-bind="args" placeholder="Default" />
        <DuSelect variant="primary" v-bind="args" placeholder="Primary" />
        <DuSelect variant="secondary" v-bind="args" placeholder="Secondary" />
        <DuSelect variant="accent" v-bind="args" placeholder="Accent" />
        <DuSelect variant="info" v-bind="args" placeholder="Info" />
        <DuSelect variant="success" v-bind="args" placeholder="Success" />
        <DuSelect variant="warning" v-bind="args" placeholder="Warning" />
        <DuSelect variant="error" v-bind="args" placeholder="Error" />
      </div>
    `,
  }),
  args: {
    options: sampleOptions,
  },
}

export const Ghost: Story = {
  render: (args: any) => ({
    components: { DuSelect },
    setup() {
      return { args }
    },
    template: defaultTplStr,
  }),
  args: {
    options: sampleOptions,
    ghost: true,
    placeholder: "Select ghost style...",
  },
}

export const Clearable: Story = {
  render: (args: any) => ({
    components: { DuSelect },
    setup() {
      return { args }
    },
    template: defaultTplStr,
  }),
  args: {
    options: sampleOptions,
    clearable: true,
    placeholder: "Choisissez une option...",
  },
}

export const ClearableMultiple: Story = {
  render: (args: any) => ({
    components: { DuSelect },
    setup() {
      return { args }
    },
    template: defaultTplStr,
  }),
  args: {
    options: sampleOptions,
    multiple: true,
    clearable: true,
    placeholder: "Sélectionnez plusieurs options...",
  },
}

export const Disabled: Story = {
  render: (args: any) => ({
    components: { DuSelect },
    setup() {
      return { args }
    },
    template: defaultTplStr,
  }),
  args: {
    options: sampleOptions,
    disabled: true,
    placeholder: "Disabled select...",
  },
}