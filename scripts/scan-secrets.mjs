import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { extname, join } from "node:path";

const roots = ["app", "public", "worker", "scripts", "tests", "docs"];
const patterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\bgh[oprsu]_[A-Za-z0-9]{36,}\b/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\bBearer\s+[A-Za-z0-9._~-]{24,}\b/i,
  /(?:api[_-]?key|client[_-]?secret|password)\s*[:=]\s*["'][^"']{12,}["']/i,
];
async function walk(relative) {
  for (const entry of await readdir(relative, { withFileTypes: true })) {
    const path = join(relative, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if ([".ts", ".tsx", ".js", ".mjs", ".css", ".md", ".txt", ".json", ".svg"].includes(extname(path))) {
      const content = await readFile(path, "utf8");
      if (!path.endsWith("scan-secrets.mjs")) for (const pattern of patterns) assert.doesNotMatch(content, pattern, `possible secret in ${path}`);
    }
  }
}
for (const root of roots) await walk(root);
console.log("secret scan: no credential-shaped values found in shipped source or content");
