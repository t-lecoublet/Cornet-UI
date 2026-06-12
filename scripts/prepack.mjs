/**
 * Runs automatically before `npm pack` / `npm publish`.
 *
 * In the repo (embedded/submodule mode), the package points to the raw
 * TypeScript sources and Tailwind scans components/ directly. The published
 * npm package is fully generated instead: compiled dist/ plus the class
 * candidates extracted into dist/tw (see generate-candidates.mjs) — no raw
 * sources. This script swaps package.json and index.css for the tarball;
 * postpack.mjs restores both afterwards.
 */
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const pkgPath = join(root, 'package.json')
const cssPath = join(root, 'index.css')

if (!existsSync(join(root, 'dist', 'index.js'))) {
  console.error('[prepack] dist/ not found — run `npm run build` before packing.')
  process.exit(1)
}
if (!existsSync(join(root, 'dist', 'tw', 'manifest.json'))) {
  console.error('[prepack] dist/tw/ not found — run `npm run build` before packing.')
  process.exit(1)
}

copyFileSync(pkgPath, join(root, 'package.json.backup'))
copyFileSync(cssPath, join(root, 'index.css.backup'))

const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))

pkg.main = './dist/index.js'
pkg.types = './dist/index.d.ts'
pkg.exports = {
  '.': {
    types: './dist/index.d.ts',
    import: './dist/index.js',
  },
  './plugin-vite': {
    types: './dist/plugin-vite.d.ts',
    import: './dist/plugin-vite.js',
  },
  './css': './index.css',
  './types': {
    types: './dist/types/index.d.ts',
    import: './dist/types/index.js',
  },
  './package.json': './package.json',
}

// The npm package is fully generated: compiled output + extracted Tailwind
// candidates. Raw sources remain a git-mode (submodule/embedded) feature.
pkg.files = ['dist', 'index.css', 'README.md', 'LICENSE']

// Dev-only field, meaningless in the published package. `scripts` is kept:
// removing it could prevent npm from running postpack to restore the files.
delete pkg.devDependencies

writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')

writeFileSync(
  cssPath,
  `/* Cornet CSS entry (npm package).
   The @source below registers the generated class candidates (dist/tw) with
   Tailwind: it ignores node_modules unless a source is declared explicitly.
   Do not remove it, or component classes (btn-primary, alert-success, ...)
   would be missing from your generated CSS.

   During \`vite build\`, the Cornet Vite plugin temporarily appends
   \`@source not\` directives here to exclude unused components, then
   restores this file. Without the plugin everything still works, you just
   ship the CSS of all components. */
@source "./dist/tw";
`,
)

console.warn('[prepack] package.json and index.css switched to npm (generated-only) mode')
