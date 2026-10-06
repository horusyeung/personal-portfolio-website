# Portfolio upgrade plan (v2)

_v1 came from the 2026-10-04 review. v2 adds corrections from an independent Codex review of v1; see the [changelog](#changelog-v1--v2) at the end._

**Ground rule: same design, same content.** Everything below is a fix or an under-the-hood upgrade. Every user-visible difference is listed in [Visible changes](#visible-changes-need-your-ok) and needs your OK. Differing copy variants are kept as they are, never merged.

---

## Decisions needed

| # | Question | Recommendation |
|---|---|---|
| D1 | Which address is primary: `horusyeung.com` or `www.horusyeung.com`? | **Decided 2026-10-05: `www.horusyeung.com`.** Vercel stays as it is (bare domain → `www`). The code's canonical tags, sitemap, robots and JSON-LD move to `www` (PR 6). |
| D2 | Do you approve the [visible changes](#visible-changes-need-your-ok)? | **Approved 2026-10-05.** |
| D3 | Step 2: full Server Components conversion, or the lighter path? | Decide after the one-route prototype in 2.1 has been measured. |
| D4 | Which Step 3 items, if any? | Decide after Steps 1–2. |

---

## Step 0 — Baseline (≈ 1 hour, no code changes)

Record "before" numbers once, the same way they'll be re-measured after every step:

- **Lighthouse CLI, mobile preset:** 5 runs per page against the production URL. Store the median, along with the exact command and Chromium version.
- **First-load JS per route:** gzip transfer from the production build, plus HTML/RSC payload size.
- **Screenshots of every page:** desktop and mobile. Include these states:
  - initial animation frames;
  - keyboard focus;
  - contact form error, sending and success.
- **Rollback notes:** the last good deployment ID. Note that env keys and dashboard rules (Resend, Firewall) need their own rollback.

Store the summary in the PR descriptions. Large report files stay out of the repo.

---

## Step 1 — Fixes and security (≈ 2–3 days, 6 small PRs)

The afternoon estimate in v1 was too low once the tests below are included. The Playwright rewrite (PR 2) adds about a day.

### PR 1 — Security upgrade and housekeeping

**Dependencies:**
- `next` and `eslint-config-next` → **16.3.8**.
- `react`, `react-dom`, `@types/react` and `@types/react-dom` → **19.3.0**.
- `@mui/material` and `@mui/icons-material` → **7.3.11**.
- `@mui/material-nextjs` → **7.3.10**. 7.3.11 doesn't exist for this package.
- Recheck the registry right before merging.

**Code changes:**
- Delete `export const runtime = 'edge'` from `src/app/opengraph-image.tsx`. It is deprecated, and removing it lets the OG image be generated statically.
- Switch the `@mui/material-nextjs/v15-appRouter` import to `v16-appRouter`.

**Audit the whole lockfile:**
- The production audit shows 42 advisories: 30 in Next.js and 12 elsewhere.
- Triage the 12 non-Next ones and record which apply.
- On support status: Next.js ships fixes on the current 16.x line, and 16.1.6 carries 30 advisories. The formal per-minor support status is unverified.

**Yarn and Node:**
- Add `"packageManager": "yarn@4.12.0"` to `package.json`.
- Set `"engines": { "node": "24.x" }`.
- Add a `.nvmrc` containing `24`.
- Bump `@types/node` to `^24`.
- **You:** set Node 24 in Vercel → Project → Settings → Build, and confirm the functions run on 24.

**CI (`.github/workflows/ci.yml`):**
- Step order: `actions/setup-node` (Node 24, *no* `cache:`) → `corepack enable` → `yarn --version` must print 4.12.0 → `actions/cache` keyed on `yarn.lock` → `yarn install --immutable`. Today setup-node's yarn cache runs Yarn before Corepack is enabled.
- Set `permissions: contents: read`.
- Add `concurrency` that cancels superseded PR runs.
- Bump `checkout`, `setup-node` and `cypress-io/github-action` to releases whose metadata targets Node 24. GitHub already forces Node 24 at runtime as of 2026-09-23.
- Pin the Vercel CLI version and pass the token through `env: VERCEL_TOKEN`.

**Dependabot:**
- Add `.github/dependabot.yml`: npm weekly with minor and patch grouped, and github-actions monthly.
- **You:** enable Dependabot alerts in GitHub → Settings → Code security. I couldn't check the current state.

**Done when:**
- lint, `tsc`, unit tests, build and Cypress all pass on Node 24 with Yarn 4.12.0.
- The production audit shows no Next.js advisories.
- The Lighthouse median is no worse than Step 0.

### PR 2 — Rewrite the end-to-end tests in Playwright

**Why now, before PRs 3–4:**
- Those PRs add browser tests (reduced motion, blocked or slow JS, request counting, double submit) that Playwright supports natively. Doing the rewrite first means each test is written once.
- It also adds WebKit (Safari engine) coverage, parallel runs, and trace files for failures.

**Setup:**
- `@playwright/test` **1.63** (latest 1.63.0, 2026-09-04).
- `playwright.config.ts`:
  - `webServer` runs `yarn start` against a production build on port 3000, with `reuseExistingServer` locally.
  - Projects: Desktop Chromium, Desktop WebKit, Mobile WebKit (iPhone 13) and Mobile Chromium (Pixel 7). The mobile projects replace `responsive.cy.ts`'s hand-set viewports.
  - `trace: 'on-first-retry'` and 2 retries on CI only.

**Port all 8 specs (43 cases) to `e2e/*.spec.ts`:**
- Same coverage.
- Keep the existing `data-testid`s and don't touch app markup in this PR. Use role and label locators where they read better.
- Replace fixed waits and raised timeouts with web-first assertions (`toBeVisible`, `toHaveText`). Two recent commits only raised the open-source heading timeout to hide flakiness from the GSAP char split.
- **Don't carry over the phone-number literal** (`contact.cy.ts:20`); assert against a pattern (`/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/`). It stays in git history unless you choose to rewrite it.

**CI:**
- Replace the Cypress job with a Playwright job:
  1. Restore the browser cache (`~/.cache/ms-playwright`, keyed on the Playwright version).
  2. `npx playwright install --with-deps`.
  3. Build with the dummy Resend key.
  4. `yarn test:e2e`.
  5. Upload `playwright-report/` as an artifact on failure.
- Deploy stays gated on it.
- Drop `CYPRESS_INSTALL_BINARY` from the other jobs.

**Remove Cypress:**
- The `cypress` dependency, `cypress.config.ts`, `cypress/` and the `cypress:*` scripts. Add `test:e2e` and `test:e2e:ui`.
- Change the Prettier glob `cypress/**/*.ts` to `e2e/**/*.ts`.
- Add `test-results/` and `playwright-report/` to `.gitignore`.

**Done when:**
- All ported tests pass on every project, locally and in CI.
- The CI run time is noted against the Cypress job.
- No Cypress references are left.

### PR 3 — Reduced-motion and hidden content

**The problem:**
- 18 `opacity: 0` declarations in `sx` pre-hide content. One more is a decorative glow.
- The Open Source title is also hidden by a collapsed `clipPath` (`open-source/page.tsx:293`).
- The reduced-motion early returns skip the reveal, so most content stays invisible.
- The home hero is the exception: it is un-hidden explicitly at `page.tsx:25`.

**Fix: server-rendered content is visible and unclipped by default.**

- **Below-the-fold reveals:**
  - GSAP sets its own start state (`gsap.from`) inside `const mm = gsap.matchMedia(); mm.add('(prefers-reduced-motion: no-preference)', …)`.
  - `useGSAP` returns `() => mm.revert()`.
  - With reduced motion on, JS failing, or the preference changing mid-animation, content ends up visible.
- **Above-the-fold intros** (page titles and subtitles, the contact form) use hydration-aware gating with no CSS animation, so nothing competes with GSAP in the cascade:
  - An inline `<head>` script adds `html.js` and starts a 3-second timer that adds `html.intro-skip`.
  - CSS hides `[data-intro]` only when `html.js:not(.intro-skip)` is set and `prefers-reduced-motion: no-preference` matches.
  - The intro hook clears the timer and runs the animation. If `intro-skip` is already present, the hook does nothing. Late hydration therefore never hides content that is already showing.
- **Home hero subtitle:** never pre-hidden. It keeps its slide but doesn't fade (LCP; visible change #4).
- **Clean up everything those hooks touch:**
  - Restore DOM text changed by the character split and typewriter (`innerHTML`/`textContent`).
  - Remove the card glow listeners, which have no cleanup today (`open-source/page.tsx:200`).
  - Return collected cleanups from the `useGSAP`/`mm` callbacks instead of from a `forEach` (`:262`).
  - Wrap event-created tweens in `contextSafe`.
- **Smooth scrolling:** `scroll-behavior: smooth` (`theme.ts:85`) applies only under `no-preference`. Add `data-scroll-behavior="smooth"` on `<html>`.
- **Horizontal overflow on phones** (found by the Playwright port in PR 2):
  - The hero subtitle starts at `x: +30px`, so the page is 14 px wider than the screen for about 1.2 s.
  - Android Chrome then keeps a widened 426 px layout viewport, so the page can be nudged sideways.
  - Fix: clip horizontal overflow on the hero section (`overflow-x: clip`), or keep the slide inside the container.
  - Turn on the `test.fixme` in `e2e/responsive.spec.ts`.

**Tests:**
- Update `ScrollReveal.test.tsx:50`, which currently asserts the content is hidden.
- New Playwright `e2e/reduced-motion.spec.ts`, using the built-in `reducedMotion: 'reduce'` emulation in every browser project:
  - On all 4 pages, roles, project cards, the Open Source title and the form fields are visible.
  - Reduced motion switched on mid-animation (`page.emulateMedia`) leaves content visible.
- **JS blocked** (`page.route(/\/_next\/static\/chunks\/.*\.js$/, r => r.abort())`, scripts only so the intro CSS still loads): intro content is visible within about 3.5 s.
- **Slow hydration** (delay those chunks 5 s in `page.route`): content shows at 3 s and isn't hidden again.
- **Route revisit:** navigate away and back; there are no duplicated splits or listeners, and scrolling still works.
- **Visual snapshots** (`toHaveScreenshot`): all 4 pages, desktop and mobile, under reduced motion.
  - They become deterministic once this PR's fix is in.
  - They're generated in the official Playwright Docker image so local and CI renders match.
  - They are the automatic **"no visual change" guard for Step 2**. When an approved visible change lands, update them deliberately with `yarn test:visual:update`, which runs `--update-snapshots` in Docker.
  - CI's E2E job runs in the same image.

**Also in this PR (pulled forward because the same code was being rewritten):**
- **Experience typewriter:** it types over a transparent full-text copy, so the height is reserved and screen readers get the whole sentence. This fixes the CLS of 0.308 (visible change #8; was Step 2.3).
- **Char splitter:** the heading gets `aria-label`, the letter spans get `aria-hidden`, and the original text is restored on cleanup (was Step 2.3). The SplitText decision stays in Step 2.3.
- **`<body>` inline style moved to `globals.css`.** This fixes a long-standing dev-only hydration warning on `<body style>`, which was present before any upgrade.
- **Commit `AGENTS.md` / `CLAUDE.md`,** which `next dev` (16.3) now generates.

### PR 4 — Contact form protection and delivery

> **Split (2026-10-05).** **4a** holds everything that needs no account changes: validation, field errors, honeypot, BotID, limits, the double-submit guard and generic errors. Field-level errors were pulled forward from Step 2.5, because the live form was failing on a malformed reply-to address with only a generic message. **4b** switches the sender to `contact@horusyeung.com` once the Resend domain is verified and the scoped key is in Vercel.
>
> BotID only runs on Vercel. The client initialises it on `horusyeung.com` and `*.vercel.app` only, because its challenge never loads elsewhere and protected fetches would hang. The server checks only when `VERCEL` is set, and it fails open if the check throws (`VERCEL_OIDC_TOKEN` missing, or an outage).

**Route (`src/app/api/contact/route.ts`). Checks run in this order:**
1. `checkBotId()` → **403**. Bots get no validation feedback.
2. Body size: reject when over 10 KB (Content-Length plus the length of `request.text()`) → **413**.
3. `JSON.parse` failure → **400**.
4. Body must be a non-null object whose fields are all strings → otherwise **400**. This covers `null`, arrays and non-string fields.
5. Honeypot field filled in → **200** with no email sent.
6. Normalize: trim all fields and strip CR/LF from the name. Then reject empty or over-limit values → **400**. Limits:
   - name ≤ 100 characters;
   - email ≤ 254 characters and a valid format;
   - message ≤ 5,000 characters.
7. `RESEND_API_KEY` missing → **503**. The Resend client is created here, not at module scope, so builds no longer need the key.
8. Send. A provider error → **502** with a generic message; the real error is logged server-side. Success → **200** `{ success: true }`.

**BotID:**
- Add the `botid` package and wrap `next.config.ts` with `withBotId(...)`.
- In `src/instrumentation-client.ts`: `initBotId({ protect: [{ path: '/api/contact', method: 'POST' }] })`.

**Sender:**
- Change `from: 'Portfolio Contact <onboarding@resend.dev>'` (`route.ts:15`) to `contact@horusyeung.com`.
- A key scoped to the domain cannot send as `onboarding@resend.dev`.

**Form (`src/app/contact/page.tsx`):**
- Add a visually hidden honeypot input and include it in the `fetch` payload (`:289`), which only sends name, email and message today.
- Add `maxLength` on the fields.
- Add a **synchronous in-flight guard** (a `useRef` flag) so a double-click sends once.
- While sending, the button gets `aria-disabled` and the form gets `aria-busy`. Focus is kept, and the look stays the same as today's disabled state.

**Rollout order (you and me together):**
1. Verify `horusyeung.com` in Resend (DNS records).
2. Create a sending-only key scoped to that domain.
3. Set it in Vercel for Production and Preview.
4. Deploy the code with the new sender.
5. Send a test message.
6. Revoke the old key.

**Also:**
- **You:** add a Vercel Firewall rate-limit rule for `POST /api/contact`, for example 5 requests per 10 minutes per IP (Hobby allows one rule). **Publish** it; counters are kept per region.
- **Smoke test on a deployed preview:** BotID allows everything locally, so mocks can't prove the production setup.

**Tests:**
- **Vitest, route:**
  - `null`, an array and non-string fields each → 400.
  - Whitespace-only fields → 400.
  - Exactly at each limit → 200; one character over → 400.
  - Oversized body → 413.
  - Missing key → 503.
  - Bot → 403.
  - Honeypot → 200 with no send.
  - Provider error → 502 with the generic message.
  - Every rejected request must never call Resend.
- **Playwright:**
  - Replace the ineffective empty-submit check (ported from `contact.cy.ts:41`) with a test that **invalid input sends no POST**. Count requests with `page.on('request')`.
  - A double-click submits exactly once.
  - Success and failure states via `page.route('**/api/contact', …)`.

### PR 5 — Contrast and badge motion
| Text / background | Now | New | Ratio |
|---|---|---|---|
| `text.secondary` on white (`theme.ts:24`) | #86868b | #6e6e73 | 3.62 → 5.07 |
| `text.secondary` on #f5f5f7 (grey sections) | #86868b | #6e6e73 | 3.33 → 4.66 |
| Blue *text* on #f5f5f7 (Education company names, the home "Get in touch" link) | #0071e3 | #0066cc | 4.31 → 5.11 |
| "Live" chip text | #34C759 | #1d7a35 | 2.01 → 4.90 |

- Primary buttons stay #0071e3; white on it is 4.70.
- **"Live" badge glow:** stop all motion within 5 seconds, for example two 2-second pulses. Three 2-second pulses would run 6 s and fail WCAG 2.2.2.
- **"Coming Soon" badge:** remove the infinite opacity breathing (`open-source/page.tsx:245`). Its text dips to 1.93:1 at minimum opacity. Text stays fully opaque, and any motion stops within 5 s.

> **Done in PR 5.**
> - Blue text on grey gets a theme token, `primary.text` (#0066cc). It also covers a third spot of the same kind: the focused field label on the grey contact-form card.
> - The visual snapshots now compare strictly (`threshold: 0`). The default 0.2 tolerance had let the grey change pass unnoticed.
> - Lighthouse with reduced motion (so axe also checks content below the fold): colour contrast passes on all 4 pages, and accessibility is 98–99.

### PR 6 — Canonical domain
- **Canonical domain → `www.horusyeung.com`** (D1):
  - Define the URL once (`SITE_URL`).
  - Use it for `metadataBase`, canonicals, JSON-LD, `sitemap.ts` and `robots.ts`.
  - Verify with `curl -I` on both hosts that the canonical matches the final URL.
  - Afterwards, re-submit the sitemap in Google Search Console.

> **Done in PR 6.**
> - The origin lives in `src/content/site.ts` (`SITE_URL`).
> - Canonicals and `og:url` are relative to `metadataBase`, so the domain is written once in the metadata.
> - JSON-LD, `sitemap.ts`, `robots.ts` and the contact page's website link use `SITE_URL`.
> - `e2e/seo.spec.ts` locks it in.

**Step 1 is done when:**
- All 6 PRs are merged with CI green.
- The Playwright suite passes on Chromium, WebKit and mobile.
- Every new test passes.
- Lighthouse contrast audits pass.
- The deployed contact form has been tested end to end.
- The Lighthouse median is no worse than Step 0 on any page.

---

## Step 2 — Restructure (scope decided after 2.1; no design or copy changes)

### 2.1 One-route prototype first
- Convert **/open-source** to a Server Component with small client components for the interactive parts.
- Compare it against Step 0 on: first-load JS, HTML/RSC transfer, hydration and TBT, and Lighthouse.
- Every MUI component is still a client component, so the gain may be modest.
- Then choose (D3):
  - **Full path:** convert all four pages. Delete the pass-through `layout.tsx` files and export `metadata` from the pages.
  - **Light path:** keep the pages and metadata layouts as they are; extract the data and repair the existing animations only.
- Re-estimate the effort at that point.

Hurdles the conversion has to handle:
- `skillIcons.tsx:155` mixes plain data with icon *functions*. Split it into server-safe data (`src/content/skills.ts`) and a client-side icon map.
- MUI `component={Link}` across the server/client boundary needs MUI's documented client wrapper for Next 16.

### 2.2 Content in one place (both paths)
- New files:
  - `src/content/site.ts`: name, email, URL, socials;
  - `src/content/experience.ts`;
  - `src/content/projects.ts`;
  - `src/content/skills.ts`.
- **Copy moves word for word.** The bios differ between home (`page.tsx:178`) and footer (`Footer.tsx:122`), so they stay **named variants** (for example `bio.hero`, `bio.footer`, `bio.meta`) and are not merged.
- Today the bio prefix appears 5 times, the email 4 times across 3 files, and the full site URL 17 times. Each becomes a single reference.
- The footer year is computed (visible change #9).

### 2.3 Animation cleanup (both paths)
- Upgrade to GSAP **3.15**. Register `ScrollTrigger` once, in `src/lib/gsap.ts` (today it's 8 files).
- **SplitText is not an exact drop-in for the current splitter:**
  - The current splitter animates the NBSP between words; SplitText's chars exclude it. With the same stagger, later timing shifts by 40 ms.
  - Wrapping and whitespace may also differ.
  - **Adopt SplitText only if** frame-by-frame screenshots match after adjusting the stagger.
  - **Otherwise repair the existing splitter:** `aria-label` on the heading, `aria-hidden` on the letter spans, and the original text restored on cleanup.
- **Typewriter (/experience):** done in PR 3. It reserves height and keeps one accessible copy. Confirm with a post-deploy Lighthouse run.
- **Magnetic effect:**
  - One shared listener and `gsap.quickTo`.
  - Only on `(hover: hover) and (pointer: fine)`.
  - No tween while idle.

### 2.4 SEO (both paths)
- JSON-LD as a plain `<script type="application/ld+json">` in the server HTML. It is currently `next/script` `afterInteractive`, and the live HTML has zero JSON-LD script elements. Add Medium to `sameAs`.
  - ⚠️ Commit `09f6b03` moved it *to* `next/script` to fix hydration error #418, which the earlier manual `<head>` tag caused.
  - Render it inside `<body>` from the Server Component layout, as the Next.js JSON-LD guide shows. Escape `<` as `\u003c` and keep the output deterministic.
  - Verify there's no hydration warning in a production build before merging.
- Per-page `openGraph` built from a shared base, so subpages get `og:image` back; the live HTML has none today.
- `twitter` reduced to `{ card }` so subpages stop showing the home Twitter title.
- Real `lastModified` dates in the sitemap. Drop `keywords`.

### 2.5 Accessibility (both paths)
- `<nav aria-label>` with `aria-current="page"`.
- **Skip link** (visible change #6) targeting `<main id="main" tabIndex={-1}>`.
- **Headings:** fix the order with MUI's `component` prop so the look is unchanged. Roles go from h4 to h3 under an h2. Contact form heading and project names become real headings.
- `aria-hidden` on decorative icons. Remove the project cards' overriding `aria-label`.
- Bullets drawn with CSS instead of a typed "·", looking identical.
- **Contact form:**
  - Inline field errors with `aria-invalid` / `aria-describedby` and focus on the first error (visible change #7).
  - `autoComplete` on name and email.
- 44 px hit areas on the nav links via a pseudo-element, with no visual change.
- **Manual checks:** keyboard-only pass, plus VoiceOver on Safari for the headings, form errors and split heading.

### 2.6 Cleanup
- Delete `CountUp.tsx`, `TimelineLine.tsx`, `animateCountUp`, the unused `threshold` prop, unused refs and `@emotion/server`.
- Rewrite the README (stack, scripts, env vars, deploy).
- Add a Lighthouse CI job with budgets agreed from the Step 0 numbers.

### 2.7 React Compiler: a separate, measured experiment
- Own PR with `reactCompiler: true`.
- Profile before and after: render counts, INP, build time.
- Test the GSAP lifecycles and the form.
- Keep it easy to opt out (the config flag, or `'use no memo'` per file).
- Merge only if it measurably helps. No gain is promised.

**Step 2 is done when:**
- The Playwright visual snapshots (from PR 3) pass unchanged, and manual screenshots match Step 0 apart from the approved visible changes.
- CLS < 0.1 on all pages.
- Accessibility 100 and the Lighthouse budgets pass.
- The manual accessibility checks are done.

---

## Step 3 — Optional (one PR each, later)

| Item | What it is | Needs from you |
|---|---|---|
| Live GitHub stats | Stars and last update on Open Source cards. Fetched on the server and refreshed hourly; hidden if the GitHub API fails. | A read-only `GITHUB_TOKEN` in Vercel |
| Page transitions | React 19.3 `<ViewTransition>`: a subtle fade with the header held still. Off under reduced motion. | — |
| Dark mode | Follows the system, plus a toggle. Uses MUI CSS variables, so there's no flash. Shown to you as a preview first. | Approval of the preview |
| Case studies | Pages with architecture diagrams. | Your content |
| Upgrades | MUI 7 → 9 (codemods); Vitest 5, optionally with Browser Mode on the Playwright provider; TypeScript 6. Hold off on TS 7, since typescript-eslint supports only `<6.1`. | — |

---

## Visible changes (need your OK)

1. **Grey text slightly darker** (#86868b → #6e6e73): nav, body copy, footer.
2. **Blue text on grey sections slightly darker** (#0066cc), in 2 places. Buttons are unchanged.
3. **"Live" chip text darker green** (#1d7a35).
4. **Home hero subtitle visible from the first paint.** It still slides in but no longer fades. The browser can't count it as painted while it's at opacity 0; the LCP gain will be **measured**, not promised.
5. **All status-badge motion stops within 5 seconds** ("Live" glow and "Coming Soon" breathing), and badge text stays fully opaque.
6. **A skip link** appears at the top-left when someone presses Tab. It's invisible to mouse users.
7. **Contact form:** inline error messages under fields, which appear only on invalid submit. The sending state looks like today's disabled button but stays focusable.
8. **Experience typewriter:** the subtitle area holds its full height while typing, so the content below no longer jumps.
9. **Copyright year** becomes automatic. It shows 2026 today and 2027 next year.
10. **On very slow connections** (JS not loaded within 3 s), intro animations are skipped and content simply appears.

Everything else stays as it is: layout, fonts, copy, and animation style and timing.

---

## Things only you can do
- **Vercel:**
  - Node 24 setting.
  - Firewall rate-limit rule, published.
  - Env vars for Production and Preview.
- **Resend:** domain verification (DNS), the scoped sending key, and revoking the old key.
- **GitHub:** enable Dependabot alerts.
- **Step 3 only:** `GITHUB_TOKEN`.

## Way of working
- One small PR per item, with commits in the repo's `fix:` / `feat:` style.
- CI and a Vercel preview must be green before merge.
- Every PR states its Step 0 comparison.
- I don't push or merge without your OK.

## Step 0 baseline (recorded 2026-10-05, production `master` @ 8689698)

**Lighthouse:**
- Setup: Lighthouse 13.5.0 CLI, default mobile preset (simulated throttling), HeadlessChrome 147 (Playwright `chromium-1217`).
- Each page measured 5 times against `https://www.horusyeung.com`; values below are medians.
- Command:

  ```bash
  CHROME_PATH=<chromium> npx lighthouse@13.5.0 <url> --only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless=new --no-sandbox" --output=json
  ```

| Page | Performance | Accessibility | Best Practices | SEO | FCP | LCP (range) | TBT | CLS |
|---|---|---|---|---|---|---|---|---|
| Home | 94 | 95 | 100 | 100 | 0.95 s | 3.02 s (3.02–3.03) | 0 ms | 0 |
| Experience | 84 | 93 | 100 | 100 | 0.80 s | 2.03 s (2.02–2.16) | 0 ms | 0.308 |
| Open Source | 95 | 94 | 100 | 100 | 0.80 s | 2.95 s (2.94–2.95) | 0 ms | 0 |
| Contact | 94 | 93 | 100 | 100 | 0.80 s | 3.10 s (3.09–3.10) | 0 ms | 0.002 |

**First-load JS per route:**
- Method: production build of `master`. Sum the gzip (level 9) size of every `<script src>` in the prerendered HTML, excluding `noModule` polyfills.

| Route | Scripts | JS (gzip) | HTML (gzip) |
|---|---|---|---|
| / | 13 | 250.1 KB | 29.7 KB |
| /experience | 12 | 218.7 KB | 7.9 KB |
| /open-source | 13 | 247.4 KB | 8.5 KB |
| /contact | 14 | 273.1 KB | 10.9 KB |

**Screenshots** of the live site are kept outside the repo:
- Every page, desktop 1440 and mobile iPhone 13, settled.
- Home hero frames at 300, 700, 1100, 1600 and 2600 ms.
- Keyboard focus on the first Tab.
- The contact form after an empty submit.

**Rollback:** the last good production deployment is `master` @ 8689698.

**Reduced motion** (headless Chromium, mobile): elements in `main` with an effective opacity below 0.05.

| Page | Invisible elements |
|---|---|
| /experience | 80 / 83 |
| /open-source | 17 / 17 |
| /contact | 18 / 20 |
| Home | 15 / 21 |

---

## Changelog v1 → v2
- **Versions:** `@mui/material-nextjs` → 7.3.10, because 7.3.11 doesn't exist for it. The lockfile audit now covers all 42 advisories. Support-status wording softened.
- **Reduced motion:**
  - Count corrected to 18 `sx` pre-hides, plus the Open Source title's `clipPath`.
  - The CSS-animation failsafe is replaced by timer-class gating, so nothing fights GSAP's inline styles and late hydration can't hide content again.
  - Full lifecycle cleanup and a richer test matrix.
- **Contact:**
  - Sender change to the verified domain, with a rollout order.
  - Honeypot included in the payload.
  - BotID `protect` config.
  - Body-size bound, defined status order and a synchronous double-submit guard.
  - Deployed BotID smoke test and expanded tests.
- **Badges:** the "Coming Soon" breathing is added. All badge motion stops within 5 s.
- **CI:** Corepack is enabled before the Yarn cache step. Vercel Node 24 is set explicitly.
- **Step 2:**
  - A one-route prototype and measurement come before committing.
  - The skill data/function split and the MUI Link wrapper are added.
  - Copy variants are preserved; counts corrected.
  - SplitText is adopted only if it matches frame for frame.
  - React Compiler becomes a measured experiment.
- **Visible changes:** completed with skip link, field errors, sending state, typewriter spacing, the copyright year and slow-connection behaviour.
- **Estimates:** Step 1 is now 1–2 days. Step 2 is re-estimated after the prototype.
- **v2.1 (2026-10-05):**
  - D1 decided (`www`) and D2 approved.
  - Step 0 baseline recorded.
  - **The Playwright rewrite is added as PR 2**, ahead of the PRs that add new browser tests; PRs 3–6 are renumbered.
  - Visual snapshots become the Step 2 guard.
  - Step 1 is now 2–3 days.
- **New Step 0:** baselines and rollback notes.
