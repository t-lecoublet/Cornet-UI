/**
 * Generates Cornet's Tailwind class data into dist/:
 *
 *   - cornet-classes.txt : every class name Cornet's components use. The
 *     published index.css scans it (`@source "./dist/cornet-classes.txt"`) so
 *     the consumer's own Tailwind + daisyUI generate Cornet's classes — the
 *     standard model for a Tailwind component library (cf. Flowbite). Without
 *     the Vite plugin, this ships the CSS of every component.
 *   - cornet-tw.json : per-component class list + internal dependency graph.
 *     The optional Vite plugin uses it to narrow index.css to the components
 *     the app actually imports (opt-in tree-shaking).
 *
 * These are needed because the npm package ships compiled output only, and a
 * class is generated only when its literal is scanned. Those literals live in
 * the .vue templates and .types.ts constants (e.g. `BUTTON_COLORS`), which the
 * compiled dist does not carry. We extract them with Tailwind's own scanner
 * (@tailwindcss/oxide) so the result matches exactly what Tailwind sees.
 *
 * Run as part of `npm run build`.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Scanner } from '@tailwindcss/oxide'

const libRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const distDir = join(libRoot, 'dist')

if (!existsSync(distDir)) {
  console.error('[candidates] dist/ not found — run vite build first.')
  process.exit(1)
}

// Component name -> source .vue path, from the library entry point.
const indexContent = readFileSync(join(libRoot, 'index.ts'), 'utf-8')
const exportRegex = /export\s*{\s*default\s+as\s+(\w+)\s*}\s+from\s+['"](.+?)['"]/g
const componentPaths = new Map()
let match
while ((match = exportRegex.exec(indexContent)) !== null) {
  componentPaths.set(match[1], resolve(libRoot, match[2]))
}

const fileToComponent = new Map([...componentPaths].map(([name, p]) => [p, name]))
const importRegex = /import\s+\w+\s+from\s+['"](\.[^'"]+\.vue)['"]/g

// Bare daisyUI component class names that also occur as plain string literals
// (HTML element tags / input `type` values) inside unrelated components — e.g.
// DuButton can render as `<input type="radio">`, so 'input'/'radio'/'checkbox'
// appear in its source though they are not classes there. We keep such a bare
// class only when the component also uses one of its modifiers (`input-xs`,
// `checkbox-primary`, …): a real user always styles it, a string literal does
// not. DuSelect, for instance, renders `class="input input-bordered ..."`, so
// it keeps `input`; DuButton only mentions the word, so it drops it.
const AMBIGUOUS_BASES = new Set([
  'input',
  'checkbox',
  'radio',
  'select',
  'textarea',
  'range',
  'link',
])

const data = {}
const allClasses = new Set()
for (const [name, vuePath] of componentPaths) {
  const dir = dirname(vuePath)

  let text = ''
  for (const entry of readdirSync(dir)) {
    if (entry.endsWith('.vue') || entry.endsWith('.types.ts')) {
      text += '\n' + readFileSync(join(dir, entry), 'utf-8')
    }
  }
  // A fresh Scanner per component: the oxide Scanner is stateful and only
  // emits candidates it has not seen before, so a shared instance would assign
  // each shared class to whichever component is scanned first.
  const scanner = new Scanner({})
  const raw = new Set(scanner.scanFiles([{ content: text, extension: 'vue' }]))
  const usesModifier = (base) => [...raw].some((c) => c.startsWith(base + '-'))
  const classes = [...raw]
    .filter((c) => !AMBIGUOUS_BASES.has(c) || usesModifier(c))
    .sort()
  classes.forEach((c) => allClasses.add(c))

  const deps = []
  const vueContent = readFileSync(vuePath, 'utf-8')
  let dep
  while ((dep = importRegex.exec(vueContent)) !== null) {
    const depName = fileToComponent.get(resolve(dir, dep[1]))
    if (depName && depName !== name) deps.push(depName)
  }

  data[name] = { classes, deps }
}

writeFileSync(join(distDir, 'cornet-classes.txt'), [...allClasses].sort().join('\n') + '\n')
writeFileSync(join(distDir, 'cornet-tw.json'), JSON.stringify(data, null, 0) + '\n')
console.log(`[candidates] ${componentPaths.size} components -> dist/cornet-classes.txt (${allClasses.size} classes) + cornet-tw.json`)
