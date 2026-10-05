import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  "/", "/install/claude-code", "/install/claude-desktop", "/install/cursor", "/install/vscode",
  "/guides/logic-pro-mcp", "/guides/control-logic-pro-with-claude",
  "/use-cases/compose-midi", "/use-cases/mixer-automation", "/use-cases/batch-export",
];
const installRoutes = routes.filter((route) => route.startsWith("/install/"));

test("workflow and outcome controls change the real rendered example", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Mix", exact: true }).click();
  await expect(page.locator(".bench-narrative h3")).toHaveText("A target, not a guess.");
  await expect(page.locator(".surface-row").last()).toContainText("logic://mixer");
  await page.getByRole("button", { name: /B.*Uncertain/ }).click();
  await expect(page.locator(".outcome-explanation")).toContainText("could not be independently verified");
  await page.getByRole("button", { name: "Deliver", exact: true }).click();
  await expect(page.locator(".bench-narrative h3")).toHaveText("The file is the result.");
  await expect(page.locator(".boundary-note")).toContainText("Opening the Bounce dialog is not an exported artifact");
});

test("client selection changes configuration and never retains a stale Copied result", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  const register = page.locator(".install-columns article").nth(1);
  await expect(register).toContainText("claude mcp add --scope user");
  await register.getByRole("button", { name: "Copy command" }).click();
  await expect(register.getByRole("status")).toHaveText("Copied");
  await page.locator(".client-switch").getByRole("button", { name: "VS Code", exact: true }).click();
  await expect(register.getByRole("status")).toHaveText("");
  await expect(register.locator("code")).toContainText('"servers"');
  await expect(register.locator("code")).not.toContainText('"mcpServers"');
  await register.getByRole("button", { name: "Copy command" }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('"servers"');
});

test("all four homepage clients select their own registration and readiness commands by keyboard", async ({ page }) => {
  await page.goto("/");
  for (const [name, id, registration] of [
    ["Claude Code", "claude-code", "claude mcp add --scope user"],
    ["Claude Desktop", "claude-desktop", '"mcpServers"'],
    ["Cursor", "cursor", '"mcpServers"'],
    ["VS Code", "vscode", '"servers"'],
  ]) {
    const button = page.locator(".client-switch").getByRole("button", { name, exact: true });
    await button.focus();
    await button.press("Enter");
    await expect(button).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".install-columns article").nth(1).locator("code")).toContainText(registration);
    await expect(page.locator(".install-columns article").nth(2).locator("code")).toContainText(`doctor --profile core --client ${id}`);
    await expect(page.locator(".install-after a")).toHaveAttribute("href", `/install/${id}`);
  }
});

test("archived media plays only on request and supports independent seek and pause", async ({ page }) => {
  const mediaRequests = [];
  page.on("request", request => { if (new URL(request.url()).pathname === "/session-demo.mp4") mediaRequests.push(request.url()); });
  await page.goto("/");
  const media = page.locator(".video-stage video");
  expect(await media.evaluate((video) => video.paused)).toBe(true);
  expect(mediaRequests).toEqual([]);
  await page.getByRole("button", { name: "Play recording", exact: true }).first().click();
  await expect.poll(() => media.evaluate((video) => !video.paused && video.currentTime > 0)).toBe(true);
  expect(mediaRequests).toHaveLength(1);
  await page.getByRole("button", { name: "Pause recording", exact: true }).click();
  await expect.poll(() => media.evaluate((video) => video.paused)).toBe(true);
  const position = page.getByRole("slider", { name: "Recording position" });
  await position.focus();
  await position.press("Home");
  for (let step = 0; step < 100; step += 1) await position.press("ArrowRight");
  await expect.poll(() => media.evaluate((video) => video.currentTime)).toBeCloseTo(10, 0);
  await expect(page.locator(".player-error")).toHaveCount(0);
});

test("ordinary playback does not wait for optional Web Audio analysis", async ({ page }) => {
  await page.addInitScript(() => {
    const NativeAudioContext = window.AudioContext;
    window.AudioContext = class extends NativeAudioContext {
      resume() { return new Promise(() => {}); }
    };
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Play recording", exact: true }).first().click();
  await expect.poll(() => page.locator("video").evaluate(video => !video.paused && video.currentTime > 0)).toBe(true);
  await page.getByRole("button", { name: "Pause recording", exact: true }).click();
  await expect.poll(() => page.locator("video").evaluate(video => video.paused)).toBe(true);
});

for (const failure of ["absent", "rejected", "pending"]) {
  test(`native audio is not captured when optional analysis is ${failure}`, async ({ page }) => {
    await page.addInitScript((mode) => {
      window.__qaAudioCaptures = 0;
      const NativeAudioContext = window.AudioContext;
      if (mode === "absent") { window.AudioContext = undefined; return; }
      window.AudioContext = class extends NativeAudioContext {
        resume() { return mode === "rejected" ? Promise.reject(new Error("analysis denied")) : new Promise(() => {}); }
        createMediaElementSource(media) {
          window.__qaAudioCaptures += 1;
          return super.createMediaElementSource(media);
        }
      };
    }, failure);
    await page.goto("/");
    await page.getByRole("button", { name: "Play recording", exact: true }).first().click();
    await expect.poll(() => page.locator("video").evaluate(video => !video.paused && video.currentTime > 0 && !video.muted)).toBe(true);
    expect(await page.evaluate(() => window.__qaAudioCaptures)).toBe(0);
    await page.getByRole("button", { name: "Pause recording", exact: true }).click();
    await expect.poll(() => page.locator("video").evaluate(video => video.paused)).toBe(true);
    await expect(page.locator(".player-error")).toHaveCount(0);
  });
}

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
    const ctas = page.locator("a.button, a.nav-cta, a.desk-button");
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
  const primaryCta = page.locator("a.desk-button").first();
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
  await expect(page.locator(".outcome-switch button")).toHaveText(["AConfirmed", "BUncertain", "CFailed"]);
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
  const motion = await page.locator(".section-grid-heading").first().evaluate((element) => ({
    animation: getComputedStyle(element).animationName,
    scroll: getComputedStyle(document.documentElement).scrollBehavior,
  }));
  expect(motion).toEqual({ animation: "none", scroll: "auto" });
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
