import type { NextConfig } from 'next'
import { withBotId } from 'botid/next/config'

const nextConfig: NextConfig = {
  experimental: {
    cssChunking: 'graph',
  },
}

export default withBotId(nextConfig)
