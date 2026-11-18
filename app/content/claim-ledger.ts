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

const accessedAt = "2026-10-24T19:37:10Z";
// Product-doc snapshots are re-taken on every release change; client docs keep their 90-day window.
const productAccessedAt = "2026-11-18T05:58:41Z";
const taggedSetup = {
  sourceType: "tagged-source",
  sourceUrl: productFacts.setupUrl,
  sourceRef: "v3.19.0:docs/SETUP.md#Install",
  sourceHeading: "Install",
  evidenceFile: "docs/evidence/product-setup-v3.19.0.txt",
  sourceSha256: "8d5cffa35ffecc44617a269f9e9c12839238958b8474b9fb86dba8b7f8309c8a",
  accessedAt: productAccessedAt,
  expiryPolicy: "on-release-change",
  expiresAt: null,
  sourceExcerpt: "brew install logic-pro-mcp",
} as const satisfies EvidenceSource;
const taggedApi = {
  sourceType: "tagged-source", sourceUrl: productFacts.apiUrl,
  sourceRef: "v3.19.0:docs/API.md#logic_midi", sourceHeading: "logic_midi",
  evidenceFile: "docs/evidence/product-api-v3.19.0.txt",
  sourceSha256: "76894885b77611ba6c5360291c2678282c2d93204a146d89acdbd43c5a93d8c8",
  accessedAt: productAccessedAt, expiryPolicy: "on-release-change", expiresAt: null,
  sourceExcerpt: "Send-only success responses return an Honest Contract State B JSON envelope because CoreMIDI/MMC writes have no deterministic readback:",
} as const satisfies EvidenceSource;
const taggedSecurity = {
  sourceType: "tagged-source", sourceUrl: productFacts.securityUrl,
  sourceRef: "v3.19.0:SECURITY.md#Verified-plugin-apply-back-gate", sourceHeading: "Verified plugin apply-back gate",
  evidenceFile: "docs/evidence/product-security-v3.19.0.txt",
  sourceSha256: "daf55145e0e1b2212c98480613a0bae519e34533d38def777a3ecf7931987e95",
  accessedAt: productAccessedAt, expiryPolicy: "on-release-change", expiresAt: null,
  sourceExcerpt: "State A is emitted only after post-write inventory readback observes the requested plugin at the requested slot.",
} as const satisfies EvidenceSource;
const taggedReadme = {
  sourceType: "tagged-source", sourceUrl: productFacts.readmeUrl,
  sourceRef: "v3.19.0:README.md#logic-pro-mcp-server-for-claude-cursor-and-ai-agents",
  sourceHeading: "Logic Pro MCP Server for Claude, Cursor, and AI Agents",
  evidenceFile: "docs/evidence/product-readme-v3.19.0.txt",
  sourceSha256: "5925262cb3602b92355f60af656a9501be43c226e6bbd298dbce7b6195cdcc27",
  accessedAt: productAccessedAt, expiryPolicy: "on-release-change", expiresAt: null,
  sourceExcerpt: "A local Model Context Protocol (MCP) server that lets Claude Code, Claude Desktop, Cursor, Codex, VS Code, and other MCP clients control Logic Pro",
} as const satisfies EvidenceSource;

const taggedQualification = {
  sourceType: "tagged-source", sourceUrl: productFacts.qualificationUrl,
  sourceRef: "v3.19.0:docs/qualification/NOT_QUALIFIED_ON_LOGIC13.md#Operations-not-qualified-on-Logic-Pro-13-0-7801",
  sourceHeading: "Operations not qualified on Logic Pro 13.0 (7801)",
  evidenceFile: "docs/evidence/product-qualification-v3.19.0.txt",
  sourceSha256: "9dfa7969d061217dbbbe46ac8a21d26d6f892e7a23d226dd54e8150860d27eee",
  accessedAt: productAccessedAt, expiryPolicy: "on-release-change", expiresAt: null,
  sourceExcerpt: "Nothing listed here is reported as qualified.",
} as const satisfies EvidenceSource;

const officialSources = {
  "claude-code": {
    sourceType: "official-client-doc", sourceUrl: "https://code.claude.com/docs/en/mcp",
    sourceRef: "https://code.claude.com/docs/en/mcp#option-3-add-a-local-stdio-server", sourceHeading: "Option 3: Add a local stdio server",
    evidenceFile: "docs/evidence/official-claude-code-2026-10-24.txt", sourceSha256: "0f386d32a1b698cd2c008a8d1510e715bd39b6d483d685c0b85a56dcc9765a37",
    accessedAt, expiryPolicy: "90-days", expiresAt: "2027-01-22T19:37:10Z",
    sourceExcerpt: "claude mcp add [options] <name> -- <command> [args...]",
  },
  "claude-desktop": {
    sourceType: "official-client-doc", sourceUrl: "https://modelcontextprotocol.io/docs/develop/connect-local-servers",
    sourceRef: "https://modelcontextprotocol.io/docs/develop/connect-local-servers#restart-claude-desktop", sourceHeading: "Restart Claude Desktop",
    evidenceFile: "docs/evidence/official-claude-desktop-2026-10-24.txt", sourceSha256: "3c5213fa5a7f1a17eb3cc79e9495abfffc4cebb08764879c9cc471867ab8574e",
    accessedAt, expiryPolicy: "90-days", expiresAt: "2027-01-22T19:37:10Z",
    sourceExcerpt: "completely quit Claude Desktop and restart it.",
  },
  cursor: {
    sourceType: "official-client-doc", sourceUrl: "https://cursor.com/docs/mcp",
    sourceRef: "https://cursor.com/docs/mcp#configuration-locations", sourceHeading: "Configuration locations",
    evidenceFile: "docs/evidence/official-cursor-2026-10-24.txt", sourceSha256: "43721b45b2111107d6231e01cb78f1cf58bd9ac32c1915910f9874a6e77368b8",
    accessedAt, expiryPolicy: "90-days", expiresAt: "2027-01-22T19:37:10Z",
    sourceExcerpt: "Create `.cursor/mcp.json` in your project for project-specific tools.",
  },
  vscode: {
    sourceType: "official-client-doc", sourceUrl: "https://code.visualstudio.com/docs/agents/reference/mcp-configuration",
    sourceRef: "https://code.visualstudio.com/docs/agents/reference/mcp-configuration#commands", sourceHeading: "Commands",
    evidenceFile: "docs/evidence/official-vscode-2026-10-24.txt", sourceSha256: "9d2b9fe3259bba8947ddebd640151b79d17f07b00258aeee8cae93a70c9495ed",
    accessedAt, expiryPolicy: "90-days", expiresAt: "2027-01-22T19:37:10Z",
    sourceExcerpt: "MCP: Open User Configuration",
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
  claim({ key: "requirements", subject: "runtime.requirements", exactText: productFacts.requirements, source: { ...taggedSetup, sourceRef: "v3.19.0:docs/SETUP.md#Requirements", sourceHeading: "Requirements", sourceExcerpt: "works down to the 12.0.1 floor on a best-effort basis" }, surfaces: ["ui", "llms"], routes: ["/guides/logic-pro-mcp", "/llms.txt"], scope: "installation", limitation: "Logic Pro versions below the declared current 13.0 are best-effort, down to the 12.0.1 floor." }),
  claim({ key: "homebrew-install", subject: "install.homebrew.command", exactText: "brew install logic-pro-mcp", source: taggedSetup, surfaces: ["ui", "llms"], routes: ["/", "/llms.txt"], scope: "installation", limitation: "Homebrew 6 requires explicit trust for third-party taps." }),
  claim({ key: "claude-code-register", subject: "client.claude-code.registration", exactText: productFacts.claudeCodeCommand, source: officialSources["claude-code"], surfaces: ["ui", "llms"], routes: ["/install/claude-code", "/llms.txt"], scope: "Claude Code registration", limitation: "Options precede the server name; -- separates the executable." }),
  claim({ key: "midi-send-only", subject: "logic_midi.send-only.outcome", exactText: "send-only operations report State B with the no-readback reason.", source: taggedApi, surfaces: ["ui"], routes: ["/use-cases/compose-midi"], scope: "logic_midi", limitation: "A successful send is not proof that a region or audible result exists." }),
  claim({ key: "plugin-applyback", subject: "logic_plugins.state-a", exactText: "The verified response reports the expected project, target slot or parameter, and matching post-write observation.", source: taggedSecurity, surfaces: ["ui"], routes: ["/use-cases/mixer-automation"], scope: "logic_plugins", limitation: "Only supported stock-plugin parameters can produce verified writes." }),
  claim({ key: "logic13-qualification", subject: "logic13.qualification", exactText: productFacts.qualification, source: taggedQualification, surfaces: ["ui", "llms"], routes: ["/", "/llms.txt"], scope: "Logic Pro 13.0 live qualification", limitation: "Evidence from earlier Logic versions does not carry over to 13.0; unlisted operations are not claimed as qualified." }),
  claim({ key: "locale-measurement", subject: "locales.measurement", exactText: productFacts.locales, source: { ...taggedReadme, sourceRef: "v3.19.0:README.md#locales", sourceHeading: "Locales", sourceExcerpt: "v3.19.0 carries bounded ko-KR read-only evidence on build 7801, not whole-release or cross-locale qualification" }, surfaces: ["ui"], routes: ["/"], scope: "UI language coverage", limitation: "Derived labels are Apple's own strings, a strong signal but not a live observation." }),
  claim({ key: "binaries-unsigned", subject: "release.signing", exactText: "Release binaries are not Apple-signed or notarized, so a reinstalled binary may need its macOS grants again.", source: { ...taggedSecurity, sourceRef: "v3.19.0:SECURITY.md#Deployment-security", sourceHeading: "Deployment security", sourceExcerpt: "published without an Apple signing or notarization" }, surfaces: ["ui"], routes: ["/guides/logic-pro-mcp"], scope: "installation", limitation: "Grants belong to the launcher app and the exact binary." }),
  claim({ key: "oss-program", subject: "program.claude-for-open-source", exactText: "Officially selected for Anthropic's Claude for Open Source program.", source: { ...taggedReadme, sourceRef: "v3.19.0:README.md#selected-for-anthropic-s-claude-for-open-source-program", sourceHeading: "Selected for Anthropic's Claude for Open Source program", sourceExcerpt: "Logic Pro MCP has been **officially selected for Anthropic's Claude for Open Source program**" }, surfaces: ["ui"], routes: ["/"], scope: "project recognition", limitation: "Program selection recognizes the open-source project; it is not an Apple or Logic Pro endorsement." }),
  claim({ key: "bounce-boundary", subject: "logic_project.bounce.success", exactText: "Standalone bounce is unsupported; export_run is the automated export path. Unbound stem results remain State B; export_resume is limited to known-path artifacts.", source: { ...taggedApi, sourceRef: "v3.19.0:docs/API.md#logic_project", sourceHeading: "logic_project", sourceExcerpt: "Standalone `bounce` is unsupported: it terminates before opening UI because that route cannot finish an artifact unattended. The registered `export_run` workflow is the automated artifact-producing path." }, surfaces: ["ui"], routes: ["/use-cases/batch-export"], scope: "logic_project.bounce", limitation: "Export needs a destination that Logic's Export panel exposes." }),
] as const;

export const claimLedger = [...coreClaims, ...identityClaims, ...installClaims, ...workflowClaims] as const satisfies readonly ClaimEvidence[];

export const declaredMaterialClaims = {
  metadata: Object.fromEntries(Object.values(pageRecords).map((record) => [record.path, [pageClaimKey(record.path, "title"), pageClaimKey(record.path, "description")]])),
  jsonld: Object.fromEntries(Object.values(pageRecords).map((record) => [record.path, [pageClaimKey(record.path, "title"), pageClaimKey(record.path, "description"), ...(record.kind === "install" ? [pageClaimKey(record.path, "h1")] : [])]])),
  llms: { "/llms.txt": ["requirements", "homebrew-install", "claude-code-register"] },
} as const;
