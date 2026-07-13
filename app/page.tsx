const github = "https://github.com/MongLong0214/logic-pro-mcp";
const siteUrl = "https://logic-pro-mcp.monglong.chatgpt.site";
const installCommand = [
  "brew tap MongLong0214/logic-pro-mcp \\",
  "  https://github.com/MongLong0214/logic-pro-mcp",
  "brew trust monglong0214/logic-pro-mcp",
  "brew install logic-pro-mcp",
].join("\n");
const registerCommand = ["claude mcp add --scope user \\", "  logic-pro -- LogicProMCP"].join("\n");
const permissionsCommand = "LogicProMCP --check-permissions";
const doctorCommand = ["LogicProMCP doctor \\", "  --profile core \\", "  --client claude-code"].join("\n");
const doctorOutput = [
  "$ LogicProMCP doctor --profile core", "", "✓ binary.path                 ready",
  "✓ permissions.accessibility  granted", "✓ logic.running               detected",
  "✓ channel.mcu                 ready", "✓ channel.accessibility       ready",
  "", "STATUS  ready · 5/5 capabilities",
].join("\n");
const installSteps = [
  { name: "Install", description: "Tap the GitHub repository, trust the third-party Homebrew tap on Homebrew 6 or later, and install logic-pro-mcp.", command: installCommand },
  { name: "Register", description: "Register LogicProMCP as a local stdio server in Claude Code or another compatible MCP client.", command: registerCommand },
  { name: "Permissions", description: "Grant Accessibility, Automation, and Input Monitoring permissions required for the workflows you use.", command: permissionsCommand, note: "Checks Accessibility, Automation to Logic Pro and System Events, plus PostEvent/Input Monitoring." },
  { name: "Diagnose", description: "Run LogicProMCP doctor with the profile and client that match your workflow.", command: doctorCommand },
] as const;

const capabilities = [
  ["COMPOSE", "Create tracks, write MIDI, set instruments, and shape tempo from an agent prompt."],
  ["CONTROL", "Operate transport, navigation, mixer state, and project lifecycle with explicit targets."],
  ["READ", "Inspect transport, tracks, mixer, markers, project metadata, inventory, and readiness as resources."],
  ["VERIFY", "Return confirmed, uncertain, or failed outcomes instead of turning automation into guesswork."],
] as const;
const toolGroups = [
  ["COMPOSE", "logic_tracks · logic_midi", "Create tracks, write and import MIDI, resolve instruments, and manage ports."],
  ["CONTROL", "logic_transport · logic_edit · logic_navigate", "Run transport, edit regions, move by bar or marker, and control views."],
  ["MIX", "logic_mixer · logic_plugins", "Set level and pan, inspect stock plugins, and perform guarded verified apply-back."],
  ["DELIVER", "logic_project", "Open, save, audit, bounce, plan exports, and resume interrupted batches."],
  ["OBSERVE", "logic_audio · logic_system", "Analyze exported audio and report health, channels, permissions, and readiness."],
] as const;
const trustContracts = [
  ["HONEST ENVELOPES", "Every mutation returns confirmed, uncertain with a reason, or failed with an error."],
  ["EXACT TARGETS", "Track, marker, mixer, MIDI import, and plugin writes validate explicit targets before acting."],
  ["VERIFIED APPLY-BACK", "Plugin State A requires project, track, slot, identity, and post-write readback to agree."],
  ["CONFIRMATION LEVELS", "Destructive project flows and plugin insertion require explicit confirmation metadata."],
  ["PROVENANCE", "Read surfaces label source, freshness, and evidence so agents do not have to guess."],
  ["HARDENED DELIVERY", "Homebrew pins release SHA256; shell installs fail closed without explicit trust pins."],
] as const;
const limitations = [
  ["Tempo input", "Exact AX slider fallbacks are bounded and fail closed when Logic cannot confirm the requested tempo."],
  ["MIDI region padding", "Imported regions may visually extend from bar 1 to the target bar; note timing remains exact."],
  ["External MIDI bounce", "Unverified GM Device or External MIDI regions block a claimed audible bounce."],
  ["Key Commands", "Logic 12.2+ requires Manual MIDI Learn because the legacy plist is no longer auto-imported."],
  ["Markers", "Unreadable state stays unreadable or cached; rename_marker remains not implemented."],
  ["Plugin parameters", "Unsupported live parameter readback remains limited and fails closed."],
] as const;
const docs = [
  ["SETUP", "Install, permissions, MCP registration, Logic integration, and Doctor remediation.", github + "/blob/main/docs/SETUP.md"],
  ["API", "All tools, resources, templates, Honest Contract, and verified apply-back.", github + "/blob/main/docs/API.md"],
  ["TROUBLESHOOT", "Common client, permission, channel, and Logic Pro failures with fixes.", github + "/blob/main/docs/TROUBLESHOOTING.md"],
  ["SECURITY", "Threat model, installer trust tiers, hardening, and private disclosure.", github + "/blob/main/SECURITY.md"],
  ["CHANGELOG", "Stable release history, deferred work, and evidence-linked changes.", github + "/blob/main/CHANGELOG.md"],
  ["CONTRIBUTE", "Development setup, scoped PR workflow, verification, and open issues.", github + "/blob/main/CONTRIBUTING.md"],
] as const;
const faqs = [
  ["What is Logic Pro MCP?", "Logic Pro MCP is an open-source local Model Context Protocol server that lets compatible AI clients compose, control, inspect, and verify work in Logic Pro on macOS."],
  ["Which AI clients can use it?", "It works with MCP clients that can launch a local stdio server, including Claude Code, Claude Desktop, Cursor, VS Code, and custom agents."],
  ["What can an AI agent control in Logic Pro?", "Agents can create tracks and MIDI, operate transport and navigation, inspect mixer and project state, manage project workflows, analyze exported audio, and verify high-risk writes."],
  ["How do I install Logic Pro MCP?", "Install the universal binary with the Homebrew tap, register LogicProMCP with your MCP client, grant the required macOS permissions, and run LogicProMCP doctor to verify readiness."],
  ["Is Logic Pro MCP free?", "Yes. The project is open source under the MIT License, and its source, releases, setup guide, API reference, security policy, and issue tracker are public on GitHub."],
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Logic Pro MCP",
      description: "Open-source Logic Pro MCP server for Claude, Cursor, VS Code, and custom AI agents.",
      inLanguage: "en",
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${siteUrl}/#software`,
      name: "Logic Pro MCP",
      alternateName: "Logic Pro Model Context Protocol Server",
      url: siteUrl,
      codeRepository: github,
      downloadUrl: `${github}/releases/latest`,
      softwareVersion: "3.11.0",
      applicationCategory: "DeveloperApplication",
      applicationSubCategory: "Model Context Protocol server for music production",
      operatingSystem: "macOS 14 or later",
      license: `${github}/blob/main/LICENSE`,
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: [
        "Logic Pro track and MIDI composition",
        "Transport, mixer, and navigation control",
        "Live project state resources",
        "Confirmed, uncertain, or failed verification envelopes",
        "Homebrew installation for Apple silicon and Intel Macs",
      ],
      sameAs: [github],
      author: { "@id": `${siteUrl}/#author` },
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}/#author`,
      name: "MongLong0214",
      url: "https://github.com/MongLong0214",
      sameAs: ["https://github.com/MongLong0214"],
    },
    {
      "@type": "HowTo",
      "@id": `${siteUrl}/#install-guide`,
      name: "How to install Logic Pro MCP",
      description: "Install and verify the Logic Pro MCP server for a compatible AI client.",
      step: installSteps.map((step, index) => ({ "@type": "HowToStep", position: index + 1, name: step.name, text: step.description })),
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: faqs.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <a className="skip-link" href="#main">Skip to main content</a>
      <header className="site-header">
        <nav className="nav-shell" aria-label="Primary navigation">
          <a className="wordmark" href="#top" aria-label="Logic Pro MCP home"><span className="mark" aria-hidden="true"><i /><i /><i /></span><span>Logic Pro <strong>MCP</strong></span></a>
          <div className="nav-links"><a href="#workflow">Workflow</a><a href="#architecture">Architecture</a><a href="#evidence">Evidence</a><a href="#install">Install</a></div>
          <a className="nav-cta" href={github} target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
        </nav>
      </header>

      <main id="main">
        <section className="hero section" id="top">
          <div className="hero-copy">
            <p className="eyebrow"><span /> Open-source Logic Pro control plane</p>
            <h1>Give your agent a signal path into Logic Pro.</h1>
            <p className="hero-lead">A local MCP server for Claude, Cursor, VS Code, and custom agents to compose, control, inspect, and verify real work in Logic Pro.</p>
            <div className="hero-actions"><a className="button primary" href={github} target="_blank" rel="noreferrer">View on GitHub <span aria-hidden="true">↗</span></a><a className="button secondary" href="#install">Install with Homebrew <span aria-hidden="true">↓</span></a></div>
            <p className="compatibility">stable v3.11.0 · macOS 14+ · Logic Pro 12.3 first-class · MIT</p>
          </div>
          <div className="console-shell" aria-label="Example verified Logic Pro MCP workflow">
            <div className="console-top"><span>SESSION / SIGNAL_01</span><span className="live"><i /> CONNECTED</span></div>
            <div className="request"><span>REQUEST</span><p>“Build an 8-bar ambient loop at 92 BPM.”</p></div>
            <div className="signal-path" aria-label="Input, read, act, verify">{["INPUT", "READ", "ACT", "VERIFY"].map((step, index) => <div className="signal-node" key={step}><span>0{index + 1}</span><strong>{step}</strong></div>)}</div>
            <div className="timeline" aria-hidden="true"><span className="playhead" /><div><b>CHORDS</b><i className="clip clip-a" /><i className="clip clip-a short" /></div><div><b>BASS</b><i className="clip clip-b" /><i className="clip clip-b short" /></div><div><b>TEXTURE</b><i className="clip clip-c" /></div></div>
            <div className="meters"><div><span>STATE</span><strong className="confirmed">CONFIRMED</strong></div><div><span>TEMPO</span><strong>92.00 <small>BPM</small></strong></div><div><span>REGIONS</span><strong>03 <small>LIVE</small></strong></div></div>
          </div>
        </section>

        <section className="proof-strip" aria-label="Project facts">
          <div><strong>10</strong><span>MCP tools</span></div><div><strong>18</strong><span>read resources</span></div>
          <div><strong>11</strong><span>resource templates</span></div><div><strong>7</strong><span>native channels</span></div>
          <div><strong>2,271</strong><span>deterministic tests</span></div>
        </section>

        <section className="section workflow" id="workflow">
          <div className="section-heading"><p className="eyebrow"><span /> From intent to evidence</p><h2>Automation you can hear.<br />State you can trust.</h2><p>Each operation routes through the strongest available macOS channel, then exposes what Logic Pro actually did.</p></div>
          <div className="workflow-grid">
            <article className="workflow-card compose-card"><span className="card-index">01 / COMPOSE</span><h3>Turn prompts into playable sessions.</h3><p>Create instrument and Drummer tracks, generate MIDI sequences, assign patches, set tempo, and play back the result.</p><div className="piano-roll" aria-label="A generated MIDI sequence preview">{[72,48,88,60,36,80,52,92,44,68,84,56].map((height, index) => <i key={index} style={{ height: height + "%" }} />)}</div></article>
            <article className="workflow-card verify-card"><span className="card-index">02 / VERIFY</span><h3>Know what happened after the write.</h3><p>High-risk operations carry target identity, confirmation level, readback, and a typed outcome.</p><div className="state-list"><div><i className="state-dot ok" /><span>STATE A</span><strong>CONFIRMED</strong></div><div><i className="state-dot warning" /><span>STATE B</span><strong>UNCERTAIN</strong></div><div><i className="state-dot danger" /><span>STATE C</span><strong>FAILED</strong></div></div></article>
            <article className="workflow-card export-card"><span className="card-index">03 / DELIVER</span><h3>Plan, export, and inspect audio artifacts.</h3><p>Dry-run export plans, resume interrupted batches, and analyze the files Logic Pro produced.</p><div className="waveform" aria-hidden="true">{[18,28,44,76,32,58,88,64,36,72,48,94,62,34,78,54,26,68,42,22].map((height, index) => <i key={index} style={{ height }} />)}</div></article>
          </div>
        </section>

        <section className="section capabilities" id="capabilities">
          <div className="cap-intro"><p className="eyebrow"><span /> A broader control surface</p><h2>One interface.<br />Seven native channels.</h2><p>MCU, Accessibility, AppleScript, CoreMIDI, CGEvent, Scripter, and MIDI Key Commands are routed behind a compact MCP surface.</p></div>
          <div className="cap-list">{capabilities.map(([title, body], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
        </section>

        <section className="section architecture" id="architecture">
          <div className="section-heading"><p className="eyebrow"><span /> Architecture at a glance</p><h2>Compact outside.<br />Purpose-built inside.</h2><p>The Swift stdio server validates intent, chooses the strongest channel, then publishes cached or live evidence through resources.</p></div>
          <ol className="architecture-flow" aria-label="Logic Pro MCP request lifecycle">
            <li><span>01</span><strong>MCP CLIENT</strong><p>Claude, Cursor, VS Code, or a custom agent launches the local stdio server.</p></li>
            <li><span>02</span><strong>DISPATCH</strong><p>Ten compact tools validate command parameters and safety requirements.</p></li>
            <li><span>03</span><strong>ROUTE</strong><p>ChannelRouter selects the strongest available native control channel.</p></li>
            <li><span>04</span><strong>READ BACK</strong><p>Resources return state with source, freshness, and evidence labels.</p></li>
          </ol>
          <div className="tool-table" aria-label="Public MCP tool groups">{toolGroups.map(([label, tools, body], index) => <article key={label}><span>0{index + 1}</span><div><small>{label}</small><h3>{tools}</h3></div><p>{body}</p></article>)}</div>
          <p className="surface-note"><strong>Tools act.</strong> Ten compact tools expose 99 public commands. Resources read without mutating Logic, while prompts package ten built-in workflows from readiness and composition to gain staging, cleanup, bounce, and batch export.</p>
        </section>

        <section className="section trust-section">
          <div className="trust-panel">
            <div className="trust-copy"><p className="eyebrow"><span /> Fail closed by design</p><h2>Honest when the UI is not.</h2><p>Targets are explicit. Destructive flows require confirmation. Unreadable or unverified state is returned as uncertain or failed, never promoted to success.</p><p className="trust-detail">Doctor scopes readiness to core, mixer, keycmd, legacy-scripter, or full, then adapts checks for Claude, Cursor, VS Code, terminal, or custom hosts.</p><a className="text-link" href={github + "#trust-model"} target="_blank" rel="noreferrer">Read the trust model <span aria-hidden="true">↗</span></a></div>
            <div className="doctor-output" aria-label="Example Logic Pro MCP doctor output"><div className="code-label"><span>LOGICPRO MCP / DOCTOR</span><span>PROFILE: CORE</span></div><pre><code>{doctorOutput}</code></pre></div>
            <div className="trust-contracts">{trustContracts.map(([title, body]) => <article key={title}><h3>{title}</h3><p>{body}</p></article>)}</div>
          </div>
        </section>

        <section className="section evidence" id="evidence">
          <div className="evidence-heading"><p className="eyebrow"><span /> Claims tied to evidence</p><h2>Stable v3.11.0.<br />No green by implication.</h2><p>Release claims stay attached to shipped artifacts, deterministic tests, targeted live QA, or explicitly linked historical evidence.</p></div>
          <div className="evidence-grid">
            <article><strong>2,271</strong><span>Swift tests</span><p>Current source tree deterministic suite: passed with zero failures.</p></article>
            <article><strong>372 / 373</strong><span>strict live E2E</span><p>Last full Logic Pro 12.3 run on the v3.8 line: 372 passed, one skipped, zero failed.</p></article>
            <article><strong>UNIVERSAL</strong><span>release artifacts</span><p>arm64 and x86_64 archives with SHA256SUMS and release metadata.</p></article>
            <article><strong>TARGETED</strong><span>current live QA</span><p>Tempo fallback, native Bounce, partial regions, markers, Count In, Step Input, and help categories.</p></article>
          </div>
          <div className="release-line"><span>STABLE / v3.11.0</span><p>Latest Logic Pro first. Logic Pro 12.3 is actively validated; versions down to 12.0.1 remain best-effort. Desktop Logic Pro and Creator Studio are both resolved by bundle identity.</p><a href={github + "/releases/tag/v3.11.0"} target="_blank" rel="noreferrer">Release evidence ↗</a></div>
        </section>

        <section className="section install" id="install">
          <div className="section-heading install-heading"><p className="eyebrow"><span /> Start with a verified install</p><h2>From zero to ready.</h2><p>Install the universal binary, register your client, verify macOS permissions, then let Doctor order the remaining work.</p></div>
          <div className="install-steps">{installSteps.map((step, index) => <article key={step.name}><span className="step-number">{String(index + 1).padStart(2, "0")}</span><h3>{step.name}</h3><pre><code translate="no">{step.command}</code></pre>{"note" in step ? <p>{step.note}</p> : null}</article>)}</div>
          <p className="install-note">Full setup registers the LogicProMCP-MCU-Internal control surface. Scripter is optional unless you need legacy plugin-parameter writes.</p>
        </section>

        <section className="section technical-depth" id="limitations">
          <div className="section-heading"><p className="eyebrow"><span /> Boundaries, not footnotes</p><h2>Known limitations,<br />published plainly.</h2><p>Where Logic Pro cannot provide faithful readback, the server constrains the operation or refuses the claim.</p></div>
          <div className="limitation-list">{limitations.map(([title, body], index) => <details key={title}><summary><span>0{index + 1}</span><strong>{title}</strong><i aria-hidden="true">+</i></summary><p>{body}</p></details>)}</div>
        </section>

        <section className="section docs-section" id="docs">
          <div className="docs-heading"><p className="eyebrow"><span /> Go to the source</p><h2>Docs for every stage.</h2><p>From first launch to API contracts, threat modeling, troubleshooting, and contribution.</p></div>
          <div className="docs-grid">{docs.map(([title, body, href]) => <a href={href} target="_blank" rel="noreferrer" key={title}><span>{title}</span><p>{body}</p><strong aria-hidden="true">↗</strong></a>)}</div>
        </section>

        <section className="section faq-section" id="faq">
          <div className="section-heading"><p className="eyebrow"><span /> Logic Pro MCP FAQ</p><h2>Before you install.</h2><p>Direct answers for musicians, developers, and AI agents evaluating the server.</p></div>
          <div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary><strong>{question}</strong><i aria-hidden="true">+</i></summary><p>{answer}</p></details>)}</div>
        </section>

        <section className="final-cta section"><div><p className="eyebrow"><span /> Build with the signal, not the screen</p><h2>Make Logic Pro agent-ready.</h2></div><a className="button primary" href={github} target="_blank" rel="noreferrer">Explore the repository <span aria-hidden="true">↗</span></a></section>
      </main>

      <footer><a className="wordmark" href="#top"><span className="mark" aria-hidden="true"><i /><i /><i /></span><span>Logic Pro <strong>MCP</strong></span></a><p>Independent open-source project. Logic Pro is a trademark of Apple Inc. No affiliation or endorsement is implied.</p><div className="footer-links"><a href={github + "/issues"} target="_blank" rel="noreferrer">Issues</a><a href={github + "/blob/main/SECURITY.md"} target="_blank" rel="noreferrer">Security</a><a href={github + "/blob/main/LICENSE"} target="_blank" rel="noreferrer">MIT</a></div></footer>
    </>
  );
}
