"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { playClick } from "@/lib/sound";
import { TAT_TIMINGS } from "@/lib/tat/config";

type Phase = "idle" | "look" | "write" | "done";

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export function TatRunner({ title, images }: { title: string; images: string[] }) {
  // The last slide of every TAT set is blank: no picture, you invent the story.
  const pictureCount = images.length;
  const total = pictureCount + 1;
  const [phase, setPhase] = useState<Phase>("idle");
  const [index, setIndex] = useState(0);
  const [left, setLeft] = useState<number>(TAT_TIMINGS.lookSeconds);
  const [paused, setPaused] = useState(false);

  const isBlank = index >= pictureCount;
  const currentImage = isBlank ? null : images[index];

  const advance = useCallback(() => {
    setIndex((i) => {
      if (i < total - 1) {
        playClick("section");
        setPhase("look");
        setLeft(TAT_TIMINGS.lookSeconds);
        return i + 1;
      }
      playClick("section");
      setPhase("done");
      return i;
    });
  }, [total]);

  // One tick per second while the clock is running.
  useEffect(() => {
    if ((phase !== "look" && phase !== "write") || paused) return;
    const id = setInterval(() => setLeft((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(id);
  }, [phase, paused]);

  // When a clock reaches zero: withdraw the slide, or move to the next one.
  useEffect(() => {
    if (left > 0) return;
    if (phase === "look") {
      playClick("section");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhase("write");
      setLeft(TAT_TIMINGS.writeSeconds);
    } else if (phase === "write") {
      advance();
    }
  }, [left, phase, advance]);

  const start = () => {
    playClick("section");
    setIndex(0);
    setPhase("look");
    setPaused(false);
    setLeft(TAT_TIMINGS.lookSeconds);
  };

  const running = phase === "look" || phase === "write";

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-ink">{title}</h2>
          <p className="text-xs font-semibold text-ink/45">
            {phase === "idle"
              ? `${pictureCount} pictures + blank slide`
              : phase === "done"
                ? "Set complete"
                : isBlank
                  ? `Slide ${index + 1} of ${total} · blank`
                  : `Slide ${index + 1} of ${total}`}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="rounded-full bg-ink/5 px-3 py-1 font-semibold text-ink/70">
            {phase === "look"
              ? `Look — ${fmt(left)}`
              : phase === "write"
                ? `Write — ${fmt(left)}`
                : phase === "done"
                  ? "Time up"
                  : "30 s look · 4 min 30 s write"}
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-ink/15 bg-white">
            {phase === "idle" ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-bg-light px-6 text-center">
                <p className="text-xs font-bold tracking-[0.16em] text-crimson uppercase">{title}</p>
                <p className="text-sm text-ink/55">
                  {pictureCount} pictures and one blank slide. Press start when your sheet and pen are ready.
                </p>
                <button
                  type="button"
                  onClick={start}
                  className="mt-1 inline-flex h-11 items-center rounded-lg bg-crimson px-6 text-sm font-semibold text-white hover:bg-crimson-shape"
                >
                  Start set
                </button>
              </div>
            ) : null}

            {phase === "look" && currentImage ? (
              <Image
                key={currentImage}
                src={currentImage}
                alt="TAT practice picture"
                fill
                sizes="(max-width: 1024px) 100vw, 720px"
                className="object-contain"
                priority
              />
            ) : null}

            {phase === "look" && isBlank ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-white px-6 text-center">
                <p className="text-base font-bold text-ink/70">Blank slide</p>
                <p className="text-sm text-ink/45">No picture this time — invent your own and build the story.</p>
              </div>
            ) : null}

            {phase === "look" ? (
              <span className="absolute right-3 top-3 flex h-12 w-12 items-center justify-center rounded-full bg-crimson text-base font-extrabold text-white shadow">
                {left}
              </span>
            ) : null}

            {phase === "write" ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-white px-6 text-center">
                <p className="text-base font-bold text-ink/70">{isBlank ? "Blank slide withdrawn" : "Picture withdrawn"}</p>
                <p className="text-sm text-ink/45">
                  {isBlank ? "Write the story you imagined on your sheet." : "Write the story from memory on your sheet."}
                </p>
                <p className="mt-2 text-3xl font-extrabold tabular-nums text-crimson">{fmt(left)}</p>
              </div>
            ) : null}

            {phase === "done" ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white px-6 text-center">
                <p className="text-base font-bold text-ink">Set complete</p>
                <p className="text-sm text-ink/50">
                  All {pictureCount} pictures and the blank slide done. Check your stories against the TAT notes.
                </p>
                <button
                  type="button"
                  onClick={start}
                  className="mt-2 inline-flex h-10 items-center rounded-lg border border-ink/15 px-5 text-sm font-semibold text-ink hover:bg-ink/5"
                >
                  Run again
                </button>
              </div>
            ) : null}
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

            {running ? (
              <>
                <button
                  type="button"
                  onClick={() => setPaused((p) => !p)}
                  className="inline-flex h-10 items-center rounded-lg border border-ink/15 px-4 text-sm font-semibold text-ink hover:bg-ink/5"
                >
                  {paused ? "Resume" : "Pause"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPaused(false);
                    advance();
                  }}
                  className="inline-flex h-10 items-center rounded-lg border border-ink/15 px-4 text-sm font-semibold text-ink hover:bg-ink/5"
                >
                  {index < total - 1 ? "Next slide" : "Finish set"}
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

          {paused ? (
            <p className="mt-3 text-xs font-semibold text-crimson">Paused — the clock is stopped.</p>
          ) : null}
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-ink/10 bg-bg-light p-4">
            <h3 className="text-xs font-bold tracking-[0.12em] text-ink/50 uppercase">How this set runs</h3>
            <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-ink/60">
              <li>· {pictureCount} pictures, one after another, like the real TAT.</li>
              <li>· Each picture stays for 30 seconds, then is withdrawn.</li>
              <li>· 4 minutes 30 seconds to write each story on your sheet.</li>
              <li>· The 12th slide is blank — invent the picture and the story.</li>
              <li>· A double beep marks every slide change and withdrawal.</li>
            </ul>
          </div>

          <div className="rounded-xl border border-ink/10 p-4">
            <h3 className="text-xs font-bold tracking-[0.12em] text-ink/50 uppercase">Progress</h3>
            <div className="mt-3 grid grid-cols-6 gap-1.5" aria-label="Slide progress">
              {Array.from({ length: total }, (_, i) => {
                const done = phase === "done" || i < index;
                const current = running && i === index;
                return (
                  <span
                    key={i}
                    className={`flex h-7 items-center justify-center rounded text-[11px] font-bold ${
                      current
                        ? "bg-crimson text-white"
                        : done
                          ? "bg-[#2f9e5b]/15 text-[#256e42]"
                          : "bg-ink/5 text-ink/40"
                    }`}
                    title={i === pictureCount ? "Blank slide" : `Slide ${i + 1}`}
                  >
                    {i + 1}
                  </span>
                );
              })}
            </div>
            <p className="mt-2 text-[11px] text-ink/40">Slide {total} is the blank slide.</p>
          </div>

          <p className="text-xs leading-relaxed text-ink/45">
            Write on paper, not here — this runner is a timed practice aid, not an assessment. Timing follows the
            usual TAT pattern (30 s look, 4 min 30 s write); boards may vary.
          </p>
        </div>
      </div>

      {/* Preload the pictures so a change never waits on the network. */}
      <div className="hidden" aria-hidden="true">
        {images.map((img) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={img} src={img} alt="" width={1} height={1} />
        ))}
      </div>
    </div>
  );
}
