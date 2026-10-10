import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import postcss from "postcss";
import { load } from "js-yaml";

test("ICNS parsing rejects a zero-length entry instead of looping", () => {
  const result = spawnSync(process.execPath, ["--max-old-space-size=64", "--input-type=module", "-e", `
    import assert from "node:assert/strict";
    import { imageSize } from "image-size";
    const input = Buffer.alloc(16);
    input.write("icns", 0);
    input.writeUInt32BE(16, 4);
    input.write("ic08", 8);
    input.writeUInt32BE(8, 12);
    assert.equal(imageSize(input).width, 256);
    input.writeUInt32BE(0, 12);
    assert.throws(() => imageSize(input), TypeError);
    console.log("malformed-icns-rejected");
  `], { encoding: "utf8", timeout: 1000, killSignal: "SIGKILL" });
  assert.equal(result.status, 0, `Parser child failed: ${result.error?.code ?? result.signal ?? result.stderr}`);
  assert.equal(result.stdout.trim(), "malformed-icns-rejected");
});

test("YAML empty merge sources consume the configured merge budget", () => {
  assert.throws(() => load("empty: &empty {}\ntarget: { <<: [*empty, *empty] }\n", {
    maxTotalMergeKeys: 1,
  }), { name: "YAMLException", reason: "merge keys exceeded maxTotalMergeKeys (1)" });
});

test("PostCSS refuses an absolute external source map without a source filename", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "lpm-postcss-map-"));
  try {
    const mapPath = path.join(directory, "outside.map");
    const canary = "synthetic-outside-map-content";
    await writeFile(mapPath, JSON.stringify({
      version: 3, sources: ["outside.css"], sourcesContent: [canary], names: [], mappings: "AAAA",
    }));
    const result = await postcss([]).process(`a{color:red}\n/*# sourceMappingURL=${mapPath} */`, {
      map: { inline: false },
    });
    assert.equal(result.map?.toString().includes(canary) ?? false, false);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
