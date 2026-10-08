# Final cleanup checkpoint

The owner skipped H3 after reviewing five isolated studies. None is selected for production. The prototype preview is closed, its owned server is stopped, and its sources and original results remain archived outside this repository.

This records I's local acceptance checkpoint, starting from released merge `31858a4`. The owner subsequently authorized the final cleanup release. Publication results belong to the final cleanup PR and its linked master workflow; the local results below do not themselves establish deployment. Production application source, styling, content, dependencies and approved visual baselines are unchanged.

## Changes

- Update README and the plan/audit records to reflect the released H1/H2 work and the H3 decision.
- Retain Playwright traces and screenshots from failed attempts, and upload browser evidence even when a retry makes CI green. Existing retries, timeouts, assertions and pixel tolerances stay unchanged.
- Type the four native-anchor Link mocks, use the documented Vitest DOM matcher entry, and remove an unsupported, ignored `getByRole` option. The `name: 'Close'` string continues to require an exact accessible-name match.

The reference inventory found active consumers for all 12 components and all declared packages. Two declaration-only animation helpers are optional cleanup candidates; they were left alone because this checkpoint does not need a runtime change. No rejected Watch, Honeycomb, laboratory or mini-game route remains in the application.

## Local verification

| Check                     | Result and scope                                                                                                                                                                  |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unit tests                | 116 passed in 14 files                                                                                                                                                            |
| Browser matrix            | 161 passed, 26 expected skips, zero failures and zero retries; accessibility, foundations, themes and visuals across the five configured desktop/mobile profiles                  |
| Approved visual snapshots | All 16 strict comparisons passed; no baseline updates or tolerance changes                                                                                                        |
| Test-inclusive TypeScript | Passed for the four changed page tests and shared setup; this supplements the application tsconfig, which excludes unit tests                                                     |
| CI retention probe        | A deliberately failed first attempt retained its original trace, screenshot and report after a passing retry; this is an infrastructure probe, not an application acceptance pass |
| Contact diagnostic        | 24 first-attempt passes, zero retries; all requests mocked, zero real emails                                                                                                      |
| Project-sheet diagnostic  | Three first-attempt passes, zero retries, with passive click/history telemetry                                                                                                    |

The browser checks used Playwright `1.63.0` in the pinned Linux x64 image against the existing production build `poZ8KfyDoX1i8sldyZVy1` on the macOS host. This is not evidence of native Safari or a physical iPhone. Workflow inspection confirms the existing 14-day artifact retention, 20-minute browser-job limit and four deployment prerequisites are preserved. The new upload condition still needs an actual CI run before remote artifact publication can be verified.

Lint passed with zero warnings. Formatting, application TypeScript and `git diff --check` also passed. The checkout has no installed Git/Husky hooks; the lint, format and unit commands were run directly rather than attributed to a hook. Independent read-only review found no material issues in the test, configuration or documentation changes.

## Performance and release evidence

Because no production application source changed, retain the exact-source H1/H2 production-build, Lighthouse and canonical verification evidence rather than replace it with repeated measurements. The paired five-run Home comparison records baseline median LCP **2614.4357 ms** and candidate **2554.8224 ms**: a ratio of **0.9771984**, within the `1.10` limit. The LCP element is the immediately readable hero paragraph. Initial route JavaScript gzip deltas were Home **+6127 B**, Experience **+175 B**, Open Source **+440 B** and Contact **+439 B**.

Master run [37728097888](https://github.com/horusyeung/personal-portfolio-website/actions/runs/37728097888) passed all required checks and deployed the released application. All 12 Lighthouse accessibility/SEO, CLS and transfer checks passed. Contact performance median 87 and Open Source 89 remain advisory observations; the first Home score 68 is retained beside 97 and 95. The paired comparison above remains the release LCP gate. Canonical verification passed 16 route/theme/viewport combinations and four exact favicon-asset comparisons, with no page errors and zero real emails. Detailed provenance remains in [motion studies](motion-studies.md) and [motion audit](motion-audit.md).

## Outstanding limits

The bounded Contact and sheet diagnostics did not reproduce the historical CI failures. Their missing-request, viewport-geometry and dismissal signatures remain unresolved; successful retries and diagnostic passes are not repairs. No speculative runtime change was made. Preserve the original logs and compare first-attempt traces from a future recurrence before choosing a fix.

Physical iPhone, native Safari 17 and VoiceOver checks remain unperformed. Automated keyboard, focus, reduced-motion/transparency fallbacks, no-JavaScript and responsive evidence cannot replace them. Final cleanup publication still requires passing CI and deployment verification. Draft [PR #32](https://github.com/horusyeung/personal-portfolio-website/pull/32) remains a historical prototype reference pending the final rollout disposition; it must not be merged into production.

Raw local evidence, diagnoses, original type errors, the intentional retention probe and the exact changed-source snapshot are preserved in the final-cleanup evidence archive alongside the earlier H1/H2 and skipped H3 archives.
