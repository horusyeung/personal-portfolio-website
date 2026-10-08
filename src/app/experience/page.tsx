'use client'

import { useRef } from 'react'
import { Box, Container, Typography } from '@mui/material'
import { gsap } from '@/lib/gsap'
import { splitTextIntoChars } from '@/lib/animations'
import { useEntranceAnimation } from '@/lib/motion'
import ScrollReveal from '@/components/ScrollReveal'
import { certifications, education, experiences } from '@/content/experience'

// ── Data ────────────────────────────────────────────────────────────────────

const SUBTITLE_TEXT = 'From test automation to full stack development and team leadership.'

// ── Component ───────────────────────────────────────────────────────────────

export default function ExperiencePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const subtitleTextRef = useRef<HTMLSpanElement>(null)
  const typedRef = useRef<HTMLSpanElement>(null)

  useEntranceAnimation(() => {
    const cleanups: (() => void)[] = []
    let titleDuration = 0

    // ── #11: Page title — split-text scale 1.5→1.0 with fade ──
    const titleEl = titleRef.current
    if (titleEl) {
      const { chars, revert } = splitTextIntoChars(titleEl)
      cleanups.push(revert)
      gsap.set(titleEl, { opacity: 1 })
      gsap.from(chars, {
        scale: 1.5,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.03,
      })
      titleDuration = 0.6 + 0.03 * (chars.length - 1)
    }

    // ── #12: Subtitle — typewriter with blinking cursor ──
    // Types over a transparent copy of the full text, so the height never changes and
    // screen readers always get the whole sentence.
    const subtitleEl = subtitleRef.current
    const fullTextEl = subtitleTextRef.current
    const typedEl = typedRef.current
    if (subtitleEl && fullTextEl && typedEl) {
      const textSpan = document.createElement('span')
      const cursorSpan = document.createElement('span')
      cursorSpan.textContent = '|'
      cursorSpan.style.display = 'inline'
      cursorSpan.style.fontWeight = '300'
      cursorSpan.style.marginLeft = '2px'
      typedEl.append(textSpan, cursorSpan)
      cleanups.push(() => typedEl.replaceChildren())

      gsap.set(subtitleEl, { opacity: 1 })
      gsap.set(fullTextEl, { color: 'transparent' })

      // Blink cursor during typing
      const blinkTl = gsap.timeline({ repeat: -1 })
      blinkTl.to(cursorSpan, { opacity: 0, duration: 0.4 })
      blinkTl.to(cursorSpan, { opacity: 1, duration: 0.4 })

      // Typewriter effect — after title animation completes
      const obj = { index: 0 }
      gsap.to(obj, {
        index: SUBTITLE_TEXT.length,
        duration: 1.5,
        ease: 'none',
        delay: titleDuration + 0.2,
        onUpdate: () => {
          textSpan.textContent = SUBTITLE_TEXT.slice(0, Math.round(obj.index))
        },
        onComplete: () => {
          // Blink cursor 2 more times, then hand back to the static text
          blinkTl.kill()
          gsap.set(cursorSpan, { opacity: 1 })
          const endBlink = gsap.timeline()
          endBlink.to(cursorSpan, { opacity: 0, duration: 0.4, delay: 0.3 })
          endBlink.to(cursorSpan, { opacity: 1, duration: 0.4 })
          endBlink.to(cursorSpan, { opacity: 0, duration: 0.4 })
          endBlink.to(cursorSpan, { opacity: 1, duration: 0.4 })
          endBlink.to(cursorSpan, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
              gsap.set(fullTextEl, { clearProps: 'color' })
              typedEl.replaceChildren()
            },
          })
        },
      })
    }

    return () => cleanups.forEach((cleanup) => cleanup())
  }, containerRef)

  return (
    <Box ref={containerRef}>
      {/* ===== HERO SECTION ===== */}
      <Box
        data-testid='experience-hero'
        component='section'
        sx={{
          bgcolor: 'background.default',
          pt: { xs: '80px', md: '120px' },
          pb: { xs: '40px', md: '60px' },
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: 680, textAlign: 'center' }}>
          <Typography
            ref={titleRef}
            data-intro
            variant='h1'
            sx={{
              fontSize: { xs: '48px', md: '80px' },
              fontWeight: 700,
              letterSpacing: '-0.015em',
              lineHeight: 1.05,
              color: 'text.primary',
            }}
          >
            Experience
          </Typography>
          <Box
            ref={subtitleRef}
            data-intro
            sx={{
              position: 'relative',
              mt: 2,
              mx: 'auto',
              maxWidth: 560,
              fontSize: '21px',
              fontWeight: 400,
              lineHeight: 1.47,
              color: 'text.secondary',
            }}
          >
            <span ref={subtitleTextRef}>{SUBTITLE_TEXT}</span>
            <Box
              component='span'
              ref={typedRef}
              aria-hidden='true'
              sx={{ position: 'absolute', inset: 0 }}
            />
          </Box>
        </Container>
      </Box>

      {/* ===== WORK EXPERIENCE SECTION ===== */}
      <Box
        data-testid='work-experience'
        component='section'
        sx={{
          bgcolor: 'background.default',
          pb: { xs: '40px', md: '60px' },
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: 680, position: 'relative' }}>
          {experiences.map((exp, index) => (
            <ScrollReveal key={`${exp.company}-${exp.period}`} delay={index * 0.08}>
              <Box
                sx={{
                  position: 'relative',
                  py: { xs: '32px', md: '40px' },
                  ...(index !== 0 && {
                    borderTop: '1px solid',
                    borderColor: 'divider',
                  }),
                }}
              >
                {/* Period */}
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 400,
                    color: 'text.secondary',
                  }}
                >
                  {exp.period}
                </Typography>

                {/* Title: an h2 directly under the page's h1, styled as before */}
                <Typography
                  variant='h4'
                  component='h2'
                  sx={{
                    mt: 0.5,
                    fontSize: { xs: '24px', md: '28px' },
                    fontWeight: 600,
                    lineHeight: 1.2,
                    color: 'text.primary',
                  }}
                >
                  {exp.title}
                </Typography>

                {/* Company */}
                <Typography
                  sx={{
                    mt: 0.5,
                    fontSize: '17px',
                    fontWeight: 400,
                    color: 'primary.link',
                  }}
                >
                  {exp.company}
                </Typography>

                {/* Location */}
                <Typography
                  sx={{
                    mt: 0.25,
                    fontSize: '14px',
                    color: 'text.secondary',
                  }}
                >
                  {exp.location}
                </Typography>

                {/* Bullets */}
                <Box
                  component='ul'
                  role='list'
                  sx={{
                    mt: 2,
                    p: 0,
                    m: 0,
                    listStyle: 'none',
                  }}
                >
                  {exp.bullets.map((bullet, j) => (
                    <Box component='li' key={j} sx={{ mb: 0.5 }}>
                      <Typography
                        sx={{
                          fontSize: { xs: '15px', md: '17px' },
                          color: 'text.secondary',
                          lineHeight: 1.65,
                          // Drawn by CSS, with empty alt text so screen readers skip it
                          '&::before': { content: '"· " / ""' },
                        }}
                      >
                        {bullet}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </ScrollReveal>
          ))}
        </Container>
      </Box>

      {/* ===== EDUCATION SECTION ===== */}
      <Box
        data-testid='education-section'
        component='section'
        sx={{
          bgcolor: 'background.paper',
          py: { xs: '80px', md: '120px' },
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: 680 }}>
          <ScrollReveal>
            <Typography
              variant='h2'
              sx={{
                fontSize: { xs: '40px', md: '56px' },
                fontWeight: 700,
                letterSpacing: '-0.015em',
                lineHeight: 1.07,
                color: 'text.primary',
              }}
            >
              Education
            </Typography>
          </ScrollReveal>

          <ScrollReveal>
            {education.map((item, index) => (
              <Box
                key={item.degree}
                sx={{
                  mt: 4,
                  ...(index > 0 && { pt: 4, borderTop: '1px solid', borderColor: 'divider' }),
                }}
              >
                <Typography
                  variant='h4'
                  component='h3'
                  sx={{
                    fontSize: { xs: '24px', md: '28px' },
                    fontWeight: 600,
                    color: 'text.primary',
                  }}
                >
                  {item.degree}
                </Typography>
                <Typography
                  sx={{
                    mt: 0.5,
                    fontSize: '17px',
                    fontWeight: 400,
                    color: 'primary.text',
                  }}
                >
                  {item.school}
                </Typography>
                <Typography
                  sx={{
                    mt: 0.25,
                    fontSize: '14px',
                    color: 'text.secondary',
                  }}
                >
                  {item.period}
                </Typography>
              </Box>
            ))}
          </ScrollReveal>
        </Container>
      </Box>

      {/* ===== CERTIFICATIONS SECTION ===== */}
      <Box
        data-testid='certifications-section'
        component='section'
        sx={{
          bgcolor: 'background.default',
          py: { xs: '80px', md: '120px' },
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: 680 }}>
          <ScrollReveal>
            <Typography
              variant='h2'
              sx={{
                fontSize: { xs: '40px', md: '56px' },
                fontWeight: 700,
                letterSpacing: '-0.015em',
                lineHeight: 1.07,
                color: 'text.primary',
              }}
            >
              Certifications
            </Typography>
          </ScrollReveal>
          <ScrollReveal>
            <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {certifications.map((cert) => (
                <Box key={cert.name}>
                  <Typography
                    sx={{
                      fontSize: '17px',
                      fontWeight: 500,
                      color: 'text.primary',
                    }}
                  >
                    {cert.name}
                  </Typography>
                  <Typography
                    sx={{
                      mt: 0.25,
                      fontSize: '14px',
                      color: 'text.secondary',
                    }}
                  >
                    {cert.issuer} &middot; {cert.date}
                  </Typography>
                </Box>
              ))}
            </Box>
          </ScrollReveal>
        </Container>
      </Box>
    </Box>
  )
}
