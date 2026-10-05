/**
 * Every documented page, keyed by route. This module pulls in all of them, so
 * it is heavy by construction — import it only from the view that renders a
 * page. To *list* pages (a sidebar, a search index, a count), use
 * `@/data/docs/nav`, which carries labels and paths and nothing else.
 */
import type { DocPageData } from '@/types/docs'

// ─── Guides ─────────────────────────────────────────────────
import installation from './guides/installation'
import quickStart from './guides/quick-start'
import theming from './guides/theming'
import copyComponents from './guides/copy-components'
import mcp from './guides/mcp'
import whenToUse from './guides/when-to-use'

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
  '/docs/guides/when-to-use': whenToUse,

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
  '/docs/navigation/dock': dock,
  '/docs/navigation/link': link,
  '/docs/navigation/menu': menu,
  '/docs/navigation/navbar': navbar,
  '/docs/navigation/pagination': pagination,
  '/docs/navigation/steps': steps,
  '/docs/navigation/tabs': tabs,
}
