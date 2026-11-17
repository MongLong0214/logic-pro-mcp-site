Source URL: https://github.com/MongLong0214/logic-pro-mcp/blob/v3.19.0/README.md
Source tag: v3.19.0
Source path: README.md
Source headings: Logic Pro MCP; At a Glance; What is live-qualified on Logic Pro 13.0; Locales
Accessed UTC: 2026-11-17T23:20:00Z
Expiry policy: on-release-change
Original source SHA256: b3fc4f9099b82fc01a1c3cdb61c091491af920c9489eb67462feab790da9cd6c
Original Git blob SHA: 5d0d1f568bdec9673599683e9161bfcce547b494
Snapshot note: taken from the v3.19.0 source candidate (commit a3f7537522beb016411a6755d14f3990ef6dd1f9) before the v3.19.0 tag existed; re-take after tagging.

Exact excerpts (selected, noncontiguous):
# Logic Pro MCP

A local [Model Context Protocol](https://modelcontextprotocol.io) server that lets an MCP client (Claude Code, Claude Desktop, Cursor, Codex, VS Code and others) drive Logic Pro on macOS: transport, tracks, mixer, MIDI, plug-ins, navigation, project lifecycle and audio-file analysis. It talks to the client over stdio, and every write is checked against what Logic reports back.

## At a Glance

| Item | Value |
|------|-------|
| Server version | 3.19.0 (`ServerConfig.serverVersion`) |
| Release state | **Source candidate**: `v3.19.0`. **Current published stable**: [`v3.18.0`](https://github.com/MongLong0214/logic-pro-mcp/releases/tag/v3.18.0) |
| Logic Pro | Desktop Logic Pro (`com.apple.logic10`). The declared current version is **13.0** (build 7801, `docs/canon/MANIFEST.json`); the supported floor is 12.0.1 (`minimumSupportedLogicVersion`), best effort. Apple Creator Studio's Logic Pro is recognized, not supported |
| macOS | 14 or later (`Package.swift`: `.macOS(.v14)`) |
| Architecture | Release package is universal (`arm64` and `x86_64`, `LogicProMCP-macOS-universal.tar.gz`) |
| Source build | Swift 6 toolchain (`swift-tools-version: 6.0`) |
| Surface | All 10 tools, 19 resources, 12 templates; 138 registered operations |
| Read resources | 19 static resources: health, transport, Tempo List, tracks, mixer, markers, project info/audit/cleanup plan, MIDI ports, MCU state, library inventory, stock plugins and instruments, Session Players, workflow skills |
| Resource templates | 12 templates: operation catalog, per-track, region, mixer strip, plug-in and instrument lookup/search, Session Player, session plan, workflow lookup/search |

### What is live-qualified on Logic Pro 13.0

The live gate credits an operation only if the real handler ran, an independent readback was compared, and (for a write) the restore was read back. On Logic Pro 13.0 (build 7801), 121 of the 138 operations are **not** qualified; nothing on that list is reported as qualified. The list, with the reason for each, is [docs/qualification/NOT_QUALIFIED_ON_LOGIC13.md](docs/qualification/NOT_QUALIFIED_ON_LOGIC13.md), generated from [docs/qualification/not-qualified-logic13.json](docs/qualification/not-qualified-logic13.json).

The 17 operations not on the list are: transport play, stop, pause, tempo, cycle, metronome, count-in and `goto_position`; `navigate.goto_bar`; track rename, mute, solo and arm; mixer volume and pan; `midi.list_ports`; and `system.export_support_bundle`. Everything else is listed as not qualified, for reasons such as: the readback is fetched but never compared (read-only analysis and inspection), only a zero-write probe has run (project lifecycle, export, track creation, Saga execution, record), a recipe is refused because Logic 13 behaves differently (undo/redo, marker operations, track select, rewind/fast-forward), or setup needs an owner decision. `project.bounce` and `transport.set_cycle_range` are unsupported by contract. Evidence from earlier Logic versions does not carry over to 13.0.

## Locales

The server tracks ten Logic UI languages: `en-US`, `ko-KR`, `ja-JP`, `de-DE`, `es-ES`, `fr-FR`, `it-IT`, `pt-BR`, `zh-CN`, `zh-TW`. UI-string matching lives in [docs/locale/ui-labels.json](docs/locale/ui-labels.json), the canon every locale-sensitive locator derives from. Each label records, per locale, whether it was `measured` from a live Logic window or `derived` from Apple's own string tables.

Live measurement on Logic Pro 13.0 is in progress (PR #1590 adds the Logic version axis and `ko-KR`). Until it lands, the committed live evidence on 13.0 is bounded read-only `ko-KR` evidence, and the other locales currently rely on canon-derived labels: Apple's own string for that key, a strong signal but not a live observation. The roadmap ([docs/roadmap/README.md](docs/roadmap/README.md)) tracks per-feature locale campaigns.
