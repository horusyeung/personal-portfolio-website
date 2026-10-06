/**
 * Entrance animations keep content visible by default. Only while JavaScript is expected to
 * animate the page in do `[data-intro]` elements start hidden and `[data-intro-offset]` elements
 * start shifted (see globals.css). This inline script runs in <head> before the body paints to
 * enable that state. If the app has not taken over within INTRO_FALLBACK_MS (slow or blocked
 * JavaScript), it adds `intro-skip`, which reveals everything and turns entrance animations off.
 */
const INTRO_FALLBACK_MS = 3000

export const introScript = `(function(){var d=document.documentElement;d.classList.add('js');window.__introTimer=setTimeout(function(){d.classList.add('intro-skip')},${INTRO_FALLBACK_MS})})()`
