export type PropertyType =
  | "maison"
  | "condo"
  | "plex"
  | "chalet"
  | "terrain"
  | "autre";

export type SellingMotivation =
  | "upsize" // Acheter plus grand
  | "reduce_payments" // Réduire mes paiements
  | "relocation" // Changer de région
  | "separation" // Séparation / changement personnel
  | "autre" // Autre raison
  | "no_sell"; // Je ne veux pas vendre → court-circuit

export type SellingTiming =
  | "now" // Maintenant / prochaines semaines
  | "1_3" // 1 à 3 mois
  | "3_6" // 3 à 6 mois
  | "6_12" // 6 à 12 mois
  | "unsure"; // Je ne sais pas encore

// Années de possession (proxy d'équité : amortissement ~25 ans + plus-value).
export type YearsOwned =
  | "0_2" // Moins de 3 ans
  | "3_7" // 3 à 7 ans
  | "8_14" // 8 à 14 ans
  | "15_plus"; // 15 ans ou plus

export type PropertyCondition =
  | "ready" // Prête à vendre
  | "minor_reno" // Quelques rénovations mineures
  | "staging" // Besoin de home staging / préparation
  | "major_work" // Beaucoup de travaux à prévoir
  | "unsure"; // Je ne suis pas sûr

export type SalePreference =
  | "highest_price" // Vendre le plus cher possible
  | "fast" // Vendre rapidement
  | "no_stress" // Vendre sans stress
  | "clear_strategy" // Avoir une stratégie claire
  | "compare_options"; // Comparer mes options

export type ValueBracket =
  | "300_400"
  | "400_500"
  | "500_600"
  | "600_700"
  | "700_800"
  | "800_900"
  | "autre";

export type Region = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

export interface Answers {
  propertyType?: PropertyType;
  sellingMotivation?: SellingMotivation;
  timing?: SellingTiming;
  // Tranche de valeur choisie + valeur numérique dérivée (point milieu de la
  // tranche) utilisée pour le calcul d'équité et le CRM.
  valueBracket?: ValueBracket;
  estimatedValue?: number;
  yearsOwned?: YearsOwned;
  propertyCondition?: PropertyCondition;
  salePreference?: SalePreference;
  // hasContract = true bloque le formulaire (déjà sous contrat de courtage
  // avec un autre courtier — restriction légale au Québec).
  // wantsToSwitch = true débloque (l'utilisateur veut changer de courtier).
  hasContract?: boolean;
  wantsToSwitch?: boolean;
  region?: string;
}

// Verdicts = type de plan recommandé par le logiciel.
//   offensif    : 70-100 → prêt, mise en marché forte
//   strategique : 50-69  → bon potentiel, préparer intelligemment
//   preparation : < 50   → préparer / clarifier avant de vendre
export type Verdict = "offensif" | "strategique" | "preparation";

export interface ScoringResult {
  score: number;
  verdict: Verdict;
  factors: ScoringFactor[];
  metrics: {
    estimatedValue: number;
    equityLabel: string;
  };
}

export interface ScoringFactor {
  label: string;
  delta: number;
  tone: "positive" | "negative" | "neutral";
}

export interface ReportStat {
  label: string;
  value: string;
  detail: string;
}

export interface ReportStep {
  title: string;
  description: string;
}

export interface Report {
  headline: string;
  summary: string;
  stats: ReportStat[];
  steps: ReportStep[];
  marketInsight: string;
  cta: string;
}

export interface AnalyzeResponse {
  scoring: ScoringResult;
  report: Report;
  generatedBy: "claude" | "fallback";
  // Prix de vente moyen du secteur (moyenne 6 ans) — null si non disponible.
  marketPrice?: number | null;
  regionName?: string;
}

// selling_plan : lead qualifié qui a demandé son plan complet.
export type LeadType = "selling_plan";

export interface LeadPayload {
  name: string;
  phone?: string;
  email: string;
  consent: boolean;
  answers: Answers;
  leadType?: LeadType;
}
