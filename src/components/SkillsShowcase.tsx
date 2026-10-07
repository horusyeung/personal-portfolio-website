'use client'

import { useEffect, useId, useRef, type CSSProperties, type PointerEvent } from 'react'
import { skillCategories } from '@/content/skills'
import { skillIcons } from '@/lib/skillIcons'
import styles from './SkillsShowcase.module.css'

const SPOTLIGHT_MEDIA =
  '(min-width: 900px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'

const categoryAccents = [
  '#526eff',
  '#a05cf6',
  '#078dba',
  '#df7139',
  '#288e72',
  '#d64d86',
  '#7375df',
  '#ba8a2f',
  '#4f97ac',
]

export default function SkillsShowcase() {
  const id = useId()
  const ref = useRef<HTMLDivElement>(null)
  const spotlightMedia = useRef<MediaQueryList | null>(null)

  useEffect(() => {
    const media = window.matchMedia(SPOTLIGHT_MEDIA)
    spotlightMedia.current = media
    const resetInactiveSpotlights = () => {
      if (media.matches) return
      ref.current?.querySelectorAll<HTMLElement>('[data-skill-category]').forEach((card) => {
        card.style.removeProperty('--spot-x')
        card.style.removeProperty('--spot-y')
      })
    }
    media.addEventListener('change', resetInactiveSpotlights)
    return () => {
      media.removeEventListener('change', resetInactiveSpotlights)
      spotlightMedia.current = null
    }
  }, [])

  const trackSpotlight = (event: PointerEvent<HTMLElement>) => {
    if (
      !spotlightMedia.current?.matches ||
      (event.pointerType !== 'mouse' && event.pointerType !== 'pen') ||
      event.buttons !== 0
    )
      return
    const card = event.currentTarget
    const bounds = card.getBoundingClientRect()
    card.style.setProperty('--spot-x', `${event.clientX - bounds.left}px`)
    card.style.setProperty('--spot-y', `${event.clientY - bounds.top}px`)
  }

  return (
    <div className={styles.showcase} ref={ref} data-testid='skills-showcase'>
      {skillCategories.map((category, index) => {
        const headingId = `${id}-category-${index}`
        return (
          <section
            key={category.title}
            className={`${styles.category}${category.skills.length > 7 ? ` ${styles.wide}` : ''}`}
            aria-labelledby={headingId}
            data-skill-category={category.title}
            style={{ '--category-accent': categoryAccents[index] } as CSSProperties}
            onPointerMove={trackSpotlight}
          >
            <div className={styles.heading}>
              <span className={styles.number} aria-hidden='true'>
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className={styles.title} id={headingId}>
                {category.title}
              </h3>
            </div>
            <ul className={styles.skills}>
              {category.skills.map((skill) => {
                const Icon = skillIcons[skill.icon]
                return (
                  <li
                    className={styles.skill}
                    key={skill.name}
                    data-skill-name={skill.name}
                    style={
                      {
                        '--skill-brand': skill.brandColor || 'var(--mui-palette-text-primary)',
                      } as CSSProperties
                    }
                  >
                    <span className={styles.icon} aria-hidden='true'>
                      <Icon size={24} />
                    </span>
                    <span className={styles.name}>{skill.name}</span>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
