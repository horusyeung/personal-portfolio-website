import type { Metadata } from 'next'
import { baseOpenGraph } from '@/lib/metadata'

export const metadata: Metadata = {
  title: 'Experience',
  description:
    'Work experience, education and certifications of Horus Yeung, a senior full stack developer and frontend team lead at Juno Markets.',
  alternates: {
    canonical: '/experience',
  },
  openGraph: {
    ...baseOpenGraph,
    title: 'Experience | Horus Yeung',
    description:
      'Work experience, education and certifications of Horus Yeung, a senior full stack developer and team lead.',
    url: '/experience',
  },
}

export default function ExperienceLayout({ children }: { children: React.ReactNode }) {
  return children
}
