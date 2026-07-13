import { doctorCommand, productFacts } from "./product-facts.ts";

export const routePaths = [
  "/install/claude-code", "/install/claude-desktop", "/install/cursor", "/install/vscode",
  "/guides/logic-pro-mcp", "/guides/control-logic-pro-with-claude",
  "/use-cases/compose-midi", "/use-cases/mixer-automation", "/use-cases/batch-export",
] as const;
export type RoutePath = (typeof routePaths)[number];

type PageRecord = Readonly<{
  path: RoutePath;
  kind: "install" | "guide" | "use-case";
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  lead: string;
  prerequisites: readonly string[];
  steps: readonly Readonly<{ name: string; text: string; command?: string }>[];
  success: string;
  boundary: string;
  sourceUrl: string;
  related: readonly RoutePath[];
  client?: "claude-code" | "claude-desktop" | "cursor" | "vscode";
}>;

const commonPrerequisites = [productFacts.requirements, "Install the signed universal binary from the project Homebrew tap."] as const;

export const pageRecords = {
  "/install/claude-code": {
    path: "/install/claude-code", kind: "install", client: "claude-code", title: "Install Logic Pro MCP for Claude Code", description: "Register Logic Pro MCP in Claude Code user scope, verify its stdio process, grant the correct macOS permissions, and recover a missing server.", eyebrow: "Claude Code installation", h1: "Install Logic Pro MCP for Claude Code.",
    lead: "Claude Code has a documented CLI registration path. The separator matters: Claude options precede the server name, and the executable follows --.", prerequisites: commonPrerequisites,
    steps: [
      { name: "Install the executable", text: "Add the project tap, approve that tap explicitly, and install the published formula.", command: productFacts.installCommand },
      { name: "Create a user-scoped server", text: "Register one local stdio server for every Claude Code project owned by this macOS user.", command: productFacts.claudeCodeCommand },
      { name: "Inspect Claude's registration", text: "Use Claude Code's management command to confirm the resolved command and scope before troubleshooting Logic.", command: "claude mcp get logic-pro" },
      { name: "Authorize the launcher", text: "Grant Accessibility plus Automation access for Logic Pro and System Events to the process that launches Claude Code, then inspect all four permission probes.", command: productFacts.permissionCommand },
      { name: "Open the MCP status panel", text: "Start Claude Code and run /mcp. The server must appear connected before its tools can be selected.", command: doctorCommand("claude-code") },
      { name: "Recover a stale entry", text: "If the command or scope is wrong, remove the named entry and add it again with options before the server name.", command: "claude mcp remove logic-pro\nclaude mcp add --scope user logic-pro -- LogicProMCP" },
    ],
    success: "Claude Code reports logic-pro as connected in /mcp, while Doctor reports the required core checks for the claude-code launch profile.", boundary: "A passing Terminal probe cannot grant or prove permissions for a different app that later launches the server.", sourceUrl: "https://code.claude.com/docs/en/mcp", related: ["/guides/logic-pro-mcp", "/guides/control-logic-pro-with-claude"],
  },
  "/install/claude-desktop": {
    path: "/install/claude-desktop", kind: "install", client: "claude-desktop", title: "Install Logic Pro MCP for Claude Desktop", description: "Configure Logic Pro MCP as a Claude Desktop local server on macOS, restart the host, inspect logs, and verify launcher-specific permissions.", eyebrow: "Claude Desktop installation", h1: "Install Logic Pro MCP for Claude Desktop.",
    lead: "Claude Desktop reads local server definitions from its macOS configuration file. A full application restart is required after changing that file.", prerequisites: [commonPrerequisites[0], "Quit Claude Desktop before editing its local MCP configuration; preserve any existing mcpServers entries."],
    steps: [
      { name: "Install Logic Pro MCP", text: "Install the universal server first so Claude Desktop can resolve the configured executable.", command: productFacts.installCommand },
      { name: "Locate the Desktop config", text: "Open Settings → Developer → Edit Config, or inspect the documented macOS file directly.", command: "open -a TextEdit \"$HOME/Library/Application Support/Claude/claude_desktop_config.json\"" },
      { name: "Add the stdio definition", text: "Merge this exact mcpServers member into the existing JSON object; do not overwrite unrelated servers.", command: "{\n  \"mcpServers\": {\n    \"logic-pro\": {\n      \"command\": \"LogicProMCP\",\n      \"args\": []\n    }\n  }\n}" },
      { name: "Restart the desktop host", text: "Quit Claude Desktop completely and reopen it so the local process is spawned from the new definition." },
      { name: "Grant Desktop-owned access", text: "Approve Accessibility and both Automation targets for Claude Desktop, the parent application that starts the stdio child.", command: productFacts.permissionCommand },
      { name: "Inspect server logs", text: "If tools are absent, inspect Claude's MCP logs and look for a command-not-found or JSON parse error before changing Logic settings.", command: "open \"$HOME/Library/Logs/Claude\"\nLogicProMCP doctor --profile core --client claude-desktop" },
    ],
    success: "Claude Desktop exposes the logic-pro tools after a full restart, and its MCP log contains no launch or JSON configuration error.", boundary: "Claude Desktop Extensions and raw local JSON are separate installation mechanisms. This route documents the MCP standard's local configuration path, not an .mcpb extension package.", sourceUrl: "https://modelcontextprotocol.io/docs/develop/connect-local-servers", related: ["/guides/logic-pro-mcp", "/guides/control-logic-pro-with-claude"],
  },
  "/install/cursor": {
    path: "/install/cursor", kind: "install", client: "cursor", title: "Install Logic Pro MCP in Cursor", description: "Add Logic Pro MCP to Cursor's global or project MCP JSON, enable its tools, diagnose the stdio launcher, and verify macOS TCC ownership.", eyebrow: "Cursor installation", h1: "Install Logic Pro MCP in Cursor.",
    lead: "Cursor accepts local stdio servers under an mcpServers object. Choose global scope for every workspace or .cursor/mcp.json for one repository.", prerequisites: [commonPrerequisites[0], "Choose one Cursor scope: ~/.cursor/mcp.json globally, or .cursor/mcp.json inside the intended project."],
    steps: [
      { name: "Install the local binary", text: "Use the tagged Homebrew tap and verify installation before opening Cursor's settings.", command: productFacts.installCommand },
      { name: "Choose the JSON location", text: "Create the global file for all projects or the workspace file for a repository-specific server.", command: "mkdir -p \"$HOME/.cursor\"\nopen -a TextEdit \"$HOME/.cursor/mcp.json\"" },
      { name: "Register the Cursor server", text: "Merge this server into the root mcpServers map. Cursor's schema uses mcpServers, command, args, and optional env fields.", command: "{\n  \"mcpServers\": {\n    \"logic-pro\": {\n      \"command\": \"LogicProMCP\",\n      \"args\": []\n    }\n  }\n}" },
      { name: "Enable the exposed tools", text: "Open Cursor Settings → Tools & MCP, confirm the server is enabled, and review the listed tools before allowing agent use." },
      { name: "Grant Cursor's permissions", text: "Because Cursor spawns the child process, authorize Cursor for Accessibility, Logic Pro Automation, System Events Automation, and Input Monitoring as requested.", command: productFacts.permissionCommand },
      { name: "Diagnose a red indicator", text: "Check Tools & MCP for the startup error, verify that the JSON is valid, then run the client-specific readiness profile.", command: doctorCommand("cursor") },
    ],
    success: "Cursor Settings shows logic-pro enabled with its tools available, and Doctor has no unresolved required check for the cursor profile.", boundary: "Enabling a tool in Cursor proves discovery, not that Logic accepted a later UI mutation or that its state was read back.", sourceUrl: "https://docs.cursor.com/context/model-context-protocol", related: ["/guides/logic-pro-mcp", "/guides/control-logic-pro-with-claude"],
  },
  "/install/vscode": {
    path: "/install/vscode", kind: "install", client: "vscode", title: "Install Logic Pro MCP in VS Code", description: "Configure Logic Pro MCP in VS Code's user profile or workspace mcp.json, accept trust deliberately, inspect output, and verify macOS permissions.", eyebrow: "VS Code installation", h1: "Install Logic Pro MCP in VS Code.",
    lead: "VS Code uses a servers object rather than mcpServers. User configuration follows the active profile; workspace configuration lives at .vscode/mcp.json.", prerequisites: [commonPrerequisites[0], "Use a VS Code release with MCP server support and decide whether the registration belongs to the user profile or current workspace."],
    steps: [
      { name: "Install the server package", text: "Install Logic Pro MCP from its versioned Homebrew distribution before editing the editor profile.", command: productFacts.installCommand },
      { name: "Open the intended MCP file", text: "Run MCP: Open User Configuration for profile scope, or create .vscode/mcp.json for workspace scope." },
      { name: "Add the VS Code stdio server", text: "Merge this object into the configuration. The documented VS Code root key is servers and a local process can declare type stdio.", command: "{\n  \"servers\": {\n    \"logic-pro\": {\n      \"type\": \"stdio\",\n      \"command\": \"LogicProMCP\",\n      \"args\": []\n    }\n  }\n}" },
      { name: "Review workspace trust", text: "Start the server only after reviewing the command. VS Code asks for confirmation before it runs a workspace-defined MCP server." },
      { name: "Authorize VS Code as parent", text: "Grant the editor—not merely Terminal—the TCC capabilities required by the child process, then rerun the permission probe.", command: productFacts.permissionCommand },
      { name: "Read the server output", text: "Run MCP: List Servers, select logic-pro, and choose Show Output. Resolve executable lookup or protocol errors there before testing Logic.", command: doctorCommand("vscode") },
    ],
    success: "MCP: List Servers reports logic-pro running, Show Output has no startup error, and the vscode Doctor profile resolves all required local checks.", boundary: "A workspace can be untrusted or use a different profile than expected. A working user-profile entry does not prove a separate workspace definition was approved.", sourceUrl: "https://code.visualstudio.com/docs/copilot/chat/mcp-servers", related: ["/guides/logic-pro-mcp", "/guides/control-logic-pro-with-claude"],
  },
  "/guides/logic-pro-mcp": {
    path: "/guides/logic-pro-mcp", kind: "guide", title: "Logic Pro MCP Server Guide", description: "Evaluate, install, and verify the Logic Pro MCP server with its real requirements, control surface, and limitations.", eyebrow: "Evaluation guide", h1: "A practical guide to Logic Pro MCP.",
    lead: "Logic Pro MCP is a local stdio server. It exposes a compact action surface and read-only resources while keeping unsupported readback explicit.", prerequisites: commonPrerequisites,
    steps: [{ name: "Choose a client", text: "Use a client that can launch a local stdio MCP server." }, { name: "Install and diagnose", text: "Install from Homebrew, register LogicProMCP, grant permissions, and run Doctor." }, { name: "Read before writing", text: "Inspect project, track, transport, and readiness state before any mutation." }, { name: "Treat the envelope as evidence", text: "Confirmed, uncertain, and failed outcomes have different operational meaning." }],
    success: "The client lists the MCP surface and Doctor identifies the exact ready and blocked capabilities.", boundary: "Discovery does not prove live Logic Pro compatibility. UI-driven operations can fail closed when Logic's state is unreadable.", sourceUrl: productFacts.apiUrl, related: ["/install/claude-code", "/use-cases/compose-midi", "/use-cases/batch-export"],
  },
  "/guides/control-logic-pro-with-claude": {
    path: "/guides/control-logic-pro-with-claude", kind: "guide", title: "Control Logic Pro with Claude Safely", description: "A read-before-write Claude workflow for Logic Pro with explicit targets, confirmation gates, readback, and recovery.", eyebrow: "Safe control workflow", h1: "Control Logic Pro with Claude, without guessing.",
    lead: "The reliable pattern is inspect, target, act, verify. It prevents a plausible assistant response from being mistaken for a confirmed Logic Pro change.", prerequisites: [commonPrerequisites[0], "Complete the matching Claude client install guide and open the intended Logic project."],
    steps: [{ name: "Inspect", text: "Read the live project identity and current transport or mixer state." }, { name: "Name the target", text: "Use explicit track, slot, project path, and command values instead of conversational references." }, { name: "Act behind the gate", text: "Provide required confirmation only after checking the requested target." }, { name: "Verify independently", text: "Require post-write readback or accept the returned uncertain/failed state." }],
    success: "The response identifies the target and returns the product's typed evidence envelope; high-risk writes only claim success after supported readback.", boundary: "Claude cannot make an unsupported Logic Pro readback reliable. State B is uncertainty, not success.", sourceUrl: productFacts.securityUrl, related: ["/install/claude-code", "/use-cases/mixer-automation", "/use-cases/batch-export"],
  },
  "/use-cases/compose-midi": {
    path: "/use-cases/compose-midi", kind: "use-case", title: "Compose MIDI in Logic Pro with MCP", description: "Use the shipped logic_midi and logic_tracks surfaces to create MIDI material while respecting send-only readback limits.", eyebrow: "MIDI workflow", h1: "Compose MIDI with an honest verification boundary.",
    lead: "MIDI messages can be sent precisely, but a send-only success is not proof that Logic created an audible region. Verified workflows use import or region readback where available.", prerequisites: [commonPrerequisites[0], "Create or open a project and identify the target software-instrument track."],
    steps: [{ name: "Inspect the target", text: "Read tracks and project identity before selecting a destination." }, { name: "Create or import", text: "Use logic_tracks and logic_midi with explicit note, channel, duration, and port values." }, { name: "Wait for each result", text: "Do not chain another import until the preceding operation returns its evidence envelope." }, { name: "Verify the region", text: "Use project region readback when the operation supports it; otherwise retain the State B limitation." }],
    success: "A verified import reports the created region; send-only operations report State B with the no-readback reason.", boundary: "GM Device or External MIDI lanes can be silent during bounce and are not accepted as audible evidence.", sourceUrl: productFacts.apiUrl, related: ["/guides/logic-pro-mcp", "/use-cases/batch-export"],
  },
  "/use-cases/mixer-automation": {
    path: "/use-cases/mixer-automation", kind: "use-case", title: "Verified Mixer Automation with Logic Pro MCP", description: "Inspect plug-ins and use guarded duplicate-project apply-back with project identity and parameter readback.", eyebrow: "Mixer workflow", h1: "Automate the mixer only where readback exists.",
    lead: "The verified plug-in path is logic_plugins. It checks project identity, physical insert slot, plug-in identity, and supported parameter readback before State A.", prerequisites: [commonPrerequisites[0], "Duplicate the project and record its exact path before applying a mixer write."],
    steps: [{ name: "Inventory", text: "Call logic_plugins get_inventory and require a complete read." }, { name: "Confirm identity", text: "Pass the duplicate project path as project_expected_path." }, { name: "Apply", text: "Use insert_verified or set_param_verified only for supported stock plug-ins and parameters." }, { name: "Read back", text: "Accept State A only when the requested physical slot or parameter matches after the write." }],
    success: "The verified response reports the expected project, target slot or parameter, and matching post-write observation.", boundary: "set_param_verified currently supports Compressor threshold readback; arbitrary parameters fail closed.", sourceUrl: productFacts.securityUrl, related: ["/guides/control-logic-pro-with-claude", "/install/claude-code"],
  },
  "/use-cases/batch-export": {
    path: "/use-cases/batch-export", kind: "use-case", title: "Batch Export and Bounce with Logic Pro MCP", description: "Plan, run, resume, and verify Logic Pro export workflows without claiming more than the native Bounce and artifact checks prove.", eyebrow: "Export workflow", h1: "Plan and verify Logic Pro exports.",
    lead: "Export planning is read-only. Execution re-checks project identity and blockers, opens Logic's native Bounce dialog, and verifies artifacts only after Logic writes them.", prerequisites: [commonPrerequisites[0], "Save the project and resolve external-MIDI bounce-readiness blockers."],
    steps: [{ name: "Audit", text: "Run project audit and treat external MIDI region risks as blockers." }, { name: "Plan", text: "Use export_plan to inspect intended jobs without writing files." }, { name: "Execute deliberately", text: "Use export_run or export_resume with explicit confirmation and the expected project identity." }, { name: "Verify artifacts", text: "Use logic_audio to inspect existence, format, duration, silence, and clipping." }],
    success: "The native Bounce dialog is observed and produced files are independently checked; a dialog-open result alone is not an exported artifact.", boundary: "The user completes Bounce settings and destination in Logic. No workflow can claim an artifact before file verification.", sourceUrl: productFacts.apiUrl, related: ["/guides/control-logic-pro-with-claude", "/use-cases/compose-midi"],
  },
} as const satisfies Record<RoutePath, PageRecord>;
