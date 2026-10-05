// One place that knows every exported component and how to render it.
//
// Both the axe sweep and the SSR suite walk this list, and both assert it is
// exhaustive against `index.ts` — so a new component cannot be exported
// without being swept, which is the only way a sweep stays true.
import type { Component } from 'vue'
import * as cornet from '../../index'

export interface Fixture {
  props?: Record<string, unknown>
  slots?: Record<string, string>
}

/**
 * Sub-components that only mean anything inside a parent: a `menuitem` with no
 * menu around it, a row with no list. Rendering them alone would invent ARIA
 * failures that no consumer can hit — they are swept through the parent named
 * here instead.
 */
export const RENDERED_BY_PARENT: Record<string, string> = {
  DuAccordionItem: 'DuAccordion',
  DuCarouselItem: 'DuCarousel',
  DuChatItem: 'DuChat',
  DuCountdownGroup: 'DuCountdown',
  DuListRow: 'DuList',
  DuMenuItem: 'DuMenu',
  DuRatingItem: 'DuRating',
  DuStepItem: 'DuSteps',
  DuTableItem: 'DuTable',
  DuTimelineItem: 'DuTimeline',
}

/** What each component needs to render something worth looking at. */
export const FIXTURES: Record<string, Fixture> = {
  DuAccordion: { props: { items: [{ title: 'One', content: 'a' }, { title: 'Two', content: 'b' }] } },
  DuAlert: { props: { variant: 'info', dismissible: true }, slots: { default: 'Saved.' } },
  DuAvatar: { slots: { default: '<img src="/a.png" alt="Ada" />' } },
  DuBadge: { slots: { default: 'New' } },
  DuBreadcrumbs: { props: { items: [{ label: 'Home', href: '/' }, { label: 'Docs' }] } },
  DuButton: { props: { label: 'Save' } },
  DuCard: { props: { title: 'Report' }, slots: { default: 'Body' } },
  DuCarousel: {
    props: { ariaLabel: 'Photos', items: [{ src: '/a.png', alt: 'A' }, { src: '/b.png', alt: 'B' }], controls: true },
  },
  DuChat: { props: { items: [{ message: 'Hi', header: 'Ada' }] } },
  DuCheckbox: { props: { 'aria-label': 'Subscribe' } },
  DuCollapse: { props: { items: [{ title: 'One', content: 'a' }] } },
  DuCountdown: { props: { value: 5, ariaLabel: 'Time left' } },
  DuDiff: { props: { ariaLabel: 'Before and after', item1: '/a.png', item2: '/b.png' } },
  DuDock: { props: { ariaLabel: 'Sections', items: [{ label: 'Home' }, { label: 'Search' }] } },
  DuDrawer: { props: { items: [{ label: 'Home', href: '/' }] } },
  DuDropdown: {
    props: { open: true },
    slots: {
      trigger: '<template #trigger="{ triggerProps }"><button type="button" v-bind="triggerProps">Open</button></template>',
      default: '<p>Panel</p>',
    },
  },
  DuFab: { props: { mainAction: { label: 'Compose' }, items: [{ label: 'Photo' }] } },
  DuFieldset: { props: { legend: 'Address' }, slots: { default: '<p>Body</p>' } },
  DuFileInput: { props: { ariaLabel: 'Attachment' } },
  DuFilter: { props: { items: [{ title: 'All' }, { title: 'Active' }], legend: 'Status' } },
  DuInputField: { props: { type: 'text', 'aria-label': 'Email' } },
  DuJoin: { slots: { default: '<button type="button">One</button><button type="button">Two</button>' } },
  DuKbd: { slots: { default: 'Ctrl' } },
  DuLabel: { slots: { default: 'Email <input type="text" />' } },
  DuLink: { slots: { default: 'Docs' } },
  DuList: { slots: { default: '<li>One</li>' } },
  DuLoading: { props: { ariaLabel: 'Loading' } },
  DuMenu: { props: { items: [{ label: 'Home', href: '/' }, { label: 'Docs', href: '/docs' }] } },
  DuModal: { props: { open: true, ariaLabel: 'Confirm' }, slots: { default: '<p>Sure?</p>' } },
  DuNavbar: { slots: { start: '<span>Brand</span>' } },
  DuPagination: { props: { modelValue: 2, total: 50, perPage: 10 } },
  DuProgress: { props: { value: 40, ariaLabel: 'Upload' } },
  DuRadialProgress: { props: { value: 40, ariaLabel: 'Upload' } },
  DuRadio: { props: { 'aria-label': 'Free plan', name: 'plan', value: 'free' } },
  DuRange: { props: { modelValue: 3, 'aria-label': 'Budget' } },
  DuRating: { props: { count: 5, modelValue: 3, ariaLabel: 'Rating' } },
  DuSearch: { props: { options: [{ id: 1, name: 'Ada' }], labelBy: 'name', trackBy: 'id', ariaLabel: 'Owner' } },
  DuSelect: { props: { options: [{ id: 1, name: 'Ada' }], labelBy: 'name', trackBy: 'id', ariaLabel: 'Owner' } },
  DuSkeleton: { props: { ariaLabel: 'Loading' } },
  DuStat: { props: { title: 'Sales', value: '12' } },
  DuStats: { props: { items: [{ title: 'Sales', value: '12' }] } },
  DuStatus: { props: { ariaLabel: 'Online' } },
  DuSteps: { props: { ariaLabel: 'Checkout', items: [{ label: 'Cart' }, { label: 'Pay' }] } },
  DuSwap: {
    props: { useCheckbox: false, ariaLabel: 'Toggle theme' },
    slots: { on: 'on', off: 'off' },
  },
  DuTable: {
    props: { caption: 'Owners', columns: [{ key: 'name', label: 'Name' }], rows: [{ id: 1, name: 'Ada' }] },
  },
  DuTabs: { props: { ariaLabel: 'Sections', items: [{ label: 'One', content: 'a' }, { label: 'Two' }] } },
  DuTextArea: { props: { 'aria-label': 'Notes' } },
  DuTimeline: { props: { items: [{ start: '2024', middle: '•', end: 'Shipped' }] } },
  DuToast: {},
  DuTooltip: { props: { open: true, dataTip: 'Saves the document' }, slots: { default: '<button type="button">Save</button>' } },
}

/**
 * Everything `index.ts` exports as a component, in export order.
 *
 * The barrel also exports composables and constants, so the entries are widened
 * to `unknown` before being narrowed — a predicate cannot narrow a union that
 * broad to `Component` directly.
 */
export const EXPORTED: [string, Component][] = (Object.entries(cornet) as [string, unknown][])
  .filter((entry): entry is [string, Component] =>
    entry[0].startsWith('Du') && typeof entry[1] === 'object' && entry[1] !== null)

/** The ones a sweep should mount directly. */
export const STANDALONE: [string, Component, Fixture][] = EXPORTED
  .filter(([name]) => RENDERED_BY_PARENT[name] == null)
  .map(([name, component]) => [name, component, FIXTURES[name] ?? {}])
