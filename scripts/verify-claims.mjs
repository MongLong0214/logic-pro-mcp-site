import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { claimLedger, declaredMaterialClaims } from "../app/content/claim-ledger.ts";
import { productFacts } from "../app/content/product-facts.ts";
import { pageRecords, routePaths } from "../app/content/page-records.ts";

const root = new URL("../", import.meta.url);
const routeSet = new Set(["/", "/llms.txt", ...routePaths]);
const sha256 = /^[a-f0-9]{64}$/;
const accessedUtc = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
const today = Date.now();

function decodeHtml(value) {
  return value.replaceAll("&quot;", '"').replaceAll("&#x27;", "'")
    .replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">");
}

function normalize(value) {
  return decodeHtml(value).replace(/\s+/g, " ").trim();
}

async function render(pathname) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("claim-verifier", `${process.pid}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);
  const response = await worker.fetch(
    new Request(`http://localhost${pathname}`),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  assert.equal(response.status, 200, `${pathname} must render for claim verification`);
  return response.text();
}

function surfacesFor(pathname, body) {
  if (pathname === "/llms.txt") return { llms: normalize(body) };
  const head = body.match(/<head>([\s\S]*?)<\/head>/i)?.[1] ?? "";
  const jsonLd = [...body.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/gi)]
    .map((match) => JSON.stringify(JSON.parse(match[1]))).join(" ");
  const ui = body.replace(/<head>[\s\S]*?<\/head>/i, " ").replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ");
  return { ui: normalize(ui), metadata: normalize(head), jsonld: normalize(jsonLd) };
}

function taggedPathAndHeading(claim) {
  const match = claim.sourceRef.match(/^v([^:]+):([^#]+)#(.+)$/);
  assert.ok(match, `${claim.key}: tagged sourceRef must be v<release>:path#heading`);
  assert.equal(match[1], productFacts.version, `${claim.key}: tagged evidence release drifted`);
  assert.ok(claim.sourceUrl.includes(`/blob/v${productFacts.version}/${match[2]}`), `${claim.key}: URL/path mismatch`);
  const headingSlug = claim.sourceHeading.toLowerCase().replace(/[^a-z0-9_]+/g, "-").replace(/^-|-$/g, "");
  assert.equal(match[3].toLowerCase(), headingSlug, `${claim.key}: heading mismatch`);
}

const keys = new Set();
const subjects = new Map();
const evidenceCache = new Map();
const rendered = new Map();
for (const route of routeSet) rendered.set(route, { body: await render(route), surfaces: undefined });
for (const route of routeSet) rendered.get(route).surfaces = surfacesFor(route, rendered.get(route).body);

for (const claim of claimLedger) {
  assert.ok(!keys.has(claim.key), `duplicate claim key: ${claim.key}`);
  keys.add(claim.key);
  for (const field of ["key", "subject", "value", "exactText", "sourceExcerpt", "sourceUrl", "sourceRef", "sourceHeading", "evidenceFile", "scope", "limitation", "owner"]) {
    assert.equal(typeof claim[field], "string", `${claim.key}: ${field} must be a string`);
    assert.ok(claim[field].trim(), `${claim.key}: ${field} must not be empty`);
  }
  assert.match(claim.sourceSha256, sha256, `${claim.key}: invalid SHA-256`);
  assert.match(claim.accessedAt, accessedUtc, `${claim.key}: accessedAt must be exact UTC`);
  assert.ok(Date.parse(claim.accessedAt) <= today, `${claim.key}: access cannot be in the future`);
  assert.ok(claim.sourceUrl.startsWith("https://"), `${claim.key}: source URL must use HTTPS`);

  if (claim.sourceType === "tagged-source") {
    assert.equal(claim.expiryPolicy, "on-release-change", `${claim.key}: product evidence expires on release change`);
    assert.equal(claim.expiresAt, null, `${claim.key}: release-pinned evidence has no time expiry`);
    taggedPathAndHeading(claim);
  } else {
    assert.equal(claim.expiryPolicy, "90-days", `${claim.key}: official docs use 90-day expiry`);
    assert.equal(claim.expiresAt, "2026-10-11T05:56:43Z", `${claim.key}: official docs expiry must be 2026-10-11`);
    assert.ok(today <= Date.parse(claim.expiresAt), `${claim.key}: official evidence expired`);
    assert.ok(claim.sourceRef.startsWith(`${claim.sourceUrl}#`), `${claim.key}: official sourceRef must anchor its URL`);
  }

  let evidence = evidenceCache.get(claim.evidenceFile);
  if (!evidence) {
    const bytes = await readFile(new URL(claim.evidenceFile, root));
    evidence = bytes.toString("utf8");
    assert.equal(createHash("sha256").update(bytes).digest("hex"), claim.sourceSha256, `${claim.key}: evidence hash mismatch`);
    evidenceCache.set(claim.evidenceFile, evidence);
  }
  assert.ok(evidence.includes(`Source URL: ${claim.sourceUrl}`), `${claim.key}: evidence lacks exact source URL`);
  assert.ok(evidence.includes(`Accessed UTC: ${claim.accessedAt}`), `${claim.key}: evidence lacks access UTC`);
  assert.ok(normalize(evidence).includes(normalize(claim.sourceExcerpt)), `${claim.key}: evidence lacks exact primary-source excerpt`);
  assert.ok(normalize(evidence).toLowerCase().includes(normalize(claim.sourceHeading).toLowerCase()), `${claim.key}: evidence lacks source heading`);

  const previous = subjects.get(claim.subject);
  assert.ok(previous === undefined || previous === claim.value, `${claim.key}: contradictory value for ${claim.subject}`);
  subjects.set(claim.subject, claim.value);
  assert.ok(claim.routes.length > 0 && claim.surfaces.length > 0, `${claim.key}: rendered coverage required`);
  for (const route of claim.routes) {
    assert.ok(routeSet.has(route), `${claim.key}: unknown route ${route}`);
  }
  for (const surface of claim.surfaces) {
    const found = claim.routes.some((route) => rendered.get(route).surfaces[surface]?.includes(normalize(claim.exactText)));
    assert.ok(found, `${claim.key}: exact text missing from ${surface} across ${claim.routes.join(", ")}`);
  }
}

for (const [route, result] of rendered) {
  for (const match of result.body.matchAll(/data-claim-key="([^"]+)"[^>]*>([\s\S]*?)<\//g)) {
    const claim = claimLedger.find((entry) => entry.key === decodeHtml(match[1]));
    assert.ok(claim, `${route}: unknown data-claim-key ${match[1]}`);
    const nodeText = normalize(match[2].replace(/<[^>]+>/g, " "));
    assert.ok(nodeText.includes(normalize(claim.exactText)), `${route}: tagged claim ${claim.key} does not contain its exact text`);
    assert.ok(claim.routes.includes(route), `${route}: tagged claim ${claim.key} lacks declared route`);
    assert.ok(claim.surfaces.includes("ui"), `${route}: tagged claim ${claim.key} lacks UI surface`);
  }
}

const installUiClaims = claimLedger.filter((claim) => claim.key.startsWith("install.") && claim.surfaces.includes("ui"));
for (const claim of installUiClaims) {
  const body = rendered.get(claim.routes[0]).body;
  assert.ok(body.includes(`data-claim-key="${claim.key}"`), `${claim.key}: material install fact is not reverse-tagged`);
}

for (const [surface, routes] of Object.entries(declaredMaterialClaims)) {
  for (const [route, claimKeys] of Object.entries(routes)) {
    for (const key of claimKeys) {
      const claim = claimLedger.find((entry) => entry.key === key);
      assert.ok(claim, `${surface}/${route}: undeclared claim key ${key}`);
      assert.ok(claim.surfaces.includes(surface), `${key}: missing declared ${surface} surface`);
      assert.ok(claim.routes.includes(route), `${key}: missing declared ${route} route`);
      assert.ok(rendered.get(route).surfaces[surface].includes(normalize(claim.exactText)), `${key}: declared exact text missing`);
    }
  }
}

function requireReverseCoverage(record, exactText, surface, field) {
  const matches = claimLedger.filter((claim) => claim.routes.includes(record.path) && claim.surfaces.includes(surface) && claim.exactText === exactText);
  assert.ok(matches.length > 0, `${record.path}: ${field} lacks reverse ${surface} claim coverage`);
}

for (const record of Object.values(pageRecords)) {
  requireReverseCoverage(record, record.title, "metadata", "title");
  requireReverseCoverage(record, record.title, "jsonld", "title");
  requireReverseCoverage(record, record.description, "metadata", "description");
  requireReverseCoverage(record, record.description, "jsonld", "description");
  requireReverseCoverage(record, record.h1, "ui", "h1");
  requireReverseCoverage(record, record.lead, "ui", "lead");
  record.prerequisites.forEach((text, index) => requireReverseCoverage(record, text, "ui", `prerequisite.${index}`));
  record.steps.forEach((step, index) => {
    requireReverseCoverage(record, step.name, "ui", `step.${index}.name`);
    requireReverseCoverage(record, step.text, "ui", `step.${index}.text`);
    if (record.kind === "install") {
      requireReverseCoverage(record, step.name, "jsonld", `step.${index}.name`);
      requireReverseCoverage(record, step.text, "jsonld", `step.${index}.text`);
    }
  });
  requireReverseCoverage(record, record.success, "ui", "success");
  requireReverseCoverage(record, record.boundary, "ui", "boundary");
}

assert.deepEqual([...new Set(claimLedger.flatMap((claim) => claim.surfaces))].sort(), ["jsonld", "llms", "metadata", "ui"]);
console.log(`claim verification: ${claimLedger.length} claims; exact excerpts, 90-day/release expiry, hashes, and reverse route/surface coverage passed`);
