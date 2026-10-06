import type { Metadata } from 'next'
import Script from 'next/script'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { ThemeModeProvider } from '@/lib/ThemeModeProvider'
import { introScript } from '@/lib/intro'
import { BIO, JOB_TITLE, SITE_URL, SOCIAL_LINKS } from '@/content/site'
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
      sameAs: [SOCIAL_LINKS.github.url, SOCIAL_LINKS.linkedin.url],
    },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Horus Yeung — Software Architect',
    template: '%s | Horus Yeung',
  },
  description: BIO.meta,
  keywords: [
    'Horus Yeung',
    'Horus',
    'Yeung',
    'Horus Yeung portfolio',
    'Horus Yeung developer',
    'Horus Yeung software architect',
    'Software Architect',
    'Frontend Team Lead',
    'React',
    'Next.js',
    'TypeScript',
    'Full Stack Developer',
    'Vancouver developer',
    'Fintech',
    'Trading Platform',
  ],
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
    title: 'Horus Yeung — Software Architect',
    description: BIO.summary,
    url: '/',
    siteName: 'Horus Yeung',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Horus Yeung — Software Architect',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Horus Yeung — Software Architect',
    description: BIO.twitter,
    images: ['/opengraph-image'],
  },
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
        <Script
          id='json-ld'
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeModeProvider>
            <Navbar />
            <main style={{ flex: 1 }}>{children}</main>
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
