import { initBotId } from 'botid/client/core'

// BotID's challenge is served through Vercel's edge. Elsewhere (local builds, CI) it can never
// load, and protected requests would wait on it, so only enable it on Vercel-hosted domains.
// The API route skips its check off Vercel to match (src/app/api/contact/route.ts).
const onVercel = /(^|\.)horusyeung\.com$|\.vercel\.app$/.test(window.location.hostname)

if (onVercel) {
  initBotId({
    protect: [{ path: '/api/contact', method: 'POST' }],
  })
}
