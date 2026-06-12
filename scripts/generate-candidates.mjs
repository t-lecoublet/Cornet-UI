/**
 * Generates dist/tw/: Tailwind class candidates for the npm package.
 *
 * The npm package ships compiled output only — no raw sources. But Tailwind
 * generates a class only when its literal appears in a scanned file, and
 * those literals live in the .vue templates and .types.ts constants. This
 * script extracts them with Tailwind's own scanner (@tailwindcss/oxide) into
 * one small text file per component, plus a manifest used by the Vite plugin
 * to keep per-component CSS exclusions working in npm mode.
 *
 * Run as part of `npm run build`.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Scanner } from '@tailwindcss/oxide'

const libRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const outDir = join(libRoot, 'dist', 'tw')

if (!existsSync(join(libRoot, 'dist'))) {
  console.error('[candidates] dist/ not found — run vite build first.')
  process.exit(1)
}

// Component name -> source .vue path, from the library entry point.
const indexContent = readFileSync(join(libRoot, 'index.ts'), 'utf-8')
const exportRegex = /export\s*{\s*default\s+as\s+(\w+)\s*}\s+from\s+['"](.+?)['"]/g
const components = new Map()
let match
while ((match = exportRegex.exec(indexContent)) !== null) {
  components.set(match[1], resolve(libRoot, match[2]))
}

const scanner = new Scanner({})
const scanContent = (content, extension) =>
  scanner.scanFiles([{ content, extension }])

// Internal component dependencies (e.g. DuFab renders DuButton), baked into
// the manifest because the plugin cannot read the sources in npm mode.
const fileToComponent = new Map([...components].map(([name, path]) => [path, name]))
const importRegex = /import\s+\w+\s+from\s+['"](\.[^'"]+\.vue)['"]/g

mkdirSync(outDir, { recursive: true })

const manifest = {}
for (const [name, vuePath] of components) {
  const componentDir = dirname(vuePath)
  const vueContent = readFileSync(vuePath, 'utf-8')

  // Candidates: the component's template/script plus every .types.ts of its
  // directory (variant/size constants live there, sometimes shared between
  // a component and its sub-component).
  let text = vueContent
  for (const entry of readdirSync(componentDir)) {
    if (entry.endsWith('.types.ts')) {
      text += '\n' + readFileSync(join(componentDir, entry), 'utf-8')
    }
  }
  const candidates = [...new Set(scanContent(text, 'vue'))].sort()

  const deps = []
  let dep
  while ((dep = importRegex.exec(vueContent)) !== null) {
    const depName = fileToComponent.get(resolve(componentDir, dep[1]))
    if (depName && depName !== name) deps.push(depName)
  }

  const file = `${name}.txt`
  writeFileSync(join(outDir, file), candidates.join('\n') + '\n')
  manifest[name] = { file, deps }
}

writeFileSync(join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
console.log(`[candidates] ${components.size} components -> dist/tw/`)
