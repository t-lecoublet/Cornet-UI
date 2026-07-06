import type { Meta, StoryObj } from "@storybook/vue3";
import DuNavbar from "./du-navbar.vue";
import DuButton from "../../Actions/du-button/du-button.vue";

const meta: Meta<typeof DuNavbar> = {
  title: "Components/Navigation/Navbar",
  tags: ['autodocs'],
  component: DuNavbar,
};

export default meta;
type Story = StoryObj<typeof DuNavbar>;

export const Default: Story = {
  render: () => ({
    components: { DuNavbar, DuButton },
    template: `
      <DuNavbar>
        <template #center>
          <DuButton as="a" href="/" :ghost="true">daisyUI</DuButton>
        </template>
      </DuNavbar>
    `,
  }),
};

export const WithTitleAndIcon: Story = {
  render: () => ({
    components: { DuNavbar, DuButton },
    template: `
      <DuNavbar>
        <template #start>
          <DuButton as="a" href="/" :ghost="true">daisyUI</DuButton>
        </template>
        <template #end>
          <DuButton :ghost="true" :square="true">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
            </svg>
          </DuButton>
        </template>
      </DuNavbar>
    `,
  }),
};

export const WithIconAtStartAndEnd: Story = {
  render: () => ({
    components: { DuNavbar, DuButton },
    template: `
      <DuNavbar>
        <template #start>
          <DuButton :ghost="true" :square="true">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </DuButton>
        </template>
        <template #center>
          <DuButton as="a" href="/" :ghost="true">daisyUI</DuButton>
        </template>
        <template #end>
          <DuButton :ghost="true" :square="true">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
            </svg>
          </DuButton>
        </template>
      </DuNavbar>
    `,
  }),
};

export const WithMenuAndSubmenu: Story = {
  render: () => ({
    components: { DuNavbar, DuButton },
    template: `
      <DuNavbar>
        <template #start>
          <DuButton as="a" class="text-xl" :ghost="true">daisyUI</DuButton>
        </template>
        <template #end>
          <ul class="menu menu-horizontal px-1">
            <li><a>Link</a></li>
            <li>
              <details>
                <summary>Parent</summary>
                <ul class="bg-base-100 rounded-t-none p-2">
                  <li><a>Link 1</a></li>
                  <li><a>Link 2</a></li>
                </ul>
              </details>
            </li>
          </ul>
        </template>
      </DuNavbar>
    `,
  }),
};

export const WithSearchInput: Story = {
  render: () => ({
    components: { DuNavbar, DuButton },
    template: `
      <DuNavbar>
        <template #start>
          <DuButton variant="ghost" class="text-xl">daisyUI</DuButton>
        </template>
        <template #end>
          <input type="text" placeholder="Search" class="input input-bordered w-24 md:w-auto" />
        </template>
      </DuNavbar>
    `,
  }),
};
