import Link from "next/link";
import type { ReactNode } from "react";
import { FileText, RotateCcw, Trophy } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import type { TestResultSummary } from "@/data/csss-tests";

export function TestResultCard({
  title,
  result,
}: {
  title: string;
  result: TestResultSummary;
}) {
  const pct =
    result.maxScore > 0
      ? Math.max(0, Math.min(100, Math.round((result.score / result.maxScore) * 100)))
      : 0;

  const date = new Date(result.attemptedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <article className="overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-[0_1px_2px_rgba(6,21,13,0.05)]">
      <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start sm:justify-between sm:p-7">
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-extrabold tracking-[-0.01em] text-ink sm:text-2xl">
            {title}
          </h3>

          <div className="mt-4 flex flex-wrap gap-3">
            <Stat
              icon={<Trophy className="h-4 w-4" strokeWidth={2.2} />}
              label="Rank"
              value={
                result.rank != null && result.total != null
                  ? `${result.rank}/${result.total}`
                  : "—"
              }
            />
            <Stat
              icon={<FileText className="h-4 w-4" strokeWidth={2.2} />}
              label="Marks"
              value={`${result.score}/${result.maxScore}`}
            />
          </div>

          <div className="mt-5 max-w-[420px]">
            <div className="relative h-2.5 w-full rounded-full bg-ink/10">
              <div
                className="h-full rounded-full bg-[#2f9e5b]"
                style={{ width: `${pct}%` }}
              />
              <span
                aria-hidden
                className="absolute top-1/2 h-4 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold"
                style={{ left: `${pct}%` }}
              />
            </div>
            <p className="mt-2 text-xs font-semibold tracking-[0.06em] text-ink/55">
              {pct}% Score
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-center gap-2">
          <Link
            href={`/csss/test?test=${result.testId}`}
            className={buttonClasses(
              "primary",
              "md",
              "w-full gap-2.5 sm:w-auto sm:min-w-[11rem]",
            )}
          >
            <RotateCcw className="h-4 w-4" strokeWidth={2.6} />
            Reattempt
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-ink/10 px-6 py-3.5 text-sm font-medium text-ink/70 sm:px-7">
        <span>Attempted on {date}</span>
        {result.attemptCount > 1 && (
          <span>{result.attemptCount} attempts</span>
        )}
      </div>
    </article>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <span className="flex items-center gap-2.5 rounded-lg bg-bg-light-2 px-3.5 py-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-ink/70">
        {icon}
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-sm font-extrabold text-ink">{value}</span>
        <span className="text-[0.65rem] font-semibold tracking-[0.14em] text-ink/50 uppercase">
          {label}
        </span>
      </span>
    </span>
  );
}
