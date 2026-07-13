import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const lock = JSON.parse(await readFile(new URL("../package-lock.json", import.meta.url), "utf8"));
const packages = lock.packages;
const allowed = new Set(["MIT", "Apache-2.0", "BSD-2-Clause", "BSD-3-Clause", "ISC", "0BSD", "CC0-1.0"]);
const pending = Object.keys(packages[""]?.dependencies ?? {});
const visited = new Set();
const inventory = [];

while (pending.length > 0) {
  const name = pending.shift();
  if (!name || visited.has(name)) continue;
  visited.add(name);
  const record = packages[`node_modules/${name}`];
  assert.ok(record, `missing lock record for ${name}`);
  assert.ok(typeof record.license === "string" && allowed.has(record.license), `${name} has disallowed or unknown license: ${record.license ?? "unknown"}`);
  inventory.push({ name, version: record.version, license: record.license });
  pending.push(...Object.keys(record.dependencies ?? {}));
}

inventory.sort((left, right) => left.name.localeCompare(right.name));
console.log(JSON.stringify({ scope: "production dependency closure", packages: inventory }, null, 2));
