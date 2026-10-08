'use client'

import { useEffect, useId, useRef, type CSSProperties, type ComponentType } from 'react'
import { FaSlack } from 'react-icons/fa6'
import { SiGithub } from 'react-icons/si'
import CommitOutlined from '@mui/icons-material/CommitOutlined'
import { skillCategories } from '@/content/skills'
import { skillIcons } from '@/lib/skillIcons'
import { storyScenarios, type StoryScenario } from './systemStoryModel'
import type { SystemStoryController } from './SystemStoryMotion'
import styles from './SystemStory.module.css'

const skills = skillCategories.flatMap((category) => category.skills)
const workflowBrands: Record<
  string,
  { Icon: ComponentType; brandColor?: string; darkBrandColor?: string }
> = {
  Slack: { Icon: FaSlack, brandColor: '#4A154B', darkBrandColor: '#ffffff' },
  Husky: { Icon: CommitOutlined },
  GitHub: { Icon: SiGithub },
}
const brands: typeof workflowBrands = {
  ...Object.fromEntries(
    skills.map((skill) => [
      skill.name,
      {
        Icon: skillIcons[skill.icon],
        brandColor: skill.brandColor,
        darkBrandColor: skill.darkBrandColor,
      },
    ]),
  ),
  ...workflowBrands,
}

function Brand({ name, small = false }: { name: string; small?: boolean }) {
  const definition = brands[name]
  const Icon = definition?.Icon
  if (!Icon) return null
  const brand = definition.brandColor
  return (
    <li
      className={`${styles.brand}${small ? ` ${styles.smallBrand}` : ''}`}
      data-system-skill={name}
      style={
        {
          '--brand': brand ?? 'var(--mui-palette-text-primary)',
          '--brand-dark': definition.darkBrandColor ?? brand ?? 'var(--mui-palette-text-primary)',
        } as CSSProperties
      }
    >
      <span className={styles.icon} aria-hidden='true'>
        <Icon />
      </span>
      <span className={styles.name}>{name}</span>
    </li>
  )
}

function Routes({ scenario, id }: { scenario: StoryScenario; id: string }) {
  return (
    <>
      {(['desktop', 'mobile'] as const).map((layout) => (
        <svg
          key={layout}
          className={`${styles.routes} ${styles[layout]}`}
          data-system-layout={layout}
          viewBox={
            layout === 'desktop'
              ? `0 0 720 ${scenario.expanded ? 496 : 368}`
              : `0 0 300 ${scenario.expanded ? 520 : 440}`
          }
          preserveAspectRatio='none'
          aria-hidden='true'
          focusable='false'
        >
          <defs>
            <marker
              id={`${id}-${layout}-arrow`}
              viewBox='0 0 6 6'
              refX='6'
              refY='3'
              markerWidth='6'
              markerHeight='6'
              markerUnits='userSpaceOnUse'
              orient='auto'
            >
              <path className={styles.arrow} d='M0 0 L6 3 L0 6 Z' />
            </marker>
          </defs>
          {scenario.edges.map((edge) => (
            <path
              key={`${edge.from}-${edge.to}`}
              className={styles.edge}
              d={edge[layout].path}
              markerEnd={`url(#${id}-${layout}-arrow)`}
              data-system-edge={`${edge.from}-${edge.to}`}
              data-from={edge.from}
              data-to={edge.to}
              data-kind={edge.kind}
            />
          ))}
        </svg>
      ))}
      {scenario.edges.map((edge) => (
        <span
          key={`${edge.from}-${edge.to}`}
          className={styles.edgeLabel}
          aria-hidden='true'
          style={
            {
              '--edge-x': `${edge.desktop.x}%`,
              '--edge-y': `${edge.desktop.y}px`,
              '--edge-mobile-x': `${edge.mobile.x}%`,
              '--edge-mobile-y': `${edge.mobile.y}px`,
            } as CSSProperties
          }
        >
          {edge.label}
        </span>
      ))}
    </>
  )
}

/** A complete static figure; only its optional motion controller is deferred. */
export default function SystemStory() {
  const ref = useRef<HTMLElement>(null)
  const uniqueId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const captionId = `${uniqueId}-caption`

  useEffect(() => {
    const figure = ref.current
    if (!figure) return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    let disposed = false
    let loading = false
    let near = false
    let controller: SystemStoryController | undefined

    const load = async () => {
      if (disposed || loading || controller || !near || media.matches) return
      loading = true
      try {
        const { createSystemStory } = await import('./SystemStoryMotion')
        if (!disposed) controller = createSystemStory(figure)
      } catch {
        // An optional chunk failure leaves the server-rendered figure complete.
      } finally {
        loading = false
      }
    }
    const preference = () => {
      if (!media.matches) void load()
    }
    const observer =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(
            ([entry]) => {
              near = entry.isIntersecting
              if (near) void load()
            },
            { rootMargin: '240px' },
          )
    if (observer) observer.observe(figure)
    else {
      near = true
      void load()
    }
    media.addEventListener('change', preference)
    return () => {
      disposed = true
      observer?.disconnect()
      media.removeEventListener('change', preference)
      controller?.destroy()
    }
  }, [])

  return (
    <figure
      ref={ref}
      className={styles.story}
      aria-labelledby={captionId}
      data-testid='system-story'
      data-phase='static'
      data-ready='false'
      data-play-count='0'
    >
      <fieldset className={styles.choices}>
        <legend className={styles.legend}>Architecture scenario</legend>
        {storyScenarios.map((scenario) => (
          <label className={styles.choice} key={scenario.id}>
            <input
              type='radio'
              name={`${uniqueId}-scenario`}
              value={scenario.id}
              defaultChecked={scenario.id === 'microservices'}
              data-system-choice={scenario.id}
            />
            <span>{scenario.title}</span>
          </label>
        ))}
      </fieldset>

      {storyScenarios.map((scenario) => (
        <div
          className={styles.panel}
          key={scenario.id}
          data-system-scenario={scenario.id}
          role='group'
          aria-label={`${scenario.title} illustrative architecture`}
        >
          <div
            className={`${styles.stage}${scenario.expanded ? ` ${styles.expanded}` : ''}`}
            data-system-stage
          >
            <Routes scenario={scenario} id={`${uniqueId}-${scenario.id}`} />
            {scenario.nodes.map((node) => (
              <div
                className={`${styles.group}${node.desktop ? ` ${styles.placed}` : ''}`}
                data-system-group={node.id}
                key={node.id}
                style={
                  node.desktop && node.mobile
                    ? ({
                        '--node-column': `${node.desktop[0]} / span ${node.desktop[2] ?? 1}`,
                        '--node-row': node.desktop[1],
                        '--node-mobile-column': `${node.mobile[0]} / span ${node.mobile[2] ?? 1}`,
                        '--node-mobile-row': node.mobile[1],
                      } as CSSProperties)
                    : undefined
                }
              >
                <h3 className={styles.title}>{node.title}</h3>
                <div className={node.alternatives ? styles.clientOptions : undefined}>
                  {node.skills.length > 0 && (
                    <ul className={styles.brands}>
                      {node.skills.map((name) => (
                        <Brand key={name} name={name} />
                      ))}
                    </ul>
                  )}
                  {node.alternatives && (
                    <div className={styles.alternatives}>
                      <span className={styles.alternativeLabel}>Native alternatives</span>
                      <ul className={styles.brands}>
                        {node.alternatives.map((name) => (
                          <Brand key={name} name={name} small />
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                {node.note && <p className={styles.note}>{node.note}</p>}
              </div>
            ))}
          </div>
          <p className={styles.description}>{scenario.description}</p>
          {scenario.tools && (
            <div className={styles.agentTools} role='group' aria-label='Agent tooling'>
              <span>Agent tooling</span>
              <ul className={styles.brands}>
                {scenario.tools.map((name) => (
                  <Brand name={name} key={name} />
                ))}
              </ul>
            </div>
          )}
          {scenario.testing && (
            <section className={styles.testing} aria-label='Testing checkpoints'>
              <h4>Testing checkpoints</h4>
              <dl>
                {scenario.testing.map((checkpoint) => (
                  <div key={checkpoint.title}>
                    <dt>{checkpoint.title}</dt>
                    <dd>{checkpoint.description}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </div>
      ))}

      <figcaption className={styles.caption} id={captionId}>
        <span>Illustrative flows using technologies I work with.</span>
        <button
          type='button'
          className={styles.replay}
          aria-label='Replay system story'
          data-testid='system-story-replay'
          disabled
        >
          <svg viewBox='0 0 20 20' aria-hidden='true' focusable='false'>
            <path d='M4.5 7A6 6 0 1 1 4 12M4.5 3.5V7H8' />
          </svg>
          Replay
        </button>
      </figcaption>
    </figure>
  )
}
