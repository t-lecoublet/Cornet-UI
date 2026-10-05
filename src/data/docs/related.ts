/**
 * Hand-curated groups of components that solve related problems.
 *
 * Category proximity is a poor proxy for relatedness — DuSelect and DuDropdown
 * live in different categories but are obviously related, while DuKbd and DuTable
 * share one and have nothing to do with each other. So the relationships are
 * written out here instead of inferred.
 *
 * A component may belong to several groups; groups are read in declaration order,
 * so put the strongest association first for components that appear more than once.
 * Membership is symmetric by construction — adding a page to a group relates it to
 * every other member, in both directions, with nothing else to update.
 */

export interface RelatedGroup {
  /** What actually ties these together. Not rendered — it keeps the list honest. */
  label: string
  paths: string[]
}

export const relatedGroups: RelatedGroup[] = [
  {
    label: 'Picking from a set of options',
    paths: [
      '/docs/data-input/select',
      '/docs/data-input/search',
      '/docs/actions/dropdown',
      '/docs/navigation/menu',
    ],
  },
  {
    label: 'Toggles and multiple choice',
    paths: [
      '/docs/data-input/checkbox',
      '/docs/data-input/radio',
      '/docs/actions/swap',
      '/docs/data-input/filter',
    ],
  },
  {
    label: 'Text entry and form structure',
    paths: [
      '/docs/data-input/input-field',
      '/docs/data-input/textarea',
      '/docs/data-input/label',
      '/docs/data-input/fieldset',
      '/docs/data-input/file-input',
    ],
  },
  {
    label: 'Picking a value on a scale',
    paths: ['/docs/data-input/range', '/docs/data-input/rating'],
  },
  {
    label: 'Telling the user something happened',
    paths: ['/docs/feedback/alert', '/docs/feedback/toast', '/docs/feedback/tooltip'],
  },
  {
    label: 'Small inline indicators',
    paths: ['/docs/data-display/badge', '/docs/data-display/status', '/docs/data-display/kbd'],
  },
  {
    label: 'Work in progress',
    paths: [
      '/docs/feedback/loading',
      '/docs/feedback/skeleton',
      '/docs/feedback/progress',
      '/docs/feedback/radial-progress',
    ],
  },
  {
    label: 'Getting around the app',
    paths: [
      '/docs/navigation/navbar',
      '/docs/navigation/menu',
      '/docs/layout/drawer',
      '/docs/navigation/dock',
    ],
  },
  {
    label: 'Layers above the page',
    paths: [
      '/docs/actions/modal',
      '/docs/layout/drawer',
      '/docs/actions/dropdown',
      '/docs/feedback/tooltip',
    ],
  },
  {
    label: 'Showing one panel at a time',
    paths: [
      '/docs/data-display/accordion',
      '/docs/data-display/collapse',
      '/docs/navigation/tabs',
    ],
  },
  {
    label: 'Knowing where you are',
    paths: [
      '/docs/navigation/breadcrumbs',
      '/docs/navigation/tabs',
      '/docs/navigation/steps',
      '/docs/navigation/pagination',
    ],
  },
  {
    label: 'Rows, records and figures',
    paths: [
      '/docs/data-display/table',
      '/docs/data-display/list',
      '/docs/data-display/stats',
      '/docs/data-display/stat',
    ],
  },
  {
    label: 'Things laid out over time',
    paths: [
      '/docs/data-display/timeline',
      '/docs/navigation/steps',
      '/docs/data-display/countdown',
    ],
  },
  {
    label: 'Triggering an action',
    paths: ['/docs/actions/button', '/docs/navigation/link', '/docs/actions/fab'],
  },
  {
    label: 'Framing a block of content',
    paths: [
      '/docs/data-display/card',
      '/docs/data-display/carousel',
      '/docs/data-display/diff',
    ],
  },
  {
    label: 'Grouping controls together',
    paths: ['/docs/layout/join', '/docs/data-input/fieldset', '/docs/data-display/card'],
  },
  {
    label: 'People and conversation',
    paths: ['/docs/data-display/avatar', '/docs/data-display/chat'],
  },
  {
    label: 'Guides',
    paths: [
      '/docs/guides/installation',
      '/docs/guides/quick-start',
      '/docs/guides/theming',
      '/docs/guides/copy-components',
      '/docs/guides/mcp',
      '/docs/guides/when-to-use',
    ],
  },
]

/** Every page related to `path`, strongest group first, self excluded. */
export function relatedPathsFor(path: string, limit = 6): string[] {
  const seen = new Set([path])
  const out: string[] = []

  for (const group of relatedGroups) {
    if (!group.paths.includes(path)) continue
    for (const candidate of group.paths) {
      if (seen.has(candidate)) continue
      seen.add(candidate)
      out.push(candidate)
    }
  }

  return out.slice(0, limit)
}
