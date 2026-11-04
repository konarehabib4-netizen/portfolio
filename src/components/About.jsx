import { profile } from '../data/profile'
import { CountUp, Reveal, Section, T, Window } from '../utils'

export default function About() {
  return (
    <Section id="apropos" index="01" cmd="cat a-propos.md" title="À propos" comment="Qui je suis et ce qui me motive">
      <div className="about-grid">
        <Reveal>
          <Window title="a-propos.md" className="editor">
            <ol className="code-lines">
              <li><span className="c-purple"># </span><span className="c-heading">{profile.name}</span></li>
              <li />
              {profile.bio.map((p, i) => (
                <li key={i}>
                  <T>{p}</T>
                </li>
              ))}
            </ol>
          </Window>
        </Reveal>

        <div className="stats">
          {profile.stats.map((s, i) => (
            <Reveal key={s.label} className="stat" delay={i * 120}>
              <strong>
                <CountUp value={s.value} />
              </strong>
              <span>{s.label}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}
