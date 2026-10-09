# Logic Pro MCP Design System

## Current: Session Desk

The deployed design is Session Desk, introduced in [PR #6](https://github.com/MongLong0214/logic-pro-mcp-site/pull/6), with the keyboard-focus correction in [PR #7](https://github.com/MongLong0214/logic-pro-mcp-site/pull/7). The earlier Signal Lab specification below is retained as history, not the current palette, layout or accessibility audit. Use `app/session.css` for the landing page and `app/globals.css` for shared typography and documentation surfaces; `app/layout.tsx` loads both.

### Identity and surfaces

An editorial session sheet frames a real archived Logic recording. Paper is the default surface; dark green is reserved for the recording and interactive workflow bench. The accent marks active controls rather than pretending an agent is connected.

| Token | Value | Role |
|---|---|---|
| `--desk-paper` | `#f1f0eb` | Page and document background |
| `--desk-ink` | `#1c211f` | Primary text and installation CTA |
| `--desk-muted` | `#58615d` | Supporting text |
| `--desk-acid` | `#d4ed77` | Active controls, spectrum and dark-surface focus |
| `--desk-line` | `#ccd0c6` | Paper dividers |

The player uses `#1d2320`; the workflow bench uses `#202721`. Neither is a universal card treatment. Paper focus outlines use `#51721b`; controls within the player and bench use the acid accent. Preserve the 3px outline and 5px offset, and evaluate focus against the adjacent surface rather than only the selected button fill.

### Typography and layout

The actual sans stack is Helvetica Neue, Helvetica, Arial, sans-serif. The monospace stack is SFMono-Regular, Consolas, Liberation Mono, monospace; the `--font-plex-*` variable names do not indicate downloaded Plex fonts.

The desktop hero uses `clamp(3.75rem, 7.9vw, 8.5rem)`, weight 550, tracking `-.07em` and line-height `.97`. Section headings use `clamp(2.75rem, 5vw, 5rem)`, weight 500 and line-height `1.04`. Do not apply the historical optical-tracking table to these selectors.

Landing sections have a 1500px maximum width and 4vw horizontal padding. At 900px, the hero, workflow bench and installation columns become single-column; at 600px, navigation wraps, playback controls reflow and section spacing becomes 72px with 5vw gutters. Documentation uses its own 650px breakpoint. These are the implemented layouts, not a requirement to add more breakpoints.

### Interaction and honest feedback

- The player fetches the same-origin recording only after activation. Play, pause, seek and mute operate on that recording; the spectrum comes from its actual Web Audio data. Optional analysis failure must not block ordinary playback. Keep loading/error recovery and the original-recording link.
- Compose, Mix and Deliver change the rendered workflow. A/B/C buttons explain the outcome contract; the example remains explicitly not live. Supported browsers use native View Transitions, with ordinary state updates as the reduced-motion/unsupported fallback.
- The installation desk switches among four actual client configurations. Copy feedback resets when the client changes, and VS Code retains its distinct `servers` shape.
- Release, development and recording provenance use native disclosures. Product guidance stays pinned to the published release; an archived recording or ongoing main change is not release qualification.

Scroll-linked motion applies only to section headings on widths above 900px, behind CSS feature detection and the no-preference motion setting. It translates by 20px without hiding the content. Reduced motion disables transitions, animations and smooth scrolling. Hover scale and blur on the play overlay are implemented exceptions to the historical Signal Lab motion rules, not permission to add decorative cursor effects or simulated telemetry.

### Verification scope

Use the existing tests and QA instructions in `docs/qa.md`; no additional release gate is introduced here. PR #7 records the actual keyboard-focus correction and 90 passing Chromium checks. That receipt does not establish physical Safari/iOS behavior, human audible listening, a fully unclipped focus perimeter or video-overlay pixel contrast. The historical measurements below belong to the earlier design and must not be reused as Session Desk results.

## Historical: Signal Lab

The following specification is preserved from the earlier design. Its constraints and measured results describe that implementation, not the current Session Desk.

## 0. Research Log

- Embedded references: shortlisted Linear, Vercel, and Supabase; picked Soft Skill + Linear for precise dark-surface hierarchy, then replaced its violet identity with an original professional-audio signal palette.
- Product references: reviewed 12 live developer-tool landing pages; retained outcome-first hero, immediate product proof, proof before feature depth, and repeated GitHub conversion.
- Audio references: synthesized ITU/EBU measurement language into original meters, signal paths, and calibration marks without copying Logic Pro interface chrome.
- Lazyweb and Imagen concepts skipped: current live-page research and repository product evidence already resolved the direction; no extra visual-generation loop was needed.
- **v2 reference pass (measured, not recalled)**: computed styles were extracted from live Apple product pages rendering SF Pro. That yielded the optical tracking curve in §3, semibold (600) display weight, line-height ratios of 1.05–1.19, the `#000 → #1d1d1f → #2a2a2d → #333336` dark ladder, pill CTA geometry, and 80–100ms micro-interaction timings. Values were adopted as mechanics, not as a palette — the Signal Lab identity, the cyan/amber split, and the pinned `#080b0c` canvas are unchanged. Where the reference and this product disagree, §7 records the deviation and why.

## 1. Atmosphere & Identity

Signal Lab: a quiet, high-trust control room where commands become observable state. The signature is a cyan signal path moving through INPUT, READ, ACT, and VERIFY while amber measurements stay informational.

## 2. Color

| Role | Token | Value | Usage |
|---|---|---|---|
| Canvas | `--ink` | `#080b0c` | Page background |
| Panel | `--panel` | `#161c1e` | Primary instruments |
| Raised | `--raised` | `#1e2528` | Nested surfaces and hover |
| Sunken | `--sunken` | `#040708` | Inset terminals and code blocks |
| Text | `--text` | `#f5f2ea` | Headlines and primary copy |
| Text secondary | `--text-2` | `#bcc5c2` | Body copy |
| Text muted | `--text-3` | `#8b9491` | Metadata |
| Signal | `--cyan` | `#5edfe3` | Links, CTAs, focus, active flow |
| Signal hover | `--cyan-soft` | `#9af4f3` | Interactive hover |
| Measurement | `--amber` | `#f4b942` | Meter readings only |
| Success | `--ok` | `#78d6a4` | Confirmed state |
| Warning | `--warning` | `#ffcf66` | Uncertain state |
| Failure | `--danger` | `#ff7b73` | Failed state |
| Line | `--line` | `rgba(236,244,240,.085)` | Calibration grid |
| Line strong | `--line-strong` | `rgba(236,244,240,.15)` | Boundaries |
| Edge | `--edge` | `rgba(255,255,255,.05)` | 1px inner top highlight on raised surfaces |

Cyan is interactive; amber is measurement-only. Accent colors never replace text labels.

## 3. Typography

- Primary: native UI sans stack (`ui-sans-serif`, San Francisco, Segoe UI) for zero-request rendering.
- Mono: native UI monospace stack (SF Mono, Consolas, Liberation Mono) for zero-request rendering.
Type follows an **optical tracking curve**: tracking tightens as size grows, crossing zero at 40px. Reference values were measured from live Apple product pages rendering SF Pro Display, then adopted as tokens (`--tr-*`):

| Size | Tracking | Line-height | Weight |
|---|---|---|---|
| 76px | `-.015em` | 1.05 | 600 |
| 60px | `-.008em` | 1.06 | 600 |
| 48px | `-.003em` | 1.083 | 600 |
| 40px | `0` | 1.08–1.10 | 600 |
| 32px | `+.004em` | 1.125 | 600 |
| 28px | `+.007em` | 1.14 | 600 |
| 24px | `+.009em` | 1.167 | 600 |
| 21px | `+.011em` | 1.19–1.43 | 500 |
| ≤19px (text face) | `-.019em` | 1.5–1.65 | 400 |

- Display: `clamp(2.5rem, 5.6vw, 4.75rem)`, 600, max 20ch.
- H2: `clamp(1.75rem, 3.4vw, 3rem)`, 600. H3: `1.5rem`, 600. Lead: `1.3125rem`, 500.
- Because the sizes are fluid, tracking is re-selected at 1100px and 700px so the rendered px size always sits on the curve. Headings never drop below `1.05` line-height.
- Mono is metrically fixed: `code`, `pre`, and label classes reset `letter-spacing` so the sans curve cannot leak in.
- Headings use `text-wrap: balance`; body copy uses `text-wrap: pretty`.
- Measured values use mono with `font-variant-numeric: tabular-nums`.
- `font-optical-sizing: auto` and `font-synthesis-weight: none` — never let the browser fake semibold.

## 4. Spacing & Layout

- Base unit: 4px; primary rhythm: 8px.
- Tokens: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px.
- Container: 1260px (`--shell`), with 24px desktop and 16px mobile gutters.
- Section rhythm is fluid: `clamp(80px, 9vw, 136px)` vertical padding.
- Desktop grid: 12 columns; hero uses 7/5. Every fractional track is `minmax(0, Nfr)` so mono content cannot widen a column.
- Section heading: 7fr/4fr, zero row gap, `align-items: baseline` so the lead's first line shares a baseline with the headline's. The eyebrow occupies row 1 of the left column only.
- Breakpoints: 640px, 700px, 768px, 900px, 1024px, 1100px. 700px and 1100px exist only to keep the type on the tracking curve.
- `body` uses `overflow-x: clip` (not `hidden`) so the hero bloom cannot introduce page-level horizontal scroll while the header stays sticky.

## 5. Components

### Signal button
- Link containing a label and directional glyph; primary cyan and secondary dark variants.
- **Pill geometry** (`--r-pill`), 17px label. Pills are reserved for elements whose purpose is to *act* — buttons, the nav CTA, the copy control, source links, and the skip link. Everything whose purpose is to *state* stays rectilinear at 8–16px, including a linked element whose content is a claim rather than a command (see Recognition chip). Panels, code blocks, and instrument cells are always rectilinear. This is the one place the design language rounds fully, so the boundary must not blur.
- Default, hover lift, active press, and visible focus states; 52px height (48px for the nav CTA).

### Recognition chip
- A single 48px link carrying one ledger-backed claim plus an arrow to its primary source.
- Rectilinear (`--r-sm`), not a pill: it states a fact rather than issuing a command, and a pill here would compete with the hero CTAs directly above it.
- The whole chip is the target so the claim text and its source share one hit area; a small inline link inside a padded chip cannot reach 48px.
- The claim sentence must stay a single text node — the claim verifier strips tags, so inline markup inside the sentence would break the exact-text match.

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

### FAQ disclosure
- Reuses the native disclosure interaction for indexable question-and-answer content.
- Questions remain visible in the server-rendered document and map one-to-one to the FAQ structured data.

### Evidence article
- Uses the shared article hero, numbered workflow, observable-success panel, explicit limitation panel, primary-source links, and related-route grid.
- Copy controls expose idle, copied, denied, hover, active, keyboard-focus, and live-status states without changing the command text.
- At 768px and below, evidence panels and related routes collapse to one column; command text scrolls without widening the page.

## 6. Motion & Interaction

- Micro: 100ms for button, link, and colour feedback — `linear` for colour, `cubic-bezier(.25,.46,.45,.94)` for transform. Measured Apple micro-interactions run 80–100ms and are frequently linear; a longer ramp on a button reads as lag.
- Surface: 250ms for row hover washes and panel tonal shifts.
- **Scroll-linked entrance**: content rises and settles as it enters the viewport, driven by CSS `animation-timeline: view()` — no JavaScript, no observers, nothing added to the CSP. Each reveal completes inside the `entry` phase, so anything fully on screen is fully rendered. Gated behind `@supports (animation-timeline: view())` and `prefers-reduced-motion: no-preference`; unsupporting browsers render the final state directly. The hero is excluded — above-the-fold content never fades in.
- Emphasis: 700ms, `cubic-bezier(.16,1,.3,1)` for the hero signal trace.
- Only opacity, transform, background, and border-color animate. Motion communicates command flow.
- Row hover states use a left-to-right cyan wash plus a 12px inset slide; they never move text vertically.
- No parallax, cursor glow, marquee, or decorative typing.
- `prefers-reduced-motion: reduce` disables the signal pulse, the connected-dot pulse, smooth scrolling, and every hover translate.

## 7. Depth & Surface

Tonal-shift and calibration-line strategy, extended in v2 with a material layer. Panels step from ink to panel to raised, with sunken reserved for inset terminals. Every raised surface carries three cues: a `--skin` top-light gradient, a 1px `--edge` inner top highlight, and an ambient shadow — so separation comes from the lit lip rather than from heavy borders. Elevation is tokenised as `--lift-1` (rows, chips), `--lift-2` (cards, panels, floating nav), and `--lift-3` (hero console only). Lines stay low-contrast. No parallax, no rounded-card soup.

**Ladder step: a deliberate deviation from the reference.** The measured Apple ladder jumps ~29 levels from canvas to card (`#000 → #1d1d1f`). This system steps ~14. The full step was tried and rejected: it reads as bright cards floating on black, which is right for consumer hardware marketing and wrong for a control surface. The deciding constraint is contrast budget, not taste — luminance spent lifting surfaces comes straight out of the gap between `--text-2` and `--text-3`. At ~14 levels the three text tones stay visibly distinct and the worst pair on the page still measures 4.99:1; at ~22+ the muted tone drops below 4.5:1 and has to be lightened until it converges with the body tone, collapsing a three-level hierarchy into two. The step is the largest one that keeps every text tone separable. Do not raise it without re-auditing all four surfaces.

Two v1 prohibitions were deliberately revised:

- **Backdrop blur** is permitted on the floating nav only. The header became sticky, so content now scrolls beneath it; the shell sits on `rgba(14,19,21,.82)` with `blur(16px)` and a gradient scrim underneath so nothing bleeds past its top edge. It reads as a lit panel, not glass.
- **A single ambient bloom** is permitted behind the hero console: one radial cyan gradient at `.11` peak alpha, no filter, no animation. It provides the fold's focal depth. It is not a neon glow and is not repeated elsewhere on the page.

## 8. Accessibility Constraints & Accepted Debt

- Target WCAG 2.2 AA: 4.5:1 body contrast, 3:1 large text and UI, keyboard reachability, visible focus, reduced motion, and 320px reflow.
- **Audited result**: 230 rendered text nodes on the landing page were measured against their fully composited backgrounds — including alpha layers and the `--skin` gradient, not the nominal token colour — with the large-text threshold applied by size and weight. Zero failures. The worst pair is `--text-3` on `--raised` at 4.99:1. Re-run this audit after any surface or text token change; a nominal-value check will not catch gradient and alpha compositing.
- **Reduced motion**: with the `reduce` declarations applied, all 71 scroll-reveal targets resolve to full opacity and identity transform at `scrollY = 0` — a reduced-motion visitor sees the complete page without scrolling. The `@supports (animation-timeline: view())` gate means browsers without a view timeline never enter the reveal layer at all.
- Landmarks: skip link, header/nav, one main, footer; one H1 and ordered headings.
- Minimum interactive target: 48px.
- Accepted debt: no localized Korean route in v1; add when the project commits to maintaining translated setup and API copy.
