"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { BROKER } from "@/lib/broker";
import type { AnalyzeResponse, Answers, Verdict } from "@/lib/types";
import ContactForm from "./ContactForm";

interface Props {
  analyze: AnalyzeResponse;
  answers: Answers;
  // "yes" → la personne veut son plan complet : on bloque le plan derrière
  //   le ContactForm (gating).
  // "no"  → elle veut juste voir son score : on affiche score + verdict court
  //   + CTA courtier, sans capture ni CRM.
  revealChoice: "yes" | "no";
  onRestart: () => void;
}

const VERDICT_BADGE: Record<Verdict, { label: string; color: string; bg: string; ring: string }> = {
  offensif: {
    label: "Plan offensif",
    color: "text-emerald-700",
    bg: "bg-emerald-600/10",
    ring: "ring-emerald-600/30",
  },
  strategique: {
    label: "Plan stratégique",
    color: "text-amber-700",
    bg: "bg-amber-600/10",
    ring: "ring-amber-600/30",
  },
  preparation: {
    label: "Plan de préparation",
    color: "text-[var(--color-brand-300)]",
    bg: "bg-[var(--color-brand-500)]/10",
    ring: "ring-[var(--color-brand-500)]/30",
  },
};

type SubmissionState =
  | { kind: "pending" }
  | { kind: "done"; stored: boolean; firstName: string };

export default function ResultsScreen({ analyze, answers, revealChoice, onRestart }: Props) {
  const { scoring, report } = analyze;
  const badge = VERDICT_BADGE[scoring.verdict];
  const [submission, setSubmission] = useState<SubmissionState>({ kind: "pending" });

  // Gating : la personne a demandé son plan complet mais n'a pas encore
  // soumis ses coordonnées → on bloque tout le plan derrière le ContactForm.
  const isGated = revealChoice === "yes" && submission.kind === "pending";
  // Score seulement : elle a choisi « juste voir mon score ».
  const isScoreOnly = revealChoice === "no";

  if (isGated) {
    return (
      <div className="min-h-screen px-5 sm:px-8 py-12 sm:py-16 max-w-xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <div className="relative mx-auto mb-7 w-16 h-16">
            <div className="absolute inset-0 rounded-full bg-[var(--color-brand-500)]/20 blur-xl" />
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-brand-500)] to-[var(--color-brand-700)] border border-black/10 flex items-center justify-center shadow-[0_10px_40px_-10px_rgba(225,29,46,0.5)]">
              <svg className="w-7 h-7 text-white" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="4" y="9" width="12" height="9" rx="2" />
                <path d="M7 9V6.5C7 4.8 8.3 3.5 10 3.5C11.7 3.5 13 4.8 13 6.5V9" />
              </svg>
            </div>
          </div>

          <p className="text-[11px] uppercase tracking-[0.25em] text-[var(--color-brand-300)] mb-3">
            Plan de vente prêt
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-[var(--color-brand-100)] leading-[1.1] tracking-tight text-balance">
            Ton plan de vente est prêt.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-[var(--color-muted)] leading-relaxed text-balance max-w-md mx-auto">
            Laisse-nous ton contact pour débloquer ton plan complet et recevoir un appel
            personnalisé avec {BROKER.name}.
          </p>
        </motion.div>

        <div className="mt-10">
          <ContactForm
            answers={answers}
            verdict={scoring.verdict}
            gated
            onSubmitted={(r) => setSubmission({ kind: "done", ...r })}
          />
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={onRestart}
            className="text-xs text-[var(--color-muted-2)] hover:text-[var(--color-brand-200)] transition-colors"
          >
            Retour à l&apos;accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-5 sm:px-8 py-10 sm:py-14 max-w-3xl mx-auto w-full">
      {/* Verdict badge */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex justify-center mb-8"
      >
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${badge.bg} ring-1 ${badge.ring}`}>
          <span className={`w-2 h-2 rounded-full ${badge.color.replace("text-", "bg-")}`} />
          <span className={`text-xs font-medium tracking-wide ${badge.color}`}>{badge.label}</span>
        </div>
      </motion.div>

      {/* Verdict headline + résumé */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-12"
      >
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[var(--color-brand-100)] leading-[1.1] tracking-tight text-balance">
          {report.headline}
        </h1>
        {!isScoreOnly && (
          <p className="mt-5 text-base sm:text-lg text-[var(--color-muted)] leading-relaxed text-balance max-w-2xl mx-auto">
            {report.summary}
          </p>
        )}
      </motion.div>

      {/* Score card */}
      <ScoreCard score={scoring.score} verdict={scoring.verdict} />

      {/* ─────────────── Score seulement ─────────────── */}
      {isScoreOnly ? (
        <ScoreOnlyCta verdict={scoring.verdict} onRestart={onRestart} generatedBy={analyze.generatedBy} />
      ) : (
        <>
          {/* Confirmation après soumission gated */}
          {submission.kind === "done" && (
            <ConfirmationBlock
              stored={submission.stored}
              firstName={submission.firstName}
              verdict={scoring.verdict}
            />
          )}

          {/* Stats / observations */}
          <div className="grid sm:grid-cols-3 gap-3 mt-12">
            {report.stats.slice(1, 4).map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.07 }}
                className="glass-card rounded-2xl p-5"
              >
                <p className="text-[11px] uppercase tracking-wider text-[var(--color-muted-2)]">{s.label}</p>
                <p className="font-serif text-2xl text-[var(--color-brand-100)] mt-1">{s.value}</p>
                <p className="text-xs text-[var(--color-muted)] mt-2 leading-relaxed">{s.detail}</p>
              </motion.div>
            ))}
          </div>

          {/* Insight marché local */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="
              mt-12 rounded-2xl
              bg-gradient-to-br from-[var(--color-brand-500)]/10 to-[var(--color-brand-700)]/10
              border border-[var(--color-brand-400)]/20
              p-5 sm:p-6
            "
          >
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-9 h-9 rounded-full bg-[var(--color-brand-500)]/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-[var(--color-brand-300)]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M10 2 L18 18 L2 18 Z" strokeLinejoin="round" />
                  <path d="M10 8 V13 M10 15.5 V15.6" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[var(--color-brand-300)] mb-1.5">
                  Marché de {BROKER.region}
                </p>
                <p className="text-sm sm:text-base text-[var(--color-brand-100)] leading-relaxed">
                  {report.marketInsight}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Ton plan de vente recommandé */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12"
          >
            <h3 className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted-2)] mb-5">
              Ton plan de vente recommandé
            </h3>
            <ol className="space-y-3">
              {report.steps.map((s, i) => (
                <li key={i} className="glass-card rounded-2xl p-4 sm:p-5 flex gap-4">
                  <span className="
                    shrink-0 w-8 h-8 rounded-full
                    bg-gradient-to-br from-[var(--color-brand-500)] to-[var(--color-brand-700)]
                    flex items-center justify-center
                    font-serif text-white text-sm
                    shadow-[0_6px_18px_-4px_rgba(225,29,46,0.5)]
                  ">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium text-[var(--color-brand-100)]">{s.title}</p>
                    <p className="text-sm text-[var(--color-muted)] mt-1 leading-relaxed">{s.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </motion.section>

          {/* Facteurs détectés */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-10"
          >
            <h3 className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted-2)] mb-4">
              Facteurs analysés
            </h3>
            <ul className="space-y-2">
              {scoring.factors.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <span
                    className={`shrink-0 w-2 h-2 rounded-full ${
                      f.tone === "positive"
                        ? "bg-emerald-400"
                        : f.tone === "negative"
                        ? "bg-rose-400"
                        : "bg-slate-500"
                    }`}
                  />
                  <span className="text-[var(--color-ink)]">{f.label}</span>
                </li>
              ))}
            </ul>
          </motion.section>

          {/* CTA courtier */}
          <BrokerCta label={report.cta} />
        </>
      )}

      {/* Footer */}
      <div className="mt-12 mb-24 sm:mb-12 text-center">
        <button
          onClick={onRestart}
          className="text-sm text-[var(--color-muted)] hover:text-[var(--color-brand-200)] transition-colors underline underline-offset-4 decoration-black/15 hover:decoration-[var(--color-brand-400)]"
        >
          Refaire mon plan
        </button>
        <p className="mt-6 text-[10px] text-[var(--color-muted-2)] uppercase tracking-[0.2em]">
          Plan {analyze.generatedBy === "claude" ? "généré par l'IA" : "déterministe"} · {BROKER.name} · {BROKER.region}
        </p>
      </div>
    </div>
  );
}

function ScoreOnlyCta({
  verdict,
  onRestart,
  generatedBy,
}: {
  verdict: Verdict;
  onRestart: () => void;
  generatedBy: "claude" | "fallback";
}) {
  void generatedBy;
  const line =
    verdict === "offensif"
      ? "Ton plan complet en 4 étapes est prêt. Un courtier peut te le présenter et confirmer ta stratégie de vente."
      : verdict === "strategique"
      ? "Ton plan complet en 4 étapes est prêt. Un courtier peut t'aider à bien préparer ta mise en marché."
      : "Un courtier peut t'aider à préparer ta propriété et à choisir le bon moment pour vendre.";
  return (
    <div className="mt-10">
      <p className="text-center text-sm sm:text-base text-[var(--color-muted)] leading-relaxed max-w-md mx-auto">
        {line}
      </p>
      <BrokerCta label="Parler à un courtier pour valider mon plan" />
      <div className="mt-6 text-center">
        <button
          onClick={onRestart}
          className="text-xs text-[var(--color-muted-2)] hover:text-[var(--color-brand-200)] transition-colors"
        >
          Refaire mon plan
        </button>
      </div>
    </div>
  );
}

function BrokerCta({ label }: { label: string }) {
  return (
    <motion.a
      href={`tel:${BROKER.phoneTel}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="
        mt-8 w-full
        inline-flex items-center justify-center gap-2
        px-6 py-4 rounded-full text-base font-medium
        bg-gradient-to-b from-[var(--color-brand-500)] to-[var(--color-brand-700)]
        text-white no-underline
        shadow-[0_15px_40px_-10px_rgba(225,29,46,0.55)]
        hover:shadow-[0_20px_50px_-10px_rgba(225,29,46,0.7)]
        transition-all
      "
    >
      {label}
      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path
          d="M3.5 4.5C3.5 4 4 3.5 4.5 3.5H7L8.5 7L6.5 8.5C7.5 11 9 12.5 11.5 13.5L13 11.5L16.5 13V15.5C16.5 16 16 16.5 15.5 16.5C9 16.5 3.5 11 3.5 4.5Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.a>
  );
}

function ConfirmationBlock({
  stored,
  firstName,
  verdict,
}: {
  stored: boolean;
  firstName: string;
  verdict: Verdict;
}) {
  void verdict;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`
        mt-12 rounded-3xl p-6 sm:p-8
        ${stored
          ? "bg-gradient-to-br from-emerald-500/12 to-transparent border border-emerald-600/25"
          : "bg-gradient-to-br from-[var(--color-gold)]/10 to-transparent border border-[var(--color-gold)]/30"}
      `}
    >
      <div className="flex items-center gap-2 mb-2">
        <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 10L8 14L16 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="font-serif text-xl sm:text-2xl text-[var(--color-brand-100)]">
          Merci {firstName}, ton plan complet est débloqué.
        </p>
      </div>
      <p className="text-sm sm:text-base text-[var(--color-ink)] leading-relaxed">
        {stored ? (
          <>
            {BROKER.name} ou un membre de son équipe te joindra dans les 24 heures ouvrables
            pour te présenter ton plan et répondre à tes questions.
          </>
        ) : (
          <>
            Ton plan complet s&apos;affiche ci-dessous. Quand tu seras prêt à passer à
            l&apos;action, contacte {BROKER.name} pour valider ta stratégie.
          </>
        )}
      </p>
    </motion.div>
  );
}

function ScoreCard({ score, verdict }: { score: number; verdict: Verdict }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="
        relative overflow-hidden
        rounded-3xl p-7 sm:p-9
        bg-gradient-to-br from-[var(--color-brand-800)] via-[var(--color-brand-700)] to-[var(--color-brand-900)]
        shadow-[0_30px_80px_-30px_rgba(60,10,12,0.7),0_0_0_1px_rgba(255,255,255,0.06)_inset]
      "
    >
      <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-[var(--color-brand-400)]/20 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-[var(--color-gold)]/10 blur-3xl" />

      <div className="relative">
        <p className="text-[11px] uppercase tracking-[0.2em] text-white/70">
          Score de préparation à la vente
        </p>
        <div className="flex items-baseline gap-2 mt-3">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="font-serif text-7xl sm:text-8xl text-white leading-none"
          >
            {score}
          </motion.span>
          <span className="font-serif text-2xl text-white/70">/100</span>
        </div>

        <div className="mt-6 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={`
              h-full rounded-full
              ${
                verdict === "offensif"
                  ? "bg-gradient-to-r from-emerald-300 to-emerald-400"
                  : verdict === "strategique"
                  ? "bg-gradient-to-r from-amber-300 to-amber-400"
                  : "bg-gradient-to-r from-rose-300 to-rose-400"
              }
            `}
          />
        </div>

        <p className="mt-4 text-sm text-white/75">
          {verdict === "offensif"
            ? "Tu es en excellente position pour passer en mode vente."
            : verdict === "strategique"
            ? "Bon potentiel — la préparation fera la différence."
            : "Mieux vaut préparer la propriété avant de vendre."}
        </p>
      </div>
    </motion.div>
  );
}
