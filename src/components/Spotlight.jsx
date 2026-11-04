import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../helpers'

// Halo lumineux qui suit la souris (désactivé sur écran tactile).
export default function Spotlight() {
  const ref = useRef(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    if (!fine || prefersReducedMotion()) return
    const onMove = (e) => {
      const el = ref.current
      if (!el) return
      el.style.setProperty('--x', `${e.clientX}px`)
      el.style.setProperty('--y', `${e.clientY}px`)
      el.classList.add('on')
    }
    const onLeave = () => ref.current?.classList.remove('on')
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <div ref={ref} className="spotlight" aria-hidden="true" />
}
