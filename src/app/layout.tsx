import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeModeProvider } from '@/lib/ThemeModeProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'Horus Yeung | Senior Software Architect & Frontend Team Lead',
  description:
    'Senior Software Architect and Frontend Team Lead with 6+ years of experience building high-performance fintech and trading platforms. Based in Vancouver, BC.',
  keywords: [
    'Horus Yeung',
    'Software Architect',
    'Frontend Team Lead',
    'React',
    'Next.js',
    'TypeScript',
    'Full Stack Developer',
    'Vancouver',
  ],
  authors: [{ name: 'Horus Yeung' }],
  openGraph: {
    title: 'Horus Yeung | Senior Software Architect & Frontend Team Lead',
    description:
      'Senior Software Architect and Frontend Team Lead with 6+ years of experience building high-performance fintech and trading platforms.',
    url: 'https://horusyeung.com',
    siteName: 'Horus Yeung',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeModeProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </ThemeModeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
