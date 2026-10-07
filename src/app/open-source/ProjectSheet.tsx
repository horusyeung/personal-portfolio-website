'use client'

import { useCallback, useEffect, useId, useRef, ViewTransition } from 'react'
import { createPortal } from 'react-dom'
import Modal from '@mui/material/Modal'
import GitHubIcon from '@mui/icons-material/GitHub'
import type { GithubProject } from '@/content/projects'
import styles from './ProjectGallery.module.css'

export function ProjectStatus({ status }: { status: GithubProject['status'] }) {
  return (
    <span className={styles.status} data-status={status}>
      {status}
    </span>
  )
}

export function ProjectTags({ tags }: { tags: GithubProject['tags'] }) {
  return (
    <ul className={styles.tags}>
      {tags.map((tag) => (
        <li key={tag} className='project-tag'>
          {tag}
        </li>
      ))}
    </ul>
  )
}

export default function ProjectSheet({
  project,
  onClose,
}: {
  project: GithubProject
  onClose: () => void
}) {
  const titleId = useId()
  const descriptionId = useId()
  const githubUnavailable = project.status === 'Coming Soon'
  const modalRef = useRef<HTMLDivElement>(null)
  const sheetRef = useRef<HTMLElement>(null)
  const mounted = useRef(true)
  const revealGeneration = useRef(0)
  const revealFrame = useRef(0)

  const revealCurrentFocus = useCallback(() => {
    if (!mounted.current) return
    const generation = ++revealGeneration.current
    window.cancelAnimationFrame(revealFrame.current)
    const isCurrent = () => mounted.current && revealGeneration.current === generation

    revealFrame.current = window.requestAnimationFrame(() => {
      if (!isCurrent()) return
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
        if (!isCurrent()) return
        // Native transitions restore scroll after their animations finish.
        revealFrame.current = window.requestAnimationFrame(() => {
          if (!isCurrent()) return
          revealFrame.current = window.requestAnimationFrame(() => {
            if (!isCurrent()) return
            const focused = document.activeElement
            const modal = modalRef.current
            if (
              !(focused instanceof HTMLElement) ||
              !sheetRef.current?.contains(focused) ||
              !modal
            ) {
              return
            }
            const bounds = focused.getBoundingClientRect()
            const viewport = modal.getBoundingClientRect()
            if (
              bounds.top < Math.max(0, viewport.top) ||
              bounds.bottom > Math.min(window.innerHeight, viewport.bottom) ||
              bounds.left < Math.max(0, viewport.left) ||
              bounds.right > Math.min(window.innerWidth, viewport.right)
            ) {
              focused.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' })
            }
          })
        })
      })
    })
  }, [])

  useEffect(() => {
    mounted.current = true
    // Also covers reduced motion and browsers without native view transitions.
    revealCurrentFocus()
    return () => {
      mounted.current = false
      revealGeneration.current += 1
      window.cancelAnimationFrame(revealFrame.current)
    }
  }, [project.name, revealCurrentFocus])

  return createPortal(
    <Modal
      ref={modalRef}
      open
      disablePortal
      disableRestoreFocus
      hideBackdrop
      className={styles.modal}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className={styles.sheetFrame} tabIndex={-1}>
        <ViewTransition
          name={`today-${project.name}`}
          share='today-morph'
          default='none'
          onShare={revealCurrentFocus}
          onEnter={revealCurrentFocus}
        >
          <section
            ref={sheetRef}
            className={styles.sheet}
            data-testid='project-sheet'
            role='dialog'
            aria-modal='true'
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
          >
            <div className={styles.sheetArtwork} aria-hidden='true'>
              <GitHubIcon />
            </div>
            <div className={styles.sheetContent}>
              <div className={styles.headingRow}>
                <h2 id={titleId}>{project.name}</h2>
                <ProjectStatus status={project.status} />
              </div>
              <p id={descriptionId} className={styles.description}>
                {project.description}
              </p>
              <ProjectTags tags={project.tags} />
              <div className={styles.sheetActions}>
                <a
                  href={githubUnavailable ? undefined : project.url}
                  role={githubUnavailable ? 'link' : undefined}
                  aria-disabled={githubUnavailable || undefined}
                  tabIndex={githubUnavailable ? -1 : undefined}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <GitHubIcon aria-hidden='true' />
                  View on GitHub
                </a>
                <button type='button' onClick={onClose} autoFocus>
                  Close
                </button>
              </div>
            </div>
          </section>
        </ViewTransition>
      </div>
    </Modal>,
    document.body,
  )
}
