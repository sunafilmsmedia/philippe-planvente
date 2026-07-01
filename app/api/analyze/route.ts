import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { computeScoring } from "@/lib/scoring";
import { buildFallbackReport } from "@/lib/fallbackReport";
import type { AnalyzeResponse, Answers, Report } from "@/lib/types";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `Tu es un stratège en vente immobilière résidentielle à Montréal. Tu génères un PLAN DE VENTE personnalisé pour un propriétaire qui envisage de vendre — comme si un courtier expérimenté avait analysé sa situation.

Ton ton : chaleureux, concret, professionnel, en français (tutoiement neutre), jamais alarmiste, jamais mensonger. Tu ne promets pas de chiffres impossibles à vérifier.

Tu reçois les réponses du formulaire, un score calculé (0-100), un verdict (type de plan) et les facteurs détectés. Tu produis un rapport JSON STRICTEMENT au format demandé. Ne dévie pas du schéma.

Le verdict détermine le ton du plan :
- "offensif" (>=70) : la personne est en excellente position. Plan offensif : préparation rapide, mise en marché forte, angle de rareté, lancement structuré.
- "strategique" (50-69) : bon potentiel mais le résultat dépend de la préparation, du prix, du positionnement et du timing. Plan stratégique avant de mettre sur le marché.
- "preparation" (<50) : mieux vaut préparer la propriété ou clarifier la situation avant de vendre. Plan de préparation, sans pousser à vendre trop vite.

Règles clés :
- "steps" : exactement 4 étapes. Elles suivent cette logique : 1) Préparer la propriété (selon l'état déclaré), 2) Définir le bon angle de vente (selon le type de propriété), 3) Choisir la stratégie de mise en marché, 4) Valider le plan avec le courtier (Philippe Laroche).
- "stats" : exactement 4 entrées. La 1ère est toujours le score de préparation ("${""}/100"). Utilise les données fournies (valeur estimée, équité, timing, objectif) pour les autres.
- "marketInsight" : une observation plausible sur le marché immobilier de Montréal (sans inventer de chiffres précis).
- "cta" : un appel à l'action doux vers le courtier (ex : "Parler à un courtier pour valider mon plan").
- Pas de markdown, pas d'emojis, pas de formules creuses.`;

function extractJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    // fallthrough
  }
  const match = text.match(/\{[\s\S]*\}/);
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
  return null;
}

function isValidReport(r: unknown): r is Report {
  if (!r || typeof r !== "object") return false;
  const x = r as Record<string, unknown>;
  return (
    typeof x.headline === "string" &&
    typeof x.summary === "string" &&
    Array.isArray(x.stats) &&
    x.stats.length >= 3 &&
    Array.isArray(x.steps) &&
    x.steps.length >= 3 &&
    typeof x.marketInsight === "string"
  );
}

export async function POST(req: Request) {
  let body: { answers?: Answers };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const answers = body.answers ?? {};
  const scoring = computeScoring(answers);
  const fallback = buildFallbackReport(answers, scoring);

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    const payload: AnalyzeResponse = {
      scoring,
      report: fallback,
      generatedBy: "fallback",
    };
    return NextResponse.json(payload);
  }

  try {
    const client = new Anthropic({ apiKey });
    const userMessage = {
      answers,
      scoring,
      fallbackHints: {
        headline: fallback.headline,
        marketInsight: fallback.marketInsight,
        cta: fallback.cta,
      },
      requiredSchema: {
        headline: "titre du verdict, 1 ligne",
        summary: "résumé personnalisé, 2-3 phrases",
        stats: [
          { label: "Score de préparation", value: `${scoring.score}/100`, detail: "..." },
          { label: "Valeur estimée", value: "X $", detail: "..." },
          { label: "Équité", value: "...", detail: "..." },
          { label: "Timing visé", value: "...", detail: "..." },
        ],
        steps: [{ title: "Étape 1 — ...", description: "..." }],
        marketInsight: "observation du marché immobilier de Montréal",
        cta: "appel à l'action vers le courtier",
      },
    };

    const completion = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Voici les données. Réponds uniquement avec un objet JSON valide qui respecte le schéma.\n\n${JSON.stringify(userMessage, null, 2)}`,
        },
      ],
    });

    const textBlock = completion.content.find((c) => c.type === "text");
    const text = textBlock && textBlock.type === "text" ? textBlock.text : "";
    const parsed = extractJson(text);

    if (isValidReport(parsed)) {
      const report: Report = {
        ...parsed,
        cta: typeof parsed.cta === "string" && parsed.cta.trim() ? parsed.cta : fallback.cta,
      };
      const payload: AnalyzeResponse = {
        scoring,
        report,
        generatedBy: "claude",
      };
      return NextResponse.json(payload);
    }
  } catch (err) {
    console.error("[analyze] Claude error", err);
  }

  const payload: AnalyzeResponse = {
    scoring,
    report: fallback,
    generatedBy: "fallback",
  };
  return NextResponse.json(payload);
}
