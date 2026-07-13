# Logic Pro MCP Landing Page

Production landing page for [Logic Pro MCP](https://github.com/MongLong0214/logic-pro-mcp), deployed at [logic-pro-mcp.monglong.chatgpt.site](https://logic-pro-mcp.monglong.chatgpt.site/).

## Discovery surfaces

- Canonical, robots, Open Graph, and X metadata
- WebSite, WebPage, SoftwareApplication, BreadcrumbList, and visible-step HowTo structured data
- `robots.txt`, `sitemap.xml`, and `llms.txt`
- Search-focused product copy, evidence, limitations, documentation, and install flow
- Four client-specific install guides, two product guides, and three evidence-backed use cases
- Privacy-preserving conversion instrumentation contract that is unconditionally `NOT_CONFIGURED`

Keep product claims aligned with the current Logic Pro MCP README and stable release. The visible FAQ and installation cards share their source data with their structured-data counterparts.

## Development

Requires Node.js `>=22.13.0`.

```bash
npm install
npm run dev
npm test
npm run lint
npm run build
npm run typecheck
npm run verify:all
npm run qa:e2e
npm run qa:lighthouse
npm run qa:secrets
npm run verify:licenses
npm run audit:prod
```

`npm test` builds the production worker, runs contract tests, then validates the checked-in claim ledger, route uniqueness and similarity, links, structured data, privacy/security boundaries, production licenses, secrets, and the absence of starter artifacts. Claim evidence is pinned under `docs/evidence/`; `npm run verify:claims` recomputes every digest and verifies exact text across UI, metadata, JSON-LD, and `llms.txt`.

Browser and Lighthouse QA run from an isolated, exact-version tool environment. QA-only packages are intentionally excluded from this application's dependency graph and lockfile so they cannot affect the shipped dependency inventory or production audit. The full matrix and version boundary are documented in `docs/qa.md`.

## Deployment

The project is hosted with OpenAI Sites. `.openai/hosting.json` contains only the Sites project identifier and optional resource bindings; runtime configuration and access policy are managed by Sites.
