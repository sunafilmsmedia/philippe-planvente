import type { Answers, ValueBracket } from "./types";

// Point milieu de chaque tranche de valeur (0 = "Autre"/inconnu) — utilisé
// pour le calcul d'équité et le CRM.
export const VALUE_BRACKET_MID: Record<ValueBracket, number> = {
  "300_400": 350_000,
  "400_500": 450_000,
  "500_600": 550_000,
  "600_700": 650_000,
  "700_800": 750_000,
  "800_900": 850_000,
  autre: 0,
};

export const VALUE_BRACKET_LABEL: Record<ValueBracket, string> = {
  "300_400": "300 000 $ – 400 000 $",
  "400_500": "400 000 $ – 500 000 $",
  "500_600": "500 000 $ – 600 000 $",
  "600_700": "600 000 $ – 700 000 $",
  "700_800": "700 000 $ – 800 000 $",
  "800_900": "800 000 $ – 900 000 $",
  autre: "Autre",
};

export type QuestionId =
  | "propertyType"
  | "sellingMotivation"
  | "timing"
  | "estimatedValue"
  | "yearsOwned"
  | "propertyCondition"
  | "salePreference"
  | "hasContract"
  | "region";

export type QuestionKind = "choice" | "currency" | "boolean" | "region";

export interface Choice<V extends string = string> {
  value: V;
  label: string;
  hint?: string;
}

export interface QuestionDef {
  id: QuestionId;
  kind: QuestionKind;
  title: string;
  subtitle?: string;
  choices?: Choice[];
  autoAdvance?: boolean;
  showIf?: (a: Answers) => boolean;
}

export const QUESTIONS: QuestionDef[] = [
  {
    id: "propertyType",
    kind: "choice",
    title: "Quel type de propriété veux-tu vendre ?",
    subtitle: "On commence par le plus simple.",
    autoAdvance: true,
    choices: [
      { value: "maison", label: "Maison unifamiliale", hint: "Détachée ou jumelée" },
      { value: "condo", label: "Condo", hint: "Copropriété" },
      { value: "plex", label: "Plex", hint: "Duplex, triplex, multilogement" },
      { value: "terrain", label: "Terrain" },
    ],
  },
  {
    id: "sellingMotivation",
    kind: "choice",
    title: "Pourquoi penses-tu vendre ?",
    subtitle: "C'est ce qui motive ta réflexion.",
    autoAdvance: true,
    choices: [
      { value: "upsize", label: "Je veux acheter plus grand", hint: "Besoin de plus d'espace" },
      { value: "reduce_payments", label: "Je veux réduire mes paiements", hint: "Alléger mon budget" },
      { value: "relocation", label: "Je veux changer de région", hint: "Déménager ailleurs" },
      { value: "separation", label: "Je vis une séparation / changement personnel" },
      { value: "no_sell", label: "Je ne veux pas vendre", hint: "Je suis simplement curieux" },
    ],
  },
  {
    id: "timing",
    kind: "choice",
    title: "Quand aimerais-tu vendre idéalement ?",
    subtitle: "Ça nous aide à calibrer ton plan.",
    autoAdvance: true,
    choices: [
      { value: "now", label: "Maintenant / dans les prochaines semaines" },
      { value: "1_3", label: "Dans 1 à 3 mois" },
      { value: "3_6", label: "Dans 3 à 6 mois" },
      { value: "unsure", label: "Je ne sais pas encore" },
    ],
  },
  {
    id: "estimatedValue",
    kind: "choice",
    title: "Combien penses-tu que ta propriété vaut aujourd'hui ?",
    subtitle: "Ton estimation à toi — une tranche suffit.",
    autoAdvance: true,
    choices: [
      { value: "300_400", label: "300 000 $ – 400 000 $" },
      { value: "400_500", label: "400 000 $ – 500 000 $" },
      { value: "500_600", label: "500 000 $ – 600 000 $" },
      { value: "600_700", label: "600 000 $ – 700 000 $" },
      { value: "700_800", label: "700 000 $ – 800 000 $" },
      { value: "800_900", label: "800 000 $ – 900 000 $" },
      { value: "autre", label: "Autre" },
    ],
  },
  {
    id: "yearsOwned",
    kind: "choice",
    title: "Depuis combien de temps es-tu propriétaire ?",
    subtitle: "Ça nous aide à estimer ton équité (hypothèque remboursée + plus-value).",
    autoAdvance: true,
    choices: [
      { value: "0_2", label: "Moins de 3 ans" },
      { value: "3_7", label: "3 à 7 ans" },
      { value: "8_14", label: "8 à 14 ans" },
      { value: "15_plus", label: "15 ans ou plus" },
    ],
  },
  {
    id: "propertyCondition",
    kind: "choice",
    title: "Dans quel état est ta propriété actuellement ?",
    subtitle: "Ça détermine les recommandations avant mise en marché.",
    autoAdvance: true,
    choices: [
      { value: "ready", label: "Prête à vendre" },
      { value: "minor_reno", label: "Quelques rénovations mineures à faire" },
      { value: "staging", label: "Besoin de home staging / préparation" },
      { value: "major_work", label: "Beaucoup de travaux à prévoir" },
      { value: "unsure", label: "Je ne suis pas sûr" },
    ],
  },
  {
    id: "salePreference",
    kind: "choice",
    title: "Qu'est-ce qui est le plus important pour toi ?",
    subtitle: "Ça définit le type de plan qu'on va bâtir.",
    autoAdvance: true,
    choices: [
      { value: "highest_price", label: "Vendre le plus cher possible" },
      { value: "fast", label: "Vendre rapidement" },
      { value: "no_stress", label: "Vendre sans stress" },
      { value: "clear_strategy", label: "Avoir une stratégie claire avant de décider" },
      { value: "compare_options", label: "Comparer mes options avant de parler à un courtier" },
    ],
  },
  {
    id: "hasContract",
    kind: "boolean",
    title: "Tu travailles déjà avec un courtier ?",
    subtitle: "Question légale — on ne peut pas évaluer une propriété déjà sous contrat.",
    autoAdvance: true,
  },
  {
    id: "region",
    kind: "region",
    title: "Dans quel secteur se trouve ta propriété ?",
    subtitle: "Touche la carte près de chez toi — on sélectionne le secteur le plus proche.",
  },
];

export function getVisibleQuestions(answers: Answers): QuestionDef[] {
  return QUESTIONS.filter((q) => !q.showIf || q.showIf(answers));
}

export function isAnswered(q: QuestionDef, a: Answers): boolean {
  switch (q.id) {
    case "propertyType": return !!a.propertyType;
    case "sellingMotivation": return !!a.sellingMotivation;
    case "timing": return !!a.timing;
    case "estimatedValue": return !!a.valueBracket;
    case "yearsOwned": return !!a.yearsOwned;
    case "propertyCondition": return !!a.propertyCondition;
    case "salePreference": return !!a.salePreference;
    case "hasContract":
      // "Non" = on peut continuer. "Oui" = bloqué SAUF si la personne
      // clique "Je veux changer" (wantsToSwitch = true).
      if (a.hasContract === false) return true;
      if (a.hasContract === true && a.wantsToSwitch === true) return true;
      return false;
    case "region": return !!a.region;
  }
}
