# Production dependency license inventory

Verified from `package-lock.json` by `npm run verify:licenses`. The deployed dependency closure contains only:

| Package | Version | SPDX license |
|---|---:|---|
| `react` | 19.2.6 | MIT |
| `react-dom` | 19.2.6 | MIT |
| `scheduler` | 0.27.0 | MIT |

Build, lint, test, and ephemeral QA tools are not part of the deployed dependency closure. The verifier fails on a missing package, missing license, or any production license outside MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause, ISC, 0BSD, and CC0-1.0.
