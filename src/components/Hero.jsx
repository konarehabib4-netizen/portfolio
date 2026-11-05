import { useEffect, useMemo, useRef, useState } from 'react'
import { profile } from '../data/profile'
import { initials, prefersReducedMotion, slugify } from '../helpers'
import { Window } from '../utils'
import Globe3D from './Globe3D'

const SPEED = 38 // ms par caractère pendant l'intro

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
const openUrl = (url) => url && window.open(url, '_blank', 'noopener')

// --- L'intro jouée automatiquement -----------------------------------------
function buildIntro() {
  const techs = profile.skills.flatMap((g) => g.items).slice(0, 8)
  return [
    { cmd: 'whoami', out: <span className="hero-name">{profile.name}</span> },
    { cmd: 'cat role.txt', out: <span className="c-orange">{profile.title}</span> },
    { cmd: 'cat bio.txt', out: <span>{profile.tagline}</span> },
    {
      cmd: 'ls competences/',
      out: (
        <span className="ls">
          {techs.map((t) => (
            <span key={t} className="c-cyan">{t}</span>
          ))}
        </span>
      ),
    },
    {
      cmd: './statut.sh',
      out: (
        <span className="c-green">
          <span className="pulse" /> {profile.available}
        </span>
      ),
    },
  ]
}

// --- Les commandes que le visiteur peut taper -------------------------------
function buildCommands(onToggleTheme) {
  const { email, github, linkedin } = profile.contact
  const cmds = {
    help: {
      desc: 'affiche cette aide',
      run: (all) => (
        <span className="help-grid">
          {Object.entries(all).map(([name, c]) => (
            <span key={name}>
              <span className="c-green">{name}</span>
              <span className="c-muted">{c.desc}</span>
            </span>
          ))}
        </span>
      ),
    },
    whoami: { desc: 'qui suis-je ?', run: () => `${profile.name} · ${profile.title}` },
    projets: {
      desc: 'liste mes projets',
      run: () => {
        setTimeout(() => scrollTo('projets'), 900)
        return (
          <span className="ls">
            {profile.projects.map((p) => (
              <span key={p.title} className="c-cyan">{slugify(p.title)}/</span>
            ))}
          </span>
        )
      },
    },
    competences: {
      desc: 'mes technologies',
      run: () => profile.skills.map((g) => `${g.category} : ${g.items.join(', ')}`).join('\n'),
    },
    parcours: {
      desc: 'formation et expériences',
      run: () => {
        setTimeout(() => scrollTo('parcours'), 900)
        return [...profile.experience, ...profile.education].map((e) => `› ${e.title} (${e.place})`).join('\n')
      },
    },
    cv: {
      desc: 'télécharge mon CV (PDF)',
      run: () => {
        if (!profile.cv) return 'CV bientôt disponible.'
        const a = document.createElement('a')
        a.href = profile.cv
        a.download = ''
        a.click()
        return <span className="c-green">✔ Téléchargement de {profile.cv} lancé.</span>
      },
    },
    contact: {
      desc: 'mes coordonnées',
      run: () => (
        <span className="contact-out">
          <a href={`mailto:${email}`}>{email}</a>
          {profile.contact.phone && <span>{profile.contact.phone}</span>}
        </span>
      ),
    },
    email: {
      desc: 'm’écrire un email',
      run: () => {
        window.location.href = `mailto:${email}`
        return `Ouverture de votre messagerie vers ${email}…`
      },
    },
    github: { desc: 'ouvre mon GitHub', run: () => (openUrl(github), `→ ${github}`) },
    linkedin: { desc: 'ouvre mon LinkedIn', run: () => (openUrl(linkedin), `→ ${linkedin}`) },
    theme: { desc: 'mode clair / sombre', run: () => (onToggleTheme(), 'Thème changé ✨') },
    embauche: {
      desc: 'la meilleure commande 😉',
      run: () => (
        <span>
          <span className="c-green">✔ Excellente décision !</span> Je suis disponible pour un stage.{' '}
          Écrivez-moi à <a href={`mailto:${email}`}>{email}</a>.
        </span>
      ),
    },
    clear: { desc: 'efface le terminal', run: () => null },
  }
  return cmds
}

export default function Hero({ onToggleTheme }) {
  const intro = useMemo(() => buildIntro(), [])
  const commands = useMemo(() => buildCommands(onToggleTheme), [onToggleTheme])
  const instant = prefersReducedMotion()

  const [step, setStep] = useState(instant ? intro.length : 0) // lignes d'intro terminées
  const [typed, setTyped] = useState(0) // caractères tapés de la ligne en cours
  const [history, setHistory] = useState([]) // commandes tapées par le visiteur
  const [input, setInput] = useState('')
  const [past, setPast] = useState([]) // pour la flèche ↑
  const [cursor, setCursor] = useState(-1)
  const [cleared, setCleared] = useState(false)
  const bodyRef = useRef(null)
  const inputRef = useRef(null)
  const done = step >= intro.length

  // Intro tapée lettre par lettre
  useEffect(() => {
    if (done) return
    const cmd = intro[step].cmd
    const id = setTimeout(
      () => {
        if (typed < cmd.length) setTyped(typed + 1)
        else {
          setStep(step + 1)
          setTyped(0)
        }
      },
      typed < cmd.length ? SPEED : 420,
    )
    return () => clearTimeout(id)
  }, [step, typed, intro, done])

  // Garde la dernière ligne visible
  useEffect(() => {
    const el = bodyRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [step, typed, history])

  const run = (raw) => {
    const value = raw.trim()
    const name = value.toLowerCase().replace(/^sudo\s+/, '')
    if (!value) return
    setPast((p) => [value, ...p])
    setCursor(-1)
    if (name === 'clear') {
      setHistory([])
      setCleared(true)
      return
    }
    const command = commands[name]
    const out = command
      ? command.run(commands)
      : (
          <span>
            <span className="c-orange">commande introuvable : {value}</span>. Tapez{' '}
            <span className="c-green">help</span> pour voir les commandes.
          </span>
        )
    setHistory((h) => [...h, { id: Date.now(), cmd: value, out }])
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      run(input)
      setInput('')
    } else if (e.key === 'ArrowUp' && past.length) {
      e.preventDefault()
      const next = Math.min(cursor + 1, past.length - 1)
      setCursor(next)
      setInput(past[next])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = cursor - 1
      setCursor(next)
      setInput(next >= 0 ? past[next] : '')
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const match = Object.keys(commands).find((c) => c.startsWith(input.toLowerCase()))
      if (input && match) setInput(match)
    }
  }

  const onTerminalClick = () => {
    if (!done) {
      setStep(intro.length)
      setTyped(0)
    }
    // Ne vole pas le focus si le visiteur sélectionne du texte
    if (!window.getSelection()?.toString()) inputRef.current?.focus({ preventScroll: true })
  }

  const suggestions = ['help', 'projets', 'cv', 'embauche']

  return (
    <section id="accueil" className="hero">
      <div className="hero-grid-bg" aria-hidden="true" />
      <div className="aurora" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="container hero-inner">
        <div className="hero-main fade-up">
          <Window
            title={`${profile.name.split(' ')[0]?.toLowerCase()}@portfolio: ~`}
            className="terminal hero-terminal"
            onClick={onTerminalClick}
          >
            <div className="term-scroll" ref={bodyRef}>
              {!cleared &&
                intro.slice(0, step).map((line) => (
                  <div key={line.cmd} className="term-line">
                    <p><span className="c-prompt">$</span> {line.cmd}</p>
                    <p className="term-out">{line.out}</p>
                  </div>
                ))}
              {history.map((h) => (
                <div key={h.id} className="term-line">
                  <p><span className="c-prompt">$</span> {h.cmd}</p>
                  {h.out && <div className="term-out pre">{h.out}</div>}
                </div>
              ))}

              {done ? (
                <label className="term-input">
                  <span className="c-prompt">$</span>
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    spellCheck="false"
                    autoComplete="off"
                    autoCapitalize="off"
                    aria-label="Tapez une commande (essayez help)"
                    placeholder="tapez « help » puis Entrée…"
                  />
                </label>
              ) : (
                <p>
                  <span className="c-prompt">$</span> {intro[step].cmd.slice(0, typed)}
                  <span className="cursor" aria-hidden="true" />
                </p>
              )}
            </div>
            {!done && <span className="term-hint">cliquer pour passer ↵</span>}
          </Window>

          <div className={`term-chips ${done ? 'show' : ''}`}>
            <span className="c-muted">essayez :</span>
            {suggestions.map((s) => (
              <button key={s} type="button" onClick={() => run(s)}>
                {s}
              </button>
            ))}
          </div>

          <div className="hero-buttons">
            <a href="#projets" className="btn btn-primary">
              <span className="c-prompt">$</span> voir mes projets
            </a>
            {profile.cv && (
              <a href={profile.cv} className="btn btn-ghost" download>
                ⬇ télécharger mon CV
              </a>
            )}
          </div>
        </div>

        <div className="hero-side fade-up delay">
          <div className="photo-stack">
            <Globe3D />
            <Window title={profile.photo || 'avatar.png'} className="photo-window">
              {profile.photo ? (
                <img src={profile.photo} alt={`Photo de ${profile.name}`} />
              ) : (
                <span className="photo-initials">{initials(profile.name)}</span>
              )}
              <span className="scanlines" aria-hidden="true" />
            </Window>
            <span className="float-badge b1">⚛ React</span>
            <span className="float-badge b2">📱 Kotlin</span>
            <span className="float-badge b3">{'</>'} C#</span>
          </div>
          <p className="hero-location">
            <span className="c-muted">{'// '}</span>📍 {profile.location}
          </p>
        </div>
      </div>
      <a href="#apropos" className="scroll-hint" aria-label="Défiler vers À propos">
        scroll <span>↓</span>
      </a>
    </section>
  )
}
