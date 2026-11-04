// Petits composants partagés.
import { useEffect, useRef, useState } from 'react'
import { isTodo, prefersReducedMotion } from './helpers'

// Affiche un texte ; s'il contient "[À COMPLÉTER", il est surligné.
export function T({ children, as: Tag = 'span', className = '' }) {
  return <Tag className={`${className} ${isTodo(children) ? 'todo' : ''}`.trim() || undefined}>{children}</Tag>
}

// Animation d'apparition au défilement (IntersectionObserver).
export function Reveal({ children, as: Tag = 'div', className = '', delay = 0, ...rest }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

// Une section : titre façon commande de terminal + commentaire.
export function Section({ id, index, cmd, title, comment, children }) {
  return (
    <section id={id} className="section">
      <div className="container">
        <Reveal as="header" className="section-head">
          <p className="section-cmd">
            <span className="c-num">{index}.</span> <span className="c-prompt">$</span> {cmd}
          </p>
          <h2>
            <Scramble text={title} />
          </h2>
          {comment && <p className="section-comment">{`// ${comment}`}</p>}
        </Reveal>
        {children}
      </div>
    </section>
  )
}

// Fenêtre façon terminal / éditeur avec ses 3 pastilles.
export function Window({ title, children, className = '', as: Tag = 'div', ...rest }) {
  return (
    <Tag className={`window ${className}`.trim()} {...rest}>
      <div className="window-bar">
        <span className="dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="window-title">{title}</span>
      </div>
      <div className="window-body">{children}</div>
    </Tag>
  )
}

// Déclenche une fois quand l'élément entre dans l'écran.
function useInView(ref) {
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setSeen(true)
        io.disconnect()
      }
    }, { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [ref])
  return seen
}

const GLYPHS = '!<>-_/[]{}=+*^?#01'

// Texte qui se « décode » lettre par lettre, façon hacker.
export function Scramble({ text }) {
  const ref = useRef(null)
  const seen = useInView(ref)
  const [out, setOut] = useState(text)

  useEffect(() => {
    if (!seen || prefersReducedMotion()) return
    const total = 22
    let frame = 0
    const id = setInterval(() => {
      frame++
      const revealed = Math.floor((frame / total) * text.length)
      setOut(
        frame >= total
          ? text
          : text
              .split('')
              .map((ch, i) => (i < revealed || ch === ' ' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
              .join(''),
      )
      if (frame >= total) clearInterval(id)
    }, 40)
    return () => clearInterval(id)
  }, [seen, text])

  return (
    <span ref={ref} aria-label={text}>
      <span aria-hidden="true">{out}</span>
    </span>
  )
}

// Nombre qui compte de 0 jusqu'à sa valeur (« 4 », « 1 an », « Bac+3 »…).
export function CountUp({ value }) {
  const ref = useRef(null)
  const seen = useInView(ref)
  const match = String(value).match(/\d+/)
  const [n, setN] = useState(0)

  const target = match ? Number(match[0]) : 0
  const reduce = prefersReducedMotion()

  useEffect(() => {
    if (!seen || !target || reduce) return
    const start = performance.now()
    const id = setInterval(() => {
      const p = Math.min((performance.now() - start) / 1200, 1)
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p >= 1) clearInterval(id)
    }, 30)
    return () => clearInterval(id)
  }, [seen, target, reduce])

  if (!match) return <span ref={ref}>{value}</span>
  const [before, after] = String(value).split(match[0])
  return (
    <span ref={ref}>
      {before}
      {reduce ? target : seen ? n : 0}
      {after}
    </span>
  )
}
