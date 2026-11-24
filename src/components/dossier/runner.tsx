"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { createUploadTargets, saveDossierAttempt } from "@/app/dossier/actions";
import type { DossierDay } from "@/lib/dossier/data";
import { loadStudent, makeStudentId, saveStudent, type StudentProfile } from "@/lib/dossier/student";
import { playClick } from "@/lib/sound";
import { MAX_UPLOAD_BYTES, fileSizeLabel, uploadWithProgress } from "@/lib/upload";

type Stage = "intro" | "tat" | "wat" | "srt" | "prep" | "speak" | "review" | "submitted";

interface Saved {
  status: "IN PROGRESS" | "SUBMITTED";
  stage: Stage;
  startedAt: string;
  updatedAt: string;
  submittedAt?: string;
  tat: { text: string; secondsUsed: number };
  wat: { answer: string; secondsUsed: number }[];
  srt: { answer: string; secondsUsed: number }[];
  lecturette: { prepNotes: string; speakNotes: string; prepUsed: number; speakUsed: number };
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

function blank(day: DossierDay): Saved {
  return {
    status: "IN PROGRESS",
    stage: "intro",
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tat: { text: "", secondsUsed: 0 },
    wat: day.wat.map(() => ({ answer: "", secondsUsed: 0 })),
    srt: day.srt.map(() => ({ answer: "", secondsUsed: 0 })),
    lecturette: { prepNotes: "", speakNotes: "", prepUsed: 0, speakUsed: 0 },
  };
}

export function DossierRunner({
  day,
  timings,
  imageAvailable,
}: {
  day: DossierDay;
  timings: { tat: number; watWord: number; srt: number; prep: number; speak: number };
  imageAvailable: boolean;
}) {
  const key = `lp.dossier.day${day.day}`;
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [saved, setSaved] = useState<Saved | null>(null);
  const [stage, setStage] = useState<Stage>("intro");
  const [left, setLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [watIndex, setWatIndex] = useState(0);
  const [srtIndex, setSrtIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [skippedNote, setSkippedNote] = useState<string | null>(null);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);
  // One clear cue at the moment the TAT picture is withdrawn (30 s in).
  const withdrew = useRef(false);
  const tatWithdrawAt = timings.tat - 30;

  useEffect(() => {
    if (stage !== "tat" || left <= 0) {
      withdrew.current = false;
      return;
    }
    if (left <= tatWithdrawAt) {
      if (!withdrew.current) {
        withdrew.current = true;
        playClick("section");
      }
    } else {
      withdrew.current = false;
    }
  }, [stage, left, tatWithdrawAt]);

  // Values live in localStorage, so they are read after mount to keep SSR output stable.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStudent(loadStudent());
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const p = JSON.parse(raw) as Saved;
        if (p.wat?.length === day.wat.length && p.srt?.length === day.srt.length) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setSaved(p);
          setStage(p.status === "SUBMITTED" ? "submitted" : p.stage === "intro" ? "intro" : p.stage);
        }
      }
    } catch {
      /* ignore */
    }
  }, [key, day.wat.length, day.srt.length]);

  const persist = useCallback(
    (patch: Partial<Saved> = {}) => {
      setSaved((prev) => {
        const base = prev ?? blank(day);
        const next: Saved = { ...base, ...patch, updatedAt: new Date().toISOString() };
        window.localStorage.setItem(key, JSON.stringify(next));
        return next;
      });
    },
    [day, key],
  );

  const advance = useCallback(
    (from: Stage) => {
      if (tick.current) clearInterval(tick.current);
      setRunning(false);
      // Sound cue: a short click for every word/situation, double beep between sections.
      playClick(from === "tat" || from === "srt" || from === "prep" ? "section" : "next");
      if (from === "tat") {
        persist({ stage: "wat" });
        setWatIndex(0);
        setStage("wat");
        setLeft(timings.watWord);
        setRunning(true);
      } else if (from === "wat") {
        if (watIndex < day.wat.length - 1) {
          setWatIndex((i) => i + 1);
          setLeft(timings.watWord);
          setRunning(true);
        } else {
          persist({ stage: "srt" });
          setSrtIndex(0);
          setStage("srt");
          setLeft(timings.srt);
          setRunning(true);
        }
      } else if (from === "srt") {
        if (srtIndex < day.srt.length - 1) {
          setSrtIndex((i) => i + 1);
          setLeft(timings.srt);
          setRunning(true);
        } else {
          persist({ stage: "prep" });
          setStage("prep");
          setLeft(timings.prep);
          setRunning(true);
        }
      } else if (from === "prep") {
        persist({ stage: "speak" });
        setStage("speak");
        setLeft(timings.speak);
        setRunning(true);
      } else if (from === "speak") {
        persist({ stage: "review" });
        setStage("review");
      }
    },
    [day.wat.length, day.srt.length, persist, srtIndex, timings, watIndex],
  );

  useEffect(() => {
    if (!running) return;
    tick.current = setInterval(() => {
      setLeft((l) => {
        if (l <= 1) {
          setTimeout(() => advance(stage), 0);
          return 0;
        }
        return l - 1;
      });
    }, 1000);
    return () => {
      if (tick.current) clearInterval(tick.current);
    };
  }, [running, stage, advance]);

  const startSection = (s: Stage) => {
    playClick("section");
    setStage(s);
    persist({ stage: s, startedAt: saved?.startedAt ?? new Date().toISOString() });
    setLeft(s === "tat" ? timings.tat : s === "prep" ? timings.prep : s === "speak" ? timings.speak : 0);
    setRunning(s !== "review");
    if (s === "wat") {
      setWatIndex(0);
      setLeft(timings.watWord);
    }
    if (s === "srt") {
      setSrtIndex(0);
      setLeft(timings.srt);
    }
  };

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!student || !saved) return;
    setBusy(true);
    setMessage(null);
    const skipped: string[] = [];
    const uploaded: { kind: string; path: string }[] = [];
    try {
      const fd = new FormData(e.currentTarget);
      const sheets = fd.getAll("sheets").filter((f): f is File => f instanceof File && f.size > 0);
      const media = fd.get("media") as File | null;
      // Oversized attachments are skipped with a clear note instead of hanging:
      // storage rejects anything over 50 MB.
      const picked = [
        ...sheets.map((file, i) => ({ file, kind: "HANDWRITTEN", label: `Handwritten sheet ${i + 1}` })),
        { file: media, kind: "LECTURETTE", label: "Lecturette recording" },
      ].filter((f): f is { file: File; kind: string; label: string } => !!f.file && f.file.size > 0);
      if (!picked.some((f) => f.kind === "HANDWRITTEN")) {
        throw new Error("Please add at least one photo or PDF of your handwritten sheets");
      }
      const list = picked.filter((f) => {
        if (f.file.size > MAX_UPLOAD_BYTES) {
          skipped.push(`${f.label} (${fileSizeLabel(f.file.size)} — 50 MB limit)`);
          return false;
        }
        return true;
      });
      const files = list.map((f) => ({ kind: f.kind, ext: f.file.name.split(".").pop() ?? "bin" }));

      if (files.length) {
        const targets = await createUploadTargets(student.id, student.name, day.day, files);
        if (!targets.ok || !targets.targets) throw new Error(targets.message ?? "Could not prepare the upload.");
        for (let i = 0; i < list.length; i++) {
          const t = targets.targets[i];
          const f = list[i];
          try {
            await uploadWithProgress(t.path, t.token, f.file, (pct) =>
              setMessage(`Uploading ${f.label.toLowerCase()}… ${pct}%`),
            );
            uploaded.push({ kind: t.kind, path: t.path });
          } catch (err) {
            const reason = err instanceof Error ? err.message : "upload failed";
            if (/too large/i.test(reason)) {
              skipped.push(`${f.label} (${fileSizeLabel(f.file.size)} — 50 MB limit)`);
            } else {
              throw new Error(`${f.label}: ${reason}`);
            }
          }
        }
      }

      setMessage("Saving your answers…");
      const started = new Date(saved.startedAt).getTime();
      const res = await saveDossierAttempt(
        student,
        {
          day: day.day,
          status: "SUBMITTED",
          startedAt: saved.startedAt,
          submittedAt: new Date().toISOString(),
          totalSeconds: Math.round((Date.now() - started) / 1000),
          tat: saved.tat,
          wat: day.wat.map((w, i) => ({ word: w, ...saved.wat[i] })),
          srt: day.srt.map((s, i) => ({ situation: s, ...saved.srt[i] })),
          lecturette: { topic: day.lecturette, ...saved.lecturette },
          files: uploaded,
        },
      );
      if (!res.ok) throw new Error(res.message);
      if (skipped.length) {
        setSkippedNote(`Not uploaded (over the 50 MB limit): ${skipped.join("; ")}. Your submission was still recorded.`);
      }
      setMessage(null);
      persist({ status: "SUBMITTED", stage: "submitted", submittedAt: new Date().toISOString() });
      setStage("submitted");
    } catch (err) {
      setMessage(
        `${err instanceof Error ? err.message : "Submission failed"}. Your answers are still saved on this device — please try again.`,
      );
    } finally {
      setBusy(false);
    }
  }

  if (!student) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const p = {
            id: makeStudentId(),
            name: String(fd.get("name") ?? "").trim(),
            email: String(fd.get("email") ?? "").trim(),
            phone: String(fd.get("phone") ?? "").trim(),
          };
          if (!p.name) return;
          saveStudent(p);
          setStudent(p);
        }}
        className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6"
      >
        <h2 className="text-base font-bold text-ink">Create your student profile first</h2>
        <p className="mt-1 text-sm text-ink/55">One profile covers all 15 days and is attached to every submission.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <input name="name" required placeholder="Full name" className="h-10 rounded-lg border border-ink/15 px-3 text-sm" />
          <input name="email" type="email" placeholder="Email" className="h-10 rounded-lg border border-ink/15 px-3 text-sm" />
          <input name="phone" placeholder="Mobile" className="h-10 rounded-lg border border-ink/15 px-3 text-sm" />
        </div>
        <button type="submit" className="mt-4 h-10 rounded-lg bg-crimson px-5 text-sm font-semibold text-white">
          Create profile
        </button>
      </form>
    );
  }

  const sectionLabel =
    stage === "tat" ? "TAT" : stage === "wat" ? `WAT · word ${watIndex + 1}/${day.wat.length}` : stage === "srt" ? `SRT · situation ${srtIndex + 1}/${day.srt.length}` : stage === "prep" ? "Lecturette · preparation" : stage === "speak" ? "Lecturette · speaking" : "";
  // Like the real TAT: the picture is shown for 30 seconds, then withdrawn.
  const pictureSecondsLeft = Math.max(0, Math.min(30, left - (timings.tat - 30)));
  const pictureVisible = pictureSecondsLeft > 0;

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-ink">Day {day.day} drill</h2>
        <span className="rounded-full bg-ink/5 px-3 py-1 text-sm font-semibold text-ink/70">
          {sectionLabel || (stage === "review" ? "Review & submit" : stage === "submitted" ? "Submitted" : "Ready")}
          {running ? ` · ${fmt(left)}` : ""}
        </span>
      </div>

      {stage === "intro" ? (
        <div className="mt-4">
          <p className="text-sm text-ink/65">
            Four sections, in order: TAT story (4 min 30 s), 15 WAT words (15 s each), 10 SRT situations (30 s each),
            then one Lecturette topic (3 min preparation, 3 min speaking). Write every answer <strong>by hand on paper</strong> —
            there are no typing boxes.
          </p>
          <ul className="mt-3 space-y-1 text-xs text-ink/55">
            <li>· TAT picture is shown for 30 seconds, then withdrawn — write from memory for the remaining 4 minutes.</li>
            <li>· WAT and SRT advance automatically when the timer ends.</li>
            <li>· At the end, upload clear photos (or a PDF) of your handwritten sheets.</li>
          </ul>
          {saved && saved.stage !== "intro" ? (
            <p className="mt-3 text-xs font-semibold text-[#7a5c10]">You have a saved attempt in progress — resume where you left off.</p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => startSection(saved && saved.stage !== "intro" && saved.stage !== "review" ? (saved.stage as Stage) : "tat")}
              className="h-10 rounded-lg bg-crimson px-5 text-sm font-semibold text-white hover:bg-crimson-shape"
            >
              {saved && saved.stage !== "intro" ? "Resume" : "Start Day " + day.day}
            </button>
            {saved && saved.stage !== "intro" ? (
              <button type="button" onClick={() => startSection("tat")} className="h-10 rounded-lg border border-ink/15 px-4 text-sm font-semibold text-ink hover:bg-ink/5">
                Start over
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {stage === "tat" ? (
        <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div>
            {imageAvailable ? (
              pictureVisible ? (
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-ink/15 bg-white">
                  <Image src={day.tat.image} alt={`Day ${day.day} TAT picture`} fill sizes="(max-width:1024px) 100vw, 640px" className="object-contain" priority />
                  <span className="absolute right-2 top-2 rounded-full bg-ink/75 px-3 py-1 text-xs font-bold text-white">
                    Withdraws in {pictureSecondsLeft} s
                  </span>
                </div>
              ) : (
                <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-crimson/30 bg-crimson/[0.04] p-6 text-center">
                  <p className="text-sm font-bold text-crimson">Picture withdrawn</p>
                  <p className="max-w-sm text-sm text-ink/60">
                    The picture is shown for the first 30 seconds only, like the real test. Write your story from memory.
                  </p>
                </div>
              )
            ) : (
              <div className="flex aspect-[4/3] w-full items-center justify-center rounded-xl border border-dashed border-ink/25 bg-ink/[0.03] p-6 text-center text-sm text-ink/50">
                TAT picture for Day {day.day} has not been uploaded yet.
              </div>
            )}
            <p className="mt-3 text-xs text-ink/55">{day.tat.prompt}</p>
          </div>
          <div className="rounded-2xl border-2 border-crimson/30 bg-crimson/[0.03] p-5">
            <p className="text-sm font-bold text-ink">Write your story on paper</p>
            <p className="mt-2 text-sm text-ink/60">
              Use the answer sheet. You have {fmt(timings.tat)} in total; the picture disappears after 30 seconds.
            </p>
            <p className="mt-2 text-xs text-ink/45">Upload a photo of the sheet at the final step.</p>
            <button type="button" onClick={() => advance("tat")} className="mt-4 h-9 rounded-lg border border-ink/15 bg-white px-4 text-sm font-semibold text-ink hover:bg-ink/5">
              Finish TAT early
            </button>
          </div>
        </div>
      ) : null}

      {stage === "wat" ? (
        <div className="mt-4 max-w-2xl">
          <div className="flex min-h-[140px] items-center justify-center rounded-2xl border-2 border-ink/15 bg-white px-6 py-8 shadow-sm">
            <p className="text-center text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">{day.wat[watIndex]}</p>
          </div>
          <p className="mt-4 rounded-xl border border-ink/10 bg-ink/[0.02] px-4 py-3 text-sm text-ink/60">
            Write your first sentence for this word in your answer sheet. The next word appears automatically after 15 seconds.
          </p>
          <div className="mt-3 flex items-center justify-between text-xs text-ink/45">
            <span>Word {watIndex + 1} of {day.wat.length} · 15 s each</span>
            <button type="button" onClick={() => advance("wat")} className="h-8 rounded-lg border border-ink/15 px-3 text-xs font-semibold text-ink hover:bg-ink/5">
              Next word
            </button>
          </div>
        </div>
      ) : null}

      {stage === "srt" ? (
        <div className="mt-4 max-w-3xl">
          <div className="rounded-2xl border-2 border-ink/15 bg-white px-6 py-6 shadow-sm">
            <p className="text-xs font-bold tracking-[0.14em] text-crimson uppercase">Situation {srtIndex + 1}</p>
            <p className="mt-2 text-xl font-semibold leading-relaxed text-ink sm:text-2xl">{day.srt[srtIndex]}</p>
          </div>
          <p className="mt-3 rounded-xl border border-ink/10 bg-ink/[0.02] px-4 py-3 text-sm text-ink/60">
            Write your response in your answer sheet. The next situation appears automatically after 30 seconds.
          </p>
          <div className="mt-2 flex items-center justify-between text-xs text-ink/45">
            <span>Situation {srtIndex + 1} of {day.srt.length} · 30 s each</span>
            <button type="button" onClick={() => advance("srt")} className="h-8 rounded-lg border border-ink/15 px-3 text-xs font-semibold text-ink hover:bg-ink/5">
              Next situation
            </button>
          </div>
        </div>
      ) : null}

      {(stage === "prep" || stage === "speak") && saved ? (
        <div className="mt-4 max-w-2xl">
          <p className="text-xs font-bold tracking-[0.14em] text-crimson uppercase">Lecturette topic</p>
          <p className="mt-1 text-lg font-bold text-ink">{day.lecturette}</p>
          {stage === "prep" ? (
            <>
              <p className="mt-3 rounded-xl border border-ink/10 bg-ink/[0.02] px-4 py-3 text-sm text-ink/60">
                Preparation — jot your outline on paper (3 minutes). You may upload a photo of your outline at the end.
              </p>
              <button type="button" onClick={() => advance("prep")} className="mt-2 h-9 rounded-lg border border-ink/15 px-4 text-sm font-semibold text-ink hover:bg-ink/5">
                Start speaking early
              </button>
            </>
          ) : (
            <>
              <p className="mt-3 rounded-xl border border-ink/10 bg-ink/[0.02] px-4 py-3 text-sm text-ink/60">
                Speak for 3 minutes. Record it on your phone (or write notes on paper) and upload at the final step.
              </p>
              <button type="button" onClick={() => advance("speak")} className="mt-2 h-9 rounded-lg border border-ink/15 px-4 text-sm font-semibold text-ink hover:bg-ink/5">
                Finish early
              </button>
            </>
          )}
        </div>
      ) : null}

      {stage === "review" && saved ? (
        <div className="mt-4 space-y-5">
          <div className="rounded-xl border border-ink/10 p-4">
            <p className="text-xs font-bold uppercase text-ink/45">Lecturette topic</p>
            <p className="mt-1 text-sm text-ink/70">{day.lecturette}</p>
          </div>

          <form onSubmit={submit} className="rounded-2xl border-2 border-crimson/45 bg-crimson/[0.04] p-5 shadow-[0_8px_30px_rgba(128,0,32,0.08)] sm:p-6">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 items-center rounded-full bg-crimson px-3 text-[11px] font-bold uppercase tracking-[0.12em] text-white">
                Final step
              </span>
              <p className="text-base font-extrabold text-ink">Upload your handwritten Day {day.day} sheets</p>
            </div>
            <p className="mt-1 text-xs text-ink/55">
              Take clear photos of every written page (TAT, WAT, SRT and lecturette notes) or upload a scanned PDF. Each file must be under 50 MB.
            </p>
            <div className="mt-4 grid gap-3">
              <label className="block rounded-xl border border-crimson/25 bg-white px-4 py-3 text-sm font-semibold text-ink">
                Handwritten sheets <span className="font-normal text-ink/45">(photos or PDF — you can pick several)</span>
                <input name="sheets" type="file" accept="application/pdf,image/*" multiple required className="mt-2 block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-crimson file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white" />
              </label>
              <label className="block rounded-xl border border-crimson/25 bg-white px-4 py-3 text-sm font-semibold text-ink">
                Lecturette recording <span className="font-normal text-ink/45">(audio/video, optional, max 50 MB)</span>
                <input name="media" type="file" accept="audio/*,video/*" className="mt-2 block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-crimson file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white" />
              </label>
            </div>
            <p className="mt-2 text-xs text-ink/45">
              Files are saved with your student ID ({student.id}) and copied into the Drive folder
              DAILY DOSSIER SSB / Day {day.day} / {student.id}_{student.name.replace(/\s+/g, "_")}.
            </p>
            {message ? <p className="mt-2 text-xs font-semibold text-crimson">{message}</p> : null}
            <button type="submit" disabled={busy} className="mt-4 h-11 rounded-lg bg-crimson px-6 text-sm font-bold text-white disabled:opacity-50">
              {busy ? "Submitting…" : "Submit drill"}
            </button>
          </form>
        </div>
      ) : null}

      {stage === "submitted" ? (
        <div className="mt-4">
          <p className="text-sm font-semibold text-[#256e42]">Day {day.day} submitted{saved?.submittedAt ? ` on ${new Date(saved.submittedAt).toLocaleString()}` : ""}.</p>
          <p className="mt-2 text-sm text-ink/60">
            Your sheets are saved under your student ID and copied into Google Drive (DAILY DOSSIER SSB / Day {day.day}) at the next sync.
          </p>
          {skippedNote ? (
            <p className="mt-2 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
              {skippedNote}
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/dossier" className="h-10 rounded-lg bg-crimson px-5 pt-2.5 text-sm font-semibold text-white">
              Back to dashboard
            </Link>
            <button
              type="button"
              onClick={() => {
                setStage("review");
                setRunning(false);
              }}
              className="h-10 rounded-lg border border-ink/15 px-4 text-sm font-semibold text-ink hover:bg-ink/5"
            >
              Submit again
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
