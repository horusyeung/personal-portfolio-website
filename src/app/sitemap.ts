import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/content/site'

// When each page's text last changed. Update a page's date when its content changes: a build-time
// date would claim every page changes on every deploy, and search engines then ignore lastmod.
const pages: MetadataRoute.Sitemap = [
  { url: '', lastModified: '2026-03-14', changeFrequency: 'monthly', priority: 1 },
  { url: '/experience', lastModified: '2026-10-08', changeFrequency: 'monthly', priority: 0.8 },
  { url: '/open-source', lastModified: '2026-03-14', changeFrequency: 'weekly', priority: 0.8 },
  { url: '/contact', lastModified: '2026-03-14', changeFrequency: 'yearly', priority: 0.7 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((page) => ({ ...page, url: `${SITE_URL}${page.url}` }))
}
