import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

function packageName(spec) {
  if (spec.startsWith("@")) return spec.slice(0, spec.indexOf("@", 1));
  return spec.slice(0, spec.lastIndexOf("@"));
}

export async function writeToolReceipt({ temp, specs, evidence, command }) {
  const packages = await Promise.all(specs.map(async (spec) => {
    const name = packageName(spec);
    const manifestBytes = await readFile(join(temp, "node_modules", name, "package.json"));
    const manifest = JSON.parse(manifestBytes.toString("utf8"));
    assert.equal(`${name}@${manifest.version}`, spec, `${spec}: resolved version drift`);
    const registry = spawnSync("npm", ["view", spec, "dist.integrity", "--json"], { encoding: "utf8" });
    assert.equal(registry.status, 0, `${spec}: npm registry integrity lookup failed`);
    const integrity = JSON.parse(registry.stdout);
    assert.match(integrity, /^sha512-/, `${spec}: registry integrity is not SHA-512`);
    return {
      name,
      version: manifest.version,
      registryIntegrity: integrity,
      installedManifestSha256: createHash("sha256").update(manifestBytes).digest("hex"),
    };
  }));
  await mkdir(new URL(".", evidence), { recursive: true });
  await writeFile(evidence, `${JSON.stringify({ schema: "logic-pro-mcp-site.isolated-tool.v1", command, packages }, null, 2)}\n`, "utf8");
}
