import { profile } from '../data/profile'
import { shortHash } from '../helpers'
import { Reveal, Section, T } from '../utils'

// Le parcours présenté comme un "git log" : chaque étape est un commit.
function GitLog({ branch, items }) {
  return (
    <div className="gitlog">
      <p className="gitlog-branch">
        <span className="c-muted">branche</span> <span className="c-green">{branch}</span>
      </p>
      <ol>
        {items.map((item, i) => (
          <Reveal as="li" key={item.title} delay={i * 120}>
            <p className="commit-line">
              <span className="c-orange">commit {shortHash(item.title)}</span>
              {i === 0 && <span className="head">(HEAD)</span>}
            </p>
            <p className="commit-date">
              <span className="c-muted">Date :</span> <T>{item.period}</T>
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
  return (
    <Section id="parcours" index="04" cmd="git log --parcours" title="Parcours" comment="Formation et expériences professionnelles">
      <div className="journey-grid">
        <GitLog branch="experience" items={profile.experience} />
        <GitLog branch="formation" items={profile.education} />
      </div>
    </Section>
  )
}
