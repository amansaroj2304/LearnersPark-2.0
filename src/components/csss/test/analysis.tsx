"use client";

import { Check, RotateCcw, X } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { cn, splitEmphasis } from "@/lib/utils";
import { csssSections, type CsssQuestion } from "@/data/csss-questions";
import { scoreAttempt } from "@/lib/csss-scoring";
import { QuestionVisual } from "@/components/csss/test/question-visual";

export function Analysis({
  title,
  questions,
  answers,
  marksCorrect,
  marksWrong,
  onReattempt,
  onExit,
}: {
  title: string;
  questions: (CsssQuestion | null)[];
  answers: Record<number, number>;
  marksCorrect: number;
  marksWrong: number;
  onReattempt: () => void;
  onExit: () => void;
}) {
  const { attempted, correct, wrong, score, accuracy, maxScore, sections } =
    scoreAttempt(questions, answers, marksCorrect, marksWrong);

  const sectionStats = sections.map((row, sectionIndex) => ({
    section: csssSections[sectionIndex],
    ...row,
  }));

  const stats = [
    { label: "Score", value: score, accent: "text-crimson ring-crimson/30" },
    { label: "Attempted", value: attempted, accent: "text-ink ring-ink/20" },
    { label: "Correct", value: correct, accent: "text-[#2f9e5b] ring-[#2f9e5b]/30" },
    { label: "Wrong", value: wrong, accent: "text-crimson ring-crimson/30" },
    { label: "Accuracy", value: `${accuracy}%`, accent: "text-gold ring-gold/40" },
  ];

  return (
    <div className="min-h-screen bg-bg-light">
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-white">
        <div className="flex h-[70px] items-center gap-3 px-5 sm:px-8">
          <Logo className="h-9 w-auto md:h-10" />
          <span className="hidden text-sm font-medium text-ink/60 sm:block">
            {title}
          </span>
          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              onClick={onExit}
              className="h-10 rounded-lg border border-ink/15 bg-white px-5 text-sm font-semibold text-ink transition-colors hover:bg-ink/5"
            >
              Exit
            </button>
            <button
              type="button"
              onClick={onReattempt}
              className="flex h-10 items-center gap-2 rounded-lg bg-crimson px-5 text-sm font-semibold text-white transition-colors hover:bg-crimson-shape"
            >
              <RotateCcw className="h-4 w-4" strokeWidth={2.3} />
              Reattempt
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1100px] px-5 py-10 sm:px-8">
        <h1 className="text-[clamp(1.6rem,3.4vw,2.2rem)] font-extrabold tracking-[-0.02em] text-ink">
          {title}
        </h1>
        <p className="mt-2 text-sm font-medium tracking-[0.14em] text-ink/45 uppercase">
          Overall Performance Summary
        </p>

        <div className="mt-6 rounded-2xl border border-ink/10 bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:justify-between">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-3">
                <span
                  className={cn(
                    "flex h-24 w-24 items-center justify-center rounded-full text-2xl font-extrabold ring-4",
                    stat.accent,
                  )}
                >
                  {stat.value}
                </span>
                <span className="text-sm font-semibold text-ink/65">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-7 text-center text-sm text-ink/55">
            You scored{" "}
            <span className="font-bold text-ink">
              {score} / {maxScore}
            </span>{" "}
            marks in this test.
          </p>
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-bold text-ink">Sectional Summary</h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-ink/10 bg-white">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="bg-ink text-left text-xs font-bold text-white">
                  <th className="px-5 py-3.5">Section</th>
                  <th className="px-5 py-3.5 text-center">Questions</th>
                  <th className="px-5 py-3.5 text-center">Attempted</th>
                  <th className="px-5 py-3.5 text-center">Correct</th>
                  <th className="px-5 py-3.5 text-center">Wrong</th>
                  <th className="px-5 py-3.5 text-center">Score</th>
                </tr>
              </thead>
              <tbody>
                {sectionStats.map((row) => (
                  <tr
                    key={row.section.code}
                    className="border-t border-ink/10 text-ink"
                  >
                    <td className="px-5 py-3.5 font-semibold">
                      {row.section.name}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      {row.section.questionCount}
                    </td>
                    <td className="px-5 py-3.5 text-center">{row.attempted}</td>
                    <td className="px-5 py-3.5 text-center">{row.correct}</td>
                    <td className="px-5 py-3.5 text-center">{row.wrong}</td>
                    <td className="px-5 py-3.5 text-center font-semibold">
                      {row.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-bold text-ink">Solutions</h2>
          <div className="mt-4 flex flex-col gap-5">
            {questions.map((question, index) => {
              if (!question) return null;
              const selected = answers[index];
              const isCorrect = selected === question.answer;
              return (
                <article
                  key={question.id}
                  className="rounded-2xl border border-ink/10 bg-white p-6 sm:p-7"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-bold tracking-[0.16em] text-ink/45 uppercase">
                      Question {index + 1}
                    </span>
                    <span
                      className={cn(
                        "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white",
                        selected === undefined
                          ? "bg-ink/40"
                          : isCorrect
                            ? "bg-[#2f9e5b]"
                            : "bg-crimson",
                      )}
                    >
                      {selected === undefined ? (
                        "Not Attempted"
                      ) : isCorrect ? (
                        <>
                          <Check className="h-3.5 w-3.5" strokeWidth={3} /> Correct
                        </>
                      ) : (
                        <>
                          <X className="h-3.5 w-3.5" strokeWidth={3} /> Wrong
                        </>
                      )}
                    </span>
                  </div>

                  <div className="mt-4">
                    {question.prompt.split("\n\n").map((paragraph) => (
                      <p
                        key={paragraph}
                        className="mb-3 text-base leading-relaxed text-ink last:mb-0"
                      >
                        {splitEmphasis(paragraph).map((segment, index) =>
                          segment.bold ? (
                            <strong key={index} className="font-bold text-ink">
                              {segment.text}
                            </strong>
                          ) : (
                            <span key={index}>{segment.text}</span>
                          ),
                        )}
                      </p>
                    ))}
                  </div>

                  {question.visual && (
                    <QuestionVisual visual={question.visual} className="mt-4" />
                  )}

                  {question.cue && (
                    <div className="mt-4 rounded-xl border border-ink/10 bg-bg-light px-5 py-4">
                      <span className="text-xs font-semibold tracking-[0.14em] text-ink/45 uppercase">
                        Audio cue
                      </span>
                      <p className="mt-1 text-base font-bold tracking-wide text-ink">
                        {question.cue}
                      </p>
                    </div>
                  )}

                  <div className="mt-5 flex flex-col gap-2.5">
                    {question.options.map((option, optionIndex) => {
                      const isAnswer = optionIndex === question.answer;
                      const isSelected = optionIndex === selected;
                      return (
                        <div
                          key={optionIndex}
                          className={cn(
                            "flex items-center gap-3 rounded-lg border px-4 py-3 text-sm",
                            isAnswer
                              ? "border-[#2f9e5b] bg-[#2f9e5b]/8 text-ink"
                              : isSelected
                                ? "border-crimson bg-crimson/5 text-ink"
                                : "border-ink/12 text-ink/70",
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.7rem] font-bold text-white",
                              isAnswer
                                ? "bg-[#2f9e5b]"
                                : isSelected
                                  ? "bg-crimson"
                                  : "bg-ink/20",
                            )}
                          >
                            {String.fromCharCode(65 + optionIndex)}
                          </span>
                          <span className="flex-1">{option}</span>
                          {isSelected && (
                            <span className="text-[0.7rem] font-bold tracking-[0.12em] text-ink/45 uppercase">
                              Your answer
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-5 rounded-xl bg-bg-light px-5 py-4 text-sm leading-relaxed text-ink/75">
                    <span className="font-semibold text-ink">Explanation: </span>
                    {question.explanation}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
