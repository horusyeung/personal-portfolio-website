import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Open Source',
  description:
    'Open source projects and contributions by Horus Yeung — project structures, trading tools, and developer utilities on GitHub.',
  alternates: {
    canonical: 'https://horusyeung.com/open-source',
  },
  openGraph: {
    title: 'Open Source | Horus Yeung',
    description:
      'Open source projects and contributions by Horus Yeung — project structures, trading tools, and developer utilities.',
    url: 'https://horusyeung.com/open-source',
  },
}

export default function OpenSourceLayout({ children }: { children: React.ReactNode }) {
  return children
}
