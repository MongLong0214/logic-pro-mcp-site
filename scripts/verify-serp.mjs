import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { routePaths } from "../app/content/page-records.ts";

const expectedQueries = [
  "install logic pro mcp claude code", "logic pro mcp claude desktop", "logic pro mcp cursor", "logic pro mcp vscode",
  "logic pro mcp server", "control logic pro with claude mcp", "logic pro mcp compose midi",
  "logic pro mcp mixer automation", "logic pro mcp batch export",
];
const record = JSON.parse(await readFile(new URL("../docs/serp-observations.json", import.meta.url), "utf8"));
assert.deepEqual(record.queries.map((entry) => entry.query), expectedQueries, "all nine exact acquisition queries are required in route order");
assert.deepEqual(record.queries.map((entry) => entry.route), [...routePaths], "each acquisition route must own one query record");
assert.match(record.accessedAt, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
assert.match(record.providerWindow, /qualitative, non-positional top-10 provider window/);
assert.deepEqual(record.prohibitedInferences, ["rank", "search volume", "traffic", "ranking probability"]);
for (const entry of record.queries) {
  assert.equal(entry.accessedAt, record.accessedAt, `${entry.query}: exact access UTC required`);
  assert.equal(entry.method, "signed-out provider index sample", `${entry.query}: exact method required`);
  assert.match(entry.challenge, /Google and Bing.*challenge shells/, `${entry.query}: direct-engine challenge required`);
  assert.equal(entry.providerWindow, record.providerWindow, `${entry.query}: provider window drift`);
  assert.ok(entry.signals.length >= 2, `${entry.query}: at least two qualitative signals required`);
  for (const signal of entry.signals) {
    assert.ok(signal.heading.trim(), `${entry.query}: exact source heading required`);
    assert.ok(signal.url.startsWith("https://"), `${entry.query}: HTTPS source required`);
    assert.equal(signal.accessedAt, record.accessedAt, `${entry.query}: signal access UTC required`);
  }
}
console.log("SERP verification: nine exact queries, UTC access, challenge fallback, headings, and non-positional provider windows passed");
