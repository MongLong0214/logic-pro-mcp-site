import { spawnSync } from "node:child_process";

const checks = [
  ["node", ["--experimental-strip-types", "scripts/verify-claims.mjs"]],
  ["node", ["scripts/verify-routes.mjs"]],
  ["node", ["scripts/verify-links.mjs"]],
  ["node", ["scripts/verify-schema.mjs"]],
  ["node", ["scripts/verify-security.mjs"]],
  ["node", ["scripts/verify-serp.mjs"]],
  ["node", ["scripts/verify-bundle-privacy.mjs"]],
  ["node", ["scripts/verify-content-briefs.mjs"]],
  ["node", ["scripts/verify-artifacts.mjs"]],
  ["node", ["scripts/scan-secrets.mjs"]],
  ["node", ["scripts/verify-production-licenses.mjs"]],
];
for (const [command, args] of checks) {
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
