import type {
  Answers,
  PropertyCondition,
  PropertyType,
  Report,
  ReportStep,
  SalePreference,
  ScoringResult,
  Verdict,
} from "./types";
import { formatCurrency } from "./format";

const VERDICT_HEADLINE: Record<Verdict, string> = {
  offensif: "Tu es dans une excellente position pour vendre",
  strategique: "Bon potentiel — il faut préparer la vente intelligemment",
  preparation: "Ce n'est peut-être pas le meilleur moment pour vendre tout de suite",
};

const VERDICT_SUMMARY: Record<Verdict, string> = {
  offensif:
    "Selon tes réponses, tu pourrais passer en mode vente avec une stratégie claire. Le plan recommandé est offensif : préparation rapide, mise en marché forte, angle de rareté et lancement structuré.",
  strategique:
    "Tu sembles avoir une vraie opportunité, mais ton résultat dépendra beaucoup de la préparation, du prix, du positionnement et du timing. On recommande un plan stratégique avant de mettre la propriété sur le marché.",
  preparation:
    "Selon tes réponses, il serait plus intelligent de préparer la propriété ou de clarifier ta situation avant de vendre. On recommande un plan de préparation pour éviter de vendre trop vite ou en dessous de ton potentiel.",
};

const PROPERTY_LABEL: Record<PropertyType, string> = {
  maison: "Maison unifamiliale",
  condo: "Condo",
  plex: "Plex",
  chalet: "Chalet / résidence secondaire",
  terrain: "Terrain",
  autre: "Propriété",
};

const MOTIVATION_LABEL: Record<string, string> = {
  upsize: "Acheter plus grand",
  reduce_payments: "Réduire les paiements",
  relocation: "Changer de région",
  separation: "Changement personnel",
  autre: "Autre raison",
  no_sell: "Pas de vente prévue",
};

const TIMING_LABEL: Record<string, string> = {
  now: "Prochaines semaines",
  "1_3": "Dans 1 à 3 mois",
  "3_6": "Dans 3 à 6 mois",
  "6_12": "Dans 6 à 12 mois",
  unsure: "À déterminer",
};

const SALE_PREF_LABEL: Record<SalePreference, string> = {
  highest_price: "Vendre au meilleur prix",
  fast: "Vendre rapidement",
  no_stress: "Vendre sans stress",
  clear_strategy: "Stratégie claire",
  compare_options: "Comparer les options",
};

// Étape 1 — Préparer la propriété (selon l'état déclaré)
const PREP_STEP: Record<PropertyCondition, ReportStep> = {
  ready: {
    title: "Étape 1 — Préparer la propriété",
    description:
      "Ta propriété est déjà prête. On valide les derniers détails (dépersonnalisation, éclairage, petits accrocs) pour la présenter à son plein potentiel dès le lancement.",
  },
  minor_reno: {
    title: "Étape 1 — Préparer la propriété",
    description:
      "Quelques rénovations mineures à fort levier (peinture, luminaires, retouches) avant la mise en marché. On priorise ce qui rapporte le plus par dollar investi.",
  },
  staging: {
    title: "Étape 1 — Préparer la propriété",
    description:
      "Un home staging ciblé va transformer la perception des acheteurs : désencombrement, mise en valeur des espaces et ambiance chaleureuse pour les photos.",
  },
  major_work: {
    title: "Étape 1 — Préparer la propriété",
    description:
      "Avant de vendre, on établit ce qui doit être fait vs ce qui peut être vendu « à rénover ». Objectif : ne pas surinvestir tout en évitant de laisser de l'argent sur la table.",
  },
  unsure: {
    title: "Étape 1 — Préparer la propriété",
    description:
      "On commence par une visite d'évaluation pour établir exactement quoi préparer avant la mise en marché — sans dépenser inutilement.",
  },
};

// Étape 2 — Définir le bon angle de vente (selon le type de propriété)
const ANGLE_STEP: Record<PropertyType, ReportStep> = {
  maison: {
    title: "Étape 2 — Définir le bon angle de vente",
    description:
      "On positionne ta maison comme une résidence familiale clé en main : espaces de vie, quartier, écoles et milieu de vie. C'est l'angle qui déclenche le coup de cœur.",
  },
  condo: {
    title: "Étape 2 — Définir le bon angle de vente",
    description:
      "On met de l'avant l'emplacement, la praticité et le style de vie sans entretien — l'argument gagnant pour un condo bien situé à Montréal.",
  },
  plex: {
    title: "Étape 2 — Définir le bon angle de vente",
    description:
      "On cible les investisseurs et les acheteurs-occupants : rentabilité, revenus locatifs et potentiel de la propriété. Chaque chiffre devient un argument de vente.",
  },
  chalet: {
    title: "Étape 2 — Définir le bon angle de vente",
    description:
      "On vend un mode de vie : évasion, nature et rareté de l'emplacement. L'émotion prime, appuyée par une présentation visuelle forte.",
  },
  terrain: {
    title: "Étape 2 — Définir le bon angle de vente",
    description:
      "On met en valeur le potentiel : zonage, dimensions et projets possibles. On parle directement aux acheteurs et promoteurs qui cherchent ce type d'opportunité.",
  },
  autre: {
    title: "Étape 2 — Définir le bon angle de vente",
    description:
      "On identifie l'angle le plus fort selon les caractéristiques uniques de ta propriété et le type d'acheteur le plus susceptible d'y voir une opportunité.",
  },
};

function marketingStep(verdict: Verdict, pref?: SalePreference): ReportStep {
  const base = "Étape 3 — Choisir la bonne stratégie de mise en marché";
  if (verdict === "offensif") {
    return {
      title: base,
      description:
        "Photos professionnelles, vidéo immobilière et campagne locale ciblée. On crée un effet de rareté avec une mise en marché avant visites pour maximiser l'attention dès le lancement.",
    };
  }
  if (verdict === "preparation") {
    return {
      title: base,
      description:
        "On établit un positionnement prix réaliste et un plan de préparation. Une fois la propriété prête, on déploie photos pro et campagne locale au bon moment.",
    };
  }
  // strategique — nuance selon l'objectif
  const prefLine =
    pref === "highest_price"
      ? "On mise sur un positionnement prix précis et une présentation haut de gamme pour justifier chaque dollar."
      : pref === "fast"
      ? "On structure une mise en marché rapide et large pour générer un maximum de visites tôt."
      : "On combine photos professionnelles, positionnement prix et campagne locale pour attirer les bons acheteurs.";
  return { title: base, description: `${prefLine} Vidéo immobilière et mise en marché avant visites au besoin.` };
}

function brokerStep(verdict: Verdict): ReportStep {
  return {
    title: "Étape 4 — Valider le plan avec un courtier",
    description:
      verdict === "preparation"
        ? "Un appel avec Philippe Laroche pour valider ton plan de préparation et fixer le bon moment pour lancer — sans pression."
        : "Un appel avec Philippe Laroche pour valider le plan, confirmer le prix de mise en marché et fixer la date de lancement.",
  };
}

export function buildFallbackReport(answers: Answers, scoring: ScoringResult): Report {
  const { score, verdict, metrics } = scoring;
  const condition = answers.propertyCondition ?? "unsure";
  const propertyType = answers.propertyType ?? "autre";

  const marketInsightByVerdict: Record<Verdict, string> = {
    offensif:
      "Le marché montréalais reste actif pour les propriétés bien préparées et bien positionnées : elles attirent l'attention rapidement et se démarquent dès les premiers jours.",
    strategique:
      "À Montréal, l'écart de résultat entre une propriété bien préparée et une propriété lancée trop vite est important. La préparation et le prix font toute la différence.",
    preparation:
      "Le marché montréalais récompense les vendeurs préparés. Prendre quelques semaines pour bien positionner ta propriété peut se traduire par un meilleur prix final.",
  };

  const stats = [
    {
      label: "Score de préparation",
      value: `${score}/100`,
      detail:
        verdict === "offensif"
          ? "Conditions réunies pour lancer."
          : verdict === "strategique"
          ? "Bon potentiel à préparer."
          : "À consolider avant de vendre.",
    },
    {
      label: "Valeur estimée",
      value: metrics.estimatedValue ? formatCurrency(metrics.estimatedValue) : "—",
      detail: "Selon ton estimation actuelle.",
    },
    {
      label: "Équité",
      value: metrics.equityLabel,
      detail: "Basée sur ton solde hypothécaire déclaré.",
    },
    {
      label: "Timing visé",
      value: answers.timing ? TIMING_LABEL[answers.timing] : "—",
      detail: `Objectif : ${answers.salePreference ? SALE_PREF_LABEL[answers.salePreference] : "—"}`,
    },
  ];

  const steps: ReportStep[] = [
    PREP_STEP[condition],
    ANGLE_STEP[propertyType],
    marketingStep(verdict, answers.salePreference),
    brokerStep(verdict),
  ];

  const motivationLabel = answers.sellingMotivation
    ? MOTIVATION_LABEL[answers.sellingMotivation]
    : "";
  const summary = motivationLabel
    ? `${VERDICT_SUMMARY[verdict]} Ta motivation (${motivationLabel.toLowerCase()}) et ton type de bien (${PROPERTY_LABEL[propertyType].toLowerCase()}) ont été pris en compte.`
    : VERDICT_SUMMARY[verdict];

  return {
    headline: VERDICT_HEADLINE[verdict],
    summary,
    stats,
    steps,
    marketInsight: marketInsightByVerdict[verdict],
    cta: "Parler à un courtier pour valider mon plan",
  };
}
