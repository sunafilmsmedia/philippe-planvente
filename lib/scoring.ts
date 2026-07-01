import type { Answers, MortgageBalance, ScoringFactor, ScoringResult, Verdict } from "./types";

const BASE_SCORE = 50;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

// Verdicts / type de plan :
//  >= 70  → offensif     "Excellente position pour vendre"
//  50-69  → strategique  "Bon potentiel, à préparer intelligemment"
//  < 50   → preparation  "Pas le meilleur moment tout de suite"
function verdictFor(score: number): Verdict {
  if (score >= 70) return "offensif";
  if (score >= 50) return "strategique";
  return "preparation";
}

// Montant représentatif du solde hypothécaire pour estimer le ratio d'équité.
const MORTGAGE_MIDPOINT: Record<Exclude<MortgageBalance, "unknown">, number> = {
  under_100: 75_000,
  "100_250": 175_000,
  "250_400": 325_000,
  over_400: 500_000,
};

// Retourne { delta, label, tone, equityLabel } pour l'équité approximative.
function scoreEquity(answers: Answers): {
  delta: number;
  factor: ScoringFactor | null;
  equityLabel: string;
} {
  const balance = answers.mortgageBalance;
  const value = Math.max(0, answers.estimatedValue ?? 0);

  if (!balance || balance === "unknown") {
    return { delta: 0, factor: null, equityLabel: "À confirmer" };
  }

  const mortgage = MORTGAGE_MIDPOINT[balance];

  // Sans valeur estimée fiable, on retombe sur le solde seul.
  const ratio = value > 0 ? mortgage / value : mortgage / 400_000;

  if (ratio < 0.35) {
    return {
      delta: 12,
      factor: {
        label: "Équité élevée — hypothèque faible face à la valeur",
        delta: 12,
        tone: "positive",
      },
      equityLabel: "Équité élevée",
    };
  }
  if (ratio < 0.6) {
    return {
      delta: 6,
      factor: {
        label: "Équité correcte — bonne marge de manœuvre",
        delta: 6,
        tone: "positive",
      },
      equityLabel: "Équité correcte",
    };
  }
  return {
    delta: -3,
    factor: {
      label: "Équité limitée — hypothèque élevée face à la valeur",
      delta: -3,
      tone: "negative",
    },
    equityLabel: "Équité limitée",
  };
}

export function computeScoring(answers: Answers): ScoringResult {
  const factors: ScoringFactor[] = [];
  let score = BASE_SCORE;

  // 1. Timing (mesure d'urgence)
  switch (answers.timing) {
    case "now":
      score += 15;
      factors.push({ label: "Timing immédiat — tu veux bouger rapidement", delta: 15, tone: "positive" });
      break;
    case "1_3":
      score += 12;
      factors.push({ label: "Vente visée dans 1 à 3 mois", delta: 12, tone: "positive" });
      break;
    case "3_6":
      score += 7;
      factors.push({ label: "Horizon de 3 à 6 mois — bon momentum", delta: 7, tone: "positive" });
      break;
    case "6_12":
      score += 2;
      factors.push({ label: "Projet à moyen terme (6 à 12 mois)", delta: 2, tone: "neutral" });
      break;
    case "unsure":
      score -= 5;
      factors.push({ label: "Timing encore flou — à clarifier", delta: -5, tone: "negative" });
      break;
  }

  // 2. Motivation de vente
  switch (answers.sellingMotivation) {
    case "relocation":
      score += 14;
      factors.push({ label: "Changement de région — intention claire", delta: 14, tone: "positive" });
      break;
    case "upsize":
      score += 12;
      factors.push({ label: "Besoin d'espace identifié — moment naturel pour bouger", delta: 12, tone: "positive" });
      break;
    case "reduce_payments":
      score += 10;
      factors.push({ label: "Volonté d'alléger tes paiements", delta: 10, tone: "positive" });
      break;
    case "separation":
      score += 8;
      factors.push({ label: "Changement personnel — transition à accompagner", delta: 8, tone: "positive" });
      break;
    case "autre":
      score += 4;
      factors.push({ label: "Motivation à préciser avec ton courtier", delta: 4, tone: "neutral" });
      break;
    // "no_sell" est court-circuité avant le scoring — n'arrive pas ici.
  }

  // 3. Équité approximative (hypothèque vs valeur)
  const equity = scoreEquity(answers);
  score += equity.delta;
  if (equity.factor) factors.push(equity.factor);

  // 4. État de la propriété
  switch (answers.propertyCondition) {
    case "ready":
      score += 10;
      factors.push({ label: "Propriété prête à vendre", delta: 10, tone: "positive" });
      break;
    case "minor_reno":
      score += 6;
      factors.push({ label: "Quelques rénovations mineures à prévoir", delta: 6, tone: "positive" });
      break;
    case "staging":
      score += 3;
      factors.push({ label: "Home staging recommandé avant mise en marché", delta: 3, tone: "neutral" });
      break;
    case "major_work":
      score -= 8;
      factors.push({ label: "Beaucoup de travaux à prévoir avant la vente", delta: -8, tone: "negative" });
      break;
    case "unsure":
      factors.push({ label: "État à évaluer sur place", delta: 0, tone: "neutral" });
      break;
  }

  // 5. Objectif principal
  switch (answers.salePreference) {
    case "highest_price":
      score += 8;
      factors.push({ label: "Objectif : maximiser le prix de vente", delta: 8, tone: "positive" });
      break;
    case "fast":
      score += 7;
      factors.push({ label: "Objectif : vendre rapidement", delta: 7, tone: "positive" });
      break;
    case "clear_strategy":
      score += 6;
      factors.push({ label: "Objectif : une stratégie claire avant de décider", delta: 6, tone: "positive" });
      break;
    case "no_stress":
      score += 5;
      factors.push({ label: "Objectif : vendre sans stress", delta: 5, tone: "positive" });
      break;
    case "compare_options":
      score += 2;
      factors.push({ label: "Objectif : comparer tes options d'abord", delta: 2, tone: "neutral" });
      break;
  }

  const finalScore = Math.round(clamp(score, 0, 100));
  return {
    score: finalScore,
    verdict: verdictFor(finalScore),
    factors,
    metrics: {
      estimatedValue: Math.max(0, answers.estimatedValue ?? 0),
      equityLabel: equity.equityLabel,
    },
  };
}
