"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  FileText,
  Maximize,
  Pause,
  Play,
  User,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { cn, splitEmphasis } from "@/lib/utils";
import {
  csssSectionStarts,
  csssSections,
  sectionIndexForQuestion,
  type CsssQuestion,
} from "@/data/csss-questions";
import {
  PaletteGrid,
  PaletteLegend,
  countStatuses,
  type PaletteState,
} from "@/components/csss/test/palette";
import { QuestionVisual } from "@/components/csss/test/question-visual";
import { AudioCue } from "@/components/csss/test/audio-cue";

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

function splitTime(totalSeconds: number) {
  const safe = Math.max(totalSeconds, 0);
  return {
    h: pad(Math.floor(safe / 3600)),
    m: pad(Math.floor((safe % 3600) / 60)),
    s: pad(safe % 60),
  };
}

function estimateSpeechMs(cue: string) {
  const words = cue.trim().split(/\s+/).filter(Boolean).length;
  return 700 + words * 650;
}

function QuestionCountdown({
  delayMs,
  seconds,
  onExpire,
}: {
  delayMs: number;
  seconds: number;
  onExpire: () => void;
}) {
  const [remaining, setRemaining] = useState(seconds);
  const [active, setActive] = useState(delayMs === 0);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (delayMs === 0) return;
    const id = setTimeout(() => setActive(true), delayMs);
    return () => clearTimeout(id);
  }, [delayMs]);

  useEffect(() => {
    if (!active) return;
    if (remaining <= 0) {
      onExpireRef.current();
      return;
    }
    const id = setTimeout(() => setRemaining((value) => value - 1), 1000);
    return () => clearTimeout(id);
  }, [active, remaining]);

  return (
    <span
      className={cn(
        "text-sm font-bold tabular-nums",
        remaining <= 2 ? "text-crimson" : "text-ink",
      )}
    >
      00:{pad(remaining)}
    </span>
  );
}

function FlashGate({ flash, children }: { flash?: string; children: ReactNode }) {
  const [revealed, setRevealed] = useState(!flash);

  useEffect(() => {
    if (!flash) return;
    const id = setTimeout(() => setRevealed(true), 900);
    return () => clearTimeout(id);
  }, [flash]);

  if (revealed) return <>{children}</>;

  return (
    <div className="flex flex-col items-center justify-center gap-5 py-16">
      <span className="text-xs font-semibold tracking-[0.16em] text-ink/40 uppercase">
        Memorise
      </span>
      <span className="text-4xl font-bold tracking-[0.2em] text-ink tabular-nums sm:text-5xl">
        {flash}
      </span>
    </div>
  );
}

function PromptText({
  text,
  emphasizeAll,
}: {
  text: string;
  emphasizeAll: boolean;
}) {
  const segments = splitEmphasis(text);

  return (
    <p
      className={cn(
        "mb-4 text-base leading-relaxed text-ink last:mb-0",
        emphasizeAll && "font-bold",
      )}
    >
      {segments.map((segment, index) =>
        segment.bold ? (
          <strong key={index} className="font-bold text-ink">
            {segment.text}
          </strong>
        ) : (
          <span key={index}>{segment.text}</span>
        ),
      )}
    </p>
  );
}

export function TestScreen({
  title,
  questions,
  secondsLeft,
  marksCorrect,
  marksWrong,
  current,
  answers,
  marked,
  visited,
  onSelect,
  onNavigate,
  onMarkForReviewNext,
  onClearResponse,
  onSaveAndNext,
  onSubmit,
}: {
  title: string;
  questions: (CsssQuestion | null)[];
  secondsLeft: number;
  marksCorrect: number;
  marksWrong: number;
  current: number;
  answers: Record<number, number>;
  marked: Record<number, boolean>;
  visited: Record<number, boolean>;
  onSelect: (questionIndex: number, optionIndex: number) => void;
  onNavigate: (questionIndex: number) => void;
  onMarkForReviewNext: () => void;
  onClearResponse: () => void;
  onSaveAndNext: () => void;
  onSubmit: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [openSection, setOpenSection] = useState(0);

  const time = splitTime(secondsLeft);
  const question = questions[current];
  const activeSection = sectionIndexForQuestion(current);
  const sectionStart = csssSectionStarts[activeSection];
  const section = csssSections[activeSection];
  const localNumber = current - sectionStart + 1;
  const state: PaletteState = { current, answers, marked, visited };
  const counts = countStatuses(questions.length, state);
  const selected = answers[current];
  const locked = true;

  const handleNavigate = (questionIndex: number) => {
    onNavigate(questionIndex);
    setOpenSection(sectionIndexForQuestion(questionIndex));
  };

  const handleSaveAndNext = () => {
    const target = Math.min(current + 1, questions.length - 1);
    onSaveAndNext();
    setOpenSection(sectionIndexForQuestion(target));
  };

  const handleMarkForReviewNext = () => {
    const target = Math.min(current + 1, questions.length - 1);
    onMarkForReviewNext();
    setOpenSection(sectionIndexForQuestion(target));
  };

  const toggleFullscreen = () => {
    if (typeof document === "undefined") return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void document.documentElement.requestFullscreen();
    }
  };

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-white">
      <header className="flex h-[64px] shrink-0 items-center gap-4 border-b border-ink/10 px-4 sm:px-6">
        <Logo className="h-8 w-auto shrink-0" />
        <span className="hidden truncate text-sm font-medium text-ink/60 md:block">
          {title}
        </span>

        <div className="mx-auto flex items-center gap-2.5">
          <span className="text-sm font-semibold text-ink sm:text-base">
            Time Left
          </span>
          <div className="flex items-center gap-1.5">
            {[time.h, time.m, time.s].map((part, index) => (
              <span key={index} className="flex items-center gap-1.5">
                <span className="flex h-9 min-w-9 items-center justify-center rounded-md bg-ink/85 px-2 text-base font-bold text-white tabular-nums">
                  {part}
                </span>
                {index < 2 && <span className="text-base font-bold text-ink/70">:</span>}
              </span>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={toggleFullscreen}
            className="hidden h-10 items-center gap-2 rounded-lg border border-ink/15 px-4 text-sm font-medium text-ink transition-colors hover:bg-ink/5 sm:flex"
          >
            <Maximize className="h-4 w-4" strokeWidth={2.2} />
            Switch Full Screen
          </button>
          <button
            type="button"
            onClick={() => setPaused(true)}
            className="flex h-10 items-center gap-2 rounded-lg border border-ink/15 px-4 text-sm font-medium text-ink transition-colors hover:bg-ink/5"
          >
            <Pause className="h-4 w-4" strokeWidth={2.2} />
            Pause
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-[52px] shrink-0 items-center gap-4 border-b border-ink/10 px-4 sm:px-6">
            <span className="text-xs font-semibold tracking-[0.16em] text-ink/45 uppercase">
              Sections
            </span>
            <span className="rounded-md bg-ink px-6 py-1.5 text-sm font-semibold text-white">
              Test
            </span>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-ink/10 px-4 py-4 sm:px-6">
              <h2 className="text-base font-bold text-ink sm:text-lg">
                Question No. {localNumber}
              </h2>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-ink/70">Marks</span>
                  <span className="rounded-md bg-[#2f9e5b] px-2.5 py-1 text-xs font-bold text-white">
                    +{marksCorrect}
                  </span>
                  <span className="rounded-md bg-crimson px-2.5 py-1 text-xs font-bold text-white">
                    -{marksWrong}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-ink/70">Time</span>
                  <QuestionCountdown
                    key={current}
                    delayMs={
                      question?.flash
                        ? 900
                        : question?.cue
                          ? estimateSpeechMs(question.cue)
                          : 0
                    }
                    seconds={section.secondsPerQuestion}
                    onExpire={handleSaveAndNext}
                  />
                </div>
                <label className="flex items-center gap-2 text-sm font-semibold text-ink/70">
                  View in
                  <select
                    defaultValue="English"
                    className="h-9 rounded-md border border-ink/15 bg-bg-light px-3 text-sm font-medium text-ink focus:border-ink/30 focus:outline-none"
                  >
                    <option>English</option>
                    <option>Hindi</option>
                  </select>
                </label>
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-sm font-semibold text-crimson transition-opacity hover:opacity-75"
                >
                  <AlertTriangle className="h-4 w-4" strokeWidth={2.4} />
                  Report
                </button>
              </div>
            </div>

            <div className="px-4 py-8 sm:px-6 lg:px-10">
              <div className="max-w-[900px]">
                {question ? (
                  <FlashGate key={current} flash={question.flash}>
                    <>
                      {question.prompt.split("\n\n").map((paragraph) => (
                        <PromptText
                          key={paragraph}
                          text={paragraph}
                          emphasizeAll={activeSection !== 3}
                        />
                      ))}

                      {question.visual && (
                        <QuestionVisual visual={question.visual} className="mt-6" />
                      )}

                      {question.cue && (
                        <AudioCue
                          cue={question.cue}
                          allowReplay={false}
                          className="mt-6"
                        />
                      )}

                      <div className="mt-8 flex flex-col gap-4">
                        {question.options.map((option, optionIndex) => {
                          const isSelected = selected === optionIndex;
                          return (
                            <button
                              key={optionIndex}
                              type="button"
                              onClick={() => onSelect(current, optionIndex)}
                              className={cn(
                                "flex items-center gap-4 rounded-xl border px-5 py-4 text-left text-[0.98rem] transition-colors",
                                isSelected
                                  ? "border-crimson bg-crimson/5 text-ink"
                                  : "border-ink/15 bg-white text-ink/80 hover:border-ink/30 hover:bg-ink/[0.02]",
                              )}
                            >
                              <span
                                className={cn(
                                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                                  isSelected
                                    ? "border-crimson"
                                    : "border-ink/30",
                                )}
                              >
                                {isSelected && (
                                  <span className="h-2.5 w-2.5 rounded-full bg-crimson" />
                                )}
                              </span>
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  </FlashGate>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-ink/20 bg-bg-light/60 px-6 py-16 text-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink/8 text-ink/50">
                      <FileText className="h-6 w-6" strokeWidth={1.8} />
                    </span>
                    <p className="text-lg font-bold text-ink">
                      Questions coming soon
                    </p>
                    <p className="max-w-sm text-sm leading-relaxed text-ink/55">
                      Section {section.code} · {section.name} is being prepared.
                      Its {section.questionCount} questions will appear here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex h-[68px] shrink-0 items-center justify-between gap-3 border-t border-ink/10 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleMarkForReviewNext}
                disabled={locked}
                className="h-11 rounded-lg bg-bg-light-2 px-5 text-sm font-semibold text-ink transition-colors hover:bg-bg-light-2/70 disabled:pointer-events-none disabled:opacity-50"
              >
                Mark for Review &amp; Next
              </button>
              <button
                type="button"
                onClick={onClearResponse}
                disabled={selected === undefined}
                className="h-11 rounded-lg bg-bg-light-2 px-5 text-sm font-semibold text-ink transition-colors hover:bg-bg-light-2/70 disabled:pointer-events-none disabled:opacity-50"
              >
                Clear Response
              </button>
            </div>
            <button
              type="button"
              onClick={handleSaveAndNext}
              disabled={locked}
              className="h-11 rounded-lg bg-crimson px-7 text-sm font-semibold text-white transition-colors hover:bg-crimson-shape disabled:pointer-events-none disabled:opacity-50"
            >
              Save &amp; Next
            </button>
          </div>
        </div>

        <aside
          className={cn(
            "relative hidden shrink-0 flex-col border-l border-ink/10 bg-bg-light transition-all duration-200 md:flex",
            collapsed ? "w-[60px]" : "w-[272px] xl:w-[296px]",
          )}
        >
          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? "Expand palette" : "Collapse palette"}
            className="absolute top-1/2 -left-3.5 z-10 flex h-10 w-7 -translate-y-1/2 items-center justify-center rounded-l-md bg-ink text-white"
          >
            <ChevronRight
              className={cn(
                "h-4 w-4 transition-transform",
                collapsed ? "rotate-180" : "rotate-0",
              )}
              strokeWidth={2.4}
            />
          </button>

          {collapsed ? (
            <div className="flex flex-1 flex-col items-center gap-4 pt-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-bg-light">
                <User className="h-4 w-4" strokeWidth={1.8} />
              </span>
            </div>
          ) : (
            <>
              <div className="flex shrink-0 items-center gap-2.5 border-b border-ink/10 px-4 py-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-bg-light">
                  <User className="h-4 w-4" strokeWidth={1.8} />
                </span>
                <span className="text-sm font-semibold text-ink">
                  Student Name
                </span>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="border-b border-ink/10 px-4 py-4">
                  <PaletteLegend counts={counts} />
                </div>

                <div className="flex flex-col gap-2.5 border-b border-ink/10 px-4 py-4">
                  {csssSections.map((item, index) => {
                    const isOpen = openSection === index;
                    return (
                      <div key={item.code} className="flex flex-col gap-2.5">
                        <button
                          type="button"
                          onClick={() => setOpenSection(isOpen ? -1 : index)}
                          aria-expanded={isOpen}
                          className="flex items-center justify-center gap-1.5 rounded-md bg-ink px-3 py-2 text-center text-xs font-semibold tracking-wide text-white transition-colors hover:bg-ink/90"
                        >
                          {item.name}
                          <ChevronDown
                            className={cn(
                              "h-3.5 w-3.5 transition-transform",
                              isOpen && "rotate-180",
                            )}
                            strokeWidth={2.4}
                          />
                        </button>
                        {isOpen && (
                          <div className="max-h-[240px] overflow-y-auto pr-1">
                            <PaletteGrid
                              start={csssSectionStarts[index]}
                              count={item.questionCount}
                              state={state}
                              locked={locked}
                              onSelect={handleNavigate}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex shrink-0 flex-col gap-2.5 border-t border-ink/10 px-4 py-4">
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    className="h-9 rounded-md border border-ink/15 bg-white text-xs font-medium text-ink transition-colors hover:bg-ink/5"
                  >
                    Question Paper
                  </button>
                  <button
                    type="button"
                    className="h-9 rounded-md border border-ink/15 bg-white text-xs font-medium text-ink transition-colors hover:bg-ink/5"
                  >
                    Instructions
                  </button>
                </div>
                <button
                  type="button"
                  onClick={onSubmit}
                  className="h-10 w-full rounded-md bg-crimson text-sm font-semibold text-white transition-colors hover:bg-crimson-shape"
                >
                  Submit Test
                </button>
              </div>
            </>
          )}
        </aside>
      </div>

      {paused && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-ink/80 backdrop-blur-sm">
          <p className="text-2xl font-bold text-bg-light">Test Paused</p>
          <button
            type="button"
            onClick={() => setPaused(false)}
            className="flex h-12 items-center gap-2 rounded-lg bg-bg-light px-7 text-sm font-semibold text-ink transition-colors hover:bg-white"
          >
            <Play className="h-4 w-4" strokeWidth={2.4} />
            Resume Test
          </button>
        </div>
      )}
    </div>
  );
}
