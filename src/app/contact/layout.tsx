import type { Metadata } from 'next'
import { baseOpenGraph } from '@/lib/metadata'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Horus Yeung, a senior full stack developer and team lead based in Vancouver, BC.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    ...baseOpenGraph,
    title: 'Contact | Horus Yeung',
    description: 'Get in touch with Horus Yeung, a full stack developer based in Vancouver, BC.',
    url: '/contact',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
