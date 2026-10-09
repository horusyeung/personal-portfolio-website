import type { Metadata } from 'next'
import { baseOpenGraph } from '@/lib/metadata'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact Horus Yeung, a senior full stack developer and team lead in Vancouver, BC, about web and mobile products, technical leadership and collaboration.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    ...baseOpenGraph,
    title: 'Contact | Horus Yeung',
    description:
      'Contact Horus Yeung, a senior full stack developer and team lead in Vancouver, BC, about web and mobile products, technical leadership and collaboration.',
    url: '/contact',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
