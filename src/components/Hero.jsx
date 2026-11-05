import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLang } from '../i18n'
import { initials, prefersReducedMotion, slugify } from '../helpers'
import { Window } from '../utils'
import Globe3D from './Globe3D'
import Plateforme from './Plateforme'
import Matrix from './Matrix'

const SPEED = 38 // ms par caractère pendant l'intro

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
const openUrl = (url) => url && window.open(url, '_blank', 'noopener')

// --- L'intro jouée automatiquement -----------------------------------------
function buildIntro(profile, tr) {
  const techs = profile.skills.flatMap((g) => g.items).slice(0, 8)
  return [
    { cmd: 'whoami', out: <span className="hero-name">{profile.name}</span> },
    { cmd: 'cat role.txt', out: <span className="c-orange">{profile.title}</span> },
    { cmd: 'cat bio.txt', out: <span>{profile.tagline}</span> },
    {
      cmd: tr('ls competences/', 'ls skills/'),
      out: (
        <span className="ls">
          {techs.map((t) => (
            <span key={t} className="c-cyan">{t}</span>
          ))}
        </span>
      ),
    },
    {
      cmd: tr('./statut.sh', './status.sh'),
      out: (
        <span className="c-green">
          <span className="pulse" /> {profile.available}
        </span>
      ),
    },
  ]
}

// --- Les commandes que le visiteur peut taper -------------------------------
// Chaque commande a un nom français et, si besoin, un nom anglais (en) :
// les deux marchent toujours, « help » affiche ceux de la langue choisie.
function buildCommands(profile, tr, onToggleTheme, lancerJeu) {
  const { email, github, linkedin } = profile.contact
  const cmds = {
    help: {
      desc: tr('affiche cette aide', 'show this help'),
      run: (all) => (
        <span className="help-grid">
          {Object.entries(all)
            .filter(([, c]) => !c.cache)
            .map(([name, c]) => (
              <span key={name}>
                <span className="c-green">{tr(name, c.en || name)}</span>
                <span className="c-muted">{c.desc}</span>
              </span>
            ))}
          <span>
            <span className="c-purple">???</span>
            <span className="c-muted">
              {tr('il existe aussi des commandes cachées… 👀 (indice : essayez de jouer)', 'there are hidden commands too… 👀 (hint: try to play)')}
            </span>
          </span>
        </span>
      ),
    },
    whoami: { desc: tr('qui suis-je ?', 'who am I?'), run: () => `${profile.name} · ${profile.title}` },
    projets: {
      en: 'projects',
      desc: tr('liste mes projets', 'list my projects'),
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
      en: 'skills',
      desc: tr('mes technologies', 'my tech stack'),
      run: () => profile.skills.map((g) => `${g.category} : ${g.items.join(', ')}`).join('\n'),
    },
    parcours: {
      en: 'journey',
      desc: tr('formation et expériences', 'education and experience'),
      run: () => {
        setTimeout(() => scrollTo('parcours'), 900)
        return [...profile.experience, ...profile.education].map((e) => `› ${e.title} (${e.place})`).join('\n')
      },
    },
    cv: {
      en: 'resume',
      desc: tr('télécharge mon CV (PDF)', 'download my resume (PDF, in French)'),
      run: () => {
        if (!profile.cv) return tr('CV bientôt disponible.', 'Resume coming soon.')
        const a = document.createElement('a')
        a.href = profile.cv
        a.download = ''
        a.click()
        return <span className="c-green">{tr(`✔ Téléchargement de ${profile.cv} lancé.`, `✔ Downloading ${profile.cv}…`)}</span>
      },
    },
    contact: {
      desc: tr('mes coordonnées', 'my contact details'),
      run: () => (
        <span className="contact-out">
          <a href={`mailto:${email}`}>{email}</a>
          {profile.contact.phone && <span>{profile.contact.phone}</span>}
        </span>
      ),
    },
    email: {
      desc: tr('m’écrire un email', 'send me an email'),
      run: () => {
        window.location.href = `mailto:${email}`
        return tr(`Ouverture de votre messagerie vers ${email}…`, `Opening your mail app to ${email}…`)
      },
    },
    github: { desc: tr('ouvre mon GitHub', 'open my GitHub'), run: () => (openUrl(github), `→ ${github}`) },
    linkedin: { desc: tr('ouvre mon LinkedIn', 'open my LinkedIn'), run: () => (openUrl(linkedin), `→ ${linkedin}`) },
    theme: { desc: tr('mode clair / sombre', 'light / dark mode'), run: () => (onToggleTheme(), tr('Thème changé ✨', 'Theme switched ✨')) },
    embauche: {
      en: 'hire',
      desc: tr('la meilleure commande 😉', 'the best command 😉'),
      run: () => (
        <span>
          <span className="c-green">{tr('✔ Excellente décision !', '✔ Great decision!')}</span>{' '}
          {tr('Je suis disponible pour un stage. Écrivez-moi à', 'I am available for an internship. Write to me at')}{' '}
          <a href={`mailto:${email}`}>{email}</a>.
        </span>
      ),
    },
    clear: { desc: tr('efface le terminal', 'clear the terminal'), run: () => null },
    // --- Commandes cachées (absentes de « help ») ---
    jouer: {
      en: 'play',
      cache: true,
      run: () => (lancerJeu('plateforme'), <span className="c-green">{tr('🎮 Lancement de dev-run.exe… bonne chance !', '🎮 Launching dev-run.exe… good luck!')}</span>),
    },
    mario: {
      cache: true,
      run: () => (
        <span>
          {tr('Pas de plombier ici 😄 mais un développeur qui saute très bien : tapez', 'No plumber here 😄 but a developer who jumps really well: type')}{' '}
          <span className="c-green">{tr('jouer', 'play')}</span>.
        </span>
      ),
    },
    matrix: {
      cache: true,
      run: () => (lancerJeu('matrix'), <span className="c-green">Wake up… 🟩</span>),
    },
    ls: {
      cache: true,
      run: () => (
        <span className="ls">
          <span className="c-cyan">{tr('projets/', 'projects/')}</span>
          <span className="c-cyan">{tr('competences/', 'skills/')}</span>
          <span>cv.pdf</span>
          <span className="c-muted">.secrets</span>
        </span>
      ),
    },
    'cat .secrets': {
      cache: true,
      run: () => (
        <span>
          {tr('Commandes cachées :', 'Hidden commands:')} <span className="c-green">{tr('jouer', 'play')}</span>,{' '}
          <span className="c-green">matrix</span>, <span className="c-green">{tr('sudo embauche', 'sudo hire')}</span>.{' '}
          {tr('Bravo d’avoir fouillé 🕵️', 'Nice digging 🕵️')}
        </span>
      ),
    },
  }
  // Les noms anglais (projects, skills, hire, play…) lancent la même commande, en restant hors de « help »
  for (const c of Object.values({ ...cmds })) if (c.en && !cmds[c.en]) cmds[c.en] = { ...c, cache: true }
  return cmds
}

export default function Hero({ onToggleTheme }) {
  const { profile, tr } = useLang()
  const intro = useMemo(() => buildIntro(profile, tr), [profile, tr])
  const [jeu, setJeu] = useState(null) // null | 'plateforme' | 'matrix'
  const commands = useMemo(() => buildCommands(profile, tr, onToggleTheme, setJeu), [profile, tr, onToggleTheme])
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
            <span className="c-orange">{tr('commande introuvable :', 'command not found:')} {value}</span>.{' '}
            {tr('Tapez', 'Type')} <span className="c-green">help</span> {tr('pour voir les commandes.', 'to see the commands.')}
          </span>
        )
    setHistory((h) => [...h, { id: Date.now(), cmd: value, out }])
  }

  const quitterJeu = useCallback(() => {
    setJeu(null)
    setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 50)
  }, [])

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
      const match = Object.keys(commands).find((c) => !commands[c].cache && c.startsWith(input.toLowerCase()))
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

  const suggestions = tr(['help', 'projets', 'cv', 'embauche'], ['help', 'projects', 'resume', 'hire'])

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
                    aria-label={tr('Tapez une commande (essayez help)', 'Type a command (try help)')}
                    placeholder={tr('tapez « help » puis Entrée…', 'type “help” then Enter…')}
                  />
                </label>
              ) : (
                <p>
                  <span className="c-prompt">$</span> {intro[step].cmd.slice(0, typed)}
                  <span className="cursor" aria-hidden="true" />
                </p>
              )}
            </div>
            {!done && <span className="term-hint">{tr('cliquer pour passer ↵', 'click to skip ↵')}</span>}
          </Window>

          <div className={`term-chips ${done ? 'show' : ''}`}>
            <span className="c-muted">{tr('essayez :', 'try:')}</span>
            {suggestions.map((s) => (
              <button key={s} type="button" onClick={() => run(s)}>
                {s}
              </button>
            ))}
          </div>

          <div className="hero-buttons">
            <a href="#projets" className="btn btn-primary">
              <span className="c-prompt">$</span> {tr('voir mes projets', 'see my projects')}
            </a>
            {profile.cv && (
              <a href={profile.cv} className="btn btn-ghost" download>
                ⬇ {tr('télécharger mon CV', 'download my resume')}
              </a>
            )}
          </div>
        </div>

        <div className="hero-side fade-up delay">
          <div className="photo-stack">
            <Globe3D />
            <Window title={profile.photo || 'avatar.png'} className="photo-window">
              {profile.photo ? (
                <img src={profile.photo} alt={tr(`Photo de ${profile.name}`, `Photo of ${profile.name}`)} />
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
      {/* Les jeux s'affichent par-dessus tout le site (portail vers <body>) */}
      {jeu === 'plateforme' && createPortal(<Plateforme onQuit={quitterJeu} />, document.body)}
      {jeu === 'matrix' && createPortal(<Matrix onQuit={quitterJeu} />, document.body)}
      <a href="#apropos" className="scroll-hint" aria-label={tr('Défiler vers À propos', 'Scroll to About')}>
        scroll <span>↓</span>
      </a>
    </section>
  )
}
