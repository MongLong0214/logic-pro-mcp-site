import { githubUrl, siteUrl } from "../site-config";
import { productFacts } from "../content/product-facts";

const content = `# Logic Pro MCP — Full Reference

> Open-source local Model Context Protocol server for Claude, Cursor, VS Code, and custom AI agents to compose, control, inspect, and verify work in Logic Pro. This file expands on \`/llms.txt\` with the tool and resource surface, the safety contract, and permission requirements.

Canonical site: ${siteUrl}
Source repository: ${githubUrl}
Published release: [v${productFacts.version}](${githubUrl}/releases/tag/v${productFacts.version})
License: MIT
Platform: ${productFacts.requirements}

## What this is

Logic Pro has no first-party API for agentic composition, session setup, mixer operations, or live project readback. Logic Pro MCP combines native macOS control channels (MIDI, CoreMIDI, AppleScript, Accessibility, CGEvent, Scripter, MIDI Key Commands, and MCU) behind one MCP interface. A channel router selects the strongest channel available for each operation.

## Safety contract

Every mutating tool call returns one of three states instead of assuming success:

- Confirmed: the server wrote to Logic and independently read the result back.
- Uncertain: the server attempted the action but could not verify the result.
- Failed: the action did not land. Safe to retry only when the response says so.

Read-only tools and resources return plain JSON without this envelope. Registered operations reject unknown parameter keys at the runtime boundary before cache access or dispatch.

## Tools (10)

| Tool | Purpose |
|------|---------|
| \`logic_transport\` | play, stop, record, locate, tempo, cycle, metronome, count-in, autopunch |
| \`logic_tracks\` | create, select, rename, delete, duplicate, arm/arm_only, mute, solo, automation, set instrument, library scans |
| \`logic_mixer\` | volume, pan, master volume, mixer strip reads, guarded legacy plugin insertion |
| \`logic_plugins\` | verified stock-plugin inventory, exact-slot insertion, verified parameter write/readback |
| \`logic_midi\` | send notes/CC/SysEx/MMC, import MIDI, step input, create/list virtual ports |
| \`logic_edit\` | undo, redo, cut, copy, paste, quantize, split, join, bounce-in-place, normalize, duplicate |
| \`logic_navigate\` | bars, markers, zoom, view toggles |
| \`logic_project\` | new, open, save, save_as, close, bounce, launch/quit, is_running, regions, export plan/run/resume, audit, cleanup |
| \`logic_audio\` | read-only audio artifact analysis |
| \`logic_system\` | health, permissions, command help, arm key-command auto-setup, trace list/read/clear, saga preflight/execute/status/cancel |

## Resources (18 static, 12 templates)

| Resource | Returns |
|----------|---------|
| \`logic://system/health\` | channel readiness, permissions, manual-validation state |
| \`logic://transport/state\` | tempo, position, cycle, play/record state |
| \`logic://tracks\` | track list with source/freshness metadata |
| \`logic://mixer\` | mixer strips, plugin slots, data-source labels |
| \`logic://markers\` | marker list when Logic exposes it |
| \`logic://project/info\` | project name/path, tempo, sample rate, track count |
| \`logic://project/audit\` | read-only project/session audit |
| \`logic://project/cleanup-plan\` | read-only cleanup plan |
| \`logic://midi/ports\` | CoreMIDI ports visible to the process |
| \`logic://mcu/state\` | MCU registration/feedback state |
| \`logic://library/inventory\` | cached Logic library inventory |
| \`logic://stock-plugins\` | stock plugin catalog |
| \`logic://stock-plugins/census\` | catalog validation summary |
| \`logic://stock-plugins/capabilities\` | writable/readable plugin capability matrix |
| \`logic://stock-instruments\` | stock instrument catalog |
| \`logic://session-players\` | Session Player catalog |
| \`logic://workflow-skills\` | workflow recipe catalog |
| \`logic://workflow-skills/schema\` | workflow recipe schema |

Resource templates include \`logic://system/operations\` (read-only operation catalog), \`logic://tracks/{index}\`, \`logic://tracks/{index}/regions\`, \`logic://mixer/{strip}\`, \`logic://stock-plugins/{id}\`, \`logic://stock-plugins/search?query={query}\`, \`logic://stock-instruments/{id}\`, \`logic://stock-instruments/search?query={query}\`, \`logic://session-players/{id}\`, \`logic://workflow-plans/session?prompt={prompt}\`, \`logic://workflow-skills/{id}\`, and \`logic://workflow-skills/search?query={query}\`.

Full parameter-level reference: ${productFacts.apiUrl}

## Permissions (macOS TCC)

Logic Pro MCP runs as a child process of the MCP host application (Claude Desktop, Claude Code, Cursor, or VS Code). macOS ties Accessibility and Automation approval to that parent application, not to the \`LogicProMCP\` binary itself. Both Automation targets — Logic Pro and System Events — must be approved for the host application. Run \`LogicProMCP doctor\` after granting permissions to confirm each channel reports ready.

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

- [Setup](${productFacts.setupUrl})
- [API reference](${productFacts.apiUrl})
- [Troubleshooting](${githubUrl}/blob/v${productFacts.version}/docs/TROUBLESHOOTING.md)
- [Security](${productFacts.securityUrl})

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
