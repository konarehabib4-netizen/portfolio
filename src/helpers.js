// Fonctions utilitaires (pas de composants ici).
const TODO = '[À COMPLÉTER'

// Vrai si le texte est encore un emplacement à compléter.
export const isTodo = (value) => typeof value === 'string' && value.includes(TODO)

// "Awa Koné" -> "AK"
export const initials = (name) =>
  isTodo(name)
    ? '?'
    : name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join('')

// "Projet APP : prévention" -> "projet-app-prevention"
export const slugify = (text) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

// Faux identifiant de commit git (7 caractères), toujours le même pour un texte donné.
export const shortHash = (text) => {
  let h = 2166136261
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0).toString(16).padStart(8, '0').slice(0, 7)
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
