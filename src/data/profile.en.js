// =====================================================================
//  VERSION ANGLAISE DU PROFIL (src/data/profile.js).
//  Seuls les textes sont ici, dans le MÊME ORDRE que dans profile.js.
//  Un champ absent reste en français (pratique pour les noms propres).
//  Si tu ajoutes un projet dans profile.js, ajoute sa traduction ici au même rang.
// =====================================================================

export const profileEn = {
  title: 'Web, Mobile & Desktop Developer',
  location: 'Abidjan, Ivory Coast',
  available: 'Looking for a software development internship',

  tagline:
    'Third-year Bachelor’s student at ESATIC, I build web apps with React and Node.js, mobile apps with Kotlin and Flutter, and desktop apps with C#.',
  bio: [
    'After a two-year technical degree (BTS) in Software Development (IDA) from Pigier Côte d’Ivoire, I am now completing a Bachelor’s degree in Application Development and Information Systems at ESATIC, in Abidjan.',
    'Following a one-year internship at Côte d’Ivoire Énergies, between IT support and internal application development, I enjoy turning real needs into useful apps: local services, group savings, flood-risk prevention.',
    'I am now looking for a software development internship, to bring my skills to a team and keep growing.',
  ],
  stats: [
    { label: 'internship at Côte d’Ivoire Énergies', value: '1 yr' },
    { label: 'projects completed or in progress' },
    { label: 'in progress at ESATIC', value: 'Year 3' },
  ],

  skills: [
    {},
    {},
    {},
    {},
    { category: 'Data' },
    { category: 'AI, support & tools', items: ['AI agents', 'IT support', 'Git', 'VS Code'] },
  ],

  projects: [
    {
      description:
        'Mobile app to find a gas vendor near the school: vendor map, search, online ordering and notifications.',
    },
    {
      description:
        'Mobile app for tontines (rotating savings groups): member management, contribution tracking, payment reminders and history. REST API in Node.js / Express tested with Postman, data stored in MySQL.',
    },
    {
      description:
        'Online property management app, installable on phones (PWA). For landlords: properties, tenants, rents, deposits and move-out settlement. For tenants: a personal space showing unpaid months and payment declaration (Wave, Orange Money…). Reminders and receipts via WhatsApp. React (Vite), Node.js / Express API secured with JWT and roles, hosted MySQL (Aiven), deployed on Vercel.',
    },
    {
      title: 'APP project: flood prevention',
      description:
        'Project-Based Learning assignment (in progress) at ESATIC on the theme “Smart digital technologies for the prevention and management of flood risks in Côte d’Ivoire”.',
      tags: ['In progress', 'Teamwork'],
    },
    {
      title: 'AI agent',
      description: 'Design of an artificial intelligence agent based on Hermes and powered by the Claude model, able to automate tasks.',
      tags: ['AI'],
    },
  ],

  education: [
    {
      title: 'Bachelor’s in Application Development and Information Systems',
      details: 'Third year in progress.',
    },
    {
      title: 'BTS (two-year degree) in Software Development (IDA)',
      details: 'Degree obtained in 2024, final defense in December 2025.',
    },
  ],
  experience: [
    {
      period: 'February 2025 – January 2026',
      title: 'IT intern (1 year)',
      details:
        'IT support (printer setup, user assistance), design of the mock-ups and web interface for the rural electrification project, and contribution to internal applications.',
    },
  ],
}
