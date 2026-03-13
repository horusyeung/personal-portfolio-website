import type { Metadata } from 'next'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { ThemeModeProvider } from '@/lib/ThemeModeProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://horusyeung.com'),
  title: {
    default: 'Horus Yeung — Software Architect',
    template: '%s | Horus Yeung',
  },
  description:
    'Senior Software Architect and Frontend Team Lead with 6+ years building high-performance fintech and trading platforms. Based in Vancouver, BC.',
  keywords: [
    'Horus Yeung',
    'Software Architect',
    'Frontend Team Lead',
    'React',
    'Next.js',
    'TypeScript',
    'Full Stack Developer',
    'Vancouver',
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
    canonical: 'https://horusyeung.com',
  },
  openGraph: {
    title: 'Horus Yeung — Software Architect',
    description:
      'Senior Software Architect and Frontend Team Lead with 6+ years building high-performance fintech and trading platforms.',
    url: 'https://horusyeung.com',
    siteName: 'Horus Yeung',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Horus Yeung — Software Architect',
    description:
      'Senior Software Architect and Frontend Team Lead building high-performance fintech platforms.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          margin: 0,
        }}
      >
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeModeProvider>
            <Navbar />
            <main style={{ flex: 1 }}>{children}</main>
            <Footer />
          </ThemeModeProvider>
          <Analytics />
          <SpeedInsights />
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
