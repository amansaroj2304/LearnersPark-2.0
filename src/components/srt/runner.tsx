"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { playClick } from "@/lib/sound";
import { SRT_TIMINGS } from "@/lib/srt/config";

type Stage = "intro" | "test" | "result";

const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export function SrtRunner({ title, slug, situations }: { title: string; slug: string; situations: string[] }) {
  const perPage = SRT_TIMINGS.perPage;
  const totalPages = Math.ceil(situations.length / perPage);
  const storageKey = `lp.srt.${slug}`;

  const [stage, setStage] = useState<Stage>("intro");
  const [page, setPage] = useState(0);
  const [reactions, setReactions] = useState<string[]>(() => new Array(situations.length).fill(""));
  const [remaining, setRemaining] = useState<number>(SRT_TIMINGS.totalSeconds);
  const [loaded, setLoaded] = useState(false);
  const endsAt = useRef(0);
  const finished = useRef(false);

  // Answers live in localStorage, so they are read after mount to keep SSR stable.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const saved = JSON.parse(raw) as { reactions?: string[] };
        if (Array.isArray(saved.reactions)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setReactions(
            new Array(situations.length).fill("").map((_, i) => (typeof saved.reactions?.[i] === "string" ? saved.reactions[i] : "")),
          );
        }
      }
    } catch {
      /* ignore corrupt storage */
    }
    setLoaded(true);
  }, [storageKey, situations.length]);

  const save = useCallback(
    (next: string[]) => {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify({ reactions: next, at: new Date().toISOString() }));
      } catch {
        /* storage full or blocked */
      }
    },
    [storageKey],
  );

  const submit = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    playClick("section");
    save(reactions);
    setStage("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [reactions, save]);

  const start = () => {
    finished.current = false;
    playClick("section");
    endsAt.current = Date.now() + SRT_TIMINGS.totalSeconds * 1000;
    setRemaining(SRT_TIMINGS.totalSeconds);
    setPage(0);
    setStage("test");
  };

  // Deadline-based countdown: a background tab cannot stretch the 30 minutes.
  useEffect(() => {
    if (stage !== "test") return;
    const tick = () => {
      const left = Math.max(0, Math.ceil((endsAt.current - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) submit();
    };
    tick();
    const id = setInterval(tick, 250);
    const onVisible = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [stage, submit]);

  const update = (index: number, value: string) => {
    setReactions((prev) => {
      const next = [...prev];
      next[index] = value;
      save(next);
      return next;
    });
  };

  const go = (next: number) => {
    playClick("next");
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const answered = reactions.filter((r) => r.trim()).length;
  const startIndex = page * perPage;
  const pageItems = situations.slice(startIndex, startIndex + perPage);
  const isLast = page === totalPages - 1;

  if (stage === "intro") {
    return (
      <div className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-bold text-ink">{title} — instructions</h2>
        <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-ink/65">
          <li>· {situations.length} situations in {totalPages} pages of {perPage}.</li>
          <li>· 30 minutes for the whole set — the clock starts when you press Start.</li>
          <li>· Write the first reaction that comes to mind: what the person in the situation does.</li>
          <li>· Answers save automatically in this browser, so a refresh does not lose them.</li>
          <li>· The test submits itself when the 30 minutes are over; you can also submit earlier.</li>
        </ul>
        {loaded && answered > 0 ? (
          <p className="mt-3 rounded-lg bg-gold/10 px-3 py-2 text-xs text-[#6b520f]">
            {answered} saved {answered === 1 ? "reaction" : "reactions"} found from an earlier attempt — they will be
            loaded when you start.
          </p>
        ) : null}
        <button
          type="button"
          onClick={start}
          className="mt-4 inline-flex h-10 items-center rounded-lg bg-crimson px-5 text-sm font-semibold text-white hover:bg-crimson-shape"
        >
          Start 30-minute test
        </button>
      </div>
    );
  }

  if (stage === "result") {
    return (
      <div className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-ink">{title} — result</h2>
          <span className="rounded-full bg-ink/5 px-3 py-1 text-sm font-semibold text-ink/70">
            {answered} of {situations.length} reactions written
          </span>
        </div>
        <div className="mt-4 space-y-3">
          {situations.map((q, i) => (
            <div key={i} className="rounded-xl border border-ink/10 p-3">
              <p className="text-sm font-semibold text-ink/80">
                {i + 1}. {q}
              </p>
              <p className="mt-1 whitespace-pre-line text-sm text-ink/60">
                {reactions[i].trim() || <span className="text-ink/35">(no reaction)</span>}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={start}
            className="inline-flex h-10 items-center rounded-lg bg-crimson px-5 text-sm font-semibold text-white hover:bg-crimson-shape"
          >
            Run again
          </button>
          <Link
            href="/srt"
            className="inline-flex h-10 items-center rounded-lg border border-ink/15 px-5 text-sm font-semibold text-ink hover:bg-ink/5"
          >
            All SRT sets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-ink">{title}</h2>
          <p className="text-xs font-semibold text-ink/45">
            Page {page + 1} of {totalPages} · situations {startIndex + 1}–{startIndex + pageItems.length}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-sm font-bold tabular-nums ${
            remaining <= 60 ? "bg-crimson text-white" : remaining <= 300 ? "bg-gold/25 text-[#7a5c10]" : "bg-ink/5 text-ink/70"
          }`}
        >
          {fmt(remaining)}
        </span>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
        <div
          className="h-full rounded-full bg-crimson transition-[width] duration-300"
          style={{ width: `${((page + 1) / totalPages) * 100}%` }}
        />
      </div>

      <div className="mt-5 space-y-4">
        {pageItems.map((q, offset) => {
          const i = startIndex + offset;
          return (
            <div key={i} className="rounded-xl border border-ink/10 p-4">
              <label htmlFor={`srt-${i}`} className="block text-sm font-semibold leading-relaxed text-ink/80">
                <span className="mr-1 font-extrabold text-crimson">{i + 1}.</span>
                {q}
              </label>
              <textarea
                id={`srt-${i}`}
                value={reactions[i]}
                onChange={(e) => update(i, e.target.value)}
                rows={2}
                placeholder="He…"
                className="mt-2 w-full rounded-lg border border-ink/15 px-3 py-2 text-sm leading-relaxed text-ink placeholder:text-ink/30"
              />
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => go(page - 1)}
          disabled={page === 0}
          className="inline-flex h-10 items-center rounded-lg border border-ink/15 px-4 text-sm font-semibold text-ink hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous page
        </button>
        <button
          type="button"
          onClick={() => go(page + 1)}
          disabled={isLast}
          className="inline-flex h-10 items-center rounded-lg border border-ink/15 px-4 text-sm font-semibold text-ink hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next page
        </button>
        <button
          type="button"
          onClick={submit}
          className="inline-flex h-10 items-center rounded-lg bg-crimson px-5 text-sm font-semibold text-white hover:bg-crimson-shape"
        >
          {isLast ? "Submit test" : "Submit early"}
        </button>
        <span className="text-xs font-semibold text-ink/45">{answered} / {situations.length} written</span>
      </div>

      <p className="mt-3 text-xs text-ink/45">
        Answers save automatically in this browser. The clock runs for 30 minutes and submits the test when it ends.
      </p>
    </div>
  );
}
