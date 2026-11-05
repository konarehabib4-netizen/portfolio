import { useLang } from '../i18n'
import { shortHash } from '../helpers'
import { Reveal, Section, T } from '../utils'

// Le parcours présenté comme un "git log" : chaque étape est un commit.
function GitLog({ branch, items }) {
  const { tr } = useLang()
  return (
    <div className="gitlog">
      <p className="gitlog-branch">
        <span className="c-muted">{tr('branche', 'branch')}</span> <span className="c-green">{branch}</span>
      </p>
      <ol>
        {items.map((item, i) => (
          <Reveal as="li" key={item.title} delay={i * 120}>
            <p className="commit-line">
              <span className="c-orange">commit {shortHash(item.title)}</span>
              {i === 0 && <span className="head">(HEAD)</span>}
            </p>
            <p className="commit-date">
              <span className="c-muted">{tr('Date :', 'Date:')}</span> <T>{item.period}</T>
            </p>
            <h4>{item.title}</h4>
            <T as="p" className="place">{item.place}</T>
            {item.details && <T as="p" className="details">{item.details}</T>}
          </Reveal>
        ))}
      </ol>
    </div>
  )
}

export default function Journey() {
  const { profile, tr } = useLang()
  return (
    <Section id="parcours" index="04" cmd={tr('git log --parcours', 'git log --journey')} title={tr('Parcours', 'Journey')} comment={tr('Formation et expériences professionnelles', 'Education and work experience')}>
      <div className="journey-grid">
        <GitLog branch="experience" items={profile.experience} />
        <GitLog branch={tr('formation', 'education')} items={profile.education} />
      </div>
    </Section>
  )
}
