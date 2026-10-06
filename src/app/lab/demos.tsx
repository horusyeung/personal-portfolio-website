'use client'

import {
  startTransition,
  useEffect,
  useId,
  useRef,
  useState,
  ViewTransition,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { Typography } from '@mui/material'
import { SplitText } from 'gsap/SplitText'
import { gsap, useGSAP } from '@/lib/gsap'
import { skillCategories } from '@/content/skills'
import { experiences } from '@/content/experience'
import { skillIcons } from '@/lib/skillIcons'
import s from './lab.module.css'

gsap.registerPlugin(SplitText)

const MOTION_OK = '(prefers-reduced-motion: no-preference)'

// ── 1. Line-masked headline reveal ───────────────────────────────────────────

function RevealHeading({ text }: { text: string }) {
  const ref = useRef<HTMLHeadingElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(ref.current!, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 0.9,
              ease: 'power3.out',
              stagger: 0.14,
            }),
        })
        return () => split.revert()
      })
      return () => mm.revert()
    },
    { scope: ref },
  )
  return (
    <Typography
      ref={ref}
      variant='h2'
      sx={{ fontSize: { xs: '40px', md: '56px' }, fontWeight: 700, letterSpacing: '-0.015em' }}
    >
      {text}
    </Typography>
  )
}

export function LineRevealDemo() {
  const [run, setRun] = useState(0)
  return (
    <div className={s.stage}>
      <RevealHeading key={run} text="Let's work together. Have a project in mind?" />
      <button className={s.button} onClick={() => setRun((n) => n + 1)}>
        Replay ↻
      </button>
    </div>
  )
}

// ── 2. Liquid Glass ──────────────────────────────────────────────────────────

/** Displacement map for a rounded rectangle: pixels near the rim sample from further inside,
 * so the backdrop bends at the edges like a lens. Red/green encode x/y offsets around 128. */
function displacementMap(width: number, height: number, radius: number, bezel: number) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  const image = ctx.createImageData(width, height)
  const cx = width / 2
  const cy = height / 2
  const hx = width / 2 - radius
  const hy = height / 2 - radius
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const px = x + 0.5 - cx
      const py = y + 0.5 - cy
      const qx = Math.abs(px) - hx
      const qy = Math.abs(py) - hy
      const outside = Math.hypot(Math.max(qx, 0), Math.max(qy, 0))
      const edgeDistance = radius - (outside + Math.min(Math.max(qx, qy), 0))
      let nx = 0
      let ny = 0
      if (qx > 0 && qy > 0) {
        nx = (qx / outside) * Math.sign(px)
        ny = (qy / outside) * Math.sign(py)
      } else if (qx > qy) nx = Math.sign(px)
      else ny = Math.sign(py)
      const t = edgeDistance < bezel && edgeDistance >= 0 ? 1 - edgeDistance / bezel : 0
      const strength = t * t
      const i = (y * width + x) * 4
      image.data[i] = 128 - nx * strength * 127
      image.data[i + 1] = 128 - ny * strength * 127
      image.data[i + 2] = 128
      image.data[i + 3] = 255
    }
  }
  ctx.putImageData(image, 0, 0)
  return canvas.toDataURL()
}

/** Glass surface. In Chromium it refracts its backdrop through an SVG filter; elsewhere it falls
 * back to Apple's web recipe (blur + saturate + rim). */
function Glass({
  className,
  style,
  children,
  bezel = 20,
  scale,
  ...rest
}: {
  className: string
  style?: CSSProperties
  children?: React.ReactNode
  bezel?: number
  scale?: number
} & React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null)
  const id = `lg${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const [map, setMap] = useState<{ href: string; w: number; h: number } | null>(null)

  useEffect(() => {
    const el = ref.current
    // backdrop-filter: url() works in Chromium only; Safari and Firefox keep the blur recipe
    const chromium = /Chrome\//.test(navigator.userAgent)
    if (!el || !chromium) return
    const build = () => {
      const { width, height } = el.getBoundingClientRect()
      const w = Math.round(width)
      const h = Math.round(height)
      if (!w || !h) return
      const radius = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0
      setMap({ href: displacementMap(w, h, Math.min(radius, h / 2, w / 2), bezel), w, h })
    }
    build()
    const observer = new ResizeObserver(build)
    observer.observe(el)
    return () => observer.disconnect()
  }, [bezel])

  return (
    <div
      ref={ref}
      className={`${s.glass} ${className}`}
      data-refract={map ? 'true' : undefined}
      style={{ ...style, ...(map ? ({ '--refract': `url(#${id})` } as CSSProperties) : {}) }}
      {...rest}
    >
      {map && (
        <svg width='0' height='0' style={{ position: 'absolute' }} aria-hidden>
          <filter
            id={id}
            x='0'
            y='0'
            width={map.w}
            height={map.h}
            filterUnits='userSpaceOnUse'
            colorInterpolationFilters='sRGB'
          >
            <feImage
              href={map.href}
              x='0'
              y='0'
              width={map.w}
              height={map.h}
              preserveAspectRatio='none'
              result='map'
            />
            <feDisplacementMap
              in='SourceGraphic'
              in2='map'
              // Below the bezel width the sampled point never overtakes its neighbour, so the
              // backdrop compresses at the rim like Apple's glass instead of flipping over
              scale={scale ?? bezel * 0.9}
              xChannelSelector='R'
              yChannelSelector='G'
            />
          </filter>
        </svg>
      )}
      {children}
    </div>
  )
}

function SkillBackdrop() {
  return (
    <div className={s.glassContent}>
      <Typography variant='h2' sx={{ fontSize: { xs: 36, md: 52 }, fontWeight: 700, mb: 4 }}>
        Technologies I work with.
      </Typography>
      {skillCategories.map((category) => (
        <div key={category.title} style={{ padding: '14px 0' }}>
          <div className={s.tileTitle}>{category.title}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 18px', marginTop: 10 }}>
            {category.skills.map((skill) => {
              const Icon = skillIcons[skill.icon]
              return (
                <span
                  key={skill.name}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 15 }}
                >
                  <Icon size={22} style={{ color: skill.brandColor || 'inherit' }} />
                  {skill.name}
                </span>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

const TABS = ['Home', 'Experience', 'Open Source', 'Contact']

export function LiquidGlassDemo() {
  const [tab, setTab] = useState(0)
  const [lens, setLens] = useState({ x: 40, y: 150 })
  const [headerRim, setHeaderRim] = useState(false)
  const drag = useRef<{ dx: number; dy: number } | null>(null)

  useEffect(() => {
    document.documentElement.classList.toggle('lab-glass-header', headerRim)
    return () => document.documentElement.classList.remove('lab-glass-header')
  }, [headerRim])

  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { dx: e.clientX - lens.x, dy: e.clientY - lens.y }
  }
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    setLens({ x: e.clientX - drag.current.dx, y: e.clientY - drag.current.dy })
  }

  return (
    <div className={s.stage} style={{ padding: 16 }}>
      <div style={{ position: 'relative' }}>
        <div className={s.glassScroller}>
          <Glass className={s.tabBar} role='tablist' aria-label='Demo tab bar'>
            {TABS.map((label, i) => (
              <button
                key={label}
                role='tab'
                aria-selected={i === tab}
                className={`${s.tab} ${i === tab ? s.tabActive : ''}`}
                onClick={() => setTab(i)}
              >
                {label}
              </button>
            ))}
          </Glass>
          <SkillBackdrop />
        </div>
        <Glass
          className={s.lens}
          style={{ left: lens.x, top: lens.y }}
          bezel={34}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={() => (drag.current = null)}
          aria-label='Draggable glass lens'
        />
      </div>
      <div className={s.glassChips}>
        <Glass className={`${s.glassChip} ${s.chipLive}`} bezel={10}>
          Live
        </Glass>
        <Glass className={s.glassChip} bezel={10}>
          Coming Soon
        </Glass>
        <button
          className={s.button}
          style={{ marginTop: 0 }}
          onClick={() => setHeaderRim((v) => !v)}
        >
          {headerRim ? 'Remove' : 'Try'} the glass rim on the real header ↑
        </button>
      </div>
    </div>
  )
}

// ── 3. Sliding nav pill ──────────────────────────────────────────────────────

export function NavPillDemo() {
  const [active, setActive] = useState(0)
  return (
    <div className={s.stage}>
      <nav className={s.pillNav} aria-label='Demo navigation'>
        {TABS.map((label, i) => (
          <button
            key={label}
            className={s.pillItem}
            aria-current={i === active ? 'page' : undefined}
            onClick={() => startTransition(() => setActive(i))}
          >
            {i === active && (
              <ViewTransition name='lab-pill' share='lab-pill' default='none'>
                <span className={s.pill} />
              </ViewTransition>
            )}
            {label}
          </button>
        ))}
      </nav>
    </div>
  )
}

// ── 7. Spotlight tiles ───────────────────────────────────────────────────────

export function SpotlightDemo() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const root = ref.current
    if (!root || !matchMedia('(hover: hover) and (pointer: fine)').matches) return
    let frame = 0
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        root.querySelectorAll<HTMLElement>(`.${s.tile}`).forEach((tile) => {
          const r = tile.getBoundingClientRect()
          tile.style.setProperty('--x', `${e.clientX - r.left}px`)
          tile.style.setProperty('--y', `${e.clientY - r.top}px`)
        })
      })
    }
    root.addEventListener('pointermove', onMove)
    return () => {
      cancelAnimationFrame(frame)
      root.removeEventListener('pointermove', onMove)
    }
  }, [])
  return (
    <div ref={ref} className={`${s.stage} ${s.tiles}`}>
      {skillCategories.slice(0, 6).map((category) => (
        <div key={category.title} className={s.tile}>
          <div className={s.tileTitle}>{category.title}</div>
          <div className={s.tileSkills}>{category.skills.map((x) => x.name).join(' · ')}</div>
        </div>
      ))}
    </div>
  )
}

// ── 6. @starting-style entry ─────────────────────────────────────────────────

export function EntryDemo() {
  const [shown, setShown] = useState(false)
  return (
    <div className={s.stage}>
      <button className={s.button} style={{ marginTop: 0 }} onClick={() => setShown((v) => !v)}>
        {shown ? 'Hide' : 'Send message (demo)'}
      </button>
      <div className={s.toast} hidden={!shown} role='status'>
        Message sent. I&apos;ll get back to you soon.
      </div>
    </div>
  )
}

// ── 8. Anchor-positioned tooltips ────────────────────────────────────────────

const TIP_SKILLS = [
  'TypeScript',
  'React.js',
  'Next.js',
  'Node.js',
  'PostgreSQL',
  'AWS',
  'Docker',
  'Claude Code',
]

export function TooltipDemo() {
  const all = skillCategories.flatMap((c) => c.skills)
  return (
    <div className={`${s.stage} ${s.iconRow}`}>
      {TIP_SKILLS.map((name, i) => {
        const skill = all.find((x) => x.name === name)!
        const Icon = skillIcons[skill.icon]
        return (
          <span key={name} style={{ position: 'relative' }}>
            <button
              className={s.iconButton}
              aria-label={name}
              style={{ ['anchorName' as string]: `--tip-${i}` } as CSSProperties}
            >
              <Icon size={22} style={{ color: skill.brandColor || 'inherit' }} />
            </button>
            <span
              className={s.tip}
              aria-hidden
              style={{ ['positionAnchor' as string]: `--tip-${i}` } as CSSProperties}
            >
              {name}
            </span>
          </span>
        )
      })}
    </div>
  )
}

// ── 10. Experience progress rail ─────────────────────────────────────────────

export function RailDemo() {
  const wrap = useRef<HTMLDivElement>(null)
  const fill = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          fill.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: wrap.current,
              start: 'top 75%',
              end: 'bottom 60%',
              scrub: true,
            },
          },
        )
      })
      return () => mm.revert()
    },
    { scope: wrap },
  )
  return (
    <div className={s.stage}>
      <div ref={wrap} className={s.railWrap}>
        <div className={s.rail} />
        <div ref={fill} className={s.railFill} />
        {experiences.map((exp) => (
          <div key={exp.period} className={s.role}>
            <div className={s.meta} style={{ marginTop: 0 }}>
              {exp.period}
            </div>
            <Typography sx={{ fontSize: 20, fontWeight: 600 }}>{exp.title}</Typography>
            <Typography sx={{ fontSize: 15, color: 'primary.text' }}>{exp.company}</Typography>
          </div>
        ))}
      </div>
    </div>
  )
}
