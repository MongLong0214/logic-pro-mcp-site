import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("Given the production worker, when the landing page renders, then product proof is present", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Logic Pro MCP — Agent-grade control for Logic Pro<\/title>/i);
  assert.match(html, /Give your agent a signal path into Logic Pro/);
  assert.match(html, /10<\/strong><span>MCP tools/);
  assert.match(html, /99<\/strong><span>public commands/);
  assert.match(html, /href="#main">Skip to main content<\/a>/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/);
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

  assert.match(page, /const github = "https:\/\/github\.com\/MongLong0214\/logic-pro-mcp"/);
  assert.match(layout, /images: \["\/og\.png"\]/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.doesNotMatch(page + layout, /_sites-preview|codex-preview|SkeletonPreview/);
});
