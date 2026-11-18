import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";

const marker = "logic-pro-mcp:analytics-contract";
const assets = new URL("../.next/static/", import.meta.url);
const names = (await readdir(assets, { recursive: true })).filter((name) => name.endsWith(".js"));
// Turbopack may repeat a shared module inside several client chunks, and a chunk
// also holds unrelated modules (for example the media player's same-origin
// download). Only the analytics module itself is inspected: it runs from its
// module header to the next module header in the chunk.
const moduleStart = /(?:^|[,\]\[])(\d+),(?:\w|\([\w,]*\))=>\{/g;
const modules = [];
for (const name of names) {
  const source = await readFile(new URL(name, assets), "utf8");
  let at = source.indexOf(marker);
  while (at !== -1) {
    let start = 0;
    let end = source.length;
    for (const match of source.matchAll(moduleStart)) {
      if (match.index < at) start = match.index;
      else { end = match.index; break; }
    }
    modules.push({ name, source: source.slice(start, end) });
    at = source.indexOf(marker, end);
  }
}
assert.ok(modules.length >= 1, "a production analytics module is required");
for (const { name, source } of modules) {
  assert.ok(source.length < 5000, `${name}: analytics module boundary not found`);
  for (const forbidden of ["fetch(", "XMLHttpRequest", "sendBeacon", "localStorage", "sessionStorage", "document.cookie", "userId", "sessionId", "retainedQueue"]) {
    assert.ok(!source.includes(forbidden), `${name}: analytics bundle contains forbidden primitive ${forbidden}`);
  }
  assert.ok(source.includes(marker), `${name}: contract event missing`);
}
console.log(`bundle privacy verification: ${modules.length} analytics module(s) in ${new Set(modules.map((m) => m.name)).size} chunk(s) have no analytics transport, storage, identifier, or retained queue`);
