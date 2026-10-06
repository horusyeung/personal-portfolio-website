'use client'

import {
  startTransition,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  ViewTransition,
  type CSSProperties,
} from 'react'
import { SplitText } from 'gsap/SplitText'
import { gsap, useGSAP } from '@/lib/gsap'
import { experiences } from '@/content/experience'
import { githubProjects } from '@/content/projects'
import { skillCategories } from '@/content/skills'
import { skillIcons } from '@/lib/skillIcons'
import s from './lab.module.css'

gsap.registerPlugin(SplitText)

const MOTION_OK = '(prefers-reduced-motion: no-preference)'
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches

// ── iOS 26 floating tab bar with the scroll edge effect ─────────────────────

const TABS = ['Home', 'Experience', 'Open Source', 'Contact']

export function TabBarDemo() {
  const scroller = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const pill = useRef<HTMLSpanElement>(null)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const [active, setActive] = useState(0)
  const [compact, setCompact] = useState(false)

  // Slide the glass capsule to the active tab, stretching it on the way like iOS 26
  useLayoutEffect(() => {
    const target = tabs.current[active]
    if (!target || !pill.current || !bar.current) return
    const x = target.offsetLeft
    const w = target.offsetWidth
    if (reduced()) {
      gsap.set(pill.current, { x, width: w })
      return
    }
    gsap
      .timeline()
      .to(pill.current, { x, width: w, duration: 0.55, ease: 'elastic.out(1, 0.75)' }, 0)
      .to(pill.current, { scaleY: 0.86, scaleX: 1.12, duration: 0.14, ease: 'power2.out' }, 0)
      .to(pill.current, { scaleY: 1, scaleX: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' }, 0.14)
  }, [active, compact])

  // Shrink while scrolling down, expand on the way back up
  useEffect(() => {
    const el = scroller.current!
    let last = el.scrollTop
    const onScroll = () => {
      const y = el.scrollTop
      if (Math.abs(y - last) < 6) return
      setCompact(y > last && y > 40)
      last = y
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={s.device}>
      <div ref={scroller} className={s.deviceScroll}>
        {/* Scroll edge effect: stacked blur layers, each masked to a band, so content melts away */}
        <div className={s.edgeBlur} aria-hidden>
          {[1, 2, 4, 8, 16].map((b, i) => (
            <span key={b} style={{ '--b': `${b}px`, '--i': i } as CSSProperties} />
          ))}
        </div>
        <div className={s.deviceContent}>
          <h3 className={s.deviceTitle}>Experience</h3>
          {experiences.slice(0, 3).map((exp) => (
            <div key={exp.period} style={{ marginBottom: 28 }}>
              <div className={s.small}>{exp.period}</div>
              <div style={{ fontSize: 19, fontWeight: 600, margin: '2px 0 8px' }}>{exp.title}</div>
              {exp.bullets.slice(0, 4).map((b) => (
                <p key={b} className={s.bullet}>
                  {b}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div
        ref={bar}
        className={`${s.tabBar} ${compact ? s.tabBarCompact : ''}`}
        role='tablist'
        aria-label='Demo tab bar'
      >
        <span ref={pill} className={s.tabPill} aria-hidden />
        {TABS.map((label, i) => (
          <button
            key={label}
            ref={(n) => {
              tabs.current[i] = n
            }}
            role='tab'
            aria-selected={i === active}
            className={`${s.tabItem} ${i === active ? s.tabItemActive : ''}`}
            onClick={() => setActive(i)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Liquid Glass controls: switch and segmented control ──────────────────────

export function GlassControlsDemo() {
  const [on, setOn] = useState(true)
  const [pressed, setPressed] = useState(false)
  const categories = ['All', 'Frontend', 'Mobile', 'Backend', 'Cloud & DevOps']
  const [cat, setCat] = useState(0)
  const seg = useRef<HTMLDivElement>(null)
  const thumb = useRef<HTMLSpanElement>(null)
  const items = useRef<(HTMLButtonElement | null)[]>([])
  const chips = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const t = items.current[cat]
    if (!t || !thumb.current) return
    if (reduced()) {
      gsap.set(thumb.current, { x: t.offsetLeft, width: t.offsetWidth })
      return
    }
    gsap
      .timeline()
      .to(
        thumb.current,
        { x: t.offsetLeft, width: t.offsetWidth, duration: 0.5, ease: 'elastic.out(1, 0.8)' },
        0,
      )
      .to(thumb.current, { scaleY: 1.18, duration: 0.12, ease: 'power2.out' }, 0)
      .to(thumb.current, { scaleY: 1, duration: 0.45, ease: 'elastic.out(1, 0.45)' }, 0.12)
  }, [cat])

  // Chips appear with a short stagger when the filter changes
  useLayoutEffect(() => {
    if (reduced() || !chips.current) return
    gsap.fromTo(
      chips.current.children,
      { y: 8, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.35, stagger: 0.02, ease: 'power2.out' },
    )
  }, [cat])

  const shown =
    cat === 0
      ? skillCategories.flatMap((c) => c.skills).slice(0, 18)
      : (skillCategories.find((c) => c.title === categories[cat])?.skills ?? [])

  return (
    <div style={{ display: 'grid', gap: 36, justifyItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 15, fontWeight: 500 }}>Available for work</span>
        <button
          role='switch'
          aria-checked={on}
          aria-label='Available for work'
          className={`${s.switch} ${on ? s.switchOn : ''} ${pressed ? s.switchPressed : ''}`}
          onClick={() => setOn((v) => !v)}
          onPointerDown={() => setPressed(true)}
          onPointerUp={() => setPressed(false)}
          onPointerLeave={() => setPressed(false)}
        >
          {/* While pressed the knob becomes clear glass and magnifies the track behind it */}
          <span className={s.switchKnob}>
            <span className={s.switchLens} />
          </span>
        </button>
      </div>

      <div ref={seg} className={s.segmented} role='radiogroup' aria-label='Skill category'>
        <span ref={thumb} className={s.segThumb} aria-hidden />
        {categories.map((c, i) => (
          <button
            key={c}
            ref={(n) => {
              items.current[i] = n
            }}
            role='radio'
            aria-checked={i === cat}
            className={`${s.segItem} ${i === cat ? s.segItemActive : ''}`}
            onClick={() => setCat(i)}
          >
            {c}
          </button>
        ))}
      </div>

      <div
        ref={chips}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          justifyContent: 'center',
          maxWidth: 680,
        }}
      >
        {shown.map((skill) => {
          const Icon = skillIcons[skill.icon]
          return (
            <span key={skill.name} className={s.chip}>
              <Icon size={16} style={{ color: skill.brandColor || 'inherit' }} />
              {skill.name}
            </span>
          )
        })}
      </div>
    </div>
  )
}

// ── App Store "Today" card morph ─────────────────────────────────────────────

const ART = [
  'linear-gradient(135deg, #0a84ff, #5e5ce6)',
  'linear-gradient(135deg, #ff375f, #ff9f0a)',
  'linear-gradient(135deg, #30d158, #0a84ff)',
  'linear-gradient(135deg, #bf5af2, #ff375f)',
]

export function CardMorphDemo() {
  const [open, setOpen] = useState<number | null>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const lastCard = useRef<HTMLButtonElement | null>(null)
  const projects = githubProjects.slice(0, 4)

  useEffect(() => {
    if (open === null) {
      lastCard.current?.focus()
      return
    }
    closeBtn.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && startTransition(() => setOpen(null))
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 20,
        }}
      >
        {projects.map((p, i) =>
          open === i ? (
            <div key={p.name} className={s.cardPlaceholder} />
          ) : (
            <ViewTransition key={p.name} name={`today-${i}`} share='today-morph' default='none'>
              <button
                className={s.todayCard}
                style={{ background: ART[i] }}
                onClick={(e) => {
                  lastCard.current = e.currentTarget
                  startTransition(() => setOpen(i))
                }}
              >
                <span className={s.todayEyebrow}>
                  {p.status === 'Live' ? 'Open Source' : 'Coming Soon'}
                </span>
                <span className={s.todayTitle}>{p.name}</span>
              </button>
            </ViewTransition>
          ),
        )}
      </div>
      {open !== null && (
        <div className={s.sheetBackdrop} onClick={() => startTransition(() => setOpen(null))}>
          <ViewTransition name={`today-${open}`} share='today-morph' default='none'>
            <div
              className={s.sheet}
              role='dialog'
              aria-modal='true'
              aria-label={projects[open].name}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={s.sheetHero} style={{ background: ART[open] }}>
                <span className={s.todayEyebrow}>
                  {projects[open].status === 'Live' ? 'Open Source' : 'Coming Soon'}
                </span>
                <span className={s.todayTitle} style={{ fontSize: 34 }}>
                  {projects[open].name}
                </span>
              </div>
              <div style={{ padding: 28 }}>
                <p style={{ fontSize: 17, lineHeight: 1.55, margin: 0 }}>
                  {projects[open].description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '18px 0 24px' }}>
                  {projects[open].tags.map((t) => (
                    <span key={t} className={s.chip}>
                      {t}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <a
                    className={s.primaryButton}
                    href={projects[open].url}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    View on GitHub
                  </a>
                  <button
                    ref={closeBtn}
                    className={s.textButton}
                    onClick={() => startTransition(() => setOpen(null))}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </ViewTransition>
        </div>
      )}
    </>
  )
}

// ── apple.com scroll-scrubbed type ───────────────────────────────────────────

export function ScrubTextDemo() {
  const ref = useRef<HTMLParagraphElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(ref.current!, { type: 'words', autoSplit: true })
        gsap.fromTo(
          split.words,
          { opacity: 0.18 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: 'none',
            scrollTrigger: {
              trigger: ref.current,
              start: 'top 80%',
              end: 'bottom 45%',
              scrub: true,
            },
          },
        )
        return () => split.revert()
      })
      return () => mm.revert()
    },
    { scope: ref },
  )
  return (
    <p ref={ref} className={s.scrubText}>
      Designed a microservice architecture from scratch. Lead a distributed team of 5 engineers
      while coding daily, managing cross-timezone sprints, coding standards and CI/CD pipelines. Use
      AI-augmented development workflows to speed up delivery and raise code quality.
    </p>
  )
}

// ── Apple Intelligence glow ──────────────────────────────────────────────────

export function GlowDemo() {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ display: 'grid', gap: 32, justifyItems: 'center', width: '100%' }}>
      <div className={`${s.glow} ${focused ? s.glowOn : ''}`} style={{ width: 'min(560px, 100%)' }}>
        <textarea
          className={s.glowField}
          rows={4}
          placeholder='Write a message…'
          aria-label='Message'
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </div>
      <span className={`${s.glow} ${s.glowHover}`} style={{ borderRadius: 999 }}>
        <a href='#' className={s.glowButton} onClick={(e) => e.preventDefault()}>
          Get in touch →
        </a>
      </span>
    </div>
  )
}
