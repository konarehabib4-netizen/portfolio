# Mon portfolio (React + Vite)

Portfolio de développeur : Accueil, À propos, Compétences, Projets, Parcours, Contact.
Design « terminal / code » : terminal interactif dans l'accueil (tapez `help`, `projets`, `cv`, `embauche`…), compétences en objet JavaScript,
parcours en `git log`. Mode sombre/clair, responsive (mobile), animations légères.

## 1. Lancer le site sur ton PC

Dans VS Code, ouvre un terminal (**Terminal > Nouveau terminal**, ou `` Ctrl+` ``) :

```bash
npm install      # une seule fois : installe les dépendances (dossier node_modules)
npm run dev      # lance le site sur http://localhost:5173
```

Laisse ce terminal ouvert : chaque fois que tu enregistres un fichier (`Ctrl+S`),
la page se met à jour toute seule. `Ctrl+C` dans le terminal arrête le serveur.

## 2. Modifier tes informations

**Tout est dans un seul fichier : [`src/data/profile.js`](src/data/profile.js).**

- Les textes qui contiennent `[À COMPLÉTER` sont **surlignés en pointillés orange** sur le site :
  remplace-les par tes vraies infos, et le surlignage disparaît.
- Un lien vide (`''`) n'affiche pas de bouton : mets l'URL complète (`https://...`) pour le faire apparaître.
- **Photo** : copie ton image dans le dossier `public/` (ex. `public/photo.jpg`), puis écris `photo: 'photo.jpg'`.
  Une photo carrée d'au moins 600 × 600 px donne le meilleur résultat.
- **CV** : copie ton PDF dans `public/` (ex. `public/cv.pdf`), puis écris `cv: 'cv.pdf'`.
  Un bouton « Télécharger mon CV » apparaît dans l'accueil.
- **Ajouter un projet** : copie un bloc `{ title: ..., description: ..., tags: [...], github: '', demo: '' },`
  dans la liste `projects` et modifie-le.

Les couleurs du thème se règlent en haut de [`src/index.css`](src/index.css) (variables `--green`, `--orange`, `--cyan`…).

## Modifier le CV

Le CV est une page HTML : [`cv/cv.html`](cv/cv.html) (photo : `cv/photo-cv.jpg`).
Modifie le texte, puis régénère le PDF (avec Microsoft Edge, déjà installé sur Windows) :

```bash
npm run cv       # crée public/cv.pdf, téléchargeable depuis le bouton du portfolio
```

Pour voir le CV avant de générer le PDF, ouvre `cv/cv.html` dans ton navigateur.
Quand le portfolio est en ligne, décommente la ligne « PORTFOLIO » dans `cv/cv.html` et mets son adresse.

## 3. Structure du projet

```
public/              fichiers servis tels quels (photo, CV, favicon)
src/
  data/profile.js    ← TES DONNÉES (le seul fichier à modifier au quotidien)
  components/        une section du site = un composant React
    Navbar.jsx       barre de navigation + bouton CV + thème + menu mobile
    Hero.jsx         accueil : terminal animé (buildIntro) et commandes tapables (buildCommands)
    Spotlight.jsx    halo lumineux qui suit la souris
    About.jsx        à propos
    Skills.jsx       compétences
    Projects.jsx     projets
    Journey.jsx      parcours (formation + expériences)
    Contact.jsx      contact
  App.jsx            assemble les sections, gère le mode sombre/clair
  utils.jsx          composants partagés (Section, Window, Reveal, Scramble, CountUp)
  helpers.js         petites fonctions (initiales, détection des [À COMPLÉTER])
  index.css          tout le style
index.html           page HTML de base (titre, polices)
```

## 4. Mettre en ligne gratuitement (Vercel)

À faire **une seule fois** :

1. Crée un compte sur <https://github.com>, puis un dépôt vide nommé `portfolio`
   (**New repository**, sans README, sans .gitignore).
2. Dans le terminal VS Code, relie ton projet à ce dépôt et envoie le code
   (remplace `TON-PSEUDO` par ton pseudo GitHub) :
   ```bash
   git remote add origin https://github.com/TON-PSEUDO/portfolio.git
   git push -u origin main
   ```
   La première fois, une fenêtre s'ouvre pour te connecter à GitHub.
3. Va sur <https://vercel.com>, clique **Sign Up**, puis **Continue with GitHub**.
4. **Add New… > Project**, choisis le dépôt `portfolio`, puis **Import**.
   Vercel détecte Vite tout seul (Build : `npm run build`, dossier : `dist`). Clique **Deploy**.
5. Une minute plus tard, ton site est en ligne, par exemple sur `https://portfolio-xxxx.vercel.app`.
   Tu peux changer ce nom dans **Settings > Domains** (ex. `prenom-nom.vercel.app`).

## 5. Redéployer après une modification

Le site en ligne se met à jour **tout seul** à chaque `git push` :

```bash
git add .
git commit -m "Mise à jour de mes projets"
git push
```

Attends environ une minute, puis rafraîchis ton site.

## Autres commandes utiles

```bash
npm run build     # fabrique la version finale dans dist/ (ce que fait Vercel)
npm run preview   # affiche cette version finale en local
npm run lint      # vérifie le code
```

> Alternative : le site fonctionne aussi sur Netlify ou GitHub Pages (`base: './'` dans `vite.config.js`).
