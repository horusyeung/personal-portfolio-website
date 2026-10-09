import { BIO, SITE_TITLE, SITE_URL } from '@/content/site'
import HomeContent from './HomeContent'

// The home page is a professional profile. Keep its markup on this route rather than declaring
// every page (including Contact and Open Source) to be a profile.
const profileJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': `${SITE_URL}/#profile`,
  url: SITE_URL,
  name: SITE_TITLE,
  description: BIO.summary,
  isPartOf: { '@id': `${SITE_URL}/#website` },
  mainEntity: {
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: 'Horus Yeung',
  },
}

export default function HomePage() {
  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd).replace(/</g, '\\u003c') }}
      />
      <HomeContent />
    </>
  )
}
