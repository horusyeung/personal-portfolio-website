// Lighthouse CI budgets (agreed 2026-10-06; see docs/upgrade-plan.md, step 2.6).
// Quality budgets fail the run. Speed budgets only warn: timings on shared CI machines are noisy.
const PORT = process.env.LHCI_PORT ?? '3000'
const PAGES = ['/', '/experience', '/open-source', '/contact']
const KB = 1024

module.exports = {
  ci: {
    collect: {
      startServerCommand: `yarn start --port ${PORT}`,
      startServerReadyPattern: 'Ready',
      url: PAGES.map((path) => `http://localhost:${PORT}${path}`),
      numberOfRuns: 3,
      settings: { chromeFlags: '--no-sandbox --headless=new' },
    },
    assert: {
      assertions: {
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:seo': ['error', { minScore: 1 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        // Transfer sizes include what Next prefetches for the other pages (313 KB JS and
        // at most 362 KB in total when the budgets were set)
        'resource-summary:script:size': ['error', { maxNumericValue: 350 * KB }],
        'resource-summary:total:size': ['error', { maxNumericValue: 420 * KB }],
        'categories:performance': ['warn', { minScore: 0.9 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 4000 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
      },
    },
    // Reports stay in the workflow's artifacts, not on LHCI's public temporary storage
    upload: { target: 'filesystem', outputDir: '.lighthouseci/reports' },
  },
}
