import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { brotliCompressSync, constants } from "node:zlib";

const compressible = /^(?:text\/|application\/(?:javascript|json|xml))/i;

export function createBrotliProxy() {
  return createServer(async (request, response) => {
    try {
      const upstream = await fetch(`http://127.0.0.1:4174${request.url}`, { headers: { accept: request.headers.accept ?? "*/*" } });
      const raw = Buffer.from(await upstream.arrayBuffer());
      const headers = new Headers(upstream.headers);
      headers.delete("content-encoding");
      headers.delete("content-length");
      headers.delete("transfer-encoding");
      const useBrotli = request.headers["accept-encoding"]?.includes("br") && compressible.test(headers.get("content-type") ?? "");
      const body = useBrotli ? brotliCompressSync(raw, { params: { [constants.BROTLI_PARAM_QUALITY]: 5 } }) : raw;
      if (useBrotli) headers.set("content-encoding", "br");
      headers.set("content-length", String(body.byteLength));
      headers.append("vary", "Accept-Encoding");
      response.writeHead(upstream.status, Object.fromEntries(headers.entries()));
      response.end(body);
    } catch (error) {
      response.writeHead(502, { "content-type": "text/plain; charset=utf-8" });
      response.end(error instanceof Error ? error.message : "proxy failure");
    }
  });
}

export const brotliProxyEntryPath = fileURLToPath(import.meta.url);

if (process.argv[1] === brotliProxyEntryPath) {
  createBrotliProxy().listen(4175, "127.0.0.1");
}
