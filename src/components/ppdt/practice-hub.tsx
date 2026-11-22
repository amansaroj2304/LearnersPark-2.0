"use client";

import { useState } from "react";
import type { PpdtSample } from "@/lib/ppdt/config";
import { PpdtRunner } from "@/components/ppdt/runner";

type Mode = "practice" | "timed";

const STEPS = [
  ["Look at the picture", "30 seconds in the real test. Count the characters, note their age, sex and mood."],
  ["Build the story", "Who is the main character, what is happening, and what does he or she do about it?"],
  ["Write it down", "Four minutes. Write in past tense, keep the mood positive, and end with an action."],
  ["Check and upload", "Compare with the sample stories, then upload a photo of your handwritten sheet."],
] as const;

const TILES: { id: Mode; title: string; tag: string; body: string; cta: string }[] = [
  {
    id: "practice",
    title: "Practice mode",
    tag: "Picture stays visible",
    body: "No clock pressure. The picture stays on screen, a count-up timer runs, and sample stories can be revealed once you have written yours.",
    cta: "Start practice mode",
  },
  {
    id: "timed",
    title: "Timed mode",
    tag: "Real timing · picture withdrawn",
    body: "The real sequence: 30 seconds to look, the picture is withdrawn, then 4 minutes to write from memory.",
    cta: "Start timed mode",
  },
];

export function PracticeHub({
  image,
  alt,
  imageAvailable,
  samples,
}: {
  image: string;
  alt: string;
  imageAvailable: boolean;
  samples: PpdtSample[];
}) {
  const [mode, setMode] = useState<Mode | null>(null);

  if (mode) {
    return (
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-ink/60">
            {mode === "practice" ? "Practice mode — picture stays visible" : "Timed mode — 30 s look, 4 min write"}
          </p>
          <button
            type="button"
            onClick={() => setMode(null)}
            className="h-9 rounded-lg border border-ink/15 px-4 text-sm font-semibold text-ink hover:bg-ink/5"
          >
            Change mode
          </button>
        </div>
        <PpdtRunner
          key={mode}
          title={mode === "practice" ? "PPDT practice" : "PPDT timed practice"}
          image={image}
          alt={alt}
          imageAvailable={imageAvailable}
          mode={mode}
          samples={samples}
          setSlug="practice"
          autoStart
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-bold text-ink">Before you start — the four steps</h2>
        <ol className="mt-4 grid gap-4 sm:grid-cols-2">
          {STEPS.map(([title, body], i) => (
            <li key={title} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-ink/55">{body}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-xs text-ink/45">
          Your story is not scored here. Write on paper with the{" "}
          <a href="/docs/ppdt-practice-sheet.pdf" className="font-semibold text-crimson hover:underline">
            practice sheet
          </a>{" "}
          if you want the real layout, then upload a photo of it.
        </p>
      </section>

      <section aria-label="Choose a practice mode" className="grid gap-4 sm:grid-cols-2">
        {TILES.map((t) => (
          <article key={t.id} className="flex flex-col rounded-2xl border border-ink/10 bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-bold text-ink">{t.title}</h3>
              <span className="rounded-full bg-ink/5 px-2.5 py-1 text-[11px] font-semibold text-ink/60">{t.tag}</span>
            </div>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/60">{t.body}</p>
            <button
              type="button"
              onClick={() => setMode(t.id)}
              disabled={!imageAvailable}
              className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-crimson px-5 text-sm font-semibold text-white hover:bg-crimson-shape disabled:cursor-not-allowed disabled:opacity-40"
            >
              {imageAvailable ? t.cta : "Picture not uploaded yet"}
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}
