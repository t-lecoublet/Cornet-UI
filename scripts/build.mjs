import { build } from 'esbuild'
import { cpSync, existsSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const dist = join(root, 'dist')
const libComponents = join(root, 'website', 'lib', 'components')

rmSync(dist, { recursive: true, force: true })

await build({
  entryPoints: [join(root, 'server.ts')],
  outfile: join(dist, 'index.mjs'),
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node22',
  sourcemap: false,
  minify: false,
  alias: { '@': join(root, 'website', 'src') },
  banner: {
    js: [
      '#!/usr/bin/env node',
      // ESM output: the bundled CJS deps (express) still call require() at runtime.
      'import { createRequire } from "node:module";',
      'const require = createRequire(import.meta.url);',
    ].join('\n'),
  },
})

if (!existsSync(libComponents)) {
  console.error(
    `Missing ${libComponents}.\n` +
    'The website submodule is not initialized. Run:\n' +
    '  git submodule update --init --recursive',
  )
  process.exit(1)
}

cpSync(libComponents, join(dist, 'components'), { recursive: true })

console.log(`dist/index.mjs + dist/components → ${join(dist)}`)
