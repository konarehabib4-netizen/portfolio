import { profile } from '../data/profile'
import { isTodo } from '../helpers'
import { Reveal, Section, Window } from '../utils'

export default function Contact() {
  const { email, phone, github, linkedin } = profile.contact
  const rows = [
    { key: 'EMAIL', value: email, href: isTodo(email) ? '' : `mailto:${email}` },
    phone && { key: 'TELEPHONE', value: phone, href: `tel:${phone.replace(/\s/g, '')}` },
    github && { key: 'GITHUB', value: github, href: github },
    linkedin && { key: 'LINKEDIN', value: linkedin, href: linkedin },
  ].filter(Boolean)

  return (
    <Section id="contact" index="05" cmd="./contact.sh" title="Contact" comment="Un stage, un projet, une question ? Écrivez-moi.">
      <Reveal className="contact-wrap">
        <Window title="contact.sh" className="terminal contact-term">
          <p className="c-comment"># Je suis ouvert aux opportunités de stage et je réponds rapidement.</p>
          {rows.map((r) => (
            <div key={r.key} className="contact-row">
              <p>
                <span className="c-prompt">$</span> echo <span className="c-cyan">${r.key}</span>
              </p>
              <p className="term-out">
                {r.href ? (
                  <a
                    href={r.href}
                    target={r.href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                  >
                    {r.value.replace(/^https?:\/\/(www\.)?/, '')}
                  </a>
                ) : (
                  <span className={isTodo(r.value) ? 'todo' : undefined}>{r.value}</span>
                )}
              </p>
            </div>
          ))}
          <p>
            <span className="c-prompt">$</span> <span className="cursor" aria-hidden="true" />
          </p>
        </Window>

        <div className="contact-actions">
          {!isTodo(email) && (
            <a href={`mailto:${email}`} className="btn btn-primary">
              ✉ m’envoyer un email
            </a>
          )}
          {profile.cv && (
            <a href={profile.cv} download className="btn btn-ghost">
              ⬇ télécharger mon CV
            </a>
          )}
        </div>
      </Reveal>
    </Section>
  )
}
