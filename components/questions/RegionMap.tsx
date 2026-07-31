"use client";

import dynamic from "next/dynamic";
import { REGIONS } from "@/lib/regions";

const Inner = dynamic(() => import("./RegionMapInner"), { ssr: false });

interface Props {
  value?: string;
  onChange: (id: string) => void;
}

export default function RegionMap({ value, onChange }: Props) {
  return (
    <div className="space-y-3">
      <div className="relative w-full h-[440px] sm:h-[500px] rounded-2xl overflow-hidden border border-black/10 shadow-[0_30px_80px_-30px_rgba(40,12,14,0.6)]">
        <Inner value={value} onChange={onChange} />
      </div>
      {value ? (
        <div className="flex items-center justify-center gap-2 text-sm font-medium text-emerald-700">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600 text-white shrink-0">
            <svg className="w-3 h-3" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 10L8 14L16 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          Bien reçu — {REGIONS.find((r) => r.id === value)?.name}. On génère ton plan…
        </div>
      ) : (
        <p className="text-xs text-[var(--color-muted-2)] text-center">
          Touche la carte près de ta propriété — on sélectionne le secteur le plus proche.
        </p>
      )}
    </div>
  );
}
