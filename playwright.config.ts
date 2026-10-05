import { defineConfig, devices } from '@playwright/test'

const PORT = 3000
const isCI = !!process.env.CI

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: isCI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
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
    { name: 'Mobile Chrome', use: { ...devices['Pixel 7'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 13'] } },
  ],
  webServer: {
    // Runs against a production build, so run `yarn build` first
    command: 'yarn start',
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !isCI,
    timeout: 60_000,
    // A dummy key keeps the contact route loadable and guarantees tests never send real email
    env: { RESEND_API_KEY: 're_dummy_e2e' },
  },
})
