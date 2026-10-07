'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { Typography } from '@mui/material'
import { gsap, loadSplitText } from '@/lib/gsap'
import styles from './AboutScrollText.module.css'

export default function AboutScrollText({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const paragraph = ref.current
    if (!paragraph) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let disposed = false
    let near = false
    let generation = 0
    let loading = false
    let split: ReturnType<Awaited<ReturnType<typeof loadSplitText>>['create']> | null = null
    let tween: gsap.core.Tween | null = null

    const revert = () => {
      generation += 1
      loading = false
      tween?.scrollTrigger?.kill()
      tween?.kill()
      tween = null
      split?.revert()
      split = null
    }
    const prepare = async () => {
      if (disposed || reduced.matches || !near || loading || split) return
      loading = true
      const requested = ++generation
      try {
        const SplitText = await loadSplitText()
        if (disposed || reduced.matches || requested !== generation) return
        loading = false
        split = SplitText.create(paragraph, {
          type: 'words',
          tag: 'span',
          aria: 'none',
          wordsClass: styles.word,
        })
        tween = gsap.fromTo(
          split.words,
          { '--word-lit': '0%' },
          {
            '--word-lit': '100%',
            duration: 1,
            stagger: 0.08,
            ease: 'none',
            scrollTrigger: {
              trigger: paragraph,
              start: 'top 80%',
              end: 'bottom 45%',
              scrub: true,
            },
          },
        )
      } catch {
        // The original readable paragraph survives an unavailable optional chunk.
        if (!disposed && requested === generation) revert()
      }
    }
    const onPreference = () => {
      revert()
      if (!reduced.matches) void prepare()
    }
    const observer =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(
            (entries) => {
              if (!entries.some((entry) => entry.target === paragraph && entry.isIntersecting))
                return
              near = true
              observer?.disconnect()
              void prepare()
            },
            { rootMargin: '180px 0px' },
          )
    if (observer) observer.observe(paragraph)
    else {
      near = true
      void prepare()
    }
    reduced.addEventListener('change', onPreference)
    return () => {
      disposed = true
      observer?.disconnect()
      reduced.removeEventListener('change', onPreference)
      revert()
    }
  }, [])

  return (
    <Typography
      component='p'
      ref={ref}
      data-testid='about-copy'
      sx={{
        mt: 3,
        maxWidth: 640,
        fontSize: '21px',
        fontWeight: 400,
        lineHeight: 1.47,
        color: 'text.secondary',
      }}
    >
      {children}
    </Typography>
  )
}
