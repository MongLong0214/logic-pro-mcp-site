# Logic Pro MCP Landing Page

Production landing page for [Logic Pro MCP](https://github.com/MongLong0214/logic-pro-mcp), deployed at [logic-pro-mcp.monglong.chatgpt.site](https://logic-pro-mcp.monglong.chatgpt.site/).

## Discovery surfaces

- Canonical, robots, Open Graph, and X metadata
- WebSite, SoftwareApplication, Person, HowTo, and FAQPage structured data
- `robots.txt`, `sitemap.xml`, and `llms.txt`
- Search-focused product copy, evidence, limitations, documentation, and install flow

Keep product claims aligned with the current Logic Pro MCP README and stable release. The visible FAQ and installation cards share their source data with their structured-data counterparts.

## Development

Requires Node.js `>=22.13.0`.

```bash
npm install
npm run dev
npm test
npm run lint
npm run build
```

`npm test` builds the production worker and validates rendered metadata, discovery routes, security headers, core product evidence, and the absence of starter artifacts.

## Deployment

The project is hosted with OpenAI Sites. `.openai/hosting.json` contains only the Sites project identifier and optional resource bindings; runtime configuration and access policy are managed by Sites.
