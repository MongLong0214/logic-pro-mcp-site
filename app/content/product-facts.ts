import { githubUrl, siteUrl } from "../site-config.ts";

export const productFacts = {
  name: "Logic Pro MCP",
  version: "3.18.0",
  githubUrl,
  siteUrl,
  setupUrl: `${githubUrl}/blob/v3.18.0/docs/SETUP.md`,
  readmeUrl: `${githubUrl}/blob/v3.18.0/README.md`,
  apiUrl: `${githubUrl}/blob/v3.18.0/docs/API.md`,
  securityUrl: `${githubUrl}/blob/v3.18.0/SECURITY.md`,
  changelogUrl: `${githubUrl}/blob/v3.18.0/CHANGELOG.md`,
  requirements: "macOS 14+ for the server. Logic Pro 12.3 requires macOS 15.6+; older Logic versions down to 12.0.1 are best-effort. Desktop Logic Pro is supported; Creator Studio is recognized, not supported.",
  installCommand: [
    "brew tap MongLong0214/logic-pro-mcp https://github.com/MongLong0214/logic-pro-mcp",
    "brew trust monglong0214/logic-pro-mcp",
    "brew install logic-pro-mcp",
  ].join("\n"),
  claudeCodeCommand: "claude mcp add --scope user logic-pro -- LogicProMCP",
  permissionCommand: "LogicProMCP --check-permissions",
} as const;

export const doctorCommand = (client: "claude-code" | "claude-desktop" | "cursor" | "vscode") =>
  `LogicProMCP doctor --profile core --client ${client}`;
