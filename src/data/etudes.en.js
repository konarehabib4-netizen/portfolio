// =====================================================================
//  VERSION ANGLAISE DES ÉTUDES DE CAS (src/data/etudes.js).
//  Même structure et même ordre que le fichier français.
// =====================================================================

export const etudesEn = {
  loyerfacile: {
    accroche: 'Property management made simple: an app for landlords and their tenants in Côte d’Ivoire.',
    role: 'Personal project · design, development and deployment',
    chiffres: [
      { label: 'spaces: landlord and tenant' },
      { label: 'linked MySQL tables' },
      { label: 'installable on phones' },
      { valeur: '$0', label: 'hosting cost (free tiers)' },
    ],

    probleme: {
      intro: 'In Abidjan, many landlords still track rent in a notebook or on WhatsApp. As a result:',
      points: [
        'nobody knows which month was paid, or by whom;',
        'Wave or Orange Money payments arrive with no written record;',
        'reminders are awkward and often forgotten;',
        'when a tenant moves out, calculating the deposit leads to disputes.',
      ],
      objectif:
        'Goal: a simple app, usable on a small phone, that gives the landlord and the tenant the same clear view of what is owed.',
    },

    captures: {
      bureau: { legende: 'Landlord dashboard (desktop)' },
      mobiles: [{ legende: 'Dashboard' }, { legende: 'Payments for a property' }, { legende: 'Tenant space' }],
    },

    fonctions: [
      {
        titre: 'For landlords',
        points: [
          'Properties, units (apartments, studios…) and tenants',
          'Monthly payments, with each tenant’s status',
          'Deposit, advance and automatic move-out settlement',
          'Approval of payments declared by tenants',
        ],
      },
      {
        titre: 'For tenants',
        points: [
          'Account created from a personal invitation link',
          'Paid, pending or unpaid months on a timeline',
          'Declaring a Wave / Orange Money payment with its reference',
          'Receipt and deposit tracking',
        ],
      },
      {
        titre: 'WhatsApp and mobile',
        points: [
          'One-click reminder for unpaid rent, message pre-written',
          'Receipt sent to the tenant via WhatsApp',
          'Installable like an app (PWA), offline banner',
          'Designed for small screens first',
        ],
      },
    ],

    architecture: [
      { nom: 'Phone / PC', detail: 'Installed PWA or browser' },
      { nom: 'React site' },
      { nom: 'Express API' },
      { detail: 'Aiven · encrypted connection (SSL)' },
    ],

    choix: [
      { pourquoi: 'Fast-loading interface. A home-made URL-based mini router (#/biens/3) avoids an extra dependency.' },
      { pourquoi: 'The same language (JavaScript) on the front end and the server, and a clear REST API organised by routes.' },
      { pourquoi: 'The data is highly related (properties → units → tenants → payments): a relational database is the right choice.' },
      { tech: 'JWT + roles', pourquoi: 'A single login screen. The token says whether you are a landlord or a tenant and opens the right space.' },
      { pourquoi: 'Installs from the browser, without going through the Play Store: ideal for a first launch.' },
      { pourquoi: 'Free hosting, automatic HTTPS and redeployment on every git push.' },
    ],

    securite: [
      'Passwords hashed with bcrypt, never stored in plain text',
      'Every route checks the token and the role (landlord or tenant)',
      'A landlord only sees their own properties: checked on every request',
      'Prepared SQL statements: no SQL injection possible',
      'Single-use invitation link, valid for 7 days, stored as a hash',
      'Secrets (passwords, keys) kept out of GitHub, in Vercel variables',
    ],

    defis: [
      {
        probleme: 'Changing amounts rewrote history',
        solution:
          'If a rent went up, past months looked unpaid. I created a “due dates” table that freezes the amount owed for each month.',
      },
      {
        probleme: 'Tenants pay outside the app',
        solution:
          'The tenant declares the payment (Wave / Orange Money reference). The landlord approves or rejects it: both keep a record.',
      },
      {
        probleme: 'Never touching the wrong database',
        solution:
          'My deployment scripts were mistakenly using the local database. I wrote a launcher that refuses to start if the target database is the one on my PC.',
      },
      {
        probleme: 'An offline app that stays up to date',
        solution:
          'The service worker caches the interface but never the API data, so an outdated balance is never shown.',
      },
    ],

    appris: [
      'Designing a database from a real business need',
      'Securing an API: authentication, roles and access rights',
      'Deploying a full application: separate site, API and database',
      'Thinking “mobile first” for real users',
    ],
    suite: [
      'Mobile Money payments directly in the app (payment aggregator)',
      'Automatic reminders before rent is due',
      'Rent receipts as PDF',
    ],
  },
}
