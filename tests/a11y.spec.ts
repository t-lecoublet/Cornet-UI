// axe-core over every exported component, in a configuration worth looking at.
//
// This is a floor, not a ceiling. Automated rules catch a minority of real
// accessibility problems — they see a missing accessible name, not a menu
// wearing the wrong role — so a clean run here does not mean a component is
// accessible. It means it has not regressed into the failures a machine can
// see. Keyboard behaviour and announced semantics are asserted in each
// component's own spec, and a screen-reader pass is still owed.
//
// The list comes from `index.ts` and the suite fails if a component is exported
// without a fixture: a sweep that quietly skips half the library is worse than
// no sweep, because it reads like coverage.
//
// The bar is `serious` and `critical`. `moderate`/`minor` findings are mostly
// contrast and landmark advice that depend on the page a consumer builds, not
// on the component.
import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import type { Component } from 'vue'
import { EXPORTED, FIXTURES, RENDERED_BY_PARENT, STANDALONE } from './helpers/component-fixtures'

const BLOCKING: axe.ImpactValue[] = ['serious', 'critical']

interface Case {
  name: string
  component: Component
  props?: Record<string, unknown>
  slots?: Record<string, string>
  /**
   * axe rule ids this component is known to fail, each one a structural bug
   * with a scheduled fix rather than something to paper over. The test also
   * asserts that every id listed still fires, so an entry cannot outlive the
   * bug it documents.
   */
  knownIssues?: { rules: string[], because: string }
}

interface Case {
  name: string
  component: Component
  props?: Record<string, unknown>
  slots?: Record<string, string>
  /**
   * axe rule ids this component is known to fail, each one a structural bug
   * with a scheduled fix rather than something to paper over. The test also
   * asserts that every id listed still fires, so an entry cannot outlive the
   * bug it documents.
   */
  knownIssues?: { rules: string[], because: string }
}

/**
 * A `tablist` may own only `tab`s, but daisyUI reveals a panel through
 * `.tabs > .tab + .tab-content` — so the panel has to be a child of the
 * tablist. `aria-owns` does not satisfy the rule. Getting rid of it means
 * rendering the panels outside `.tabs` and losing daisyUI's panel box styling,
 * which is a product decision, so it is recorded rather than papered over.
 */
const TABS_STRUCTURE: Case['knownIssues'] = {
  rules: ['aria-required-children'],
  because: 'daisyUI requires the panel to be a child of the tablist',
}

const cases: Case[] = STANDALONE.map(([name, component, fixture]) => ({
  name,
  component,
  props: fixture.props,
  slots: fixture.slots,
  knownIssues: name === 'DuTabs' ? TABS_STRUCTURE : undefined,
}))

/** States worth sweeping that the default fixture does not reach. */
const extraCases: Case[] = [
  {
    name: 'DuMenu (role=menu)',
    component: FIXTURES.DuMenu != null ? STANDALONE.find(([n]) => n === 'DuMenu')![1] : (null as never),
    props: {
      role: 'menu',
      ariaLabel: 'Actions',
      items: [{ label: 'Open', value: 'open' }, { label: 'Save', value: 'save' }],
    },
  },
  {
    name: 'DuRating (readonly)',
    component: STANDALONE.find(([n]) => n === 'DuRating')![1],
    props: { count: 5, modelValue: 3, readonly: true },
  },
  {
    name: 'DuDrawer (open)',
    component: STANDALONE.find(([n]) => n === 'DuDrawer')![1],
    props: { open: true, ariaLabel: 'Main navigation', items: [{ label: 'Home', href: '/' }] },
  },
  {
    name: 'DuTable (sortable, selectable, paged, searchable)',
    component: STANDALONE.find(([n]) => n === 'DuTable')![1],
    props: {
      caption: 'Owners',
      columns: [
        { key: 'name', label: 'Name', sortable: true, rowHeader: true },
        { key: 'age', label: 'Age', sortable: true, align: 'end' },
      ],
      rows: [{ id: 1, name: 'Ada', age: 36 }, { id: 2, name: 'Grace', age: 85 }, { id: 3, name: 'Alan', age: 41 }],
      sort: [{ key: 'age', direction: 'desc' }],
      selectionMode: 'multiple',
      selected: [1],
      pageSize: 2,
      searchable: true,
    },
  },
  {
    name: 'DuTable (single selection, expandable)',
    component: STANDALONE.find(([n]) => n === 'DuTable')![1],
    props: {
      caption: 'Owners',
      columns: [{ key: 'name', label: 'Name', rowHeader: true }],
      rows: [{ id: 1, name: 'Ada' }, { id: 2, name: 'Grace' }],
      selectionMode: 'single',
      expanded: [1],
    },
    slots: { expanded: '<p>Details</p>' },
  },
  {
    name: 'DuTable (panel, overlay, page sizes)',
    component: STANDALONE.find(([n]) => n === 'DuTable')![1],
    props: {
      caption: 'Inscrits',
      panel: true,
      loading: true,
      sortRequired: true,
      columns: [{ key: 'name', label: 'Nom', sortable: true, rowHeader: true }],
      rows: [{ id: 1, name: 'Ada' }, { id: 2, name: 'Grace' }, { id: 3, name: 'Alan' }],
      pageSizeOptions: [2, 5],
      pageSizeLabel: 'Lignes par page',
      paginationProps: { ariaLabel: 'Pages des inscrits', previousAriaLabel: 'Page précédente', nextAriaLabel: 'Page suivante' },
      searchable: true,
      searchLabel: 'Rechercher un inscrit',
    },
  },
  {
    name: 'DuTable (loading)',
    component: STANDALONE.find(([n]) => n === 'DuTable')![1],
    props: { caption: 'Owners', columns: [{ key: 'name', label: 'Name' }], rows: [], loading: true },
  },
  {
    name: 'DuTable (empty)',
    component: STANDALONE.find(([n]) => n === 'DuTable')![1],
    props: { caption: 'Owners', columns: [{ key: 'name', label: 'Name' }], rows: [], selectionMode: 'multiple' },
  },
]

let mounted: ReturnType<typeof mount> | null = null

afterEach(() => {
  mounted?.unmount()
  mounted = null
  document.body.innerHTML = ''
})

async function violationsOf({ component, props, slots }: Case) {
  const host = document.createElement('div')
  document.body.appendChild(host)
  mounted = mount(component, { props, slots, attachTo: host })

  const results = await axe.run(host, { resultTypes: ['violations'] })
  return results.violations.filter(
    (violation) => violation.impact != null && BLOCKING.includes(violation.impact),
  )
}

describe('the sweep itself', () => {
  it('covers every exported component', () => {
    const swept = new Set(cases.map((testCase) => testCase.name))
    const uncovered = EXPORTED
      .map(([name]) => name)
      .filter((name) => !swept.has(name) && RENDERED_BY_PARENT[name] == null)

    expect(uncovered).toEqual([])
  })

  it('sweeps a sub-component through the parent that renders it', () => {
    // A `menuitem` with no menu around it, a row with no list: rendering those
    // alone would invent failures no consumer can hit.
    const orphans = Object.entries(RENDERED_BY_PARENT)
      .filter(([, parent]) => !cases.some((testCase) => testCase.name === parent))
      .map(([child, parent]) => `${child} -> ${parent}`)

    expect(orphans).toEqual([])
  })
})

describe.each([...cases, ...extraCases])('$name', (testCase) => {
  const known = testCase.knownIssues?.rules ?? []

  it('has no serious or critical axe violation', async () => {
    const unexpected = (await violationsOf(testCase)).filter((v) => !known.includes(v.id))

    expect(unexpected.map((v) => `${v.id} (${v.impact}): ${v.nodes[0]?.html ?? ''}`)).toEqual([])
  })

  it.runIf(known.length > 0)('still fails only the issues it documents', async () => {
    const firing = (await violationsOf(testCase)).map((v) => v.id)

    // Every allowlisted rule must still fire. One that stopped means the bug is
    // fixed and the entry — along with its reason — belongs in the bin.
    expect([...known].sort()).toEqual([...new Set(firing)].sort())
  })
})
