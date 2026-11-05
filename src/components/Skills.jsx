import { useLang } from '../i18n'
import { slugify } from '../helpers'
import { Reveal, Section, Window } from '../utils'

// Les compétences affichées comme un objet JavaScript, avec coloration syntaxique.
export default function Skills() {
  const { profile, tr } = useLang()
  const all = profile.skills.flatMap((g) => g.items)

  return (
    <Section id="competences" index="02" cmd={tr('cat competences.js', 'cat skills.js')} title={tr('Compétences', 'Skills')} comment={tr('Les technologies avec lesquelles je travaille', 'The technologies I work with')}>
      <div className="skills-layout">
        <Reveal>
          <Window title={tr('competences.js', 'skills.js')} className="editor">
            <ol className="code-lines">
              <li>
                <span className="c-purple">const</span> <span className="c-cyan">{tr('competences', 'skills')}</span>{' '}
                <span className="c-muted">=</span> {'{'}
              </li>
              {profile.skills.map((group) => (
                <li key={group.category} className="skill-line">
                  <span className="indent" />
                  <span className="c-key">{slugify(group.category).replace(/-/g, '_')}</span>
                  <span className="c-muted">: [</span>
                  {group.items.map((item, i) => (
                    <span key={item}>
                      <span className="c-string">"{item}"</span>
                      {i < group.items.length - 1 && <span className="c-muted">, </span>}
                    </span>
                  ))}
                  <span className="c-muted">],</span>
                  <span className="c-comment"> {`// ${group.icon} ${group.category}`}</span>
                </li>
              ))}
              <li>{'}'}</li>
            </ol>
          </Window>
        </Reveal>
      </div>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...all, ...all].map((t, i) => (
            <span key={i}>
              {t} <i>◆</i>
            </span>
          ))}
        </div>
      </div>
    </Section>
  )
}
