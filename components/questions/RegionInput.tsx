"use client";

import { useMemo, useState } from "react";
import { SECTORS } from "@/lib/marketData";

interface Props {
  value?: string; // texte saisi (regionText)
  onChange: (text: string, matchedId?: string) => void;
  onPick: (id: string, name: string) => void;
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

// Trouve l'id du secteur si le texte correspond clairement à un secteur connu.
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

export default function RegionInput({ value, onChange, onPick }: Props) {
  const [query, setQuery] = useState(value ?? "");

  const suggestions = useMemo(() => {
    const q = normalize(query);
    if (!q) return SECTORS.slice(0, 8);
    return SECTORS.filter((s) => {
      const hay = [normalize(s.name), ...(s.aliases ?? []).map(normalize)];
      return hay.some((h) => h.includes(q) || q.includes(h));
    }).slice(0, 8);
  }, [query]);

  // On masque les suggestions si le texte correspond déjà exactement à un secteur.
  const exactName = SECTORS.some((s) => normalize(s.name) === normalize(query));

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
          placeholder="Écris ta ville ou ton quartier…"
          className="flex-1 bg-transparent text-lg sm:text-xl text-[var(--color-ink)] placeholder:text-black/30 focus:outline-none"
        />
      </div>

      {!exactName && suggestions.length > 0 && (
        <div className="grid gap-2 max-h-64 overflow-y-auto pr-1">
          {suggestions.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setQuery(s.name);
                onPick(s.id, s.name);
              }}
              className="text-left rounded-xl px-4 py-2.5 glass-card hover:border-black/15 hover:bg-black/[0.02] transition-colors text-[var(--color-brand-100)] font-medium"
            >
              {s.name}
            </button>
          ))}
        </div>
      )}

      <p className="text-xs text-[var(--color-muted-2)] text-center">
        Ton secteur n&apos;est pas dans la liste ? Écris-le quand même — on validera les
        données avec toi.
      </p>
    </div>
  );
}
