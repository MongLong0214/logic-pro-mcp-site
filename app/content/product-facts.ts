import { githubUrl, siteUrl } from "../site-config.ts";

export const productFacts = {
  name: "Logic Pro MCP",
  version: "3.11.0",
  githubUrl,
  siteUrl,
  setupUrl: `${githubUrl}/blob/v3.11.0/docs/SETUP.md`,
  readmeUrl: `${githubUrl}/blob/v3.11.0/README.md`,
  apiUrl: `${githubUrl}/blob/v3.11.0/docs/API.md`,
  securityUrl: `${githubUrl}/blob/v3.11.0/SECURITY.md`,
  changelogUrl: `${githubUrl}/blob/v3.11.0/CHANGELOG.md`,
  requirements: "macOS 14 or later; Logic Pro 12.3 is actively validated, with 12.0.1 and later best-effort.",
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
