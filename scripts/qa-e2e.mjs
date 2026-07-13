import { spawn, spawnSync } from "node:child_process";
import { cp, mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { writeToolReceipt } from "./lib/tool-receipt.mjs";

const root = new URL("../", import.meta.url);
const evidence = new URL("../../../.omo/evidence/qa-e2e-current.json", import.meta.url);
const temp = await mkdtemp(join(tmpdir(), "logic-pro-mcp-e2e-"));
let server;

async function waitForServer() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch("http://127.0.0.1:4173/");
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("production server did not become ready");
}

try {
  const build = spawnSync("npm", ["run", "build"], { cwd: root, stdio: "inherit" });
  if (build.status !== 0) process.exit(build.status ?? 1);
  const specs = ["@playwright/test@1.61.1", "@axe-core/playwright@4.11.0"];
  const install = spawnSync("npm", ["install", "--prefix", temp, "--no-package-lock", "--no-save", "--ignore-scripts", ...specs], { stdio: "inherit" });
  if (install.status !== 0) process.exit(install.status ?? 1);
  await writeToolReceipt({ temp, specs, evidence: new URL("../../../.omo/evidence/playwright-toolchain.json", import.meta.url), command: "npm run qa:e2e" });
  await cp(new URL("../qa/playwright.config.mjs", import.meta.url), join(temp, "playwright.config.mjs"));
  await cp(new URL("../qa/site.spec.mjs", import.meta.url), join(temp, "site.spec.mjs"));
  server = spawn("npm", ["run", "start", "--", "--port", "4173"], { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
  await waitForServer();
  const evidenceDirectory = new URL("../../../.omo/evidence/playwright/", import.meta.url).pathname;
  const run = spawnSync(join(temp, "node_modules/.bin/playwright"), ["test", "--config", "playwright.config.mjs", "--reporter=json"], { cwd: temp, encoding: "utf8", maxBuffer: 20 * 1024 * 1024, env: { ...process.env, QA_EVIDENCE_DIR: evidenceDirectory } });
  await mkdir(new URL("../../../.omo/evidence/", import.meta.url), { recursive: true });
  await writeFile(evidence, run.stdout || JSON.stringify({ error: run.stderr }), "utf8");
  if (run.status !== 0) {
    process.stderr.write(run.stderr || run.stdout);
    process.exit(run.status ?? 1);
  }
  console.log("Playwright 1.61.1 + Axe 4.11.0 isolated E2E passed; receipt written to .omo/evidence/qa-e2e-current.json");
} finally {
  server?.kill("SIGTERM");
  await rm(temp, { recursive: true, force: true });
}
