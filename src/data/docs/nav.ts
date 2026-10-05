/**
 * The documentation's navigation index: labels, paths and one-line
 * descriptions. Nothing else.
 *
 * It lives apart from `registry.ts` on purpose. `AppLayout` is loaded eagerly
 * — it holds the ⌘K search — and it needs this list. If it took the list from
 * `registry.ts`, the whole of every documented page (props tables, examples,
 * code blocks) would ride into the entry chunk with it, on a home page that
 * shows none of it.
 *
 * So: anything that needs to *list* pages imports from here; only the view
 * that renders a page imports `docsRegistry`.
 */

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
      { label: 'When to Use Cornet', path: '/docs/guides/when-to-use', description: 'Where a Cornet component earns its keep, and where plain DaisyUI markup does the same job.' },
    ],
  },
  {
    category: 'Actions',
    items: [
      { label: 'Button', path: '/docs/actions/button', description: 'Buttons allow users to take actions and make choices with a single tap.' },
      { label: 'Dropdown', path: '/docs/actions/dropdown', description: 'Opens a panel from a trigger, with aria-expanded, Escape and outside-press dismissal, and focus return.' },
      { label: 'FAB', path: '/docs/actions/fab', description: 'Floating Action Button — a speed-dial button that reveals multiple actions on click.' },
      { label: 'Modal', path: '/docs/actions/modal', description: 'Modal is used to show a dialog or a box when you click a button.' },
      { label: 'Swap', path: '/docs/actions/swap', description: 'Swap allows you to toggle the visibility of two elements by clicking.' },
    ],
  },
  {
    category: 'Data Display',
    items: [
      { label: 'Accordion', path: '/docs/data-display/accordion', description: 'Collapsible panels, one open at a time by default. Real aria-expanded buttons, no hidden radios.' },
      { label: 'Avatar', path: '/docs/data-display/avatar', description: 'Avatars are used to show a thumbnail representation of a person or object.' },
      { label: 'Badge', path: '/docs/data-display/badge', description: 'Badges are used to inform the user of the status of specific data.' },
      { label: 'Card', path: '/docs/data-display/card', description: 'Cards are used to group and display content in a visually distinct container.' },
      { label: 'Carousel', path: '/docs/data-display/carousel', description: 'Carousel shows several items along a scrollable axis with optional snap alignment.' },
      { label: 'Chat', path: '/docs/data-display/chat', description: 'Chat bubbles are used to show messages in a conversation.' },
      { label: 'Collapse', path: '/docs/data-display/collapse', description: 'Independent disclosure panels — the difference from Accordion. v-model holds an array of open ones.' },
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
      { label: 'Filter', path: '/docs/data-input/filter', description: 'A radio-button-style toggle group in a fieldset, with a legend naming the whole set.' },
      { label: 'InputField', path: '/docs/data-input/input-field', description: 'InputField is a styled text input element with support for variants, sizes, and validation.' },
      { label: 'Label', path: '/docs/data-input/label', description: 'Label wraps an input with an accessible label.' },
      { label: 'Radio', path: '/docs/data-input/radio', description: 'Radio buttons allow the user to select one option from a set.' },
      { label: 'Range', path: '/docs/data-input/range', description: 'Range input allows users to select a value within a numeric range.' },
      { label: 'Rating', path: '/docs/data-input/rating', description: 'Rating shows a star-based (or custom shape) rating input.' },
      { label: 'Search', path: '/docs/data-input/search', description: 'A text field with autocomplete: type, filter, pick. Shares the combobox engine with Select.' },
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
      { label: 'Toast', path: '/docs/feedback/toast', description: 'A notification queue you raise from anywhere with useToasts(), inside two live regions.' },
      { label: 'Tooltip', path: '/docs/feedback/tooltip', description: 'A short description shown on hover and on keyboard focus, dismissed with Escape.' },
    ],
  },
  {
    category: 'Layout',
    items: [
      { label: 'Drawer', path: '/docs/layout/drawer', description: 'A side panel — a focus-trapping dialog while it floats, a plain part of the page once pinned.' },
      { label: 'Join', path: '/docs/layout/join', description: 'Join merges adjacent elements visually, removing gaps and borders between them.' },
    ],
  },
  {
    category: 'Navigation',
    items: [
      { label: 'Breadcrumbs', path: '/docs/navigation/breadcrumbs', description: 'Breadcrumbs show the current page location within a hierarchical navigation structure.' },
      { label: 'Dock', path: '/docs/navigation/dock', description: 'Fixed bottom navigation bar (macOS dock style). Supports icons, labels, sizes.' },
      { label: 'Link', path: '/docs/navigation/link', description: 'Link renders a styled anchor element with variant and size support.' },
      { label: 'Menu', path: '/docs/navigation/menu', description: 'A list of links, or the APG menu pattern — the role prop decides which, and they are not the same.' },
      { label: 'Navbar', path: '/docs/navigation/navbar', description: 'Navbar is used as a horizontal navigation bar at the top of the page.' },
      { label: 'Pagination', path: '/docs/navigation/pagination', description: 'Pagination component to navigate through pages of content.' },
      { label: 'Steps', path: '/docs/navigation/steps', description: 'Steps component shows a wizard-style progression through a sequence of steps.' },
      { label: 'Tabs', path: '/docs/navigation/tabs', description: 'The WAI-ARIA tabs pattern: one tab stop, arrow keys, v-model by stable value.' },
    ],
  },
]

/**
 * Counts derived from `docsNav` so the sidebar, home page and marketing copy
 * can never drift apart again. `components` counts documented pages — the
 * library exports more than that, since sub-components (DuMenuItem,
 * DuTableItem, DuChatItem…) are documented inside their parent's page.
 */
export const docsCounts = {
  guides: docsNav.find((c) => c.category === 'Guides')?.items.length ?? 0,
  components: docsNav
    .filter((c) => c.category !== 'Guides')
    .reduce((total, c) => total + c.items.length, 0),
}

/** Documented page count per category, keyed by category label. */
export const docsCountByCategory: Record<string, number> = Object.fromEntries(
  docsNav.map((c) => [c.category, c.items.length]),
)
