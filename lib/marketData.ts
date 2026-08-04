// ─────────────────────────────────────────────────────────────
// Prix médians par secteur et par type. Source : stats APCIQ/Centris
// (cumul des 4 derniers trimestres, T2 2026) fournies par Philippe.
//   price  = prix médian (cumul 4 trimestres)
//   growth = croissance depuis 2019
//   days   = moyenne de jours sur le marché (cumul 4 trimestres)
//
// Regroupement des secteurs (données par zone) :
//   Île-Est (RDP / PAT / Mtl-Est + arrond. est) → hochelaga, anjou,
//        saint-leonard, montreal-nord, rdp, montreal-est, pat
//   Terrebonne (La Plaine) → terrebonne, lachenaie
//   Mascouche              → mascouche
//   Repentigny             → repentigny, charlemagne
// ─────────────────────────────────────────────────────────────

export interface TypeStat {
  price: number;
  growth?: string; // croissance depuis 2019, ex. "+72 %"
  days?: number; // moyenne de jours sur le marché
}

export interface SectorMarket {
  maison?: TypeStat;
  condo?: TypeStat;
  plex?: TypeStat;
  terrain?: TypeStat;
}

const ILE_EST: SectorMarket = {
  maison: { price: 580_000, growth: "+72 %", days: 35 },
  condo: { price: 351_000, growth: "+85 %", days: 39 },
  plex: { price: 783_000, days: 47 },
};
const TERREBONNE: SectorMarket = {
  maison: { price: 515_000, growth: "+102 %", days: 26 },
  condo: { price: 333_000, growth: "+83 %", days: 31 },
  plex: { price: 730_000 },
};
const MASCOUCHE: SectorMarket = {
  maison: { price: 606_000, growth: "+97 %", days: 25 },
  condo: { price: 359_000, growth: "+79 %", days: 31 },
  plex: { price: 808_000, days: 52 },
};
const REPENTIGNY: SectorMarket = {
  maison: { price: 596_000, growth: "+96 %", days: 25 },
  condo: { price: 352_000, growth: "+90 %", days: 41 },
  plex: { price: 700_000 },
};

export const MARKET_DATA: Record<string, SectorMarket> = {
  // Île-Est
  hochelaga: ILE_EST,
  anjou: ILE_EST,
  "saint-leonard": ILE_EST,
  "montreal-nord": ILE_EST,
  rdp: ILE_EST,
  "montreal-est": ILE_EST,
  pat: ILE_EST,
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

// Prix médian pour un secteur + type (null si inconnu).
export function avgPriceFor(regionId?: string, propertyType?: string): number | null {
  const s = statFor(regionId, propertyType);
  return s && s.price > 0 ? s.price : null;
}

// Croissance depuis 2019 pour un secteur + type (null si inconnu).
export function growthFor(regionId?: string, propertyType?: string): string | null {
  return statFor(regionId, propertyType)?.growth ?? null;
}

// Moyenne de jours sur le marché pour un secteur + type (null si inconnu).
export function daysFor(regionId?: string, propertyType?: string): number | null {
  return statFor(regionId, propertyType)?.days ?? null;
}
