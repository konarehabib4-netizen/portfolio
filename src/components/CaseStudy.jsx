import { useEffect } from 'react'
import { etudes } from '../data/etudes'
import { profile } from '../data/profile'
import { Reveal, Window } from '../utils'

// Un bloc de l'étude de cas : petit numéro + commande façon terminal + titre.
function Bloc({ n, cmd, titre, children }) {
  return (
    <section className="cs-bloc">
      <Reveal as="header" className="cs-head">
        <p className="section-cmd">
          <span className="c-num">{n}.</span> <span className="c-prompt">$</span> {cmd}
        </p>
        <h2>{titre}</h2>
      </Reveal>
      {children}
    </section>
  )
}

// Cadre de téléphone autour d'une capture.
function Telephone({ src, legende, delay }) {
  return (
    <Reveal as="figure" className="cs-phone" delay={delay}>
      <div className="cs-phone-frame">
        <img src={src} alt={legende} loading="lazy" />
      </div>
      <figcaption>{legende}</figcaption>
    </Reveal>
  )
}

export default function CaseStudy({ id }) {
  const e = etudes[id]

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = e ? `${e.titre} · étude de cas | ${profile.name}` : profile.name
    return () => {
      document.title = `${profile.name} | Portfolio`
    }
  }, [e])

  if (!e) {
    return (
      <main className="cs container">
        <p className="cs-retour"><a href="#projets">← retour aux projets</a></p>
        <h1>Étude introuvable</h1>
      </main>
    )
  }

  return (
    <main className="cs">
      <div className="container">
        {/* --- En-tête ---------------------------------------------------- */}
        <header className="cs-hero fade-up">
          <p className="cs-retour">
            <a href="#projets"><span className="c-prompt">$</span> cd ../projets</a>
          </p>
          <p className="section-cmd">
            <span className="c-muted">~/projets/</span>
            <span className="c-cyan">{id}</span> <span className="c-muted">›</span> cat etude-de-cas.md
          </p>
          <h1 className="cs-titre">{e.titre}</h1>
          <p className="cs-accroche">{e.accroche}</p>
          <p className="cs-role c-muted">{`// ${e.role}`}</p>
          <div className="hero-buttons">
            {e.demo && (
              <a href={e.demo} className="btn btn-primary" target="_blank" rel="noreferrer">
                <span className="c-prompt">$</span> open demo ↗
              </a>
            )}
            {e.github && (
              <a href={e.github} className="btn btn-ghost" target="_blank" rel="noreferrer">
                git clone ↗
              </a>
            )}
          </div>
          <ul className="cs-chiffres">
            {e.chiffres.map((c) => (
              <li key={c.label}>
                <strong>{c.valeur}</strong>
                <span>{c.label}</span>
              </li>
            ))}
          </ul>
        </header>

        <Reveal className="cs-bureau">
          <Window title={e.demo.replace(/^https?:\/\//, '')} className="cs-browser">
            <img src={e.captures.bureau.src} alt={e.captures.bureau.legende} />
          </Window>
        </Reveal>

        {/* --- 1. Le problème -------------------------------------------- */}
        <Bloc n="01" cmd="cat probleme.txt" titre="Le problème">
          <Reveal className="cs-probleme">
            <p>{e.probleme.intro}</p>
            <ul className="cs-liste">
              {e.probleme.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <p className="cs-objectif">{e.probleme.objectif}</p>
          </Reveal>
        </Bloc>

        {/* --- 2. La solution -------------------------------------------- */}
        <Bloc n="02" cmd="ls fonctionnalites/" titre="La solution">
          <div className="cs-phones">
            {e.captures.mobiles.map((c, i) => (
              <Telephone key={c.src} {...c} delay={i * 120} />
            ))}
          </div>
          <div className="cs-grille">
            {e.fonctions.map((f, i) => (
              <Reveal key={f.titre} className="cs-carte" delay={i * 100}>
                <h3><span aria-hidden="true">{f.icone}</span> {f.titre}</h3>
                <ul className="cs-liste">
                  {f.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </Bloc>

        {/* --- 3. Architecture ------------------------------------------- */}
        <Bloc n="03" cmd="tree architecture/" titre="Architecture">
          <Reveal as="ol" className="cs-archi" aria-label="Chemin d'une requête, du téléphone à la base de données">
            {e.architecture.map((a) => (
              <li key={a.nom} className={`cs-noeud c-${a.couleur}`}>
                <strong>{a.nom}</strong>
                <span>{a.detail}</span>
              </li>
            ))}
          </Reveal>
          <div className="cs-grille cs-choix">
            {e.choix.map((c, i) => (
              <Reveal key={c.tech} className="cs-carte" delay={(i % 3) * 100}>
                <h3 className="c-cyan">{c.tech}</h3>
                <p>{c.pourquoi}</p>
              </Reveal>
            ))}
          </div>
        </Bloc>

        {/* --- 4. Sécurité ----------------------------------------------- */}
        <Bloc n="04" cmd="cat securite.md" titre="Sécurité">
          <Reveal as="ul" className="cs-securite">
            {e.securite.map((s) => (
              <li key={s}><span className="c-green">✔</span> {s}</li>
            ))}
          </Reveal>
        </Bloc>

        {/* --- 5. Défis -------------------------------------------------- */}
        <Bloc n="05" cmd="git log --grep=fix" titre="Défis et solutions">
          <div className="cs-defis">
            {e.defis.map((d, i) => (
              <Reveal key={d.probleme} className="cs-defi" delay={(i % 2) * 100}>
                <p className="cs-defi-pb"><span className="c-orange">✗</span> {d.probleme}</p>
                <p className="cs-defi-sol"><span className="c-green">✔</span> {d.solution}</p>
              </Reveal>
            ))}
          </div>
        </Bloc>

        {/* --- 6. Bilan -------------------------------------------------- */}
        <Bloc n="06" cmd="cat bilan.md" titre="Ce que j’ai appris">
          <div className="cs-grille cs-bilan">
            <Reveal className="cs-carte">
              <h3 className="c-green">Appris</h3>
              <ul className="cs-liste">
                {e.appris.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </Reveal>
            <Reveal className="cs-carte" delay={100}>
              <h3 className="c-orange">Prochaines étapes</h3>
              <ul className="cs-liste">
                {e.suite.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Bloc>

        <Reveal className="cs-fin">
          <p>Ce projet vous intéresse ? Essayez-le, ou parlons-en.</p>
          <div className="hero-buttons">
            {e.demo && (
              <a href={e.demo} className="btn btn-primary" target="_blank" rel="noreferrer">
                <span className="c-prompt">$</span> open demo ↗
              </a>
            )}
            <a href="#contact" className="btn btn-ghost">me contacter</a>
            <a href="#projets" className="btn btn-link">← autres projets</a>
          </div>
        </Reveal>
      </div>
    </main>
  )
}
