'use client'

import { useEffect, useRef, useState } from 'react'
import CheckRounded from '@mui/icons-material/CheckRounded'
import CloseRounded from '@mui/icons-material/CloseRounded'
import ErrorOutlineRounded from '@mui/icons-material/ErrorOutlineRounded'
import { CONTACT_SEND_ERROR } from '@/lib/contact'
import glassStyles from '@/lib/glass.module.css'
import styles from './ContactEffects.module.css'

export type ContactStatus = 'idle' | 'sending' | 'success' | 'error'

const widths = { idle: 126, sending: 220, success: 420, error: 440 }

export default function ContactFeedback({ status }: { status: ContactStatus }) {
  const [dismissed, setDismissed] = useState(false)
  const [inline, setInline] = useState(false)
  const islandRef = useRef<HTMLDivElement>(null)
  const lastExternalFocus = useRef<HTMLElement | null>(null)
  const visible = status !== 'idle' && !dismissed
  const announcement = !visible
    ? ''
    : status === 'sending'
      ? 'Sending…'
      : status === 'success'
        ? 'Message sent. Horus will get back to you soon'
        : CONTACT_SEND_ERROR

  useEffect(() => {
    setDismissed(false)
  }, [status])

  useEffect(() => {
    const rememberFocus = () => {
      const active = document.activeElement
      if (
        active instanceof HTMLElement &&
        active !== document.body &&
        !islandRef.current?.contains(active)
      ) {
        lastExternalFocus.current = active
      }
    }
    rememberFocus()
    document.addEventListener('focusin', rememberFocus)
    return () => document.removeEventListener('focusin', rememberFocus)
  }, [])

  useEffect(() => {
    const island = islandRef.current
    if (!visible || !island) return
    let frame = 0

    const measure = () => {
      frame = 0
      const viewport = window.visualViewport
      const viewportTop = viewport?.offsetTop ?? 0
      const viewportBottom = viewportTop + (viewport?.height ?? window.innerHeight)
      const nav = document.querySelector('[data-testid="navbar"]')
      const top = Math.max(60, (nav?.getBoundingClientRect().bottom ?? 48) + 12)
      island.style.setProperty('--contact-island-top', `${top}px`)
      const width = Math.min(widths[status], window.innerWidth - 32)
      const left = (window.innerWidth - width) / 2
      const bottom = top + island.getBoundingClientRect().height
      const active = document.activeElement
      const focusIsInside = active instanceof HTMLElement && island.contains(active)
      const bounds =
        active instanceof HTMLElement && active !== document.body && !focusIsInside
          ? active.getBoundingClientRect()
          : null
      const overlaps = Boolean(
        bounds &&
        bounds.top < bottom + 8 &&
        bounds.bottom > top - 8 &&
        bounds.left < left + width + 8 &&
        bounds.right > left - 8,
      )
      // A normal-flow mirror cannot cover a field, even with a short keyboard viewport.
      const cannotFit = top < viewportTop || bottom + 16 > viewportBottom
      if (!focusIsInside) setInline(cannotFit || overlaps)
    }
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(measure)
    }
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule)
    observer?.observe(island)
    schedule()
    document.addEventListener('focusin', schedule)
    window.addEventListener('scroll', schedule, true)
    window.addEventListener('resize', schedule)
    window.visualViewport?.addEventListener('resize', schedule)
    window.visualViewport?.addEventListener('scroll', schedule)
    return () => {
      observer?.disconnect()
      window.cancelAnimationFrame(frame)
      document.removeEventListener('focusin', schedule)
      window.removeEventListener('scroll', schedule, true)
      window.removeEventListener('resize', schedule)
      window.visualViewport?.removeEventListener('resize', schedule)
      window.visualViewport?.removeEventListener('scroll', schedule)
    }
  }, [status, visible])

  const dismiss = () => {
    const restore = islandRef.current?.contains(document.activeElement)
    setDismissed(true)
    if (restore && lastExternalFocus.current?.isConnected) {
      lastExternalFocus.current.focus({ preventScroll: true })
    }
  }

  return (
    <>
      <div
        className={styles.liveRegion}
        data-testid='contact-status'
        role='status'
        aria-live='polite'
        aria-atomic='true'
      >
        {announcement}
      </div>
      <div className={styles.feedbackSlot} data-inline={inline} data-visible={visible}>
        <div
          ref={islandRef}
          className={`${glassStyles.surface} ${styles.island}`}
          data-testid='contact-island'
          data-state={status}
          data-inline={inline}
          data-visible={visible}
          aria-hidden={!visible || undefined}
          inert={!visible}
        >
          <div className={styles.mirror} aria-hidden='true'>
            <span className={styles.stateIcon}>
              {status === 'sending' && <span className={styles.sendingIcon} />}
              {status === 'success' && <CheckRounded />}
              {status === 'error' && <ErrorOutlineRounded />}
            </span>
            <div className={styles.message}>
              {status === 'sending' && <strong>Sending…</strong>}
              {status === 'success' && (
                <>
                  <strong>Message sent</strong>
                  <span>Horus will get back to you soon</span>
                </>
              )}
              {status === 'error' && <span>{CONTACT_SEND_ERROR}</span>}
            </div>
          </div>
          <button
            type='button'
            className={styles.close}
            aria-label='Close'
            disabled={!visible}
            onClick={dismiss}
          >
            <CloseRounded aria-hidden='true' />
          </button>
        </div>
      </div>
    </>
  )
}
