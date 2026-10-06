/**
 * The site's canonical origin. Vercel serves www.horusyeung.com and redirects the bare domain
 * to it, so canonicals, sitemap, robots and structured data must all use this exact origin.
 */
export const SITE_URL = 'https://www.horusyeung.com'

/** The domain as shown to visitors: horusyeung.com */
export const SITE_DOMAIN = new URL(SITE_URL).hostname.replace(/^www\./, '')

export const EMAIL = 'horusyeungg@gmail.com'

export const JOB_TITLE = 'Software Architect & Team Lead'

export const LOCATION = 'Vancouver, BC'

export const SOCIAL_LINKS = {
  linkedin: { label: 'LinkedIn', url: 'https://linkedin.com/in/horusyeung' },
  github: { label: 'GitHub', url: 'https://github.com/horusyeung' },
  medium: { label: 'Medium', url: 'https://medium.com/@horusyeung' },
}

const SUMMARY =
  'Senior Software Architect and Frontend Team Lead with 6+ years building high-performance fintech and trading platforms.'

/** The bio's wording differs on purpose from place to place, so each variant keeps its own text. */
export const BIO = {
  /** Home hero subtitle */
  hero: 'Senior Software Architect and Team Lead with 6+ years building high-performance fintech and trading platforms. Architect and ship full-stack products end-to-end, from system design to deployment.',
  /** Footer, structured data and Open Graph */
  summary: SUMMARY,
  /** Default meta description */
  meta: `${SUMMARY} Based in ${LOCATION}.`,
  /** Twitter card */
  twitter:
    'Senior Software Architect and Frontend Team Lead building high-performance fintech platforms.',
}
