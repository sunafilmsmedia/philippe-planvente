"use client";

interface Props {
  value?: number;
  onChange: (v: number | undefined) => void;
  min?: number;
  max?: number;
  suffix?: string;
}

export default function NumberQuestion({
  value,
  onChange,
  min = 0,
  max = 60,
  suffix = "ans",
}: Props) {
  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8">
      <div className="flex items-end gap-3">
        <input
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          autoFocus
          value={typeof value === "number" ? value : ""}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "") onChange(undefined);
            else onChange(Math.max(min, Math.min(max, Math.round(Number(v)))));
          }}
          placeholder="0"
          className="
            flex-1 font-serif text-5xl sm:text-6xl text-[var(--color-ink)] bg-transparent
            placeholder:text-black/20 focus:outline-none w-full
          "
        />
        <span className="text-base text-[var(--color-muted)] mb-2">{suffix}</span>
      </div>
    </div>
  );
}
