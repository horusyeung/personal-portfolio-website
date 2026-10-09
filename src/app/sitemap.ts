import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/content/site'

// Last significant content, metadata or structured-data update. Keep these fixed until a real
// change: using the build time would claim every page changes on every deploy.
const pages: MetadataRoute.Sitemap = [
  { url: '', lastModified: '2026-10-09', changeFrequency: 'monthly', priority: 1 },
  { url: '/experience', lastModified: '2026-10-09', changeFrequency: 'monthly', priority: 0.8 },
  { url: '/open-source', lastModified: '2026-10-09', changeFrequency: 'weekly', priority: 0.8 },
  { url: '/contact', lastModified: '2026-10-09', changeFrequency: 'yearly', priority: 0.7 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((page) => ({ ...page, url: `${SITE_URL}${page.url}` }))
}
