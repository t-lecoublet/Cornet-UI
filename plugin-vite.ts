import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Plugin, ResolvedConfig } from 'vite'

export interface CornetPluginOptions {
  /**
   * Root directory of the Cornet library (the folder containing `index.ts`
   * and `index.css`). Auto-detected from the plugin location by default,
   * which works both for npm installs and for the embedded/submodule mode.
   */
  libPath?: string
  /**
   * Application source directories to scan for component usage,
   * relative to the Vite project root. Default: `['src']`.
   */
  srcDirs?: string[]
  /**
   * Import specifiers that resolve to the Cornet library. Defaults to the
   * `name` field of the library package.json. Add entries here if you import
   * the library through an alias or a relative path.
   */
  packageNames?: string[]
  /** Print a summary on stdout during build. Default: `true`. */
  showOutput?: boolean
  /** Abort the build when detection fails. Default: `false` (fail-safe). */
  failOnError?: boolean
}

const SOURCE_EXTENSIONS = ['.vue', '.js', '.ts', '.tsx', '.jsx']

/**
 * Fallback content for the embedded `index.css` when it is missing entirely.
 * In normal operation the plugin restores the file by stripping the
 * `@source not` lines it added, so it returns to its committed content.
 */
export const CSS_BASE_CONTENT = `/* Cornet CSS entry (embedded / submodule mode).
   The @source below registers the component sources with Tailwind so it
   generates Cornet's classes (the class literals live in the .vue templates
   and .types.ts constants).

   During \`vite build\`, the Cornet Vite plugin temporarily appends
   \`@source not\` directives here to exclude unused components, then restores
   this file. Without the plugin, Tailwind scans every component and
   everything still works.

   The npm package ships a different entry (see scripts/prepack.mjs): it
   points at the generated dist/cornet-classes.txt instead. */
@source "./components";
`

/** Parse `export { default as X } from './components/...'` lines of index.ts. */
export function parseLibraryExports(indexContent: string): Map<string, string> {
  const components = new Map<string, string>()
  const exportRegex = /export\s*{\s*default\s+as\s+(\w+)\s*}\s+from\s+['"](.+?)['"]/g
  let match: RegExpExecArray | null
  while ((match = exportRegex.exec(indexContent)) !== null) {
    components.set(match[1], match[2])
  }
  return components
}

export interface UsageScanResult {
  /** Component names found in named imports or as `<DuX>` template tags. */
  used: Set<string>
  /** A namespace import (`import * as X from 'cornet-ui'`) was found: assume everything is used. */
  namespaceImport: boolean
}

/** Scan one source file's content for Cornet component usage. */
export function scanSourceContent(content: string, packageNames: string[]): UsageScanResult {
  const used = new Set<string>()
  let namespaceImport = false

  for (const pkg of packageNames) {
    const escaped = pkg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const namedImportRegex = new RegExp(`import\\s+{([^}]+)}\\s+from\\s+['"]${escaped}['"]`, 'g')
    let match: RegExpExecArray | null
    while ((match = namedImportRegex.exec(content)) !== null) {
      for (const item of match[1].split(',')) {
        const name = item.trim().split(/\s+as\s+/)[0].trim()
        if (name) used.add(name)
      }
    }
    const namespaceRegex = new RegExp(`import\\s+\\*\\s+as\\s+\\w+\\s+from\\s+['"]${escaped}['"]`)
    if (namespaceRegex.test(content)) namespaceImport = true
  }

  // Components referenced directly in templates (global registration, auto-import...)
  const tagRegex = /<(Du\w+)[\s/>]/g
  let tagMatch: RegExpExecArray | null
  while ((tagMatch = tagRegex.exec(content)) !== null) {
    used.add(tagMatch[1])
  }

  return { used, namespaceImport }
}

/** Transitively expand the used set with a component dependency map. */
export function expandWithDependencyMap(
  used: Set<string>,
  dependencies: Map<string, string[]>,
): Set<string> {
  const expanded = new Set(used)
  const queue = [...used]
  while (queue.length) {
    const current = queue.pop()!
    for (const dep of dependencies.get(current) ?? []) {
      if (!expanded.has(dep)) {
        expanded.add(dep)
        queue.push(dep)
      }
    }
  }
  return expanded
}

/**
 * Components may use each other internally (e.g. DuFab renders DuButton).
 * Expand the used set so a dependency of a used component is never excluded.
 */
export function expandWithInternalDependencies(
  used: Set<string>,
  componentPaths: Map<string, string>,
  libRoot: string,
): Set<string> {
  return expandWithDependencyMap(used, buildDependencyMap(componentPaths, libRoot))
}

/** Generate the deterministic `@source not` block for unused components. */
export function generateExclusionCss(
  componentPaths: Map<string, string>,
  used: Set<string>,
): { css: string; excludedCount: number } {
  const unused = [...componentPaths.keys()].filter((name) => !used.has(name)).sort()
  let css = ''
  for (const name of unused) {
    const relPath = componentPaths.get(name)!.replace(/^\.\//, '')
    css += `@source not "./${relPath}";\n`
  }
  return { css, excludedCount: unused.length }
}

function findPackageRoot(startDir: string): string {
  let dir = startDir
  for (let i = 0; i < 6; i++) {
    if (existsSync(join(dir, 'package.json'))) return dir
    const parent = dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  return startDir
}

function collectSourceFiles(dir: string): string[] {
  const results: string[] = []
  if (!existsSync(dir)) return results
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)
    if (stat.isDirectory()) {
      if (entry !== 'node_modules') results.push(...collectSourceFiles(fullPath))
    } else if (SOURCE_EXTENSIONS.includes(extname(entry))) {
      results.push(fullPath)
    }
  }
  return results
}

/**
 * Cornet Vite plugin.
 *
 * At build time, detects which Cornet components the application actually
 * uses and excludes the unused ones from Tailwind's source scanning
 * (`@source not` directives), reducing the generated CSS.
 *
 * The plugin is optional and fail-safe: without it (or when detection
 * fails), Tailwind scans every component and everything still works.
 */
export default function cornetPlugin(options: CornetPluginOptions = {}): Plugin {
  const { showOutput = true, failOnError = false } = options

  let config: ResolvedConfig | undefined
  // Set during buildStart to undo whatever the build touched; null until then.
  let restore: (() => void) | null = null

  const fail = (error: unknown) => {
    console.error('[vite-plugin-cornet] component detection failed:', error)
    if (failOnError) throw error
  }

  const log = (msg: string) => {
    if (showOutput) console.log(`[vite-plugin-cornet] ${msg}`)
  }

  /** Components the app imports, expanded with their internal dependencies. */
  const resolveUsed = (
    libRoot: string,
    dependencies: Map<string, string[]>,
  ): { used: Set<string>; namespaceImport: boolean } => {
    let packageNames = options.packageNames
    if (!packageNames) {
      const pkgPath = join(libRoot, 'package.json')
      const pkgName = existsSync(pkgPath)
        ? (JSON.parse(readFileSync(pkgPath, 'utf-8')).name as string | undefined)
        : undefined
      packageNames = pkgName ? [pkgName] : []
    }
    const root = config?.root ?? process.cwd()
    const srcDirs = options.srcDirs ?? ['src']
    const used = new Set<string>()
    let namespaceImport = false
    for (const srcDir of srcDirs) {
      for (const file of collectSourceFiles(resolve(root, srcDir))) {
        const result = scanSourceContent(readFileSync(file, 'utf-8'), packageNames)
        result.used.forEach((name) => used.add(name))
        namespaceImport ||= result.namespaceImport
      }
    }
    return { used: expandWithDependencyMap(used, dependencies), namespaceImport }
  }

  /**
   * Embedded mode: sources are present. Tailwind scans components/ (index.css
   * declares `@source "./components"`); we append `@source not` directives for
   * unused components and restore index.css afterwards.
   */
  const runEmbedded = (libRoot: string) => {
    const cssFilePath = join(libRoot, 'index.css')
    const componentPaths = parseLibraryExports(readFileSync(join(libRoot, 'index.ts'), 'utf-8'))

    // Pristine css entry, minus exclusions an interrupted build may have left.
    const cssBase = existsSync(cssFilePath)
      ? readFileSync(cssFilePath, 'utf-8')
          .split('\n')
          .filter((line) => !line.startsWith('@source not '))
          .join('\n')
      : CSS_BASE_CONTENT
    restore = () => {
      if (existsSync(cssFilePath) && readFileSync(cssFilePath, 'utf-8') !== cssBase) {
        writeFileSync(cssFilePath, cssBase)
      }
    }

    const { used, namespaceImport } = resolveUsed(
      libRoot,
      buildDependencyMap(componentPaths, libRoot),
    )
    if (namespaceImport) {
      log('namespace import detected, keeping all components')
      restore()
      return
    }
    const { css, excludedCount } = generateExclusionCss(componentPaths, used)
    writeFileSync(cssFilePath, cssBase + css)
    log(`${used.size}/${componentPaths.size} components used, ${excludedCount} excluded from CSS`)
  }

  return {
    name: 'vite-plugin-cornet',
    apply: 'build',

    configResolved(resolved) {
      config = resolved
    },

    buildStart() {
      try {
        const libRoot = options.libPath
          ? resolve(options.libPath)
          : findPackageRoot(dirname(fileURLToPath(import.meta.url)))

        // Only the embedded/submodule layout (raw sources present) is tree-
        // shaken. The npm package ships compiled output and a fixed class list
        // (dist/cornet-classes.txt) scanned by every consumer — like other
        // Tailwind component libraries, its CSS is shipped whole, so there is
        // nothing for the plugin to do there.
        if (existsSync(join(libRoot, 'index.ts'))) {
          runEmbedded(libRoot)
        } else {
          log('npm install detected, Cornet ships its full class list (nothing to tree-shake)')
        }
      } catch (error) {
        fail(error)
      }
    },

    // Restore the pristine files so nothing appears modified after the build.
    closeBundle() {
      restore?.()
    },
    buildEnd(error) {
      if (error) restore?.()
    },
  }
}

/** Build the component -> internal-dependencies map by reading the sources. */
function buildDependencyMap(
  componentPaths: Map<string, string>,
  libRoot: string,
): Map<string, string[]> {
  const fileToComponent = new Map<string, string>()
  for (const [name, relPath] of componentPaths) {
    fileToComponent.set(resolve(libRoot, relPath), name)
  }
  const dependencies = new Map<string, string[]>()
  const importRegex = /import\s+\w+\s+from\s+['"](\.[^'"]+\.vue)['"]/g
  for (const [name, relPath] of componentPaths) {
    const absPath = resolve(libRoot, relPath)
    if (!existsSync(absPath)) continue
    const content = readFileSync(absPath, 'utf-8')
    const deps: string[] = []
    let m: RegExpExecArray | null
    while ((m = importRegex.exec(content)) !== null) {
      const depName = fileToComponent.get(resolve(dirname(absPath), m[1]))
      if (depName && depName !== name) deps.push(depName)
    }
    if (deps.length) dependencies.set(name, deps)
  }
  return dependencies
}

export { cornetPlugin }

/** @deprecated Use `cornetPlugin` (default export) instead. */
export const vueDaisyUI = cornetPlugin
