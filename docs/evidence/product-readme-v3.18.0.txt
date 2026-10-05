Source URL: https://github.com/MongLong0214/logic-pro-mcp/blob/v3.18.0/README.md
Source tag: v3.18.0
Source path: README.md
Source headings: Logic Pro MCP Server for Claude, Cursor, and AI Agents; Selected for Anthropic's Claude for Open Source program; Quick Start
Accessed UTC: 2026-10-05T05:45:50Z
Expiry policy: on-release-change
Original source SHA256: 0ec5644d4dc347f3ee3453043c766fc62d49167ab5e769a03e8c8f58d715b91e
Original Git blob SHA: a1ec0d8682035798e1c8c9d8803302ea0d6740e8

Exact excerpts (selected, noncontiguous):
# Logic Pro MCP Server for Claude, Cursor, and AI Agents

A local Model Context Protocol (MCP) server that lets Claude Code, Claude Desktop, Cursor, Codex, VS Code, and other MCP clients control Logic Pro for AI music production: create tracks, write MIDI, operate transport and mixer state, inspect live project data, and verify results.

> ### 🏆 Selected for Anthropic's [Claude for Open Source](https://claude.com/contact-sales/claude-for-oss) program
> Logic Pro MCP has been **officially selected for Anthropic's Claude for Open Source program** — recognition from the makers of Claude that this project is open-source work worth supporting. This server is built with Claude, for Claude-powered agents — and is now officially supported by the program.

Logic Pro MCP Server gives Claude, Cursor, Codex, and other MCP clients a structured way to control Logic Pro without brittle keyboard macros. Logic Pro does not ship a first-party API for agentic composition, session setup, mixer operations, or live project readback, so Logic Pro MCP fills that gap by combining **7 native macOS control channels** (CoreMIDI, Accessibility, AppleScript, CGEvent, MCU, Scripter, MIDI Key Commands — `Sources/LogicProMCP/Channels/Channel.swift`) behind one MCP interface, then wrapping every high-risk operation in explicit state, confirmation, and verification contracts.

The result is not "screen automation with prompts." It is a structured server for DAW agents: tools mutate, resources read, evidence is labeled, and uncertain outcomes stay uncertain instead of being reported as success.

## Quick Start

**Prerequisites**: macOS 14+ for the MCP server, Logic Pro (latest release prioritized — currently **12.3**, which Apple lists as requiring macOS 15.6+; older Logic versions down to the 12.0.1 floor are best-effort), and an MCP client that can launch a stdio server. Published GitHub Actions/Homebrew assets are universal (`arm64` + `x86_64`) and do not require Xcode. Bounce/export uses the bundled native CGEvent helper with no third-party click binary.

The current stable line is `v3.18.0` (cut 2026-09-28 UTC). Its per-release detail — everything added, changed, and fixed since `v3.17.0`, along with every stated limit — is in [CHANGELOG.md](CHANGELOG.md); this README does not restate release history.
