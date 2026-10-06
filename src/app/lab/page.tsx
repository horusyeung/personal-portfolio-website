import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Box, Container } from '@mui/material'
import { githubProjects } from '@/content/projects'
import LiquidGlassCanvas from './LiquidGlassCanvas'
import { DockDemo, DynamicIslandDemo, HoneycombDemo, TvCardsDemo } from './AppleDemos'
import { CardMorphDemo, GlassControlsDemo, GlowDemo, ScrubTextDemo, TabBarDemo } from './MoreDemos'
import s from './lab.module.css'

// Prototypes for review: not linked from the site, kept out of search and the sitemap
export const metadata: Metadata = {
  title: 'Lab',
  robots: { index: false, follow: false },
}

function Prototype({
  n,
  name,
  title,
  lede,
  note,
  children,
}: {
  n: number
  name: string
  title: string
  lede: string
  note: string
  children: ReactNode
}) {
  return (
    <section className={s.section} aria-labelledby={`p${n}`}>
      <div className={s.eyebrow}>
        {String(n).padStart(2, '0')} · {name}
      </div>
      <h2 id={`p${n}`} className={s.heading}>
        {title}
      </h2>
      <p className={s.lede}>{lede}</p>
      <div className={s.stage}>{children}</div>
      <p className={s.note}>{note}</p>
    </section>
  )
}

export default function LabPage() {
  return (
    <Container maxWidth={false} sx={{ maxWidth: 1080, pb: 12 }}>
      <Box sx={{ pt: { xs: 8, md: 12 }, pb: 8 }}>
        <div className={s.eyebrow}>Lab · October 2026</div>
        <h1 className={s.heading} style={{ fontSize: 'clamp(44px, 7vw, 80px)' }}>
          Ten Apple-inspired prototypes.
        </h1>
        <p className={s.lede}>
          Built with the site&apos;s real content, for review only. Drag, click and scroll each one,
          and try them in light and dark mode. Nothing here changes the live pages.
        </p>
      </Box>

      <Prototype
        n={1}
        name='Liquid Glass'
        title='Your name, in Liquid Glass.'
        lede='Drag the glass. Light bends at its rim, splits slightly into colour, and catches a highlight. A droplet trails behind it and melts back in, like iOS 26.'
        note='Echoes the iOS 26 Lock Screen clock and WWDC25 artwork. WebGL draws the glass and its background together, so it refracts in Safari, Chrome and Firefox. Stays still with reduced motion.'
      >
        <LiquidGlassCanvas height={540}>
          <span
            style={{
              fontSize: 36,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#fff',
              textShadow: '0 1px 14px rgba(0,0,0,0.2)',
            }}
          >
            Horus Yeung
          </span>
        </LiquidGlassCanvas>
      </Prototype>

      <Prototype
        n={2}
        name='Floating tab bar'
        title='Navigation that floats.'
        lede='A glass tab bar hovers over the page. The highlight stretches as it slides between tabs, the bar shrinks while you scroll down, and text melts into blur under it.'
        note='Echoes the iOS 26 tab bar and scroll edge effect. Glass is the recipe apple.com uses (blur and saturate); all browsers.'
      >
        <TabBarDemo />
      </Prototype>

      <Prototype
        n={3}
        name='Honeycomb'
        title='Every tool, at a glance.'
        lede='All 45 skills as an Apple Watch app grid. Drag to explore: icons swell in the middle and shrink towards the edge.'
        note='Echoes the watchOS app grid. Hand-built with pointer events, no library. On the real page the categorised list would stay for screen readers.'
      >
        <HoneycombDemo />
      </Prototype>

      <Prototype
        n={4}
        name='Liquid Glass controls'
        title='Controls you want to touch.'
        lede='Press and hold the switch: its knob swells into clear glass. The category control slides a glass capsule that squashes and settles, and the skills below follow.'
        note='Echoes iOS 26 switches and segmented controls. Real switch and radio semantics; all browsers.'
      >
        <GlassControlsDemo />
      </Prototype>

      <Prototype
        n={5}
        name='Card morph'
        title='Projects that open like the App Store.'
        lede='Tap a card and it grows into a full sheet, then shrinks back into place when you close it.'
        note='Echoes the App Store Today tab. React ViewTransition, which the site already uses. Chrome and Safari 18+; elsewhere the sheet simply appears. Esc closes it.'
      >
        <CardMorphDemo />
      </Prototype>

      <Prototype
        n={6}
        name='Dynamic Island'
        title='Feedback that feels alive.'
        lede='Sending the contact form morphs a little island: a spinner while it sends, then a confirmation that springs open.'
        note='Echoes the iPhone Dynamic Island. CSS transitions with a spring curve; announced to screen readers as a status.'
      >
        <DynamicIslandDemo />
      </Prototype>

      <Prototype
        n={7}
        name='Scroll-lit text'
        title='Words that light up as you read.'
        lede='Scroll slowly past the paragraph below.'
        note='Echoes apple.com product pages. GSAP SplitText with a scrubbed ScrollTrigger; all browsers. Fully visible with reduced motion.'
      >
        <ScrubTextDemo />
      </Prototype>

      <Prototype
        n={8}
        name='Apple TV cards'
        title='Depth you can feel.'
        lede='Move the pointer over a card. It lifts, tilts towards you, its layers separate and a glare slides across.'
        note='Echoes the tvOS focus effect. Also reacts to keyboard focus; lift only on touch and with reduced motion.'
      >
        <TvCardsDemo projects={githubProjects} />
      </Prototype>

      <Prototype
        n={9}
        name='Dock'
        title='Get in touch, the Mac way.'
        lede='Run the pointer along the dock. Icons grow as you pass, with their names above.'
        note='Echoes the macOS Dock. Mouse and trackpad get the magnification; touch and keyboard get plain links.'
      >
        <DockDemo />
      </Prototype>

      <Prototype
        n={10}
        name='Apple Intelligence glow'
        title='A little bit of magic.'
        lede='Click into the message field, or hover the button, for the Apple Intelligence glow.'
        note='Echoes the Apple Intelligence edge glow. CSS only: a rotating conic gradient with a soft halo. Static with reduced motion.'
      >
        <GlowDemo />
      </Prototype>
    </Container>
  )
}
