import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, mkdir, writeFile, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

test("a performance run refuses old reports before building or writing new ones", async () => {
  const directory = await mkdtemp(join(tmpdir(), "logic-site-old-report-control-"));
  try {
    const output = join(directory, "reports");
    const binaries = join(directory, "bin");
    await mkdir(output);
    await mkdir(binaries);
    const oldReport = join(output, "home-mobile-5.json");
    await writeFile(oldReport, "preserved historical report\n");
    // Any build attempt is a defect: this witness never installs tools or starts a server.
    await writeFile(join(binaries, "npm"), "#!/bin/sh\necho unexpected-build-attempt\nexit 90\n", { mode: 0o755 });
    const result = spawnSync(process.execPath, ["scripts/qa-lighthouse.mjs"], {
      cwd: new URL("../", import.meta.url), encoding: "utf8",
      env: { ...process.env, PATH: binaries, QA_LIGHTHOUSE_DIR: output,
        QA_SERVER_PORT: "5280", QA_PROXY_PORT: "5281", QA_MOBILE_RUNS: "1", QA_DESKTOP_RUNS: "1" },
    });
    assert.match(result.stderr, /already contains reports/);
    assert.doesNotMatch(result.stdout, /unexpected-build-attempt/);
    assert.equal(await readFile(oldReport, "utf8"), "preserved historical report\n");
  } finally { await rm(directory, { recursive: true, force: true }); }
});

test("a fresh smoke matrix cannot satisfy the full report verifier", async () => {
  const output = await mkdtemp(join(tmpdir(), "logic-site-report-matrix-control-"));
  try {
    // Synthetic shape controls, not measurements or product performance credit.
    const report = { lighthouseVersion: "13.4.0", categories: {
      performance: { score: 1 }, accessibility: { score: 1 },
      "best-practices": { score: 1 }, seo: { score: 1 },
    } };
    const routes = ["home", "install-claude-code", "guide-control", "use-case-export"];
    const verify = () => spawnSync(process.execPath, ["scripts/verify-lighthouse-evidence.mjs"], {
      cwd: new URL("../", import.meta.url), encoding: "utf8",
      env: { ...process.env, QA_LIGHTHOUSE_DIR: output },
    });
    for (const route of routes) {
      for (const profile of ["mobile", "desktop"]) {
        await writeFile(join(output, `${route}-${profile}-1.json`), JSON.stringify(report));
      }
      await writeFile(join(output, `${route}-categorical-direct.json`), JSON.stringify(report));
    }
    const smoke = verify();
    assert.notEqual(smoke.status, 0);
    assert.match(smoke.stderr, /ENOENT.*home-mobile-2\.json/s);
    for (const route of routes) {
      for (const [profile, count] of [["mobile", 5], ["desktop", 3]]) {
        for (let run = 2; run <= count; run++) {
          await writeFile(join(output, `${route}-${profile}-${run}.json`), JSON.stringify(report));
        }
      }
    }
    const full = verify();
    assert.equal(full.status, 0, full.stderr);
    assert.match(full.stdout, /36 reports/);
  } finally { await rm(output, { recursive: true, force: true }); }
});
