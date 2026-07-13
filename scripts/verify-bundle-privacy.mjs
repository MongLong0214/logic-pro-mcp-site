import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";

const assets = new URL("../dist/client/assets/", import.meta.url);
const names = (await readdir(assets)).filter((name) => name.endsWith(".js"));
const matches = [];
for (const name of names) {
  const source = await readFile(new URL(name, assets), "utf8");
  if (source.includes("logic-pro-mcp:analytics-contract")) matches.push({ name, source });
}
assert.equal(matches.length, 1, "exactly one production analytics bundle is required");
const [{ name, source }] = matches;
for (const forbidden of ["fetch(", "XMLHttpRequest", "sendBeacon", "localStorage", "sessionStorage", "document.cookie", "userId", "sessionId", "retainedQueue"]) {
  assert.ok(!source.includes(forbidden), `${name}: analytics bundle contains forbidden primitive ${forbidden}`);
}
assert.ok(source.includes("logic-pro-mcp:analytics-contract"), `${name}: contract event missing`);
console.log(`bundle privacy verification: ${name} has no analytics transport, storage, identifier, or retained queue`);
