'use client'

import { FormEvent, useState, useRef, useCallback, useEffect, useSyncExternalStore } from 'react'
import { Box, Container, Typography, TextField, Button, Stack } from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import LanguageIcon from '@mui/icons-material/Language'
import { SiGithub } from 'react-icons/si'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import { gsap } from '@/lib/gsap'
import { useEntranceAnimation } from '@/lib/motion'
import {
  CONTACT_FIELDS,
  CONTACT_LIMITS,
  HONEYPOT_FIELD,
  normalizeContact,
  validateContact,
  type ContactErrors,
  type ContactField,
} from '@/lib/contact'
import MagneticElement from '@/components/MagneticElement'
import MediumIcon from '@/components/MediumIcon'
import { EMAIL, LOCATION, SITE_DOMAIN, SITE_URL, SOCIAL_LINKS } from '@/content/site'
import { brandColors } from '@/content/brands'
import ContactFeedback, { type ContactStatus } from './ContactFeedback'
import styles from './ContactEffects.module.css'

// ── Data ────────────────────────────────────────────────────────────────────

const withoutScheme = (url: string) => url.replace(/^https:\/\//, '')

const contactItems = [
  {
    label: 'Email',
    value: EMAIL,
    href: `mailto:${EMAIL}`,
    icon: <EmailIcon sx={{ fontSize: 20 }} />,
    color: 'text.secondary',
    external: false,
  },
  {
    label: 'LinkedIn',
    value: withoutScheme(SOCIAL_LINKS.linkedin.url),
    href: SOCIAL_LINKS.linkedin.url,
    icon: <LinkedInIcon sx={{ fontSize: 20 }} />,
    color: brandColors.linkedin,
    external: true,
  },
  {
    label: 'GitHub',
    value: withoutScheme(SOCIAL_LINKS.github.url),
    href: SOCIAL_LINKS.github.url,
    icon: <SiGithub size={18} aria-hidden />,
    color: brandColors.monochrome,
    external: true,
  },
  {
    label: 'Medium',
    value: withoutScheme(SOCIAL_LINKS.medium.url),
    href: SOCIAL_LINKS.medium.url,
    icon: <MediumIcon width={18} height={18} />,
    color: brandColors.monochrome,
    external: true,
  },
  {
    label: 'Location',
    value: `${LOCATION}, Canada`,
    href: null,
    icon: <LocationOnIcon sx={{ fontSize: 20 }} />,
    color: 'text.secondary',
    external: false,
  },
  {
    label: 'Website',
    value: SITE_DOMAIN,
    href: SITE_URL,
    icon: <LanguageIcon sx={{ fontSize: 20 }} />,
    color: 'text.secondary',
    external: true,
  },
]

// ── Confetti colors ─────────────────────────────────────────────────────────

const CONFETTI_COLORS = ['#0071e3', '#34C759', '#FF9500', '#AF52DE', '#FF3B30']

type ParticleEffect = {
  animation: gsap.core.Animation
  nodes: HTMLElement[]
}

// ── Confetti helper (#34) ───────────────────────────────────────────────────

function spawnConfetti(container: HTMLElement): ParticleEffect {
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

  const tl = gsap.timeline()

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

  return { animation: tl, nodes: pieces }
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
    color: 'primary.text',
  },
}

// ── Component ───────────────────────────────────────────────────────────────

const subscribeHydration = () => () => {}

export default function ContactPage() {
  // Native submission must stay unavailable until React can prevent the default GET.
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    () => true,
    () => false,
  )
  const [status, setStatus] = useState<ContactStatus>('idle')
  const [fieldErrors, setFieldErrors] = useState<ContactErrors>({})
  // Synchronous guard: state updates are async, so a fast double-click could submit twice
  const inFlight = useRef(false)

  const clearFieldError = (field: ContactField) => {
    if (fieldErrors[field]) setFieldErrors(({ [field]: _cleared, ...rest }) => rest)
  }

  const pageRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const contactItemsRef = useRef<(HTMLDivElement | null)[]>([])
  const iconRefs = useRef<(HTMLDivElement | null)[]>([])
  const formRevealsRef = useRef<(HTMLElement | null)[]>([])

  const btnContainerRef = useRef<HTMLDivElement>(null)
  const particleMedia = useRef<MediaQueryList | null>(null)
  const particleEffects = useRef(new Map<gsap.core.Animation, HTMLElement[]>())

  // One-off interactions share a live motion owner, including their dynamically added nodes.
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: no-preference)')
    const effects = particleEffects.current
    particleMedia.current = media
    const clear = () => {
      effects.forEach((nodes, animation) => {
        animation.kill()
        nodes.forEach((node) => node.remove())
      })
      effects.clear()
    }
    const update = () => {
      if (!media.matches) clear()
    }
    media.addEventListener('change', update)
    return () => {
      particleMedia.current = null
      media.removeEventListener('change', update)
      clear()
    }
  }, [])

  const trackParticles = useCallback(({ animation, nodes }: ParticleEffect) => {
    const effects = particleEffects.current
    effects.set(animation, nodes)
    animation.eventCallback('onComplete', () => {
      nodes.forEach((node) => node.remove())
      effects.delete(animation)
    })
  }, [])

  // ── GSAP animations ────────────────────────────────────────────────────

  useEntranceAnimation(() => {
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

    const reveals = new Map<HTMLElement, gsap.core.Animation>()

    // #30 — Each row waits for its own scroll entry. Icon spin has a separate transform owner.
    contactItemsRef.current.forEach((item, index) => {
      if (!item) return
      // Keep linked rows under the pointer when focus completes an unfinished entrance.
      const distance = contactItems[index].href ? 0 : -30
      const row = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          once: true,
        },
      })
      row.fromTo(
        item,
        { x: distance, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        0,
      )
      const icon = iconRefs.current[index]
      if (icon) {
        row.fromTo(icon, { rotation: 0 }, { rotation: 360, duration: 0.6, ease: 'power2.out' }, 0)
      }
      // Initialize before later triggers can recursively refresh and remove pending rows.
      row.scrollTrigger?.refresh()
      reveals.set(item, row)
    })

    // #32 — Heading, fields and submit wrapper share the section fade contract independently.
    formRevealsRef.current.forEach((element) => {
      if (!element) return
      // Pointer focus finishes the reveal before pointer-up; keep the submit target in place.
      const distance = element === btnContainerRef.current ? 0 : 30
      const reveal = gsap.fromTo(
        element,
        { opacity: 0, y: distance },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: element, start: 'top 85%', once: true },
        },
      )
      reveals.set(element, reveal)
    })

    // Keyboard navigation may reach a target before its scroll entrance has finished.
    const showFocused = () => {
      const target = document.activeElement
      if (!target) return
      reveals.forEach((animation, element) => {
        if (!element.contains(target)) return
        animation.scrollTrigger?.kill(false, true)
        animation.progress(1).pause()
      })
    }
    const page = pageRef.current
    page?.addEventListener('focusin', showFocused)
    showFocused()
    return () => page?.removeEventListener('focusin', showFocused)
  }, pageRef)

  // ── #34 — Ripple effect on button click ───────────────────────────────

  const handleRipple = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!particleMedia.current?.matches) return
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

      const animation = gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        { scale: 2, opacity: 0, duration: 0.6, ease: 'power2.out' },
      )
      trackParticles({ animation, nodes: [ripple] })
    },
    [trackParticles],
  )

  // ── Form submit handler ───────────────────────────────────────────────

  const showFieldErrors = (form: HTMLFormElement, errors: ContactErrors) => {
    setFieldErrors(errors)
    const firstInvalid = CONTACT_FIELDS.find((field) => errors[field])
    if (!firstInvalid) return false
    form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
    return true
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (inFlight.current) return

    const form = e.currentTarget
    const formData = new FormData(form)
    const field = (key: string) => String(formData.get(key) ?? '')
    const input = normalizeContact({
      name: field('name'),
      email: field('email'),
      message: field('message'),
    })

    if (showFieldErrors(form, validateContact(input))) {
      setStatus('idle')
      return
    }

    inFlight.current = true
    setStatus('sending')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...input, [HONEYPOT_FIELD]: field(HONEYPOT_FIELD) }),
      })

      if (res.status === 400) {
        const body: { fields?: ContactErrors } | null = await res.json().catch(() => null)
        if (body?.fields && showFieldErrors(form, body.fields)) {
          setStatus('idle')
          return
        }
      }

      if (!res.ok) throw new Error()
      setStatus('success')
      form.reset()

      // #34 — Success confetti
      if (btnContainerRef.current && particleMedia.current?.matches) {
        trackParticles(spawnConfetti(btnContainerRef.current))
      }
    } catch {
      setStatus('error')
    } finally {
      inFlight.current = false
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
            Get in Touch
          </Typography>

          {/* #29 — Subtitle: fade-in with letter-spacing */}
          <Typography
            ref={subtitleRef}
            data-intro
            sx={{
              mt: 2,
              mx: 'auto',
              maxWidth: 560,
              fontSize: '21px',
              fontWeight: 400,
              lineHeight: 1.47,
              color: 'text.secondary',
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
                  data-intro
                >
                  {/* #31 — Icon wrapped in MagneticElement for items with href */}
                  {item.href ? (
                    <MagneticElement>
                      <Box
                        ref={(el: HTMLDivElement | null) => {
                          iconRefs.current[idx] = el
                        }}
                        sx={{
                          color: item.color,
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
                        color: item.color,
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
                        color: 'primary.link',
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
                ref={(el: HTMLElement | null) => {
                  formRevealsRef.current[0] = el
                }}
                data-intro
                variant='h4'
                component='h2'
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
                onSubmit={handleSubmit}
                noValidate
                aria-busy={status === 'sending'}
              >
                {/* Honeypot: hidden from people and assistive tech; bots that fill it are ignored */}
                <Box
                  component='input'
                  type='text'
                  name={HONEYPOT_FIELD}
                  tabIndex={-1}
                  autoComplete='off'
                  aria-hidden='true'
                  defaultValue=''
                  sx={{
                    position: 'absolute',
                    left: '-10000px',
                    width: '1px',
                    height: '1px',
                    overflow: 'hidden',
                    opacity: 0,
                  }}
                />
                <Stack spacing={3}>
                  {/* #32 — Form field: Name */}
                  <Box
                    ref={(el: HTMLDivElement | null) => {
                      formRevealsRef.current[1] = el
                    }}
                    data-intro
                  >
                    <TextField
                      name='name'
                      label='Name'
                      required
                      fullWidth
                      variant='outlined'
                      autoComplete='name'
                      error={Boolean(fieldErrors.name)}
                      helperText={fieldErrors.name}
                      onChange={() => clearFieldError('name')}
                      slotProps={{ htmlInput: { maxLength: CONTACT_LIMITS.name } }}
                      sx={focusGlowSx}
                    />
                  </Box>

                  {/* #32 — Form field: Email */}
                  <Box
                    ref={(el: HTMLDivElement | null) => {
                      formRevealsRef.current[2] = el
                    }}
                    data-intro
                  >
                    <TextField
                      name='email'
                      label='Email'
                      type='email'
                      required
                      fullWidth
                      variant='outlined'
                      autoComplete='email'
                      error={Boolean(fieldErrors.email)}
                      helperText={fieldErrors.email}
                      onChange={() => clearFieldError('email')}
                      slotProps={{ htmlInput: { maxLength: CONTACT_LIMITS.email } }}
                      sx={focusGlowSx}
                    />
                  </Box>

                  {/* #32 — Form field: Message */}
                  <Box
                    className={styles.messageGlow}
                    data-testid='message-glow'
                    data-sending={status === 'sending'}
                    ref={(el: HTMLDivElement | null) => {
                      formRevealsRef.current[3] = el
                    }}
                    data-intro
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
                      error={Boolean(fieldErrors.message)}
                      helperText={fieldErrors.message}
                      onChange={() => clearFieldError('message')}
                      slotProps={{ htmlInput: { maxLength: CONTACT_LIMITS.message } }}
                      sx={{
                        '& .MuiInputLabel-root.Mui-focused': { color: 'primary.text' },
                      }}
                    />
                  </Box>

                  {/* #34 — Submit button with ripple + confetti */}
                  <Box
                    ref={(el: HTMLDivElement | null) => {
                      btnContainerRef.current = el
                      formRevealsRef.current[4] = el
                    }}
                    data-intro
                    sx={{ position: 'relative' }}
                  >
                    <Button
                      data-testid='submit-button'
                      type='submit'
                      variant='contained'
                      fullWidth
                      disableElevation
                      disabled={!hydrated}
                      // After hydration, aria-disabled preserves keyboard focus while sending.
                      aria-disabled={status === 'sending' || undefined}
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
                        transition: 'background-color 0.2s ease',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                        },
                        '@media (prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)':
                          {
                            transition: 'background-color 0.2s ease, transform 0.2s ease',
                            '&:hover': { transform: 'scale(1.02)' },
                          },
                        '&:focus-visible': {
                          outline: '2px solid',
                          outlineColor: 'primary.main',
                          outlineOffset: 2,
                        },
                        // Same look as MUI's disabled contained button
                        '&[aria-disabled="true"]': {
                          bgcolor: 'action.disabledBackground',
                          color: 'action.disabled',
                          pointerEvents: 'none',
                        },
                      }}
                    >
                      {status === 'sending' ? 'Sending…' : 'Send Message'}
                    </Button>
                  </Box>
                </Stack>
                <noscript>
                  <Typography component='p' variant='body2' sx={{ mt: 2, color: 'text.secondary' }}>
                    JavaScript is required to send this form. Use the email link alongside it
                    instead.
                  </Typography>
                </noscript>
              </Box>
              <ContactFeedback status={status} />
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
