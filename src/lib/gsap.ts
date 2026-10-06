import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

// The one place plugins are registered: import GSAP from here, not from 'gsap'
gsap.registerPlugin(ScrollTrigger, useGSAP)

export { gsap, useGSAP }
