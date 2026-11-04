import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Journey from './components/Journey'
import Contact from './components/Contact'
import Spotlight from './components/Spotlight'
import { profile } from './data/profile'
import { isTodo } from './helpers'

// Thème initial : choix mémorisé, sinon préférence du système.
function getInitialTheme() {
  try {
    const saved = localStorage.getItem('theme')
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    /* stockage indisponible */
  }
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

const year = new Date().getFullYear()
const displayName = isTodo(profile.name) ? 'Portfolio' : profile.name

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme)
  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('theme', theme)
    } catch {
      /* stockage indisponible */
    }
  }, [theme])

  useEffect(() => {
    document.title = isTodo(profile.name) ? 'Portfolio' : `${profile.name} | Portfolio`
  }, [])

  return (
    <>
      <Spotlight />
      <div className="grain" aria-hidden="true" />
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <Hero onToggleTheme={toggleTheme} />
        <About />
        <Skills />
        <Projects />
        <Journey />
        <Contact />
      </main>
      <footer className="footer">
        <div className="container footer-inner">
          <span>
            <span className="c-prompt">$</span> exit 0{' '}
            <span className="c-muted">{'// '}© {year} {displayName}</span>
          </span>
          <span className="c-muted">conçu et codé avec React · fait à Abidjan 🇨🇮</span>
        </div>
      </footer>
    </>
  )
}
