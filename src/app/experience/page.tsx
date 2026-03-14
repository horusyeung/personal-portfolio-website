'use client'

import { useRef } from 'react'
import { Box, Container, Typography } from '@mui/material'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { splitTextIntoChars, prefersReducedMotion } from '@/lib/animations'
import ScrollReveal from '@/components/ScrollReveal'

gsap.registerPlugin(ScrollTrigger)

// ── Data ────────────────────────────────────────────────────────────────────

const experiences = [
  {
    title: 'Frontend Developer Team Lead',
    company: 'Juno Markets',
    location: 'Vancouver, BC',
    period: 'Jan 2025 — Present',
    bullets: [
      'Led a 5–7 person frontend team across 4 countries (Canada, Hong Kong, India, Malaysia), managing cross-timezone sprints, code reviews, and mentoring',
      'Maintained and scaled trading platform ecosystem serving 50K+ users across 15 global markets',
      'Delivered 10 web platforms and 2 mobile apps including trading portals, admin systems, partner management, and CMS',
      'Managed AWS infrastructure (Amplify, ECS, EC2, RDS, S3, Secrets Manager) and established CI/CD deployment pipelines',
      'Introduced AI-augmented workflows (CodeRabbit, Claude Code, Cursor), achieving 80% automated code review coverage and reducing developer costs by 50%',
    ],
  },
  {
    title: 'Frontend Developer Team Lead',
    company: 'Juno Markets',
    location: 'Hong Kong',
    period: 'Jan 2024 — Dec 2024',
    bullets: [
      'Delivered complete platform revamp to production in 6 months, spanning 10 web platforms and 2 mobile apps from architecture to deployment',
      'Promoted from Senior Full Stack Developer to Team Lead within 6 months based on technical ownership and delivery',
      'Cut Phase integration to i18n, reducing page load time by 80% across all client-facing platforms',
      'Consolidated similar admin portals into a monorepo architecture, reducing management overhead and streamlining deployments',
      'Established coding standards for Next.js, React Native, and TypeScript across all frontend teams',
      'Owned sprint planning and delivery for cross-functional team of 12+ with Scrum ceremonies and CI/CD pipelines',
    ],
  },
  {
    title: 'Senior Full Stack Developer',
    company: 'Juno Markets',
    location: 'Hong Kong',
    period: 'Jul 2023 — Dec 2023',
    bullets: [
      'Joined to lead the complete revamp of the Juno Markets trading platform, architecting web app, admin portal, and microservices from the ground up',
      'Built full-stack using React.js, Next.js, Node.js, Nest.js, and PostgreSQL with microservices architecture, REST APIs, RabbitMQ, and API Gateway',
      'Led technical hiring for the frontend team during the platform rebuild phase',
    ],
  },
  {
    title: 'Full Stack Developer & QA Lead',
    company: 'Beta Labs (Lane Crawford Joyce Group)',
    location: 'Hong Kong',
    period: 'Jan 2022 — Jun 2023',
    bullets: [
      "Built e-commerce platforms for Lane Crawford (Hong Kong's largest luxury retailer) using React.js, Next.js, React Native, Nest.js, PostgreSQL, MongoDB, and GraphQL",
      'Promoted from QA Lead to Full Stack Developer based on demonstrated full-stack capability',
      'Automated 80% of test coverage using Playwright, integrating directly into CI/CD pipelines (GitHub Actions, Jenkins, Tekton) on Azure',
      'Led QA team hiring and test strategy across 5+ concurrent projects',
    ],
  },
  {
    title: 'Software Development Engineer in Test',
    company: 'The Hong Kong Jockey Club',
    location: 'Hong Kong',
    period: 'Mar 2021 — Dec 2021',
    bullets: [
      'Built automated test suites (Tosca, Selenium) for enterprise-scale trading and betting systems',
      'Integrated automation into CI/CD pipelines, improving release quality across cross-team deliveries',
    ],
  },
  {
    title: 'Software Development Engineer in Test',
    company: 'Pure Group',
    location: 'Hong Kong',
    period: 'Jun 2020 — Mar 2021',
    bullets: [
      'Built automated regression tests using Python and Selenium for internal membership and rewards systems',
      'Collaborated with developers and project managers to design test plans ensuring coverage across platforms',
    ],
  },
]

const certifications = [
  { name: 'Meta React Native Specialization', issuer: 'Meta', date: 'June 2023' },
  { name: 'Automated Software Testing with Playwright', issuer: 'Udemy', date: 'June 2023' },
  { name: 'Agile with Atlassian Jira', issuer: 'Atlassian', date: 'August 2022' },
]

const SUBTITLE_TEXT =
  'From quality assurance to software architecture — a trajectory of continuous growth and technical leadership.'

// ── Component ───────────────────────────────────────────────────────────────

export default function ExperiencePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      // ── #11: Page title — split-text scale 1.5→1.0 with fade ──
      const titleEl = titleRef.current
      if (titleEl) {
        const chars = splitTextIntoChars(titleEl)
        gsap.from(chars, {
          scale: 1.5,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.03,
        })
      }

      // ── #12: Subtitle — typewriter with blinking cursor ──
      const subtitleEl = subtitleRef.current
      if (subtitleEl) {
        // Clear and set up typewriter
        subtitleEl.innerHTML = ''
        const textSpan = document.createElement('span')
        const cursorSpan = document.createElement('span')
        cursorSpan.textContent = '|'
        cursorSpan.style.display = 'inline'
        cursorSpan.style.fontWeight = '300'
        cursorSpan.style.marginLeft = '2px'
        subtitleEl.appendChild(textSpan)
        subtitleEl.appendChild(cursorSpan)

        // Blink cursor during typing
        const blinkTl = gsap.timeline({ repeat: -1 })
        blinkTl.to(cursorSpan, { opacity: 0, duration: 0.4 })
        blinkTl.to(cursorSpan, { opacity: 1, duration: 0.4 })

        // Typewriter effect — after title animation completes
        const titleDuration = 0.6 + 0.03 * ('Experience'.length - 1)
        const chars = SUBTITLE_TEXT.split('')
        const obj = { index: 0 }
        gsap.to(obj, {
          index: chars.length,
          duration: 1.5,
          ease: 'none',
          delay: titleDuration + 0.2,
          onUpdate: () => {
            textSpan.textContent = SUBTITLE_TEXT.slice(0, Math.round(obj.index))
          },
          onComplete: () => {
            // Blink cursor 2 more times then hide
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
                cursorSpan.style.display = 'none'
              },
            })
          },
        })

        // Start subtitle invisible
        gsap.set(subtitleEl, { opacity: 1 })
      }
    },
    { scope: containerRef },
  )

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
            sx={{
              mt: 2,
              mx: 'auto',
              maxWidth: 560,
              fontSize: '21px',
              fontWeight: 400,
              lineHeight: 1.47,
              color: 'text.secondary',
              opacity: 0,
            }}
          >
            {SUBTITLE_TEXT}
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

                {/* Title */}
                <Typography
                  variant='h4'
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
                    color: 'primary.main',
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
                        }}
                      >
                        &middot; {bullet}
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

          <ScrollReveal>
            <Box sx={{ mt: 4 }}>
              <Typography
                variant='h4'
                sx={{
                  fontSize: { xs: '24px', md: '28px' },
                  fontWeight: 600,
                  color: 'text.primary',
                }}
              >
                BBA (Hons) Business Analysis
              </Typography>
              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: '17px',
                  fontWeight: 400,
                  color: 'primary.main',
                }}
              >
                City University of Hong Kong
              </Typography>
              <Typography
                sx={{
                  mt: 0.25,
                  fontSize: '14px',
                  color: 'text.secondary',
                }}
              >
                2018 — 2020
              </Typography>
            </Box>

            <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography
                variant='h4'
                sx={{
                  fontSize: { xs: '24px', md: '28px' },
                  fontWeight: 600,
                  color: 'text.primary',
                }}
              >
                Associate in Business, Hospitality Management (Distinction)
              </Typography>
              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: '17px',
                  fontWeight: 400,
                  color: 'primary.main',
                }}
              >
                PolyU Hong Kong Community College
              </Typography>
              <Typography
                sx={{
                  mt: 0.25,
                  fontSize: '14px',
                  color: 'text.secondary',
                }}
              >
                2016 — 2018
              </Typography>
            </Box>
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
