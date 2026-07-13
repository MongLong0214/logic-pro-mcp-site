import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("Given the production worker, when the landing page renders, then product proof is present", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Logic Pro MCP Server for Claude, Cursor &amp; AI Agents<\/title>/i);
  assert.match(html, /Give your agent a signal path into Logic Pro/);
  assert.match(html, /10<\/strong><span>MCP tools/);
  assert.match(html, /11<\/strong><span>resource templates/);
  assert.match(html, /2,271<\/strong><span>deterministic tests/);
  assert.match(html, /99 public commands/);
  assert.match(html, /Architecture at a glance/);
  assert.match(html, /Known limitations/);
  assert.match(html, /Docs for every stage/);
  assert.match(html, /Before you install/);
  assert.match(html, /application\/ld\+json/);
  const jsonLdMatch = html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/);
  assert.ok(jsonLdMatch, "JSON-LD graph must be rendered");
  const jsonLd = JSON.parse(jsonLdMatch[1]);
  assert.equal(jsonLd["@context"], "https://schema.org");
  assert.deepEqual(
    jsonLd["@graph"].map((entry) => entry["@type"]),
    ["WebSite", "WebPage", "SoftwareApplication"],
  );
  assert.match(html, /rel="canonical" href="https:\/\/logic-pro-mcp\.monglong\.chatgpt\.site"/);
  assert.match(html, /<meta name="theme-color" content="#080b0c"\/>/);
  assert.match(html, /href="#main">Skip to main content<\/a>/);
  assert.match(response.headers.get("content-security-policy") ?? "", /frame-ancestors 'none'/);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.equal(response.headers.get("referrer-policy"), "strict-origin-when-cross-origin");
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/);
});

test("Given the discovery routes, when crawlers request them, then typed canonical content is returned", async () => {
  const [robotsResponse, sitemapResponse, llmsResponse] = await Promise.all([
    render("/robots.txt"),
    render("/sitemap.xml"),
    render("/llms.txt"),
  ]);
  const [robots, sitemap, llms] = await Promise.all([
    robotsResponse.text(),
    sitemapResponse.text(),
    llmsResponse.text(),
  ]);

  assert.match(robotsResponse.headers.get("content-type") ?? "", /^text\/plain\b/i);
  assert.match(sitemapResponse.headers.get("content-type") ?? "", /^(?:application|text)\/xml\b/i);
  assert.match(llmsResponse.headers.get("content-type") ?? "", /^text\/plain\b/i);
  assert.match(robots, /Sitemap: https:\/\/logic-pro-mcp\.monglong\.chatgpt\.site\/sitemap\.xml/i);
  assert.match(sitemap, /<loc>https:\/\/logic-pro-mcp\.monglong\.chatgpt\.site<\/loc>/);
  assert.match(llms, /https:\/\/github\.com\/MongLong0214\/logic-pro-mcp/);
  assert.match(llms, /brew install logic-pro-mcp/);
});

test("Given the finished site, when assets are inspected, then starter artifacts are absent", async () => {
  const [page, layout, css, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    access(new URL("../public/og.png", import.meta.url)),
    access(new URL("../public/favicon.svg", import.meta.url)),
  ]);

  assert.match(page, /githubUrl as github, siteUrl/);
  assert.match(layout, /images: \["\/og\.png"\]/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.doesNotMatch(page + layout, /_sites-preview|codex-preview|SkeletonPreview/);
});

const acquisitionRoutes = [
  "/install/claude-code",
  "/install/claude-desktop",
  "/install/cursor",
  "/install/vscode",
  "/guides/logic-pro-mcp",
  "/guides/control-logic-pro-with-claude",
  "/use-cases/compose-midi",
  "/use-cases/mixer-automation",
  "/use-cases/batch-export",
];

test("Given the approved acquisition manifest, when every route renders, then each page is canonical and unique", async () => {
  const pages = await Promise.all(acquisitionRoutes.map(async (pathname) => {
    const response = await render(pathname);
    return { pathname, response, html: await response.text() };
  }));

  const titles = new Set();
  const headings = new Set();
  for (const { pathname, response, html } of pages) {
    assert.equal(response.status, 200, pathname);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
    assert.match(html, new RegExp(`rel="canonical" href="https://logic-pro-mcp\\.monglong\\.chatgpt\\.site${pathname}"`));
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    const heading = html.match(/<h1[^>]*>([^<]+)<\/h1>/)?.[1];
    assert.ok(title, `${pathname} title`);
    assert.ok(heading, `${pathname} h1`);
    titles.add(title);
    headings.add(heading);
    assert.match(html, /application\/ld\+json/);
    assert.match(html, /View source on GitHub/);
    const jsonLdMatch = html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/);
    assert.ok(jsonLdMatch, `${pathname} JSON-LD`);
    const graph = JSON.parse(jsonLdMatch[1])["@graph"];
    const types = graph.map((entry) => entry["@type"]);
    assert.deepEqual(types.slice(0, 2), ["WebPage", "BreadcrumbList"]);
    if (pathname.startsWith("/install/")) {
      assert.equal(types[2], "HowTo");
      assert.doesNotMatch(html, /Evidence reviewed 2026-07-13/);
    } else {
      assert.deepEqual(types, ["WebPage", "BreadcrumbList"]);
      assert.match(html, /Evidence reviewed 2026-07-13 by the Logic Pro MCP open-source project/);
    }
  }
  assert.equal(titles.size, acquisitionRoutes.length);
  assert.equal(headings.size, acquisitionRoutes.length);
});
