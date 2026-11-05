// =====================================================================
//  ÉTUDES DE CAS : le texte des pages « #/etude/<id> ».
//  Modifie le texte ici, enregistre : la page se met à jour toute seule.
//  Les images sont dans public/etude/.
// =====================================================================

export const etudes = {
  loyerfacile: {
    titre: 'LoyerFacile',
    accroche: 'La gestion locative, enfin simple : une application pour les propriétaires et leurs locataires en Côte d’Ivoire.',
    role: 'Projet personnel · conception, développement et mise en ligne',
    demo: 'https://monloyerfacile.vercel.app',
    github: 'https://github.com/konarehabib4-netizen/loyerfacile',
    chiffres: [
      { valeur: '2', label: 'espaces : propriétaire et locataire' },
      { valeur: '7', label: 'tables MySQL reliées' },
      { valeur: 'PWA', label: 'installable sur téléphone' },
      { valeur: '0 F', label: 'd’hébergement (offres gratuites)' },
    ],

    probleme: {
      intro:
        'À Abidjan, beaucoup de propriétaires suivent encore leurs loyers dans un cahier ou sur WhatsApp. Résultat :',
      points: [
        'on ne sait plus quel mois a été payé, ni par qui ;',
        'les paiements Wave ou Orange Money arrivent sans trace écrite ;',
        'les relances sont gênantes et souvent oubliées ;',
        'au départ du locataire, le calcul de la caution donne lieu à des disputes.',
      ],
      objectif:
        'Objectif : une application simple, utilisable sur un petit téléphone, qui donne au propriétaire et au locataire la même vision claire de ce qui est dû.',
    },

    captures: {
      bureau: { src: 'etude/loyerfacile-dashboard-desktop.jpg', legende: 'Tableau de bord du propriétaire (ordinateur)' },
      mobiles: [
        { src: 'etude/loyerfacile-dashboard.jpg', legende: 'Tableau de bord' },
        { src: 'etude/loyerfacile-paiements.jpg', legende: 'Paiements d’un bien' },
        { src: 'etude/loyerfacile-locataire.jpg', legende: 'Espace locataire' },
      ],
    },

    fonctions: [
      {
        icone: '🏠',
        titre: 'Côté propriétaire',
        points: [
          'Biens, unités (appartements, studios…) et locataires',
          'Paiements par mois, avec la situation de chaque locataire',
          'Caution, avance et décompte de sortie automatique',
          'Validation des paiements déclarés par les locataires',
        ],
      },
      {
        icone: '👤',
        titre: 'Côté locataire',
        points: [
          'Compte créé via un lien d’invitation personnel',
          'Mois payés, en attente ou impayés, sur une frise',
          'Déclaration d’un paiement Wave / Orange Money avec sa référence',
          'Reçu et suivi de sa caution',
        ],
      },
      {
        icone: '💬',
        titre: 'WhatsApp et mobile',
        points: [
          'Relance d’un impayé en un clic, message déjà rédigé',
          'Envoi du reçu au locataire par WhatsApp',
          'Installable comme une appli (PWA), bandeau hors ligne',
          'Pensé d’abord pour les petits écrans',
        ],
      },
    ],

    architecture: [
      { nom: 'Téléphone / PC', detail: 'PWA installée ou navigateur', couleur: 'cyan' },
      { nom: 'Site React', detail: 'Vite · Vercel · monloyerfacile.vercel.app', couleur: 'green' },
      { nom: 'API Express', detail: 'Node.js · JWT · Vercel', couleur: 'orange' },
      { nom: 'MySQL', detail: 'Aiven · connexion chiffrée (SSL)', couleur: 'purple' },
    ],

    choix: [
      { tech: 'React + Vite', pourquoi: 'Interface rapide à charger. Un mini-routeur maison basé sur l’URL (#/biens/3) évite une dépendance de plus.' },
      { tech: 'Node.js + Express', pourquoi: 'Le même langage (JavaScript) côté site et côté serveur, et une API REST claire, organisée par routes.' },
      { tech: 'MySQL', pourquoi: 'Les données sont très liées (biens → unités → locataires → paiements) : une base relationnelle est le bon choix.' },
      { tech: 'JWT + rôles', pourquoi: 'Un seul écran de connexion. Le jeton indique si l’on est propriétaire ou locataire et ouvre le bon espace.' },
      { tech: 'PWA', pourquoi: 'S’installe depuis le navigateur, sans passer par le Play Store : idéal pour un premier lancement.' },
      { tech: 'Vercel + Aiven', pourquoi: 'Hébergement gratuit, HTTPS automatique et redéploiement à chaque git push.' },
    ],

    securite: [
      'Mots de passe chiffrés avec bcrypt, jamais stockés en clair',
      'Chaque route vérifie le jeton et le rôle (propriétaire ou locataire)',
      'Un propriétaire ne voit que ses propres biens : contrôle à chaque requête',
      'Requêtes SQL préparées : pas d’injection SQL possible',
      'Lien d’invitation à usage unique, valable 7 jours, stocké sous forme d’empreinte',
      'Secrets (mots de passe, clés) hors de GitHub, dans les variables de Vercel',
    ],

    defis: [
      {
        probleme: 'Les montants changeaient l’historique',
        solution:
          'Si un loyer augmentait, les anciens mois semblaient impayés. J’ai créé une table « échéances » qui fige le montant dû de chaque mois.',
      },
      {
        probleme: 'Le locataire paie hors de l’application',
        solution:
          'Le locataire déclare son paiement (référence Wave / Orange Money). Le propriétaire le valide ou le refuse : chacun garde une trace.',
      },
      {
        probleme: 'Ne pas toucher la mauvaise base',
        solution:
          'Mes scripts de mise en production utilisaient par erreur la base locale. J’ai écrit un lanceur qui refuse de démarrer si la base visée est celle de mon PC.',
      },
      {
        probleme: 'Une appli hors ligne qui reste à jour',
        solution:
          'Le service worker met en cache l’interface, mais jamais les données de l’API, pour ne jamais afficher un solde périmé.',
      },
    ],

    appris: [
      'Concevoir une base de données à partir d’un vrai besoin métier',
      'Sécuriser une API : authentification, rôles et droits d’accès',
      'Mettre en ligne une application complète : site, API et base séparés',
      'Penser « mobile d’abord » pour des utilisateurs réels',
    ],
    suite: [
      'Paiement Mobile Money directement dans l’application (agrégateur de paiement)',
      'Rappels automatiques avant la date du loyer',
      'Quittances de loyer en PDF',
    ],
  },
}
