import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import cornetPlugin, {
  CSS_BASE_CONTENT,
  expandWithInternalDependencies,
  generateExclusionCss,
  parseLibraryExports,
  scanSourceContent,
} from '../plugin-vite'

describe('parseLibraryExports', () => {
  it('extracts component names and paths from index.ts', () => {
    const index = `
export { default as DuButton } from './components/Actions/du-button/du-button.vue';
export { default as DuBadge } from './components/DataDisplay/du-badge/du-badge.vue';
`
    const components = parseLibraryExports(index)
    expect(components.get('DuButton')).toBe('./components/Actions/du-button/du-button.vue')
    expect(components.size).toBe(2)
  })

  it('parses the real library index', () => {
    const index = readFileSync(join(__dirname, '..', 'index.ts'), 'utf-8')
    const components = parseLibraryExports(index)
    expect(components.size).toBeGreaterThan(50)
    expect(components.has('DuSelect')).toBe(true)
    expect(components.has('DuTableItem')).toBe(true)
    expect(components.has('DuMenuItem')).toBe(true)
  })
})

describe('scanSourceContent', () => {
  it('detects named imports', () => {
    const result = scanSourceContent(
      `import { DuButton, DuModal } from 'cornet-ui'`,
      ['cornet-ui'],
    )
    expect([...result.used].sort()).toEqual(['DuButton', 'DuModal'])
    expect(result.namespaceImport).toBe(false)
  })

  it('handles aliased imports', () => {
    const result = scanSourceContent(
      `import { DuButton as Btn } from 'cornet-ui'`,
      ['cornet-ui'],
    )
    expect(result.used.has('DuButton')).toBe(true)
  })

  it('flags namespace imports so nothing gets excluded', () => {
    const result = scanSourceContent(
      `import * as Cornet from 'cornet-ui'`,
      ['cornet-ui'],
    )
    expect(result.namespaceImport).toBe(true)
  })

  it('detects template tag usage without imports', () => {
    const result = scanSourceContent(`<template><DuAlert /></template>`, ['cornet-ui'])
    expect(result.used.has('DuAlert')).toBe(true)
  })

  it('ignores imports from other packages', () => {
    const result = scanSourceContent(`import { DuButton } from 'other-lib'`, ['cornet-ui'])
    expect(result.used.size).toBe(0)
  })

  it('ignores // category comments grouping the import list, without swallowing the next name', () => {
    const result = scanSourceContent(
      `import {
        // Actions
        DuButton,
        DuDropdown,
        // Data Display
        DuAccordion,
      } from 'cornet-ui'`,
      ['cornet-ui'],
    )
    expect([...result.used].sort()).toEqual(['DuAccordion', 'DuButton', 'DuDropdown'])
  })

  it('ignores /* block */ comments grouping the import list, without swallowing the next name', () => {
    const result = scanSourceContent(
      `import { /* Actions */ DuButton, DuDropdown, /* Data Display */ DuAccordion } from 'cornet-ui'`,
      ['cornet-ui'],
    )
    expect([...result.used].sort()).toEqual(['DuAccordion', 'DuButton', 'DuDropdown'])
  })

  it('ignores a whole-line commented-out named import', () => {
    const result = scanSourceContent(
      `// import { DuSearch } from 'cornet-ui'
      import { DuPagination } from 'cornet-ui'`,
      ['cornet-ui'],
    )
    expect([...result.used].sort()).toEqual(['DuPagination'])
  })

  it('ignores a template tag inside an HTML comment', () => {
    const result = scanSourceContent(
      `<template>
        <DuPagination />
        <!-- <DuSearch v-model="x" /> -->
      </template>`,
      ['cornet-ui'],
    )
    expect([...result.used].sort()).toEqual(['DuPagination'])
  })

  it('does not treat a URL inside real (non-commented) content as a line comment', () => {
    const result = scanSourceContent(
      `<template><DuLink href="http://example.com">Go</DuLink></template>`,
      ['cornet-ui'],
    )
    expect(result.used.has('DuLink')).toBe(true)
  })
})

describe('expandWithInternalDependencies (real library)', () => {
  it('keeps DuButton and DuTooltip when only DuFab is used', () => {
    const libRoot = join(__dirname, '..')
    const componentPaths = parseLibraryExports(readFileSync(join(libRoot, 'index.ts'), 'utf-8'))
    const expanded = expandWithInternalDependencies(new Set(['DuFab']), componentPaths, libRoot)
    expect(expanded.has('DuButton')).toBe(true)
    expect(expanded.has('DuTooltip')).toBe(true)
    expect(expanded.has('DuSelect')).toBe(false)
  })
})

describe('generateExclusionCss', () => {
  it('generates deterministic sorted @source not directives', () => {
    const paths = new Map([
      ['DuB', './components/X/du-b/du-b.vue'],
      ['DuA', './components/X/du-a/du-a.vue'],
    ])
    const { css, excludedCount } = generateExclusionCss(paths, new Set())
    expect(excludedCount).toBe(2)
    expect(css).toBe('@source not "./components/X/du-a/du-a.vue";\n@source not "./components/X/du-b/du-b.vue";\n')
    expect(css).not.toContain('Generated on') // no timestamp: git-stable output
  })

  it('excludes nothing when everything is used', () => {
    const paths = new Map([['DuA', './components/X/du-a/du-a.vue']])
    const { css, excludedCount } = generateExclusionCss(paths, new Set(['DuA']))
    expect(excludedCount).toBe(0)
    expect(css).toBe('')
  })
})

describe('cornetPlugin build hooks (isolated fixture)', () => {
  let fixtureRoot: string
  let libRoot: string

  beforeEach(() => {
    fixtureRoot = mkdtempSync(join(tmpdir(), 'cornet-plugin-'))
    libRoot = join(fixtureRoot, 'lib')
    mkdirSync(join(libRoot, 'components/Actions/du-used'), { recursive: true })
    mkdirSync(join(libRoot, 'components/Actions/du-unused'), { recursive: true })
    mkdirSync(join(fixtureRoot, 'src'))
    writeFileSync(join(libRoot, 'package.json'), JSON.stringify({ name: 'cornet-ui' }))
    writeFileSync(
      join(libRoot, 'index.ts'),
      `export { default as DuUsed } from './components/Actions/du-used/du-used.vue';
export { default as DuUnused } from './components/Actions/du-unused/du-unused.vue';
`,
    )
    writeFileSync(join(libRoot, 'components/Actions/du-used/du-used.vue'), '<template><div /></template>')
    writeFileSync(join(libRoot, 'components/Actions/du-unused/du-unused.vue'), '<template><div /></template>')
    writeFileSync(join(libRoot, 'index.css'), CSS_BASE_CONTENT)
    writeFileSync(join(fixtureRoot, 'src/App.vue'), `<script>import { DuUsed } from 'cornet-ui'</script>`)
  })

  afterEach(() => {
    rmSync(fixtureRoot, { recursive: true, force: true })
  })

  type Hook<T> = T | { handler: T }
  function callable<T extends (...args: never[]) => unknown>(hook: Hook<T> | undefined): T {
    if (!hook) throw new Error('hook missing')
    return typeof hook === 'function' ? hook : hook.handler
  }

  it('writes exclusions during build and restores index.css afterwards', async () => {
    const plugin = cornetPlugin({ libPath: libRoot, showOutput: false })
    await callable(plugin.configResolved)({ root: fixtureRoot } as never)
    await callable(plugin.buildStart).call({} as never, {} as never)

    const duringBuild = readFileSync(join(libRoot, 'index.css'), 'utf-8')
    expect(duringBuild).toContain('@source not "./components/Actions/du-unused/du-unused.vue";')
    expect(duringBuild).not.toContain('du-used/du-used.vue')

    await callable(plugin.closeBundle).call({} as never)
    expect(readFileSync(join(libRoot, 'index.css'), 'utf-8')).toBe(CSS_BASE_CONTENT)
  })

  it('keeps everything when the app uses a namespace import', async () => {
    writeFileSync(join(fixtureRoot, 'src/App.vue'), `<script>import * as C from 'cornet-ui'</script>`)
    const plugin = cornetPlugin({ libPath: libRoot, showOutput: false })
    await callable(plugin.configResolved)({ root: fixtureRoot } as never)
    await callable(plugin.buildStart).call({} as never, {} as never)
    expect(readFileSync(join(libRoot, 'index.css'), 'utf-8')).toBe(CSS_BASE_CONTENT)
  })

  it('drops stale exclusions left by an interrupted previous build', async () => {
    writeFileSync(
      join(libRoot, 'index.css'),
      CSS_BASE_CONTENT + '@source not "./components/Actions/du-used/du-used.vue";\n',
    )
    const plugin = cornetPlugin({ libPath: libRoot, showOutput: false })
    await callable(plugin.configResolved)({ root: fixtureRoot } as never)
    await callable(plugin.buildStart).call({} as never, {} as never)
    await callable(plugin.closeBundle).call({} as never)
    expect(readFileSync(join(libRoot, 'index.css'), 'utf-8')).toBe(CSS_BASE_CONTENT)
  })

  it('scans every configured srcDir, not just the default `src`', async () => {
    // Default src/App.vue (from beforeEach) imports nothing; only the second
    // source dir references DuUsed, so this only passes if both dirs are scanned.
    writeFileSync(join(fixtureRoot, 'src/App.vue'), `<script>// no cornet imports here</script>`)
    mkdirSync(join(fixtureRoot, 'app2'))
    writeFileSync(join(fixtureRoot, 'app2/Widget.vue'), `<script>import { DuUsed } from 'cornet-ui'</script>`)

    const plugin = cornetPlugin({ libPath: libRoot, showOutput: false, srcDirs: ['src', 'app2'] })
    await callable(plugin.configResolved)({ root: fixtureRoot } as never)
    await callable(plugin.buildStart).call({} as never, {} as never)

    const duringBuild = readFileSync(join(libRoot, 'index.css'), 'utf-8')
    expect(duringBuild).toContain('@source not "./components/Actions/du-unused/du-unused.vue";')
    expect(duringBuild).not.toContain('du-used/du-used.vue')
  })

  it('detects usage through a custom packageNames specifier instead of the inferred package name', async () => {
    writeFileSync(join(fixtureRoot, 'src/App.vue'), `<script>import { DuUsed } from '@cornet/alias'</script>`)

    const plugin = cornetPlugin({ libPath: libRoot, showOutput: false, packageNames: ['@cornet/alias'] })
    await callable(plugin.configResolved)({ root: fixtureRoot } as never)
    await callable(plugin.buildStart).call({} as never, {} as never)

    const duringBuild = readFileSync(join(libRoot, 'index.css'), 'utf-8')
    expect(duringBuild).toContain('@source not "./components/Actions/du-unused/du-unused.vue";')
    expect(duringBuild).not.toContain('du-used/du-used.vue')
  })

  it('ignores the default package name when a custom packageNames is set', async () => {
    // src/App.vue (from beforeEach) imports DuUsed from 'cornet-ui' (the inferred
    // default), but packageNames overrides detection to a different specifier —
    // so nothing should be detected as used here.
    const plugin = cornetPlugin({ libPath: libRoot, showOutput: false, packageNames: ['@cornet/alias'] })
    await callable(plugin.configResolved)({ root: fixtureRoot } as never)
    await callable(plugin.buildStart).call({} as never, {} as never)

    const duringBuild = readFileSync(join(libRoot, 'index.css'), 'utf-8')
    expect(duringBuild).toContain('@source not "./components/Actions/du-used/du-used.vue";')
    expect(duringBuild).toContain('@source not "./components/Actions/du-unused/du-unused.vue";')
  })
})

describe('cornetPlugin npm mode (tree-shaking via index.css)', () => {
  let fixtureRoot: string
  let libRoot: string
  let cssPath: string
  const PRISTINE_CSS = '/* entry */\n@source "./dist/cornet-classes.txt";\n'

  beforeEach(() => {
    fixtureRoot = mkdtempSync(join(tmpdir(), 'cornet-npm-'))
    libRoot = join(fixtureRoot, 'node_modules/cornet-ui')
    mkdirSync(join(libRoot, 'dist'), { recursive: true })
    mkdirSync(join(fixtureRoot, 'src'))
    writeFileSync(join(libRoot, 'package.json'), JSON.stringify({ name: 'cornet-ui' }))
    // npm package: per-component class data, no index.ts.
    writeFileSync(
      join(libRoot, 'dist', 'cornet-tw.json'),
      JSON.stringify({
        DuFab: { classes: ['fab', 'btn-primary'], deps: ['DuButton'] },
        DuButton: { classes: ['btn', 'btn-primary'], deps: [] },
        DuCard: { classes: ['card'], deps: [] },
      }),
    )
    cssPath = join(libRoot, 'index.css')
    writeFileSync(cssPath, PRISTINE_CSS)
    writeFileSync(join(fixtureRoot, 'src/App.vue'), `<script>import { DuFab } from 'cornet-ui'</script>`)
  })

  afterEach(() => {
    rmSync(fixtureRoot, { recursive: true, force: true })
  })

  type Hook<T> = T | { handler: T }
  function callable<T extends (...args: never[]) => unknown>(hook: Hook<T> | undefined): T {
    if (!hook) throw new Error('hook missing')
    return typeof hook === 'function' ? hook : hook.handler
  }

  it('rewrites index.css to inline the used components (+ deps), then restores', async () => {
    const plugin = cornetPlugin({ libPath: libRoot, showOutput: false })
    await callable(plugin.configResolved)({ root: fixtureRoot } as never)
    await callable(plugin.buildStart).call({} as never, {} as never)

    const during = readFileSync(cssPath, 'utf-8')
    expect(during).toContain('@source inline(')
    expect(during).not.toContain('cornet-classes.txt') // full scan replaced
    // DuFab used -> DuFab + dep DuButton kept, DuCard dropped.
    expect(during).toContain('fab')
    expect(during).toContain('btn')
    expect(during).not.toMatch(/\bcard\b/)

    await callable(plugin.closeBundle).call({} as never)
    expect(readFileSync(cssPath, 'utf-8')).toBe(PRISTINE_CSS)
  })

  it('self-heals an index.css left mutated by an interrupted build', async () => {
    // Simulate a previous build that never restored.
    writeFileSync(
      cssPath,
      '/* entry */\n/* cornet:tree-shake start */\n@source inline("btn");\n/* cornet:tree-shake end */\n',
    )
    const plugin = cornetPlugin({ libPath: libRoot, showOutput: false })
    await callable(plugin.configResolved)({ root: fixtureRoot } as never)
    await callable(plugin.buildStart).call({} as never, {} as never)
    await callable(plugin.closeBundle).call({} as never)
    expect(readFileSync(cssPath, 'utf-8')).toBe(PRISTINE_CSS)
  })

  it('never mutates the canonical json', async () => {
    const before = readFileSync(join(libRoot, 'dist', 'cornet-tw.json'), 'utf-8')
    const plugin = cornetPlugin({ libPath: libRoot, showOutput: false })
    await callable(plugin.configResolved)({ root: fixtureRoot } as never)
    await callable(plugin.buildStart).call({} as never, {} as never)
    expect(readFileSync(join(libRoot, 'dist', 'cornet-tw.json'), 'utf-8')).toBe(before)
  })

  it('keeps the full scan on a namespace import', async () => {
    writeFileSync(join(fixtureRoot, 'src/App.vue'), `<script>import * as C from 'cornet-ui'</script>`)
    const plugin = cornetPlugin({ libPath: libRoot, showOutput: false })
    await callable(plugin.configResolved)({ root: fixtureRoot } as never)
    await callable(plugin.buildStart).call({} as never, {} as never)
    expect(readFileSync(cssPath, 'utf-8')).toBe(PRISTINE_CSS)
  })
})
