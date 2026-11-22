"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PpdtSample } from "@/lib/ppdt/config";

type Mode = "timed" | "practice";
type Phase = "idle" | "perception" | "writing" | "done";

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export function PpdtRunner({
  title,
  image,
  alt,
  imageAvailable,
  mode = "timed",
  samples = [],
}: {
  title: string;
  image: string;
  alt: string;
  imageAvailable: boolean;
  mode?: Mode;
  samples?: PpdtSample[];
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [left, setLeft] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [story, setStory] = useState("");
  const [showSamples, setShowSamples] = useState(false);
  const startedAt = useRef<number>(0);
  const phaseRef = useRef<Phase>("idle");

  const endWriting = useCallback(() => {
    phaseRef.current = "done";
    setPhase("done");
  }, []);

  const startWriting = useCallback(() => {
    phaseRef.current = "writing";
    setPhase("writing");
    if (mode === "timed") setLeft(240);
  }, [mode]);

  const start = () => {
    startedAt.current = Date.now();
    setElapsed(0);
    setStory("");
    setShowSamples(false);
    if (mode === "timed") {
      phaseRef.current = "perception";
      setPhase("perception");
      setLeft(30);
    } else {
      startWriting();
    }
  };

  useEffect(() => {
    if (phase === "idle" || phase === "done") return;
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt.current) / 1000));
      if (mode !== "timed") return;
      setLeft((prev) => {
        if (prev > 1) return prev - 1;
        // The clock ran out: move on rather than stopping dead.
        if (phaseRef.current === "perception") startWriting();
        else endWriting();
        return 0;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase, mode, startWriting, endWriting]);

  const running = phase === "perception" || phase === "writing";

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-ink">{title}</h2>
        <div className="flex items-center gap-2 text-sm">
          <span className="rounded-full bg-ink/5 px-3 py-1 font-semibold text-ink/70">
            {mode === "timed"
              ? phase === "perception"
                ? `Look — ${fmt(left)}`
                : phase === "writing"
                  ? `Write — ${fmt(left)}`
                  : phase === "done"
                    ? "Time up"
                    : "30 s look · 4 min write"
              : `Elapsed ${fmt(elapsed)}`}
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          {imageAvailable ? (
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-ink/15 bg-ink/5">
              <Image
                src={image}
                alt={alt}
                fill
                sizes="(max-width: 1024px) 100vw, 640px"
                className={`object-cover ${phase === "writing" && mode === "timed" ? "opacity-0" : ""}`}
                priority
              />
              {phase === "writing" && mode === "timed" ? (
                <p className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-ink/40">
                  Picture withdrawn — write from memory
                </p>
              ) : null}
            </div>
          ) : (
            <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-ink/25 bg-ink/[0.03] p-6 text-center">
              <p className="text-sm font-semibold text-ink/60">Picture not uploaded yet</p>
              <p className="max-w-sm text-xs text-ink/45">
                This set is ready to run, but its picture is missing. Once the file is added at{" "}
                <code className="rounded bg-white px-1">{image}</code> the test opens here.
              </p>
            </div>
          )}

          {phase === "idle" ? (
            <button
              type="button"
              onClick={start}
              disabled={!imageAvailable}
              className="mt-4 inline-flex h-10 items-center rounded-lg bg-crimson px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Start {mode === "timed" ? "timed test" : "practice"}
            </button>
          ) : null}

          {phase === "perception" ? (
            <p className="mt-4 text-sm text-ink/60">
              Look at the picture and build your story: characters, their age and mood, and what is
              happening. Writing begins automatically.
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="story" className="text-xs font-bold tracking-[0.12em] text-ink/50 uppercase">
            Your story
          </label>
          <textarea
            id="story"
            value={story}
            onChange={(e) => setStory(e.target.value)}
            disabled={phase === "perception" || phase === "idle"}
            rows={10}
            placeholder={
              phase === "writing" || phase === "done"
                ? "Write the story here. It stays in this browser."
                : "The sheet opens when writing begins."
            }
            className="mt-2 w-full rounded-xl border border-ink/15 px-3 py-2 text-sm leading-relaxed text-ink placeholder:text-ink/30 disabled:bg-ink/[0.03]"
          />
          {phase === "writing" && mode === "timed" ? (
            <button
              type="button"
              onClick={endWriting}
              className="mt-2 h-9 rounded-lg border border-ink/15 px-4 text-sm font-semibold text-ink/70 hover:bg-ink/5"
            >
              Finish early
            </button>
          ) : null}

          {phase === "done" ? (
            <p className="mt-2 text-xs text-ink/50">
              {story.trim().split(/\s+/).filter(Boolean).length} words. Nothing was submitted or scored —
              this is a practice sheet.
            </p>
          ) : null}

          {mode === "practice" && samples.length > 0 ? (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setShowSamples((v) => !v)}
                aria-expanded={showSamples}
                className="h-9 rounded-lg border border-ink/15 px-4 text-sm font-semibold text-ink hover:bg-ink/5"
              >
                {showSamples ? "Hide sample stories" : "Story — see samples"}
              </button>
              {showSamples ? (
                <div className="mt-3 space-y-3">
                  {samples.map((s) => (
                    <article key={s.title} className="rounded-xl border border-ink/10 p-3">
                      <h3 className="text-sm font-bold text-ink">{s.title}</h3>
                      <p className="text-xs text-ink/55">{s.character}</p>
                      <p className="mt-1 text-xs font-semibold text-ink/70">{s.action}</p>
                      {s.story ? (
                        <p className="mt-2 text-sm leading-relaxed text-ink/70">{s.story}</p>
                      ) : (
                        <p className="mt-2 text-xs text-ink/40">No sample text supplied for this story.</p>
                      )}
                    </article>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {running && mode === "timed" ? (
        <p className="mt-4 text-xs text-ink/45">
          This is a practice structure, not an official assessment. Task order and timing vary by board
          and entry.
        </p>
      ) : null}
    </div>
  );
}
