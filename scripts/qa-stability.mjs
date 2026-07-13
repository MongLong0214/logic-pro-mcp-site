import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const evidence = new URL("../../../.omo/evidence/task-8-stability-receipt.json", import.meta.url);
const runs = [];

for (let index = 1; index <= 3; index += 1) {
  const startedAt = new Date().toISOString();
  const started = performance.now();
  const result = spawnSync("npm", ["test"], { cwd: root, stdio: "inherit" });
  assert.equal(result.status, 0, `npm test stability run ${index} failed`);
  runs.push({ run: index, startedAt, durationMs: Math.round(performance.now() - started), status: "passed" });
}

const checks = [
  ["lint", ["run", "lint"]],
  ["typecheck", ["run", "typecheck"]],
];
const checkResults = checks.map(([name, args]) => {
  const result = spawnSync("npm", args, { cwd: root, stdio: "inherit" });
  assert.equal(result.status, 0, `${name} failed`);
  return { name, status: "passed" };
});
const audits = [["app", ["audit", "--audit-level=high", "--json"]], ["production", ["audit", "--omit=dev", "--audit-level=high", "--json"]]].map(([name, args]) => {
  const result = spawnSync("npm", args, { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 0, `${name} npm audit failed`);
  const report = JSON.parse(result.stdout);
  assert.equal(report.metadata.vulnerabilities.total, 0, `${name} npm audit must report zero vulnerabilities`);
  return { name, vulnerabilities: report.metadata.vulnerabilities, status: "passed" };
});

await mkdir(new URL(".", evidence), { recursive: true });
await writeFile(evidence, `${JSON.stringify({
  schema: "logic-pro-mcp-site.stability.v1",
  completedAt: new Date().toISOString(),
  command: "npm run qa:stability",
  runs,
  checks: checkResults,
  audits,
  status: "passed",
}, null, 2)}\n`, "utf8");
console.log("stability gate: npm test 3x, lint, typecheck, app audit 0, and production audit 0 passed");
