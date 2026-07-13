const content = `# Logic Pro MCP

> Open-source local Model Context Protocol server for Claude, Cursor, VS Code, and custom AI agents to compose, control, inspect, and verify work in Logic Pro.

Canonical site: https://logic-pro-mcp.monglong.chatgpt.site
Source repository: https://github.com/MongLong0214/logic-pro-mcp
Latest release: https://github.com/MongLong0214/logic-pro-mcp/releases/latest
License: MIT
Platform: macOS 14 or later; Logic Pro 12.3 is the actively validated target.

## Install

brew tap MongLong0214/logic-pro-mcp https://github.com/MongLong0214/logic-pro-mcp
brew trust monglong0214/logic-pro-mcp
brew install logic-pro-mcp

Register with Claude Code:

claude mcp add --scope user logic-pro -- LogicProMCP

Verify readiness:

LogicProMCP doctor --profile core --client claude-code

## Primary documentation

- Setup: https://github.com/MongLong0214/logic-pro-mcp/blob/main/docs/SETUP.md
- API: https://github.com/MongLong0214/logic-pro-mcp/blob/main/docs/API.md
- Troubleshooting: https://github.com/MongLong0214/logic-pro-mcp/blob/main/docs/TROUBLESHOOTING.md
- Security: https://github.com/MongLong0214/logic-pro-mcp/blob/main/SECURITY.md

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
