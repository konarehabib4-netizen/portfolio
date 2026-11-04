// =====================================================================
//  TOUTES TES INFORMATIONS PERSONNELLES SONT ICI.
//  Modifie ce fichier, enregistre (Ctrl+S) : le site se met à jour tout seul.
//
//  Tout texte qui commence par "[À COMPLÉTER" s'affiche surligné en
//  pointillés sur le site, pour que tu repères ce qu'il reste à remplir.
//  Un lien vide ('') n'affiche pas de bouton.
// =====================================================================

export const profile = {
  // --- Identité -------------------------------------------------------
  name: 'Konare Habib',
  title: 'Développeur Web, Mobile & Desktop',
  location: 'Abidjan, Côte d’Ivoire',
  // Photo : place ton image dans le dossier "public" (ex. public/photo.jpg)
  // puis écris ici 'photo.jpg'. Laisse '' pour afficher tes initiales.
  photo: 'photo.jpeg',
  // CV : place ton PDF dans "public" (ex. public/cv.pdf) puis écris 'cv.pdf'.
  cv: 'cv.pdf',
  available: 'Recherche un stage en développement d’applications',

  // --- Accueil et À propos ---------------------------------------------
  tagline:
    'Étudiant en Licence 3 à l’ESATIC, je conçois des applications web en React et Node.js, mobiles en Kotlin et Flutter, et desktop en C#.',
  bio: [
    'Titulaire d’un BTS en Informatique Développeur d’Applications (IDA) obtenu à Pigier Côte d’Ivoire, je poursuis une Licence en Développement d’Applications et Systèmes d’Information à l’ESATIC, à Abidjan.',
    'Après un an de stage chez Côte d’Ivoire Énergies, entre support informatique et développement d’applications internes, j’aime transformer des besoins concrets en applications utiles : services de proximité, épargne collective, prévention des risques d’inondation.',
    'Je recherche aujourd’hui un stage en développement d’applications pour mettre mes compétences au service d’une équipe et continuer à progresser.',
  ],
  stats: [
    { value: '1 an', label: 'de stage chez Côte d’Ivoire Énergies' },
    { value: '5', label: 'projets réalisés ou en cours' },
    { value: 'Bac+3', label: 'en cours à l’ESATIC' },
  ],

  // --- Compétences -----------------------------------------------------
  skills: [
    { category: 'Web', icon: '🌐', items: ['React', 'JavaScript', 'HTML', 'CSS'] },
    { category: 'Back-end', icon: '⚙️', items: ['Node.js', 'Express', 'API REST', 'Postman'] },
    { category: 'Mobile', icon: '📱', items: ['Kotlin', 'Flutter', 'Android'] },
    { category: 'Desktop', icon: '🖥️', items: ['C#', '.NET'] },
    { category: 'Données', icon: '🗄️', items: ['SQL', 'MySQL', 'MongoDB', 'Firebase'] },
    { category: 'IA, support & outils', icon: '🤖', items: ['Agents IA', 'Support informatique', 'Git', 'VS Code'] },
  ],

  // --- Projets ---------------------------------------------------------
  // Pour chaque projet : github et demo = URL complète, ou '' pour masquer.
  projects: [
    {
      title: 'Gaz Proximité',
      description:
        'Application mobile pour trouver un point de vente de gaz à proximité de l’école : carte des vendeurs, recherche, commande en ligne et notifications.',
      tags: ['Kotlin', 'Android'],
      github: 'https://github.com/konarehabib4-netizen/gazproximiter',
      demo: '',
    },
    {
      title: 'Cota',
      description:
        'Application mobile de tontine : gestion des membres, suivi des cotisations, rappels de paiement et historique. API REST en Node.js / Express testée avec Postman, données stockées dans MySQL.',
      tags: ['Flutter', 'Node.js', 'Express', 'MySQL', 'Postman'],
      github: '',
      demo: '',
    },
    {
      title: 'LoyerFacile',
      description:
        'Application web de gestion locative pour propriétaires : immeubles, logements, locataires et suivi des paiements de loyer. Front-end React (Vite), API REST Node.js / Express sécurisée par JWT, base de données MySQL.',
      tags: ['En cours', 'React', 'Node.js', 'Express', 'MySQL', 'JWT'],
      github: 'https://github.com/konarehabib4-netizen/loyerfacile',
      demo: '',
    },
    {
      title: 'Projet APP : prévention des inondations',
      description:
        'Projet d’Apprentissage Par Projet (en cours) à l’ESATIC sur le thème « Les technologies numériques intelligentes au service de la prévention et de la gestion des risques d’inondation en Côte d’Ivoire ».',
      tags: ['En cours', 'Travail en équipe'],
      github: '',
      demo: '',
    },
    {
      title: 'Agent IA',
      description:
        'Conception d’un agent d’intelligence artificielle basé sur Hermes et propulsé par le modèle Claude, capable d’automatiser des tâches.',
      tags: ['IA', 'Hermes', 'Claude'],
      github: '',
      demo: '',
    },
  ],

  // --- Parcours --------------------------------------------------------
  education: [
    {
      period: '2026 – 2027',
      title: 'Licence Développement d’Applications et Systèmes d’Information',
      place: 'ESATIC, Abidjan',
      details: 'Licence 3 en cours.',
    },
    {
      period: '2024',
      title: 'BTS Informatique Développeur d’Applications (IDA)',
      place: 'Pigier Côte d’Ivoire',
      details: 'Diplôme obtenu en 2024, soutenance en décembre 2025.',
    },
  ],
  experience: [
    {
      period: 'Février 2025 – Janvier 2026',
      title: 'Stagiaire en informatique (1 an)',
      place: 'Côte d’Ivoire Énergies',
      details:
        'Support informatique (configuration des imprimantes, assistance aux agents), conception des maquettes et de l’interface web du projet d’électrification rurale, et participation au développement des applications internes.',
    },
  ],

  // --- Contact ---------------------------------------------------------
  contact: {
    email: 'konarehabib4@gmail.com',
    phone: '+225 07 87 58 23 45', // laisse '' pour ne pas l'afficher
    github: 'https://github.com/konarehabib4-netizen',
    linkedin: 'https://www.linkedin.com/in/konare-habib-25a421326',
  },
}
