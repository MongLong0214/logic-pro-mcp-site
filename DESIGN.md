# Logic Pro MCP Design System

## 0. Research Log

- Embedded references: shortlisted Linear, Vercel, and Supabase; picked Soft Skill + Linear for precise dark-surface hierarchy, then replaced its violet identity with an original professional-audio signal palette.
- Product references: reviewed 12 live developer-tool landing pages; retained outcome-first hero, immediate product proof, proof before feature depth, and repeated GitHub conversion.
- Audio references: synthesized ITU/EBU measurement language into original meters, signal paths, and calibration marks without copying Logic Pro interface chrome.
- Lazyweb and Imagen concepts skipped: current live-page research and repository product evidence already resolved the direction; no extra visual-generation loop was needed.

## 1. Atmosphere & Identity

Signal Lab: a quiet, high-trust control room where commands become observable state. The signature is a cyan signal path moving through INPUT, READ, ACT, and VERIFY while amber measurements stay informational.

## 2. Color

| Role | Token | Value | Usage |
|---|---|---|---|
| Canvas | `--ink` | `#080b0c` | Page background |
| Panel | `--panel` | `#101517` | Primary instruments |
| Raised | `--raised` | `#171e20` | Nested surfaces |
| Text | `--text` | `#f3f0e8` | Headlines and primary copy |
| Text secondary | `--text-2` | `#aeb8b5` | Body copy |
| Text muted | `--text-3` | `#77827f` | Metadata |
| Signal | `--cyan` | `#5edfe3` | Links, CTAs, focus, active flow |
| Signal hover | `--cyan-soft` | `#9af4f3` | Interactive hover |
| Measurement | `--amber` | `#f4b942` | Meter readings only |
| Success | `--ok` | `#78d6a4` | Confirmed state |
| Warning | `--warning` | `#ffcf66` | Uncertain state |
| Failure | `--danger` | `#ff7b73` | Failed state |
| Line | `--line` | `rgba(236,244,240,.09)` | Calibration grid |
| Line strong | `--line-strong` | `rgba(236,244,240,.16)` | Boundaries |

Cyan is interactive; amber is measurement-only. Accent colors never replace text labels.

## 3. Typography

- Primary: IBM Plex Sans, system fallback.
- Mono: IBM Plex Mono, monospace fallback.
- Display: `clamp(3rem, 7vw, 5.5rem)`, 500, `.96`, `-.045em`.
- H2: `clamp(2rem, 4vw, 3.5rem)`, 500, `1.02`, `-.035em`.
- H3: `1.25rem`, 500, `1.2`.
- Lead: `1.125rem`, `1.65`.
- Body: `1rem`, `1.65`.
- Label: `.75rem` mono, 500, `1.4`, `.08em`, uppercase.

## 4. Spacing & Layout

- Base unit: 4px; primary rhythm: 8px.
- Tokens: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px.
- Container: 1200px, with 24px desktop and 16px mobile gutters.
- Desktop grid: 12 columns; hero uses 7/5.
- Breakpoints: 640px, 768px, 1024px, 1280px.

## 5. Components

### Signal button
- Link containing a label and directional glyph; primary cyan and secondary dark variants.
- Default, hover lift, active press, and visible focus states; 48px minimum height.

### Instrument panel
- Labeled header, primary reading or workflow, and supporting metadata.
- Hero console, workflow bay, and state row variants; meaning appears in text, never color alone.

### Code block
- Label plus `pre > code`; install, registration, and diagnostics variants.
- Horizontally scrollable at narrow widths; canonical commands stay untranslated.

### Proof datum
- Tabular number plus plain-language label, adjacent in DOM and visual order.

### Specification row
- Numbered row with a monospace system label, title, and factual description.
- Used for architecture stages, tool groups, and trust contracts; collapses to two columns on mobile.

### Document tile
- Descriptive link with document name, audience, and purpose; full tile is the target.
- Default, hover border/surface lift, active, and visible focus states; 48px minimum height.

### Disclosure
- Native `details`/`summary` for limitations and technical depth.
- Summary remains a 48px keyboard and touch target; open state uses tonal shift only.

## 6. Motion & Interaction

- Micro: 140ms, `cubic-bezier(.2,.8,.2,1)` for button and link feedback.
- Emphasis: 700ms, `cubic-bezier(.16,1,.3,1)` for the hero signal trace.
- Only opacity and transform animate. Motion communicates command flow.
- No parallax, cursor glow, marquee, or decorative typing.
- `prefers-reduced-motion: reduce` disables the signal pulse and smooth scrolling.

## 7. Depth & Surface

Mixed tonal-shift and calibration-line strategy. Panels step from ink to panel to raised; lines stay low-contrast. One restrained deep shadow is allowed only on the hero console. No glass blur, neon bloom, or rounded-card soup.

## 8. Accessibility Constraints & Accepted Debt

- Target WCAG 2.2 AA: 4.5:1 body contrast, 3:1 large text and UI, keyboard reachability, visible focus, reduced motion, and 320px reflow.
- Landmarks: skip link, header/nav, one main, footer; one H1 and ordered headings.
- Minimum interactive target: 48px.
- Accepted debt: no localized Korean route in v1; add when the project commits to maintaining translated setup and API copy.
