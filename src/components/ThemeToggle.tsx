'use client'

import { useColorScheme } from '@mui/material/styles'
import styles from './ThemeToggle.module.css'

export default function ThemeToggle() {
  const { mode, systemMode, setMode } = useColorScheme()
  const resolved = mode === 'system' ? systemMode : mode
  const toggle = () => {
    const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const next = resolved === 'dark' ? 'light' : 'dark'
    setMode(next === system ? 'system' : next)
  }

  const control = (scheme: 'light' | 'dark', className = '', inert = false) => {
    const next = scheme === 'dark' ? 'light' : 'dark'
    const label = `Switch to ${next} theme`
    return (
      <button
        key={inert ? scheme : 'resolved'}
        type='button'
        aria-label={label}
        title={label}
        aria-disabled={inert || undefined}
        disabled={inert}
        className={`${styles.button} ${className}`}
        onClick={inert ? undefined : toggle}
      >
        <svg
          className={styles.icon}
          aria-hidden='true'
          focusable='false'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.7'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          {next === 'light' ? (
            <>
              <circle cx='12' cy='12' r='4' />
              <path d='M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42' />
            </>
          ) : (
            <path d='M21 12.79A9 9 0 0 1 11.21 3 9 9 0 1 0 21 12.79Z' />
          )}
        </svg>
        <span>{next === 'light' ? 'Light' : 'Dark'}</span>
      </button>
    )
  }

  return (
    <div className={styles.container}>
      {resolved
        ? control(resolved)
        : // CSS exposes exactly one inert action, matching the system before hydration.
          [control('light', styles.staticLight, true), control('dark', styles.staticDark, true)]}
    </div>
  )
}
