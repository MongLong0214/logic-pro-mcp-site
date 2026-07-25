Source URL: https://github.com/MongLong0214/logic-pro-mcp/blob/v3.13.0/README.md
Source tag: v3.13.0
Source path: README.md
Source headings: Logic Pro MCP Server for Claude, Cursor, and AI Agents; Selected for Anthropic's Claude for Open Source program
Accessed UTC: 2026-07-25T10:27:40Z
Expiry policy: on-release-change

Exact excerpts:
# Logic Pro MCP Server for Claude, Cursor, and AI Agents

A local Model Context Protocol (MCP) server that lets Claude Code, Claude Desktop, Cursor, VS Code, and custom AI agents control Logic Pro for AI music production: create tracks, write MIDI, operate transport and mixer state, inspect live project data, and verify results.

Logic Pro MCP Server gives Claude, Cursor, and custom AI agents a structured way to control Logic Pro without brittle keyboard macros. Logic Pro does not ship a first-party API for agentic composition, session setup, mixer operations, or live project readback, so Logic Pro MCP fills that gap by combining **7 native macOS control channels** behind one MCP interface, then wrapping every high-risk operation in explicit state, confirmation, and verification contracts.

The current published stable release is `v3.13.0` (2026-07-22 UTC). It ships ADHOC-signed universal artifacts when Apple Developer ID credentials are absent, plus `SHA256SUMS.txt` and `RELEASE-METADATA.json` for pinned installs. The runtime surface becomes 10 tools / 18 resources / 12 resource templates — the generated read-only operation catalog `logic://system/operations` ships as the 12th template. Headlines: the coordinate-free actuation campaign (mute/solo/arm, app-menu items, region selection use AX actions and key commands with observed-effect verification; the external click-tool fallback is retired), consent-gated record-arm key-command auto-setup (`system.setup_arm_key`), a locale-neutral modal classifier (localized plugin editors and the Drummer Smart Controls pane no longer block unrelated operations, while genuine modals keep blocking), ADR kernel behavior on by default (session-stable `target_ref`, operation-contract registry with strict params, verified-mutation saga preflight, operation trace), SecureFD-hardened trace-clear/support-bundle paths with a bounded saga lifecycle deadline, and the Homebrew packaging fix restoring bounce/export (`logic_variants.py` now ships — #427). It keeps the v3.9.0 MCP capability additions (`transport.toggle_autopunch`, resource subscriptions, workflow prompts, per-tool `outputSchema` / `structuredContent`), the v3.9.2 verified-plugin closed-window fix, and v3.10.0 desktop/Creator Studio targeting. The two v3.9.0 live-only surfaces (MIDI export read-back, Channel EQ verified params) remain honestly deferred with spike evidence.

> ### 🏆 Selected for Anthropic's [Claude for Open Source](https://claude.com/contact-sales/claude-for-oss) program
> Logic Pro MCP has been **officially selected for Anthropic's Claude for Open Source program** — recognition from the makers of Claude that this project is open-source work worth supporting. This server is built with Claude, for Claude-powered agents — and is now officially supported by the program.

**Prerequisites**: macOS 14+ for the MCP server, Logic Pro (latest release prioritized — currently **12.3**, which Apple lists as requiring macOS 15.6+; older Logic versions down to the 12.0.1 floor are best-effort), and an MCP client that can launch a stdio server. Published GitHub Actions/Homebrew assets are universal (`arm64` + `x86_64`) and do not require Xcode. Bounce/export uses the bundled native CGEvent helper with no third-party click binary.
