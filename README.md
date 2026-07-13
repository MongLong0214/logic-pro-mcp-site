# Logic Pro MCP Site

The official landing page and installation guide for [Logic Pro MCP](https://github.com/MongLong0214/logic-pro-mcp), an open-source Model Context Protocol server that lets Claude, Cursor, VS Code, and custom AI agents compose, control, inspect, and automate Logic Pro on macOS.

**[Open the Logic Pro MCP website](https://logic-pro-mcp.monglong.chatgpt.site/)** · **[View the MCP server source](https://github.com/MongLong0214/logic-pro-mcp)** · **[Read the setup guide](https://github.com/MongLong0214/logic-pro-mcp/blob/main/docs/SETUP.md)**

> This repository contains the website. The installable MCP server, releases, documentation, issues, and contributions live in [`MongLong0214/logic-pro-mcp`](https://github.com/MongLong0214/logic-pro-mcp).

## Install Logic Pro MCP

Install the server with Homebrew:

```bash
brew install logic-pro-mcp
LogicProMCP doctor
```

Then follow the client-specific guide:

- [Claude Code](https://logic-pro-mcp.monglong.chatgpt.site/install/claude-code)
- [Claude Desktop](https://logic-pro-mcp.monglong.chatgpt.site/install/claude-desktop)
- [Cursor](https://logic-pro-mcp.monglong.chatgpt.site/install/cursor)
- [VS Code](https://logic-pro-mcp.monglong.chatgpt.site/install/vscode)

## What this site covers

- Installation and recovery instructions for four MCP clients
- Logic Pro MCP workflows for MIDI composition, mixer automation, and batch export
- Evidence-backed product facts, operational limits, and verification boundaries
- Links to the canonical source, releases, setup, API, security, and troubleshooting documentation

Start with the [complete Logic Pro MCP guide](https://logic-pro-mcp.monglong.chatgpt.site/guides/logic-pro-mcp) or learn how to [control Logic Pro with Claude](https://logic-pro-mcp.monglong.chatgpt.site/guides/control-logic-pro-with-claude).

## SEO and AI discovery

The site provides:

- Canonical URLs, robots directives, Open Graph, and X metadata
- `WebSite`, `WebPage`, `SoftwareApplication`, `BreadcrumbList`, and visible-step `HowTo` structured data
- Public [`robots.txt`](https://logic-pro-mcp.monglong.chatgpt.site/robots.txt), [`sitemap.xml`](https://logic-pro-mcp.monglong.chatgpt.site/sitemap.xml), and [`llms.txt`](https://logic-pro-mcp.monglong.chatgpt.site/llms.txt)
- Nine focused acquisition pages with unique titles, descriptions, headings, and source-backed content
- A privacy-preserving analytics event contract with no collector, storage, identifiers, or network transport configured

Product claims are pinned to reviewed source excerpts under `docs/evidence/`. The verifier checks their hashes, expiry windows, and exact rendered coverage across UI copy, metadata, JSON-LD, and `llms.txt`.

## Local development

Requires Node.js `>=22.13.0`.

```bash
npm install
npm run dev
```

Run the production gates before publishing:

```bash
npm test
npm run typecheck
npm run lint
npm run verify:all
npm run qa:e2e
npm run qa:lighthouse
npm run audit:prod
```

The browser and Lighthouse suites use an isolated, exact-version QA environment so test-only packages do not enter the shipped dependency graph. See [`docs/qa.md`](docs/qa.md) for the complete release matrix.

## Deployment

The site is deployed with OpenAI Sites. `.openai/hosting.json` stores only the Sites project identifier and optional resource bindings; hosted configuration and access policy remain managed by Sites.

## License

The website source is available under the [MIT License](LICENSE). Logic Pro MCP is independently licensed in its [product repository](https://github.com/MongLong0214/logic-pro-mcp/blob/main/LICENSE).
