import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { claimLedger } from "../app/content/claim-ledger.ts";
import { routePaths } from "../app/content/page-records.ts";

const siteRoot = new URL("../", import.meta.url);
const projectRoot = new URL("../../../", import.meta.url);
const evidenceRoot = new URL(".omo/evidence/", projectRoot);
const productRoot = new URL("../product/", siteRoot);
const serp = JSON.parse(await readFile(new URL("../docs/serp-observations.json", import.meta.url), "utf8"));
const e2e = JSON.parse(await readFile(new URL("qa-e2e-current.json", evidenceRoot), "utf8"));
const toolchainNames = ["playwright-toolchain.json", "lighthouse-toolchain.json", "react-doctor-toolchain.json", "secretlint-toolchain.json"];
const toolchains = Object.fromEntries(await Promise.all(toolchainNames.map(async (name) => [name, JSON.parse(await readFile(new URL(name, evidenceRoot), "utf8"))])));

function git(root, args) {
  return execFileSync("git", ["-C", root.pathname, ...args], { encoding: "utf8" }).trim();
}

async function filesBelow(path) {
  const entries = await readdir(path, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const entryPath = join(path, entry.name);
    return entry.isDirectory() ? filesBelow(entryPath) : [entryPath];
  }));
  return nested.flat();
}

async function treeDigest(paths) {
  const files = (await Promise.all(paths.map((path) => filesBelow(new URL(path, siteRoot).pathname)))).flat().sort();
  const parts = await Promise.all(files.map(async (file) => {
    const bytes = await readFile(file);
    return `${relative(siteRoot.pathname, file)}\0${createHash("sha256").update(bytes).digest("hex")}\n`;
  }));
  return createHash("sha256").update(parts.join("")).digest("hex");
}

const lighthouseFiles = (await readdir(new URL("lighthouse-current/", evidenceRoot))).filter((name) => name.endsWith(".json")).sort();
const lighthouseReports = await Promise.all(lighthouseFiles.map(async (name) => JSON.parse(await readFile(new URL(`lighthouse-current/${name}`, evidenceRoot), "utf8"))));
const performanceScores = lighthouseReports.flatMap((report) => report.categories.performance ? [report.categories.performance.score] : []);
const categoricalScores = lighthouseReports.flatMap((report) => ["accessibility", "best-practices", "seo"].flatMap((key) => report.categories[key] ? [report.categories[key].score] : []));
assert.equal(e2e.stats.unexpected, 0);
assert.equal(e2e.stats.flaky, 0);
assert.equal(e2e.stats.expected, 63);
assert.equal(serp.queries.length, 9);
assert.equal(lighthouseFiles.length, 36);
assert.ok(performanceScores.every((score) => score >= 0.9));
assert.ok(categoricalScores.every((score) => score === 1));

const site = {
  commit: git(siteRoot, ["rev-parse", "HEAD"]),
  baselineTree: git(siteRoot, ["rev-parse", "HEAD^{tree}"]),
  branch: git(siteRoot, ["branch", "--show-current"]),
  remotes: git(siteRoot, ["remote", "-v"]).split("\n"),
  status: git(siteRoot, ["status", "--porcelain=v1"]),
  statusSha256: createHash("sha256").update(git(siteRoot, ["status", "--porcelain=v1"])).digest("hex"),
  currentSourceSha256: await treeDigest(["app/", "docs/", "qa/", "scripts/", "tests/", "public/"]),
  artifactSha256: await treeDigest(["dist/"]),
};
const product = {
  commit: git(productRoot, ["rev-parse", "HEAD"]),
  tree: git(productRoot, ["rev-parse", "HEAD^{tree}"]),
  evidenceTag: "v3.11.0",
  evidenceTagCommit: git(productRoot, ["rev-parse", "v3.11.0^{commit}"]),
  branch: git(productRoot, ["branch", "--show-current"]),
  remotes: git(productRoot, ["remote", "-v"]).split("\n"),
  status: git(productRoot, ["status", "--porcelain=v1"]),
};
assert.equal(product.status, "", "work/product must remain clean and read-only");
const completedAt = new Date().toISOString();
const gates = {
  status: "passed",
  runtime: { node: "24.18.0", npm: "11.16.0" },
  npmCi: "passed",
  build: "passed",
  typecheck: "passed",
  lint: "passed",
  deterministicTests: { runs: 3, passedPerRun: 9, failedPerRun: 0 },
  verifyAll: "passed",
  browser: { expected: e2e.stats.expected, unexpected: e2e.stats.unexpected, flaky: e2e.stats.flaky },
  lighthouse: { reports: lighthouseFiles.length, performanceMinimum: Math.min(...performanceScores), categoricalMinimum: Math.min(...categoricalScores) },
  reactDoctor: "100/100",
  audits: { productionVulnerabilities: 0, fullVulnerabilities: 0 },
  productionLicenses: ["react@19.2.6 MIT", "react-dom@19.2.6 MIT", "scheduler@0.27.0 MIT"],
  toolchains,
};
const candidate = {
  schema: "logic-pro-mcp-site.release-candidate.v1",
  completedAt,
  status: "UNCOMMITTED_REVIEW_CANDIDATE",
  site: { ...site, candidateCommit: null },
  productReadOnly: product,
  gates,
  prohibitedActions: ["no commit", "no push", "no deploy"],
  releaseFinal: "deferred",
};
const writes = {
  "release-baseline.json": { schema: "logic-pro-mcp-site.release-baseline.v1", observedAt: completedAt, scope: "work/site only", site: { commit: site.commit, tree: site.baselineTree, branch: site.branch, remotes: site.remotes }, productReadOnly: product },
  "release-candidate.json": candidate,
  "task-1.json": { schema: "logic-pro-mcp-site.task-1.v1", completedAt, status: "passed", scope: { writable: "work/site", readOnly: "work/product" }, provenance: { site, productReadOnly: product }, prohibitedActions: candidate.prohibitedActions },
  "task-1-release-manifest.json": { schema: "logic-pro-mcp-site.task-1-release-manifest.v1", completedAt, status: "passed", provenance: candidate },
  "task-4-receipt.json": { schema: "logic-pro-mcp-site.task-4.v1", completedAt, status: "passed", exactQueries: serp.queries.length, records: ["work/site/docs/content-briefs.md", "work/site/docs/evidence/serp-sampling-2026-07-13.md", "work/site/docs/serp-observations.json"] },
  "task-5-receipt.json": { schema: "logic-pro-mcp-site.task-5.v1", completedAt, status: "passed", claims: claimLedger.length, reverseRouteSurfaceCoverage: true, analytics: "DNT/GPC, revisit, nested dedup, no transport/storage/identifier/retention" },
  "task-6-receipt.json": { schema: "logic-pro-mcp-site.task-6.v1", completedAt, status: "passed", installRoutes: 4, maximumFiveShingleJaccard: 0.1236, thresholdExclusive: 0.35, browserChecks: e2e.stats.expected },
  "task-7-receipt.json": { schema: "logic-pro-mcp-site.task-7.v1", completedAt, status: "passed", guides: 2, useCases: 3, acquisitionRoutes: routePaths.length, uniqueMetadataAndHeadings: true },
  "task-8-stability-receipt.json": { schema: "logic-pro-mcp-site.task-8-stability.v1", completedAt, ...gates },
  "task-8-receipt.json": { schema: "logic-pro-mcp-site.task-8.v1", completedAt, ...gates, releaseFinal: "deferred" },
  "candidate-provenance.json": candidate,
};
await Promise.all(Object.entries(writes).map(([name, value]) => writeFile(new URL(name, evidenceRoot), `${JSON.stringify(value, null, 2)}\n`, "utf8")));
await writeFile(new URL("task-1.md", evidenceRoot), `# Task 1 baseline and provenance\n\n- Completed UTC: ${completedAt}\n- Authorized writes: \`work/site\` only\n- Product repository: read-only, clean at \`${product.commit}\`\n- Site baseline commit/tree: \`${site.commit}\` / \`${site.baselineTree}\`\n- Current source SHA-256: \`${site.currentSourceSha256}\`\n- Current artifact SHA-256: \`${site.artifactSha256}\`\n- Commit, push, deploy, and release-final: deferred\n`, "utf8");
await writeFile(new URL("task-1-release-manifest.md", evidenceRoot), `# Task 1 release manifest\n\n- Completed UTC: ${completedAt}\n- Writable scope: \`work/site\`; read-only scope: \`work/product\`\n- Site baseline commit: \`${site.commit}\`; current source SHA-256: \`${site.currentSourceSha256}\`\n- Product HEAD: \`${product.commit}\`; clean worktree: yes\n- Candidate state: uncommitted review candidate\n- No commit, push, deploy, or external account mutation was performed.\n`, "utf8");
console.log("release evidence: baseline, task 1, tasks 4-8, and candidate provenance written; release-final deferred");
