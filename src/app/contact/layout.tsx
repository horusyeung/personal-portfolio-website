import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Horus Yeung — Software Architect based in Vancouver, BC. Available for collaboration and opportunities.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact | Horus Yeung',
    description: 'Get in touch with Horus Yeung — Software Architect based in Vancouver, BC.',
    url: '/contact',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
