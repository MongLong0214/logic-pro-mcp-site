import assert from "node:assert/strict";
import { acquisitionRoutes, decodeHtml, render } from "./lib/render-site.mjs";

const knownRoutes = new Set(["/", ...acquisitionRoutes, "/robots.txt", "/sitemap.xml", "/llms.txt"]);
const allowedHosts = new Set(["logic-pro-mcp.monglong.chatgpt.site", "github.com", "code.claude.com", "docs.cursor.com", "code.visualstudio.com", "modelcontextprotocol.io"]);
for (const pathname of ["/", ...acquisitionRoutes]) {
  const { body } = await render(pathname);
  for (const match of body.matchAll(/href="([^"]+)"/g)) {
    const href = decodeHtml(match[1]);
    if (href.startsWith("#")) continue;
    if (href.startsWith("/")) {
      const target = href.split(/[?#]/, 1)[0];
      assert.ok(knownRoutes.has(target) || target.startsWith("/assets/") || target.startsWith("/og.png") || target.startsWith("/favicon.svg"), `${pathname}: unknown internal link ${href}`);
      continue;
    }
    const url = new URL(href);
    assert.equal(url.protocol, "https:", `${pathname}: external link must use HTTPS`);
    assert.ok(allowedHosts.has(url.hostname), `${pathname}: unapproved external host ${url.hostname}`);
  }
}
console.log("link verification: internal targets and external URL policy passed");
