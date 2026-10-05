import Link from "next/link";
import { preload } from "react-dom";
import { SessionPlayer } from "./components/session-player";
import { OperationBench } from "./components/operation-bench";
import { InstallDesk } from "./components/install-desk";
import { productFacts } from "./content/product-facts";
import { githubUrl, siteUrl } from "./site-config";

export default function Home() {
  preload("/session-poster.webp", { as: "image", fetchPriority: "high" });
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org", "@graph": [
      { "@type": "Organization", "@id": siteUrl + "/#organization", name: "Logic Pro MCP", url: siteUrl,
        description: "Maintainer of the open-source Logic Pro MCP server for Claude, Cursor, VS Code, and custom AI agents.",
        logo: { "@type": "ImageObject", url: siteUrl + "/og.png" },
        knowsAbout: ["Model Context Protocol", "Logic Pro automation", "MIDI composition", "macOS Accessibility and Automation permissions", "DAW agent tooling"],
        sameAs: [githubUrl, "https://github.com/MongLong0214/logic-pro-mcp-site", "https://www.pulsemcp.com/servers/monglong-logic-pro", "https://lobehub.com/mcp/monglong0214-logic-pro-mcp", "https://glama.ai/mcp/servers/MongLong0214/logic-pro-mcp"] },
      { "@type": "WebSite", "@id": siteUrl + "/#website", name: "Logic Pro MCP", url: siteUrl, inLanguage: "en", publisher: { "@id": siteUrl + "/#organization" } },
      { "@type": "WebPage", "@id": siteUrl + "/#webpage", name: "Logic Pro MCP Server for Claude, Cursor & AI Agents", url: siteUrl, isPartOf: { "@id": siteUrl + "/#website" } },
      { "@type": "SoftwareApplication",
      "@id": siteUrl + "/#software", alternateName: "Logic Pro Model Context Protocol Server",
      name: "Logic Pro MCP", url: siteUrl, codeRepository: githubUrl,
      softwareVersion: productFacts.version, applicationCategory: "DeveloperApplication",
      applicationSubCategory: "Model Context Protocol server for music production", isAccessibleForFree: true,
      license: githubUrl + "/blob/v" + productFacts.version + "/LICENSE", sameAs: [githubUrl],
      operatingSystem: "macOS 14 or later", downloadUrl: githubUrl + "/releases/latest",
      offers: { "@type": "Offer", price: 0, priceCurrency: "USD" } }],
    }).replace(/</g, "\\u003c") }} />
    <a className="skip-link" href="#main">Skip to main content</a>
    <header className="desk-header"><Link className="desk-brand" href="/">Logic Pro <span>MCP</span></Link>
      <nav aria-label="Primary navigation"><Link href="/guides/logic-pro-mcp">Guide</Link><a href="#install">Install</a><a href={githubUrl}>Source</a></nav>
      <a className="release-tag" href={githubUrl + "/releases/tag/v" + productFacts.version}>v{productFacts.version} <span>Latest release</span></a>
    </header>
    <main id="main">
      <section className="session-intro" id="top">
        <div className="intro-topline"><span>LOCAL CONTROL / OPEN SOURCE</span><span>FOR MACOS & LOGIC PRO</span></div>
        <div className="intro-heading"><h1>Your session.<br /><em>Agent-operated.</em></h1>
          <div className="intro-aside"><p>Compose, control, and inspect Logic Pro through a local MCP server. Explicit targets. Honest readback. Your tools, working together.</p>
            <a className="desk-button" href="#install">Install the server</a><Link className="quiet-link" href="/guides/logic-pro-mcp">Read the practical guide</Link>
          </div>
        </div>
        <SessionPlayer />
        <div className="session-caption"><p>ONE PROMPT. A REAL LOGIC SESSION.</p><p>Archived product demo · 82 BPM · D minor · not a live connection</p></div>
      </section>
      <section className="desk-section work-section" id="workflows">
        <div className="section-grid-heading"><div><p className="desk-kicker">01 / FROM INTENT TO EVIDENCE</p><h2>Less hand-off.<br />More hands-on.</h2></div><p>One local interface for composing, mixing and delivery. Explore the workflow, then look at what each result actually means.</p></div>
        <OperationBench />
        <div className="surface-facts"><span><strong>10</strong> compact tools</span><span><strong>18</strong> read resources</span><span><strong>12</strong> resource templates</span><span><strong>7</strong> native channels</span></div>
        <p className="surface-footnote">Read <code>logic://system/operations</code> for the exact runtime catalog. Tools act; resources inspect. Channel availability and supported readback determine the outcome.</p>
      </section>
      <section className="desk-section principles" id="boundaries">
        <div><p className="desk-kicker">02 / CONTROL WITH CONTEXT</p><h2>Good tools know<br />where to stop.</h2><Link className="quiet-link" href="/guides/control-logic-pro-with-claude">Read the safe-control workflow</Link></div>
        <div className="principle-list">
          <article><span>01</span><div><h3>Name the target.</h3><p>A track ordinal is not a permanent identity. Inspect the current project, track and slot before a write.</p></div></article>
          <article><span>02</span><div><h3>Keep uncertainty visible.</h3><p>Unreadable state, missing evidence and send-only responses are boundaries, not a reason to assume success.</p></div></article>
          <article><span>03</span><div><h3>Verify the result, not the request.</h3><p>A successful send or an open dialog is not a confirmed region, parameter or exported audio file.</p></div></article>
        </div>
      </section>
      <section className="desk-section" id="install"><div className="section-grid-heading"><div><p className="desk-kicker">03 / YOUR NEXT SESSION</p><h2>Keep the studio.<br />Add an agent.</h2></div><p>The server runs on your Mac. Choose the application that will launch it, then follow its installation path.</p></div>
        <InstallDesk />
        <div className="requirements-line"><span>BEFORE YOU INSTALL</span><p>{productFacts.requirements} Apple silicon and Intel release artifacts. Desktop Logic Pro is the release qualification scope; Creator Studio identification is not a support promise.</p></div>
      </section>
      <section className="desk-section evidence-desk" id="evidence">
        <div className="section-grid-heading"><div><p className="desk-kicker">04 / CHECK THE SOURCE</p><h2>Open source.<br />Open boundaries.</h2></div><p>Release documentation, ongoing development and archived recordings have different scopes. No test counter can erase that distinction.</p></div>
        <div className="evidence-rows">
          <details><summary><span>RELEASE</span><strong>v{productFacts.version}</strong><span>Published September 28, 2026</span><i aria-hidden="true">+</i></summary><div><p>The current published server release. Installation and product documentation on this site are pinned to this tag, not unreleased changes.</p><a href={githubUrl + "/releases/tag/v" + productFacts.version}>Release notes and artifacts</a><a href={productFacts.apiUrl}>Tagged API contract</a></div></details>
          <details><summary><span>DEVELOPMENT</span><strong>Current main</strong><span>Changes after the release</span><i aria-hidden="true">+</i></summary><div><p>Issue fixes and pull requests on main are ongoing development. Their local tests are not a release qualification claim.</p><a href={githubUrl + "/pulls"}>Follow pull requests</a><a href={githubUrl + "/issues"}>Known limitations and open issues</a></div></details>
          <details><summary><span>RECORDING</span><strong>Session 001</strong><span>Archived product demo</span><i aria-hidden="true">+</i></summary><div><p>The recording above is an example from the project media archive. It is not a live connection to your Mac, a measurement of the latest release or a compatibility guarantee.</p><a href={githubUrl + "/blob/main/docs/media/README.md"}>Recording provenance</a></div></details>
        </div>
        <p className="program-note">Officially selected for Anthropic&apos;s Claude for Open Source program. <a href={productFacts.readmeUrl + "#selected-for-anthropics-claude-for-open-source-program"}>Project announcement</a></p>
      </section>
      <section className="desk-section reading-desk" id="docs">
        <p className="desk-kicker">05 / ON THE DESK</p><h2>Go deeper.</h2>
        <div className="reading-links">{[
          ["01", "Setup", "Permissions, routing and recovery.", productFacts.setupUrl],
          ["02", "API", "Tools, resources and the outcome contract.", productFacts.apiUrl],
          ["03", "Security", "Trust boundaries and installer hardening.", productFacts.securityUrl],
          ["04", "Changelog", "What shipped, and what remains deferred.", productFacts.changelogUrl],
        ].map(([number, title, description, href]) => <a key={title} href={href}><span>{number}</span><h3>{title}</h3><p>{description}</p><span className="reading-action">Read documentation</span></a>)}</div>
      </section>
    </main>
    <footer className="desk-footer"><Link className="desk-brand" href="/">Logic Pro <span>MCP</span></Link><p>Independent open-source project. Logic Pro is a trademark of Apple Inc.</p><a href={githubUrl}>MIT licensed. Built in the open.</a></footer>
  </>;
}
