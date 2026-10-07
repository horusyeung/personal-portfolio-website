/** A smooth, symmetric falloff with no influence outside the pointer's neighbourhood. */
export function dockFalloff(distance: number, radius = 92): number {
  if (!Number.isFinite(distance) || !Number.isFinite(radius) || radius <= 0) return 0
  const progress = Math.min(Math.abs(distance) / radius, 1)
  return (Math.cos(progress * Math.PI) + 1) / 2
}

/** Keep layout reads together, then update only the decorative icon layers. */
export function createDockEffect(element: HTMLElement) {
  const links = Array.from(element.querySelectorAll<HTMLAnchorElement>('[data-dock-item]'))
  const icons = links.map((link) => link.querySelector<HTMLElement>('[data-dock-icon]')!)
  let pointerX: number | null = null
  let frame = 0

  const render = () => {
    frame = 0
    const influence = links.map((link) => {
      if (pointerX === null) return 0
      const box = link.getBoundingClientRect()
      return dockFalloff(pointerX - (box.left + box.width / 2))
    })
    icons.forEach((icon, index) => {
      icon.style.setProperty('--dock-scale', String(1 + influence[index] * 0.32))
      icon.style.setProperty('--dock-lift', String(influence[index] * -4))
    })
  }
  const schedule = () => {
    if (!frame) frame = window.requestAnimationFrame(render)
  }
  const move = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return
    pointerX = event.clientX
    schedule()
  }
  const reset = () => {
    pointerX = null
    schedule()
  }

  element.addEventListener('pointermove', move)
  element.addEventListener('pointerleave', reset)
  window.addEventListener('blur', reset)
  window.addEventListener('resize', reset)
  document.addEventListener('visibilitychange', reset)

  return () => {
    window.cancelAnimationFrame(frame)
    element.removeEventListener('pointermove', move)
    element.removeEventListener('pointerleave', reset)
    window.removeEventListener('blur', reset)
    window.removeEventListener('resize', reset)
    document.removeEventListener('visibilitychange', reset)
    icons.forEach((icon) => {
      icon.style.removeProperty('--dock-scale')
      icon.style.removeProperty('--dock-lift')
    })
  }
}
