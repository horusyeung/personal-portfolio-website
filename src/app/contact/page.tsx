'use client'

import { FormEvent, useState, useRef, useCallback } from 'react'
import { Box, Container, Typography, TextField, Button, Stack, Alert } from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import LanguageIcon from '@mui/icons-material/Language'
import { SiGithub, SiMedium } from 'react-icons/si'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { prefersReducedMotion } from '@/lib/animations'
import MagneticElement from '@/components/MagneticElement'

gsap.registerPlugin(ScrollTrigger)

// ── Data ────────────────────────────────────────────────────────────────────

const contactItems = [
  {
    label: 'Email',
    value: 'horusyeungg@gmail.com',
    href: 'mailto:horusyeungg@gmail.com',
    icon: <EmailIcon sx={{ fontSize: 20 }} />,
    external: false,
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/horusyeung',
    href: 'https://linkedin.com/in/horusyeung',
    icon: <LinkedInIcon sx={{ fontSize: 20 }} />,
    external: true,
  },
  {
    label: 'GitHub',
    value: 'github.com/horusyeung',
    href: 'https://github.com/horusyeung',
    icon: <SiGithub size={18} />,
    external: true,
  },
  {
    label: 'Medium',
    value: 'medium.com/@horusyeung',
    href: 'https://medium.com/@horusyeung',
    icon: <SiMedium size={18} />,
    external: true,
  },
  {
    label: 'Location',
    value: 'Vancouver, BC, Canada',
    href: null,
    icon: <LocationOnIcon sx={{ fontSize: 20 }} />,
    external: false,
  },
  {
    label: 'Website',
    value: 'horusyeung.com',
    href: 'https://horusyeung.com',
    icon: <LanguageIcon sx={{ fontSize: 20 }} />,
    external: true,
  },
]

// ── Confetti colors ─────────────────────────────────────────────────────────

const CONFETTI_COLORS = ['#0071e3', '#34C759', '#FF9500', '#AF52DE', '#FF3B30']

// ── Confetti helper (#34) ───────────────────────────────────────────────────

function spawnConfetti(container: HTMLElement) {
  const pieces: HTMLDivElement[] = []

  for (let i = 0; i < 10; i++) {
    const div = document.createElement('div')
    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]
    Object.assign(div.style, {
      position: 'absolute',
      width: '5px',
      height: '5px',
      borderRadius: '50%',
      backgroundColor: color,
      top: '50%',
      left: '50%',
      pointerEvents: 'none',
      zIndex: '10',
    })
    container.appendChild(div)
    pieces.push(div)
  }

  const tl = gsap.timeline({
    onComplete: () => {
      pieces.forEach((p) => p.remove())
    },
  })

  pieces.forEach((piece) => {
    const randX = (Math.random() - 0.5) * 160 // -80 to 80
    const randY = (Math.random() - 0.5) * 160
    const randRotation = Math.random() * 360

    tl.to(
      piece,
      {
        x: randX,
        y: randY,
        rotation: randRotation,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
      },
      0,
    )
  })
}

// ── Focus glow sx shared across form fields (#33) ───────────────────────────

const focusGlowSx = {
  '& .MuiOutlinedInput-root': {
    transition: 'box-shadow 0.3s ease',
    '&.Mui-focused': {
      boxShadow: '0 0 0 4px rgba(0, 113, 227, 0.35)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'primary.main',
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: 'primary.main',
  },
}

// ── Component ───────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const pageRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const contactItemsRef = useRef<(HTMLDivElement | null)[]>([])
  const iconRefs = useRef<(HTMLDivElement | null)[]>([])
  const formFieldsRef = useRef<(HTMLDivElement | null)[]>([])

  const submitBtnRef = useRef<HTMLButtonElement>(null)
  const btnContainerRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  // ── GSAP animations ────────────────────────────────────────────────────

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      // #28 — Page title: bounce-in from above
      gsap.fromTo(
        titleRef.current,
        { y: -40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'bounce.out' },
      )

      // #29 — Subtitle: fade-in with letter-spacing expand after title
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, letterSpacing: '-1px' },
        { opacity: 1, letterSpacing: '0px', duration: 0.8, ease: 'power2.out', delay: 1 },
      )

      // #30 — Contact items: slide-right with icon 360° spin (ScrollTrigger)
      const validItems = contactItemsRef.current.filter(Boolean) as HTMLDivElement[]
      const validIcons = iconRefs.current.filter(Boolean) as HTMLDivElement[]

      if (validItems.length > 0) {
        gsap.fromTo(
          validItems,
          { x: -30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.1,
            scrollTrigger: {
              trigger: validItems[0],
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          },
        )

        gsap.fromTo(
          validIcons,
          { rotation: 0 },
          {
            rotation: 360,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.1,
            scrollTrigger: {
              trigger: validItems[0],
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          },
        )
      }

      // #32 — Form fields: sequential reveal (ScrollTrigger)
      const validFields = formFieldsRef.current.filter(Boolean) as HTMLDivElement[]

      if (validFields.length > 0) {
        const fieldTl = gsap.timeline({
          scrollTrigger: {
            trigger: validFields[0],
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        })

        validFields.forEach((field, i) => {
          fieldTl.fromTo(
            field,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
            i * 0.15,
          )
        })
      }
    },
    { scope: pageRef },
  )

  // ── #34 — Ripple effect on button click ───────────────────────────────

  const handleRipple = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (prefersReducedMotion()) return
    const btn = e.currentTarget
    const rect = btn.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ripple = document.createElement('div')
    Object.assign(ripple.style, {
      position: 'absolute',
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      top: `${y - 10}px`,
      left: `${x - 10}px`,
      pointerEvents: 'none',
      zIndex: '5',
    })
    btn.style.position = 'relative'
    btn.style.overflow = 'hidden'
    btn.appendChild(ripple)

    gsap.fromTo(
      ripple,
      { scale: 0, opacity: 1 },
      {
        scale: 2,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => ripple.remove(),
      },
    )
  }, [])

  // ── Form submit handler ───────────────────────────────────────────────

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')

    const form = e.currentTarget
    const formData = new FormData(form)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const message = formData.get('message') as string

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })

      if (!res.ok) throw new Error()
      setStatus('success')
      form.reset()

      // #34 — Success confetti
      if (btnContainerRef.current && !prefersReducedMotion()) {
        spawnConfetti(btnContainerRef.current)
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <Box ref={pageRef}>
      {/* ===== HERO SECTION ===== */}
      <Box
        data-testid='contact-hero'
        component='section'
        sx={{
          bgcolor: 'background.default',
          pt: { xs: '80px', md: '120px' },
          pb: { xs: '40px', md: '60px' },
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: 680, textAlign: 'center' }}>
          {/* #28 — Title: bounce-in */}
          <Typography
            ref={titleRef}
            variant='h1'
            sx={{
              fontSize: { xs: '48px', md: '80px' },
              fontWeight: 700,
              letterSpacing: '-0.015em',
              lineHeight: 1.05,
              color: 'text.primary',
              opacity: 0,
            }}
          >
            Get in Touch
          </Typography>

          {/* #29 — Subtitle: fade-in with letter-spacing */}
          <Typography
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
            Have a project idea, want to discuss architecture, or just want to say hello? I&apos;d
            love to hear from you.
          </Typography>
        </Container>
      </Box>

      {/* ===== CONTACT CONTENT ===== */}
      <Box
        component='section'
        sx={{
          bgcolor: 'background.default',
          pb: { xs: '80px', md: '120px' },
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: 980, px: { xs: 2, sm: 3 } }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
              gap: 6,
            }}
          >
            {/* ===== LEFT: Contact Information ===== */}
            <Stack data-testid='contact-info' spacing='32px'>
              {contactItems.map((item, idx) => (
                <Box
                  key={item.label}
                  ref={(el: HTMLDivElement | null) => {
                    contactItemsRef.current[idx] = el
                  }}
                  sx={{ opacity: 0 }}
                >
                  {/* #31 — Icon wrapped in MagneticElement for items with href */}
                  {item.href ? (
                    <MagneticElement>
                      <Box
                        ref={(el: HTMLDivElement | null) => {
                          iconRefs.current[idx] = el
                        }}
                        sx={{
                          color: 'text.secondary',
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '20px',
                        }}
                      >
                        {item.icon}
                      </Box>
                    </MagneticElement>
                  ) : (
                    <Box
                      ref={(el: HTMLDivElement | null) => {
                        iconRefs.current[idx] = el
                      }}
                      sx={{
                        color: 'text.secondary',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '20px',
                      }}
                    >
                      {item.icon}
                    </Box>
                  )}

                  {/* Label */}
                  <Typography
                    sx={{
                      mt: 1,
                      fontSize: '12px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: 'text.secondary',
                    }}
                  >
                    {item.label}
                  </Typography>

                  {/* Value */}
                  {item.href ? (
                    <Box
                      component='a'
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                      sx={{
                        display: 'inline-block',
                        fontSize: '17px',
                        fontWeight: 400,
                        color: 'primary.main',
                        textDecoration: 'none',
                        borderRadius: '4px',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                        '&:focus-visible': {
                          outline: '2px solid',
                          outlineColor: 'primary.main',
                          outlineOffset: 2,
                        },
                      }}
                    >
                      {item.value}
                    </Box>
                  ) : (
                    <Typography
                      sx={{
                        fontSize: '17px',
                        fontWeight: 400,
                        color: 'text.primary',
                      }}
                    >
                      {item.value}
                    </Typography>
                  )}
                </Box>
              ))}
            </Stack>

            {/* ===== RIGHT: Contact Form ===== */}
            <Box
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '16px',
                p: { xs: 3, md: 5 },
                bgcolor: 'background.paper',
              }}
            >
              <Typography
                variant='h4'
                sx={{
                  fontSize: { xs: '24px', md: '28px' },
                  fontWeight: 600,
                  color: 'text.primary',
                  mb: 3,
                }}
              >
                Send a Message
              </Typography>

              <Box
                data-testid='contact-form'
                component='form'
                ref={formRef}
                onSubmit={handleSubmit}
                noValidate
              >
                <Stack spacing={3}>
                  {/* #32 — Form field: Name */}
                  <Box
                    ref={(el: HTMLDivElement | null) => {
                      formFieldsRef.current[0] = el
                    }}
                    sx={{ opacity: 0 }}
                  >
                    <TextField
                      name='name'
                      label='Name'
                      required
                      fullWidth
                      variant='outlined'
                      sx={focusGlowSx}
                    />
                  </Box>

                  {/* #32 — Form field: Email */}
                  <Box
                    ref={(el: HTMLDivElement | null) => {
                      formFieldsRef.current[1] = el
                    }}
                    sx={{ opacity: 0 }}
                  >
                    <TextField
                      name='email'
                      label='Email'
                      type='email'
                      required
                      fullWidth
                      variant='outlined'
                      sx={focusGlowSx}
                    />
                  </Box>

                  {/* #32 — Form field: Message */}
                  <Box
                    ref={(el: HTMLDivElement | null) => {
                      formFieldsRef.current[2] = el
                    }}
                    sx={{ opacity: 0 }}
                  >
                    <TextField
                      name='message'
                      label='Message'
                      required
                      fullWidth
                      multiline
                      minRows={4}
                      maxRows={8}
                      variant='outlined'
                      sx={focusGlowSx}
                    />
                  </Box>

                  {/* #34 — Submit button with ripple + confetti */}
                  <Box ref={btnContainerRef} sx={{ position: 'relative' }}>
                    <Button
                      ref={submitBtnRef}
                      data-testid='submit-button'
                      type='submit'
                      variant='contained'
                      fullWidth
                      disableElevation
                      disabled={status === 'sending'}
                      onClick={handleRipple}
                      sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        py: 1.5,
                        borderRadius: '980px',
                        fontWeight: 600,
                        fontSize: '17px',
                        textTransform: 'none',
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        transition: 'background-color 0.2s ease, transform 0.2s ease',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                          transform: 'scale(1.02)',
                        },
                        '&:focus-visible': {
                          outline: '2px solid',
                          outlineColor: 'primary.main',
                          outlineOffset: 2,
                        },
                      }}
                    >
                      {status === 'sending' ? 'Sending...' : 'Send Message'}
                    </Button>
                  </Box>

                  {status === 'success' && (
                    <Alert severity='success' sx={{ borderRadius: '12px' }}>
                      Message sent successfully! I&apos;ll get back to you soon.
                    </Alert>
                  )}
                  {status === 'error' && (
                    <Alert severity='error' sx={{ borderRadius: '12px' }}>
                      Failed to send message. Please try again or email me directly.
                    </Alert>
                  )}
                </Stack>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
