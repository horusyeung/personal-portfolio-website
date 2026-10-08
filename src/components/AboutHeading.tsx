'use client'

import { Fragment, useRef } from 'react'
import { Typography } from '@mui/material'
import { gsap } from '@/lib/gsap'
import { useEntranceAnimation } from '@/lib/motion'
import styles from './AboutHeading.module.css'

const words = ['Building', 'products', 'that', 'scale.']

export default function AboutHeading() {
  const ref = useRef<HTMLHeadingElement>(null)
  const played = useRef(false)

  useEntranceAnimation(() => {
    const heading = ref.current
    if (!heading) return
    gsap.set(heading, { opacity: 1 })
    if (played.current) {
      heading.dataset.motionPhase = 'complete'
      return
    }

    const targets = heading.querySelectorAll('[data-heading-word]')
    const rule = heading.querySelector('[data-heading-rule]')
    heading.dataset.motionPhase = 'pending'
    gsap.set(rule, { scaleX: 0, transformOrigin: 'left center' })
    let timeline: gsap.core.Timeline | null = null
    const finish = () => {
      if (!timeline?.isActive()) return
      timeline.scrollTrigger?.kill(false, true)
      timeline.progress(1).pause()
    }
    timeline = gsap.timeline({
      scrollTrigger: { trigger: heading, start: 'top 85%', once: true },
      onStart: () => {
        played.current = true
        heading.dataset.playCount = '1'
        heading.dataset.motionPhase = 'playing'
        if (document.hidden) finish()
      },
      onComplete: () => {
        heading.dataset.motionPhase = 'complete'
      },
    })
    timeline.fromTo(
      targets,
      { yPercent: 110, rotation: 1.5, opacity: 0 },
      { yPercent: 0, rotation: 0, opacity: 1, duration: 0.65, stagger: 0.09, ease: 'power3.out' },
      0,
    )
    timeline.to(rule, { scaleX: 1, duration: 0.6, ease: 'power2.out' }, 0.28)
    timeline.set(targets, { clearProps: 'transform,opacity' })

    const visibility = () => {
      if (document.hidden) finish()
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) finish()
    })
    observer.observe(heading)
    document.addEventListener('visibilitychange', visibility)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', visibility)
      heading.dataset.motionPhase = 'static'
    }
  }, ref)

  return (
    <Typography
      ref={ref}
      variant='h2'
      data-intro
      data-testid='about-heading'
      data-motion-phase='static'
      data-play-count='0'
      className={styles.heading}
      sx={{
        fontSize: { xs: '40px', md: '56px' },
        fontWeight: 700,
        letterSpacing: '-0.015em',
        lineHeight: 1.07,
        color: 'text.primary',
      }}
    >
      {words.map((word, index) => (
        <Fragment key={word}>
          {index > 0 && ' '}
          <span className={styles.mask}>
            <span className={styles.word} data-heading-word>
              {word}
            </span>
          </span>
        </Fragment>
      ))}
      <span className={styles.rule} data-heading-rule aria-hidden='true'>
        <svg viewBox='0 0 220 10' fill='none'>
          <path d='M2 7 Q105 1 218 5' stroke='currentColor' strokeWidth='3' strokeLinecap='round' />
        </svg>
      </span>
    </Typography>
  )
}
