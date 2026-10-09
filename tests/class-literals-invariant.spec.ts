import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { expandWithInternalDependencies, parseLibraryExports } from '../plugin-vite'

// Mirrors the regexes/modifier lists in scripts/generate-candidates.mjs (not
// exported from there — it's a script, not a module — so redefined here).
const SIZE_CALL = /useSizeMapping\([^,]+,\s*['"]([\w-]+)['"]\s*\)/g
const VARIANT_CALL = /(?:useVariantMapping|mapVariant)\([^,]+,\s*['"]([\w-]+)['"]\s*\)/g
// A size/variant/colour class built by hand — `step-${props.variant}`,
// 'btn-' + size — is invisible to every check here, so it is not allowed at all.
const HAND_BUILT_TEMPLATE = /[a-z][\w-]*-\$\{\s*[\w.?]*?(?:variant|size|color)\s*\}/gi
const HAND_BUILT_CONCAT = /['"][a-z][\w-]*-['"]\s*\+\s*[\w.?]*?(?:variant|size|color)\b/gi
const SIZE_MODIFIERS = ['xs', 'sm', 'md', 'lg', 'xl']
const VARIANT_MODIFIERS = ['neutral', 'primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error']

const libRoot = resolve(__dirname, '..')

interface ClassCall {
  suffix: string
  kind: 'size' | 'variant'
}

function findCalls(vueContent: string): ClassCall[] {
  const calls: ClassCall[] = []
  let m: RegExpExecArray | null
  SIZE_CALL.lastIndex = 0
  while ((m = SIZE_CALL.exec(vueContent)) !== null) calls.push({ suffix: m[1], kind: 'size' })
  VARIANT_CALL.lastIndex = 0
  while ((m = VARIANT_CALL.exec(vueContent)) !== null) calls.push({ suffix: m[1], kind: 'variant' })
  return calls
}

/** Every .vue / .ts source under `dir`, recursively — stories left out. */
function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) return sourceFiles(full)
    return /\.(vue|ts)$/.test(entry.name) && !entry.name.endsWith('.stories.ts') ? [full] : []
  })
}

/** Concatenated .vue + .types.ts content of every file directly inside `dir` (non-recursive, mirrors generate-candidates.mjs). */
function readComponentDirText(dir: string): string {
  let text = ''
  for (const entry of readdirSync(dir)) {
    if (entry.endsWith('.vue') || entry.endsWith('.types.ts')) {
      text += '\n' + readFileSync(join(dir, entry), 'utf-8')
    }
  }
  return text
}

interface Failure {
  component: string
  file: string
  suffix: string
  kind: 'size' | 'variant'
  missing: string[]
  searchedDirs: string[]
}

describe('class-literals invariant', () => {
  it('every useSizeMapping/useVariantMapping/mapVariant call has its literal classes reachable in its own or a dependency component directory', () => {
    const indexContent = readFileSync(join(libRoot, 'index.ts'), 'utf-8')
    const componentPaths = parseLibraryExports(indexContent)

    const failures: Failure[] = []

    for (const [name, relPath] of componentPaths) {
      const vuePath = resolve(libRoot, relPath)
      const vueContent = readFileSync(vuePath, 'utf-8')
      const calls = findCalls(vueContent)
      if (calls.length === 0) continue

      const dependencySet = expandWithInternalDependencies(new Set([name]), componentPaths, libRoot)
      const searchDirs = [...dependencySet].map((depName) => dirname(resolve(libRoot, componentPaths.get(depName)!)))
      const combinedText = searchDirs.map(readComponentDirText).join('\n')

      for (const { suffix, kind } of calls) {
        const modifiers = kind === 'size' ? SIZE_MODIFIERS : VARIANT_MODIFIERS
        const expectedClasses = modifiers.map((m) => `${suffix}-${m}`)
        const missing = expectedClasses.filter((cls) => !combinedText.includes(cls))
        if (missing.length > 0) {
          failures.push({
            component: name,
            file: relPath,
            suffix,
            kind,
            missing,
            searchedDirs: searchDirs.map((d) => d.replace(libRoot + '/', '')),
          })
        }
      }
    }

    const message = failures
      .map(
        (f) =>
          `${f.component} (${f.file}): useVariantMapping/useSizeMapping/mapVariant(…, '${f.suffix}') [${f.kind}] is missing [${f.missing.join(', ')}] — searched in: ${f.searchedDirs.join(', ')}`,
      )
      .join('\n')

    expect(failures, message).toEqual([])
  })

  it('builds no size/variant/colour class by hand', () => {
    const offenders: string[] = []
    for (const file of sourceFiles(join(libRoot, 'components'))) {
      const lines = readFileSync(file, 'utf-8').split('\n')
      lines.forEach((line, i) => {
        for (const re of [HAND_BUILT_TEMPLATE, HAND_BUILT_CONCAT]) {
          re.lastIndex = 0
          const m = re.exec(line)
          if (m) offenders.push(`${file.replace(libRoot + '/', '')}:${i + 1}  ${m[0]}`)
        }
      })
    }

    expect(
      offenders,
      'Build these classes with useSizeMapping / useVariantMapping (props) or mapVariant (one value) ' +
        'and list their literals in .types.ts — a hand-built class is never checked:\n' +
        offenders.join('\n'),
    ).toEqual([])
  })
})
