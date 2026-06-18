<script setup lang="ts">
import { ref } from 'vue'
import {
  // Actions
  DuButton,
  DuDropdown,
  DuModal,
  DuSwap,
  DuFab,
  // Data Display
  DuAccordion,
  DuAvatar,
  DuBadge,
  DuCard,
  DuCarousel,
  DuChat,
  DuCollapse,
  DuCountdown,
  DuCountdownGroup,
  DuDiff,
  DuKbd,
  DuList,
  DuStat,
  DuStats,
  DuStatus,
  DuTable,
  DuTimeline,
  // Data Input
  DuCheckbox,
  DuFieldset,
  DuFileInput,
  DuFilter,
  DuInputField,
  DuLabel,
  DuRadio,
  DuRange,
  DuRating,
  DuSearch,
  DuSelect,
  DuTextArea,
  // Feedback
  DuAlert,
  DuLoading,
  DuProgress,
  DuRadialProgress,
  DuSkeleton,
  DuToast,
  DuTooltip,
  // Layout
  DuJoin,
  DuDrawer,
  // Navigation
  DuBreadcrumbs,
  DuButtonLink,
  DuDock,
  DuLink,
  DuMenu,
  DuNavbar,
  DuPagination,
  DuSteps,
  DuTabs,
} from 'cornet-ui'

// Reactive states
const modalRef = ref()
const swapActive = ref(false)
const checkboxValue = ref(true)
const rangeValue = ref(50)
const ratingValue = ref(3)
const selectValue = ref('')
const searchValue = ref('')
const textAreaValue = ref('')
const inputValue = ref('')
const currentPage = ref(1)
const drawerOpen1 = ref(false)
const drawerOpen2 = ref(false)
const showToast = ref(false)
const targetDate = ref(new Date(
  Date.now() +
  2 * 24 * 60 * 60 * 1000 +
  3 * 60 * 60 * 1000 +
  45 * 60 * 1000 +
  30 * 1000
))

// Sample data
const accordionItems = [
  { title: 'What is DaisyUI Vue Kit?', content: 'A comprehensive Vue 3 component library built on top of DaisyUI and Tailwind CSS.' },
  { title: 'How to install?', content: 'Run npm install daisyui-vue-kit and import the components you need.' },
  { title: 'Is it customizable?', content: 'Yes! All components support variants, sizes, and custom classes.' },
]

const collapseItems = [
  { title: 'Collapse Item 1', content: 'This is the content of collapse item 1' },
  { title: 'Collapse Item 2', content: 'This is the content of collapse item 2' },
]

const chatItems = [
  { message: 'Hello! How can I help you today?', placement: 'start' as const, header: 'Support Bot', footer: '12:45' },
  { message: 'I need help with the components!', placement: 'end' as const, header: 'You', footer: '12:46' },
  { message: 'Sure! Check out our documentation below.', placement: 'start' as const, variant: 'chat-bubble-primary' as const },
]

const tableColumns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
]

const tableRows = [
  { id: 1, name: 'Alice', role: 'Developer' },
  { id: 2, name: 'Bob', role: 'Designer' },
  { id: 3, name: 'Charlie', role: 'Manager' },
]

const timelineItems = [
  { start: '2024', middle: '●', end: 'Project Started' },
  { start: '2025', middle: '●', end: 'Beta Release' },
  { start: '2026', middle: '●', end: 'Version 1.0' },
]

const statsItems = [
  { title: 'Downloads', value: '31K', description: 'Jan 1st - Feb 1st' },
  { title: 'New Users', value: '4,200', description: '↗︎ 400 (22%)' },
  { title: 'New Registers', value: '1,200', description: '↘︎ 90 (14%)' },
]

const carouselItems = [
  { src: 'https://picsum.photos/1200/200?random=1', alt: 'Slide 1' },
  { src: 'https://picsum.photos/1200/200?random=2', alt: 'Slide 2' },
  { src: 'https://picsum.photos/1200/200?random=3', alt: 'Slide 3' },
  { src: 'https://picsum.photos/1200/200?random=4', alt: 'Slide 4' },
]

const selectOptions = [
  { id: 1, name: 'Option 1' },
  { id: 2, name: 'Option 2' },
  { id: 3, name: 'Option 3' },
]

const searchOptions = [
  { id: 1, name: 'Vue.js' },
  { id: 2, name: 'React' },
  { id: 3, name: 'Angular' },
  { id: 4, name: 'Svelte' },
]

const filterItems = [
  { title: 'All' },
  { title: 'Active', checked: true },
  { title: 'Completed' },
]

const menuItems = [
  { label: 'Home', href: '#' },
  { label: 'About', href: '#' },
  { label: 'Services', subItems: [{ label: 'Web Dev' }, { label: 'Design' }] },
  { label: 'Contact', href: '#' },
]

const tabItems = [
  { label: 'Tab 1', content: 'Content for Tab 1', active: true },
  { label: 'Tab 2', content: 'Content for Tab 2' },
  { label: 'Tab 3', content: 'Content for Tab 3' },
]

const stepsItems = [
  { label: 'Register' },
  { label: 'Choose plan' },
  { label: 'Purchase' },
  { label: 'Receive Product' },
]

const breadcrumbItems = [
  { label: 'Home', href: '#' },
  { label: 'Documents', href: '#' },
  { label: 'Add Document' },
]

const dockItems = [
  { label: 'Home', icon: '🏠' },
  { label: 'Search', icon: '🔍' },
  { label: 'Stats', icon: '📊', active: true },
  { label: 'Settings', icon: '⚙️' },
]

const fabItems = [
  { label: 'Edit', tooltip: 'Edit', icon: '✏️' },
  { label: 'Share', tooltip: 'Share', icon: '🔗' },
  { label: 'Delete', tooltip: 'Delete', icon: '🗑️' },
]

const drawerItems = [
  { label: 'Dashboard' },
  { label: 'Analytics' },
  { label: 'Settings' },
]

const themesItems = [
  { label: 'Default', value: 'default' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'Cupcake', value: 'cupcake' },
  { label: 'Bumblebee', value: 'bumblebee' },
  { label: 'Emerald', value: 'emerald' },
  { label: 'Corporate', value: 'corporate' },
  { label: 'Synthwave', value: 'synthwave' },
  { label: 'Retro', value: 'retro' },
  { label: 'Cyberpunk', value: 'cyberpunk' },
  { label: 'Valentine', value: 'valentine' },
  { label: 'Halloween', value: 'halloween' },
  { label: 'Garden', value: 'garden' },
  { label: 'Forest', value: 'forest' },
  { label: 'Aqua', value: 'aqua' },
  { label: 'Lofi', value: 'lofi' },
  { label: 'Pastel', value: 'pastel' },
  { label: 'Fantasy', value: 'fantasy' },
  { label: 'Wireframe', value: 'wireframe' },
  { label: 'Black', value: 'black' },
  { label: 'Luxury', value: 'luxury' },
  { label: 'Dracula', value: 'dracula' },
  { label: 'CMYK', value: 'cmyk' },
  { label: 'Autumn', value: 'autumn' },
  { label: 'Business', value: 'business' },
  { label: 'Acid', value: 'acid' },
  { label: 'Lemonade', value: 'lemonade' },
  { label: 'Night', value: 'night' },
  { label: 'Coffee', value: 'coffee' },
  { label: 'Winter', value: 'winter' },
  { label: 'Dim', value: 'dim' },
  { label: 'Nord', value: 'nord' },
  { label: 'Sunset', value: 'sunset' },
  { label: 'Caramel Latte', value: 'caramellatte' },
  { label: 'Abyss', value: 'abyss' },
  { label: 'Silk', value: 'silk' },
]
</script>

<template>
  <div class="min-h-screen bg-base-100">
    <div class="fixed top-0 right-0 m-4 z-9999">
      <DuDropdown placement="end">
        <template #trigger>
          <DuButton size="sm">
            Theme
            <svg width="12px" height="12px" class="inline-block h-2 w-2 fill-current opacity-60"
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">
              <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
            </svg>
          </DuButton>
        </template>
        <div
          class="bg-base-100 overflow-x-clip overflow-y-scroll max-h-[50dvh] ring-1 ring-base-300 rounded-box mt-1 w-max">
          <DuMenu :items="themesItems">
            <template #item="{ item, index }">
              <li>
                <input type="radio" name="theme-dropdown" :data-theme="item.value"
                  class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start" :aria-label="item.label"
                  :value="item.value" />
              </li>
            </template>
          </DuMenu>
        </div>
      </DuDropdown>
    </div>
    <!-- Hero Section -->
    <div class="hero min-h-[50vh] bg-base-100">
      <div class="hero-content text-center">
        <div class="max-w-3xl">
          <img src="/logoLong.svg" alt="DaisyUI Vue Kit Logo" class="h-32 mx-auto mb-6" />
          <p class="py-6 text-lg text-base-content/70">
            Cornet, a comprehensive Vue 3 component library built on DaisyUI & Tailwind CSS.
          </p>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-12 space-y-16">
      <!-- ACTIONS SECTION -->
      <section>
        <h2 class="text-3xl font-bold mb-8 flex items-center gap-3">
          <DuBadge variant="primary">Actions</DuBadge>
          Interactive Components
        </h2>

        <!-- Buttons -->
        <DuCard dash class="mb-6" title="DuButton">
          <p class="text-base-content/70 mb-4">Versatile button component with multiple variants, sizes and styles.</p>
          <div class="space-y-4">
            <div class="flex flex-wrap gap-2">
              <DuButton>Default</DuButton>
              <DuButton variant="primary">Primary</DuButton>
              <DuButton variant="secondary">Secondary</DuButton>
              <DuButton variant="accent">Accent</DuButton>
              <DuButton variant="info">Info</DuButton>
              <DuButton variant="success">Success</DuButton>
              <DuButton variant="warning">Warning</DuButton>
              <DuButton variant="error">Error</DuButton>
            </div>
            <div class="flex flex-wrap gap-2 items-center">
              <DuButton size="xs">XSmall</DuButton>
              <DuButton size="sm">Small</DuButton>
              <DuButton size="md">Medium</DuButton>
              <DuButton size="lg">Large</DuButton>
              <DuButton size="xl">XLarge</DuButton>
            </div>
            <div class="flex flex-wrap gap-2">
              <DuButton variant="primary" outline>Outline</DuButton>
              <DuButton variant="primary" soft>Soft</DuButton>
              <DuButton variant="primary" dash>Dash</DuButton>
              <DuButton variant="primary" ghost>Ghost</DuButton>
              <DuButton variant="primary" link>Link</DuButton>
            </div>
            <div class="flex flex-wrap gap-2">
              <DuButton variant="primary" wide>Wide</DuButton>
              <DuButton variant="secondary" square>■</DuButton>
              <DuButton variant="accent" circle>●</DuButton>
              <DuButton disabled>Disabled</DuButton>
            </div>
          </div>
        </DuCard>

        <!-- Dropdown -->
        <DuCard dash class="mb-6" title="DuDropdown">
          <p class="text-base-content/70 mb-4">Dropdown menus with various placements.</p>
          <div class="flex flex-wrap gap-4">
            <DuDropdown>
              <template #trigger>
                <DuButton>Click me</DuButton>
              </template>
              <DuMenu class="w-56">
                <li><a>Item 1</a></li>
                <li><a>Item 2</a></li>
                <li><a>Item 3</a></li>
              </DuMenu>
            </DuDropdown>
            <DuDropdown hover>
              <template #trigger>
                <DuButton variant="secondary">Hover me</DuButton>
              </template>
              <DuMenu class="w-56">
                <li><a>Item 1</a></li>
                <li><a>Item 2</a></li>
                <li><a>Item 3</a></li>
              </DuMenu>
            </DuDropdown>
          </div>
        </DuCard>

        <!-- Modal -->
        <DuCard dash class="mb-6" title="DuModal">
          <p class="text-base-content/70 mb-4">Dialog modals for important content and actions.</p>
          <DuButton variant="primary" @click="modalRef.showModal()">Open Modal</DuButton>
          <DuModal ref="modalRef" close-button>
            <h3 class="text-lg font-bold">Welcome!</h3>
            <p>This is a beautiful modal dialog built with DaisyUI Vue Kit.</p>
            <p class="mt-2">You can add any content here including forms, images, and more.</p>
            <template #actions>
              <DuButton @click="modalRef.closeModal()">Close</DuButton>
              <DuButton variant="primary" @click="modalRef.closeModal()">Confirm</DuButton>
            </template>
          </DuModal>
        </DuCard>

        <!-- Swap -->
        <DuCard dash class="mb-6" title="DuSwap">
          <p class="text-base-content/70 mb-4">Swap between two states with animations.</p>
          <div class="flex gap-4 items-center">
            <DuSwap v-model="swapActive" rotate>
              <template #on>🌙</template>
              <template #off>☀️</template>
            </DuSwap>
            <DuSwap v-model="swapActive" flip>
              <template #on>😈</template>
              <template #off>😇</template>
            </DuSwap>
            <span class="text-sm">State: {{ swapActive ? 'ON' : 'OFF' }}</span>
          </div>
        </DuCard>

        <!-- FAB -->
        <DuCard dash class="mb-6" title="DuFab">
          <p class="text-base-content/70 mb-4">Floating Action Button for quick actions.</p>
          <div class="relative h-32 bg-base-200 rounded-lg">
            <DuFab :items="fabItems" variant="primary" circle :main-action="{ label: '+' }" absolute />
          </div>
        </DuCard>
      </section>

      <!-- DATA DISPLAY SECTION -->
      <section>
        <h2 class="text-3xl font-bold mb-8 flex items-center gap-3">
          <DuBadge variant="secondary">Data Display</DuBadge>
          Present Information
        </h2>

        <!-- Avatar & Badge -->
        <div class="grid md:grid-cols-2 gap-6 mb-6">
          <DuCard dash title="DuAvatar">
            <p class="text-base-content/70 mb-4">User avatars with various styles.</p>
            <div class="flex flex-wrap gap-4 items-center">
              <DuAvatar size="xs" rounded="full">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=1" alt="avatar" />
              </DuAvatar>
              <DuAvatar size="sm" rounded="full">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=2" alt="avatar" />
              </DuAvatar>
              <DuAvatar size="md" rounded="full" ring ring-color="ring-primary">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=3" alt="avatar" />
              </DuAvatar>
              <DuAvatar size="md" rounded="full" online>
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=4" alt="avatar" />
              </DuAvatar>
              <DuAvatar size="lg" mask="hexagon">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=5" alt="avatar" />
              </DuAvatar>
              <DuAvatar placeholder rounded="full" size="md">
                <span class="text-xl">AB</span>
              </DuAvatar>
              <DuAvatar size="md" mask="diamond">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=6" alt="avatar" />
              </DuAvatar>
              <DuAvatar size="sm" mask="heart">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=7" alt="avatar" />
              </DuAvatar>
              <DuAvatar size="xs" mask="parallelogram">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=8" alt="avatar" />
              </DuAvatar>
            </div>
          </DuCard>

          <DuCard dash title="DuBadge">
            <p class="text-base-content/70 mb-4">Labels and badges for status indicators.</p>
            <div class="space-y-3">
              <div class="flex flex-wrap gap-2">
                <DuBadge>Default</DuBadge>
                <DuBadge variant="primary">Primary</DuBadge>
                <DuBadge variant="secondary">Secondary</DuBadge>
                <DuBadge variant="accent">Accent</DuBadge>
              </div>
              <div class="flex flex-wrap gap-2">
                <DuBadge variant="info">Info</DuBadge>
                <DuBadge variant="success">Success</DuBadge>
                <DuBadge variant="warning">Warning</DuBadge>
                <DuBadge variant="error">Error</DuBadge>
              </div>
              <div class="flex flex-wrap gap-2 items-center">
                <DuBadge size="xs" variant="primary">XS</DuBadge>
                <DuBadge size="sm" variant="primary">SM</DuBadge>
                <DuBadge size="md" variant="primary">MD</DuBadge>
                <DuBadge size="lg" variant="primary">LG</DuBadge>
              </div>
              <div class="flex flex-wrap gap-2">
                <DuBadge variant="primary" outline>Outline</DuBadge>
                <DuBadge variant="secondary" soft>Soft</DuBadge>
                <DuBadge variant="accent" ghost>Ghost</DuBadge>
              </div>
            </div>
          </DuCard>
        </div>

        <!-- Status -->
        <DuCard dash class="mb-6" title="DuStatus">
          <p class="text-base-content/70 mb-4">Status indicators with optional animations.</p>
          <div class="flex flex-wrap gap-6 items-center">
            <div class="flex items-center gap-2">
              <DuStatus variant="success" /> Online
            </div>
            <div class="flex items-center gap-2">
              <DuStatus variant="warning" /> Away
            </div>
            <div class="flex items-center gap-2">
              <DuStatus variant="error" /> Busy
            </div>
            <div class="flex items-center gap-2">
              <DuStatus variant="info" ping /> Processing
            </div>
            <div class="flex items-center gap-2">
              <DuStatus variant="primary" bounce /> Live
            </div>
          </div>
        </DuCard>

        <!-- Card -->
        <DuCard dash class="mb-6" title="DuCard">
          <p class="text-base-content/70 mb-4">Flexible card containers for content.</p>
          <div class="grid md:grid-cols-3 gap-4">
            <DuCard title="Basic Card" bordered>
              <p>A simple card with title and body content.</p>
              <template #actions>
                <DuButton variant="primary" size="sm">Action</DuButton>
              </template>
            </DuCard>
            <DuCard title="Dashed Card" dash>
              <p>A card with dashed border style.</p>
            </DuCard>
            <DuCard title="Image Card" image-full>
              <template #figure>
                <figure><img src="https://picsum.photos/600/200" alt="Card image" /></figure>
              </template>
              <p>Card with full-width image.</p>
            </DuCard>
          </div>
        </DuCard>

        <!-- Accordion & Collapse -->
        <div class="grid md:grid-cols-2 gap-6 mb-6">
          <DuCard dash title="DuAccordion">
            <p class="text-base-content/70 mb-4">Expandable accordion panels.</p>
            <DuAccordion :items="accordionItems" modifier="collapse-arrow" name="faq" />
          </DuCard>

          <DuCard dash title="DuCollapse">
            <p class="text-base-content/70 mb-4">Collapsible content sections.</p>
            <DuCollapse :items="collapseItems" modifier="collapse-plus" />
          </DuCard>
        </div>

        <!-- Chat -->
        <DuCard dash class="mb-6" title="DuChat">
          <p class="text-base-content/70 mb-4">Chat bubbles for messaging interfaces.</p>
          <div class="bg-base-200 rounded-lg p-4">
            <DuChat :items="chatItems" />
          </div>
        </DuCard>

        <!-- Table -->
        <DuCard dash class="mb-6" title="DuTable">
          <p class="text-base-content/70 mb-4">Data tables with sorting and styling options.</p>
          <DuTable :columns="tableColumns" :rows="tableRows" zebra header />
        </DuCard>

        <div class="grid md:grid-cols-2 gap-6 mb-6">
          <!-- Timeline -->
          <DuCard dash class="mb-6" title="DuTimeline">
            <p class="text-base-content/70 mb-4">Display events in chronological order.</p>
            <DuTimeline :items="timelineItems" :valid-items="[true, true, false]" />
          </DuCard>

          <!-- Stats -->
          <DuCard dash class="mb-6" title="DuStats">
            <p class="text-base-content/70 mb-4">Display statistics and metrics.</p>
            <div class="flex flex-wrap gap-6">
              <DuStats dash :items="statsItems.slice(0, 2)" />
              <DuStats shadow :items="statsItems.slice(2, 4)" />
            </div>
          </DuCard>
        </div>

        <!-- Carousel -->
        <DuCard dash class="mb-6" title="DuCarousel">
          <p class="text-base-content/70 mb-4">Image and content carousels.</p>
          <DuCarousel class="max-w-300 rounded-box" center :items="carouselItems" />
        </DuCard>

        <!-- Diff -->
        <DuCard dash class="mb-6" title="DuDiff">
          <p class="text-base-content/70 mb-4">Compare two images with a slider.</p>
          <DuDiff item1="https://picsum.photos/id/1/800/400" item2="https://picsum.photos/id/2/800/400"
            :aspect-ratio="null" class="h-24" />
        </DuCard>

        <!-- Countdown & Kbd -->
        <div class="grid md:grid-cols-2 gap-6 mb-6">
          <DuCard dash title="DuCountdown & DuCountdownGroup">
            <p class="text-base-content/70 mb-4">Animated countdown timer.</p>
            <div class="flex flex-row gap-4">
              <div class="flex items-center gap-2">
                <span>Days:</span>
                <DuCountdown :target-date="targetDate" format="days" />
              </div>
              <div class="flex items-center gap-2">
                <span>Hours:</span>
                <DuCountdown :target-date="targetDate" format="hours" />
              </div>
              <div class="flex items-center gap-2">
                <span>Minutes:</span>
                <DuCountdown :target-date="targetDate" format="minutes" />
              </div>
              <div class="flex items-center gap-2">
                <span>Seconds:</span>
                <DuCountdown :target-date="targetDate" format="seconds" />
              </div>
            </div>
            <div class="divider"></div>
            <div class="flex flex-row gap-4">
              <DuCountdownGroup :target-date="targetDate"
                :labels="{ days: 'jours', hours: 'heures', minutes: 'min', seconds: 'sec' }" separator="-" />
              <div class="divider divider-horizontal"></div>
              <DuCountdownGroup :target-date="targetDate" :show-days="false" :show-hours="true" :show-minutes="true"
                :show-seconds="true" />
            </div>
          </DuCard>

          <DuCard dash title="DuKbd">
            <p class="text-base-content/70 mb-4">Keyboard key indicators.</p>
            <div>
              <DuKbd>⌘</DuKbd>
              +
              <DuKbd>K</DuKbd>
            </div>
            <span class="mx-2">or</span>
            <div>
              <DuKbd size="sm">Ctrl</DuKbd>
              +
              <DuKbd size="sm">Shift</DuKbd>
              +
              <DuKbd size="sm">P</DuKbd>
            </div>
          </DuCard>
        </div>

        <!-- List -->
        <DuCard dash class="mb-6" title="DuList">
          <p class="text-base-content/70 mb-4">Styled list component.</p>
          <DuList class="bg-base-200 rounded-box">
            <li class="p-4 border-b border-base-300">List item 1</li>
            <li class="p-4 border-b border-base-300">List item 2</li>
            <li class="p-4">List item 3</li>
          </DuList>
        </DuCard>
      </section>

      <!-- DATA INPUT SECTION -->
      <section>
        <h2 class="text-3xl font-bold mb-8 flex items-center gap-3">
          <DuBadge variant="accent">Data Input</DuBadge>
          Form Components
        </h2>

        <!-- Input Field -->
        <DuCard dash class="mb-6" title="DuInputField">
          <p class="text-base-content/70 mb-4">Text input fields with various styles.</p>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DuInputField v-model="inputValue" placeholder="Default input" />
            <DuInputField placeholder="Primary" variant="primary" />
            <DuInputField placeholder="Secondary" variant="secondary" />
            <DuInputField placeholder="Ghost" ghost />
            <DuInputField placeholder="Disabled" disabled />
            <DuInputField placeholder="With error" variant="error" invalid />
          </div>
        </DuCard>

        <!-- Label & Fieldset -->
        <div class="grid md:grid-cols-2 gap-6 mb-6">
          <DuCard dash title="DuLabel">
            <p class="text-base-content/70 mb-4">Form labels for inputs.</p>
            <DuLabel type="floating-label">
              <DuInputField placeholder="Email" type="email" />
              <span>Email Address</span>
            </DuLabel>
            <DuLabel>
              <DuInputField placeholder="Domain-name" />
              <DuLabel type="label">.com</DuLabel>
            </DuLabel>
          </DuCard>

          <DuCard dash title="DuFieldset">
            <p class="text-base-content/70 mb-4">Group related form elements.</p>
            <DuFieldset legend="Personal Info">
              <DuInputField placeholder="Full Name" class="mb-2" />
              <DuInputField placeholder="Email" type="email" />
            </DuFieldset>
          </DuCard>
        </div>

        <!-- Checkbox & Radio -->
        <div class="grid md:grid-cols-2 gap-6 mb-6">
          <DuCard dash title="DuCheckbox">
            <p class="text-base-content/70 mb-4">Checkbox inputs with variants.</p>
            <div class="flex flex-wrap gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <DuCheckbox v-model="checkboxValue" variant="primary" />
                <span>Primary</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <DuCheckbox variant="secondary" checked />
                <span>Secondary</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <DuCheckbox variant="success" />
                <span>Success</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <DuCheckbox disabled />
                <span>Disabled</span>
              </label>
            </div>
          </DuCard>

          <DuCard dash title="DuRadio">
            <p class="text-base-content/70 mb-4">Radio button inputs.</p>
            <div class="flex flex-wrap gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <DuRadio name="demo-radio" variant="primary" checked />
                <span>Option 1</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <DuRadio name="demo-radio" variant="primary" />
                <span>Option 2</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <DuRadio name="demo-radio" variant="primary" />
                <span>Option 3</span>
              </label>
            </div>
          </DuCard>
        </div>

        <!-- Select & Search -->
        <div class="grid md:grid-cols-2 gap-6 mb-6">
          <DuCard dash title="DuSelect">
            <p class="text-base-content/70 mb-4">Dropdown select with search support.</p>
            <DuSelect size="lg" v-model="selectValue" :options="selectOptions" placeholder="Choose an option" track-by="id" label-by="name" />
            <DuSelect size="md" v-model="selectValue" :options="selectOptions" placeholder="Choose an option" track-by="id" label-by="name" />
            <DuSelect size="sm" v-model="selectValue" :options="selectOptions" placeholder="Choose an option" track-by="id" label-by="name" />
            <DuSelect size="xs" v-model="selectValue" :options="selectOptions" placeholder="Choose an option" track-by="id" label-by="name" />
          </DuCard>

          <DuCard dash title="DuSearch">
            <p class="text-base-content/70 mb-4">Search input with autocomplete.</p>
            <DuSearch size="lg" v-model="searchValue" name="framework-search" id="framework-search" :list-values="searchOptions" placeholder="Search frameworks..." />
            <DuSearch size="md" v-model="searchValue" name="framework-search" id="framework-search" :list-values="searchOptions" placeholder="Search frameworks..." />
            <DuSearch size="sm" v-model="searchValue" name="framework-search" id="framework-search" :list-values="searchOptions" placeholder="Search frameworks..." />
            <DuSearch size="xs" v-model="searchValue" name="framework-search" id="framework-search" :list-values="searchOptions" placeholder="Search frameworks..." />
          </DuCard>
        </div>

        <!-- Range & Rating -->
        <div class="grid md:grid-cols-2 gap-6 mb-6">
          <DuCard dash title="DuRange">
            <p class="text-base-content/70 mb-4">Slider range input.</p>
            <div class="space-y-4">
              <DuRange v-model="rangeValue" :min="0" :max="100" variant="primary" />
              <p class="text-sm text-center">Value: {{ rangeValue }}</p>
              <DuRange :min="0" :max="100" :step="25" variant="secondary" />
            </div>
          </DuCard>

          <DuCard dash title="DuRating">
            <p class="text-base-content/70 mb-4">Star rating input.</p>
            <div class="space-y-4">
              <DuRating halfStar v-model="ratingValue" :count="5" name="demo-rating" />
              <p class="text-sm">Rating: {{ ratingValue }} / 5</p>
              <DuRating :count="5" name="demo-rating-2" shape="heart" color="bg-red-500" />
            </div>
          </DuCard>
        </div>

        <!-- TextArea & FileInput -->
        <div class="grid md:grid-cols-2 gap-6 mb-6">
          <DuCard dash title="DuTextArea">
            <p class="text-base-content/70 mb-4">Multi-line text input.</p>
            <DuTextArea v-model="textAreaValue" class="w-full" placeholder="Write your message here..."
              variant="primary" />
          </DuCard>

          <DuCard dash title="DuFileInput">
            <p class="text-base-content/70 mb-4">File upload input.</p>
            <div class="flex flex-wrap gap-4">
              <DuFileInput variant="primary" />
              <DuFileInput variant="secondary" ghost />
            </div>
          </DuCard>
        </div>

        <!-- Filter -->
        <DuCard dash class="mb-6" title="DuFilter">
          <p class="text-base-content/70 mb-4">Filter toggle buttons.</p>
          <DuFilter :items="filterItems" name="status-filter" :buttons-args="{ variant: 'primary', outline: true }" />
        </DuCard>
      </section>

      <!-- FEEDBACK SECTION -->
      <section>
        <h2 class="text-3xl font-bold mb-8 flex items-center gap-3">
          <DuBadge variant="info">Feedback</DuBadge>
          User Feedback Components
        </h2>

        <!-- Alert -->
        <DuCard dash class="mb-6" title="DuAlert">
          <p class="text-base-content/70 mb-4">Alert messages for notifications.</p>
          <div class="space-y-3">
            <DuAlert variant="info" icon>
              <span>New software update available.</span>
            </DuAlert>
            <DuAlert variant="success" icon>
              <span>Your purchase has been confirmed!</span>
            </DuAlert>
            <DuAlert variant="warning" icon>
              <span>Warning: Invalid email address!</span>
            </DuAlert>
            <DuAlert variant="error" icon dismissible>
              <span>Error! Task failed successfully.</span>
            </DuAlert>
          </div>
        </DuCard>

        <!-- Loading -->
        <DuCard dash class="mb-6" title="DuLoading">
          <p class="text-base-content/70 mb-4">Loading indicators with various animations.</p>
          <div class="flex flex-wrap gap-8 items-center">
            <DuLoading animation="spinner" variant="primary" size="lg" />
            <DuLoading animation="dots" variant="secondary" size="lg" />
            <DuLoading animation="ring" variant="accent" size="lg" />
            <DuLoading animation="ball" variant="info" size="lg" />
            <DuLoading animation="bars" variant="success" size="lg" />
            <DuLoading animation="infinity" variant="warning" size="lg" />
          </div>
        </DuCard>

        <!-- Progress -->
        <div class="grid md:grid-cols-2 gap-6 mb-6">
          <DuCard dash title="DuProgress">
            <p class="text-base-content/70 mb-4">Linear progress bars.</p>
            <div class="space-y-4">
              <DuProgress :value="20" :max="100" variant="primary" />
              <DuProgress :value="50" :max="100" variant="secondary" />
              <DuProgress :value="75" :max="100" variant="accent" />
              <DuProgress indeterminate variant="info" />
            </div>
          </DuCard>

          <DuCard dash title="DuRadialProgress">
            <p class="text-base-content/70 mb-4">Circular progress indicators.</p>
            <div class="flex flex-wrap gap-4 items-center">
              <DuRadialProgress :value="25" variant="primary">25%</DuRadialProgress>
              <DuRadialProgress :value="50" variant="secondary">50%</DuRadialProgress>
              <DuRadialProgress :value="75" variant="accent" size="5rem">75%</DuRadialProgress>
            </div>
          </DuCard>
        </div>

        <!-- Skeleton -->
        <DuCard dash class="mb-6" title="DuSkeleton">
          <p class="text-base-content/70 mb-4">Loading placeholder skeletons.</p>
          <div class="flex items-center gap-4">
            <DuSkeleton class="w-16 h-16 rounded-full shrink-0" />
            <div class="flex flex-col gap-2 flex-1">
              <DuSkeleton class="h-4 w-28" />
              <DuSkeleton class="h-4 w-full" />
              <DuSkeleton class="h-4 w-full" />
            </div>
          </div>
        </DuCard>

        <!-- Tooltip & Toast -->
        <div class="grid md:grid-cols-2 gap-6 mb-6">
          <DuCard dash title="DuTooltip">
            <p class="text-base-content/70 mb-4">Informative tooltips on hover.</p>
            <div class="flex flex-wrap gap-4">
              <DuTooltip data-tip="Top tooltip" position="top">
                <DuButton>Top</DuButton>
              </DuTooltip>
              <DuTooltip data-tip="Bottom tooltip" position="bottom">
                <DuButton>Bottom</DuButton>
              </DuTooltip>
              <DuTooltip data-tip="Left tooltip" position="left">
                <DuButton>Left</DuButton>
              </DuTooltip>
              <DuTooltip data-tip="Right tooltip" position="right">
                <DuButton>Right</DuButton>
              </DuTooltip>
              <DuTooltip data-tip="Primary styled" variant="primary" open>
                <DuButton variant="primary">Always Open</DuButton>
              </DuTooltip>
            </div>
          </DuCard>

          <DuCard dash title="DuToast" class="relative">
            <p class="text-base-content/70 mb-4">Toast notifications (positioned).</p>
            <p class="text-sm text-base-content/60">
              Toast components are positioned absolutely. See documentation for usage.
            </p>
            <DuToast horizontalPosition="end" verticalPosition="bottom" v-if="showToast">
              <DuAlert variant="success">
                <span>Your purchase has been confirmed.</span>
                <template #actions>
                  <DuButton size="sm" ghost @click="showToast = false">Dismiss</DuButton>
                </template>
              </DuAlert>
            </DuToast>

            <DuButton @click="showToast = true">Show Toast</DuButton>
          </DuCard>
        </div>
      </section>

      <!-- LAYOUT SECTION -->
      <section>
        <h2 class="text-3xl font-bold mb-8 flex items-center gap-3">
          <DuBadge variant="warning">Layout</DuBadge>
          Layout Components
        </h2>
        <div class="grid md:grid-cols-2 gap-6 mb-6">
          <!-- Join -->
          <DuCard dash class="mb-6" title="DuJoin">
            <p class="text-base-content/70 mb-4">Group elements together visually.</p>
            <DuJoin>
              <DuInputField placeholder="Email" />
              <DuButton>Subscribe</DuButton>
            </DuJoin>
            <DuJoin>
              <DuButton class="join-item">Button 1</DuButton>
              <DuButton class="join-item">Button 2</DuButton>
              <DuButton class="join-item">Button 3</DuButton>
            </DuJoin>
            <DuJoin direction="vertical" class="w-24">
              <DuButton class="join-item" variant="primary">Top</DuButton>
              <DuButton class="join-item" variant="secondary">Middle</DuButton>
              <DuButton class="join-item" variant="accent">Bottom</DuButton>
            </DuJoin>
          </DuCard>

          <!-- Drawer -->
          <DuCard dash class="mb-6" title="DuDrawer">
            <p class="text-base-content/70 mb-4">Slide-out drawer navigation.</p>
            <DuDrawer v-model="drawerOpen1" id="demo-drawer" class="h-16 rounded-box overflow-hidden">
              <template #content>
                <div class="flex flex-col items-center justify-center h-full bg-base-200">
                  <DuButton variant="primary" as="label" for="demo-drawer">
                    Open Drawer
                  </DuButton>
                </div>
              </template>
              <template #sidebar>
                <div class="bg-base-100 h-full min-w-64">
                  <h3 class="text-lg font-bold mb-4 w-full text-center">Drawer Menu</h3>
                  <DuMenu class="bg-transparent rounded-box w-full">
                    <li><a>Home</a></li>
                    <li><a>Profile</a></li>
                    <li><a>Settings</a></li>
                    <li><a>Logout</a></li>
                  </DuMenu>
                </div>
              </template>
            </DuDrawer>
            <DuDrawer id="icon-drawer" alwaysOpenOnLarge iconOnly class="h-40 rounded-box overflow-hidden z-9">
              <template #content>
                <!-- Navbar -->
                <DuNavbar class="bg-base-300">
                  <template #start>
                    <DuButton as="label" for="icon-drawer" aria-label="open sidebar" ghost square>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-linejoin="round"
                        stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"
                        class="inline-block size-5">
                        <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z">
                        </path>
                        <path d="M9 4v16"></path>
                        <path d="M14 10l2 2l-2 2"></path>
                      </svg>
                    </DuButton>
                    <span class="px-4">Navbar Title</span>
                  </template>
                </DuNavbar>
                <!-- Page content -->
                <div class="p-4 text-base-content/70">Page Content</div>
              </template>

              <template #sidebar>
                <DuMenu class="w-full grow">
                  <!-- Home -->
                  <li>
                    <button class="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Home">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-linejoin="round"
                        stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"
                        class="inline-block size-5">
                        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                        <path
                          d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z">
                        </path>
                      </svg>
                      <span class="is-drawer-close:hidden">Home</span>
                    </button>
                  </li>
                  <!-- Analytics -->
                  <li>
                    <button class="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Analytics">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-linejoin="round"
                        stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"
                        class="inline-block size-5">
                        <path d="M3 3v18h18"></path>
                        <path d="M20 18v3"></path>
                        <path d="M16 16v5"></path>
                        <path d="M12 13v8"></path>
                        <path d="M8 21v-6"></path>
                      </svg>
                      <span class="is-drawer-close:hidden">Analytics</span>
                    </button>
                  </li>
                  <!-- Settings -->
                  <li>
                    <button class="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Settings">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-linejoin="round"
                        stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"
                        class="inline-block size-5">
                        <path d="M20 7h-9"></path>
                        <path d="M14 17H5"></path>
                        <circle cx="17" cy="17" r="3"></circle>
                        <circle cx="7" cy="7" r="3"></circle>
                      </svg>
                      <span class="is-drawer-close:hidden">Settings</span>
                    </button>
                  </li>
                </DuMenu>
              </template>
            </DuDrawer>
          </DuCard>

        </div>
      </section>

      <!-- NAVIGATION SECTION -->
      <section>
        <h2 class="text-3xl font-bold mb-8 flex items-center gap-3">
          <DuBadge variant="error">Navigation</DuBadge>
          Navigation Components
        </h2>

        <!-- Navbar -->
        <DuCard dash class="mb-6" title="DuNavbar">
          <p class="text-base-content/70 mb-4">Navigation bar component.</p>
          <DuNavbar class="bg-base-200 rounded-box">
            <template #start>
              <a class="btn btn-ghost text-xl">MyApp</a>
            </template>
            <template #center>
              <DuButton ghost>Home</DuButton>
              <DuButton ghost>About</DuButton>
              <DuButton ghost>Contact</DuButton>
            </template>
            <template #end>
              <DuButton variant="primary" size="sm">Login</DuButton>
            </template>
          </DuNavbar>
        </DuCard>

        <!-- Menu -->
        <DuCard dash class="mb-6" title="DuMenu">
          <p class="text-base-content/70 mb-4">Vertical and horizontal menus.</p>
          <div class="flex flex-wrap gap-8">
            <DuMenu :items="menuItems" direction="vertical" class="bg-base-200 rounded-box w-56" />
            <DuMenu :items="menuItems.slice(0, 3)" direction="horizontal" class="bg-base-200 rounded-box" />
          </div>
        </DuCard>

        <!-- Breadcrumbs -->
        <DuCard dash class="mb-6" title="DuBreadcrumbs">
          <p class="text-base-content/70 mb-4">Navigation breadcrumb trail.</p>
          <DuBreadcrumbs :items="breadcrumbItems" />
        </DuCard>

        <!-- Tabs -->
        <DuCard dash class="mb-6" title="DuTabs">
          <p class="text-base-content/70 mb-4">Tabbed navigation and content.</p>
          <div class="space-y-6">
            <DuTabs :items="tabItems" type="lift" name="demo-tabs-1" />
            <DuTabs :items="tabItems" type="box" name="demo-tabs-2" />
            <DuTabs :items="tabItems" type="border" name="demo-tabs-3" />
          </div>
        </DuCard>

        <!-- Steps -->
        <DuCard dash class="mb-6" title="DuSteps">
          <p class="text-base-content/70 mb-4">Step indicator for multi-step processes.</p>
          <DuSteps :items="stepsItems" :active-steps="[0, 1]" variant="primary" />
        </DuCard>

        <!-- Pagination -->
        <DuCard dash class="mb-6" title="DuPagination">
          <p class="text-base-content/70 mb-4">Page navigation for lists.</p>
          <DuPagination v-model="currentPage" :total="100" :per-page="10" show-previous show-next show-first show-last
            variant="default" />
          <p class="text-sm mt-2">Current page: {{ currentPage }}</p>
        </DuCard>

        <!-- Link & ButtonLink -->
        <div class="grid md:grid-cols-2 gap-6 mb-6">
          <DuCard dash title="DuLink">
            <p class="text-base-content/70 mb-4">Styled link components.</p>
            <div class="flex flex-wrap gap-4">
              <DuLink>Default Link</DuLink>
              <DuLink variant="primary">Primary</DuLink>
              <DuLink variant="secondary">Secondary</DuLink>
              <DuLink variant="accent" only-underline-on-hover>Hover underline</DuLink>
            </div>
          </DuCard>

          <DuCard dash title="DuButtonLink">
            <p class="text-base-content/70 mb-4">Button-styled links.</p>
            <div class="flex flex-wrap gap-2">
              <DuButtonLink variant="primary">Primary</DuButtonLink>
              <DuButtonLink variant="secondary" outline>Outline</DuButtonLink>
              <DuButtonLink variant="accent" soft>Soft</DuButtonLink>
            </div>
          </DuCard>
        </div>

        <!-- Dock -->
        <DuCard dash class="mb-6" title="DuDock">
          <p class="text-base-content/70 mb-4">Bottom dock navigation (mobile-style).</p>
          <div class="relative bg-base-200 rounded-lg p-4 pb-20 min-h-[150px]">
            <p class="text-center text-base-content/60">Dock appears at the bottom</p>
            <DuDock :items="dockItems" class="absolute bottom-0 left-0 right-0" />
          </div>
        </DuCard>
      </section>

      <!-- Footer -->
      <footer class="text-center py-12 border-t border-base-300">
        <p class="text-2xl font-bold mb-2">DaisyUI Vue Kit</p>
        <p class="text-base-content/60 mb-4">
          Built with ❤️ using Vue 3, DaisyUI & Tailwind CSS
        </p>
        <div class="flex justify-center gap-4">
          <DuBadge variant="primary" soft>Vue 3</DuBadge>
          <DuBadge variant="secondary" soft>DaisyUI</DuBadge>
          <DuBadge variant="accent" soft>Tailwind CSS</DuBadge>
          <DuBadge variant="info" soft>TypeScript</DuBadge>
        </div>
      </footer>
    </div>
  </div>
</template>