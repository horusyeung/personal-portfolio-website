import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Box, Container, Typography } from '@mui/material'
import {
  EntryDemo,
  LineRevealDemo,
  LiquidGlassDemo,
  NavPillDemo,
  RailDemo,
  SpotlightDemo,
  TooltipDemo,
} from './demos'
import s from './lab.module.css'

// Prototypes for review: not linked from the site, kept out of search and the sitemap
export const metadata: Metadata = {
  title: 'Lab',
  robots: { index: false, follow: false },
}

function Prototype({
  n,
  title,
  description,
  meta,
  children,
}: {
  n: number
  title: string
  description: string
  meta: string
  children: ReactNode
}) {
  return (
    <section className={s.section} aria-labelledby={`p${n}`}>
      <Typography
        sx={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', color: 'text.secondary' }}
      >
        PROTOTYPE {n}
      </Typography>
      <Typography
        id={`p${n}`}
        variant='h2'
        sx={{ mt: 1, fontSize: { xs: 28, md: 36 }, fontWeight: 700 }}
      >
        {title}
      </Typography>
      <Typography sx={{ mt: 1.5, fontSize: 17, color: 'text.secondary', maxWidth: 720 }}>
        {description}
      </Typography>
      <p className={s.meta}>{meta}</p>
      {children}
    </section>
  )
}

export default function LabPage() {
  return (
    <Container maxWidth={false} sx={{ maxWidth: 980, pb: 12 }}>
      <Box sx={{ pt: { xs: 8, md: 12 }, pb: 6 }}>
        <Typography
          variant='h1'
          sx={{ fontSize: { xs: 48, md: 80 }, fontWeight: 700, letterSpacing: '-0.015em' }}
        >
          Lab
        </Typography>
        <Typography sx={{ mt: 2, fontSize: 21, color: 'text.secondary', maxWidth: 680 }}>
          Ten prototypes from the October 2026 research, built with the site&apos;s real content.
          Nothing here changes the live pages. Try them in light and dark mode.
        </Typography>
      </Box>

      <Prototype
        n={1}
        title='Line-by-line headline reveal'
        description='Each line of a heading slides up from behind a mask, one after another. It would replace the letter-by-letter split on section headings (the hero name stays as it is).'
        meta='Apple: apple.com/apple-music headlines. GSAP SplitText with line masks. All browsers. Off with reduced motion.'
      >
        <LineRevealDemo />
      </Prototype>

      <Prototype
        n={2}
        title='Liquid Glass'
        description='A floating glass tab bar over your skills, a lens you can drag, and glass chips. In Chrome the glass bends what is behind it like a real lens. Safari and Firefox get the frosted version that apple.com itself uses.'
        meta='Apple: iOS 26 Liquid Glass; apple.com uses blur(20px) saturate(180%) on translucent fills. Refraction needs Chrome. Solid fill with Reduce Transparency.'
      >
        <LiquidGlassDemo />
      </Prototype>

      <Prototype
        n={3}
        title='Sliding nav pill'
        description='The highlight behind the active link glides to the next one, like the iOS 26 tab bar. It uses the view transitions the site already has, so it would also run between real pages.'
        meta='Apple: tab nav on apple.com/macbook-pro. React ViewTransition. Chrome, Safari 18+, Firefox 144+; elsewhere the pill jumps.'
      >
        <NavPillDemo />
      </Prototype>

      <Prototype
        n={4}
        title='Highlight copy'
        description='Body text in grey with the key phrases in full colour. In Chrome and Safari the phrases light up as you scroll past.'
        meta='Apple: apple.com/macbook-pro section copy. CSS only; the scroll-linked part needs Chrome 115+ or Safari 26+, and Firefox shows it static.'
      >
        <div className={s.stage}>
          <p className={s.highlightCopy}>
            <span className={s.hl}>Designed a microservice architecture from scratch.</span> Lead a
            distributed team of 5 engineers <span className={s.hl}>while coding daily</span>,
            managing cross-timezone sprints, coding standards and CI/CD pipelines. Use{' '}
            <span className={s.hl}>AI-augmented development workflows</span> to speed up delivery
            and raise code quality.
          </p>
        </div>
      </Prototype>

      <Prototype
        n={5}
        title='Gradient accent text'
        description='One phrase in a soft colour gradient, used sparingly, for example in the closing call to action.'
        meta='Apple: apple.com/macbook-pro and Apple Intelligence headlines. CSS only, all browsers.'
      >
        <div className={s.stage}>
          <Typography
            variant='h2'
            sx={{ fontSize: { xs: 40, md: 56 }, fontWeight: 700, letterSpacing: '-0.015em' }}
          >
            Let&apos;s work <span className={s.gradientText}>together.</span>
          </Typography>
        </div>
      </Prototype>

      <Prototype
        n={6}
        title='Smooth entry for messages'
        description='The contact form’s success and error messages fade and rise in, and fade out again, with CSS alone.'
        meta='CSS @starting-style and transition-behavior. Chrome 117+, Safari 17.5+, Firefox 129+. Off with reduced motion.'
      >
        <EntryDemo />
      </Prototype>

      <Prototype
        n={7}
        title='Spotlight tiles'
        description='A soft light and a glowing border follow the pointer across tiles, matching the glow already on the Open Source cards.'
        meta='One pointer listener writing CSS variables. Mouse and trackpad only.'
      >
        <SpotlightDemo />
      </Prototype>

      <Prototype
        n={8}
        title='Tooltips that place themselves'
        description='Hover or tab to an icon to see its name. Near the top of the screen the tooltip flips below the icon on its own.'
        meta='CSS anchor positioning. Chrome 125+, Safari 26+, Firefox 147+; older browsers show it above.'
      >
        <TooltipDemo />
      </Prototype>

      <Prototype
        n={9}
        title='Squircle corners'
        description='Apple’s smooth “continuous” corners instead of plain rounded ones. Compare the two shapes.'
        meta='CSS corner-shape: squircle. Chrome 139+ only for now; other browsers show normal rounded corners.'
      >
        <div className={`${s.stage} ${s.squircleRow}`}>
          <div className={s.shape}>border-radius</div>
          <div className={`${s.shape} ${s.squircle}`}>corner-shape: squircle</div>
        </div>
      </Prototype>

      <Prototype
        n={10}
        title='Experience progress rail'
        description='A thin line beside the roles fills in as you scroll through your career.'
        meta='GSAP ScrollTrigger scrub, all browsers. Shown full and still with reduced motion. Adds one visual element to the Experience page.'
      >
        <RailDemo />
      </Prototype>
    </Container>
  )
}
