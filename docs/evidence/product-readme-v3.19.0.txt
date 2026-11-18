Source URL: https://github.com/MongLong0214/logic-pro-mcp/blob/v3.19.0/README.md
Source tag: v3.19.0
Source path: README.md
Source headings: Logic Pro MCP Server for Claude, Cursor, and AI Agents; Selected for Anthropic's Claude for Open Source program; At a Glance; Locales; Quick Start
Accessed UTC: 2026-11-18T05:58:41Z
Expiry policy: on-release-change
Original source SHA256: e56643c8f77bf24e5cb4dd93f311986cd801ff64f41380eb5c236bc8b6e63005
Original Git blob SHA: 24619a57669dd6a566c07391efd3534e6f6fcb96
Snapshot note: taken from the published tag v3.19.0 (tag object e251a78538e2ba9d901f8b1154d3b53a142431de, commit 409af686b4a088b6f2b0db7308678ee2e92b4a67).

Exact excerpts (selected, noncontiguous):
# Logic Pro MCP Server for Claude, Cursor, and AI Agents

[![MCP Toplist](https://mcptoplist.com/badge/io.github.MongLong0214%2Flogic-pro-mcp.svg)](https://mcptoplist.com/server/io.github.MongLong0214%2Flogic-pro-mcp)

A local Model Context Protocol (MCP) server that lets Claude Code, Claude Desktop, Cursor, Codex, VS Code, and other MCP clients control Logic Pro for AI music production: create tracks, write MIDI, operate transport and mixer state, inspect live project data, and verify results.

[Install](#1-install) · [Watch demo](docs/media/logic-pro-mcp-demo.mp4) · [What it controls](#what-it-controls)

> ### 🏆 Selected for Anthropic's [Claude for Open Source](https://claude.com/contact-sales/claude-for-oss) program
> Logic Pro MCP has been **officially selected for Anthropic's Claude for Open Source program** — recognition from the makers of Claude that this project is open-source work worth supporting. This server is built with Claude, for Claude-powered agents — and is now officially supported by the program.

| Locales Logic ships | **10** — de-DE en-US es-ES fr-FR it-IT ja-JP ko-KR pt-BR zh-CN zh-TW | `python3 -c "import json; print(json.load(open('docs/locale/ui-labels.json'))['supported_locales'])"` |

| Supported Logic Pro | **Latest Logic Pro first** — desktop **Logic Pro** (`com.apple.logic10`, `/Applications/Logic Pro.app`). Apple Creator Studio **Logic Pro Creator Studio** (`com.apple.mobilelogic`, `/Applications/Logic Pro Creator Studio.app`) is recognised, not supported. Desktop **Logic Pro** is the only variant the release qualification matrix covers (`shipVariants = [.desktop]`), and the only one this release supports. Without `LOGIC_PRO_BUNDLE_ID` the server can still select Creator Studio: it targets the frontmost Logic; failing that a running one, then an installed one, desktop first in both. So a Creator Studio that is frontmost, or is the only Logic running, becomes the target, with no qualification evidence behind it. Set `LOGIC_PRO_BUNDLE_ID=com.apple.logic10` to keep the server on desktop Logic Pro. Logic Pro 13.0 is the current first-class target; v3.19.0 carries bounded ko-KR read-only evidence on build 7801, not whole-release or cross-locale qualification. The broader live evidence remains on Logic 12.3 build 6674; older versions down to the 12.0.1 floor are best-effort |

## Locales

Logic Pro ships ten UI locales, and this server tracks all ten as the default scope (not just en/ko): `de-DE`, `en-US`, `es-ES`, `fr-FR`, `it-IT`, `ja-JP`, `ko-KR`, `pt-BR`, `zh-CN`, `zh-TW`. UI-string matching (menu items, header labels, dialog buttons) lives in [`docs/locale/ui-labels.json`](docs/locale/ui-labels.json), the canon index every locale-sensitive locator derives from.

Each of the 203 canon labels carries a per-locale `coverage`: `measured` (read from a live, running Logic window and recorded with the host, date, and AX role/attribute), `derived` (computed from Apple's own `.strings` tables by `Scripts/derive_label_variants.py`, not read from a live window), `unmeasured`, or `retired` (one label, `headerPanHint`, superseded by `sliderPanHint` and kept in the canon with its reason). Measured counts per locale, out of 203 canon labels (`python3 -c "import json,collections; d=json.load(open('docs/locale/ui-labels.json')); c=collections.Counter(); [c.update([(l,v) for l,v in e['coverage'].items() if v=='measured']) for e in d['labels'].values()]; print(c)"`):

| Locale | Measured | Derived | Unmeasured | Retired |
|--------|----------|---------|------------|---------|
| en-US | 45 | 156 | 1 | 1 |
| ko-KR | 50 | 147 | 5 | 1 |
| ja-JP | 37 | 154 | 11 | 1 |
| de-DE | 44 | 144 | 14 | 1 |
| es-ES | 7 | 177 | 18 | 1 |
| fr-FR | 6 | 175 | 21 | 1 |
| it-IT | 6 | 175 | 21 | 1 |
| pt-BR | 5 | 178 | 19 | 1 |
| zh-CN | 7 | 169 | 26 | 1 |
| zh-TW | 6 | 166 | 30 | 1 |

A `derived` label has not been read from a running Logic in that locale; it is Apple's own string for that key, which is a strong signal but not a live observation. The roadmap ([`docs/roadmap/README.md`](docs/roadmap/README.md)) tracks per-feature live locale campaigns (mixer routing graph, MCU bank walk, record-arm key-command setup, and others) as they are driven against real Logic sessions in each language.

**Prerequisites**: macOS 14+ for the MCP server, desktop Logic Pro (the current first-class target is **13.0**; v3.19.0 has bounded build-7801 ko-KR read-only evidence rather than whole-release or cross-locale qualification, while the broader live corpus remains on 12.3 build 6674), and an MCP client that can launch a stdio server. Older Logic versions down to the 12.0.1 floor are best-effort. Published GitHub Actions/Homebrew assets are universal (`arm64` + `x86_64`) and do not require Xcode. Bounce/export uses the bundled native CGEvent helper with no third-party click binary.
