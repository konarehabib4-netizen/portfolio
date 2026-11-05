import { useEffect, useRef } from 'react'
import { profile } from '../data/profile'

// Commande cachée « matrix » : pluie de caractères verts plein écran.
// S'arrête toute seule après quelques secondes, ou au clic / à une touche.
const DUREE = 9000
const CARACTERES = 'アカサタナハマヤラワ0123456789<>/{}=+*#$'

export default function Matrix({ onQuit }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const vert = getComputedStyle(document.documentElement).getPropertyValue('--green').trim() || '#3ddc84'
    const taille = 16
    const message = ` ${profile.name.toUpperCase()} · DISPONIBLE POUR UN STAGE `
    const e = { colonnes: [], largeur: 0, hauteur: 0, id: 0 } // état de l'animation

    const redim = () => {
      e.largeur = canvas.width = window.innerWidth
      e.hauteur = canvas.height = window.innerHeight
      e.colonnes = Array.from({ length: Math.ceil(e.largeur / taille) }, () => Math.random() * -50)
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, e.largeur, e.hauteur)
    }
    redim()

    const debut = performance.now()
    const pas = () => {
      const t = performance.now() - debut
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'
      ctx.fillRect(0, 0, e.largeur, e.hauteur)
      ctx.font = `${taille}px 'JetBrains Mono', monospace`
      e.colonnes.forEach((y, i) => {
        const car = CARACTERES[Math.floor(Math.random() * CARACTERES.length)]
        ctx.fillStyle = Math.random() > 0.975 ? '#e8fff1' : vert
        ctx.fillText(car, i * taille, y * taille)
        e.colonnes[i] = y * taille > e.hauteur && Math.random() > 0.975 ? 0 : y + 1
      })
      // Après 2 secondes, mon message apparaît au centre
      if (t > 2000) {
        ctx.globalAlpha = Math.min(1, (t - 2000) / 1200)
        ctx.font = `800 ${Math.max(16, Math.min(34, e.largeur / 26))}px 'JetBrains Mono', monospace`
        ctx.textAlign = 'center'
        const l = ctx.measureText(message).width + 30
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)'
        ctx.fillRect((e.largeur - l) / 2, e.hauteur / 2 - 34, l, 60)
        ctx.fillStyle = vert
        ctx.fillText(message, e.largeur / 2, e.hauteur / 2 + 6)
        ctx.textAlign = 'start'
        ctx.globalAlpha = 1
      }
      if (t > DUREE) return onQuit()
      e.id = requestAnimationFrame(pas)
    }
    e.id = requestAnimationFrame(pas)

    // La touche Entrée qui a lancé la commande ne doit pas fermer l'effet aussitôt
    const ouvertA = performance.now()
    const quitter = () => {
      if (performance.now() - ouvertA > 300) onQuit()
    }
    window.addEventListener('resize', redim)
    window.addEventListener('keydown', quitter)
    return () => {
      cancelAnimationFrame(e.id)
      window.removeEventListener('resize', redim)
      window.removeEventListener('keydown', quitter)
    }
  }, [onQuit])

  return <canvas ref={ref} className="matrix" onClick={onQuit} role="img" aria-label="Pluie de caractères façon Matrix" />
}
