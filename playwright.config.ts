import { defineConfig, devices } from '@playwright/test'

const PORT = 3000
const isCI = !!process.env.CI
// Point at an already-running server (e.g. from the Playwright Docker image) instead of starting one
const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: isCI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: externalBaseURL ?? `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  expect: {
    // Visual snapshots are rendered in the Playwright Docker image (see e2e/visual.spec.ts)
    // Strict: renders in the Docker image are deterministic, and the default 0.2 colour
    // tolerance let a text colour change (#86868b → #6e6e73) pass unnoticed
    toHaveScreenshot: { animations: 'disabled', caret: 'hide', threshold: 0 },
  },
  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'Desktop Safari',
      use: { ...devices['Desktop Safari'], viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'Desktop Firefox',
      use: { ...devices['Desktop Firefox'], viewport: { width: 1280, height: 800 } },
      testIgnore: /visual\.spec\.ts/,
    },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 7'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 13'] } },
  ],
  webServer: externalBaseURL
    ? undefined
    : {
        // Runs against a production build, so run `yarn build` first
        command: 'yarn start',
        url: `http://localhost:${PORT}`,
        reuseExistingServer: !isCI,
        timeout: 60_000,
        // A dummy key keeps the contact route loadable and guarantees tests never send real email
        env: { RESEND_API_KEY: 're_dummy_e2e' },
      },
})
