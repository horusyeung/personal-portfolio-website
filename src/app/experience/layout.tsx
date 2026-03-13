import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Experience',
  description:
    'Work experience, education, and certifications of Horus Yeung — Frontend Team Lead and Software Architect specializing in fintech and trading platforms.',
  alternates: {
    canonical: 'https://horusyeung.com/experience',
  },
  openGraph: {
    title: 'Experience | Horus Yeung',
    description:
      'Work experience, education, and certifications of Horus Yeung — Frontend Team Lead and Software Architect.',
    url: 'https://horusyeung.com/experience',
  },
}

export default function ExperienceLayout({ children }: { children: React.ReactNode }) {
  return children
}
