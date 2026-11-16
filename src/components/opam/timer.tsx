"use client";

export function Timer({ seconds, total }: { seconds: number; total: number }) {
  const r = 19;
  const c = 2 * Math.PI * r;
  const frac = Math.max(0, Math.min(1, seconds / total));
  const low = seconds <= 5;
  return (
    <div
      className="relative flex h-[46px] w-[46px] items-center justify-center"
      aria-live="off"
      aria-label={`${seconds} seconds remaining`}
    >
      <svg width="46" height="46" viewBox="0 0 46 46" aria-hidden="true">
        <circle cx="23" cy="23" r={r} fill="none" stroke="#1b3a52" strokeWidth="4" />
        <circle
          cx="23"
          cy="23"
          r={r}
          fill="none"
          stroke={low ? "#c25555" : "#d9a63c"}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={c.toFixed(1)}
          strokeDashoffset={(c * (1 - frac)).toFixed(1)}
        />
      </svg>
      <span
        className="absolute text-xs font-bold tabular-nums"
        style={low ? { color: "#c25555" } : undefined}
      >
        {seconds}s
      </span>
    </div>
  );
}
