import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const files = await Promise.all([
  readFile(new URL("../app/content/page-records.ts", import.meta.url), "utf8"),
  readFile(new URL("../app/content/claim-ledger.ts", import.meta.url), "utf8"),
  readFile(new URL("../app/lib/analytics.ts", import.meta.url), "utf8"),
  readFile(new URL("../worker/index.ts", import.meta.url), "utf8"),
  readFile(new URL("../tests/security-policy.json", import.meta.url), "utf8"),
]);
const [routes, claims, analytics, worker, policyText] = files;
const policy = JSON.parse(policyText);

for (const pathname of ["/install/claude-code", "/install/claude-desktop", "/install/cursor", "/install/vscode", "/guides/logic-pro-mcp", "/guides/control-logic-pro-with-claude", "/use-cases/compose-midi", "/use-cases/mixer-automation", "/use-cases/batch-export"]) {
  assert.match(routes, new RegExp(pathname.replaceAll("/", "\\/")));
}
for (const field of ["sourceSha256", "observedAt", "expiresAt", "limitation", "owner"]) assert.match(claims, new RegExp(field));
for (const forbidden of ["fetch(", "localStorage", "sessionStorage", "document.cookie", "navigator.sendBeacon"]) assert.doesNotMatch(analytics, new RegExp(forbidden.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
assert.match(analytics, /NOT_CONFIGURED/);
for (const [header, value] of Object.entries(policy)) {
  assert.match(worker.toLowerCase(), new RegExp(header));
  assert.match(worker, new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
}
assert.doesNotMatch(policy["content-security-policy"], /script-src[^;]*\*/);
assert.doesNotMatch(policy["content-security-policy"], /connect-src[^;]*\*/);
console.log("site verification: routes, claims, privacy, and security policy passed");
