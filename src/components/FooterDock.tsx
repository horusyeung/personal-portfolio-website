'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import EmailOutlined from '@mui/icons-material/EmailOutlined'
import GitHub from '@mui/icons-material/GitHub'
import LinkedIn from '@mui/icons-material/LinkedIn'
import { EMAIL, SOCIAL_LINKS } from '@/content/site'
import { brandColors } from '@/content/brands'
import { createDockEffect } from '@/lib/dock'
import glass from '@/lib/glass.module.css'
import styles from './FooterDock.module.css'
import MediumIcon from './MediumIcon'

const destinations = [
  {
    label: 'Email',
    href: `mailto:${EMAIL}`,
    external: false,
    icon: <EmailOutlined />,
    color: 'var(--mui-palette-primary-text)',
  },
  {
    ...SOCIAL_LINKS.linkedin,
    href: SOCIAL_LINKS.linkedin.url,
    external: true,
    icon: <LinkedIn />,
    color: brandColors.linkedin,
  },
  {
    ...SOCIAL_LINKS.github,
    href: SOCIAL_LINKS.github.url,
    external: true,
    icon: <GitHub />,
    color: brandColors.monochrome,
  },
  {
    ...SOCIAL_LINKS.medium,
    href: SOCIAL_LINKS.medium.url,
    external: true,
    color: brandColors.monochrome,
    icon: <MediumIcon />,
  },
]

// Match the shared motion policy without pulling GSAP into the global footer bundle.
const dockMotion = '(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)'

export default function FooterDock() {
  const dock = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const element = dock.current
    if (!element) return
    const media = window.matchMedia(dockMotion)
    let cleanup: (() => void) | undefined
    const update = () => {
      cleanup?.()
      cleanup = media.matches ? createDockEffect(element) : undefined
    }
    update()
    media.addEventListener('change', update)
    return () => {
      media.removeEventListener('change', update)
      cleanup?.()
    }
  }, [])

  return (
    <ul ref={dock} aria-label='Connect' className={`${glass.surface} ${styles.dock}`}>
      {destinations.map(({ label, href, external, icon, color }) => (
        <li key={label} className={styles.item}>
          <a
            data-dock-item
            href={href}
            aria-label={label}
            className={styles.link}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            <span
              data-dock-icon
              aria-hidden='true'
              className={styles.icon}
              style={{ '--dock-accent': color } as CSSProperties}
            >
              {icon}
            </span>
            <span aria-hidden='true' className={styles.caption}>
              {label}
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}
