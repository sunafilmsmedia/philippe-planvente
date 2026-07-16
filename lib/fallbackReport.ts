import type {
  Answers,
  PropertyCondition,
  PropertyType,
  Report,
  ReportStep,
  SalePreference,
  SellingMotivation,
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
    "Selon tes réponses, tu pourrais passer en mode vente avec une stratégie claire. Voici ton plan personnalisé, bâti à partir des conseils de Philippe selon ta situation.",
  strategique:
    "Tu as une vraie opportunité, mais ton résultat dépendra de la préparation, du prix et du timing. Voici le plan stratégique que Philippe recommande selon tes réponses.",
  preparation:
    "Il serait plus intelligent de bien préparer la propriété ou de clarifier ta situation avant de vendre. Voici le plan de préparation recommandé par Philippe selon tes réponses.",
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

// Étape 1 — Sécuriser ta prochaine étape (selon la MOTIVATION de vente)
function motivationStep(m: SellingMotivation | undefined): ReportStep {
  switch (m) {
    case "upsize":
      return {
        title: "Étape 1 — Sécuriser ta prochaine acquisition",
        description:
          "Avant de vendre, on valide ta capacité financière (pré-approbation) pour que tu puisses acheter plus grand au bon moment — idéalement acheter avant ou en parallèle de ta vente, pour éviter le stress de la transition.",
      };
    case "relocation":
      return {
        title: "Étape 1 — Préparer ton changement de région",
        description:
          "On cible ta nouvelle région dès maintenant : emplacement visé, quartiers, services essentiels (épiceries, écoles, transport). Faire ces recherches en amont te permet de vendre et de déménager sans précipitation.",
      };
    case "reduce_payments":
      return {
        title: "Étape 1 — Viser le meilleur prix pour alléger ton budget",
        description:
          "Comme l'objectif est d'alléger tes paiements, on s'assure d'utiliser la meilleure méthode et la meilleure mise en marché pour aller chercher le prix le plus élevé possible — chaque dollar compte pour ta prochaine étape.",
      };
    case "separation":
      return {
        title: "Étape 1 — Faciliter les décisions",
        description:
          "Dans un contexte de séparation, on s'assure d'abord que les parties gardent une bonne entente : ça rend chaque décision (prix, délais, offres) plus fluide et protège la valeur de ta vente.",
      };
    default:
      return {
        title: "Étape 1 — Clarifier ta situation",
        description:
          "On prend le temps de bien comprendre ta situation pour bâtir un plan aligné sur ton objectif réel avant d'aller plus loin.",
      };
  }
}

// Étape 2 — Préparer la propriété (selon l'ÉTAT déclaré)
const PREP_STEP: Record<PropertyCondition, ReportStep> = {
  ready: {
    title: "Étape 2 — Préparer la propriété",
    description:
      "Ta propriété est déjà prête — c'est parfait. On valide les derniers détails (dépersonnalisation, éclairage, petites retouches) pour la présenter à son plein potentiel dès le lancement.",
  },
  minor_reno: {
    title: "Étape 2 — Préparer la propriété",
    description:
      "On cible les rénovations à fort levier. Rénover avant de vendre est une bonne idée — mais s'il y en a trop, il est souvent plus rentable de vendre tel quel au meilleur prix possible. Pour les photos, on fait du staging virtuel; au besoin, Philippe te réfère ses compagnies de confiance avant une visite.",
  },
  staging: {
    title: "Étape 2 — Préparer la propriété",
    description:
      "On mise sur le home staging pour transformer la perception des acheteurs : staging virtuel pour des photos qui accrochent, puis mise en valeur avec les compagnies partenaires de Philippe avant les visites.",
  },
  major_work: {
    title: "Étape 2 — Préparer la propriété",
    description:
      "Il y a des travaux importants : tu as besoin d'un regard professionnel. Envoie tes photos à Philippe — il peut te donner une estimation des travaux et t'aider à décider quoi faire vs vendre tel quel.",
  },
  unsure: {
    title: "Étape 2 — Préparer la propriété",
    description:
      "On commence par une visite d'évaluation pour établir exactement quoi préparer avant la mise en marché — sans dépenser inutilement.",
  },
};

// Étape 3 — Définir le bon angle de vente (selon le TYPE de propriété)
const ANGLE_STEP: Record<PropertyType, ReportStep> = {
  maison: {
    title: "Étape 3 — Définir le bon angle de vente",
    description:
      "On positionne ta maison comme une résidence familiale clé en main : espaces de vie, quartier, écoles et milieu de vie. C'est l'angle qui déclenche le coup de cœur.",
  },
  condo: {
    title: "Étape 3 — Définir le bon angle de vente",
    description:
      "On met de l'avant l'emplacement, la praticité et le style de vie sans entretien — l'argument gagnant pour un condo bien situé dans l'Est de Montréal.",
  },
  plex: {
    title: "Étape 3 — Définir le bon angle de vente",
    description:
      "On cible les investisseurs et les acheteurs-occupants : rentabilité, revenus locatifs et potentiel. Chaque chiffre devient un argument de vente.",
  },
  chalet: {
    title: "Étape 3 — Définir le bon angle de vente",
    description:
      "On vend un mode de vie : évasion, nature et rareté de l'emplacement. L'émotion prime, appuyée par une présentation visuelle forte.",
  },
  terrain: {
    title: "Étape 3 — Définir le bon angle de vente",
    description:
      "On met en valeur le potentiel : zonage, dimensions et projets possibles. On parle directement aux acheteurs et promoteurs qui cherchent ce type d'opportunité.",
  },
  autre: {
    title: "Étape 3 — Définir le bon angle de vente",
    description:
      "On identifie l'angle le plus fort selon les caractéristiques uniques de ta propriété et le type d'acheteur le plus susceptible d'y voir une opportunité.",
  },
};

// Étape 4 — Stratégie de mise en marché & prix (selon l'OBJECTIF principal)
function marketingStep(pref: SalePreference | undefined): ReportStep {
  const title = "Étape 4 — La bonne stratégie de mise en marché";
  switch (pref) {
    case "highest_price":
      return {
        title,
        description:
          "Ta priorité, c'est le prix : on prend un peu plus de temps et on fait preuve de patience pour aller chercher le maximum. Positionnement précis, présentation soignée et négociation serrée.",
      };
    case "fast":
      return {
        title,
        description:
          "On met la propriété en ligne le plus vite possible avec un prix attirant qui génère de la demande — tout en évitant de la vendre en dessous de sa valeur. Objectif : créer un momentum dès le lancement.",
      };
    case "no_stress":
      return {
        title,
        description:
          "Tu veux vendre sans stress : parfait, un courtier s'occupe de tout, de A à Z. Préparation, photos, visites, offres et négociation — tu es accompagné à chaque étape.",
      };
    case "clear_strategy":
      return {
        title,
        description:
          "On ne met jamais la propriété en vente avant d'avoir une stratégie claire et acceptée par toi. On définit ensemble le prix, le calendrier et le plan de match avant le lancement.",
      };
    case "compare_options":
      return {
        title,
        description:
          "On te présente tes options clairement — prix, scénarios et délais — pour que tu décides en toute confiance, sans pression, avant de lancer quoi que ce soit.",
      };
    default:
      return {
        title,
        description:
          "On bâtit une mise en marché sur mesure : bon prix, bonnes photos et bon calendrier pour maximiser l'intérêt dès le lancement.",
      };
  }
}

// Étape 5 — Valider et lancer avec Philippe (intègre le TIMING → prix)
function validateStep(timing: Answers["timing"]): ReportStep {
  const echeance =
    timing && timing !== "unsure"
      ? `selon ton échéancier (${TIMING_LABEL[timing].toLowerCase()})`
      : "selon l'échéancier qu'on fixe ensemble";
  return {
    title: "Étape 5 — Valider et lancer avec Philippe",
    description: `Un appel avec Philippe Laroche pour valider ton plan, confirmer le prix de mise en marché ${echeance}, et fixer la date de lancement. Rien n'est mis en vente sans ton accord.`,
  };
}

export function buildFallbackReport(answers: Answers, scoring: ScoringResult): Report {
  const { score, verdict, metrics } = scoring;
  const condition = answers.propertyCondition ?? "unsure";
  const propertyType = answers.propertyType ?? "autre";

  const marketInsightByVerdict: Record<Verdict, string> = {
    offensif:
      "Dans l'Est de Montréal, les propriétés bien préparées et bien positionnées attirent l'attention rapidement et se démarquent dès les premiers jours.",
    strategique:
      "Dans l'Est de Montréal, l'écart de résultat entre une propriété bien préparée et une propriété lancée trop vite est important. La préparation et le prix font toute la différence.",
    preparation:
      "Le marché de l'Est de Montréal récompense les vendeurs préparés. Prendre quelques semaines pour bien positionner ta propriété peut se traduire par un meilleur prix final.",
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
    motivationStep(answers.sellingMotivation),
    PREP_STEP[condition],
    ANGLE_STEP[propertyType],
    marketingStep(answers.salePreference),
    validateStep(answers.timing),
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
