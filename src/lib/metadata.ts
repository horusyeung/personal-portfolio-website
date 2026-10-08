import type { Metadata } from 'next'
import { SITE_TITLE } from '@/content/site'

/**
 * Metadata merges shallowly, so a page that sets `openGraph` replaces the layout's whole object,
 * image included. Every page spreads this base to keep the image and site details.
 */
export const baseOpenGraph = {
  siteName: 'Horus Yeung',
  locale: 'en_US',
  type: 'website',
  // Give manually inherited images a fresh URL as well as Next's file-based metadata hash.
  // Social platforms can otherwise retain the previous thumbnail after a deployment.
  images: [
    {
      url: '/opengraph-image?v=soft-hy',
      width: 1200,
      height: 630,
      type: 'image/png',
      alt: SITE_TITLE,
    },
  ],
} satisfies Metadata['openGraph']
