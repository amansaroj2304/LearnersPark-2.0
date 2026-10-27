import Link from "next/link";
import { ArrowRight, BookOpen, Languages, Share2 } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";

export type CsssTest = {
  id: string;
  title: string;
  kind: "full" | "section";
  sections: string;
  questions: number;
  marks: number;
  minutes: number;
  languages: string[];
  free: boolean;
};

export function TestCard({ test }: { test: CsssTest }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-[0_1px_2px_rgba(6,21,13,0.05)]">
      <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start sm:justify-between sm:p-7">
        <div className="min-w-0">
          <h3 className="text-xl font-extrabold tracking-[-0.01em] text-ink sm:text-2xl">
            {test.title}
          </h3>

          <div className="mt-3 flex flex-wrap gap-2.5">
            <span className="rounded-md bg-sage/35 px-3 py-1.5 text-[0.7rem] font-bold tracking-[0.12em] text-olive-deep uppercase">
              {test.kind === "full" ? "Full Test" : "Section Test"}
            </span>
            <span className="rounded-md bg-bg-light-2 px-3 py-1.5 text-[0.7rem] font-bold tracking-[0.12em] text-ink/70 uppercase">
              {test.sections}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink/55">
            <span>{test.questions} Questions</span>
            <Sep />
            <span>{test.marks} Marks</span>
            <Sep />
            <span>{test.minutes} Mins</span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-center gap-2">
          <Link
            href={`/csss/test?test=${test.id}`}
            className={buttonClasses(
              "primary",
              "md",
              "w-full gap-2.5 sm:w-auto sm:min-w-[11rem]",
            )}
          >
            Start Test
            <ArrowRight className="h-4 w-4" strokeWidth={2.6} />
          </Link>
          {test.free && (
            <span className="text-[0.7rem] font-semibold tracking-[0.18em] text-ink/45 uppercase">
              Free
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-ink/10 px-6 py-3.5 text-sm font-medium text-ink/70 sm:px-7">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-2">
            <BookOpen className="h-4.5 w-4.5 text-ink/55" strokeWidth={1.9} />
            Syllabus
          </span>
          <Sep />
          <span className="flex items-center gap-2">
            <Languages className="h-4.5 w-4.5 text-ink/55" strokeWidth={1.9} />
            {test.languages.join(", ")}
          </span>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 transition-colors hover:text-ink"
        >
          <Share2 className="h-4.5 w-4.5" strokeWidth={1.9} />
          Share
        </button>
      </div>
    </article>
  );
}

function Sep() {
  return <span aria-hidden className="h-4 w-px bg-ink/15" />;
}