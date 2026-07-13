import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../../../.omo/evidence/lighthouse-current/", import.meta.url);
const routes = ["home", "install-claude-code", "guide-control", "use-case-export"];
function median(values) {
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.floor(sorted.length / 2)];
}
for (const route of routes) {
  for (const [profile, count] of [["mobile", 5], ["desktop", 3]]) {
    const scores = [];
    for (let run = 1; run <= count; run += 1) {
      const report = JSON.parse(await readFile(new URL(`${route}-${profile}-${run}.json`, root), "utf8"));
      assert.equal(report.lighthouseVersion, "13.4.0", `${route}/${profile}/${run}: Lighthouse version drift`);
      scores.push(report.categories.performance.score);
    }
    assert.ok(Math.min(...scores) >= 0.9, `${route}/${profile}: minimum performance below 0.90`);
    assert.ok(median(scores) >= 0.95, `${route}/${profile}: median performance below 0.95`);
  }
  const categorical = JSON.parse(await readFile(new URL(`${route}-categorical-direct.json`, root), "utf8"));
  assert.equal(categorical.lighthouseVersion, "13.4.0", `${route}: categorical Lighthouse version drift`);
  for (const category of ["accessibility", "best-practices", "seo"]) assert.equal(categorical.categories[category].score, 1, `${route}: ${category} must be 100`);
}
console.log("Lighthouse evidence verification: 36 reports, exact 13.4.0, performance thresholds, and categorical 100s passed");
