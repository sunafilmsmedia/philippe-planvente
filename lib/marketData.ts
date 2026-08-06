// ─────────────────────────────────────────────────────────────
// Marché immobilier — Est de Montréal + couronne nord-est (~25 km).
//
// 2 concepts :
//   • ZONES de prix (5) : où on a des statistiques réelles. price = prix
//     moyen 2025 ; growth = croissance depuis 2019 ; days = délai de vente
//     moyen (APCIQ, cumul 4 trimestres) quand disponible.
//   • SECTEURS recherchables (~30 villes/quartiers) : chacun rattaché à la
//     zone de prix la PLUS PROCHE → on donne toujours un prix indicatif.
// ─────────────────────────────────────────────────────────────

export type ZoneId =
  | "ile-est"
  | "terrebonne"
  | "mascouche"
  | "repentigny"
  | "rive-nord-est";

export interface TypeStat {
  price: number;
  growth?: string; // croissance depuis 2019
  days?: number; // moyenne de jours sur le marché
}

export interface ZoneMarket {
  maison?: TypeStat;
  condo?: TypeStat;
  plex?: TypeStat;
  terrain?: TypeStat;
}

export const ZONE_DATA: Record<ZoneId, ZoneMarket> = {
  // Pointe Est de l'île (RDP / PAT / Mtl-Est + arrondissements est)
  "ile-est": {
    maison: { price: 560_000, growth: "+72 %", days: 35 },
    condo: { price: 345_000, growth: "+85 %", days: 39 },
    plex: { price: 759_000, days: 47 },
  },
  // Terrebonne, Lachenaie, La Plaine, Bois-des-Filion, Sainte-Anne-des-Plaines
  terrebonne: {
    maison: { price: 570_000, growth: "+102 %", days: 26 },
    condo: { price: 365_000, growth: "+83 %", days: 31 },
    plex: { price: 730_000 },
  },
  mascouche: {
    maison: { price: 580_000, growth: "+97 %", days: 25 },
    condo: { price: 350_000, growth: "+79 %", days: 31 },
    plex: { price: 820_000, days: 52 },
  },
  // Repentigny, Le Gardeur, Charlemagne
  repentigny: {
    maison: { price: 570_000, growth: "+96 %", days: 25 },
    condo: { price: 348_000, growth: "+90 %", days: 41 },
    plex: { price: 700_000 },
  },
  // Est de la Rive-Nord : L'Assomption, Lavaltrie, St-Sulpice, L'Épiphanie, St-Roch
  "rive-nord-est": {
    maison: { price: 498_900, growth: "+112 %" },
    condo: { price: 355_000, growth: "+113 %" },
    plex: { price: 650_000 },
  },
};

export interface Sector {
  id: string;
  name: string;
  zone: ZoneId;
  aliases?: string[];
}

// Secteurs recherchables (chacun rattaché à la zone de prix la plus proche).
export const SECTORS: Sector[] = [
  // ── Île de Montréal — est ──────────────────────────────
  { id: "pointe-aux-trembles", name: "Pointe-aux-Trembles", zone: "ile-est", aliases: ["pat"] },
  { id: "riviere-des-prairies", name: "Rivière-des-Prairies", zone: "ile-est", aliases: ["rdp"] },
  { id: "montreal-est", name: "Montréal-Est", zone: "ile-est" },
  { id: "anjou", name: "Anjou", zone: "ile-est" },
  { id: "saint-leonard", name: "Saint-Léonard", zone: "ile-est", aliases: ["st leonard"] },
  { id: "montreal-nord", name: "Montréal-Nord", zone: "ile-est" },
  { id: "mercier", name: "Mercier", zone: "ile-est", aliases: ["tetreaultville"] },
  { id: "hochelaga", name: "Hochelaga-Maisonneuve", zone: "ile-est", aliases: ["hochelaga", "maisonneuve", "homa"] },
  { id: "rosemont", name: "Rosemont–La Petite-Patrie", zone: "ile-est", aliases: ["rosemont", "petite patrie"] },
  { id: "saint-michel", name: "Saint-Michel", zone: "ile-est" },
  { id: "villeray", name: "Villeray", zone: "ile-est" },
  { id: "ahuntsic", name: "Ahuntsic", zone: "ile-est" },
  // ── Repentigny / Charlemagne ───────────────────────────
  { id: "repentigny", name: "Repentigny", zone: "repentigny" },
  { id: "le-gardeur", name: "Le Gardeur", zone: "repentigny", aliases: ["gardeur"] },
  { id: "charlemagne", name: "Charlemagne", zone: "repentigny" },
  // ── Est de la Rive-Nord (Lanaudière) ───────────────────
  { id: "lassomption", name: "L'Assomption", zone: "rive-nord-est", aliases: ["assomption"] },
  { id: "saint-sulpice", name: "Saint-Sulpice", zone: "rive-nord-est" },
  { id: "lepiphanie", name: "L'Épiphanie", zone: "rive-nord-est", aliases: ["epiphanie"] },
  { id: "lavaltrie", name: "Lavaltrie", zone: "rive-nord-est" },
  { id: "saint-roch-achigan", name: "Saint-Roch-de-l'Achigan", zone: "rive-nord-est", aliases: ["saint roch"] },
  // ── Terrebonne ─────────────────────────────────────────
  { id: "terrebonne", name: "Terrebonne", zone: "terrebonne" },
  { id: "lachenaie", name: "Lachenaie", zone: "terrebonne" },
  { id: "la-plaine", name: "La Plaine", zone: "terrebonne" },
  { id: "bois-des-filion", name: "Bois-des-Filion", zone: "terrebonne" },
  { id: "lorraine", name: "Lorraine", zone: "terrebonne" },
  { id: "rosemere", name: "Rosemère", zone: "terrebonne" },
  { id: "sainte-anne-des-plaines", name: "Sainte-Anne-des-Plaines", zone: "terrebonne", aliases: ["sadp"] },
  // ── Mascouche ──────────────────────────────────────────
  { id: "mascouche", name: "Mascouche", zone: "mascouche" },
];

function zoneOf(sectorId?: string): ZoneId | null {
  return SECTORS.find((s) => s.id === sectorId)?.zone ?? null;
}

export function sectorName(sectorId?: string): string {
  return SECTORS.find((s) => s.id === sectorId)?.name ?? "";
}

function statFor(sectorId?: string, propertyType?: string): TypeStat | null {
  const z = zoneOf(sectorId);
  if (!z || !propertyType) return null;
  return ZONE_DATA[z][propertyType as keyof ZoneMarket] ?? null;
}

// Prix médian pour un secteur + type (via sa zone de prix). Null si inconnu.
export function avgPriceFor(sectorId?: string, propertyType?: string): number | null {
  const s = statFor(sectorId, propertyType);
  return s && s.price > 0 ? s.price : null;
}

export function growthFor(sectorId?: string, propertyType?: string): string | null {
  return statFor(sectorId, propertyType)?.growth ?? null;
}

export function daysFor(sectorId?: string, propertyType?: string): number | null {
  return statFor(sectorId, propertyType)?.days ?? null;
}
