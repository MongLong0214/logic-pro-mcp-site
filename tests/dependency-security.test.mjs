import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import postcss from "postcss";
import { load } from "js-yaml";

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
