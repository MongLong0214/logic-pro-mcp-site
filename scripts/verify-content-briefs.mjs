import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [briefs, receipt] = await Promise.all([
  readFile(new URL("../docs/content-briefs.md", import.meta.url), "utf8"),
  readFile(new URL("../docs/evidence/serp-sampling-2026-07-13.md", import.meta.url), "utf8"),
]);
const queries = [
  "logic pro mcp claude code install",
  "logic pro mcp claude desktop setup",
  "logic pro mcp cursor setup",
  "logic pro mcp vscode setup",
  "logic pro mcp server",
  "control logic pro with claude",
  "logic pro mcp compose midi",
  "logic pro mcp mixer automation",
  "logic pro mcp batch export bounce",
];
for (const query of queries) {
  const row = `| \`${query}\` |`;
  assert.equal(briefs.split(row).length - 1, 1, `${query}: content brief row must occur once`);
  assert.equal(receipt.split(row).length - 1, 1, `${query}: SERP receipt row must occur once`);
}
assert.match(receipt, /Accessed UTC: `\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z`/);
assert.match(receipt, /all 18 requests returned HTTP 200/);
assert.match(receipt, /Provider-window method/);
assert.doesNotMatch(receipt, /(?:ranked?|position)\s*#?\d+/i);
console.log("content brief verification: nine exact queries, UTC/method, challenge outcomes, and provider-window sources passed");
