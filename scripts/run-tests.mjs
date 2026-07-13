import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";

const testFiles = readdirSync("tests").filter((file) => file.endsWith(".test.mjs")).sort().map((file) => `tests/${file}`);

const commands = [
  ["npm", ["run", "build"]],
  ["node", ["--experimental-strip-types", "--test", ...testFiles]],
  ["node", ["scripts/verify-all.mjs"]],
];
for (const [command, args] of commands) {
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
