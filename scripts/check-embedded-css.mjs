/**
 * Embedded-mode control build.
 *
 * `tests/class-literals-invariant.spec.ts` proves that every class a component
 * builds at runtime is *scannable* — that its literal exists somewhere Tailwind
 * will look. It cannot prove the next step: that Tailwind + daisyUI actually
 * emit a rule for it. A safelist can be complete and still be wrong, because
 * the class it lists does not exist in daisyUI (`pagination-sm`, say, or a
 * `-neutral` variant a component does not have).
 *
 * So this compiles the real thing — Tailwind 4 plus the daisyUI plugin, over
 * the candidates Tailwind's own scanner finds in the library sources, exactly
 * as a consumer's embedded build does — and checks that every class
 * `useSizeMapping` / `useVariantMapping` / `mapVariant` can produce at runtime
 * comes out the other end as a CSS rule.
 *
 * Run as `npm run check:css`.
 */
import { createRequire } from 'node:module'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, extname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { Scanner } from '@tailwindcss/oxide'
import { compile } from 'tailwindcss'

const libRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const require = createRequire(pathToFileURL(join(libRoot, 'package.json')))

// Mirrors composables/useSizeProps.ts and useVariantProps.ts.
const SIZE_MODIFIERS = ['xs', 'sm', 'md', 'lg', 'xl']
const VARIANT_MODIFIERS = ['neutral', 'primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error']
const SIZE_CALL = /useSizeMapping\([^,]+,\s*['"]([\w-]+)['"]\s*\)/g
const VARIANT_CALL = /(?:useVariantMapping|mapVariant)\([^,]+,\s*['"]([\w-]+)['"]\s*\)/g

/** Every .vue / .types.ts file under components/, recursively. */
function sourceFiles(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      out.push(...sourceFiles(full))
    }
    else if (extname(entry) === '.vue' || entry.endsWith('.types.ts')) {
      out.push(full)
    }
  }
  return out
}

const files = sourceFiles(join(libRoot, 'components'))

// What the components will ask daisyUI for at runtime, per component file.
const expected = new Map() // class -> Set<file>
for (const file of files) {
  const text = readFileSync(file, 'utf-8')
  const rel = file.slice(libRoot.length + 1)
  const add = (cls) => {
    if (!expected.has(cls)) expected.set(cls, new Set())
    expected.get(cls).add(rel)
  }
  let m
  SIZE_CALL.lastIndex = 0
  while ((m = SIZE_CALL.exec(text)) !== null) SIZE_MODIFIERS.forEach((s) => add(`${m[1]}-${s}`))
  VARIANT_CALL.lastIndex = 0
  while ((m = VARIANT_CALL.exec(text)) !== null) VARIANT_MODIFIERS.forEach((v) => add(`${m[1]}-${v}`))
}

// What a consumer's embedded build would scan out of the same sources.
const scanner = new Scanner({})
const scanned = new Set(scanner.scanFiles(
  files.map((file) => ({ content: readFileSync(file, 'utf-8'), extension: extname(file).slice(1) || 'ts' })),
))

const compiler = await compile('@import "tailwindcss";\n@plugin "daisyui";\n', {
  base: libRoot,
  loadStylesheet: async (id, base) => {
    const path = id === 'tailwindcss'
      ? require.resolve('tailwindcss/index.css')
      : require.resolve(id, { paths: [base] })
    return { path, base: dirname(path), content: readFileSync(path, 'utf-8') }
  },
  loadModule: async (id, base) => {
    const path = require.resolve(id, { paths: [base] })
    const module = await import(pathToFileURL(path).href)
    return { path, base: dirname(path), module: module.default ?? module }
  },
})

const css = compiler.build([...new Set([...scanned, ...expected.keys()])])

// A component may define a class itself, in its own <style> block, rather than
// take it from daisyUI (DuAvatar's size scale, DuTooltip's neutral variant).
// Those are styled too — just not by Tailwind.
const ownStyles = files
  .filter((file) => extname(file) === '.vue')
  .map((file) => (readFileSync(file, 'utf-8').match(/<style[^>]*>([\s\S]*?)<\/style>/g) ?? []).join('\n'))
  .join('\n')

const unscanned = []
const unstyled = []
for (const [cls, sources] of [...expected].sort()) {
  if (!scanned.has(cls)) {
    unscanned.push({ cls, sources })
  }
  // The rule may be written `.btn-sm`, or grouped as `.btn-sm,` / `:is(.btn-sm)`.
  const selector = new RegExp(`\\.${cls.replace(/[-/]/g, '\\$&')}(?![\\w-])`)
  if (!selector.test(css) && !selector.test(ownStyles)) {
    unstyled.push({ cls, sources })
  }
}

const report = (title, rows) => {
  console.error(`\n[embedded] ${title}`)
  for (const { cls, sources } of rows) {
    console.error(`  ${cls}  <- ${[...sources].join(', ')}`)
  }
}

if (unscanned.length > 0) {
  report('built at runtime but never scanned (add the literal to the component\'s .types.ts):', unscanned)
}
if (unstyled.length > 0) {
  report('scanned but daisyUI emits no rule (the safelist names a class that does not exist):', unstyled)
}

if (unscanned.length + unstyled.length > 0) {
  console.error(`\n[embedded] ${unscanned.length + unstyled.length} problem(s). CSS built: ${(css.length / 1024).toFixed(0)} KB.\n`)
  process.exit(1)
}

console.log(`[embedded] ${expected.size} runtime classes over ${files.length} source files: all scanned, all styled (${(css.length / 1024).toFixed(0)} KB).`)
