import { CopyCommand } from "./copy-command";
import { InstallViewEvent } from "./install-view-event";
import Link from "next/link";
import { JsonLd } from "./json-ld";
import { TrackedLink } from "./tracked-link";
import { pageRecords, type RoutePath } from "../content/page-records";
import { productFacts } from "../content/product-facts";
import { installClaimKey } from "../content/claim-ledger";

export function ContentPage({ path }: Readonly<{ path: RoutePath }>) {
  const page = pageRecords[path];
  const canonical = `${productFacts.siteUrl}${path}`;
  const graph = [
    { "@type": "WebPage", "@id": `${canonical}#webpage`, url: canonical, name: page.title, description: page.description, isPartOf: { "@id": `${productFacts.siteUrl}/#website` } },
    { "@type": "BreadcrumbList", "@id": `${canonical}#breadcrumb`, itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: productFacts.siteUrl }, { "@type": "ListItem", position: 2, name: page.title, item: canonical }] },
    ...(page.kind === "install" ? [{ "@type": "HowTo", "@id": `${canonical}#howto`, name: page.h1, description: page.description, step: page.steps.map((step, index) => ({ "@type": "HowToStep", position: index + 1, name: step.name, text: step.text })) }] : []),
  ];
  const client = "client" in page ? page.client : undefined;
  const installPath = page.kind === "install" ? page.path : undefined;
  const successClaimKey = path === "/use-cases/compose-midi" ? "midi-send-only" : path === "/use-cases/mixer-automation" ? "plugin-applyback" : path === "/use-cases/batch-export" ? "bounce-boundary" : undefined;

  return <>
    {page.kind === "install" && client ? <InstallViewEvent client={client} path={`/install/${client}`} /> : null}
    <JsonLd value={{ "@context": "https://schema.org", "@graph": graph }} />
    <a className="skip-link" href="#main">Skip to main content</a>
    <header className="site-header"><nav className="nav-shell" aria-label="Primary navigation"><Link className="wordmark" href="/"><span className="mark" aria-hidden="true"><i /><i /><i /></span><span>Logic Pro <strong>MCP</strong></span></Link><div className="nav-links"><Link href="/guides/logic-pro-mcp">Guide</Link><Link href="/install/claude-code">Install</Link><Link href="/use-cases/mixer-automation">Use cases</Link></div><TrackedLink className="nav-cta" href={productFacts.githubUrl} target="_blank" rel="noreferrer" event={{ name: "github_clicked", page: path, placement: "header", destination_host: "github.com" }}>GitHub <span aria-hidden="true">↗</span></TrackedLink></nav></header>
    <main id="main" className="article-main">
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>{page.kind === "use-case" ? "Use cases" : page.kind === "install" ? "Install" : "Guides"}</span></nav>
      <article className="article-shell">
        <header className="article-hero"><p className="eyebrow"><span /> {page.eyebrow}</p><h1>{page.h1}</h1><p className="hero-lead" data-claim-key={installPath ? installClaimKey(installPath, "lead") : undefined}>{page.lead}</p><div className="article-actions"><TrackedLink className="button primary" href={productFacts.githubUrl} target="_blank" rel="noreferrer" event={{ name: "github_clicked", page: path, placement: "hero", destination_host: "github.com", ...(client ? { client } : {}) }}>View source on GitHub <span aria-hidden="true">↗</span></TrackedLink><a className="button secondary" href="#steps">Follow the workflow <span aria-hidden="true">↓</span></a></div></header>
        {page.kind !== "install" ? <p className="evidence-date">Evidence reviewed 2026-07-13 by the Logic Pro MCP open-source project.</p> : null}
        <section className="article-section"><p className="eyebrow"><span /> Before you begin</p><h2>Prerequisites</h2><ul className="check-list">{page.prerequisites.map((item, index) => <li key={item} data-claim-key={installPath ? installClaimKey(installPath, `prerequisite.${index}`) : index === 0 && path === "/guides/logic-pro-mcp" ? "requirements" : undefined}>{item}</li>)}</ul></section>
        <section className="article-section" id="steps"><p className="eyebrow"><span /> Verified path</p><h2>{page.kind === "install" ? "Install and verify" : "Workflow"}</h2><ol className="article-steps">{page.steps.map((step, index) => <li key={step.name}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{step.name}</h3><p data-claim-key={installPath ? installClaimKey(installPath, `step.${index}.text`) : undefined}>{step.text}</p>{"command" in step && step.command ? <CopyCommand claimKey={installPath ? installClaimKey(installPath, `step.${index}.command`) : undefined} command={step.command} label={`Copy ${step.name.toLowerCase()} command`} event={{ name: "install_command_copied", page: path, placement: "workflow", destination_host: "", ...(client ? { client } : {}), command_step: index === 0 ? "install" : index === 1 ? "register" : index === 2 ? "permissions" : "doctor" }} /> : null}</div></li>)}</ol></section>
        <section className="article-section evidence-panel"><div><p className="eyebrow"><span /> Observable evidence</p><h2>What success means</h2><p data-claim-key={installPath ? installClaimKey(installPath, "success") : successClaimKey}>{page.success}</p></div><div><p className="eyebrow"><span /> Current boundary</p><h2>What this does not prove</h2><p data-claim-key={installPath ? installClaimKey(installPath, "boundary") : undefined}>{page.boundary}</p></div></section>
        <section className="article-section"><p className="eyebrow"><span /> Primary evidence</p><h2>Verify at the source</h2><p>Product behavior is pinned to the v3.11.0 source. Client registration details remain owned by the client vendor.</p><div className="source-links"><TrackedLink href={page.sourceUrl} target="_blank" rel="noreferrer" event={{ name: "docs_clicked", page: path, placement: "sources", destination_host: new URL(page.sourceUrl).hostname }}>Primary documentation <span aria-hidden="true">↗</span></TrackedLink><TrackedLink href={productFacts.setupUrl} target="_blank" rel="noreferrer" event={{ name: "docs_clicked", page: path, placement: "sources", destination_host: "github.com" }}>Tagged setup guide <span aria-hidden="true">↗</span></TrackedLink></div></section>
        <section className="article-section"><p className="eyebrow"><span /> Continue</p><h2>Related verified paths</h2><div className="related-grid">{page.related.map((relatedPath) => <Link href={relatedPath} key={relatedPath}><span>{pageRecords[relatedPath].eyebrow}</span><strong>{pageRecords[relatedPath].h1}</strong><i aria-hidden="true">→</i></Link>)}</div></section>
      </article>
    </main>
    <footer><Link className="wordmark" href="/"><span className="mark" aria-hidden="true"><i /><i /><i /></span><span>Logic Pro <strong>MCP</strong></span></Link><p>Independent open-source project. Logic Pro is a trademark of Apple Inc. No affiliation or endorsement is implied.</p></footer>
  </>;
}
