import { spawn } from "node:child_process";
import { createServer } from "node:net";

// Serves the production build (`next build` output) for verifiers and tests.
// One server is started lazily per process and stopped when the process exits.
let started;

function freePort() {
  return new Promise((resolve, reject) => {
    const probe = createServer();
    probe.once("error", reject);
    probe.listen(0, "127.0.0.1", () => {
      const { port } = probe.address();
      probe.close(() => resolve(port));
    });
  });
}

async function start() {
  const port = await freePort();
  const root = new URL("../../", import.meta.url);
  const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--port", String(port), "--hostname", "127.0.0.1"], {
    cwd: root,
    stdio: ["ignore", "ignore", "inherit"],
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
  });
  const stop = () => { if (child.exitCode === null) child.kill("SIGTERM"); };
  process.on("exit", stop);
  child.unref();
  const baseUrl = `http://127.0.0.1:${port}`;
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (child.exitCode !== null) throw new Error("next start exited; run `npm run build` first");
    try {
      await fetch(`${baseUrl}/`);
      return { baseUrl, stop };
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }
  stop();
  throw new Error("next start did not become ready");
}

export async function fetchFromBuild(pathname) {
  started ??= start();
  const { baseUrl } = await started;
  return fetch(`${baseUrl}${pathname}`, { redirect: "manual" });
}
