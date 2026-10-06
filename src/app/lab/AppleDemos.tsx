'use client'

import { useEffect, useRef, useState, type ComponentType, type CSSProperties } from 'react'
import { SiGithub } from 'react-icons/si'
import EmailOutlined from '@mui/icons-material/EmailOutlined'
import LinkedIn from '@mui/icons-material/LinkedIn'
import LanguageOutlined from '@mui/icons-material/LanguageOutlined'
import CheckRounded from '@mui/icons-material/CheckRounded'
import { skillCategories } from '@/content/skills'
import { skillIcons } from '@/lib/skillIcons'
import { EMAIL, SITE_URL, SOCIAL_LINKS } from '@/content/site'

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches

// ── macOS Dock magnification ─────────────────────────────────────────────────

type DockItem = {
  label: string
  href: string
  Icon: ComponentType<{ style?: CSSProperties }>
  bg: string
}

const DOCK: DockItem[] = [
  {
    label: 'Email',
    href: `mailto:${EMAIL}`,
    Icon: EmailOutlined,
    bg: 'linear-gradient(180deg,#4fb2ff,#0a6cff)',
  },
  {
    label: 'LinkedIn',
    href: SOCIAL_LINKS.linkedin.url,
    Icon: LinkedIn,
    bg: 'linear-gradient(180deg,#2e8fe0,#0a66c2)',
  },
  {
    label: 'GitHub',
    href: SOCIAL_LINKS.github.url,
    Icon: SiGithub,
    bg: 'linear-gradient(180deg,#4a4a4f,#161618)',
  },
  {
    label: 'Medium',
    href: SOCIAL_LINKS.medium.url,
    Icon: MediumMark,
    bg: 'linear-gradient(180deg,#3a3a3c,#0b0b0c)',
  },
  {
    label: 'Website',
    href: SITE_URL,
    Icon: LanguageOutlined,
    bg: 'linear-gradient(180deg,#5ad17a,#1c9b45)',
  },
]

/** Medium's three-ellipse mark */
function MediumMark({ style }: { style?: CSSProperties }) {
  return (
    <svg viewBox='0 0 1044 593' style={style} fill='currentColor' aria-hidden>
      <ellipse cx='294' cy='296' rx='294' ry='296' />
      <ellipse cx='764' cy='296' rx='147' ry='279' />
      <ellipse cx='992' cy='296' rx='52' ry='250' />
    </svg>
  )
}

const BASE = 56
const MAX = 96
const RANGE = 160

export function DockDemo() {
  const bar = useRef<HTMLDivElement>(null)
  const items = useRef<(HTMLAnchorElement | null)[]>([])
  const [hover, setHover] = useState<number | null>(null)

  useEffect(() => {
    const el = bar.current!
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches || reducedMotion()) return
    const sizes = DOCK.map(() => BASE)
    let mouseX: number | null = null
    let raf = 0
    const tick = () => {
      let moving = false
      items.current.forEach((item, i) => {
        if (!item) return
        let target = BASE
        if (mouseX !== null) {
          const r = item.getBoundingClientRect()
          const d = Math.abs(mouseX - (r.left + r.width / 2))
          // Cosine falloff, like the Dock: full size under the pointer, none past RANGE
          target = BASE + (MAX - BASE) * (d < RANGE ? (Math.cos((d / RANGE) * Math.PI) + 1) / 2 : 0)
        }
        sizes[i] += (target - sizes[i]) * 0.25
        if (Math.abs(target - sizes[i]) > 0.2) moving = true
        item.style.width = item.style.height = `${sizes[i]}px`
      })
      raf = moving || mouseX !== null ? requestAnimationFrame(tick) : 0
    }
    const start = () => (raf ||= requestAnimationFrame(tick))
    const onMove = (e: PointerEvent) => {
      mouseX = e.clientX
      start()
    }
    const onLeave = () => {
      mouseX = null
      start()
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div style={{ display: 'grid', placeItems: 'end center', height: 200, paddingBottom: 18 }}>
      <div
        ref={bar}
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 12,
          padding: '10px 14px',
          borderRadius: 24,
          background: 'var(--dock-fill, rgba(255,255,255,0.45))',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.7), inset 0 0 0 0.5px rgba(0,0,0,0.08), 0 12px 40px rgba(0,0,0,0.18)',
        }}
      >
        {DOCK.map(({ label, href, Icon, bg }, i) => (
          <a
            key={label}
            ref={(node) => {
              items.current[i] = node
            }}
            href={href}
            target={href.startsWith('mailto') ? undefined : '_blank'}
            rel='noopener noreferrer'
            aria-label={label}
            onPointerEnter={() => setHover(i)}
            onPointerLeave={() => setHover(null)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
            style={{
              position: 'relative',
              width: BASE,
              height: BASE,
              borderRadius: '22%',
              background: bg,
              display: 'grid',
              placeItems: 'center',
              color: '#fff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.35)',
              outlineOffset: 3,
            }}
          >
            <Icon style={{ width: '48%', height: '48%' }} aria-hidden />
            <span
              aria-hidden
              style={{
                position: 'absolute',
                bottom: 'calc(100% + 10px)',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '4px 10px',
                borderRadius: 7,
                fontSize: 12,
                fontWeight: 500,
                whiteSpace: 'nowrap',
                color: 'var(--mui-palette-text-primary)',
                background: 'var(--mui-palette-background-paper)',
                boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                opacity: hover === i ? 1 : 0,
                transition: 'opacity 0.15s',
              }}
            >
              {label}
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}

// ── Apple Watch honeycomb ────────────────────────────────────────────────────

const SKILLS = skillCategories.flatMap((c) => c.skills)
const BUBBLE = 64
const GAP = 10

/** Hex grid positions, spiralling out from the centre like the Apple Watch app grid. */
function hexPositions(count: number) {
  const out: { x: number; y: number }[] = [{ x: 0, y: 0 }]
  const step = BUBBLE + GAP
  const dirs = [
    [1, 0],
    [0.5, 0.866],
    [-0.5, 0.866],
    [-1, 0],
    [-0.5, -0.866],
    [0.5, -0.866],
  ]
  for (let ring = 1; out.length < count; ring++) {
    let x = dirs[4][0] * ring * step
    let y = dirs[4][1] * ring * step
    for (let side = 0; side < 6 && out.length < count; side++) {
      for (let k = 0; k < ring && out.length < count; k++) {
        out.push({ x, y })
        x += dirs[side][0] * step
        y += dirs[side][1] * step
      }
    }
  }
  // An incomplete outer ring makes the spiral lopsided, so centre the cloud on its midpoint
  const mx = out.reduce((sum, p) => sum + p.x, 0) / out.length
  const my = out.reduce((sum, p) => sum + p.y, 0) / out.length
  return out.map((p) => ({ x: p.x - mx, y: p.y - my }))
}

export function HoneycombDemo() {
  const stage = useRef<HTMLDivElement>(null)
  const nodes = useRef<(HTMLDivElement | null)[]>([])
  const [name, setName] = useState('Drag me')

  useEffect(() => {
    const el = stage.current!
    const positions = hexPositions(SKILLS.length)
    const pan = { x: 0, y: 0 }
    const vel = { x: 0, y: 0 }
    let drag: { x: number; y: number } | null = null
    let raf = 0
    const still = reducedMotion()

    const layout = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      const radius = Math.min(w, h) * 0.55
      let nearest = -1
      let best = Infinity
      positions.forEach((p, i) => {
        const node = nodes.current[i]
        if (!node) return
        const x = p.x + pan.x
        const y = p.y + pan.y
        const d = Math.hypot(x, y)
        // Fisheye: full size in the middle, shrinking and pulled in towards the rim
        const f = Math.max(0, 1 - (d / radius) ** 2)
        const scale = 0.25 + 0.85 * f
        const pull = 1 - 0.18 * (1 - f)
        node.style.transform = `translate(${w / 2 + x * pull - BUBBLE / 2}px, ${h / 2 + y * pull - BUBBLE / 2}px) scale(${scale})`
        node.style.opacity = String(Math.min(1, 0.15 + f * 1.4))
        if (d < best) {
          best = d
          nearest = i
        }
      })
      if (nearest >= 0) setName(SKILLS[nearest].name)
    }

    const tick = () => {
      if (!drag) {
        pan.x += vel.x
        pan.y += vel.y
        vel.x *= 0.92
        vel.y *= 0.92
        // Spring back if the cloud is dragged too far away
        const limit = 110
        pan.x += (Math.max(-limit, Math.min(limit, pan.x)) - pan.x) * 0.15
        pan.y += (Math.max(-limit, Math.min(limit, pan.y)) - pan.y) * 0.15
      }
      layout()
      raf = Math.hypot(vel.x, vel.y) > 0.05 || drag ? requestAnimationFrame(tick) : 0
    }
    const onDown = (e: PointerEvent) => {
      drag = { x: e.clientX, y: e.clientY }
      el.setPointerCapture(e.pointerId)
      raf ||= requestAnimationFrame(tick)
    }
    const onMove = (e: PointerEvent) => {
      if (!drag) return
      vel.x = e.clientX - drag.x
      vel.y = e.clientY - drag.y
      pan.x += vel.x
      pan.y += vel.y
      drag = { x: e.clientX, y: e.clientY }
      if (still) vel.x = vel.y = 0
    }
    const onUp = () => {
      drag = null
      if (still) vel.x = vel.y = 0
    }
    layout()
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
    const ro = new ResizeObserver(layout)
    ro.observe(el)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
    }
  }, [])

  return (
    <div>
      <div
        ref={stage}
        style={{
          position: 'relative',
          height: 440,
          borderRadius: 28,
          overflow: 'hidden',
          touchAction: 'none',
          cursor: 'grab',
          background: 'radial-gradient(120% 90% at 50% 40%, #1c1c1e 0%, #000 70%)',
        }}
        aria-label='Skills, arranged like the Apple Watch app grid. Drag to explore.'
        role='img'
      >
        {SKILLS.map((skill, i) => {
          const Icon = skillIcons[skill.icon]
          return (
            <div
              key={skill.name}
              ref={(node) => {
                nodes.current[i] = node
              }}
              title={skill.name}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: BUBBLE,
                height: BUBBLE,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                background: 'radial-gradient(circle at 30% 25%, #ffffff, #e9e9ee 70%)',
                boxShadow: '0 6px 16px rgba(0,0,0,0.45), inset 0 -2px 6px rgba(0,0,0,0.08)',
                willChange: 'transform',
              }}
            >
              <Icon size={30} style={{ color: skill.brandColor || '#1d1d1f' }} />
            </div>
          )
        })}
      </div>
      <p
        style={{ textAlign: 'center', marginTop: 12, fontSize: 15, fontWeight: 600 }}
        aria-live='polite'
      >
        {name}
      </p>
    </div>
  )
}

// ── Dynamic Island ───────────────────────────────────────────────────────────

type IslandState = 'idle' | 'sending' | 'sent'

const ISLAND: Record<IslandState, { w: number; h: number; r: number }> = {
  idle: { w: 126, h: 37, r: 19 },
  sending: { w: 200, h: 37, r: 19 },
  sent: { w: 350, h: 84, r: 42 },
}

export function DynamicIslandDemo() {
  const [state, setState] = useState<IslandState>('idle')
  const [still, setStill] = useState(false)
  const timers = useRef<number[]>([])

  useEffect(() => setStill(reducedMotion()), [])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const send = () => {
    timers.current.forEach(clearTimeout)
    setState('sending')
    timers.current = [
      window.setTimeout(() => setState('sent'), 1100),
      window.setTimeout(() => setState('idle'), 4200),
    ]
  }

  const size = ISLAND[state]
  return (
    <div style={{ display: 'grid', justifyItems: 'center', gap: 28 }}>
      <div
        style={{
          width: 400,
          maxWidth: '100%',
          height: 230,
          borderRadius: 54,
          padding: 10,
          background: '#1c1c1e',
          boxShadow: '0 24px 60px rgba(0,0,0,0.28), inset 0 0 0 2px #3a3a3c',
        }}
      >
        <div
          style={{
            height: '100%',
            borderRadius: 44,
            paddingTop: 11,
            display: 'grid',
            justifyItems: 'center',
            alignContent: 'start',
            background:
              'linear-gradient(160deg, #0a84ff 0%, #8e5cf5 45%, #ff5a8a 80%, #ff9f33 100%)',
            overflow: 'hidden',
          }}
        >
          <div
            role='status'
            aria-live='polite'
            style={{
              width: size.w,
              height: size.h,
              borderRadius: size.r,
              background: '#000',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: state === 'sent' ? '0 18px' : '0 14px',
              overflow: 'hidden',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.06)',
              // Spring-like overshoot, as Apple animates the island
              transition: still
                ? 'none'
                : 'width .55s cubic-bezier(.34,1.56,.64,1), height .55s cubic-bezier(.34,1.56,.64,1), border-radius .55s ease, padding .3s ease',
            }}
          >
            {state === 'sending' && (
              <>
                <span
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    border: '2px solid #30d158',
                    borderTopColor: 'transparent',
                    animation: 'spin 0.8s linear infinite',
                  }}
                />
                <span style={{ fontSize: 13, fontWeight: 600 }}>Sending…</span>
              </>
            )}
            {state === 'sent' && (
              <>
                <span
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: '#30d158',
                    display: 'grid',
                    placeItems: 'center',
                    flex: 'none',
                  }}
                >
                  <CheckRounded style={{ color: '#000' }} />
                </span>
                <span style={{ display: 'grid', lineHeight: 1.25 }}>
                  <span style={{ fontSize: 15, fontWeight: 600 }}>Message sent</span>
                  <span style={{ fontSize: 13, color: '#a1a1a6' }}>
                    Horus will get back to you soon
                  </span>
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={send}
        style={{
          font: 'inherit',
          fontSize: 15,
          fontWeight: 600,
          color: '#fff',
          background: '#0071e3',
          border: 0,
          borderRadius: 980,
          padding: '12px 26px',
          cursor: 'pointer',
        }}
      >
        Send message
      </button>
      <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
    </div>
  )
}

// ── Apple TV parallax cards ──────────────────────────────────────────────────

const CARD_ART = [
  'linear-gradient(135deg, #0a84ff, #5e5ce6)',
  'linear-gradient(135deg, #ff375f, #ff9f0a)',
  'linear-gradient(135deg, #30d158, #0a84ff)',
]

function TvCard({
  name,
  description,
  tags,
  art,
}: {
  name: string
  description: string
  tags: string[]
  art: string
}) {
  const card = useRef<HTMLAnchorElement>(null)
  const [t, setT] = useState({ x: 0, y: 0, active: false })

  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== 'mouse' || reducedMotion()) return
    const r = card.current!.getBoundingClientRect()
    setT({
      x: (e.clientX - r.left) / r.width - 0.5,
      y: (e.clientY - r.top) / r.height - 0.5,
      active: true,
    })
  }
  const reset = () => setT({ x: 0, y: 0, active: false })
  const lift = t.active ? 1.06 : 1
  // Layers move by different amounts, which reads as depth
  const layer = (depth: number): CSSProperties => ({
    transform: `translate3d(${t.x * depth}px, ${t.y * depth}px, 0)`,
    transition: t.active ? 'transform .08s linear' : 'transform .6s cubic-bezier(.2,.8,.2,1)',
  })

  return (
    <a
      ref={card}
      href='#'
      onClick={(e) => e.preventDefault()}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onFocus={() => setT({ x: 0, y: -0.1, active: true })}
      onBlur={reset}
      style={{
        position: 'relative',
        display: 'block',
        aspectRatio: '16 / 10',
        borderRadius: 22,
        overflow: 'hidden',
        color: '#fff',
        textDecoration: 'none',
        transform: `perspective(900px) rotateX(${-t.y * 10}deg) rotateY(${t.x * 12}deg) scale(${lift})`,
        transition: t.active
          ? 'transform .08s linear, box-shadow .3s'
          : 'transform .6s cubic-bezier(.2,.8,.2,1), box-shadow .6s',
        boxShadow: t.active ? '0 30px 60px rgba(0,0,0,0.35)' : '0 10px 24px rgba(0,0,0,0.18)',
        outlineOffset: 4,
      }}
    >
      <div style={{ position: 'absolute', inset: -20, background: art, ...layer(-14) }} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: 22,
          display: 'grid',
          alignContent: 'end',
          gap: 6,
          ...layer(10),
        }}
      >
        <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em' }}>{name}</span>
        <span style={{ fontSize: 13, opacity: 0.85, lineHeight: 1.4 }}>{description}</span>
      </div>
      <div
        style={{ position: 'absolute', top: 16, left: 18, display: 'flex', gap: 6, ...layer(18) }}
      >
        {tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: '4px 10px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.22)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          >
            {tag}
          </span>
        ))}
      </div>
      {/* The glare: a soft highlight that sits opposite the tilt */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `radial-gradient(circle at ${50 + t.x * 90}% ${30 + t.y * 90}%, rgba(255,255,255,0.45), rgba(255,255,255,0) 55%)`,
          opacity: t.active ? 1 : 0,
          transition: 'opacity .3s',
          mixBlendMode: 'soft-light',
        }}
      />
    </a>
  )
}

export function TvCardsDemo({
  projects,
}: {
  projects: { name: string; description: string; tags: string[] }[]
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 28,
        padding: '20px 4px',
      }}
    >
      {projects.slice(0, 3).map((p, i) => (
        <TvCard key={p.name} {...p} art={CARD_ART[i % CARD_ART.length]} />
      ))}
    </div>
  )
}
