"use client";

import { useState } from "react";
import { User } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { cn } from "@/lib/utils";

export function Instructions({
  title,
  durationMinutes,
  maxMarks,
  totalQuestions,
  marksCorrect,
  marksWrong,
  onBack,
  onBegin,
}: {
  title: string;
  durationMinutes: number;
  maxMarks: number;
  totalQuestions: number;
  marksCorrect: number;
  marksWrong: number;
  onBack: () => void;
  onBegin: () => void;
}) {
  const [agreed, setAgreed] = useState(false);

  const points = [
    `The test contains ${totalQuestions} total question${totalQuestions === 1 ? "" : "s"}.`,
    "Each question has 4 options out of which only one is correct.",
    `You have to finish the test in ${durationMinutes} minutes.`,
    "Try not to guess the answer as there is negative marking.",
    `You will be awarded ${marksCorrect} mark${marksCorrect === 1 ? "" : "s"} for each correct answer and ${marksWrong} will be deducted for each wrong answer.`,
    "There is no negative marking for the questions that you have not attempted.",
    "You can write this test only once. Make sure that you complete the test before you submit the test and/or close the browser.",
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-white">
        <div className="flex h-[70px] items-center gap-3 px-5 sm:px-8">
          <Logo className="h-9 w-auto md:h-10" />
          <span className="hidden text-sm font-medium text-ink/60 sm:block">
            {title}
          </span>
        </div>
      </header>

      <div className="flex flex-1 flex-col lg:flex-row">
        <div className="flex flex-1 flex-col">
          <div className="flex-1 px-5 py-10 sm:px-10 lg:px-16">
            <div className="mx-auto max-w-[900px]">
              <div className="text-center">
                <h1 className="text-[clamp(1.6rem,3.4vw,2.2rem)] font-bold tracking-[-0.02em] text-ink">
                  {title}
                </h1>
              </div>

              <div className="mt-8 flex items-center justify-between text-sm font-semibold text-ink">
                <span>Duration: {durationMinutes} Mins</span>
                <span>Maximum Marks: {maxMarks}</span>
              </div>

              <p className="mt-8 text-base font-semibold text-ink">
                Read the following instructions carefully.
              </p>

              <ol className="mt-3 flex list-decimal flex-col gap-2.5 pl-6 text-[0.95rem] leading-relaxed text-ink/80">
                {points.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ol>
            </div>
          </div>

          <div className="border-t border-ink/10 px-5 py-6 sm:px-10 lg:px-16">
            <div className="mx-auto flex max-w-[900px] flex-col gap-5">
              <label className="flex flex-wrap items-center gap-2 text-sm font-semibold text-ink">
                Choose your default language:
                <select
                  defaultValue="English"
                  className="h-9 rounded-md border border-ink/15 bg-bg-light px-3 text-sm font-medium text-ink focus:border-ink/30 focus:outline-none"
                >
                  <option>English</option>
                  <option>Hindi</option>
                </select>
              </label>

              <div>
                <p className="text-sm font-semibold text-ink">Declaration:</p>
                <label className="mt-3 flex cursor-pointer items-start gap-3 text-sm text-ink/80">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(event) => setAgreed(event.target.checked)}
                    className="mt-0.5 h-4.5 w-4.5 shrink-0 accent-crimson"
                  />
                  I have understood and agree to all the instructions.
                </label>
              </div>

              <div className="flex items-center justify-between gap-4 pt-1">
                <button
                  type="button"
                  onClick={onBack}
                  className="h-12 rounded-lg border border-ink/15 bg-bg-light-2 px-7 text-[0.95rem] font-semibold text-ink transition-colors hover:bg-bg-light-2/70"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={onBegin}
                  disabled={!agreed}
                  className={cn(
                    "h-12 rounded-lg bg-crimson px-7 text-[0.95rem] font-semibold text-white transition-all duration-200",
                    "hover:-translate-y-0.5 hover:bg-crimson-shape",
                    "disabled:pointer-events-none disabled:opacity-50",
                  )}
                >
                  I am ready to begin
                </button>
              </div>
            </div>
          </div>
        </div>

        <aside className="hidden w-[300px] shrink-0 flex-col items-center border-l border-ink/10 bg-bg-light px-8 pt-14 lg:flex xl:w-[360px]">
          <span className="flex h-28 w-28 items-center justify-center rounded-full bg-ink text-bg-light">
            <User className="h-14 w-14" strokeWidth={1.6} />
          </span>
          <p className="mt-6 text-2xl font-bold text-ink">Student Name</p>
        </aside>
      </div>
    </div>
  );
}
