# Cornet MCP

MCP server exposing the [Cornet](https://gitlab.limos.fr/hub-isima/daisyui-vue-kit) Vue component library documentation and source code to any LLM.

## Tools

| Tool | Description |
| --- | --- |
| `list_components` | List all components by category |
| `get_component_docs` | Full docs for a component (props, slots, classnames, code examples) |
| `get_component_source` | Raw `.vue` source from the lib |

## Setup

```bash
git clone --recurse-submodules git@gitlab.limos.fr:hub-isima/daisyui-vue-kit.git -b mcp cornet-mcp
cd cornet-mcp
docker compose up -d
```

The server listens on `http://localhost:3000/mcp`.

---

## Usage

### Claude Code

```bash
claude mcp add --transport http cornet http://localhost:3000/mcp
```

Or in `.mcp.json`:

```json
{
  "mcpServers": {
    "cornet": {
      "type": "http",
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

---

### OpenCode

In `~/.config/opencode/config.json`:

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

### Cursor / Windsurf

In `.cursor/mcp.json` or `.windsurf/mcp.json` at the project root:

```json
{
  "mcpServers": {
    "cornet": {
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

---

### OpenAI-compatible clients (via mcp-to-openai proxy)

If your client doesn't natively support MCP, use a proxy like [`mcp-proxy`](https://github.com/sparfenyuk/mcp-proxy) to expose the server as OpenAI tool-calling:

```bash
uvx mcp-proxy --sse-port 8080 -- docker compose exec -T web npx tsx /app/server.ts
```

Then point your client at `http://localhost:8080`.

---

## Updating

When the Cornet library or docs are updated:

```bash
git submodule update --remote --recursive
```
