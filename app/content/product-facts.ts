import { githubUrl, siteUrl } from "../site-config.ts";

export const productFacts = {
  name: "Logic Pro MCP",
  version: "3.19.0",
  githubUrl,
  siteUrl,
  setupUrl: `${githubUrl}/blob/v3.19.0/docs/SETUP.md`,
  readmeUrl: `${githubUrl}/blob/v3.19.0/README.md`,
  apiUrl: `${githubUrl}/blob/v3.19.0/docs/API.md`,
  securityUrl: `${githubUrl}/blob/v3.19.0/SECURITY.md`,
  changelogUrl: `${githubUrl}/blob/v3.19.0/CHANGELOG.md`,
  requirements: "macOS 14+ for the server. Logic Pro 13.0 is the declared current version; the supported floor is 12.0.1, on a best-effort basis. Desktop Logic Pro is supported; Creator Studio is recognized, not supported.",
  qualification: "On Logic Pro 13.0 (build 7801), 17 of 138 operations are live-qualified; the other 121 are not, and each is listed with its reason.",
  qualificationUrl: `${githubUrl}/blob/v3.19.0/docs/qualification/NOT_QUALIFIED_ON_LOGIC13.md`,
  locales: "The server tracks ten Logic UI languages. On Logic Pro 13.0 (build 7801), v3.19.0 carries bounded read-only ko-KR evidence, not whole-release or cross-locale qualification; labels not read from a live Logic window are derived from Apple's own strings.",
  installCommand: [
    "brew tap MongLong0214/logic-pro-mcp https://github.com/MongLong0214/logic-pro-mcp",
    "brew trust monglong0214/logic-pro-mcp",
    "brew install logic-pro-mcp",
  ].join("\n"),
  claudeCodeCommand: "claude mcp add --transport stdio --scope user logic-pro -- LogicProMCP",
  permissionCommand: "LogicProMCP --check-permissions",
} as const;

export const doctorCommand = (client: "claude-code" | "claude-desktop" | "cursor" | "vscode") =>
  `LogicProMCP doctor --profile core --client ${client}`;
