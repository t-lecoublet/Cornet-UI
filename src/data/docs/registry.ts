import type { DocPageData } from '@/types/docs'

// ─── Guides ─────────────────────────────────────────────────
import installation from './guides/installation'
import quickStart from './guides/quick-start'
import theming from './guides/theming'
import copyComponents from './guides/copy-components'
import mcp from './guides/mcp'

// ─── Actions ────────────────────────────────────────────────
import button from './actions/button'
import modal from './actions/modal'
import dropdown from './actions/dropdown'
import swap from './actions/swap'
import fab from './actions/fab'

// ─── Data Display ───────────────────────────────────────────
import accordion from './data-display/accordion'
import avatar from './data-display/avatar'
import badge from './data-display/badge'
import card from './data-display/card'
import carousel from './data-display/carousel'
import chat from './data-display/chat'
import collapse from './data-display/collapse'
import countdown from './data-display/countdown'
import diff from './data-display/diff'
import kbd from './data-display/kbd'
import list from './data-display/list'
import stat from './data-display/stat'
import stats from './data-display/stats'
import status from './data-display/status'
import table from './data-display/table'
import timeline from './data-display/timeline'

// ─── Data Input ─────────────────────────────────────────────
import checkbox from './data-input/checkbox'
import fieldset from './data-input/fieldset'
import fileInput from './data-input/file-input'
import filter from './data-input/filter'
import inputField from './data-input/input-field'
import label from './data-input/label'
import labelInputValidator from './data-input/label-input-validator'
import radio from './data-input/radio'
import range from './data-input/range'
import rating from './data-input/rating'
import search from './data-input/search'
import select from './data-input/select'
import textarea from './data-input/textarea'

// ─── Feedback ───────────────────────────────────────────────
import alert from './feedback/alert'
import loading from './feedback/loading'
import progress from './feedback/progress'
import radialProgress from './feedback/radial-progress'
import skeleton from './feedback/skeleton'
import toast from './feedback/toast'
import tooltip from './feedback/tooltip'

// ─── Layout ─────────────────────────────────────────────────
import drawer from './layout/drawer'
import join from './layout/join'

// ─── Navigation ─────────────────────────────────────────────
import breadcrumbs from './navigation/breadcrumbs'
import buttonLink from './navigation/button-link'
import dock from './navigation/dock'
import link from './navigation/link'
import menu from './navigation/menu'
import navbar from './navigation/navbar'
import pagination from './navigation/pagination'
import steps from './navigation/steps'
import tabs from './navigation/tabs'

// ─── Registry ────────────────────────────────────────────────
export const docsRegistry: Record<string, DocPageData> = {
  // Guides
  '/docs/guides/installation': installation,
  '/docs/guides/quick-start': quickStart,
  '/docs/guides/theming': theming,
  '/docs/guides/copy-components': copyComponents,
  '/docs/guides/mcp': mcp,

  // Actions
  '/docs/actions/button': button,
  '/docs/actions/modal': modal,
  '/docs/actions/dropdown': dropdown,
  '/docs/actions/swap': swap,
  '/docs/actions/fab': fab,

  // Data Display
  '/docs/data-display/accordion': accordion,
  '/docs/data-display/avatar': avatar,
  '/docs/data-display/badge': badge,
  '/docs/data-display/card': card,
  '/docs/data-display/carousel': carousel,
  '/docs/data-display/chat': chat,
  '/docs/data-display/collapse': collapse,
  '/docs/data-display/countdown': countdown,
  '/docs/data-display/diff': diff,
  '/docs/data-display/kbd': kbd,
  '/docs/data-display/list': list,
  '/docs/data-display/stat': stat,
  '/docs/data-display/stats': stats,
  '/docs/data-display/status': status,
  '/docs/data-display/table': table,
  '/docs/data-display/timeline': timeline,

  // Data Input
  '/docs/data-input/checkbox': checkbox,
  '/docs/data-input/fieldset': fieldset,
  '/docs/data-input/file-input': fileInput,
  '/docs/data-input/filter': filter,
  '/docs/data-input/input-field': inputField,
  '/docs/data-input/label': label,
  '/docs/data-input/label-input-validator': labelInputValidator,
  '/docs/data-input/radio': radio,
  '/docs/data-input/range': range,
  '/docs/data-input/rating': rating,
  '/docs/data-input/search': search,
  '/docs/data-input/select': select,
  '/docs/data-input/textarea': textarea,

  // Feedback
  '/docs/feedback/alert': alert,
  '/docs/feedback/loading': loading,
  '/docs/feedback/progress': progress,
  '/docs/feedback/radial-progress': radialProgress,
  '/docs/feedback/skeleton': skeleton,
  '/docs/feedback/toast': toast,
  '/docs/feedback/tooltip': tooltip,

  // Layout
  '/docs/layout/drawer': drawer,
  '/docs/layout/join': join,

  // Navigation
  '/docs/navigation/breadcrumbs': breadcrumbs,
  // '/docs/navigation/button-link': buttonLink,
  '/docs/navigation/dock': dock,
  '/docs/navigation/link': link,
  '/docs/navigation/menu': menu,
  '/docs/navigation/navbar': navbar,
  '/docs/navigation/pagination': pagination,
  '/docs/navigation/steps': steps,
  '/docs/navigation/tabs': tabs,
}

// ─── Sidebar navigation ──────────────────────────────────────
export interface NavItem {
  label: string
  path: string
  description?: string
}

export interface NavCategory {
  category: string
  items: NavItem[]
}

export const docsNav: NavCategory[] = [
  {
    category: 'Guides',
    items: [
      { label: 'Installation', path: '/docs/guides/installation', description: 'No npm publish, no registry — just Git. Pick your setup and go.' },
      { label: 'Quick Start', path: '/docs/guides/quick-start', description: 'Start using components in minutes. A practical introduction to the most common patterns.' },
      { label: 'Theming', path: '/docs/guides/theming', description: 'Cornet inherits DaisyUI 5 themes. Switch between built-in themes or create your own.' },
      { label: 'Copy Components', path: '/docs/guides/copy-components', description: 'Skip the submodule — download only the components and composables you need.' },
      { label: 'MCP Server', path: '/docs/guides/mcp', description: 'Use Cornet components directly in your AI assistant via the Model Context Protocol (MCP).' },
    ],
  },
  {
    category: 'Actions',
    items: [
      { label: 'Button', path: '/docs/actions/button', description: 'Buttons allow users to take actions and make choices with a single tap.' },
      { label: 'Dropdown', path: '/docs/actions/dropdown', description: 'Dropdown can open a menu or any other element when the button is clicked.' },
      { label: 'FAB', path: '/docs/actions/fab', description: 'Floating Action Button — a speed-dial button that reveals multiple actions on click.' },
      { label: 'Modal', path: '/docs/actions/modal', description: 'Modal is used to show a dialog or a box when you click a button.' },
      { label: 'Swap', path: '/docs/actions/swap', description: 'Swap allows you to toggle the visibility of two elements by clicking.' },
    ],
  },
  {
    category: 'Data Display',
    items: [
      { label: 'Accordion', path: '/docs/data-display/accordion', description: 'Accordion is used to show and hide content in a collapsible panel.' },
      { label: 'Avatar', path: '/docs/data-display/avatar', description: 'Avatars are used to show a thumbnail representation of a person or object.' },
      { label: 'Badge', path: '/docs/data-display/badge', description: 'Badges are used to inform the user of the status of specific data.' },
      { label: 'Card', path: '/docs/data-display/card', description: 'Cards are used to group and display content in a visually distinct container.' },
      { label: 'Carousel', path: '/docs/data-display/carousel', description: 'Carousel shows several items along a scrollable axis with optional snap alignment.' },
      { label: 'Chat', path: '/docs/data-display/chat', description: 'Chat bubbles are used to show messages in a conversation.' },
      { label: 'Collapse', path: '/docs/data-display/collapse', description: 'Collapse is used to show or hide content with a smooth animation.' },
      { label: 'Countdown', path: '/docs/data-display/countdown', description: 'Countdown gives a live animated countdown.' },
      { label: 'Diff', path: '/docs/data-display/diff', description: 'Diff component shows a comparison between two elements side by side.' },
      { label: 'Kbd', path: '/docs/data-display/kbd', description: 'Kbd is used to display keyboard shortcuts in a styled badge.' },
      { label: 'List', path: '/docs/data-display/list', description: 'List component displays a vertical list of items with optional actions.' },
      { label: 'Stat', path: '/docs/data-display/stat', description: 'Stat displays a single statistic with title, value, and description slots.' },
      { label: 'Stats', path: '/docs/data-display/stats', description: 'Stats groups multiple DuStat components in a horizontal or vertical layout.' },
      { label: 'Status', path: '/docs/data-display/status', description: 'Status is a small colored indicator dot used to show the status of an item.' },
      { label: 'Table', path: '/docs/data-display/table', description: 'Table is used to display tabular data with headers, rows, and optional actions.' },
      { label: 'Timeline', path: '/docs/data-display/timeline', description: 'Timeline displays events in chronological order.' },
    ],
  },
  {
    category: 'Data Input',
    items: [
      { label: 'Checkbox', path: '/docs/data-input/checkbox', description: 'Checkboxes allow the user to select one or more items from a set.' },
      { label: 'Fieldset', path: '/docs/data-input/fieldset', description: 'Fieldset groups related form fields with a legend and optional hint text.' },
      { label: 'FileInput', path: '/docs/data-input/file-input', description: 'FileInput is a styled file upload input.' },
      { label: 'Filter', path: '/docs/data-input/filter', description: 'Filter provides a radio-button-style toggle group for category filtering.' },
      { label: 'InputField', path: '/docs/data-input/input-field', description: 'InputField is a styled text input element with support for variants, sizes, and validation.' },
      { label: 'Label', path: '/docs/data-input/label', description: 'Label wraps an input with an accessible label.' },
      { label: 'LabelInputValidator', path: '/docs/data-input/label-input-validator', description: 'Label + input combo with built-in HTML5 constraint validation and an optional hint.' },
      { label: 'Radio', path: '/docs/data-input/radio', description: 'Radio buttons allow the user to select one option from a set.' },
      { label: 'Range', path: '/docs/data-input/range', description: 'Range input allows users to select a value within a numeric range.' },
      { label: 'Rating', path: '/docs/data-input/rating', description: 'Rating shows a star-based (or custom shape) rating input.' },
      { label: 'Search', path: '/docs/data-input/search', description: 'Search input with optional autocomplete suggestions. Supports single/multiple selection.' },
      { label: 'Select', path: '/docs/data-input/select', description: 'Select is a custom dropdown for picking a single or multiple values from a list.' },
      { label: 'TextArea', path: '/docs/data-input/textarea', description: 'TextArea is a multiline text input.' },
    ],
  },
  {
    category: 'Feedback',
    items: [
      { label: 'Alert', path: '/docs/feedback/alert', description: 'Alert is used to display important messages or feedback to the user.' },
      { label: 'Loading', path: '/docs/feedback/loading', description: 'Loading spinner or dots to indicate that content is loading.' },
      { label: 'Progress', path: '/docs/feedback/progress', description: 'Progress bar displays how much of a task has been completed.' },
      { label: 'RadialProgress', path: '/docs/feedback/radial-progress', description: 'Radial progress shows a circular progress indicator.' },
      { label: 'Skeleton', path: '/docs/feedback/skeleton', description: 'Skeleton is a placeholder that mimics the shape of content while it is loading.' },
      { label: 'Toast', path: '/docs/feedback/toast', description: 'Toast is a fixed-position container for alert notifications.' },
      { label: 'Tooltip', path: '/docs/feedback/tooltip', description: 'Tooltip displays a small label when hovering over an element.' },
    ],
  },
  {
    category: 'Layout',
    items: [
      { label: 'Drawer', path: '/docs/layout/drawer', description: 'Drawer is a side panel that slides in from the edge of the screen.' },
      { label: 'Join', path: '/docs/layout/join', description: 'Join merges adjacent elements visually, removing gaps and borders between them.' },
    ],
  },
  {
    category: 'Navigation',
    items: [
      { label: 'Breadcrumbs', path: '/docs/navigation/breadcrumbs', description: 'Breadcrumbs show the current page location within a hierarchical navigation structure.' },
      // { label: 'ButtonLink', path: '/docs/navigation/button-link' },
      { label: 'Dock', path: '/docs/navigation/dock', description: 'Fixed bottom navigation bar (macOS dock style). Supports icons, labels, sizes.' },
      { label: 'Link', path: '/docs/navigation/link', description: 'Link renders a styled anchor element with variant and size support.' },
      { label: 'Menu', path: '/docs/navigation/menu', description: 'Menu is used for navigation and list-style layouts with optional sub-menus.' },
      { label: 'Navbar', path: '/docs/navigation/navbar', description: 'Navbar is used as a horizontal navigation bar at the top of the page.' },
      { label: 'Pagination', path: '/docs/navigation/pagination', description: 'Pagination component to navigate through pages of content.' },
      { label: 'Steps', path: '/docs/navigation/steps', description: 'Steps component shows a wizard-style progression through a sequence of steps.' },
      { label: 'Tabs', path: '/docs/navigation/tabs', description: 'Tabs organize content into separate panels, showing one at a time.' },
    ],
  },
]
