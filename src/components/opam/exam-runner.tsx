"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Flag, ListChecks, X } from "lucide-react";
import { Timer } from "./timer";
import type { Answer, PublicQuestion } from "@/lib/opam/types";

type Answers = Record<string, Answer>;
type Spent = Record<string, number>;
type Flags = Record<string, boolean>;

const LETTERS = ["A", "B", "C", "D"] as const;

export function ExamRunner({
  setId,
  attemptId,
  questions,
  perQuestionSecs,
  totalSeconds,
  allowBackNav,
  initialAnswers = {},
  initialSpent = {},
  initialLocked = {},
  initialFlagged = {},
}: {
  setId: number;
  attemptId: string;
  questions: PublicQuestion[];
  perQuestionSecs: number;
  totalSeconds: number;
  allowBackNav: boolean;
  initialAnswers?: Answers;
  initialSpent?: Spent;
  initialLocked?: Record<string, boolean>;
  initialFlagged?: Flags;
}) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [spent, setSpent] = useState<Spent>(initialSpent);
  const [locked, setLocked] = useState<Record<string, boolean>>(initialLocked);
  const [flagged, setFlagged] = useState<Flags>(initialFlagged);
  const [remaining, setRemaining] = useState<Record<string, number>>(() => {
    const r: Record<string, number> = {};
    for (const q of questions) r[q.id] = Math.max(0, perQuestionSecs - (initialSpent[q.id] ?? 0));
    return r;
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const q = questions[idx];
  const totalUsed = Object.values(spent).reduce((a, b) => a + b, 0);
  const answered = questions.filter((x) => answers[x.id]).length;
  const unanswered = questions.length - answered;
  const flaggedCount = Object.values(flagged).filter(Boolean).length;

  const save = useCallback(
    async (qid: string, val: string, secs: number) => {
      try {
        await fetch("/api/opam/answer", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ attemptId, questionId: qid, answer: val, spent: secs }),
          keepalive: true,
        });
      } catch {
        /* offline: the whole paper is sent on submit */
      }
    },
    [attemptId],
  );

  const nextOpen = useCallback(
    (from: number) => {
      for (let i = from + 1; i < questions.length; i++) if (!locked[questions[i].id]) return i;
      for (let i = 0; i < questions.length; i++) if (!locked[questions[i].id]) return i;
      return -1;
    },
    [questions, locked],
  );

  const advance = useCallback(() => {
    setIdx((i) => (i < questions.length - 1 ? i + 1 : i));
  }, [questions.length]);

  const submit = useCallback(
    async (mode: "manual" | "auto") => {
      if (submitting) return;
      setSubmitting(true);
      setSubmitError(null);
      try {
        const res = await fetch("/api/opam/submit", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ attemptId, answers, spent, locked, flagged, mode }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error ?? "submit failed");
        window.location.href = `/opam/attempt/${attemptId}/report`;
      } catch {
        setSubmitting(false);
        setSubmitError(
          "Submission failed. Your answers are still in this tab — check your connection and press Submit again.",
        );
      }
    },
    [attemptId, answers, flagged, locked, spent, submitting],
  );

  /* one interval, keyed on the current question — never one timer per question */
  useEffect(() => {
    const t = setInterval(() => {
      setRemaining((prev) => {
        const left = prev[q.id];
        if (left == null || locked[q.id]) return prev;
        const nxt = Math.max(0, left - 1);
        setSpent((s) => ({ ...s, [q.id]: (s[q.id] ?? 0) + 1 }));
        if (nxt === 0) {
          setLocked((l) => ({ ...l, [q.id]: true }));
          const nx = nextOpen(idx);
          if (nx === -1) setConfirmOpen(true);
          else setIdx(nx);
        }
        return { ...prev, [q.id]: nxt };
      });
    }, 1000);
    return () => clearInterval(t);
  }, [q.id, idx, locked, nextOpen]);

  useEffect(() => {
    if (totalUsed < totalSeconds || submitting) return;
    // Defer so the ceiling check never calls setState during render/effect flush.
    const t = setTimeout(() => void submit("auto"), 0);
    return () => clearTimeout(t);
  }, [totalUsed, totalSeconds, submitting, submit]);

  const choose = (val: Answer) => {
    if (locked[q.id]) return;
    setAnswers((a) => ({ ...a, [q.id]: val }));
    void save(q.id, val, spent[q.id] ?? 0);
    if (q.format === "agree" || q.format === "ab") setTimeout(advance, 220);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (confirmOpen) {
        if (event.key === "Escape") setConfirmOpen(false);
        return;
      }
      const k = event.key.toLowerCase();
      if (["a", "b", "c", "d"].includes(k)) {
        const letter = k.toUpperCase() as Answer;
        const allowed = q.part === 1 ? letter === "A" || letter === "D" : true;
        if (allowed) {
          event.preventDefault();
          choose(letter);
        }
        return;
      }
      if (k === "f") {
        event.preventDefault();
        setFlagged((f) => ({ ...f, [q.id]: !f[q.id] }));
        return;
      }
      if (k === "p") {
        event.preventDefault();
        setPaletteOpen((o) => !o);
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        advance();
      }
      if (event.key === "ArrowLeft" && allowBackNav) {
        event.preventDefault();
        setIdx((i) => Math.max(0, i - 1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const progress = ((idx + 1) / questions.length) * 100;
  const sectionName =
    q.part === 1 ? "Personality Profiling" : q.part === 2 ? "Forced Choice" : "Situational Judgement";

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f6ee]">
      <header className="sticky top-0 z-20 border-b border-ink/10 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <div>
            <p className="text-[11px] font-bold tracking-[0.14em] text-ink/45 uppercase">
              Part {q.part} · {sectionName}
            </p>
            <p className="text-sm font-semibold text-ink">
              Question {q.qnum} / {questions.length}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Timer seconds={remaining[q.id] ?? 0} total={perQuestionSecs} />
            <button
              type="button"
              onClick={() => setPaletteOpen((o) => !o)}
              aria-label="Question palette"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-ink/15 text-ink"
            >
              <ListChecks className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
        </div>
        <div className="h-1 w-full bg-ink/8">
          <div className="h-full bg-crimson transition-[width]" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        <div className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-7">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="rounded bg-ink/6 px-2 py-0.5 text-ink/60">Section {q.part} of 3</span>
            {locked[q.id] && <span className="rounded bg-crimson/10 px-2 py-0.5 text-crimson">Time closed</span>}
            {flagged[q.id] && <span className="rounded bg-gold/20 px-2 py-0.5 text-[#7a5c10]">Flagged</span>}
          </div>

          {q.part === 3 && (
            <>
              <div className="mt-4 rounded-xl bg-[#eef1e6] p-4 text-[15px] leading-relaxed text-ink">{q.text}</div>
              <p className="mt-3 text-sm text-ink/55">Choose the response you would most likely act on.</p>
              <div className="mt-4 flex flex-col gap-2">
                {(q.options ?? []).map((opt, i) => {
                  const letter = LETTERS[i];
                  const sel = answers[q.id] === letter;
                  return (
                    <button
                      key={letter}
                      type="button"
                      onClick={() => choose(letter)}
                      disabled={locked[q.id]}
                      className={`flex items-start gap-3 rounded-xl border p-3 text-left text-sm transition-colors ${
                        sel ? "border-crimson bg-crimson/5" : "border-ink/15 hover:border-ink/35"
                      } disabled:opacity-50`}
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-ink text-xs font-bold text-white">
                        {letter}
                      </span>
                      <span className="text-ink">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {q.part === 2 && (
            <>
              <p className="mt-4 text-[15px] font-medium leading-relaxed text-ink">{q.text}</p>
              <div className="mt-4 flex flex-col gap-2">
                {(["A", "B"] as const).map((letter) => {
                  const sel = answers[q.id] === letter;
                  return (
                    <button
                      key={letter}
                      type="button"
                      onClick={() => choose(letter)}
                      disabled={locked[q.id]}
                      className={`flex items-start gap-3 rounded-xl border p-3 text-left text-sm transition-colors ${
                        sel ? "border-crimson bg-crimson/5" : "border-ink/15 hover:border-ink/35"
                      } disabled:opacity-50`}
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-ink text-xs font-bold text-white">
                        {letter}
                      </span>
                      <span className="text-ink">{letter === "A" ? q.optionA : q.optionB}</span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-sm text-ink/55">
                Both options are defensible. Choose the one closer to what you would actually do.
              </p>
            </>
          )}

          {q.part === 1 && (
            <>
              <p className="mt-4 text-[15px] font-medium leading-relaxed text-ink">{q.text}</p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {(["A", "D"] as const).map((letter) => {
                  const sel = answers[q.id] === letter;
                  return (
                    <button
                      key={letter}
                      type="button"
                      onClick={() => choose(letter)}
                      disabled={locked[q.id]}
                      className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-colors ${
                        sel ? "border-crimson bg-crimson/5 text-crimson" : "border-ink/15 text-ink hover:border-ink/35"
                      } disabled:opacity-50`}
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-ink text-xs font-bold text-white">
                        {letter}
                      </span>
                      {letter === "A" ? "Agree" : "Disagree"}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-sm text-ink/55">
                Answer as you usually behave, not as you would like to be described.
              </p>
            </>
          )}
        </div>

        <p className="mt-3 text-xs text-ink/45">
          Keys: A/D choose · ←/→ move · F flag · P palette. Time already spent on a question is not
          returned when you revisit it.
        </p>
      </main>

      <footer className="sticky bottom-0 border-t border-ink/10 bg-white">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3">
          <button
            type="button"
            disabled={idx === 0 || !allowBackNav}
            onClick={() => setIdx((i) => Math.max(0, i - 1))}
            className="h-10 rounded-lg border border-ink/15 px-4 text-sm font-semibold text-ink disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setFlagged((f) => ({ ...f, [q.id]: !f[q.id] }))}
            className={`flex h-10 items-center gap-1.5 rounded-lg border px-3 text-sm font-semibold ${
              flagged[q.id] ? "border-gold bg-gold/15 text-[#7a5c10]" : "border-ink/15 text-ink"
            }`}
          >
            <Flag className="h-4 w-4" strokeWidth={2.2} />
            Flag
          </button>
          <span className="flex-1" />
          <button
            type="button"
            onClick={() => (idx === questions.length - 1 ? setConfirmOpen(true) : advance())}
            className="h-10 rounded-lg bg-crimson px-5 text-sm font-semibold text-white"
          >
            {idx === questions.length - 1 ? "Review & Submit" : "Next"}
          </button>
        </div>
      </footer>

      {paletteOpen && (
        <div className="fixed inset-0 z-30" role="dialog" aria-label="Question palette">
          <button
            type="button"
            aria-label="Close palette"
            className="absolute inset-0 bg-ink/50"
            onClick={() => setPaletteOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-ink">Question palette</h2>
              <button type="button" onClick={() => setPaletteOpen(false)} aria-label="Close">
                <X className="h-5 w-5 text-ink/60" />
              </button>
            </div>
            <p className="mt-1 text-sm text-ink/55">
              {answered} answered · {unanswered} left · {flaggedCount} flagged
            </p>
            <div className="mt-4 grid grid-cols-8 gap-1.5">
              {questions.map((item, i) => {
                const isLocked = locked[item.id];
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setIdx(i);
                      setPaletteOpen(false);
                    }}
                    className={`h-9 rounded-md text-xs font-semibold tabular-nums ${
                      i === idx
                        ? "bg-crimson text-white"
                        : answers[item.id]
                          ? "bg-[#2f9e5b]/15 text-[#256e42]"
                          : flagged[item.id]
                            ? "bg-gold/25 text-[#7a5c10]"
                            : "bg-ink/6 text-ink/60"
                    } ${isLocked ? "line-through opacity-60" : ""}`}
                  >
                    {item.qnum}
                  </button>
                );
              })}
            </div>
            <p className="mt-4 text-xs text-ink/50">
              A question whose {perQuestionSecs} seconds have run out is closed and cannot be answered.
            </p>
          </div>
        </div>
      )}

      {confirmOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-ink/60"
            onClick={() => setConfirmOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6">
            <h2 className="text-lg font-bold text-ink">Submit this paper?</h2>
            <p className="mt-1 text-sm text-ink/60">
              Once submitted you cannot return to the questions. Your practice report is generated
              immediately.
            </p>
            <dl className="mt-4 flex flex-col gap-2 text-sm">
              <div className="flex justify-between"><dt className="text-ink/55">Answered</dt><dd className="font-semibold text-ink">{answered} / {questions.length}</dd></div>
              <div className="flex justify-between"><dt className="text-ink/55">Unanswered</dt><dd className="font-semibold text-ink">{unanswered}</dd></div>
              <div className="flex justify-between"><dt className="text-ink/55">Flagged</dt><dd className="font-semibold text-ink">{flaggedCount}</dd></div>
              <div className="flex justify-between"><dt className="text-ink/55">Time used</dt><dd className="font-semibold text-ink">{Math.floor(totalUsed / 60)}:{String(totalUsed % 60).padStart(2, "0")} of {Math.floor(totalSeconds / 60)}:00</dd></div>
            </dl>
            {submitError && <p className="mt-3 rounded-lg bg-crimson/8 px-3 py-2 text-sm text-crimson">{submitError}</p>}
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setConfirmOpen(false)} className="h-10 rounded-lg border border-ink/15 px-4 text-sm font-semibold text-ink">
                Keep working
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => submit("manual")}
                className="h-10 rounded-lg bg-crimson px-4 text-sm font-semibold text-white disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Submit and see report"}
              </button>
            </div>
          </div>
        </div>
      )}
      <span className="hidden">{setId}</span>
    </div>
  );
}
