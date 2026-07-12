const github = "https://github.com/MongLong0214/logic-pro-mcp";
const installCommand = "brew tap MongLong0214/logic-pro-mcp \\\n  https://github.com/MongLong0214/logic-pro-mcp\nbrew trust monglong0214/logic-pro-mcp\nbrew install logic-pro-mcp";
const registerCommand = "claude mcp add --scope user \\\n  logic-pro -- LogicProMCP";
const doctorCommand = "LogicProMCP doctor \\\n  --profile core \\\n  --client claude-code";
const doctorOutput = "$ LogicProMCP doctor --profile core\n\n✓ binary.path                 ready\n✓ permissions.accessibility  granted\n✓ logic.running               detected\n✓ channel.mcu                 ready\n✓ channel.accessibility       ready\n\nSTATUS  ready · 5/5 capabilities";

const capabilities = [
  ["COMPOSE", "Create tracks, write MIDI, set instruments, and shape tempo from an agent prompt."],
  ["CONTROL", "Operate transport, navigation, mixer state, and project lifecycle with explicit targets."],
  ["READ", "Inspect transport, tracks, mixer, markers, project metadata, inventory, and readiness as resources."],
  ["VERIFY", "Return confirmed, uncertain, or failed outcomes instead of turning automation into guesswork."],
] as const;

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>
      <header className="site-header">
        <nav className="nav-shell" aria-label="Primary navigation">
          <a className="wordmark" href="#top" aria-label="Logic Pro MCP home">
            <span className="mark" aria-hidden="true"><i /><i /><i /></span>
            <span>Logic Pro <strong>MCP</strong></span>
          </a>
          <div className="nav-links"><a href="#workflow">Workflow</a><a href="#capabilities">Capabilities</a><a href="#install">Install</a></div>
          <a className="nav-cta" href={github} target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
        </nav>
      </header>

      <main id="main">
        <section className="hero section" id="top">
          <div className="hero-copy">
            <p className="eyebrow"><span /> Open-source Logic Pro control plane</p>
            <h1>Give your agent a signal path into Logic Pro.</h1>
            <p className="hero-lead">A local MCP server for Claude, Cursor, and custom agents to compose, control, inspect, and verify real work in Logic Pro.</p>
            <div className="hero-actions">
              <a className="button primary" href={github} target="_blank" rel="noreferrer">View on GitHub <span aria-hidden="true">↗</span></a>
              <a className="button secondary" href="#install">Install with Homebrew <span aria-hidden="true">↓</span></a>
            </div>
            <p className="compatibility">macOS 14+ · Logic Pro 12.3 first-class · MIT licensed</p>
          </div>

          <div className="console-shell" aria-label="Example verified Logic Pro MCP workflow">
            <div className="console-top"><span>SESSION / SIGNAL_01</span><span className="live"><i /> CONNECTED</span></div>
            <div className="request"><span>REQUEST</span><p>“Build an 8-bar ambient loop at 92 BPM.”</p></div>
            <div className="signal-path" aria-label="Input, read, act, verify">
              {['INPUT', 'READ', 'ACT', 'VERIFY'].map((step, index) => <div className="signal-node" key={step}><span>0{index + 1}</span><strong>{step}</strong></div>)}
            </div>
            <div className="timeline" aria-hidden="true">
              <span className="playhead" />
              <div><b>CHORDS</b><i className="clip clip-a" /><i className="clip clip-a short" /></div>
              <div><b>BASS</b><i className="clip clip-b" /><i className="clip clip-b short" /></div>
              <div><b>TEXTURE</b><i className="clip clip-c" /></div>
            </div>
            <div className="meters">
              <div><span>STATE</span><strong className="confirmed">CONFIRMED</strong></div>
              <div><span>TEMPO</span><strong>92.00 <small>BPM</small></strong></div>
              <div><span>REGIONS</span><strong>03 <small>LIVE</small></strong></div>
            </div>
          </div>
        </section>

        <section className="proof-strip" aria-label="Project facts">
          <div><strong>10</strong><span>MCP tools</span></div><div><strong>99</strong><span>public commands</span></div>
          <div><strong>18</strong><span>read resources</span></div><div><strong>7</strong><span>native channels</span></div>
          <div><strong>MIT</strong><span>open source</span></div>
        </section>

        <section className="section workflow" id="workflow">
          <div className="section-heading">
            <p className="eyebrow"><span /> From intent to evidence</p>
            <h2>Automation you can hear.<br />State you can trust.</h2>
            <p>Each operation routes through the strongest available macOS channel, then exposes what Logic Pro actually did.</p>
          </div>
          <div className="workflow-grid">
            <article className="workflow-card compose-card">
              <span className="card-index">01 / COMPOSE</span><h3>Turn prompts into playable sessions.</h3>
              <p>Create instrument and Drummer tracks, generate MIDI sequences, assign patches, set tempo, and play back the result.</p>
              <div className="piano-roll" aria-label="A generated MIDI sequence preview">
                {[72,48,88,60,36,80,52,92,44,68,84,56].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}
              </div>
            </article>
            <article className="workflow-card verify-card">
              <span className="card-index">02 / VERIFY</span><h3>Know what happened after the write.</h3>
              <p>High-risk operations carry target identity, confirmation level, readback, and a typed outcome.</p>
              <div className="state-list"><div><i className="state-dot ok" /><span>STATE A</span><strong>CONFIRMED</strong></div><div><i className="state-dot warning" /><span>STATE B</span><strong>UNCERTAIN</strong></div><div><i className="state-dot danger" /><span>STATE C</span><strong>FAILED</strong></div></div>
            </article>
            <article className="workflow-card export-card">
              <span className="card-index">03 / DELIVER</span><h3>Plan, export, and inspect audio artifacts.</h3>
              <p>Dry-run export plans, resume interrupted batches, and analyze the files Logic Pro produced.</p>
              <div className="waveform" aria-hidden="true">{[18,28,44,76,32,58,88,64,36,72,48,94,62,34,78,54,26,68,42,22].map((height, index) => <i key={index} style={{ height }} />)}</div>
            </article>
          </div>
        </section>

        <section className="section capabilities" id="capabilities">
          <div className="cap-intro"><p className="eyebrow"><span /> A broader control surface</p><h2>One interface.<br />Seven native channels.</h2><p>MCU, Accessibility, AppleScript, CoreMIDI, CGEvent, Scripter, and MIDI Key Commands are routed behind a compact MCP surface.</p></div>
          <div className="cap-list">{capabilities.map(([title, body], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
        </section>

        <section className="section trust-section">
          <div className="trust-panel">
            <div className="trust-copy"><p className="eyebrow"><span /> Fail closed by design</p><h2>Honest when the UI is not.</h2><p>Targets are explicit. Destructive flows require confirmation. Unreadable or unverified state is returned as uncertain or failed, never promoted to success.</p><a className="text-link" href={`${github}#trust-model`} target="_blank" rel="noreferrer">Read the trust model <span aria-hidden="true">↗</span></a></div>
            <div className="doctor-output" aria-label="Example Logic Pro MCP doctor output"><div className="code-label"><span>LOGICPRO MCP / DOCTOR</span><span>PROFILE: CORE</span></div><pre><code>{doctorOutput}</code></pre></div>
          </div>
        </section>

        <section className="section install" id="install">
          <div className="section-heading install-heading"><p className="eyebrow"><span /> Start with a verified install</p><h2>From zero to ready.</h2><p>Install the universal binary, register it with your MCP client, then let Doctor identify the exact setup work that remains.</p></div>
          <div className="install-steps">
            <article><span className="step-number">01</span><h3>Install</h3><pre><code>{installCommand}</code></pre></article>
            <article><span className="step-number">02</span><h3>Register</h3><pre><code>{registerCommand}</code></pre></article>
            <article><span className="step-number">03</span><h3>Diagnose</h3><pre><code>{doctorCommand}</code></pre></article>
          </div>
          <p className="install-note">Homebrew 6.0+ requires the trust step. Full setup includes macOS permissions and Logic-side MCU registration.</p>
        </section>

        <section className="final-cta section"><div><p className="eyebrow"><span /> Build with the signal, not the screen</p><h2>Make Logic Pro agent-ready.</h2></div><a className="button primary" href={github} target="_blank" rel="noreferrer">Explore the repository <span aria-hidden="true">↗</span></a></section>
      </main>

      <footer><a className="wordmark" href="#top"><span className="mark" aria-hidden="true"><i /><i /><i /></span><span>Logic Pro <strong>MCP</strong></span></a><p>Independent open-source project. Logic Pro is a trademark of Apple Inc. No affiliation or endorsement is implied.</p><a href={`${github}/blob/main/LICENSE`} target="_blank" rel="noreferrer">MIT License <span aria-hidden="true">↗</span></a></footer>
    </>
  );
}
