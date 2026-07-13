# Reproducible quality gates

Application dependencies stay limited to the production site. Browser QA installs exact tool versions into a disposable operating-system directory, writes only receipts under `.omo/evidence`, then deletes the tool environment.

- `npm run qa:e2e`: Playwright 1.61.1, Chromium, 10 routes at 390×844 and 1440×1000 plus clipboard behavior.
- `npm run qa:lighthouse`: Lighthouse 13.4.0, four representative templates, five mobile and three desktop performance samples through a local Brotli proxy that models the hosting compression boundary, plus separate direct-origin accessibility, best-practices, and SEO audits. Every performance sample must be at least 90 and each form-factor median at least 95. Set `QA_MOBILE_RUNS` and `QA_DESKTOP_RUNS` only for a documented smoke run.
- `npm run qa:secrets`: deterministic credential-pattern scan over shipped source and content.
- `npm run verify:all`: claim ledger, routes/similarity, links, schema, security, artifact residue, secrets, and production license closure.

The isolated QA tools are not added to `package.json` dependencies or `package-lock.json`. Production vulnerability gates remain `npm audit --omit=dev` and `npm run audit:prod`; QA-tool advisories, if any, belong to the deleted temporary environment and must not be represented as application findings.
