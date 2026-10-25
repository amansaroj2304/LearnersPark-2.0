"use client";

import { useCallback, useEffect, useState } from "react";
import { Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

function speechSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function AudioCue({
  cue,
  autoPlay = true,
  allowReplay = true,
  className,
}: {
  cue: string;
  autoPlay?: boolean;
  allowReplay?: boolean;
  className?: string;
}) {
  const [unsupported, setUnsupported] = useState(false);
  const [playing, setPlaying] = useState(false);

  const play = useCallback(() => {
    if (!speechSupported()) {
      setUnsupported(true);
      return;
    }
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(cue);
    utterance.rate = 0.85;
    utterance.pitch = 1;
    utterance.onstart = () => setPlaying(true);
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);
    synth.speak(utterance);
  }, [cue]);

  useEffect(() => {
    if (!autoPlay) return;
    const id = setTimeout(play, 400);
    return () => {
      clearTimeout(id);
      if (speechSupported()) window.speechSynthesis.cancel();
    };
  }, [autoPlay, play]);

  if (unsupported) {
    return (
      <div
        className={cn(
          "rounded-xl border border-gold/40 bg-gold/10 px-5 py-4",
          className,
        )}
      >
        <p className="text-xs font-semibold tracking-[0.14em] text-ink/50 uppercase">
          Audio unavailable — read the cue
        </p>
        <p className="mt-1 text-lg font-bold tracking-wide text-ink">{cue}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 rounded-xl border border-ink/15 bg-bg-light px-5 py-4",
        className,
      )}
    >
      {allowReplay ? (
        <button
          type="button"
          onClick={play}
          className="flex h-11 items-center gap-2 rounded-lg bg-ink px-5 text-sm font-semibold text-white transition-colors hover:bg-ink/85"
        >
          <Volume2 className="h-4 w-4" strokeWidth={2.4} />
          {playing ? "Playing…" : "Play audio"}
        </button>
      ) : (
        <span className="flex h-11 items-center gap-2 rounded-lg bg-ink px-5 text-sm font-semibold text-white">
          <Volume2 className="h-4 w-4" strokeWidth={2.4} />
          {playing ? "Playing audio…" : "Audio played"}
        </span>
      )}
      <span className="text-sm text-ink/55">
        {allowReplay
          ? "Listen and choose the matching option."
          : "Listen once and choose the matching option."}
      </span>
    </div>
  );
}
