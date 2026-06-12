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
 * Stable content of `index.css`. The plugin temporarily appends
 * `@source not` directives to that file during `vite build`, then restores
 * this exact content so the file never changes from git's point of view.
 */
export const CSS_BASE_CONTENT = `/* Cornet CSS entry.
   The @source below registers the component sources with Tailwind: class
   literals live in the .vue templates and .types.ts constants, and Tailwind
   ignores node_modules unless a source is declared explicitly. Do not
   remove it, or variant classes (btn-primary, alert-success, ...) will be
   missing from the generated CSS when Cornet is installed from npm.

   During \`vite build\`, the Cornet Vite plugin temporarily appends
   \`@source not\` directives here to exclude unused components from
   Tailwind's scanning, then restores this file. Without the plugin,
   Tailwind simply scans every component: everything still works. */
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
  // Map absolute .vue file path -> component name
  const fileToComponent = new Map<string, string>()
  for (const [name, relPath] of componentPaths) {
    fileToComponent.set(resolve(libRoot, relPath), name)
  }

  // Map component name -> internal component dependencies
  const dependencies = new Map<string, string[]>()
  const importRegex = /import\s+\w+\s+from\s+['"](\.[^'"]+\.vue)['"]/g
  for (const [name, relPath] of componentPaths) {
    const absPath = resolve(libRoot, relPath)
    if (!existsSync(absPath)) continue
    const content = readFileSync(absPath, 'utf-8')
    const deps: string[] = []
    let match: RegExpExecArray | null
    while ((match = importRegex.exec(content)) !== null) {
      const depAbs = resolve(dirname(absPath), match[1])
      const depName = fileToComponent.get(depAbs)
      if (depName && depName !== name) deps.push(depName)
    }
    if (deps.length) dependencies.set(name, deps)
  }

  return expandWithDependencyMap(used, dependencies)
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
  let libRoot: string | undefined
  let cssFilePath: string | undefined
  // Snapshot of index.css before we append exclusions, restored after the
  // build. Captured at runtime because the file differs between the source
  // package (@source "./components") and the npm package (@source "./dist/tw").
  let cssBaseContent: string | undefined

  const fail = (error: unknown) => {
    console.error('[vite-plugin-cornet] component detection failed:', error)
    if (failOnError) throw error
  }

  const restoreCss = () => {
    try {
      if (cssBaseContent !== undefined && cssFilePath && existsSync(cssFilePath) && readFileSync(cssFilePath, 'utf-8') !== cssBaseContent) {
        writeFileSync(cssFilePath, cssBaseContent)
      }
    } catch (error) {
      fail(error)
    }
  }

  return {
    name: 'vite-plugin-cornet',
    apply: 'build',

    configResolved(resolved) {
      config = resolved
    },

    buildStart() {
      try {
        libRoot = options.libPath
          ? resolve(options.libPath)
          : findPackageRoot(dirname(fileURLToPath(import.meta.url)))
        cssFilePath = join(libRoot, 'index.css')

        // Source mode (git/submodule/embedded): parse index.ts and read the
        // dependency graph from the sources. npm mode (compiled package):
        // both come from the generated dist/tw/manifest.json.
        const indexPath = join(libRoot, 'index.ts')
        const manifestPath = join(libRoot, 'dist', 'tw', 'manifest.json')
        let componentPaths: Map<string, string>
        let dependencies: Map<string, string[]> | undefined
        if (existsSync(indexPath)) {
          componentPaths = parseLibraryExports(readFileSync(indexPath, 'utf-8'))
        } else if (existsSync(manifestPath)) {
          const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8')) as Record<
            string,
            { file: string; deps: string[] }
          >
          componentPaths = new Map(
            Object.entries(manifest).map(([name, entry]) => [name, `./dist/tw/${entry.file}`]),
          )
          dependencies = new Map(Object.entries(manifest).map(([name, entry]) => [name, entry.deps]))
        } else {
          if (showOutput) {
            console.log('[vite-plugin-cornet] no library sources or candidates manifest found, CSS exclusions skipped')
          }
          return
        }

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

        // Capture the pristine css entry, dropping exclusions a previously
        // interrupted build may have left behind.
        if (existsSync(cssFilePath)) {
          cssBaseContent = readFileSync(cssFilePath, 'utf-8')
            .split('\n')
            .filter((line) => !line.startsWith('@source not '))
            .join('\n')
        } else {
          cssBaseContent = CSS_BASE_CONTENT
        }

        if (namespaceImport) {
          if (showOutput) {
            console.log('[vite-plugin-cornet] namespace import detected, keeping all components')
          }
          restoreCss()
          return
        }

        const expanded = dependencies
          ? expandWithDependencyMap(used, dependencies)
          : expandWithInternalDependencies(used, componentPaths, libRoot)
        const { css, excludedCount } = generateExclusionCss(componentPaths, expanded)
        writeFileSync(cssFilePath, cssBaseContent + css)

        if (showOutput) {
          console.log(
            `[vite-plugin-cornet] ${expanded.size}/${componentPaths.size} components used, ${excludedCount} excluded from CSS`,
          )
        }
      } catch (error) {
        fail(error)
      }
    },

    // Restore the committed content so index.css never appears modified in git.
    closeBundle: restoreCss,
    buildEnd(error) {
      if (error) restoreCss()
    },
  }
}

export { cornetPlugin }

/** @deprecated Use `cornetPlugin` (default export) instead. */
export const vueDaisyUI = cornetPlugin
