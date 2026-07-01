import { NextResponse } from "next/server";
import { computeScoring } from "@/lib/scoring";
import { REGIONS } from "@/lib/regions";
import type { Answers, LeadPayload, LeadType, Verdict } from "@/lib/types";

export const runtime = "nodejs";

interface IncomingBody extends Partial<LeadPayload> {
  answers?: Answers;
  leadType?: LeadType;
}

function splitName(full: string): { firstName: string; lastName: string } {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

const PLAN_LABEL: Record<Verdict, string> = {
  offensif: "Plan offensif",
  strategique: "Plan stratégique",
  preparation: "Plan de préparation",
};

export async function POST(req: Request) {
  let body: IncomingBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, phone, email, consent, answers } = body;
  const leadType: LeadType = body.leadType ?? "selling_plan";

  if (!name || !email || !consent || !answers) {
    return NextResponse.json(
      { stored: false, error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Sécurité : jamais de lead pour quelqu'un qui ne veut pas vendre.
  if (answers.sellingMotivation === "no_sell") {
    return NextResponse.json({ stored: false, reason: "no_sell" });
  }

  const scoring = computeScoring(answers);

  // Règle critique : on n'envoie au CRM que les leads qualifiés.
  // Un verdict "preparation" (score < 50) n'est pas transmis même si la
  // personne a demandé son plan complet — on affiche quand même le plan.
  if (scoring.verdict === "preparation") {
    return NextResponse.json({
      stored: false,
      reason: "verdict_preparation",
      verdict: scoring.verdict,
    });
  }

  const { firstName, lastName } = splitName(name);
  const regionName = REGIONS.find((r) => r.id === answers.region)?.name ?? "";

  // Payload aplati pour mapping GHL direct + données brutes en complément.
  const payload = {
    source: "philippe-laroche-app",
    receivedAt: new Date().toISOString(),

    // Type de lead — permet à GHL de router via le workflow
    leadType,

    // Contact
    firstName,
    lastName,
    fullName: name,
    phone: phone ?? "",
    email,

    // Scoring
    score: scoring.score,
    verdict: scoring.verdict,
    recommendedPlan: PLAN_LABEL[scoring.verdict],

    // Détails propriété / réponses
    propertyType: answers.propertyType ?? "",
    sellingMotivation: answers.sellingMotivation ?? "",
    timing: answers.timing ?? "",
    estimatedValue: answers.estimatedValue ?? 0,
    mortgageBalance: answers.mortgageBalance ?? "",
    propertyCondition: answers.propertyCondition ?? "",
    salePreference: answers.salePreference ?? "",
    region: regionName,
    regionId: answers.region ?? "",
    // Signal précieux : déjà sous contrat mais veut changer de courtier.
    hasContract: answers.hasContract ?? false,
    wantsToSwitch: answers.wantsToSwitch ?? false,

    // Données brutes
    lead: { name, phone, email },
    scoring: { score: scoring.score, verdict: scoring.verdict },
    answers,
  };

  const webhookUrl = process.env.CRM_WEBHOOK_URL;
  const webhookSecret = process.env.CRM_WEBHOOK_SECRET;

  if (webhookUrl) {
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (webhookSecret) headers["X-Webhook-Secret"] = webhookSecret;
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        console.error("[lead] Webhook returned", res.status);
      }
    } catch (err) {
      console.error("[lead] Webhook failed", err);
    }
  } else {
    console.log("[lead] Stored (no webhook configured):", JSON.stringify(payload));
  }

  return NextResponse.json({
    stored: true,
    verdict: scoring.verdict,
    leadType,
  });
}
