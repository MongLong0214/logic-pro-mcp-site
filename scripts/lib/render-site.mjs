import assert from "node:assert/strict";

export const acquisitionRoutes = [
  "/install/claude-code", "/install/claude-desktop", "/install/cursor", "/install/vscode",
  "/guides/logic-pro-mcp", "/guides/control-logic-pro-with-claude",
  "/use-cases/compose-midi", "/use-cases/mixer-automation", "/use-cases/batch-export",
];

export async function render(pathname = "/") {
  const workerUrl = new URL("../../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("verifier", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);
  const response = await worker.fetch(
    new Request(`http://localhost${pathname}`),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  assert.equal(response.status, 200, `${pathname} must render`);
  return { response, body: await response.text() };
}

export function decodeHtml(value) {
  return value.replaceAll("&quot;", '"').replaceAll("&#x27;", "'").replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">");
}

export function normalizeText(value) {
  return decodeHtml(value).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
