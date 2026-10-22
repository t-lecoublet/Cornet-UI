import type { DocPageData } from '@/types/docs'

export default {
  title: 'MCP Server',
  description: 'Use Cornet components directly in your AI assistant via the Model Context Protocol (MCP).',
  category: 'Guides',
  sections: [
    {
      title: 'What is the Cornet MCP?',
      description: 'The Cornet MCP server exposes component documentation and source code to any LLM that supports the Model Context Protocol. Once connected, your assistant can look up props, slots, code examples and raw Vue source for any Cornet component — no copy-pasting docs needed.',
      lang: 'bash',
      links: [
        { label: 'MCP specification', href: 'https://modelcontextprotocol.io' },
        { label: 'cornet-mcp on npm', href: 'https://www.npmjs.com/package/cornet-mcp' },
        { label: 'Cornet MCP repository', href: 'https://gitlab.limos.fr/hub-isima/daisyui-vue-kit/-/tree/mcp' },
      ],
      code: `# Available tools:
# list_components         → lists all components by category
# get_component_docs      → full docs (props, slots, classnames, examples)
# get_component_source    → raw .vue source from the lib
# install_cornet          → exact install steps (npm or git submodule)`,
    },
    {
      title: 'Setup',
      description: 'The published package is self-contained — docs and component sources are bundled, zero dependencies. No install, no clone, no Docker.',
      lang: 'json',
      code: `// Add to any client that supports stdio MCP servers:
"cornet": {
  "type": "local",
  "command": ["npx", "-y", "cornet-mcp@latest"]
}`,
    },
    {
      title: 'Claude Code',
      description: 'Register the server with the Claude Code CLI, or add it to your project or global MCP config.',
      lang: 'bash',
      links: [
        { label: 'Claude Code MCP docs', href: 'https://docs.anthropic.com/en/docs/claude-code/mcp' },
      ],
      code: `claude mcp add cornet -- npx -y cornet-mcp@latest`,
    },
    {
      title: 'Claude Code — manual config',
      description: 'Alternatively, add the server manually to your project or global MCP config.',
      lang: 'json',
      code: `// .mcp.json  (project)  or  ~/.claude/mcp.json  (global)
{
  "mcpServers": {
    "cornet": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "cornet-mcp@latest"]
    }
  }
}`,
    },
    {
      title: 'OpenCode',
      description: 'Add the server to your OpenCode configuration file.',
      lang: 'json',
      links: [
        { label: 'OpenCode MCP docs', href: 'https://opencode.ai/docs/mcp' },
      ],
      code: `// ~/.config/opencode/opencode.json
{
  "mcp": {
    "cornet": {
      "type": "local",
      "command": ["npx", "-y", "cornet-mcp@latest"]
    }
  }
}`,
    },
    {
      title: 'Cursor / Windsurf',
      description: 'Add an MCP config file at the root of your project.',
      lang: 'json',
      code: `// .cursor/mcp.json  or  .windsurf/mcp.json
{
  "mcpServers": {
    "cornet": {
      "command": "npx",
      "args": ["-y", "cornet-mcp@latest"]
    }
  }
}`,
    },
    {
      title: 'Self-hosting',
      description: 'For a shared remote URL (a server your whole team points at, or clients without stdio support), run the server over HTTP instead. The npx command serves stdio by default; pass --http to listen on a port.',
      lang: 'bash',
      code: `# From the repo (Docker):
git clone --recurse-submodules \\
  git@gitlab.limos.fr:hub-isima/daisyui-vue-kit.git \\
  -b mcp cornet-mcp
cd cornet-mcp
docker compose up -d
# Server is now available at http://localhost:3000/mcp

# Or from the package itself:
npx -y cornet-mcp@latest --http --port 3000`,
    },
    {
      title: 'Updating docs and components',
      description: 'The published package bundles the docs and component sources. When they change upstream, republish the package — clients pick the new version on their next npx run.',
      lang: 'bash',
      code: `# In the MCP repo:
cd cornet-mcp
git submodule update --remote --recursive
npm version patch
npm publish

# Hosts of a remote URL also restart the server:
docker compose restart web`,
    },
  ],
} satisfies DocPageData
