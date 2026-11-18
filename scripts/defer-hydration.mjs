import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

// Post-build step: move the framework <script async> tags of every prerendered page out of the
// HTML head and load them from one tiny inline loader instead.
//
// Why: the first screen is complete server-rendered HTML plus a preloaded poster. React,
// react-dom and the Next client runtime (about 150 KB over the wire) are only needed to make
// the page interactive, but as <script async> tags in <head> they are discovered with the
// document and downloaded and executed before the poster is painted. Lighthouse's simulated
// (Lantern) LCP counts every request that started before the observed LCP, so the hero LCP was
// gated behind that JavaScript. The loader starts the same scripts 250 ms after the window
// load event (that is, after the poster has painted), or immediately on the first user input.
// Hydration, routing and the client components are unchanged; only their start time moves.
//
// Set DEFER_HYDRATION=0 to skip the step (the build output is then stock Next.js output).

// `next start` and self-hosting serve .next/server/app/**/*.html. On Vercel the Next.js adapter has
// already copied the prerendered pages to .next/output/functions/**/*.prerender-fallback.html when
// `next build` returns, and that copy is what gets deployed, so both locations are rewritten.
const roots = [".next/server/app", ".next/output/functions", ".next/output/static"];
if (process.env.DEFER_HYDRATION === "0") {
  console.log("defer-hydration: skipped (DEFER_HYDRATION=0)");
  process.exit(0);
}

async function* walk(directory) {
  let entries;
  try { entries = await readdir(directory, { withFileTypes: true }); } catch (error) { if (error.code === "ENOENT") return; throw error; }
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (entry.name.endsWith(".html")) yield path;
  }
}

const asyncScript = /<script src="(\/_next\/static\/[^"]+\.js)" async=""><\/script>/g;
const scriptPreload = /<link rel="preload" as="script"[^>]*href="\/_next\/static\/[^"]+\.js"[^>]*\/>/g;
const loader = (sources) => `<script id="defer-hydration">(function(s){var t,g;function r(){if(!g){g=1;clearTimeout(t);s.forEach(function(u){var e=document.createElement("script");e.src=u;e.async=1;document.head.appendChild(e)})}}addEventListener("pointerdown",r,{capture:1,once:1});addEventListener("keydown",r,{capture:1,once:1});function l(){t=setTimeout(r,250)}document.readyState=="complete"?l():addEventListener("load",l,{once:1})})(${JSON.stringify(sources)})</script>`;

let changed = 0;
for (const root of roots) for await (const file of walk(root)) {
  const html = await readFile(file, "utf8");
  if (html.includes('id="defer-hydration"')) { changed += 1; continue; }
  const sources = [...html.matchAll(asyncScript)].map((match) => match[1]);
  if (sources.length === 0) continue;
  let first = true;
  const next = html.replace(asyncScript, () => {
    if (!first) return "";
    first = false;
    return loader(sources);
  }).replace(scriptPreload, "");
  await writeFile(file, next);
  changed += 1;
}
if (changed === 0) throw new Error(`defer-hydration: found no framework scripts under ${roots.join(", ")}; the Next.js output format changed`);
console.log(`defer-hydration: ${changed} prerendered HTML files now start their framework scripts after load`);
