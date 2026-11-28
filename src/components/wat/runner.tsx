"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { playClick } from "@/lib/sound";
import { WAT_TIMINGS } from "@/lib/wat/config";

type Phase = "idle" | "run" | "done";

const fmt = (s: number) => `0:${String(s).padStart(2, "0")}`;

export function WatRunner({ title, words }: { title: string; words: string[] }) {
  const total = words.length;
  const duration = WAT_TIMINGS.wordSeconds;
  const [phase, setPhase] = useState<Phase>("idle");
  const [index, setIndex] = useState(0);
  const [left, setLeft] = useState<number>(duration);
  const [paused, setPaused] = useState(false);
  // Wall-clock deadline, so a throttled/background tab cannot stretch a word.
  const endsAt = useRef(0);

  const showWord = useCallback(
    (next: number) => {
      endsAt.current = Date.now() + duration * 1000;
      setIndex(next);
      setLeft(duration);
      setPaused(false);
      setPhase("run");
    },
    [duration],
  );

  const advance = useCallback(() => {
    if (index < total - 1) {
      playClick("next");
      showWord(index + 1);
    } else {
      playClick("section");
      setPaused(false);
      setPhase("done");
    }
  }, [index, showWord, total]);

  const back = useCallback(() => {
    if (index > 0) {
      playClick("next");
      showWord(index - 1);
    }
  }, [index, showWord]);

  const start = useCallback(() => {
    playClick("section");
    showWord(0);
  }, [showWord]);

  // Derive the countdown from the deadline several times a second.
  useEffect(() => {
    if (phase !== "run" || paused) return;
    const tick = () => setLeft(Math.max(0, Math.ceil((endsAt.current - Date.now()) / 1000)));
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
  }, [phase, paused]);

  // Move to the next word when the clock reaches zero.
  useEffect(() => {
    if (phase !== "run" || left > 0) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    advance();
  }, [left, phase, advance]);

  const togglePause = () => {
    if (!paused) {
      setLeft(Math.max(0, Math.ceil((endsAt.current - Date.now()) / 1000)));
      setPaused(true);
    } else {
      endsAt.current = Date.now() + left * 1000;
      setPaused(false);
    }
  };

  const progress = phase === "done" ? 100 : (index / total) * 100;

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-ink">{title}</h2>
          <p className="text-xs font-semibold text-ink/45">
            {phase === "idle" ? `${total} words · ${duration} s each` : phase === "done" ? "Set complete" : `Word ${index + 1} of ${total}`}
          </p>
        </div>
        <span className="rounded-full bg-ink/5 px-3 py-1 text-sm font-semibold text-ink/70">
          {phase === "run" ? `Write — ${fmt(left)}` : phase === "done" ? "Time up" : `${duration} s per word`}
        </span>
      </div>

      <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <div className="relative flex min-h-[280px] flex-col items-center justify-center rounded-2xl border-2 border-crimson/25 bg-gradient-to-b from-white to-bg-light px-6 py-10 text-center">
            {phase === "idle" ? (
              <div className="flex flex-col items-center gap-3">
                <p className="text-xs font-bold tracking-[0.16em] text-crimson uppercase">{title}</p>
                <p className="max-w-sm text-sm text-ink/55">
                  {total} words, {duration} seconds each. Write the first sentence that comes to mind, then move on.
                </p>
                <button
                  type="button"
                  onClick={start}
                  className="mt-1 inline-flex h-11 items-center rounded-lg bg-crimson px-6 text-sm font-semibold text-white hover:bg-crimson-shape"
                >
                  Start set
                </button>
              </div>
            ) : phase === "run" ? (
              <>
                <p className="text-[clamp(2.6rem,9vw,5rem)] font-extrabold leading-tight tracking-[-0.03em] text-ink">
                  {words[index]}
                </p>
                <p className="mt-4 text-5xl font-extrabold tabular-nums text-crimson">{left}</p>
                <p className="mt-1 text-xs font-semibold text-ink/40">seconds left</p>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <p className="text-2xl font-extrabold text-ink">Set complete</p>
                <p className="text-sm text-ink/50">All {total} words done. Review your sentences and look for themes.</p>
                <button
                  type="button"
                  onClick={start}
                  className="mt-1 inline-flex h-10 items-center rounded-lg border border-ink/15 px-5 text-sm font-semibold text-ink hover:bg-ink/5"
                >
                  Run again
                </button>
              </div>
            )}
          </div>

          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
            <div className="h-full rounded-full bg-crimson transition-[width] duration-300" style={{ width: `${progress}%` }} />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {phase === "idle" ? (
              <button
                type="button"
                onClick={start}
                className="inline-flex h-10 items-center rounded-lg bg-crimson px-5 text-sm font-semibold text-white hover:bg-crimson-shape"
              >
                Start set
              </button>
            ) : null}

            {phase === "run" ? (
              <>
                <button
                  type="button"
                  onClick={togglePause}
                  className="inline-flex h-10 items-center rounded-lg border border-ink/15 px-4 text-sm font-semibold text-ink hover:bg-ink/5"
                >
                  {paused ? "Resume" : "Pause"}
                </button>
                <button
                  type="button"
                  onClick={back}
                  disabled={index === 0}
                  className="inline-flex h-10 items-center rounded-lg border border-ink/15 px-4 text-sm font-semibold text-ink hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={advance}
                  className="inline-flex h-10 items-center rounded-lg border border-ink/15 px-4 text-sm font-semibold text-ink hover:bg-ink/5"
                >
                  {index < total - 1 ? "Next word" : "Finish set"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playClick("section");
                    setPaused(false);
                    setPhase("done");
                  }}
                  className="inline-flex h-10 items-center rounded-lg border border-ink/15 px-4 text-sm font-semibold text-ink/70 hover:bg-ink/5"
                >
                  End set
                </button>
              </>
            ) : null}
          </div>

          {paused ? <p className="mt-3 text-xs font-semibold text-crimson">Paused — the clock is stopped.</p> : null}
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-ink/10 bg-bg-light p-4">
            <h3 className="text-xs font-bold tracking-[0.12em] text-ink/50 uppercase">How this set runs</h3>
            <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-ink/60">
              <li>· {total} words, one after another, like the real WAT.</li>
              <li>· {duration} seconds per word — one sentence, then the next word.</li>
              <li>· A click marks every word change; a double beep starts and ends the set.</li>
              <li>· Write on paper: positive, personal, action-oriented sentences.</li>
            </ul>
          </div>

          <div className="rounded-xl border border-ink/10 p-4">
            <h3 className="text-xs font-bold tracking-[0.12em] text-ink/50 uppercase">Words done</h3>
            <p className="mt-2 text-3xl font-extrabold tabular-nums text-ink">
              {phase === "done" ? total : phase === "run" ? index : 0}
              <span className="text-base font-semibold text-ink/40"> / {total}</span>
            </p>
            <p className="mt-1 text-[11px] text-ink/40">Each dot is one word.</p>
            <div className="mt-3 grid grid-cols-10 gap-1" aria-label="Word progress">
              {words.map((w, i) => (
                <span
                  key={`${i}-${w}`}
                  title={`${i + 1}. ${w}`}
                  className={`h-2.5 rounded-full ${
                    phase === "done" || i < index ? "bg-[#2f9e5b]" : i === index && phase === "run" ? "bg-crimson" : "bg-ink/10"
                  }`}
                />
              ))}
            </div>
          </div>

          <p className="text-xs leading-relaxed text-ink/45">
            Practice aid, not an assessment. The real WAT runs 15 seconds per word; boards may vary.
          </p>
        </div>
      </div>
    </div>
  );
}
