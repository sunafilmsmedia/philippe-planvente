"use client";

import { useMemo, useState } from "react";
import { REGIONS } from "@/lib/regions";

interface Props {
  value?: string;
  onChange: (id: string) => void;
}

// Termes de recherche additionnels (abréviations, secteurs voisins) par id.
const ALIASES: Record<string, string[]> = {
  rdp: ["rdp", "riviere des prairies"],
  pat: ["pat", "pointe aux trembles"],
  repentigny: ["le gardeur", "gardeur"],
  terrebonne: ["la plaine"],
  "saint-leonard": ["st leonard"],
  hochelaga: ["maisonneuve", "hochelaga maisonneuve"],
};

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function RegionInput({ value, onChange }: Props) {
  const selectedName = value ? REGIONS.find((r) => r.id === value)?.name ?? "" : "";
  const [query, setQuery] = useState(selectedName);

  const matches = useMemo(() => {
    const q = normalize(query);
    if (!q) return REGIONS;
    return REGIONS.filter((r) => {
      const hay = [normalize(r.name), ...(ALIASES[r.id] ?? []).map(normalize)];
      return hay.some((h) => h.includes(q) || q.includes(h));
    });
  }, [query]);

  const isConfirmed = !!value && normalize(query) === normalize(selectedName);

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
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ex. Repentigny, Pointe-aux-Trembles, Mascouche…"
          className="flex-1 bg-transparent text-lg sm:text-xl text-[var(--color-ink)] placeholder:text-black/30 focus:outline-none"
        />
      </div>

      {isConfirmed ? (
        <div className="flex items-center justify-center gap-2 text-sm font-medium text-emerald-700">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600 text-white shrink-0">
            <svg className="w-3 h-3" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 10L8 14L16 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          Bien reçu — {selectedName}. On génère ton plan…
        </div>
      ) : (
        <div className="grid gap-2 max-h-64 overflow-y-auto">
          {matches.length > 0 ? (
            matches.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  setQuery(r.name);
                  onChange(r.id);
                }}
                className="text-left rounded-xl px-4 py-3 glass-card hover:border-black/15 hover:bg-black/[0.02] transition-colors text-[var(--color-brand-100)] font-medium"
              >
                {r.name}
              </button>
            ))
          ) : (
            <p className="text-sm text-[var(--color-muted)] text-center py-3">
              Aucun secteur trouvé. Choisis le secteur desservi le plus proche de chez toi.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
