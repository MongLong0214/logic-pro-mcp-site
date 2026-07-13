import { pageRecords, type RoutePath } from "./page-records.ts";
import { productFacts } from "./product-facts.ts";

export type ClaimSurface = "ui" | "metadata" | "jsonld" | "llms";
export type ClaimEvidence = Readonly<{
  key: string;
  subject: string;
  value: string;
  exactText: string;
  sourceExcerpt: string;
  sourceType: "tagged-source" | "official-client-doc";
  sourceUrl: string;
  sourceRef: string;
  sourceHeading: string;
  evidenceFile: `docs/evidence/${string}.txt`;
  sourceSha256: string;
  accessedAt: string;
  expiryPolicy: "on-release-change" | "90-days";
  expiresAt: string | null;
  surfaces: readonly ClaimSurface[];
  routes: readonly string[];
  scope: string;
  limitation: string;
  owner: "MongLong0214";
}>;

type EvidenceSource = Pick<ClaimEvidence,
  "sourceType" | "sourceUrl" | "sourceRef" | "sourceHeading" | "evidenceFile" |
  "sourceSha256" | "accessedAt" | "expiryPolicy" | "expiresAt" | "sourceExcerpt"
>;

const accessedAt = "2026-07-13T05:56:43Z";
const taggedSetup = {
  sourceType: "tagged-source",
  sourceUrl: productFacts.setupUrl,
  sourceRef: "v3.11.0:docs/SETUP.md#Install",
  sourceHeading: "Install",
  evidenceFile: "docs/evidence/product-setup-v3.11.0.txt",
  sourceSha256: "fb43f4f323eeeb01cccd003ebdf1d6c0491eaa8c1c43882357c456c634cbff79",
  accessedAt,
  expiryPolicy: "on-release-change",
  expiresAt: null,
  sourceExcerpt: "brew install logic-pro-mcp",
} as const satisfies EvidenceSource;
const taggedApi = {
  sourceType: "tagged-source", sourceUrl: productFacts.apiUrl,
  sourceRef: "v3.11.0:docs/API.md#logic_midi", sourceHeading: "logic_midi",
  evidenceFile: "docs/evidence/product-api-v3.11.0.txt",
  sourceSha256: "f77d995a3d1ee8b8078b62f10c94511aa9016fc2c66a88b351151e6bf1d0f82d",
  accessedAt, expiryPolicy: "on-release-change", expiresAt: null,
  sourceExcerpt: "Send-only success responses return an Honest Contract State B JSON envelope because CoreMIDI/MMC writes have no deterministic readback:",
} as const satisfies EvidenceSource;
const taggedSecurity = {
  sourceType: "tagged-source", sourceUrl: productFacts.securityUrl,
  sourceRef: "v3.11.0:SECURITY.md#Verified-plugin-apply-back-gate", sourceHeading: "Verified plugin apply-back gate",
  evidenceFile: "docs/evidence/product-security-v3.11.0.txt",
  sourceSha256: "bacf70274462124fc1395a27198ad15f861e66ace9e43dac5aed5e7817941aa0",
  accessedAt, expiryPolicy: "on-release-change", expiresAt: null,
  sourceExcerpt: "State A is emitted only after post-write inventory readback observes the requested plugin at the requested slot.",
} as const satisfies EvidenceSource;
const taggedReadme = {
  sourceType: "tagged-source", sourceUrl: productFacts.readmeUrl,
  sourceRef: "v3.11.0:README.md#logic-pro-mcp-server-for-claude-cursor-and-ai-agents",
  sourceHeading: "Logic Pro MCP Server for Claude, Cursor, and AI Agents",
  evidenceFile: "docs/evidence/product-readme-v3.11.0.txt",
  sourceSha256: "cc38138527b11f33e49078f3343acaf1abd46a75632945003d6c404c1c01ce4f",
  accessedAt, expiryPolicy: "on-release-change", expiresAt: null,
  sourceExcerpt: "A local Model Context Protocol (MCP) server that lets Claude Code, Claude Desktop, Cursor, VS Code, and custom AI agents control Logic Pro",
} as const satisfies EvidenceSource;

const officialSources = {
  "claude-code": {
    sourceType: "official-client-doc", sourceUrl: "https://code.claude.com/docs/en/mcp",
    sourceRef: "https://code.claude.com/docs/en/mcp#option-3-add-a-local-stdio-server", sourceHeading: "Option 3: Add a local stdio server",
    evidenceFile: "docs/evidence/official-claude-code-2026-07-13.txt", sourceSha256: "08fc1705283faa43668b03d9c8e5f442f1cd3dfdcb058a2ffaac1d73f85a7a09",
    accessedAt, expiryPolicy: "90-days", expiresAt: "2026-10-11T05:56:43Z",
    sourceExcerpt: "claude mcp add [options] <name> -- <command> [args...]",
  },
  "claude-desktop": {
    sourceType: "official-client-doc", sourceUrl: "https://modelcontextprotocol.io/docs/develop/connect-local-servers",
    sourceRef: "https://modelcontextprotocol.io/docs/develop/connect-local-servers#restart-claude-desktop", sourceHeading: "Restart Claude Desktop",
    evidenceFile: "docs/evidence/official-claude-desktop-2026-07-13.txt", sourceSha256: "b25a8c88c8426043ee1f24053e83e9b07ff768383885ba841591e514d0bdeda4",
    accessedAt, expiryPolicy: "90-days", expiresAt: "2026-10-11T05:56:43Z",
    sourceExcerpt: "After saving the configuration file, completely quit Claude Desktop and restart it.",
  },
  cursor: {
    sourceType: "official-client-doc", sourceUrl: "https://docs.cursor.com/context/model-context-protocol",
    sourceRef: "https://docs.cursor.com/context/model-context-protocol#configuration", sourceHeading: "Configuration",
    evidenceFile: "docs/evidence/official-cursor-2026-07-13.txt", sourceSha256: "eaccf90321153ad54cf472a91221c3f55b7be61cb059a0d66aa485ac31464840",
    accessedAt, expiryPolicy: "90-days", expiresAt: "2026-10-11T05:56:43Z",
    sourceExcerpt: "Create `.cursor/mcp.json` in your project for project-specific tools, or `~/.cursor/mcp.json` for tools available across projects.",
  },
  vscode: {
    sourceType: "official-client-doc", sourceUrl: "https://code.visualstudio.com/docs/agent-customization/mcp-servers",
    sourceRef: "https://code.visualstudio.com/docs/agent-customization/mcp-servers#configure-the-mcpjson-file", sourceHeading: "Configure the mcp.json file",
    evidenceFile: "docs/evidence/official-vscode-2026-07-13.txt", sourceSha256: "bac88e1e2c7ada8e6a375120d16be950e97259440703c8f70ffcb96f7a058f0f",
    accessedAt, expiryPolicy: "90-days", expiresAt: "2026-10-11T05:56:43Z",
    sourceExcerpt: "For workspace configuration, create `.vscode/mcp.json`.",
  },
} as const satisfies Record<"claude-code" | "claude-desktop" | "cursor" | "vscode", EvidenceSource>;

function claim(input: Readonly<{
  key: string; subject: string; exactText: string; source: EvidenceSource;
  surfaces: readonly ClaimSurface[]; routes: readonly string[]; scope: string; limitation: string;
}>): ClaimEvidence {
  return { ...input.source, key: input.key, subject: input.subject, value: input.exactText,
    exactText: input.exactText, surfaces: input.surfaces, routes: input.routes,
    scope: input.scope, limitation: input.limitation, owner: "MongLong0214" };
}

export function installClaimKey(path: RoutePath, field: "lead" | "success" | "boundary" | `prerequisite.${number}` | `step.${number}.text` | `step.${number}.command`): string {
  return `install.${path.split("/").at(-1)}.${field}`;
}

export function pageClaimKey(path: RoutePath, field: "title" | "description" | "h1" | "lead" | "success" | "boundary" | `prerequisite.${number}` | `step.${number}.name` | `step.${number}.text`): string {
  return `page.${path.slice(1).replaceAll("/", ".")}.${field}`;
}

function contentSource(path: RoutePath): EvidenceSource {
  if (path === "/guides/logic-pro-mcp") return taggedReadme;
  if (path === "/guides/control-logic-pro-with-claude" || path === "/use-cases/mixer-automation") return taggedSecurity;
  return taggedApi;
}

const identityClaims = Object.values(pageRecords).flatMap((record) => {
  const source = record.kind === "install" ? officialSources[record.client] : taggedReadme;
  return [
    claim({ key: pageClaimKey(record.path, "title"), subject: `${record.path}.title`, exactText: record.title, source, surfaces: ["metadata", "jsonld"], routes: [record.path], scope: "page identity", limitation: record.boundary }),
    claim({ key: pageClaimKey(record.path, "description"), subject: `${record.path}.description`, exactText: record.description, source, surfaces: ["metadata", "jsonld"], routes: [record.path], scope: "page summary", limitation: record.boundary }),
    claim({ key: pageClaimKey(record.path, "h1"), subject: `${record.path}.h1`, exactText: record.h1, source, surfaces: record.kind === "install" ? ["ui", "jsonld"] : ["ui"], routes: [record.path], scope: "page heading", limitation: record.boundary }),
  ];
});

const installClaims = Object.values(pageRecords).flatMap((record): readonly ClaimEvidence[] => {
  if (record.kind !== "install") return [];
  const source = officialSources[record.client];
  const textClaims = [
    claim({ key: installClaimKey(record.path, "lead"), subject: `${record.client}.lead`, exactText: record.lead, source, surfaces: ["ui"], routes: [record.path], scope: `${record.client} workflow`, limitation: record.boundary }),
    ...record.prerequisites.map((text, index) => claim({ key: installClaimKey(record.path, `prerequisite.${index}`), subject: `${record.client}.prerequisite.${index}`, exactText: text, source: index === 0 ? taggedSetup : source, surfaces: ["ui"], routes: [record.path], scope: `${record.client} prerequisites`, limitation: record.boundary })),
    ...record.steps.flatMap((step, index) => [
      claim({ key: pageClaimKey(record.path, `step.${index}.name`), subject: `${record.client}.step.${index}.name`, exactText: step.name, source: index === 0 ? taggedSetup : source, surfaces: ["ui", "jsonld"], routes: [record.path], scope: `${record.client} workflow step ${index + 1}`, limitation: record.boundary }),
      claim({ key: installClaimKey(record.path, `step.${index}.text`), subject: `${record.client}.step.${index}.text`, exactText: step.text, source: index === 0 || step.text.includes("Accessibility") || step.text.includes("permissions") ? taggedSetup : source, surfaces: ["ui", "jsonld"], routes: [record.path], scope: `${record.client} workflow step ${index + 1}`, limitation: record.boundary }),
      ...("command" in step && step.command ? [claim({ key: installClaimKey(record.path, `step.${index}.command`), subject: `${record.client}.step.${index}.command`, exactText: step.command, source: index === 0 || step.command.includes("--check-permissions") || step.command.includes("doctor") ? taggedSetup : source, surfaces: ["ui"], routes: [record.path], scope: `${record.client} command step ${index + 1}`, limitation: record.boundary })] : []),
    ]),
    claim({ key: installClaimKey(record.path, "success"), subject: `${record.client}.success`, exactText: record.success, source, surfaces: ["ui"], routes: [record.path], scope: `${record.client} observable success`, limitation: record.boundary }),
    claim({ key: installClaimKey(record.path, "boundary"), subject: `${record.client}.boundary`, exactText: record.boundary, source, surfaces: ["ui"], routes: [record.path], scope: `${record.client} boundary`, limitation: record.boundary }),
  ];
  return textClaims;
});

const workflowClaims = Object.values(pageRecords).flatMap((record): readonly ClaimEvidence[] => {
  if (record.kind === "install") return [];
  const source = contentSource(record.path);
  return [
    claim({ key: pageClaimKey(record.path, "lead"), subject: `${record.path}.lead`, exactText: record.lead, source, surfaces: ["ui"], routes: [record.path], scope: "workflow overview", limitation: record.boundary }),
    ...record.prerequisites.map((text, index) => claim({ key: pageClaimKey(record.path, `prerequisite.${index}`), subject: `${record.path}.prerequisite.${index}`, exactText: text, source: index === 0 ? taggedSetup : source, surfaces: ["ui"], routes: [record.path], scope: "workflow prerequisite", limitation: record.boundary })),
    ...record.steps.flatMap((step, index) => [
      claim({ key: pageClaimKey(record.path, `step.${index}.name`), subject: `${record.path}.step.${index}.name`, exactText: step.name, source, surfaces: ["ui"], routes: [record.path], scope: "workflow step", limitation: record.boundary }),
      claim({ key: pageClaimKey(record.path, `step.${index}.text`), subject: `${record.path}.step.${index}.text`, exactText: step.text, source, surfaces: ["ui"], routes: [record.path], scope: "workflow step", limitation: record.boundary }),
    ]),
    claim({ key: pageClaimKey(record.path, "success"), subject: `${record.path}.success`, exactText: record.success, source, surfaces: ["ui"], routes: [record.path], scope: "observable success", limitation: record.boundary }),
    claim({ key: pageClaimKey(record.path, "boundary"), subject: `${record.path}.boundary`, exactText: record.boundary, source, surfaces: ["ui"], routes: [record.path], scope: "workflow limitation", limitation: record.boundary }),
  ];
});

const coreClaims = [
  claim({ key: "requirements", subject: "runtime.requirements", exactText: productFacts.requirements, source: taggedSetup, surfaces: ["ui", "llms"], routes: ["/guides/logic-pro-mcp", "/llms.txt"], scope: "installation", limitation: "Logic Pro versions below 12.3 are best-effort." }),
  claim({ key: "homebrew-install", subject: "install.homebrew.command", exactText: "brew install logic-pro-mcp", source: taggedSetup, surfaces: ["ui", "llms"], routes: ["/", "/llms.txt"], scope: "installation", limitation: "Homebrew 6 requires explicit trust for third-party taps." }),
  claim({ key: "claude-code-register", subject: "client.claude-code.registration", exactText: productFacts.claudeCodeCommand, source: officialSources["claude-code"], surfaces: ["ui", "llms"], routes: ["/install/claude-code", "/llms.txt"], scope: "Claude Code registration", limitation: "Options precede the server name; -- separates the executable." }),
  claim({ key: "midi-send-only", subject: "logic_midi.send-only.outcome", exactText: "send-only operations report State B with the no-readback reason.", source: taggedApi, surfaces: ["ui"], routes: ["/use-cases/compose-midi"], scope: "logic_midi", limitation: "A successful send is not proof that a region or audible result exists." }),
  claim({ key: "plugin-applyback", subject: "logic_plugins.state-a", exactText: "The verified response reports the expected project, target slot or parameter, and matching post-write observation.", source: taggedSecurity, surfaces: ["ui"], routes: ["/use-cases/mixer-automation"], scope: "logic_plugins", limitation: "Only supported stock-plugin parameters can produce verified writes." }),
  claim({ key: "bounce-boundary", subject: "logic_project.bounce.success", exactText: "The native Bounce dialog is observed and produced files are independently checked; a dialog-open result alone is not an exported artifact.", source: { ...taggedApi, sourceRef: "v3.11.0:docs/API.md#logic_project", sourceHeading: "logic_project", sourceExcerpt: "Exported artifacts require independent file verification." }, surfaces: ["ui"], routes: ["/use-cases/batch-export"], scope: "logic_project.bounce", limitation: "The user completes Bounce settings and destination in Logic." }),
] as const;

export const claimLedger = [...coreClaims, ...identityClaims, ...installClaims, ...workflowClaims] as const satisfies readonly ClaimEvidence[];

export const declaredMaterialClaims = {
  metadata: Object.fromEntries(Object.values(pageRecords).map((record) => [record.path, [pageClaimKey(record.path, "title"), pageClaimKey(record.path, "description")]])),
  jsonld: Object.fromEntries(Object.values(pageRecords).map((record) => [record.path, [pageClaimKey(record.path, "title"), pageClaimKey(record.path, "description"), ...(record.kind === "install" ? [pageClaimKey(record.path, "h1")] : [])]])),
  llms: { "/llms.txt": ["requirements", "homebrew-install", "claude-code-register"] },
} as const;
