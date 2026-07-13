import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { analyticsStatus, emitAnalytics, emitInstallViewed, privacySignalEnabled, sanitizeAnalyticsEvent } from "../app/lib/analytics.ts";

const validCopy = { name: "install_command_copied", page: "/install/claude-code", placement: "workflow", destination_host: "", client: "claude-code", command_step: "install" };

test("Given a permitted event, when sanitized, then only the typed contract survives", () => {
  assert.equal(analyticsStatus, "NOT_CONFIGURED");
  assert.deepEqual(sanitizeAnalyticsEvent(validCopy), validCopy);
});

test("Given untrusted analytics fields, when sanitized, then identifiers and free text are rejected", () => {
  for (const invalid of [
    { ...validCopy, unknown: "value" },
    { ...validCopy, page: "/install/claude-code?email=user@example.com" },
    { ...validCopy, page: "/install/claude-code#step" },
    { ...validCopy, placement: "192.0.2.1" },
    { ...validCopy, destination_host: "github.com?token=secret" },
    { ...validCopy, command: "brew install logic-pro-mcp" },
    { ...validCopy, command_step: "free text" },
  ]) assert.equal(sanitizeAnalyticsEvent(invalid), null);
});

test("Given privacy signals or a repeated browser activation, when routed, then optional handling is suppressed", () => {
  assert.equal(privacySignalEnabled({ doNotTrack: "1" }), true);
  assert.equal(privacySignalEnabled({ globalPrivacyControl: true }), true);
  assert.equal(emitAnalytics(validCopy, undefined, { doNotTrack: "1" }), false);
  const activation = new Event("click");
  assert.equal(emitAnalytics(validCopy, activation), true);
  assert.equal(emitAnalytics(validCopy, activation), false);
});

test("Given an install navigation, when client effects or nested handlers repeat, then each activation is counted once", () => {
  const installView = { name: "install_viewed", page: "/install/cursor", placement: "navigation", destination_host: "", client: "cursor" };
  const documentIdentity = {};
  assert.deepEqual(sanitizeAnalyticsEvent(installView), installView);
  assert.equal(emitInstallViewed(installView, documentIdentity), true);
  assert.equal(emitInstallViewed(installView, documentIdentity), false);
  assert.equal(emitInstallViewed(installView, {}), true);
  assert.equal(emitInstallViewed({ ...installView, page: "/install/vscode", client: "vscode" }, documentIdentity), true);
  assert.equal(emitInstallViewed(installView, {}, { globalPrivacyControl: true }), false);

  const nestedActivation = new Event("click");
  assert.equal(emitAnalytics(validCopy, nestedActivation), true);
  assert.equal(emitAnalytics(validCopy, nestedActivation), false);
});

test("Given the production router source, when privacy boundaries are audited, then no transport or retention primitive exists", async () => {
  const source = await readFile(new URL("../app/lib/analytics.ts", import.meta.url), "utf8");
  for (const forbidden of ["fetch(", "XMLHttpRequest", "sendBeacon", "localStorage", "sessionStorage", "document.cookie"]) assert.doesNotMatch(source, new RegExp(forbidden.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(source, /navigator\.globalPrivacyControl/);
});
