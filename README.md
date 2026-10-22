# Cornet MCP

MCP server exposing the [Cornet](https://gitlab.limos.fr/hub-isima/daisyui-vue-kit) Vue component library documentation and source code to any LLM.

## Tools

| Tool | Description |
| --- | --- |
| `list_components` | List all components by category |
| `get_component_docs` | Full docs for a component (props, slots, classnames, code examples) |
| `get_component_source` | Source from the lib: the `.vue`, its `.types.ts`, sub-components and local composables |
| `install_cornet` | Step-by-step install (npm or git submodule, Tailwind + daisyUI included) for the assistant to run in the user's project — the server changes nothing itself |

## Setup

### Via npx (recommended — no install)

The package is self-contained (zero dependencies, docs and component sources bundled):

```json
"cornet": {
  "type": "local",
  "command": ["npx", "-y", "cornet-mcp@latest"]
}
```

Works in OpenCode, Claude Code (`.mcp.json`), Cursor, Windsurf and any client that supports stdio MCP servers.

### From source (development or self-hosting)

```bash
git clone --recurse-submodules git@gitlab.limos.fr:hub-isima/daisyui-vue-kit.git -b mcp cornet-mcp
cd cornet-mcp
npm install
```

- `npm run dev` — stdio server from source (tsx watch)
- `node dist/index.mjs --http` — HTTP server after `npm run build`
- `docker compose up -d` — HTTP server on `http://localhost:3000/mcp`

The [website submodule](https://gitlab.limos.fr/hub-isima/daisyui-vue-kit) (`website/`) is the source of truth for the docs and component sources: it is bundled at build time (`npm run build` copies `website/lib/components` into `dist/`).

---

## Usage

### OpenCode

In `~/.config/opencode/config.json`:

```json
{
  "mcp": {
    "cornet": {
      "type": "local",
      "command": ["npx", "-y", "cornet-mcp@latest"]
    }
  }
}
```

Or self-hosted:

```json
{
  "mcp": {
    "cornet": {
      "type": "remote",
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

---

### Claude Code

```bash
claude mcp add cornet -- npx -y cornet-mcp@latest
```

Or in `.mcp.json`:

```json
{
  "mcpServers": {
    "cornet": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "cornet-mcp@latest"]
    }
  }
}
```

Or self-hosted:

```bash
claude mcp add --transport http cornet http://localhost:3000/mcp
```

---

### Cursor / Windsurf

In `.cursor/mcp.json` or `.windsurf/mcp.json` at the project root:

```json
{
  "mcpServers": {
    "cornet": {
      "command": "npx",
      "args": ["-y", "cornet-mcp@latest"]
    }
  }
}
```

---

### OpenAI-compatible clients (via mcp-to-openai proxy)

If your client doesn't natively support MCP, use a proxy like [`mcp-proxy`](https://github.com/sparfenyuk/mcp-proxy) to expose the server as OpenAI tool-calling:

```bash
uvx mcp-proxy --sse-port 8080 -- docker compose exec -T web npx tsx /app/server.ts --http
```

Then point your client at `http://localhost:8080`.

---

## Publishing

The package bundles everything (SDK, express, docs, component sources) into `dist/` at publish time:

```bash
npm login
npm publish
```

`prepublishOnly` runs the build. The published package is ~700 kB compressed, ~3 MB unpacked, with zero runtime dependencies.

After a Cornet library or docs update:

```bash
git submodule update --remote --recursive
npm publish
```
