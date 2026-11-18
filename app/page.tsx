import "./session.css";
import { HomePage } from "./components/home-page";
import { productFacts } from "./content/product-facts";
import { pageRecords } from "./content/page-records";
import { githubUrl, siteUrl } from "./site-config";

const registrationFor = (route: "/install/claude-code" | "/install/claude-desktop" | "/install/cursor" | "/install/vscode", step: number) => {
  const registrationStep = pageRecords[route].steps[step];
  return "command" in registrationStep ? registrationStep.command : undefined;
};
const registrations = {
  "claude-code": registrationFor("/install/claude-code", 1),
  "claude-desktop": registrationFor("/install/claude-desktop", 2),
  cursor: registrationFor("/install/cursor", 2),
  vscode: registrationFor("/install/vscode", 2),
} as const;

export default function Home() {
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
    <HomePage registrations={registrations} />
  </>;
}
