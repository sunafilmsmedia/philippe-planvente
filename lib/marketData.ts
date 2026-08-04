// ─────────────────────────────────────────────────────────────
// Prix de vente moyen par secteur et par type (valeur = moyenne 2025,
// dernière année complète ; growth = croissance depuis 2019).
// Source : données fournies par Philippe (2019-2025).
//
// Regroupement des secteurs (données par zone) :
//   Pointe Est de l'île → hochelaga, anjou, saint-leonard, montreal-nord,
//                         rdp, montreal-est, pat
//   Terrebonne          → terrebonne, lachenaie
//   Mascouche           → mascouche
//   Repentigny          → repentigny, charlemagne
//
// Terrain : pas de données → aucun prix affiché pour ce type.
// ─────────────────────────────────────────────────────────────

export interface TypeStat {
  price: number;
  growth?: string; // croissance depuis 2019, ex. "+72 %"
}

export interface SectorMarket {
  maison?: TypeStat;
  condo?: TypeStat;
  plex?: TypeStat;
  terrain?: TypeStat;
}

const POINTE_EST: SectorMarket = {
  maison: { price: 560_000, growth: "+72 %" },
  condo: { price: 345_000, growth: "+85 %" },
  plex: { price: 759_000 },
};
const TERREBONNE: SectorMarket = {
  maison: { price: 570_000, growth: "+102 %" },
  condo: { price: 365_000, growth: "+83 %" },
  plex: { price: 730_000 },
};
const MASCOUCHE: SectorMarket = {
  maison: { price: 580_000, growth: "+97 %" },
  condo: { price: 350_000, growth: "+79 %" },
  plex: { price: 820_000 },
};
const REPENTIGNY: SectorMarket = {
  maison: { price: 570_000, growth: "+96 %" },
  condo: { price: 348_000, growth: "+90 %" },
  plex: { price: 700_000 },
};

export const MARKET_DATA: Record<string, SectorMarket> = {
  // Pointe Est de l'île
  hochelaga: POINTE_EST,
  anjou: POINTE_EST,
  "saint-leonard": POINTE_EST,
  "montreal-nord": POINTE_EST,
  rdp: POINTE_EST,
  "montreal-est": POINTE_EST,
  pat: POINTE_EST,
  // Couronne nord-est
  terrebonne: TERREBONNE,
  lachenaie: TERREBONNE,
  mascouche: MASCOUCHE,
  repentigny: REPENTIGNY,
  charlemagne: REPENTIGNY,
};

function statFor(regionId?: string, propertyType?: string): TypeStat | null {
  if (!regionId || !propertyType) return null;
  const m = MARKET_DATA[regionId];
  if (!m) return null;
  return m[propertyType as keyof SectorMarket] ?? null;
}

// Prix moyen pour un secteur + type (null si inconnu).
export function avgPriceFor(regionId?: string, propertyType?: string): number | null {
  const s = statFor(regionId, propertyType);
  return s && s.price > 0 ? s.price : null;
}

// Croissance depuis 2019 pour un secteur + type (null si inconnu).
export function growthFor(regionId?: string, propertyType?: string): string | null {
  return statFor(regionId, propertyType)?.growth ?? null;
}
