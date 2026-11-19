"use client";

import { useEffect, useState } from "react";

const FIELDS = [
  { key: "characters", label: "Characters you see", hint: "Gender / age / mood — e.g. F 26 +, M 45 O" },
  { key: "main", label: "Main character", hint: "Who you will circle, and why" },
  { key: "situation", label: "Situation", hint: "What is happening in the picture" },
  { key: "action", label: "Action", hint: "What the main character does" },
  { key: "outcome", label: "Outcome", hint: "How it ends — keep it practical and positive" },
] as const;

type Draft = Record<(typeof FIELDS)[number]["key"], string>;
const EMPTY: Draft = { characters: "", main: "", situation: "", action: "", outcome: "" };
const KEY = "ppdt-draft-v1";

export function DraftSheet() {
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Deferred so the restored draft never triggers a cascading render.
    const t = setTimeout(() => {
      try {
        const raw = window.localStorage.getItem(KEY);
        if (raw) setDraft({ ...EMPTY, ...JSON.parse(raw) });
      } catch {
        /* ignore unreadable drafts */
      }
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const update = (key: keyof Draft, value: string) => {
    const next = { ...draft, [key]: value };
    setDraft(next);
    setSaved(false);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
      setSaved(true);
    } catch {
      /* storage full or blocked */
    }
  };

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-bold text-ink">Draft your story</h2>
        <span className="text-xs text-ink/45">{saved ? "Saved in this browser" : "Kept in this browser only"}</span>
      </div>
      <p className="mt-1 text-sm text-ink/60">
        A working sheet, not a test. Nothing is submitted or scored, and nothing leaves this device.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <label key={f.key} className={f.key === "outcome" ? "sm:col-span-2" : ""}>
            <span className="text-xs font-semibold text-ink/70">{f.label}</span>
            <textarea
              value={draft[f.key]}
              onChange={(e) => update(f.key, e.target.value)}
              rows={2}
              placeholder={f.hint}
              className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink placeholder:text-ink/30 focus:border-crimson focus:outline-none"
            />
          </label>
        ))}
      </div>
      <button
        type="button"
        onClick={() => {
          setDraft(EMPTY);
          try {
            window.localStorage.removeItem(KEY);
          } catch {
            /* ignore */
          }
          setSaved(false);
        }}
        className="mt-4 h-9 rounded-lg border border-ink/15 px-4 text-sm font-semibold text-ink/70 hover:bg-ink/5"
      >
        Clear sheet
      </button>
    </div>
  );
}
