import express, { type Request, type Response } from 'express'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { basename, dirname, join, relative } from 'node:path'
import { docsRegistry } from './website/src/data/docs/registry.js'
import { allComponentLevels, levelByPath } from './website/src/data/component-levels.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** `dist/components` in the published package, the submodule in dev — either way the Cornet sources. */
const COMPONENTS_DIR = existsSync(join(__dirname, 'components'))
  ? join(__dirname, 'components')
  : join(__dirname, 'website', 'lib', 'components')
const LIB_DIR = dirname(COMPONENTS_DIR)

const GITLAB_BASE = 'https://gitlab.limos.fr/hub-isima/daisyui-vue-kit'
const GITHUB_BASE = 'https://github.com/t-lecoublet/Cornet-UI'
const GITHUB_SSH  = 'git@github.com:t-lecoublet/Cornet-UI.git'
const GITLAB_SSH  = 'git@gitlab.limos.fr:hub-isima/daisyui-vue-kit.git'

// Mirrors website/src/composables/useRepoPreference.ts.
function transformToGithub(text: string): string {
  return text
    .replace(/https:\/\/gitlab\.limos\.fr\/hub-isima\/daisyui-vue-kit\/-\/tree\//g, `${GITHUB_BASE}/tree/`)
    // The boundary keeps sibling repos (`daisyui-vue-kit-nuxt-starter`) on GitLab: they have no GitHub mirror.
    .replace(/https:\/\/gitlab\.limos\.fr\/hub-isima\/daisyui-vue-kit(?![-\w])/g, GITHUB_BASE)
    .replace(/git@gitlab\.limos\.fr:hub-isima\/daisyui-vue-kit\.git/g, GITHUB_SSH)
}

function applyRepo(text: string, repo: 'gitlab' | 'github'): string {
  return repo === 'github' ? transformToGithub(text) : text
}

/** `DuTextArea`, `du-text-area`, `text-area` and `textarea` all name the same component. */
function normalizeName(name: string): string {
  return name.toLowerCase().replace(/^du[-_]?/, '').replace(/[^a-z0-9]/g, '')
}

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name)
    return entry.isDirectory() ? walk(full) : [full]
  })
}

/** Every `du-*.vue` under components/ (the internal `core/` has none), keyed by normalized name. */
const componentFiles = new Map(
  walk(COMPONENTS_DIR)
    .filter((file) => /^du-.+\.vue$/.test(basename(file)))
    .map((file) => [normalizeName(basename(file, '.vue')), file]),
)

/** The component's .vue, its .types.ts, then the rest of its folder (sub-components, composables) — stories left out. */
function componentSource(vueFile: string): string {
  const typesFile = vueFile.replace(/\.vue$/, '.types.ts')
  const rest = walk(dirname(vueFile))
    .filter((file) => file !== vueFile && file !== typesFile && !file.endsWith('.stories.ts'))
    .sort()
  return [vueFile, ...(existsSync(typesFile) ? [typesFile] : []), ...rest]
    .map((file) => `// ===== ${relative(LIB_DIR, file)} =====\n${readFileSync(file, 'utf-8')}`)
    .join('\n\n')
}

type Repo = 'gitlab' | 'github'
type InstallMethod = 'npm' | 'submodule'

/** Steps for the caller to run in the user's project: this server cannot reach it (it runs in Docker, or remotely). */
function installSteps(method: InstallMethod, repo: Repo): string {
  const sshUrl = repo === 'github' ? GITHUB_SSH : GITLAB_SSH
  const httpsUrl = `${repo === 'github' ? GITHUB_BASE : GITLAB_BASE}.git`
  const submodule = method === 'submodule'

  return [
    `# Install Cornet (${submodule ? 'git submodule' : 'npm'})`,
    '',
    'Run these steps yourself, from the root of the user\'s project. Show them to the user and get their go-ahead first.',
    'Skip any step whose result is already there. Never clone or copy Cornet\'s files by hand.',
    '',
    '## 0. Check the project',
    '- It must be a Vite + Vue 3 project: package.json lists `vue` and `vite`.',
    ...(submodule
      ? [
          '- It must be a git repository (run `git init` otherwise) with no existing `lib/` directory.',
          '- If `.gitmodules` already mentions `daisyui-vue-kit` or `t-lecoublet/Cornet-UI`, Cornet is installed: skip step 2.',
        ]
      : ['- If package.json already lists `cornet-ui`, Cornet is installed: skip step 2.']),
    '',
    '## 1. Tailwind CSS 4 + daisyUI 5',
    'Install the ones package.json does not list yet:',
    '```bash',
    'npm install tailwindcss @tailwindcss/vite daisyui',
    '```',
    '',
    '## 2. Cornet',
    '```bash',
    ...(submodule
      ? [`git submodule add -b lib ${sshUrl} lib`, 'git submodule update --init --recursive', 'npm install ./lib']
      : ['npm install cornet-ui']),
    '```',
    ...(submodule ? [`If SSH is refused, add the submodule over HTTPS instead: \`git submodule add -b lib ${httpsUrl} lib\``] : []),
    '',
    '## 3. Vite config (vite.config.ts / .js / .mjs)',
    'Add the two imports and the two plugins: `cornetPlugin()` first, `tailwindcss()` after `vue()`. Keep everything else.',
    'Create the file with this content if the project has none.',
    '```ts',
    "import { defineConfig } from 'vite'",
    "import vue from '@vitejs/plugin-vue'",
    "import tailwindcss from '@tailwindcss/vite'",
    "import cornetPlugin from 'cornet-ui/plugin-vite'",
    '',
    'export default defineConfig({',
    '  plugins: [cornetPlugin(), vue(), tailwindcss()],',
    '})',
    '```',
    '`cornetPlugin` is optional: it only drops the CSS of components the app does not use.',
    '',
    '## 4. CSS',
    'At the top of the app\'s main stylesheet — the one `src/main.ts` imports, often `src/style.css` or `src/assets/main.css` —',
    'these three lines, in this order. With no stylesheet, create `src/style.css` and import it from `src/main.ts`.',
    '```css',
    '@import "tailwindcss";',
    '@import "cornet-ui/css";',
    '@plugin "daisyui";',
    '```',
    '',
    '## 5. Older installs',
    'Cornet\'s package used to be named `daisyui-vue-kit`. Replace `daisyui-vue-kit/plugin-vite` and `daisyui-vue-kit/css`',
    'with `cornet-ui/plugin-vite` and `cornet-ui/css` wherever the project still imports them.',
    '',
    '## 6. Check',
    'Run `npm run dev` and render a component:',
    '```vue',
    '<script setup lang="ts">',
    "import { DuButton } from 'cornet-ui'",
    '</script>',
    '',
    '<template>',
    '  <DuButton variant="primary">Hello Cornet</DuButton>',
    '</template>',
    '```',
    'Then call `get_component_docs` ("quick-start", "theming", or any component) for what comes next.',
  ].join('\n')
}

const repoSchema = z.enum(['gitlab', 'github']).optional().describe(
  'Which repo to use for URLs in code examples. ' +
  'IMPORTANT: Before calling any tool, check if the user\'s project has a .gitmodules file. ' +
  'If it exists, read it to detect which Cornet remote is configured (gitlab.limos.fr → "gitlab", github.com → "github") and use that. ' +
  'If there is no .gitmodules or Cornet is not yet installed, ask the user which platform they prefer: ' +
  `GitLab (${GITLAB_BASE}) or GitHub (${GITHUB_BASE}).`
)

function createServer() {
  const server = new McpServer({ name: 'cornet', version: '1.0.0' })

  server.registerTool(
    'list_components',
    {
      description:
        'List all Cornet Vue components organized by category, each tagged by internal complexity — Rich (state, keyboard nav, focus, dismiss: always use the component), Intermediate (some real state: use it for logic, inline for markup) or Simple (class-mapping wrapper: plain HTML + DaisyUI classes does the same) — plus the guides. ' +
        'Use the tags to decide between the Cornet component and plain markup.',
      inputSchema: { repo: repoSchema },
    },
    async ({ repo = 'gitlab' }) => {
      // Components keyed by doc path (levelByPath covers every page; sub-components
      // without a page hang off their parent's docs anyway).
      const levelOf = (path: string): string | null => levelByPath[path]?.level ?? null
      const categories: Record<string, Array<{ name: string; level?: string }>> = {}
      for (const [path, doc] of Object.entries(docsRegistry)) {
        if (!categories[doc.category]) categories[doc.category] = []
        const name = path.split('/').pop()!
        const level = levelOf(path)
        categories[doc.category].push(level ? { name, level } : { name })
      }
      const text = applyRepo(JSON.stringify(categories, null, 2), repo)
      return { content: [{ type: 'text', text }] }
    },
  )

  server.registerTool(
    'get_component_docs',
    {
      description:
        'Get full documentation for a Cornet component or guide. ' +
        'Works for both components (e.g. "button", "modal") and guides (e.g. "installation", "quick-start", "theming", "copy-components", "mcp"). ' +
        'Always call this to read a guide before asking the user to do manual steps.',
      inputSchema: {
        component: z.string().describe('Component name like "button", "modal" or guide name like "installation", "quick-start"'),
        repo: repoSchema,
      },
    },
    async ({ component, repo = 'gitlab' }) => {
      const key = Object.keys(docsRegistry).find((k) =>
        normalizeName(k.split('/').pop()!) === normalizeName(component),
      )
      if (!key) {
        const available = Object.keys(docsRegistry).map((k) => k.split('/').pop())
        return {
          content: [
            { type: 'text', text: `Component "${component}" not found. Available: ${available.join(', ')}` },
          ],
        }
      }
      const text = applyRepo(JSON.stringify(docsRegistry[key], null, 2), repo)
      return { content: [{ type: 'text', text }] }
    },
  )

  server.registerTool(
    'get_component_source',
    {
      description:
        'Get the source of a Cornet component: its .vue file, its .types.ts, then the rest of its folder ' +
        '(sub-components like du-accordion-item, local composables). Stories are left out.',
      inputSchema: {
        component: z.string().describe('Component name like "button", "text-area", "DuSelect" or "accordion-item"'),
      },
    },
    async ({ component }) => {
      const file = componentFiles.get(normalizeName(component))
      if (!file) {
        const available = [...componentFiles.values()].map((f) => basename(f, '.vue').replace(/^du-/, '')).sort()
        return { content: [{ type: 'text', text: `Vue source not found for "${component}". Available: ${available.join(', ')}` }] }
      }
      return { content: [{ type: 'text', text: componentSource(file) }] }
    },
  )

  server.registerTool(
    'install_cornet',
    {
      description:
        'Get the exact steps to install Cornet in a Vite + Vue 3 project, Tailwind CSS 4 and daisyUI 5 included: ' +
        'from npm (`cornet-ui`) or as a git submodule in lib/. ' +
        'This tool changes nothing — it returns the commands and file edits for YOU to run in the user\'s project. ' +
        'Show them to the user, get their go-ahead, then run them. Never clone or copy Cornet\'s files by hand. ' +
        'If anything is unclear, call get_component_docs with "installation" or "quick-start".',
      inputSchema: {
        method: z.enum(['npm', 'submodule']).optional().describe(
          '"npm" installs the published cornet-ui package (default). ' +
          '"submodule" adds the lib\'s source as a git submodule in lib/, for projects that want to edit it. ' +
          'If the user has not said which, ask them.',
        ),
        repo: repoSchema,
      },
    },
    async ({ method = 'npm', repo = 'gitlab' }) => {
      return { content: [{ type: 'text', text: installSteps(method, repo) }] }
    },
  )

  return server
}

// stdio by default (the `npx`/local case): stdout is the JSON-RPC channel, logs go to stderr.
// `--http [--port N]` starts the HTTP server, for hosting the remote URL.
const httpMode = process.argv.includes('--http')

if (!httpMode) {
  await createServer().connect(new StdioServerTransport())
} else {
  const app = express()
  app.use(express.json())

  app.post('/mcp', async (req: Request, res: Response) => {
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined })
    const server = createServer()
    res.on('close', () => { transport.close(); server.close() })
    await server.connect(transport)
    await transport.handleRequest(req, res, req.body)
  })

  const portIndex = process.argv.indexOf('--port')
  const PORT = (portIndex !== -1 ? Number(process.argv[portIndex + 1]) : NaN) || process.env.PORT || 3000
  app.listen(PORT, () => console.error(`Cornet MCP server → http://localhost:${PORT}/mcp`))
}
