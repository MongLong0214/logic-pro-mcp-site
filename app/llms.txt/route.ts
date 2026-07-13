import { githubUrl, siteUrl } from "../site-config";
import { productFacts } from "../content/product-facts";

const content = `# Logic Pro MCP

> Open-source local Model Context Protocol server for Claude, Cursor, VS Code, and custom AI agents to compose, control, inspect, and verify work in Logic Pro.

Canonical site: [Logic Pro MCP](${siteUrl})
Source repository: [MongLong0214/logic-pro-mcp](${githubUrl})
Latest release: [Logic Pro MCP releases](${githubUrl}/releases/latest)
License: MIT
Platform: ${productFacts.requirements}

## Install

brew tap MongLong0214/logic-pro-mcp https://github.com/MongLong0214/logic-pro-mcp
brew trust monglong0214/logic-pro-mcp
brew install logic-pro-mcp

Register with Claude Code:

claude mcp add --scope user logic-pro -- LogicProMCP

Verify readiness:

LogicProMCP doctor --profile core --client claude-code

## Installation guides

- [Claude Code](${siteUrl}/install/claude-code)
- [Claude Desktop](${siteUrl}/install/claude-desktop)
- [Cursor](${siteUrl}/install/cursor)
- [VS Code](${siteUrl}/install/vscode)

## Evidence-backed workflows

- [Product guide](${siteUrl}/guides/logic-pro-mcp)
- [Control Logic Pro with Claude](${siteUrl}/guides/control-logic-pro-with-claude)
- [Compose MIDI](${siteUrl}/use-cases/compose-midi)
- [Mixer automation](${siteUrl}/use-cases/mixer-automation)
- [Batch export](${siteUrl}/use-cases/batch-export)

## Primary documentation

- [Setup](${githubUrl}/blob/main/docs/SETUP.md)
- [API](${githubUrl}/blob/main/docs/API.md)
- [Troubleshooting](${githubUrl}/blob/main/docs/TROUBLESHOOTING.md)
- [Security](${githubUrl}/blob/main/SECURITY.md)

Logic Pro MCP is an independent open-source project. Logic Pro is a trademark of Apple Inc.; no affiliation or endorsement is implied.
`;

export function GET() {
  return new Response(content, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
