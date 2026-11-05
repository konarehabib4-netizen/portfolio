import { useLang } from '../i18n'
import { CountUp, Reveal, Section, T, Window } from '../utils'

export default function About() {
  const { profile, tr } = useLang()
  return (
    <Section id="apropos" index="01" cmd={tr('cat a-propos.md', 'cat about.md')} title={tr('À propos', 'About')} comment={tr('Qui je suis et ce qui me motive', 'Who I am and what drives me')}>
      <div className="about-grid">
        <Reveal>
          <Window title={tr('a-propos.md', 'about.md')} className="editor">
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
