import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Journey from './components/Journey'
import Contact from './components/Contact'
import Spotlight from './components/Spotlight'
import CaseStudy from './components/CaseStudy'
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

// Page affichée selon l'URL : « #/etude/loyerfacile » ouvre une étude de cas,
// tout le reste (#projets, #contact…) affiche le portfolio.
const etudeDepuisHash = () => window.location.hash.match(/^#\/etude\/([\w-]+)/)?.[1] || null

const year = new Date().getFullYear()
const displayName = isTodo(profile.name) ? 'Portfolio' : profile.name

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme)
  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  const [etude, setEtude] = useState(etudeDepuisHash)

  useEffect(() => {
    const onHash = () => setEtude(etudeDepuisHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // En revenant d'une étude vers « #projets », la section n'existe qu'après l'affichage :
  // on défile donc jusqu'à elle une fois la page d'accueil rendue.
  useEffect(() => {
    if (etude) return
    const cible = window.location.hash.slice(1)
    if (cible && !cible.startsWith('/')) document.getElementById(cible)?.scrollIntoView()
  }, [etude])

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
      {etude ? (
        <CaseStudy id={etude} />
      ) : (
        <main>
          <Hero onToggleTheme={toggleTheme} />
          <About />
          <Skills />
          <Projects />
          <Journey />
          <Contact />
        </main>
      )}
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
