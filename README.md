# Horus Yeung — Portfolio

Source for [www.horusyeung.com](https://www.horusyeung.com): a four-page portfolio (home, experience, open source, contact) with GSAP animations and a contact form that sends email through Resend.

## Stack

- **Next.js 16** (App Router, Turbopack) and **React 19**, TypeScript
- **MUI 9** with Emotion for components and styling
- **GSAP 3** (`ScrollTrigger`, `@gsap/react`) for animations
- **Resend** for contact email, **Vercel BotID** for bot protection
- **Vitest** + Testing Library for unit tests, **Playwright** for end-to-end and visual tests
- Deployed on **Vercel**, with Vercel Analytics and Speed Insights

## Getting started

Requires Node 24 (see `.nvmrc`) and Yarn 4 through Corepack.

```bash
corepack enable
yarn install
yarn dev
```

Then open http://localhost:3000. The contact form needs `RESEND_API_KEY` (below); every other page works without it.

## Environment variables

| Name             | Where                                   | Purpose                                                           |
| ---------------- | --------------------------------------- | ----------------------------------------------------------------- |
| `RESEND_API_KEY` | Vercel, or `.env.local` for local sends | Sends contact form email. Without it the contact API returns 503. |

BotID runs only on Vercel (the `VERCEL` variable Vercel sets) and on the `horusyeung.com` and `*.vercel.app` hosts. Local and CI builds skip it.

## Scripts

| Command                           | What it does                                                                                                        |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `yarn dev`                        | Development server on port 3000                                                                                     |
| `yarn build` / `yarn start`       | Production build, then serve it                                                                                     |
| `yarn lint` / `yarn format:check` | ESLint and Prettier (`yarn format` fixes formatting)                                                                |
| `yarn test`                       | Unit tests (Vitest); `yarn test:watch` to watch                                                                     |
| `yarn test:e2e`                   | Playwright Chromium, Firefox and WebKit, plus Pixel 7 and iPhone 13 emulation. Starts `yarn start`, so build first. |
| `yarn test:visual`                | Pixel-exact visual snapshots, run in the Playwright Docker image against a server on port 3000                      |
| `yarn test:visual:update`         | Regenerate the visual snapshots after an intended visual change                                                     |

To run the end-to-end tests against a server that is already running, set `PLAYWRIGHT_BASE_URL`, for example `PLAYWRIGHT_BASE_URL=http://localhost:3000 yarn test:e2e`.

Visual snapshots only render identically inside the pinned Linux x64 Docker image, which is why `yarn test:visual` runs there. Start the production server first (`yarn build && yarn start`). Browser emulation does not replace physical-device, native Safari or screen-reader checks.

The Husky pre-commit definition runs lint, formatting and unit checks when hooks are installed in the checkout. If hooks are unavailable, run those commands directly and record that limitation; do not report an uninstalled hook as having run.

## Project layout

```text
src/
  app/          Routes, metadata, sitemap, robots, social image, contact API
  components/   Navbar, Footer, ScrollReveal, MagneticElement
  content/      Site details, bios, experience, projects and skills (edit copy here)
  lib/          Theme, GSAP setup and motion hooks, contact validation, metadata helpers
e2e/            Playwright tests and visual snapshots
docs/           Effects plan, motion audit, research decisions and upgrade notes
```

Content lives in `src/content/`. When a page's text changes, also update that page's date in `src/app/sitemap.ts`.

Animations respect `prefers-reduced-motion`. If JavaScript hasn't loaded within 3 seconds, the intro animations are skipped and content simply appears (`src/lib/intro.ts`).

The current design keeps the full-width navigation, stable CSS hero and Soft HY identity, with Bento technology categories on desktop and category shelves on mobile. The Home architecture and delivery views are illustrative, including the agent-first workflows and local Husky checks; they do not execute integrations or install tooling. The mini-game/interactive-demo proposal was skipped. See [the effects plan](docs/apple-effects-plan.md) and [motion audit](docs/motion-audit.md) for the release history and remaining cleanup evidence.

## CI and deployment

GitHub Actions (`.github/workflows/ci.yml`) runs on pull requests to `master` and on pushes to it:

1. Lint, format and type check
2. Unit tests
3. Playwright end-to-end and visual tests, inside the Playwright Docker image
4. Lighthouse accessibility, SEO, layout-shift and transfer budgets, with performance advisories

`master` is protected. A production deployment waits for all four jobs, then builds and deploys to Vercel. Playwright retains traces and screenshots from failed attempts, including failures followed by a passing retry; CI uploads the report for successful and failed jobs. A passing retry does not diagnose or resolve the original failure. Dependabot opens npm updates weekly and GitHub Actions updates monthly.

## License

[MIT](LICENSE)
