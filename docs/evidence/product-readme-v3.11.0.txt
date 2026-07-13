Source URL: https://github.com/MongLong0214/logic-pro-mcp/blob/v3.11.0/README.md
Source tag: v3.11.0
Source path: README.md
Source heading: Logic Pro MCP Server for Claude, Cursor, and AI Agents
Accessed UTC: 2026-07-13T05:56:43Z
Expiry policy: on-release-change

Exact excerpts:

# Logic Pro MCP Server for Claude, Cursor, and AI Agents

A local Model Context Protocol (MCP) server that lets Claude Code, Claude Desktop, Cursor, VS Code, and custom AI agents control Logic Pro for AI music production: create tracks, write MIDI, operate transport and mixer state, inspect live project data, and verify results.

Logic Pro MCP Server gives Claude, Cursor, and custom AI agents a structured way to control Logic Pro without brittle keyboard macros. Logic Pro does not ship a first-party API for agentic composition, session setup, mixer operations, or live project readback, so Logic Pro MCP fills that gap by combining **7 native macOS control channels** behind one MCP interface, then wrapping every high-risk operation in explicit state, confirmation, and verification contracts.

The current published stable release is `v3.11.0` (2026-07-10 UTC). It keeps the 10-tool / 18-resource / 11-template runtime surface.

Published GitHub Actions/Homebrew assets are universal (`arm64` + `x86_64`) and do not require Xcode.
