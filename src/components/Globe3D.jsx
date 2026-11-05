import { useEffect, useRef } from 'react'
import { profile } from '../data/profile'
import { prefersReducedMotion } from '../helpers'

// Globe 3D dessiné à la main sur un <canvas> (aucune bibliothèque) :
// une sphère de points, deux anneaux en orbite et mes technologies qui tournent autour.
// Il suit la souris, se met en pause quand il n'est plus visible et reste figé
// si le visiteur a demandé « moins d'animations ».

const NB_POINTS = 420
const TECHS = profile.skills.flatMap((g) => g.items).filter((t) => t.length <= 10).slice(0, 10)

// Points répartis régulièrement sur la sphère (spirale de Fibonacci)
const SPHERE = Array.from({ length: NB_POINTS }, (_, i) => {
  const y = 1 - (i / (NB_POINTS - 1)) * 2
  const r = Math.sqrt(1 - y * y)
  const a = i * Math.PI * (3 - Math.sqrt(5))
  return [Math.cos(a) * r, y, Math.sin(a) * r]
})

// Rotation d'un point autour des axes X puis Y
function tourner([x, y, z], ax, ay) {
  const cy = Math.cos(ay), sy = Math.sin(ay)
  const x1 = x * cy + z * sy
  const z1 = -x * sy + z * cy
  const cx = Math.cos(ax), sx = Math.sin(ax)
  return [x1, y * cx - z1 * sx, y * sx + z1 * cx]
}

const couleur = (nom) => getComputedStyle(document.documentElement).getPropertyValue(nom).trim() || '#3ddc84'

export default function Globe3D() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const fige = prefersReducedMotion()
    // Tout ce qui change pendant l'animation est rangé dans un seul objet
    const etat = { largeur: 0, hauteur: 0, visible: true, idAnim: 0, angle: 0.6, souris: { x: 0, y: 0 }, incl: { x: 0, y: 0 } }
    const couleurs = {}

    const lireCouleurs = () => {
      Object.assign(couleurs, { vert: couleur('--green'), cyan: couleur('--cyan'), orange: couleur('--orange'), texte: couleur('--text') })
    }

    const redimensionner = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      etat.largeur = canvas.clientWidth
      etat.hauteur = canvas.clientHeight
      canvas.width = etat.largeur * dpr
      canvas.height = etat.hauteur * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const dessiner = () => {
      ctx.clearRect(0, 0, etat.largeur, etat.hauteur)
      const R = Math.min(etat.largeur, etat.hauteur) * 0.33
      const cx = etat.largeur / 2, cy = etat.hauteur / 2
      const ax = -0.35 + etat.incl.y * 0.35
      const ay = etat.angle + etat.incl.x * 0.5
      // Perspective : plus un point est proche (z grand), plus il est gros
      const projeter = ([x, y, z]) => {
        const p = 2.6 / (2.6 - z)
        return { x: cx + x * R * p, y: cy + y * R * p, z, p }
      }

      // 1. La sphère de points
      ctx.fillStyle = couleurs.vert
      for (const pt of SPHERE) {
        const q = projeter(tourner(pt, ax, ay))
        ctx.globalAlpha = 0.12 + ((q.z + 1) / 2) * 0.75
        ctx.beginPath()
        ctx.arc(q.x, q.y, 1.1 * q.p, 0, Math.PI * 2)
        ctx.fill()
      }

      // 2. Deux anneaux inclinés, chacun avec un « satellite »
      const anneaux = [
        { rayon: 1.28, incl: 1.15, vitesse: 1, teinte: couleurs.cyan },
        { rayon: 1.45, incl: -0.75, vitesse: -0.7, teinte: couleurs.orange },
      ]
      for (const a of anneaux) {
        const pointAnneau = (t) => tourner(tourner([Math.cos(t) * a.rayon, 0, Math.sin(t) * a.rayon], a.incl, 0), ax, ay)
        ctx.strokeStyle = a.teinte
        ctx.lineWidth = 1
        for (let i = 0; i < 96; i++) {
          const p1 = projeter(pointAnneau((i / 96) * Math.PI * 2))
          const p2 = projeter(pointAnneau(((i + 1) / 96) * Math.PI * 2))
          ctx.globalAlpha = 0.08 + ((p1.z + 1.6) / 3.2) * 0.45
          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.stroke()
        }
        const s = projeter(pointAnneau(etat.angle * 2.2 * a.vitesse))
        ctx.globalAlpha = 1
        ctx.fillStyle = a.teinte
        ctx.shadowColor = a.teinte
        ctx.shadowBlur = 14
        ctx.beginPath()
        ctx.arc(s.x, s.y, 3.2 * s.p, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      }

      // 3. Mes technologies en orbite (celles de l'arrière sont estompées)
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      TECHS.forEach((tech, i) => {
        const t = (i / TECHS.length) * Math.PI * 2 - etat.angle * 0.8
        const q = projeter(tourner([Math.cos(t) * 1.15, Math.sin(i * 1.7) * 0.5, Math.sin(t) * 1.15], ax, ay))
        ctx.globalAlpha = Math.max(0.1, (q.z + 1) / 2)
        ctx.fillStyle = q.z > 0 ? couleurs.texte : couleurs.vert
        ctx.font = `600 ${Math.round(11 * q.p)}px 'JetBrains Mono', monospace`
        ctx.fillText(tech, q.x, q.y)
      })
      ctx.globalAlpha = 1
    }

    const boucle = () => {
      etat.angle += 0.0035
      // La souris incline le globe en douceur
      etat.incl.x += (etat.souris.x - etat.incl.x) * 0.05
      etat.incl.y += (etat.souris.y - etat.incl.y) * 0.05
      dessiner()
      etat.idAnim = etat.visible && !document.hidden ? requestAnimationFrame(boucle) : 0
    }
    const relancer = () => {
      if (!fige && !etat.idAnim && etat.visible && !document.hidden) etat.idAnim = requestAnimationFrame(boucle)
    }

    const surSouris = (e) => {
      etat.souris = { x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 }
    }
    const surRedim = () => {
      redimensionner()
      dessiner()
    }

    lireCouleurs()
    redimensionner()
    dessiner()
    relancer()

    // Pause quand le globe sort de l'écran
    const observateur = new IntersectionObserver(([e]) => {
      etat.visible = e.isIntersecting
      relancer()
    })
    observateur.observe(canvas)
    // Nouvelles couleurs quand on change de thème clair / sombre
    const surTheme = new MutationObserver(() => {
      lireCouleurs()
      dessiner()
    })
    surTheme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    window.addEventListener('resize', surRedim)
    window.addEventListener('pointermove', surSouris, { passive: true })
    document.addEventListener('visibilitychange', relancer)
    // La police du code peut arriver après le premier dessin
    document.fonts?.ready.then(dessiner)

    return () => {
      cancelAnimationFrame(etat.idAnim)
      observateur.disconnect()
      surTheme.disconnect()
      window.removeEventListener('resize', surRedim)
      window.removeEventListener('pointermove', surSouris)
      document.removeEventListener('visibilitychange', relancer)
    }
  }, [])

  return <canvas ref={ref} className="globe-3d" aria-hidden="true" />
}
