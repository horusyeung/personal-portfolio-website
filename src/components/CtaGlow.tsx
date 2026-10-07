import type { ReactNode } from 'react'
import styles from './CtaGlow.module.css'

/** The existing link supplies semantics and focus; both decorative layers ignore input. */
export default function CtaGlow({ children }: { children: ReactNode }) {
  return <span className={styles.glow}>{children}</span>
}
