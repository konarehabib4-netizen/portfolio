// Génère public/cv.pdf à partir de cv/cv.html avec Microsoft Edge (mode headless).
// Utilisation :  npm run cv
import { execFileSync } from 'node:child_process'
import { existsSync, rmSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const candidates = [
  process.env.BROWSER_PATH,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
].filter(Boolean)

const browser = candidates.find((p) => existsSync(p))
if (!browser) {
  console.error('Edge ou Chrome introuvable. Indique son chemin dans la variable BROWSER_PATH.')
  process.exit(1)
}

const input = pathToFileURL(resolve('cv/cv.html')).href
const output = resolve('public/cv.pdf')
// Profil séparé (dans node_modules, ignoré par git) : évite de réutiliser un Edge déjà ouvert.
const profile = resolve('node_modules/.cv-edge')
rmSync(output, { force: true })

execFileSync(browser, [
  '--headless',
  `--user-data-dir=${profile}`,
  '--no-first-run',
  '--disable-gpu',
  '--no-pdf-header-footer',
  '--virtual-time-budget=8000', // laisse le temps aux polices de se charger
  `--print-to-pdf=${output}`,
  input,
], { stdio: ['ignore', 'pipe', 'pipe'] })

// Sous Windows, Edge peut rendre la main avant d'avoir fini : on attend le fichier.
for (let i = 0; i < 60 && !existsSync(output); i++) {
  await new Promise((r) => setTimeout(r, 250))
}
await new Promise((r) => setTimeout(r, 500))

if (!existsSync(output)) {
  console.error('Le PDF n’a pas été créé. Ferme Edge et relance « npm run cv ».')
  process.exit(1)
}

console.log(`CV généré : public/cv.pdf (${Math.round(statSync(output).size / 1024)} Ko)`)
