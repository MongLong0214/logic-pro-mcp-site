import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { brotliProxyEntryPath } from "../qa/brotli-proxy.mjs";
import { writeToolReceipt } from "./lib/tool-receipt.mjs";

const root = new URL("../", import.meta.url);
const outputRoot = new URL("../../../.omo/evidence/lighthouse-current/", import.meta.url);
const temp = await mkdtemp(join(tmpdir(), "logic-pro-mcp-lighthouse-"));
const routes = [["home", ""], ["install-claude-code", "/install/claude-code"], ["guide-control", "/guides/control-logic-pro-with-claude"], ["use-case-export", "/use-cases/batch-export"]];
const mobileRuns = Number.parseInt(process.env.QA_MOBILE_RUNS ?? "5", 10);
const desktopRuns = Number.parseInt(process.env.QA_DESKTOP_RUNS ?? "3", 10);
const chromeFlags = "--headless --no-sandbox --disable-features=LocalNetworkAccessChecks";
let server;
let compressionProxy;

function terminateProcessTree(child) {
  if (!child?.pid) return;
  try {
    process.kill(-child.pid, "SIGTERM");
  } catch {
    child.kill("SIGTERM");
  }
}

async function waitForServer() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try { if ((await fetch("http://127.0.0.1:4174/")).ok) return; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("production server did not become ready");
}

async function assertPortFree(url, label) {
  try {
    await fetch(url);
  } catch {
    return;
  }
  throw new Error(`${label} QA port is already occupied; refusing to audit an unowned server`);
}

async function waitForCompressionProxy() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try { if ((await fetch("http://127.0.0.1:4175/")).ok) return; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("Brotli QA proxy did not become ready");
}

function median(values) {
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.floor(sorted.length / 2)];
}

try {
  assert.ok(Number.isInteger(mobileRuns) && mobileRuns > 0 && Number.isInteger(desktopRuns) && desktopRuns > 0, "QA run counts must be positive integers");
  await assertPortFree("http://127.0.0.1:4174/", "production server");
  await assertPortFree("http://127.0.0.1:4175/", "Brotli proxy");
  const build = spawnSync("npm", ["run", "build"], { cwd: root, stdio: "inherit" });
  if (build.status !== 0) process.exit(build.status ?? 1);
  const specs = ["lighthouse@13.4.0"];
  const install = spawnSync("npm", ["install", "--prefix", temp, "--no-package-lock", "--no-save", "--ignore-scripts", ...specs], { stdio: "inherit" });
  if (install.status !== 0) process.exit(install.status ?? 1);
  await writeToolReceipt({ temp, specs, evidence: new URL("../../../.omo/evidence/lighthouse-toolchain.json", import.meta.url), command: "npm run qa:lighthouse" });
  await rm(outputRoot, { recursive: true, force: true });
  await mkdir(outputRoot, { recursive: true });
  server = spawn("npm", ["run", "start", "--", "--port", "4174"], { cwd: root, detached: true, stdio: ["ignore", "pipe", "pipe"] });
  await waitForServer();
  compressionProxy = spawn(process.execPath, [brotliProxyEntryPath], { cwd: root, detached: true, stdio: ["ignore", "pipe", "pipe"] });
  await waitForCompressionProxy();
  for (const [label, pathname] of routes) {
    const performanceScores = { mobile: [], desktop: [] };
    for (const [formFactor, count] of [["mobile", mobileRuns], ["desktop", desktopRuns]]) {
      for (let run = 1; run <= count; run += 1) {
        const output = new URL(`${label}-${formFactor}-${run}.json`, outputRoot);
        const args = [
          `http://127.0.0.1:4175${pathname}`, "--quiet", "--output=json", `--output-path=${output.pathname}`,
          "--only-categories=performance", `--chrome-flags=${chromeFlags}`,
          ...(formFactor === "desktop" ? ["--preset=desktop"] : []),
        ];
        const audit = spawnSync(join(temp, "node_modules/.bin/lighthouse"), args, { stdio: "inherit" });
        if (audit.status !== 0) process.exit(audit.status ?? 1);
        const report = JSON.parse(await readFile(output, "utf8"));
        performanceScores[formFactor].push(report.categories.performance.score);
      }
    }
    for (const formFactor of ["mobile", "desktop"]) {
      assert.ok(Math.min(...performanceScores[formFactor]) >= 0.90, `${label} ${formFactor}: no performance sample may fall below 0.90`);
      assert.ok(median(performanceScores[formFactor]) >= 0.95, `${label} ${formFactor}: median performance must be at least 0.95`);
    }
    const categoricalOutput = new URL(`${label}-categorical-direct.json`, outputRoot);
    const categorical = spawnSync(join(temp, "node_modules/.bin/lighthouse"), [
      `http://127.0.0.1:4174${pathname}`, "--quiet", "--output=json", `--output-path=${categoricalOutput.pathname}`,
      "--only-categories=accessibility,best-practices,seo", `--chrome-flags=${chromeFlags}`,
    ], { stdio: "inherit" });
    if (categorical.status !== 0) process.exit(categorical.status ?? 1);
    const categoricalReport = JSON.parse(await readFile(categoricalOutput, "utf8"));
    for (const category of ["accessibility", "best-practices", "seo"]) assert.equal(categoricalReport.categories[category].score, 1, `${label} direct ${category}`);
  }
  console.log(`Lighthouse 13.4.0 isolated matrix: ${routes.length * (mobileRuns + desktopRuns)} production-equivalent Brotli performance audits and ${routes.length} direct categorical audits passed`);
} finally {
  terminateProcessTree(compressionProxy);
  terminateProcessTree(server);
  await rm(temp, { recursive: true, force: true });
}
