"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { BROKER } from "@/lib/broker";

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
        <div className="leading-none">
          <p className="font-serif text-lg sm:text-xl text-[var(--color-brand-100)] tracking-tight">
            {BROKER.name}
          </p>
          <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.28em] text-[var(--color-brand-300)] mt-0.5">
            {BROKER.title}
          </p>
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
