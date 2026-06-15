/**
 * Generates dist/cornet-classes.txt: the list of Tailwind class names Cornet's
 * components use. The published index.css points Tailwind at this file
 * (`@source "./dist/cornet-classes.txt"`) so the consumer's own Tailwind +
 * daisyUI generate Cornet's classes — the standard model for a Tailwind
 * component library (cf. Flowbite).
 *
 * It is needed because the npm package ships compiled output only, and a class
 * is generated only when its literal is scanned. Those literals live in the
 * .vue templates and .types.ts constants (e.g. `BUTTON_COLORS`), which the
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
const componentDirs = new Set()
let match
while ((match = exportRegex.exec(indexContent)) !== null) {
  componentDirs.add(dirname(resolve(libRoot, match[2])))
}

const scanner = new Scanner({})
const classes = new Set()
for (const dir of componentDirs) {
  for (const entry of readdirSync(dir)) {
    if (entry.endsWith('.vue') || entry.endsWith('.types.ts')) {
      const extension = entry.endsWith('.vue') ? 'vue' : 'ts'
      const content = readFileSync(join(dir, entry), 'utf-8')
      for (const candidate of scanner.scanFiles([{ content, extension }])) {
        classes.add(candidate)
      }
    }
  }
}

writeFileSync(join(distDir, 'cornet-classes.txt'), [...classes].sort().join('\n') + '\n')
console.log(`[candidates] ${componentDirs.size} component dirs -> dist/cornet-classes.txt (${classes.size} candidates)`)
