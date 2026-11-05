import { useLang } from '../i18n'
import { isTodo } from '../helpers'
import { Reveal, Section, Window } from '../utils'

export default function Contact() {
  const { profile, tr } = useLang()
  const { email, phone, github, linkedin } = profile.contact
  const rows = [
    { key: 'EMAIL', value: email, href: isTodo(email) ? '' : `mailto:${email}` },
    phone && { key: tr('TELEPHONE', 'PHONE'), value: phone, href: `tel:${phone.replace(/\s/g, '')}` },
    github && { key: 'GITHUB', value: github, href: github },
    linkedin && { key: 'LINKEDIN', value: linkedin, href: linkedin },
  ].filter(Boolean)

  return (
    <Section id="contact" index="05" cmd="./contact.sh" title="Contact" comment={tr('Un stage, un projet, une question ? Écrivez-moi.', 'An internship, a project, a question? Write to me.')}>
      <Reveal className="contact-wrap">
        <Window title="contact.sh" className="terminal contact-term">
          <p className="c-comment">{tr('# Je suis ouvert aux opportunités de stage et je réponds rapidement.', '# I am open to internship opportunities and reply quickly.')}</p>
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
              ✉ {tr('m’envoyer un email', 'send me an email')}
            </a>
          )}
          {profile.cv && (
            <a href={profile.cv} download className="btn btn-ghost">
              ⬇ {tr('télécharger mon CV', 'download my resume')}
            </a>
          )}
        </div>
      </Reveal>
    </Section>
  )
}
