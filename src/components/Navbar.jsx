import { useEffect, useState } from 'react'
import { profile } from '../data/profile'

const links = [
  { id: 'apropos', label: 'a-propos' },
  { id: 'competences', label: 'competences' },
  { id: 'projets', label: 'projets' },
  { id: 'parcours', label: 'parcours' },
  { id: 'contact', label: 'contact' },
]

export default function Navbar({ theme, onToggleTheme }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? window.scrollY / max : 0)
      setScrolled(window.scrollY > 10)
      // Section active = la dernière dont le haut est passé sous la barre.
      let current = ''
      for (const { id } of links) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top < 140) current = id
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setOpen(false)
  const user = profile.name.split(/\s+/)[0]?.toLowerCase() || 'dev'

  return (
    <header className={`navbar ${scrolled || open ? 'scrolled' : ''}`}>
      <div className="progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
      <nav className="container nav-inner">
        <a href="#accueil" className="logo" onClick={close}>
          <span className="c-green">{user}</span>
          <span className="c-muted">@</span>
          <span className="c-cyan">portfolio</span>
          <span className="c-muted">:~$</span>
          <span className="cursor" aria-hidden="true" />
        </a>

        <ul className={`nav-links ${open ? 'open' : ''}`}>
          {links.map(({ id, label }) => (
            <li key={id}>
              <a href={`#${id}`} className={active === id ? 'active' : ''} onClick={close}>
                <span className="c-muted">./</span>
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          {profile.cv && (
            <a href={profile.cv} download className="nav-cv" title="Télécharger mon CV (PDF)">
              ⬇ <span>cv.pdf</span>
            </a>
          )}
          <button
            className="icon-btn"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
            title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>
          <button
            className={`icon-btn burger ${open ? 'open' : ''}`}
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={open}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>
    </header>
  )
}
