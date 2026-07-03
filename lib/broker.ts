// Identité du courtier — SEUL fichier à modifier pour changer de courtier.
// (Voir aussi : lib/regions.ts, app/globals.css @theme, /public, variables Vercel.)
export const BROKER = {
  name: "Philippe Laroche",
  title: "Courtier immobilier",
  agency: "RE/MAX Cité",
  region: "Montréal",
  phoneDisplay: "514 817-0803",
  phoneTel: "+15148170803",
  email: "philippe.laroche@remax-quebec.com",
  website: "https://philippelarocheimmobilier.com",
  slogan: "Avec Laroche, c'est sur la coche !",
  // Initiales affichées si aucune photo n'est fournie dans /public.
  initials: "PL",
  // Photo du courtier (dans /public). Vide = fallback sur les initiales.
  photo: "/philippe.webp",
  // Cadrage object-position de la photo dans l'avatar rond (focus visage).
  photoPosition: "50% 22%",
} as const;
