import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  "/", "/install/claude-code", "/install/claude-desktop", "/install/cursor", "/install/vscode",
  "/guides/logic-pro-mcp", "/guides/control-logic-pro-with-claude",
  "/use-cases/compose-midi", "/use-cases/mixer-automation", "/use-cases/batch-export",
];
const installRoutes = routes.filter((route) => route.startsWith("/install/"));

async function installAnalyticsProbe(target) {
  await target.addInitScript(() => {
    window.__qaAnalyticsEvents = [];
    window.addEventListener("logic-pro-mcp:analytics-contract", (event) => {
      if (event instanceof CustomEvent) window.__qaAnalyticsEvents.push(event.detail);
    });
  });
}

for (const route of routes) {
  test(`${route} renders, reflows, and passes automated WCAG`, async ({ page }) => {
    const consoleErrors = [];
    const failedRequests = [];
    page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
    page.on("requestfailed", (request) => failedRequests.push(`${request.method()} ${request.url()}`));
    const response = await page.goto(route, { waitUntil: "networkidle" });
    expect(response?.status()).toBe(200);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    expect(consoleErrors).toEqual([]);
    expect(failedRequests).toEqual([]);
    const accessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    expect(accessibility.violations).toEqual([]);
  });
}

test("all rendered CTAs and copy controls expose keyboard-native contracts", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  for (const route of routes) {
    await page.goto(route);
    const ctas = page.locator("a.button, a.nav-cta");
    expect(await ctas.count()).toBeGreaterThan(0);
    for (let index = 0; index < await ctas.count(); index += 1) {
      await expect(ctas.nth(index)).toBeVisible();
      await expect(ctas.nth(index)).toHaveAttribute("href", /^(?:https:\/\/|\/|#)/);
    }
  }
  for (const route of installRoutes) {
    await page.goto(route);
    const copyButtons = page.locator(".copy-command button");
    expect(await copyButtons.count()).toBeGreaterThan(0);
    for (let index = 0; index < await copyButtons.count(); index += 1) {
      await copyButtons.nth(index).focus();
      await page.keyboard.press("Enter");
      await expect(copyButtons.nth(index).locator("xpath=following-sibling::*[@role='status']")).toHaveText("Copied");
    }
  }
});

test("Tab and Enter activate the skip path", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip-link")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
});

test("focus, heading order, non-color status, and 200% zoom remain usable", async ({ page }) => {
  await page.goto("/");
  const primaryCta = page.locator("a.button").first();
  await primaryCta.focus();
  const focusStyle = await primaryCta.evaluate((element) => {
    const style = getComputedStyle(element);
    return { outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth };
  });
  expect(focusStyle.outlineStyle).not.toBe("none");
  expect(Number.parseFloat(focusStyle.outlineWidth)).toBeGreaterThanOrEqual(2);
  const headingLevels = await page.locator("h1, h2, h3, h4, h5, h6").evaluateAll((headings) => headings.map((heading) => Number(heading.tagName.slice(1))));
  expect(headingLevels[0]).toBe(1);
  for (let index = 1; index < headingLevels.length; index += 1) expect(headingLevels[index] - headingLevels[index - 1]).toBeLessThanOrEqual(1);
  await expect(page.locator(".state-list strong")).toHaveText(["CONFIRMED", "UNCERTAIN", "FAILED"]);
  const viewport = page.viewportSize();
  if (viewport && viewport.width === 1280) {
    await page.setViewportSize({ width: 640, height: 400 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  }
});

test("forced clipboard denial preserves a manual-copy recovery message", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: () => Promise.reject(new DOMException("Denied", "NotAllowedError")) } });
  });
  await page.goto("/install/claude-code");
  await page.getByRole("button", { name: "Copy install the executable command" }).click();
  await expect(page.getByRole("status").first()).toHaveText("Copy unavailable; select the command manually");
});

test("unknown routes return a real 404", async ({ page }) => {
  const response = await page.goto("/this-route-must-not-exist");
  expect(response?.status()).toBe(404);
});

test("production responses include the checked-in CSP contract", async ({ request }) => {
  const response = await request.get("/");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-security-policy"]).toContain("default-src 'self'");
  expect(response.headers()["content-security-policy"]).toContain("connect-src 'self'");
});

test("reduced-motion users receive effectively disabled animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const duration = await page.locator(".signal-path").evaluate((element) => getComputedStyle(element, "::before").animationDuration);
  expect(duration).toBe("1e-05s");
});

for (const signal of ["doNotTrack", "globalPrivacyControl"]) {
  test(`${signal} suppresses the real install-view browser contract`, async ({ browser }) => {
    const context = await browser.newContext({ locale: "en-US", timezoneId: "UTC", colorScheme: "light" });
    await installAnalyticsProbe(context);
    await context.addInitScript((privacySignal) => {
      Object.defineProperty(navigator, privacySignal, { configurable: true, get: () => privacySignal === "doNotTrack" ? "1" : true });
    }, signal);
    const page = await context.newPage();
    await page.goto("/install/claude-code");
    await expect.poll(() => page.evaluate(() => window.__qaAnalyticsEvents.length)).toBe(0);
    await context.close();
  });
}

test("repeat install navigation counts once per navigation and once per activation", async ({ page, context }) => {
  await installAnalyticsProbe(context);
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/install/claude-code");
  await expect.poll(() => page.evaluate(() => window.__qaAnalyticsEvents.filter((event) => event.name === "install_viewed").length)).toBe(1);
  await page.locator('a[href="/guides/logic-pro-mcp"]:visible').last().click();
  await page.locator('a[href="/install/claude-code"]:visible').last().click();
  await expect.poll(() => page.evaluate(() => window.__qaAnalyticsEvents.filter((event) => event.name === "install_viewed").length)).toBe(2);
  await page.getByRole("button", { name: "Copy install the executable command" }).click();
  await expect.poll(() => page.evaluate(() => window.__qaAnalyticsEvents.filter((event) => event.name === "install_command_copied").length)).toBe(1);
});

test("analytics interactions add no transport and bundles load only same-origin resources", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const interactionRequests = [];
  await page.goto("/install/claude-code", { waitUntil: "networkidle" });
  page.on("request", (request) => interactionRequests.push(request.url()));
  await page.getByRole("button", { name: "Copy install the executable command" }).click();
  await page.waitForTimeout(100);
  expect(interactionRequests).toEqual([]);
  const externalResources = await page.evaluate(() => performance.getEntriesByType("resource").map((entry) => new URL(entry.name).origin).filter((origin) => origin !== location.origin));
  expect(externalResources).toEqual([]);
});
