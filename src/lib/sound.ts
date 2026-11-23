"use client";

/**
 * Short synthesized "click" played on every section / word / situation change,
 * so a student writing with the screen half in view still notices the change.
 * No audio file needed; the Web Audio context is created on the first click.
 */
let ctx: AudioContext | null = null;

function context(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function blip(at: number, from: number, to: number, seconds = 0.09) {
  const ac = ctx;
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(from, at);
  osc.frequency.exponentialRampToValueAtTime(to, at + seconds * 0.8);
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(0.35, at + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + seconds);
  osc.connect(gain).connect(ac.destination);
  osc.start(at);
  osc.stop(at + seconds + 0.01);
}

/** "next" for word/situation changes, "section" for a double beep between sections. */
export function playClick(kind: "next" | "section" = "next") {
  try {
    const ac = context();
    if (!ac) return;
    const now = ac.currentTime + 0.01;
    if (kind === "section") {
      blip(now, 880, 440, 0.12);
      blip(now + 0.16, 1046, 523, 0.14);
    } else {
      blip(now, 1250, 700);
    }
  } catch {
    /* audio is a nicety; never break the test */
  }
}
