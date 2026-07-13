import assert from "node:assert/strict";
import { acquisitionRoutes, normalizeText, render } from "./lib/render-site.mjs";

for (const pathname of acquisitionRoutes) {
  const { body } = await render(pathname);
  const match = body.match(/<script type="application\/ld\+json">([^<]+)<\/script>/i);
  assert.ok(match, `${pathname}: JSON-LD required`);
  const graph = JSON.parse(match[1])["@graph"];
  const types = graph.map((entry) => entry["@type"]);
  if (pathname.startsWith("/install/")) {
    assert.deepEqual(types, ["WebPage", "BreadcrumbList", "HowTo"], `${pathname}: exact schema graph`);
    const visibleSteps = [...body.matchAll(/<li><span>\d+<\/span><div><h3>([^<]+)<\/h3><p(?: [^>]*)?>([^<]+)<\/p>/g)]
      .map((entry) => ({ name: normalizeText(entry[1]), text: normalizeText(entry[2]) }));
    const structuredSteps = graph[2].step.map((entry) => ({ name: entry.name, text: entry.text }));
    assert.deepEqual(structuredSteps, visibleSteps, `${pathname}: HowTo must match visible steps`);
  } else {
    assert.deepEqual(types, ["WebPage", "BreadcrumbList"], `${pathname}: guides/use-cases must not claim article authorship`);
  }
}
console.log("schema verification: exact graphs and visible HowTo parity passed");
