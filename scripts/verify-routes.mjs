import assert from "node:assert/strict";
import { acquisitionRoutes, normalizeText, render } from "./lib/render-site.mjs";

function contentWords(html) {
  const article = html.match(/<article class="article-shell">([\s\S]*?)<\/article>/i)?.[1] ?? html;
  return normalizeText(article)
    .toLowerCase()
    .replace(/view source on github|follow the workflow|primary documentation|tagged setup guide/g, " ")
    .replace(/[^a-z0-9.+/_-]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function shingles(words, size = 5) {
  return new Set(words.slice(0, Math.max(0, words.length - size + 1)).map((_, index) => words.slice(index, index + size).join(" ")));
}

function jaccard(left, right) {
  const intersection = [...left].filter((value) => right.has(value)).length;
  return intersection / (left.size + right.size - intersection || 1);
}

const rendered = new Map();
const titles = new Set();
const headings = new Set();
for (const pathname of acquisitionRoutes) {
  const { response, body } = await render(pathname);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  assert.match(body, new RegExp(`rel="canonical" href="https://logic-pro-mcp\\.monglong\\.chatgpt\\.site${pathname}"`));
  const title = normalizeText(body.match(/<title>([^<]+)<\/title>/i)?.[1] ?? "");
  const heading = normalizeText(body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "");
  assert.ok(title && heading, `${pathname}: title and H1 required`);
  assert.ok(!titles.has(title), `${pathname}: duplicate title`);
  assert.ok(!headings.has(heading), `${pathname}: duplicate H1`);
  titles.add(title);
  headings.add(heading);
  rendered.set(pathname, shingles(contentWords(body)));
}

const installRoutes = acquisitionRoutes.filter((route) => route.startsWith("/install/"));
const similarity = [];
for (let left = 0; left < installRoutes.length; left += 1) {
  for (let right = left + 1; right < installRoutes.length; right += 1) {
    const score = jaccard(rendered.get(installRoutes[left]), rendered.get(installRoutes[right]));
    similarity.push([installRoutes[left], installRoutes[right], score]);
    assert.ok(score < 0.35, `${installRoutes[left]} vs ${installRoutes[right]} 5-shingle Jaccard ${score.toFixed(4)} must be < 0.35`);
  }
}
console.log("route verification: canonical/title/H1 uniqueness passed");
for (const [left, right, score] of similarity) console.log(`similarity ${left} ${right}: ${score.toFixed(4)}`);
