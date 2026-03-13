'use client'

import { FormEvent, useState } from 'react'
import { Box, Container, Typography, TextField, Button, Stack, Alert } from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import LanguageIcon from '@mui/icons-material/Language'
import { SiGithub, SiMedium } from 'react-icons/si'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import ScrollReveal from '@/components/ScrollReveal'

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

// ── Component ───────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')

    const formData = new FormData(e.currentTarget)
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
      e.currentTarget.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <Box>
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
          <ScrollReveal>
            <Typography
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
            <Typography
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
          </ScrollReveal>
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
        <Container maxWidth={false} sx={{ maxWidth: 980 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
              gap: 6,
            }}
          >
            {/* ===== LEFT: Contact Information ===== */}
            <ScrollReveal>
              <Stack data-testid='contact-info' spacing='32px'>
                {contactItems.map((item) => (
                  <Box key={item.label}>
                    {/* Icon */}
                    <Box
                      sx={{
                        color: 'text.secondary',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '20px',
                      }}
                    >
                      {item.icon}
                    </Box>

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
            </ScrollReveal>

            {/* ===== RIGHT: Contact Form ===== */}
            <ScrollReveal delay={0.15}>
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

                <Box data-testid='contact-form' component='form' onSubmit={handleSubmit} noValidate>
                  <Stack spacing={3}>
                    <TextField
                      name='name'
                      label='Name'
                      required
                      fullWidth
                      variant='outlined'
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: 'primary.main',
                        },
                      }}
                    />

                    <TextField
                      name='email'
                      label='Email'
                      type='email'
                      required
                      fullWidth
                      variant='outlined'
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: 'primary.main',
                        },
                      }}
                    />

                    <TextField
                      name='message'
                      label='Message'
                      required
                      fullWidth
                      multiline
                      minRows={4}
                      maxRows={8}
                      variant='outlined'
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: 'primary.main',
                        },
                      }}
                    />

                    <Button
                      data-testid='submit-button'
                      type='submit'
                      variant='contained'
                      fullWidth
                      disableElevation
                      disabled={status === 'sending'}
                      sx={{
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
            </ScrollReveal>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
