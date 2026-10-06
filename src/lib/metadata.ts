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
  images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: SITE_TITLE }],
} satisfies Metadata['openGraph']
