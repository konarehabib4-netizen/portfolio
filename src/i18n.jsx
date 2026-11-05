// Traduction du site : français (par défaut) et anglais.
//
// - Les textes de l'interface s'écrivent dans les composants avec tr('français', 'english').
// - Les données (profil, études de cas) sont en français dans src/data/profile.js et etudes.js ;
//   leur version anglaise est dans profile.en.js et etudes.en.js (seuls les textes y figurent,
//   les liens, photos, etc. sont repris automatiquement de la version française).
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { profile as profileFr } from './data/profile'
import { profileEn } from './data/profile.en'
import { etudes as etudesFr } from './data/etudes'
import { etudesEn } from './data/etudes.en'

const LANGUES = ['fr', 'en']
const CLE = 'lang'

// Fusionne la traduction dans l'original : objets champ par champ, tableaux case par case.
function fusionner(original, traduction) {
  if (traduction === undefined) return original
  if (Array.isArray(original)) return original.map((v, i) => fusionner(v, traduction[i]))
  if (original && typeof original === 'object') {
    const res = { ...original }
    for (const k of Object.keys(traduction)) res[k] = fusionner(original[k], traduction[k])
    return res
  }
  return traduction
}

// Langue de départ : ?lang=en dans l'adresse, sinon le dernier choix, sinon celle du navigateur.
function langueInitiale() {
  const url = new URLSearchParams(window.location.search).get('lang')
  if (LANGUES.includes(url)) return url
  try {
    const memo = localStorage.getItem(CLE)
    if (LANGUES.includes(memo)) return memo
  } catch {
    /* stockage indisponible */
  }
  return (navigator.language || 'fr').toLowerCase().startsWith('fr') ? 'fr' : 'en'
}

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState(langueInitiale)

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem(CLE, lang)
    } catch {
      /* stockage indisponible */
    }
  }, [lang])

  const valeur = useMemo(() => {
    const en = lang === 'en'
    return {
      lang,
      setLang,
      basculer: () => setLang((l) => (l === 'fr' ? 'en' : 'fr')),
      tr: (fr, eng) => (en ? eng : fr),
      profile: en ? fusionner(profileFr, profileEn) : profileFr,
      etudes: en ? fusionner(etudesFr, etudesEn) : etudesFr,
    }
  }, [lang])

  return <LangContext.Provider value={valeur}>{children}</LangContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLang = () => useContext(LangContext)
