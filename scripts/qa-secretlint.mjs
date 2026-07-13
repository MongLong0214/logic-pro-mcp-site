import { spawnSync } from "node:child_process";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { writeToolReceipt } from "./lib/tool-receipt.mjs";

const root = new URL("../", import.meta.url);
const evidence = new URL("../../../.omo/evidence/qa-secretlint-current.json", import.meta.url);
const temp = await mkdtemp(join(tmpdir(), "logic-pro-mcp-secretlint-"));

try {
  const specs = ["secretlint@13.0.2", "@secretlint/secretlint-rule-preset-recommend@13.0.2"];
  const install = spawnSync("npm", ["install", "--prefix", temp, "--no-package-lock", "--no-save", "--ignore-scripts", ...specs], { stdio: "inherit" });
  if (install.status !== 0) process.exit(install.status ?? 1);
  await writeToolReceipt({ temp, specs, evidence: new URL("../../../.omo/evidence/secretlint-toolchain.json", import.meta.url), command: "npm run qa:secretlint" });
  const configPath = join(temp, ".secretlintrc.json");
  await writeFile(configPath, JSON.stringify({ rules: [{ id: "@secretlint/secretlint-rule-preset-recommend" }] }), "utf8");
  const command = join(temp, "node_modules/.bin/secretlint");
  const run = spawnSync(command, ["--secretlintrc", configPath, "--format", "json", "**/*", "!node_modules/**", "!dist/**", "!.next/**", "!.wrangler/**"], { cwd: root, encoding: "utf8", maxBuffer: 20 * 1024 * 1024 });
  await mkdir(new URL("../../../.omo/evidence/", import.meta.url), { recursive: true });
  await writeFile(evidence, run.stdout || JSON.stringify({ stderr: run.stderr, status: run.status }), "utf8");
  if (run.status !== 0) {
    process.stderr.write(run.stderr || run.stdout);
    process.exit(run.status ?? 1);
  }
  console.log("Secretlint 13.0.2 + preset 13.0.2 isolated scan passed; receipt written to .omo/evidence/qa-secretlint-current.json");
} finally {
  await rm(temp, { recursive: true, force: true });
}
