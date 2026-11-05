import { useLang } from '../i18n'
import { slugify } from '../helpers'
import { Reveal, Section, T } from '../utils'

// Petit effet 3D : la carte s'incline selon la position de la souris.
function tilt(e) {
  const card = e.currentTarget
  const r = card.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width - 0.5
  const y = (e.clientY - r.top) / r.height - 0.5
  card.style.setProperty('--rx', `${(-y * 6).toFixed(2)}deg`)
  card.style.setProperty('--ry', `${(x * 6).toFixed(2)}deg`)
  card.style.setProperty('--mx', `${(x + 0.5) * 100}%`)
  card.style.setProperty('--my', `${(y + 0.5) * 100}%`)
}
function reset(e) {
  e.currentTarget.style.setProperty('--rx', '0deg')
  e.currentTarget.style.setProperty('--ry', '0deg')
}

export default function Projects() {
  const { profile, tr } = useLang()
  return (
    <Section id="projets" index="03" cmd={tr('ls -la projets/', 'ls -la projects/')} title={tr('Projets', 'Projects')} comment={tr('Une sélection de ce que j’ai réalisé', 'A selection of what I have built')}>
      <div className="projects-grid">
        {profile.projects.map((p, i) => {
          const inProgress = p.tags.some((t) => /en cours|in progress/i.test(t))
          const tags = p.tags.filter((t) => !/en cours|in progress/i.test(t))
          return (
            <Reveal
              key={p.title}
              as="article"
              className="project-card"
              delay={i * 100}
              onMouseMove={tilt}
              onMouseLeave={reset}
            >
              <div className="project-path">
                <span className="c-muted">{tr('~/projets/', '~/projects/')}</span>
                <span className="c-cyan">{slugify(p.title)}</span>
                <span className={`status ${inProgress ? 'wip' : 'ok'}`}>
                  {inProgress ? tr('◐ en cours', '◐ in progress') : tr('● terminé', '● done')}
                </span>
              </div>
              <h3>{p.title}</h3>
              <T as="p">{p.description}</T>
              <ul className="tags">
                {tags.map((t) => (
                  <T as="li" key={t}>{`#${t.toLowerCase().replace(/\s+/g, '-')}`}</T>
                ))}
              </ul>
              {(p.github || p.demo || p.etude) && (
                <div className="project-links">
                  {p.etude && (
                    <a href={`#/etude/${p.etude}`} className="project-etude">
                      <span className="c-prompt">$</span> {tr('cat etude-de-cas.md →', 'cat case-study.md →')}
                    </a>
                  )}
                  {p.github && (
                    <a href={p.github} target="_blank" rel="noreferrer">
                      <span className="c-prompt">$</span> git clone ↗
                    </a>
                  )}
                  {p.demo && (
                    <a href={p.demo} target="_blank" rel="noreferrer">
                      <span className="c-prompt">$</span> open demo ↗
                    </a>
                  )}
                </div>
              )}
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}
