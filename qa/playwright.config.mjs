import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: "site.spec.mjs",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  failOnFlakyTests: true,
  timeout: 30_000,
  outputDir: process.env.QA_EVIDENCE_DIR ?? "test-results",
  use: {
    baseURL: "http://127.0.0.1:4173",
    locale: "en-US",
    timezoneId: "UTC",
    colorScheme: "light",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "mobile-375x812", use: { viewport: { width: 375, height: 812 } } },
    { name: "tablet-768x1024", use: { viewport: { width: 768, height: 1024 } } },
    { name: "desktop-1280x800", use: { viewport: { width: 1280, height: 800 } } },
  ],
});
