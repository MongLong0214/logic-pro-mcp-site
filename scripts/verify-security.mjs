import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [analytics, worker, expectedText] = await Promise.all([
  readFile(new URL("../app/lib/analytics.ts", import.meta.url), "utf8"),
  readFile(new URL("../worker/index.ts", import.meta.url), "utf8"),
  readFile(new URL("../tests/security-policy.json", import.meta.url), "utf8"),
]);
const expected = JSON.parse(expectedText);
for (const forbidden of ["fetch(", "XMLHttpRequest", "sendBeacon", "localStorage", "sessionStorage", "document.cookie"]) {
  assert.doesNotMatch(analytics, new RegExp(forbidden.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
}
assert.match(analytics, /navigator\.doNotTrack/);
assert.match(analytics, /navigator\.globalPrivacyControl/);
assert.match(analytics, /WeakSet<Event>/);
assert.match(analytics, /WeakMap<object, Set<string>>/);
for (const [header, value] of Object.entries(expected)) {
  assert.match(worker.toLowerCase(), new RegExp(header));
  assert.match(worker, new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
}
assert.doesNotMatch(expected["content-security-policy"], /(?:script|connect)-src[^;]*\*/);
console.log("security verification: privacy, deduplication, transport, storage, and response policy passed");
