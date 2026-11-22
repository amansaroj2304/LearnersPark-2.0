"use client";

import Link from "next/link";
import { useState } from "react";
import type { PpdtSample } from "@/lib/ppdt/config";
import { PpdtRunner } from "@/components/ppdt/runner";

type Mode = "practice" | "timed";

export type HubSet = { slug: string; title: string; image: string; alt: string; available: boolean };

const STEPS = [
  ["Look at the picture", "30 seconds in the real test. Count the characters, note their age, sex and mood."],
  ["Build the story", "Who is the main character, what is happening, and what does he or she do about it?"],
  ["Write it down", "Four minutes. Write in past tense, keep the mood positive, and end with an action."],
  ["Check and upload", "Compare with the sample stories, then upload a photo of your handwritten sheet."],
] as const;

export function PracticeHub({
  image,
  alt,
  imageAvailable,
  samples,
  sets,
}: {
  image: string;
  alt: string;
  imageAvailable: boolean;
  samples: PpdtSample[];
  sets: HubSet[];
}) {
  const [choice, setChoice] = useState<{ mode: Mode; set?: HubSet } | null>(null);

  if (choice) {
    const isTimed = choice.mode === "timed";
    const set = choice.set;
    return (
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-ink/60">
            {isTimed && set
              ? `Timed mode — ${set.title} · 30 s look, 4 min write`
              : "Practice mode — picture stays visible"}
          </p>
          <button
            type="button"
            onClick={() => setChoice(null)}
            className="h-9 rounded-lg border border-ink/15 px-4 text-sm font-semibold text-ink hover:bg-ink/5"
          >
            Change mode
          </button>
        </div>
        <PpdtRunner
          key={`${choice.mode}-${set?.slug ?? "practice"}`}
          title={isTimed && set ? set.title : "PPDT practice"}
          image={set ? set.image : image}
          alt={set ? set.alt : alt}
          imageAvailable={set ? set.available : imageAvailable}
          mode={choice.mode}
          samples={samples}
          setSlug={set ? set.slug : "practice"}
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

      <section aria-label="Practice mode" className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-bold text-ink">Practice mode</h2>
          <span className="rounded-full bg-ink/5 px-2.5 py-1 text-[11px] font-semibold text-ink/60">
            Picture stays visible
          </span>
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/60">
          No clock pressure. The picture stays on screen, a count-up timer runs, and sample stories can be
          revealed once you have written yours.
        </p>
        <button
          type="button"
          onClick={() => setChoice({ mode: "practice" })}
          disabled={!imageAvailable}
          className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-crimson px-5 text-sm font-semibold text-white hover:bg-crimson-shape disabled:cursor-not-allowed disabled:opacity-40"
        >
          {imageAvailable ? "Start practice mode" : "Picture not uploaded yet"}
        </button>
      </section>

      <section aria-label="Timed mode sets" className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-bold text-ink">Timed mode</h2>
          <span className="rounded-full bg-ink/5 px-2.5 py-1 text-[11px] font-semibold text-ink/60">
            Real timing · picture withdrawn
          </span>
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/60">
          The real sequence: 30 seconds to look, the picture is withdrawn, then 4 minutes to write from
          memory. Ten independent sets — do any one of them on its own, in any order.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {sets.map((s) => (
            <button
              key={s.slug}
              type="button"
              onClick={() => setChoice({ mode: "timed", set: s })}
              disabled={!s.available}
              className="flex h-16 flex-col items-start justify-center rounded-xl border border-ink/15 px-3 text-left transition hover:border-crimson hover:bg-crimson/[0.04] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span className="text-sm font-bold text-ink">{s.title.replace("PPDT Test ", "")}</span>
              <span className="text-[11px] text-ink/50">30 s look · 4 min write</span>
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-ink/45">
          Each set has its own picture and its own clock; they do not depend on each other. The full
          standalone list is also at{" "}
          <Link href="/ppdt/sets" className="font-semibold text-crimson hover:underline">
            All PPDT sets
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
