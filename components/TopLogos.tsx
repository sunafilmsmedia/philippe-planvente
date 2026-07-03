"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function TopLogos() {
  return (
    <>
      {/* Wordmark courtier (texte — aucun asset requis) */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-4 left-4 sm:top-6 sm:left-6 z-30 pointer-events-none"
        aria-hidden
      >
        <div className="flex items-center gap-2 sm:gap-2.5">
          <Image
            src="/pl-mark.png"
            alt="Philippe Laroche"
            width={720}
            height={720}
            priority
            className="h-9 sm:h-11 w-auto"
          />
          <div className="leading-none">
            <p className="font-sans font-extrabold uppercase tracking-tight text-[var(--color-ink)] text-sm sm:text-base">
              Avec Laroche
            </p>
            <p className="font-serif italic text-[10px] sm:text-xs text-[var(--color-muted)] mt-0.5">
              c&apos;est sur la coche
            </p>
          </div>
        </div>
      </motion.div>

      {/* Bannière RE/MAX */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-30 pointer-events-none"
        aria-hidden
      >
        <Image
          src="/logo-remax.png"
          alt="RE/MAX Cité"
          width={1080}
          height={690}
          priority
          className="h-10 sm:h-12 w-auto"
        />
      </motion.div>
    </>
  );
}
