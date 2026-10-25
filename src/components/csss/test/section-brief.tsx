import { Logo } from "@/components/layout/logo";
import { type CsssSection } from "@/data/csss-questions";

export function SectionBrief({
  section,
  totalSections,
  onBegin,
}: {
  section: CsssSection;
  totalSections: number;
  onBegin: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg-light px-6 py-16">
      <Logo className="mb-8 h-9 w-auto" />

      <div className="w-full max-w-lg rounded-3xl border border-ink/10 bg-white p-8 shadow-sm sm:p-10">
        <p className="text-xs font-semibold tracking-[0.18em] text-crimson uppercase">
          Section {section.code} of {totalSections}
        </p>
        <h1 className="mt-3 text-2xl font-bold text-ink sm:text-3xl">
          {section.name}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink/65">
          {section.description}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-2.5">
          <span className="rounded-full bg-bg-light-2 px-3.5 py-1.5 text-xs font-semibold text-ink">
            {section.questionCount} questions
          </span>
          <span className="rounded-full bg-bg-light-2 px-3.5 py-1.5 text-xs font-semibold text-ink">
            ≤{section.secondsPerQuestion}s each
          </span>
        </div>

        <button
          type="button"
          onClick={onBegin}
          className="mt-8 h-12 w-full rounded-xl bg-crimson text-sm font-semibold text-white transition-colors hover:bg-crimson-shape"
        >
          Begin Section {section.code}
        </button>
      </div>
    </div>
  );
}
