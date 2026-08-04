"use client";

import { motion } from "framer-motion";

interface HeroProps {
  onStart: () => void;
}

export default function Hero({ onStart }: HeroProps) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-start px-5 sm:px-8 pt-20 sm:pt-28 pb-32">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-3xl text-center"
      >
        {/* Titre H1 */}
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-[var(--color-brand-100)] leading-[1.05] tracking-tight text-balance">
          Découvre le prix de vente moyen dans{" "}
          <span className="text-[var(--color-brand-500)]">l&apos;Est de Montréal</span>
          <span className="block mt-3 text-base sm:text-lg font-sans font-medium tracking-normal text-[var(--color-muted-2)]">
            Mis à jour · 2026
          </span>
        </h1>

        {/* Badge Propulsé par l'IA — rainbow bleu/blanc/rouge */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="mt-8 sm:mt-10 flex justify-center"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide border border-white/10"
            style={{ background: "#141726", boxShadow: "0 10px 30px -12px rgba(20,23,38,0.55)" }}
          >
            <svg className="w-3.5 h-3.5 shrink-0 text-[#6aa0ff]" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path d="M10 1.5l1.7 4.8L16.5 8l-4.8 1.7L10 14.5 8.3 9.7 3.5 8l4.8-1.7L10 1.5z" />
            </svg>
            <span className="ai-rainbow">Propulsé par l&apos;IA</span>
          </span>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="mt-10 sm:mt-12 flex flex-col items-center gap-3"
        >
          <button
            onClick={onStart}
            className="
              group relative inline-flex items-center justify-center gap-2
              px-8 sm:px-10 py-4
              rounded-full
              bg-gradient-to-b from-[var(--color-brand-500)] to-[var(--color-brand-700)]
              text-white font-medium text-base
              shadow-[0_20px_50px_-15px_rgba(225,29,46,0.6),0_0_0_1px_rgba(255,255,255,0.08)_inset]
              hover:shadow-[0_25px_60px_-10px_rgba(225,29,46,0.7),0_0_0_1px_rgba(255,255,255,0.12)_inset]
              transition-all duration-300
              hover:-translate-y-0.5
              active:translate-y-0
            "
          >
            <span>Obtenir mon plan</span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 10h10M11 6l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <p className="text-xs text-[var(--color-muted-2)]">Moins de 2 minutes — gratuit et confidentiel</p>
        </motion.div>

        {/* Sous-titre — à la fin */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="mt-12 sm:mt-14 text-base sm:text-lg text-[var(--color-muted)] max-w-xl mx-auto leading-relaxed text-balance"
        >
          Réponds à quelques questions et notre logiciel intelligent analyse ta propriété,
          ton marché et ton objectif pour te proposer la meilleure stratégie de vente.
        </motion.p>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-24 sm:bottom-10 left-1/2 -translate-x-1/2 text-[10px] text-[var(--color-muted-2)] uppercase tracking-[0.2em]"
      >
        Confidentiel · Sans engagement
      </motion.div>
    </section>
  );
}
