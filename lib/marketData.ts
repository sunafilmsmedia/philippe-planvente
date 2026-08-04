// ─────────────────────────────────────────────────────────────
// Prix de vente moyen par secteur (moyenne des 6 dernières années).
// À REMPLIR avec les données fournies par Philippe.
//
// Clés = id des secteurs (voir lib/regions.ts) :
//   hochelaga · anjou · saint-leonard · montreal-nord · rdp · montreal-est
//   pat · charlemagne · repentigny · lachenaie · terrebonne · mascouche
//
// Pour chaque secteur, mets soit un prix par type de propriété, soit un
// prix global `all` (moyenne toutes propriétés). Le type a priorité.
// ─────────────────────────────────────────────────────────────

export interface SectorMarket {
  maison?: number;
  condo?: number;
  plex?: number;
  terrain?: number;
  all?: number; // moyenne toutes propriétés confondues (fallback)
}

// EXEMPLE de format (à remplacer par les vraies données) :
// export const MARKET_DATA: Record<string, SectorMarket> = {
//   repentigny: { maison: 545000, condo: 375000, plex: 620000 },
//   terrebonne: { maison: 560000, condo: 390000, plex: 640000 },
//   ...
// };
export const MARKET_DATA: Record<string, SectorMarket> = {
  // (vide pour l'instant — le bloc « prix moyen » s'affiche dès que les
  // données d'un secteur sont ajoutées ici)
};

// Retourne le prix moyen pour un secteur + type donné (ou null si inconnu).
export function avgPriceFor(regionId?: string, propertyType?: string): number | null {
  if (!regionId) return null;
  const m = MARKET_DATA[regionId];
  if (!m) return null;
  if (propertyType) {
    const t = m[propertyType as keyof SectorMarket];
    if (typeof t === "number" && t > 0) return t;
  }
  return typeof m.all === "number" && m.all > 0 ? m.all : null;
}
