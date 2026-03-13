'use client';

import { FormEvent } from 'react';
import {
  Box,
  Container,
  Typography,
  Chip,
  Paper,
  TextField,
  Button,
  Stack,
  Link as MuiLink,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LanguageIcon from '@mui/icons-material/Language';

const contactItems = [
  {
    label: 'Email',
    value: 'horusyeungg@gmail.com',
    href: 'mailto:horusyeungg@gmail.com',
    icon: <EmailIcon />,
    external: false,
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/horusyeung',
    href: 'https://linkedin.com/in/horusyeung',
    icon: <LinkedInIcon />,
    external: true,
  },
  {
    label: 'GitHub',
    value: 'github.com/horusyeung',
    href: 'https://github.com/horusyeung',
    icon: <GitHubIcon />,
    external: true,
  },
  {
    label: 'Location',
    value: 'Vancouver, BC, Canada',
    href: null,
    icon: <LocationOnIcon />,
    external: false,
  },
  {
    label: 'Website',
    value: 'horusyeung.com',
    href: 'https://horusyeung.com',
    icon: <LanguageIcon />,
    external: true,
  },
];

const glassmorphicCard = (mode: 'light' | 'dark') =>
  mode === 'dark'
    ? {
        background: 'linear-gradient(180deg, rgba(30,41,59,0.5) 0%, rgba(15,23,42,0.7) 100%)',
        border: '1px solid rgba(51,65,85,0.3)',
        backdropFilter: 'blur(12px)',
      }
    : {
        background: 'linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(248,250,252,0.8) 100%)',
        border: '1px solid rgba(0,0,0,0.08)',
        backdropFilter: 'blur(12px)',
      };

const glassmorphicCardSmall = (mode: 'light' | 'dark') =>
  mode === 'dark'
    ? {
        background: 'linear-gradient(180deg, rgba(30,41,59,0.4) 0%, rgba(15,23,42,0.5) 100%)',
        border: '1px solid rgba(51,65,85,0.25)',
        backdropFilter: 'blur(8px)',
      }
    : {
        background: 'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(248,250,252,0.7) 100%)',
        border: '1px solid rgba(0,0,0,0.06)',
        backdropFilter: 'blur(8px)',
      };

export default function ContactPage() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <Box>
      {/* ===== HERO SECTION ===== */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          py: { xs: 10, md: 14 },
        }}
      >
        {/* Ambient orbs */}
        <Box
          sx={{
            position: 'absolute',
            width: 400,
            height: 400,
            borderRadius: '50%',
            filter: 'blur(100px)',
            pointerEvents: 'none',
            opacity: 0.25,
            left: '40%',
            top: '20%',
            bgcolor: 'rgba(168,220,171,0.3)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 300,
            height: 300,
            borderRadius: '50%',
            filter: 'blur(100px)',
            pointerEvents: 'none',
            opacity: 0.2,
            right: '10%',
            bottom: '10%',
            bgcolor: 'rgba(99,102,241,0.25)',
          }}
        />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Chip
            label="Get in Touch"
            sx={{
              mb: 3,
              px: 2,
              fontWeight: 600,
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              bgcolor: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(168,220,171,0.08)' : 'rgba(168,220,171,0.15)',
              color: '#A8DCAB',
              border: '1px solid rgba(168,220,171,0.25)',
            }}
          />

          <Typography
            variant="h2"
            sx={{
              mt: 2,
              fontWeight: 800,
              fontSize: { xs: '2.25rem', sm: '3rem' },
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #A8DCAB 0%, #6366F1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Contact
          </Typography>

          <Typography
            sx={{
              mt: 2,
              maxWidth: 560,
              mx: 'auto',
              color: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(148,163,184,0.8)' : 'text.secondary',
              fontSize: '1.05rem',
              lineHeight: 1.7,
            }}
          >
            Have a project idea, want to discuss architecture, or just want to say hello? I&apos;d
            love to hear from you.
          </Typography>
        </Container>
      </Box>

      {/* ===== CONTENT ===== */}
      <Box sx={{ pb: { xs: 8, md: 12 }, pt: { xs: 2, md: 4 } }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
              gap: { xs: 5, lg: 6 },
            }}
          >
            {/* ===== LEFT: Contact Information ===== */}
            <Box>
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  fontWeight: 700,
                  color: (theme) =>
                    theme.palette.mode === 'dark' ? '#F1F5F9' : 'text.primary',
                }}
              >
                Contact Information
              </Typography>

              <Typography
                sx={{
                  mb: 4,
                  lineHeight: 1.7,
                  color: (theme) =>
                    theme.palette.mode === 'dark' ? 'rgba(148,163,184,0.8)' : 'text.secondary',
                  fontSize: '0.95rem',
                }}
              >
                Based in Vancouver, BC. Currently leading frontend engineering at Juno Markets. Open
                to remote opportunities and collaboration.
              </Typography>

              <Stack spacing={2}>
                {contactItems.map((item) => {
                  const card = (
                    <Paper
                      elevation={0}
                      sx={(theme) => ({
                        ...glassmorphicCardSmall(theme.palette.mode),
                        borderRadius: '12px',
                        px: 2.5,
                        py: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        transition: 'all 0.3s ease',
                        cursor: item.href ? 'pointer' : 'default',
                        '&:hover': item.href
                          ? {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 24px -8px rgba(168,220,171,0.12)',
                              borderColor: 'rgba(168,220,171,0.3)',
                            }
                          : {},
                      })}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 40,
                          height: 40,
                          borderRadius: '10px',
                          flexShrink: 0,
                          bgcolor: (theme) =>
                            theme.palette.mode === 'dark'
                              ? 'rgba(168,220,171,0.1)'
                              : 'rgba(168,220,171,0.15)',
                          color: '#A8DCAB',
                          '& .MuiSvgIcon-root': {
                            fontSize: 20,
                          },
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.12em',
                            color: (theme) =>
                              theme.palette.mode === 'dark' ? '#CBD5E1' : 'text.secondary',
                          }}
                        >
                          {item.label}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: (theme) =>
                              theme.palette.mode === 'dark' ? '#F1F5F9' : 'text.primary',
                          }}
                        >
                          {item.value}
                        </Typography>
                      </Box>
                    </Paper>
                  );

                  if (item.href) {
                    return (
                      <MuiLink
                        key={item.label}
                        href={item.href}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noopener noreferrer' : undefined}
                        underline="none"
                        sx={{ display: 'block' }}
                      >
                        {card}
                      </MuiLink>
                    );
                  }

                  return <Box key={item.label}>{card}</Box>;
                })}
              </Stack>
            </Box>

            {/* ===== RIGHT: Contact Form ===== */}
            <Box>
              <Typography
                variant="h5"
                sx={{
                  mb: 3,
                  fontWeight: 700,
                  color: (theme) =>
                    theme.palette.mode === 'dark' ? '#F1F5F9' : 'text.primary',
                }}
              >
                Send a Message
              </Typography>

              <Paper
                elevation={0}
                sx={(theme) => ({
                  ...glassmorphicCard(theme.palette.mode),
                  borderRadius: '16px',
                  p: { xs: 3, sm: 4 },
                })}
              >
                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <Stack spacing={3}>
                    <TextField
                      label="Name"
                      fullWidth
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          bgcolor: (theme) =>
                            theme.palette.mode === 'dark'
                              ? 'rgba(15,23,42,0.4)'
                              : 'rgba(255,255,255,0.5)',
                          '& fieldset': {
                            borderColor: (theme) =>
                              theme.palette.mode === 'dark'
                                ? 'rgba(51,65,85,0.4)'
                                : 'rgba(0,0,0,0.12)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(168,220,171,0.5)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#A8DCAB',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: (theme) =>
                            theme.palette.mode === 'dark' ? '#CBD5E1' : 'text.secondary',
                          '&.Mui-focused': {
                            color: '#A8DCAB',
                          },
                        },
                        '& .MuiOutlinedInput-input': {
                          color: (theme) =>
                            theme.palette.mode === 'dark' ? '#F1F5F9' : 'text.primary',
                        },
                      }}
                    />

                    <TextField
                      label="Email"
                      type="email"
                      fullWidth
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          bgcolor: (theme) =>
                            theme.palette.mode === 'dark'
                              ? 'rgba(15,23,42,0.4)'
                              : 'rgba(255,255,255,0.5)',
                          '& fieldset': {
                            borderColor: (theme) =>
                              theme.palette.mode === 'dark'
                                ? 'rgba(51,65,85,0.4)'
                                : 'rgba(0,0,0,0.12)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(168,220,171,0.5)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#A8DCAB',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: (theme) =>
                            theme.palette.mode === 'dark' ? '#CBD5E1' : 'text.secondary',
                          '&.Mui-focused': {
                            color: '#A8DCAB',
                          },
                        },
                        '& .MuiOutlinedInput-input': {
                          color: (theme) =>
                            theme.palette.mode === 'dark' ? '#F1F5F9' : 'text.primary',
                        },
                      }}
                    />

                    <TextField
                      label="Message"
                      fullWidth
                      multiline
                      rows={5}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          bgcolor: (theme) =>
                            theme.palette.mode === 'dark'
                              ? 'rgba(15,23,42,0.4)'
                              : 'rgba(255,255,255,0.5)',
                          '& fieldset': {
                            borderColor: (theme) =>
                              theme.palette.mode === 'dark'
                                ? 'rgba(51,65,85,0.4)'
                                : 'rgba(0,0,0,0.12)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(168,220,171,0.5)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#A8DCAB',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: (theme) =>
                            theme.palette.mode === 'dark' ? '#CBD5E1' : 'text.secondary',
                          '&.Mui-focused': {
                            color: '#A8DCAB',
                          },
                        },
                        '& .MuiOutlinedInput-input': {
                          color: (theme) =>
                            theme.palette.mode === 'dark' ? '#F1F5F9' : 'text.primary',
                        },
                      }}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      sx={{
                        py: 1.5,
                        borderRadius: '10px',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        textTransform: 'none',
                        bgcolor: '#A8DCAB',
                        color: '#0F172A',
                        boxShadow: '0 4px 14px -4px rgba(168,220,171,0.4)',
                        '&:hover': {
                          bgcolor: '#93D097',
                          boxShadow: '0 8px 24px -6px rgba(168,220,171,0.5)',
                          transform: 'translateY(-1px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Send Message
                    </Button>

                    <Typography
                      sx={{
                        textAlign: 'center',
                        fontSize: '0.75rem',
                        color: (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(148,163,184,0.6)'
                            : 'text.disabled',
                        fontStyle: 'italic',
                      }}
                    >
                      This form is for demonstration only. Please reach out via email or LinkedIn.
                    </Typography>
                  </Stack>
                </Box>
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
