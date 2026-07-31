"use client";

import { motion } from "framer-motion";

const GOOGLE_REVIEWS_URL =
  "https://www.google.com/search?sca_esv=e755c4fcff4cb9a6&si=APenkKm7iecQ4G6P-TsbSMFKIQtv3EFIqRAFw-i8uEbk55Z-_1uC17_NXuPMRA572p3xvm3Oh8D_-kiKveZcert_lUTqVeV3cNIPIkuYJVs3QW__TYJD-3bPXblNPL4bEsElXjp0gqyaohlmr-cfnuKarcl1lofDVg%3D%3D&q=Philippe+Laroche+immobilier+Avis";

const REVIEWS = [
  {
    name: "Justine Thélin",
    meta: "Local Guide · 19 avis",
    text: "Nous avons eu le plaisir d'être accompagnés par Philippe pour la vente de notre condo. Très professionnel, optimiste, il explique bien tout ce qu'il y a à savoir et connaît parfaitement le marché de l'immobilier.",
  },
  {
    name: "Olivier Gagné",
    meta: "Local Guide · 18 avis",
    text: "Troisième transaction avec Philippe, toujours aussi agréable et rapide. Transaction effectuée en quelques jours au prix voulu. Encore un coup de circuit. Disponible, dévoué et professionnel. Je recommande grandement !",
  },
  {
    name: "Amélie Hébert",
    meta: "10 avis",
    text: "Philippe a été très professionnel et à l'écoute de mes besoins. La transaction s'est déroulée en 4 jours. Il m'a aidée dans la négociation et a apporté plusieurs points pertinents à prendre en compte. Je recommande 100 %.",
  },
  {
    name: "Brenda Rubio",
    meta: "5 avis",
    text: "J'ai vraiment eu une super expérience avec Phil. Professionnel, disponible, patient, il répond rapidement et est à l'écoute du début à la fin. Merci de nous avoir aidés à trouver cette belle maison. Un courtier fiable !",
  },
  {
    name: "Nancy Koudsey",
    meta: "Avis Google",
    text: "Service professionnel, courtois, et il travaille pour nous sans jamais de pression. Nous avons plusieurs transactions avec Philippe et il a toujours été à la hauteur. Hautement recommandé !",
  },
  {
    name: "Jason Tawfik",
    meta: "Local Guide · 14 avis",
    text: "Philippe m'a été recommandé par une collègue, et il a été excellent ! C'était mon premier achat et il a pris le temps de bien me guider et de m'expliquer chaque étape du processus. Toujours disponible.",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5" aria-label="5 étoiles sur 5">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} className="w-4 h-4 text-[#e0a63a]" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 15.9 4.7 17.6l1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export default function Reviews() {
  return (
    <section className="relative px-5 sm:px-8 pb-28 pt-4 max-w-5xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-10"
      >
        <p className="text-[11px] uppercase tracking-[0.25em] text-[var(--color-brand-300)] mb-3">
          Ce que disent ses clients
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl text-[var(--color-brand-100)] tracking-tight text-balance">
          Des vendeurs comblés, transaction après transaction
        </h2>
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-[var(--color-muted)]">
          <Stars />
          <span>Avis Google vérifiés</span>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {REVIEWS.map((r, i) => (
          <motion.a
            key={r.name}
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card rounded-2xl p-5 sm:p-6 flex flex-col no-underline transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_28px_70px_-30px_rgba(74,22,17,0.35)]"
          >
            <Stars />
            <blockquote className="mt-3 text-sm sm:text-[15px] text-[var(--color-brand-200)] leading-relaxed flex-1">
              « {r.text} »
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-brand-500)] to-[var(--color-brand-700)] text-white text-sm font-serif shrink-0">
                {r.name.charAt(0)}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-[var(--color-brand-100)] truncate">{r.name}</span>
                <span className="block text-[11px] text-[var(--color-muted-2)] truncate">{r.meta}</span>
              </span>
            </figcaption>
          </motion.a>
        ))}
      </div>

      <div className="mt-8 text-center">
        <a
          href={GOOGLE_REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-brand-500)] hover:text-[var(--color-brand-700)] transition-colors"
        >
          Voir tous les avis sur Google
          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 10h10M11 6l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  );
}
