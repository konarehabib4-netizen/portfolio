import { useCallback, useEffect, useRef, useState } from 'react'
import { profile } from '../data/profile'

// Mini-jeu caché (commande « jouer ») : un jeu de plateforme original.
// Un petit développeur court, saute, ramasse mes technologies, écrase des bugs
// et doit atteindre le drapeau « Stage décroché ».
// Clavier : ← → (ou Q D / A D) pour courir, Espace / ↑ / Z / W pour sauter,
// P = pause, Échap = quitter. Téléphone : boutons à l'écran.

const T = 24 // taille d'une case, en pixels « logiques »
const VUE_L = 480 // largeur visible
const LIGNES = 11
const VUE_H = LIGNES * T
const GRAVITE = 0.55
const VITESSE = 2.6
const SAUT = -9.6
const VIES = 3
const TECHS = profile.skills.flatMap((g) => g.items)

// --- Le niveau, construit case par case -------------------------------------
// # sol · = plateforme · C bloc de code (donne une techno) · B bloc vidé · o techno
function construireNiveau() {
  const L = 112
  const g = Array.from({ length: LIGNES }, () => Array(L).fill('.'))
  const sol = (a, b) => {
    for (let x = a; x <= b; x++) g[9][x] = g[10][x] = '#'
  }
  const bloc = (x, y, n, c = '=') => {
    for (let i = 0; i < n; i++) g[y][x + i] = c
  }
  const pieces = (x, y, n) => {
    for (let i = 0; i < n; i++) g[y][x + i] = 'o'
  }
  const escalier = (x, h, sens = 1) => {
    for (let i = 0; i < h; i++) for (let j = 0; j <= i; j++) g[8 - j][x + (sens > 0 ? i : h - 1 - i)] = '#'
  }

  sol(0, 24); sol(28, 50); sol(54, 70); sol(73, L - 1)
  pieces(5, 7, 3)
  bloc(10, 6, 4); pieces(10, 5, 4)
  bloc(16, 5, 1, 'C'); bloc(17, 5, 1, '='); bloc(18, 5, 1, 'C')
  escalier(22, 3) // finit au bord du premier trou
  pieces(25, 5, 3) // au-dessus du premier trou
  bloc(31, 6, 3); bloc(36, 4, 3); pieces(36, 3, 3)
  bloc(42, 5, 1, 'C')
  escalier(47, 4)
  pieces(51, 4, 3)
  bloc(57, 6, 2); bloc(61, 4, 4); pieces(61, 3, 4); bloc(66, 6, 1, 'C')
  pieces(71, 6, 2)
  bloc(77, 5, 5); pieces(77, 4, 5)
  bloc(85, 6, 1, 'C'); bloc(86, 6, 1, '='); bloc(87, 6, 1, 'C'); bloc(86, 3, 1, 'C')
  escalier(93, 5)
  pieces(99, 5, 3)
  const drapeau = 106

  const ennemis = [18, 34, 44, 60, 66, 80, 89, 101].map((x) => ({ x: x * T, y: 8 * T + 10, vx: -0.6, w: 18, h: 14, mort: 0 }))
  return { g, L, drapeau, ennemis }
}

const solide = (c) => c === '#' || c === '=' || c === 'C' || c === 'B'
const couleur = (nom) => getComputedStyle(document.documentElement).getPropertyValue(nom).trim()

// Nombre de technologies à ramasser (jetons + blocs de code)
const compterTotal = (grille) => grille.flat().filter((c) => c === 'o' || c === 'C').length

function partieNeuve() {
  const niveau = construireNiveau()
  return {
    ...niveau,
    total: compterTotal(niveau.g),
    joueur: { x: 2 * T, y: 7 * T, vx: 0, vy: 0, w: 16, h: 22, sol: false, coyote: 0, tampon: 0, sens: 1, pas: 0, invincible: 0 },
    camera: 0,
    sur: { x: 2 * T, y: 9 * T - 22 }, // dernier endroit sûr
    ramasses: 0,
    vies: VIES,
    textes: [], // petits textes flottants « +React »
    temps: 0,
    gagne: false,
  }
}

export default function Plateforme({ onQuit }) {
  const canvasRef = useRef(null)
  // État du jeu (modifié 60 fois par seconde) : gardé dans une ref, pas dans le state React
  const jeu = useRef(null)
  if (jeu.current === null) jeu.current = partieNeuve()
  // En développement seulement : accès à l'état du jeu depuis la console (tests)
  if (import.meta.env.DEV) window.__devrun = jeu
  const touches = useRef({ gauche: false, droite: false, saut: false })
  const [statut, setStatut] = useState('pret') // pret | joue | pause | perdu | gagne
  const [hud, setHud] = useState(() => ({ ramasses: 0, total: compterTotal(construireNiveau().g), vies: VIES }))
  const statutRef = useRef(statut)
  useEffect(() => {
    statutRef.current = statut
  }, [statut])

  const majHud = () => {
    const g = jeu.current
    setHud({ ramasses: g.ramasses, total: g.total, vies: g.vies })
  }

  const demarrer = useCallback(() => {
    if (statutRef.current !== 'pause') {
      jeu.current = partieNeuve()
      setHud({ ramasses: 0, total: jeu.current.total, vies: VIES })
    }
    setStatut('joue')
  }, [])

  // --- Un pas de simulation (1/60 s) ---------------------------------------
  const pas = () => {
    const g = jeu.current
    const j = g.joueur
    const k = touches.current
    g.temps++

    // Course : accélération douce, freinage au sol
    const cible = (k.droite ? VITESSE : 0) - (k.gauche ? VITESSE : 0)
    j.vx += (cible - j.vx) * (j.sol ? 0.25 : 0.12)
    if (cible) j.sens = Math.sign(cible)

    // Saut : petite marge après le bord (coyote) et mémoire de l'appui (tampon)
    j.coyote = j.sol ? 6 : j.coyote - 1
    j.tampon = k.sautAppuye ? 6 : j.tampon - 1
    k.sautAppuye = false
    if (j.tampon > 0 && j.coyote > 0) {
      j.vy = SAUT
      j.tampon = 0
      j.coyote = 0
    }
    if (!k.saut && j.vy < -3) j.vy = -3 // relâcher tôt = petit saut
    j.vy = Math.min(j.vy + GRAVITE, 11)

    deplacer(g, j, j.vx, 0)
    j.sol = false
    deplacer(g, j, 0, j.vy)
    if (j.x < 0) j.x = 0
    // Dernier endroit sûr : les deux pieds sur du solide (pour revenir après une chute)
    const sousPieds = Math.floor((j.y + j.h + 1) / T)
    if (j.sol && solide(g.g[sousPieds]?.[Math.floor(j.x / T)]) && solide(g.g[sousPieds]?.[Math.floor((j.x + j.w - 1) / T)])) {
      g.sur = { x: j.x, y: j.y }
    }
    j.pas = j.sol && Math.abs(j.vx) > 0.3 ? j.pas + Math.abs(j.vx) : 0
    if (j.invincible > 0) j.invincible--

    // Technologies ramassées
    const cases = casesTouchees(j)
    for (const [cx, cy] of cases) {
      if (g.g[cy]?.[cx] === 'o') {
        g.g[cy][cx] = '.'
        ramasser(g, cx * T + T / 2, cy * T)
      }
    }

    // Ennemis
    for (const e of g.ennemis) {
      if (e.mort) {
        e.mort += 1 // animation d'écrasement
        continue
      }
      e.vy = Math.min((e.vy || 0) + GRAVITE, 10)
      const avant = e.x
      e.x += e.vx
      if (toucheMur(g, e)) {
        e.x = avant
        e.vx = -e.vx
      }
      e.y += e.vy
      const sous = Math.floor((e.y + e.h) / T)
      if (solide(g.g[sous]?.[Math.floor((e.x + e.w / 2) / T)])) {
        e.y = sous * T - e.h
        e.vy = 0
        // Demi-tour au bord d'une plateforme
        const devant = Math.floor((e.vx > 0 ? e.x + e.w + 1 : e.x - 1) / T)
        if (!solide(g.g[sous]?.[devant])) e.vx = -e.vx
      }
      if (e.y > VUE_H + 40) e.mort = 1
      // Collision avec le joueur
      if (j.x < e.x + e.w && j.x + j.w > e.x && j.y < e.y + e.h && j.y + j.h > e.y) {
        if (j.vy > 0 && j.y + j.h - e.y < 12) {
          e.mort = 1
          j.vy = -6.5
          g.textes.push({ x: e.x + e.w / 2, y: e.y, texte: 'bug corrigé ✔', vie: 50, couleur: 'green' })
        } else if (!j.invincible) {
          blesser(g)
        }
      }
    }

    // Chute dans un trou
    if (j.y > VUE_H + 30) blesser(g, true)

    // Drapeau
    if (j.x + j.w > g.drapeau * T + 8 && !g.gagne) {
      g.gagne = true
      setStatut('gagne')
    }

    g.textes = g.textes.filter((t) => --t.vie > 0)
    g.camera = Math.max(0, Math.min(j.x - VUE_L * 0.4, g.L * T - VUE_L))
  }

  const ramasser = (g, x, y) => {
    const tech = TECHS[g.ramasses % TECHS.length]
    g.ramasses++
    g.textes.push({ x, y, texte: `+${tech}`, vie: 45, couleur: 'cyan' })
    majHud()
  }

  const blesser = (g, chute = false) => {
    g.vies--
    majHud()
    if (g.vies <= 0) {
      setStatut('perdu')
      return
    }
    const j = g.joueur
    if (chute) {
      // On repart du dernier endroit sûr, immobile
      j.x = g.sur.x
      j.y = g.sur.y
      j.vx = j.vy = 0
    } else {
      j.vy = -6
      j.vx = -j.sens * 3
    }
    j.invincible = 90
  }

  // Déplacement case par case avec collisions (axe X puis axe Y)
  function deplacer(g, j, dx, dy) {
    j.x += dx
    j.y += dy
    for (const [cx, cy] of casesTouchees(j)) {
      const c = g.g[cy]?.[cx]
      if (!solide(c)) continue
      if (dx > 0) j.x = cx * T - j.w
      if (dx < 0) j.x = (cx + 1) * T
      if (dy > 0) {
        j.y = cy * T - j.h
        j.vy = 0
        j.sol = true
      }
      if (dy < 0) {
        j.y = (cy + 1) * T
        j.vy = 0
        if (c === 'C') {
          g.g[cy][cx] = 'B' // bloc de code ouvert : une techno en sort
          ramasser(g, cx * T + T / 2, cy * T - 4)
        }
      }
    }
  }
  const casesTouchees = (o) => {
    const r = []
    for (let cy = Math.floor(o.y / T); cy <= Math.floor((o.y + o.h - 0.01) / T); cy++)
      for (let cx = Math.floor(o.x / T); cx <= Math.floor((o.x + o.w - 0.01) / T); cx++) r.push([cx, cy])
    return r
  }
  const toucheMur = (g, o) => casesTouchees(o).some(([cx, cy]) => solide(g.g[cy]?.[cx]))

  // --- Dessin --------------------------------------------------------------
  const dessiner = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const echelle = (canvas.clientWidth * dpr) / VUE_L
    const largeurPx = Math.round(VUE_L * echelle), hauteurPx = Math.round(VUE_H * echelle)
    if (canvas.width !== largeurPx) {
      canvas.width = largeurPx
      canvas.height = hauteurPx
    }
    ctx.setTransform(echelle, 0, 0, echelle, 0, 0)
    const C = {
      fond: couleur('--bg'), surface: couleur('--surface-2'), bord: couleur('--border'), barre: couleur('--bar'),
      vert: couleur('--green'), orange: couleur('--orange'), cyan: couleur('--cyan'), violet: couleur('--purple'),
      texte: couleur('--text'), muet: couleur('--text-muted'),
    }
    const g = jeu.current
    const cam = Math.round(g.camera)

    ctx.fillStyle = C.fond
    ctx.fillRect(0, 0, VUE_L, VUE_H)

    // Décor lointain : lignes de « code » qui défilent plus lentement (parallaxe)
    ctx.globalAlpha = 0.12
    ctx.fillStyle = C.vert
    for (let i = 0; i < 40; i++) {
      const x = ((i * 137) % (g.L * T)) - cam * 0.3
      const y = 20 + ((i * 53) % 130)
      const l = 20 + ((i * 29) % 60)
      if (x > -80 && x < VUE_L) ctx.fillRect(x, y, l, 3)
    }
    ctx.globalAlpha = 1

    // Cases du niveau
    const debut = Math.floor(cam / T), fin = Math.ceil((cam + VUE_L) / T)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    for (let y = 0; y < LIGNES; y++) {
      for (let x = debut; x <= fin; x++) {
        const c = g.g[y][x]
        const px = x * T - cam, py = y * T
        if (c === '#') {
          ctx.fillStyle = C.surface
          ctx.fillRect(px, py, T, T)
          if (g.g[y - 1]?.[x] !== '#') {
            ctx.fillStyle = C.vert
            ctx.fillRect(px, py, T, 3)
          }
          ctx.fillStyle = C.bord
          ctx.fillRect(px, py + T - 1, T, 1)
          ctx.fillRect(px + T - 1, py, 1, T)
        } else if (c === '=') {
          ctx.fillStyle = C.barre
          ctx.fillRect(px + 1, py + 1, T - 2, T - 2)
          ctx.strokeStyle = C.bord
          ctx.strokeRect(px + 1.5, py + 1.5, T - 3, T - 3)
          ctx.fillStyle = C.muet
          ctx.fillRect(px + 5, py + 8, 9, 2)
          ctx.fillRect(px + 5, py + 13, 13, 2)
        } else if (c === 'C' || c === 'B') {
          const actif = c === 'C'
          ctx.fillStyle = actif ? C.barre : C.surface
          ctx.fillRect(px + 1, py + 1, T - 2, T - 2)
          ctx.strokeStyle = actif ? C.orange : C.bord
          ctx.lineWidth = 2
          ctx.strokeRect(px + 2, py + 2, T - 4, T - 4)
          ctx.lineWidth = 1
          ctx.fillStyle = actif ? C.orange : C.muet
          ctx.font = "700 9px 'JetBrains Mono', monospace"
          ctx.fillText('</>', px + T / 2, py + T / 2 + 1)
        } else if (c === 'o') {
          // Une techno : jeton lumineux qui flotte
          const f = Math.sin(g.temps / 10 + x) * 2
          ctx.fillStyle = C.cyan
          ctx.shadowColor = C.cyan
          ctx.shadowBlur = 8
          ctx.beginPath()
          ctx.arc(px + T / 2, py + T / 2 + f, 6, 0, Math.PI * 2)
          ctx.fill()
          ctx.shadowBlur = 0
          ctx.fillStyle = C.fond
          ctx.font = "800 8px 'JetBrains Mono', monospace"
          ctx.fillText('{}', px + T / 2, py + T / 2 + f + 0.5)
        }
      }
    }

    // Drapeau d'arrivée
    const fx = g.drapeau * T - cam
    if (fx > -60 && fx < VUE_L + 10) {
      ctx.fillStyle = C.muet
      ctx.fillRect(fx + 10, 2 * T, 3, 7 * T)
      ctx.fillStyle = C.vert
      const vague = Math.sin(g.temps / 8) * 2
      ctx.beginPath()
      ctx.moveTo(fx + 13, 2 * T)
      ctx.lineTo(fx + 46, 2 * T + 9 + vague)
      ctx.lineTo(fx + 13, 2 * T + 20)
      ctx.fill()
      ctx.fillStyle = C.fond
      ctx.font = "800 10px 'JetBrains Mono', monospace"
      ctx.fillText('✔', fx + 24, 2 * T + 10)
      ctx.fillStyle = C.vert
      ctx.font = "700 9px 'JetBrains Mono', monospace"
      ctx.fillText('STAGE', fx + 12, 2 * T - 9)
    }

    // Bugs ennemis : petits insectes violets
    for (const e of g.ennemis) {
      if (e.mort > 25) continue
      const ex = e.x - cam
      if (ex < -30 || ex > VUE_L + 30) continue
      ctx.globalAlpha = e.mort ? 1 - e.mort / 25 : 1
      const ecrase = e.mort ? 0.4 : 1
      const pattes = Math.floor(g.temps / 6) % 2
      ctx.fillStyle = C.violet
      ctx.beginPath()
      ctx.ellipse(ex + e.w / 2, e.y + e.h - (e.h * ecrase) / 2, e.w / 2, (e.h * ecrase) / 2, 0, 0, Math.PI * 2)
      ctx.fill()
      if (!e.mort) {
        ctx.strokeStyle = C.violet
        ctx.lineWidth = 1.5
        ctx.beginPath()
        for (const dx of [3, 9, 15]) {
          ctx.moveTo(e.x - cam + dx, e.y + e.h - 2)
          ctx.lineTo(e.x - cam + dx + (pattes ? 2 : -2), e.y + e.h + 2)
        }
        ctx.moveTo(ex + 5, e.y + 2)
        ctx.lineTo(ex + 2, e.y - 4)
        ctx.moveTo(ex + 13, e.y + 2)
        ctx.lineTo(ex + 16, e.y - 4)
        ctx.stroke()
        ctx.lineWidth = 1
        ctx.fillStyle = '#fff'
        const oeil = e.vx < 0 ? 4 : 10
        ctx.fillRect(ex + oeil, e.y + 4, 3, 3)
      }
      ctx.globalAlpha = 1
    }

    // Le joueur : un petit développeur en sweat vert
    const j = g.joueur
    if (!(j.invincible && Math.floor(j.invincible / 5) % 2)) {
      const jx = Math.round(j.x - cam), jy = Math.round(j.y)
      const jambe = j.sol ? Math.round(Math.sin(j.pas / 5) * 3) : 2
      ctx.save()
      if (j.sens < 0) {
        ctx.translate(jx * 2 + j.w, 0)
        ctx.scale(-1, 1)
      }
      ctx.fillStyle = '#1b2434'
      ctx.fillRect(jx + 3 + jambe, jy + 17, 4, 5)
      ctx.fillRect(jx + 9 - jambe, jy + 17, 4, 5)
      ctx.fillStyle = C.vert
      ctx.fillRect(jx + 1, jy + 8, 14, 10)
      ctx.fillStyle = '#7a4a2a'
      ctx.fillRect(jx + 3, jy, 10, 9)
      ctx.fillStyle = '#141a26'
      ctx.fillRect(jx + 2, jy - 1, 12, 3) // cheveux
      ctx.fillStyle = '#fff'
      ctx.fillRect(jx + 10, jy + 3, 2, 2)
      ctx.fillStyle = C.orange
      ctx.fillRect(jx + 12, jy + 11, 5, 4) // petit ordinateur portable
      ctx.restore()
    }

    // Textes flottants
    ctx.font = "800 10px 'JetBrains Mono', monospace"
    for (const t of g.textes) {
      ctx.globalAlpha = Math.min(1, t.vie / 20)
      ctx.fillStyle = C[t.couleur] || C.texte
      ctx.fillText(t.texte, t.x - cam, t.y - (50 - t.vie) * 0.6)
    }
    ctx.globalAlpha = 1
  }

  // --- Boucle : pas fixes de 1/60 s, quelle que soit la vitesse de l'écran ---
  useEffect(() => {
    const horloge = { id: 0, avant: performance.now(), reste: 0 }
    const boucle = (t) => {
      horloge.reste += Math.min(t - horloge.avant, 100)
      horloge.avant = t
      while (horloge.reste >= 1000 / 60) {
        if (statutRef.current === 'joue') pas()
        horloge.reste -= 1000 / 60
      }
      dessiner()
      horloge.id = requestAnimationFrame(boucle)
    }
    horloge.id = requestAnimationFrame(boucle)
    return () => cancelAnimationFrame(horloge.id)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // --- Clavier -------------------------------------------------------------
  useEffect(() => {
    const ouvertA = performance.now() // ignore la touche Entrée qui a lancé le jeu
    const CORRESP = {
      ArrowLeft: 'gauche', q: 'gauche', a: 'gauche',
      ArrowRight: 'droite', d: 'droite',
      ArrowUp: 'saut', ' ': 'saut', z: 'saut', w: 'saut',
    }
    const surTouche = (e, bas) => {
      if (performance.now() - ouvertA < 300) return
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key
      if (bas && k === 'Escape') {
        e.preventDefault()
        return onQuit()
      }
      if (bas && k === 'p') {
        if (statutRef.current === 'joue') setStatut('pause')
        else if (statutRef.current === 'pause') setStatut('joue')
        return
      }
      if (bas && (k === 'Enter' || k === ' ') && statutRef.current !== 'joue') {
        e.preventDefault()
        return demarrer()
      }
      const action = CORRESP[k]
      if (!action) return
      e.preventDefault()
      if (action === 'saut' && bas && !touches.current.saut) touches.current.sautAppuye = true
      touches.current[action] = bas
    }
    const bas = (e) => surTouche(e, true)
    const haut = (e) => surTouche(e, false)
    window.addEventListener('keydown', bas)
    window.addEventListener('keyup', haut)
    return () => {
      window.removeEventListener('keydown', bas)
      window.removeEventListener('keyup', haut)
    }
  }, [onQuit, demarrer])

  // Boutons tactiles : appui maintenu
  const bouton = (action) => ({
    onPointerDown: (e) => {
      e.preventDefault()
      if (statutRef.current !== 'joue' && statutRef.current !== 'pause') demarrer()
      if (action === 'saut' && !touches.current.saut) touches.current.sautAppuye = true
      touches.current[action] = true
    },
    onPointerUp: () => (touches.current[action] = false),
    onPointerLeave: () => (touches.current[action] = false),
    onPointerCancel: () => (touches.current[action] = false),
    onContextMenu: (e) => e.preventDefault(),
  })

  const allerContact = () => {
    onQuit()
    setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const messages = {
    pret: { titre: 'dev-run.exe', texte: 'Ramassez mes technologies, sautez sur les bugs et atteignez le drapeau du stage !', bouton: 'Jouer' },
    pause: { titre: 'Pause', texte: 'Appuyez sur P pour reprendre.', bouton: 'Reprendre' },
    perdu: { titre: 'Game over', texte: `${hud.ramasses} / ${hud.total} technologies ramassées. Les bugs ont gagné cette fois…`, bouton: 'Rejouer' },
    gagne: {
      titre: 'Stage décroché ! 🎉',
      texte: `${hud.ramasses} / ${hud.total} technologies ramassées. Et si on en parlait pour de vrai ?`,
      bouton: 'Rejouer',
    },
  }
  const m = messages[statut]

  return (
    <div className="jeu-fond" role="dialog" aria-modal="true" aria-label="Mini-jeu de plateforme" onClick={onQuit}>
      <div className="window jeu" onClick={(e) => e.stopPropagation()}>
        <div className="window-bar">
          <span className="dots" aria-hidden="true"><i /><i /><i /></span>
          <span className="window-title">~/jeux/dev-run.exe</span>
          <button type="button" className="jeu-quitter" onClick={onQuit} aria-label="Quitter le jeu">✕</button>
        </div>
        <div className="jeu-body">
          <div className="jeu-hud">
            <span>
              <span className="c-cyan">{'{}'}</span> {hud.ramasses}/{hud.total}
            </span>
            <span className="c-orange" aria-label={`${hud.vies} vies`}>
              {'♥'.repeat(Math.max(0, hud.vies))}
              <span className="c-muted">{'♥'.repeat(Math.max(0, VIES - hud.vies))}</span>
            </span>
          </div>
          <div className="jeu-ecran">
            <canvas ref={canvasRef} />
            {m && (
              <div className="jeu-message">
                <p className="jeu-titre">{m.titre}</p>
                <p>{m.texte}</p>
                <div className="jeu-actions">
                  <button type="button" className="btn btn-primary" onClick={demarrer}>
                    <span className="c-prompt">$</span> {m.bouton}
                  </button>
                  {statut === 'gagne' && (
                    <button type="button" className="btn btn-ghost" onClick={allerContact}>me contacter</button>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="jeu-pad">
            <div>
              <button type="button" aria-label="Gauche" {...bouton('gauche')}>◀</button>
              <button type="button" aria-label="Droite" {...bouton('droite')}>▶</button>
            </div>
            <button type="button" className="jeu-saut" aria-label="Sauter" {...bouton('saut')}>saut</button>
          </div>
          <p className="jeu-aide c-muted">← → courir · espace sauter · P pause · échap quitter</p>
        </div>
      </div>
    </div>
  )
}
