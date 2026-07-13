import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { extname, join } from "node:path";

const roots = ["app", "public", "worker", "docs"];
const forbiddenNames = [/skeleton/i, /starter/i, /debug\.(?:log|txt)$/i, /report\.html$/i];
const forbiddenContent = [/Your site is taking shape/i, /codex-preview/i, /react-loading-skeleton/i];
async function walk(relative) {
  for (const entry of await readdir(relative, { withFileTypes: true })) {
    const path = join(relative, entry.name);
    assert.ok(!forbiddenNames.some((pattern) => pattern.test(entry.name)), `forbidden artifact: ${path}`);
    if (entry.isDirectory()) await walk(path);
    else if ([".ts", ".tsx", ".js", ".mjs", ".css", ".md", ".txt", ".json"].includes(extname(path))) {
      const content = await readFile(path, "utf8");
      if (!path.endsWith("verify-artifacts.mjs")) for (const pattern of forbiddenContent) assert.doesNotMatch(content, pattern, `forbidden starter content: ${path}`);
    }
  }
}
for (const root of roots) await walk(root);
console.log("artifact verification: source and public deliverables contain no starter/debug residue");
