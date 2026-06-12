/**
 * Runs automatically before `npm pack` / `npm publish`.
 *
 * In the repo (embedded/submodule mode), package.json points to the raw
 * TypeScript sources so consumers compile Cornet with their own Vite setup.
 * The published npm package must point to the compiled dist/ instead.
 * This script swaps the entry points for the tarball; postpack.mjs restores
 * the original file afterwards.
 */
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const pkgPath = join(root, 'package.json')

if (!existsSync(join(root, 'dist', 'index.js'))) {
  console.error('[prepack] dist/ not found — run `npm run build` before packing.')
  process.exit(1)
}

copyFileSync(pkgPath, join(root, 'package.json.backup'))

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

// The npm package ships the compiled dist only. The raw sources stay a
// git-mode feature (submodule / embedded): copy them from the repository.
pkg.files = ['dist', 'index.css', 'README.md', 'LICENSE']

// Dev-only field, meaningless in the published package. `scripts` is kept:
// removing it could prevent npm from running postpack to restore the file.
delete pkg.devDependencies

writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
console.warn('[prepack] package.json switched to dist-only publish mode')
