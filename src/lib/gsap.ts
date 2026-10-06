import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

// The one place plugins are registered: import GSAP from here, not from 'gsap'
gsap.registerPlugin(ScrollTrigger, useGSAP)

/** Only pages that split text call this; SplitText never joins the shared initial bundle. */
export async function loadSplitText() {
  const { SplitText } = await import('gsap/SplitText')
  gsap.registerPlugin(SplitText)
  return SplitText
}

export { gsap, useGSAP }
