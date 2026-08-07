"use client";

import { useState } from "react";
import { SECTORS } from "@/lib/marketData";

interface Props {
  value?: string; // texte saisi (regionText)
  onChange: (text: string, matchedId?: string) => void;
  onSubmit: (text: string, matchedId?: string) => void;
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Identifie (en silence) l'id du secteur si le texte correspond à un secteur connu.
function matchId(query: string): string | undefined {
  const q = normalize(query);
  if (!q) return undefined;
  const exact = SECTORS.find(
    (s) => normalize(s.name) === q || (s.aliases ?? []).some((a) => normalize(a) === q)
  );
  if (exact) return exact.id;
  const contains = SECTORS.filter((s) => {
    const hay = [normalize(s.name), ...(s.aliases ?? []).map(normalize)];
    return hay.some((h) => h.includes(q) || q.includes(h));
  });
  return contains.length === 1 ? contains[0].id : undefined;
}

export default function RegionInput({ value, onChange, onSubmit }: Props) {
  const [query, setQuery] = useState(value ?? "");
  const canSubmit = query.trim().length > 0;

  const submit = () => {
    if (canSubmit) onSubmit(query.trim(), matchId(query));
  };

  return (
    <div className="space-y-3">
      <div className="glass-card rounded-2xl px-5 py-4 flex items-center gap-3">
        <svg className="w-5 h-5 shrink-0 text-[var(--color-brand-500)]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M10 2.5c3 0 5.5 2.4 5.5 5.4 0 3.7-5.5 9.6-5.5 9.6S4.5 11.6 4.5 7.9C4.5 4.9 7 2.5 10 2.5Z" strokeLinejoin="round" />
          <circle cx="10" cy="8" r="2" />
        </svg>
        <input
          type="text"
          autoFocus
          autoComplete="off"
          value={query}
          onChange={(e) => {
            const text = e.target.value;
            setQuery(text);
            onChange(text, matchId(text));
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Écris ta ville ou ton quartier…"
          className="flex-1 bg-transparent text-lg sm:text-xl text-[var(--color-ink)] placeholder:text-black/30 focus:outline-none"
        />
      </div>

      <button
        type="button"
        onClick={submit}
        disabled={!canSubmit}
        className="
          w-full inline-flex items-center justify-center gap-2
          px-6 py-3.5 rounded-full text-base font-medium
          bg-gradient-to-b from-[var(--color-brand-500)] to-[var(--color-brand-700)]
          text-white
          shadow-[0_15px_40px_-10px_rgba(225,29,46,0.55)]
          hover:shadow-[0_20px_50px_-10px_rgba(225,29,46,0.7)]
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all
        "
      >
        Suivant
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 10h10M11 6l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <p className="text-xs text-[var(--color-muted-2)] text-center">
        Ton secteur n&apos;est pas couvert ? Écris-le quand même — on validera les
        données avec toi.
      </p>
    </div>
  );
}
