import type { Metadata } from 'next'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { ThemeModeProvider } from '@/lib/ThemeModeProvider'
import { introScript } from '@/lib/intro'
import { BIO, JOB_TITLE, SITE_TITLE, SITE_URL, SOCIAL_LINKS } from '@/content/site'
import { baseOpenGraph } from '@/lib/metadata'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import './globals.css'

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Horus Yeung',
      description: BIO.summary,
      publisher: { '@id': `${SITE_URL}/#person` },
    },
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: 'Horus Yeung',
      givenName: 'Horus',
      familyName: 'Yeung',
      url: SITE_URL,
      jobTitle: JOB_TITLE,
      worksFor: {
        '@type': 'Organization',
        name: 'Juno Markets',
      },
      knowsAbout: [
        'Software Architecture',
        'React',
        'Next.js',
        'TypeScript',
        'Node.js',
        'Full Stack Development',
        'Fintech',
        'Trading Platforms',
      ],
      sameAs: [SOCIAL_LINKS.github.url, SOCIAL_LINKS.linkedin.url, SOCIAL_LINKS.medium.url],
    },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: '%s | Horus Yeung',
  },
  description: BIO.meta,
  authors: [{ name: 'Horus Yeung' }],
  creator: 'Horus Yeung',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    ...baseOpenGraph,
    title: SITE_TITLE,
    description: BIO.summary,
    url: '/',
  },
  // Only the card type: Next fills in each page's own title, description and image from its
  // Open Graph tags, so subpages no longer repeat the home title
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' data-scroll-behavior='smooth' suppressHydrationWarning>
      <head>
        {/* Must run before the body paints: see src/lib/intro.ts */}
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>
        {/* A plain script so crawlers find it in the HTML (next/script is for code to run).
            Escaping < keeps the JSON from closing the tag. */}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeModeProvider>
            <a href='#main' className='skip-link'>
              Skip to content
            </a>
            <Navbar />
            <main id='main' tabIndex={-1} style={{ flex: 1 }}>
              {children}
            </main>
            {/* Set at build time: each deploy refreshes it, and the HTML and hydration agree */}
            <Footer year={new Date().getFullYear()} />
          </ThemeModeProvider>
          <Analytics />
          <SpeedInsights />
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
