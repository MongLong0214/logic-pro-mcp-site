import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { writeToolReceipt } from "./lib/tool-receipt.mjs";

const root = new URL("../", import.meta.url);
const temp = await mkdtemp(join(tmpdir(), "logic-pro-mcp-react-doctor-"));
const spec = "react-doctor@0.7.6";

try {
  const install = spawnSync("npm", ["install", "--prefix", temp, "--no-package-lock", "--no-save", "--ignore-scripts", spec], { stdio: "inherit" });
  assert.equal(install.status, 0, "isolated React Doctor install failed");
  const run = spawnSync(join(temp, "node_modules/.bin/react-doctor"), [root.pathname, "--verbose"], { cwd: root, encoding: "utf8" });
  process.stdout.write(run.stdout);
  process.stderr.write(run.stderr);
  assert.equal(run.status, 0, "React Doctor exited non-zero");
  assert.match(run.stdout, /100 \/ 100 Great/, "React Doctor score must be 100/100");
  await writeToolReceipt({
    temp,
    specs: [spec],
    evidence: new URL("../../../.omo/evidence/react-doctor-toolchain.json", import.meta.url),
    command: "npm run qa:react-doctor",
  });
} finally {
  await rm(temp, { recursive: true, force: true });
}
