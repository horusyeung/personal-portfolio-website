import type { Metadata } from 'next'
import { baseOpenGraph } from '@/lib/metadata'

export const metadata: Metadata = {
  title: 'Experience',
  description:
    'Explore Horus Yeung’s experience leading fintech teams, building full-stack and mobile products, and delivering test automation, plus education and certifications.',
  alternates: {
    canonical: '/experience',
  },
  openGraph: {
    ...baseOpenGraph,
    title: 'Experience | Horus Yeung',
    description:
      'Explore Horus Yeung’s experience leading fintech teams, building full-stack and mobile products, and delivering test automation, plus education and certifications.',
    url: '/experience',
  },
}

export default function ExperienceLayout({ children }: { children: React.ReactNode }) {
  return children
}
