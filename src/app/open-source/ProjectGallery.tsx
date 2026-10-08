'use client'

import {
  Suspense,
  ViewTransition,
  startTransition,
  addTransitionType,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import GitHubIcon from '@mui/icons-material/GitHub'
import type { GithubProject } from '@/content/projects'
import ScrollReveal from '@/components/ScrollReveal'
import { gsap } from '@/lib/gsap'
import { FINE_POINTER, useMotionEffect } from '@/lib/motion'
import ProjectSheet, { ProjectStatus, ProjectTags } from './ProjectSheet'
import ProjectSheetController from './ProjectSheetController'
import { parseProjectQuery, projectQueryUrl } from './projectQuery'
import styles from './ProjectGallery.module.css'

const HISTORY_KEY = 'portfolio-project-sheet'
// Browser-lifetime ownership survives SPA remounts; a reload starts a fresh set.
const ownedHistoryEntries = new Set<string>()

function ProjectCard({
  project,
  hidden = false,
  onOpen,
  registerDetails,
}: {
  project: GithubProject
  hidden?: boolean
  onOpen: (id: string) => void
  registerDetails: (id: string, node: HTMLButtonElement | null) => void
}) {
  const cardRef = useRef<HTMLElement>(null)
  const githubUnavailable = project.status === 'Coming Soon'
  const bindDetails = useCallback(
    (node: HTMLButtonElement | null) => {
      if (!hidden) registerDetails(project.name, node)
    },
    [hidden, project.name, registerDetails],
  )

  useMotionEffect(
    () => {
      const card = cardRef.current
      if (!card || hidden) return
      const art = card.querySelector<HTMLElement>('[data-card-art]')
      const text = card.querySelector<HTMLElement>('[data-card-text]')
      const tags = card.querySelector<HTMLElement>('[data-card-tags]')
      const glare = card.querySelector<HTMLElement>('[data-card-glare]')
      if (!art || !text || !tags || !glare) return

      gsap.set(card, { transformPerspective: 1000 })
      const options = { duration: 0.35, ease: 'power2.out' }
      const rotateX = gsap.quickTo(card, 'rotationX', options)
      const rotateY = gsap.quickTo(card, 'rotationY', options)
      const artX = gsap.quickTo(art, 'x', options)
      const artY = gsap.quickTo(art, 'y', options)
      const textX = gsap.quickTo(text, 'x', options)
      const textY = gsap.quickTo(text, 'y', options)
      const tagsX = gsap.quickTo(tags, 'x', options)
      const tagsY = gsap.quickTo(tags, 'y', options)
      const glareX = gsap.quickTo(glare, 'xPercent', options)
      const glareY = gsap.quickTo(glare, 'yPercent', options)
      let frame = 0
      let pointerX = 0
      let pointerY = 0

      const update = () => {
        frame = 0
        const rect = card.getBoundingClientRect()
        const x = Math.max(-0.5, Math.min(0.5, (pointerX - rect.left) / rect.width - 0.5))
        const y = Math.max(-0.5, Math.min(0.5, (pointerY - rect.top) / rect.height - 0.5))
        rotateX(-y * 8)
        rotateY(x * 8)
        artX(-x * 10)
        artY(-y * 10)
        textX(x * 4)
        textY(y * 4)
        tagsX(x * 7)
        tagsY(y * 7)
        glareX(x * 45)
        glareY(y * 45)
      }
      const move = (event: PointerEvent) => {
        if (event.pointerType === 'touch' || event.buttons !== 0) return
        pointerX = event.clientX
        pointerY = event.clientY
        if (!frame) frame = window.requestAnimationFrame(update)
      }
      const leave = () => {
        window.cancelAnimationFrame(frame)
        frame = 0
        rotateX(0)
        rotateY(0)
        artX(0)
        artY(0)
        textX(0)
        textY(0)
        tagsX(0)
        tagsY(0)
        glareX(0)
        glareY(0)
      }
      card.addEventListener('pointermove', move)
      card.addEventListener('pointerleave', leave)
      return () => {
        window.cancelAnimationFrame(frame)
        card.removeEventListener('pointermove', move)
        card.removeEventListener('pointerleave', leave)
      }
    },
    cardRef,
    FINE_POINTER,
  )

  return (
    <div className={styles.cardShell} aria-hidden={hidden || undefined}>
      <article
        ref={cardRef}
        className={styles.card}
        data-testid={`project-${project.name}`}
        data-project-id={project.name}
        data-project-card
      >
        <div className={styles.cardArtwork} data-card-art aria-hidden='true'>
          <GitHubIcon />
          <div className={styles.glare} data-card-glare aria-hidden='true' />
        </div>
        <div className={styles.cardContent}>
          <div data-card-text>
            <div className={styles.headingRow}>
              <h2>{project.name}</h2>
              <ProjectStatus status={project.status} />
            </div>
            <p className={styles.description}>{project.description}</p>
          </div>
          <div data-card-tags>
            <ProjectTags tags={project.tags} />
          </div>
          <div className={styles.cardActions}>
            <button
              ref={bindDetails}
              type='button'
              aria-label={`Details for ${project.name}`}
              disabled={hidden}
              onClick={() => onOpen(project.name)}
            >
              Details <span aria-hidden='true'>↗</span>
            </button>
            <a
              href={githubUnavailable ? undefined : project.url}
              role={githubUnavailable ? 'link' : undefined}
              aria-disabled={githubUnavailable || undefined}
              target='_blank'
              rel='noopener noreferrer'
              aria-label={`GitHub repository for ${project.name}`}
              tabIndex={hidden || githubUnavailable ? -1 : undefined}
            >
              <GitHubIcon aria-hidden='true' />
            </a>
          </div>
        </div>
      </article>
    </div>
  )
}

export default function ProjectGallery({ projects }: { projects: GithubProject[] }) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const activeIdRef = useRef<string | null>(null)
  const detailsRefs = useRef(new Map<string, HTMLButtonElement>())
  const entryCounter = useRef(0)
  const closingId = useRef<string | null>(null)
  const restoreId = useRef<string | null>(null)
  const generation = useRef(0)
  const mounted = useRef(true)
  const focusFrame = useRef(0)
  const validIds = useMemo(() => projects.map((project) => project.name), [projects])
  const activeProject = projects.find((project) => project.name === activeId)

  const registerDetails = useCallback((id: string, node: HTMLButtonElement | null) => {
    if (node) detailsRefs.current.set(id, node)
    else detailsRefs.current.delete(id)
  }, [])

  const applyProject = useCallback((id: string | null) => {
    if (closingId.current && id !== closingId.current) closingId.current = null
    if (id === activeIdRef.current) return
    generation.current += 1
    window.cancelAnimationFrame(focusFrame.current)
    restoreId.current = id === null ? activeIdRef.current : null
    activeIdRef.current = id
    startTransition(() => {
      addTransitionType('project-sheet')
      setActiveId(id)
    })
  }, [])

  const openProject = useCallback(
    (id: string) => {
      if (closingId.current || activeIdRef.current === id) return
      const token = `${Date.now()}-${++entryCounter.current}`
      ownedHistoryEntries.add(token)
      startTransition(() => {
        addTransitionType('project-sheet')
        window.history.pushState({ [HISTORY_KEY]: token }, '', projectQueryUrl(id))
        applyProject(id)
      })
    },
    [applyProject],
  )

  const closeProject = useCallback(() => {
    const id = activeIdRef.current
    if (!id || closingId.current) return
    const token: unknown = window.history.state?.[HISTORY_KEY]
    if (typeof token === 'string' && ownedHistoryEntries.has(token)) {
      closingId.current = id
      window.history.back()
    } else {
      startTransition(() => {
        addTransitionType('project-sheet')
        window.history.replaceState(null, '', projectQueryUrl(null))
        applyProject(null)
      })
    }
  }, [applyProject])

  useLayoutEffect(() => {
    const pathname = window.location.pathname
    const syncProjectFromHistory = () => {
      if (window.location.pathname !== pathname) return
      const query = parseProjectQuery(window.location.search, validIds)
      if (query.invalid) window.history.replaceState(null, '', projectQueryUrl(null))
      applyProject(query.id)
    }
    // Native traversal can leave Next's search context unchanged after an early open.
    window.addEventListener('popstate', syncProjectFromHistory)
    return () => window.removeEventListener('popstate', syncProjectFromHistory)
  }, [applyProject, validIds])

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      generation.current += 1
      window.cancelAnimationFrame(focusFrame.current)
    }
  }, [])

  useLayoutEffect(() => {
    const id = restoreId.current
    if (activeId !== null || !id) return
    const currentGeneration = generation.current
    restoreId.current = null
    // Wait for the browser's transition animations, then find the newly mounted button.
    focusFrame.current = window.requestAnimationFrame(() => {
      focusFrame.current = window.requestAnimationFrame(() => {
        const animations =
          document.getAnimations?.().filter((animation) => {
            const effect = animation.effect
            return (
              typeof KeyframeEffect !== 'undefined' &&
              effect instanceof KeyframeEffect &&
              effect.pseudoElement?.includes('view-transition')
            )
          }) ?? []
        void Promise.allSettled(animations.map((animation) => animation.finished)).then(() => {
          if (
            mounted.current &&
            generation.current === currentGeneration &&
            activeIdRef.current === null
          ) {
            detailsRefs.current.get(id)?.focus({ preventScroll: true })
          }
        })
      })
    })
  }, [activeId])

  return (
    <ViewTransition default='none' update='none'>
      <div className={styles.gallery} data-testid='project-gallery'>
        {projects.map((project) => (
          <ScrollReveal key={project.name} distance={0}>
            {activeId === project.name ? (
              <div className={styles.placeholder}>
                <ProjectCard
                  project={project}
                  hidden
                  onOpen={openProject}
                  registerDetails={registerDetails}
                />
              </div>
            ) : (
              <ViewTransition name={`today-${project.name}`} share='today-morph' default='none'>
                <ProjectCard
                  project={project}
                  onOpen={openProject}
                  registerDetails={registerDetails}
                />
              </ViewTransition>
            )}
          </ScrollReveal>
        ))}
        <Suspense fallback={null}>
          <ProjectSheetController validIds={validIds} onChange={applyProject} />
        </Suspense>
        {activeProject && <ProjectSheet project={activeProject} onClose={closeProject} />}
      </div>
    </ViewTransition>
  )
}
