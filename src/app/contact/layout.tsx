import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Horus Yeung — Software Architect based in Vancouver, BC. Available for collaboration and opportunities.',
  alternates: {
    canonical: 'https://horusyeung.com/contact',
  },
  openGraph: {
    title: 'Contact | Horus Yeung',
    description: 'Get in touch with Horus Yeung — Software Architect based in Vancouver, BC.',
    url: 'https://horusyeung.com/contact',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
