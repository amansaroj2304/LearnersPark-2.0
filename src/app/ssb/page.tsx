import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { DAYS, getSsbTests, isOpen, REFERENCE_NOTES, type SsbTest } from "@/lib/ssb/data";
import { isOpamConfigured } from "@/lib/supabase/service";

export const instant = false;

export const metadata: Metadata = {
  title: "SSB preparation — 17 practice tests | Learners Park",
  description:
    "The full SSB sequence day by day: screening, psychological tests, GTO tasks, interview and conference, with practice modules as they open.",
};

/** Tests that have a runnable practice module alongside their notes. */
const PRACTICE_HREF: Record<string, string> = {
  ppdt: "/ppdt",
  tat: "/tat",
};
const BADGE: Record<string, { label: string; cls: string }> = {
  SOON: { label: "Soon", cls: "bg-gold/20 text-[#7a5c10]" },
  AVAILABLE: { label: "Available", cls: "bg-[#2f9e5b]/12 text-[#256e42]" },
  LIVE: { label: "Live", cls: "bg-crimson/10 text-crimson" },
  COMPLETED: { label: "Completed", cls: "bg-ink/8 text-ink/55" },
};

function TestCard({ test }: { test: SsbTest }) {
  const notes = test.reference_path ?? REFERENCE_NOTES[test.id] ?? null;
  const practice = PRACTICE_HREF[test.id] ?? null;
  const badge = notes && !isOpen(test) ? { label: "Reference notes", cls: "bg-gold/20 text-[#7a5c10]" } : BADGE[test.status] ?? BADGE.SOON;
  const open = isOpen(test);
  return (
    <article className="flex flex-col rounded-2xl border border-ink/10 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink text-sm font-bold text-white">
            {test.test_no}
          </span>
          <div>
            <h3 className="text-base font-bold leading-tight text-ink">{test.name}</h3>
            <p className="text-xs text-ink/50">{test.full_form}</p>
          </div>
        </div>
        <span className={`shrink-0 rounded px-2 py-0.5 text-[11px] font-semibold ${badge.cls}`}>{badge.label}</span>
      </div>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/65">{test.description}</p>
      <div className="mt-4 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-ink/40">Day {test.day} · {test.category}</span>
        {open ? (
          <Link
            href={`/ssb/${test.id}`}
            className="inline-flex h-9 items-center rounded-lg bg-crimson px-4 text-sm font-semibold text-white hover:bg-crimson-shape"
          >
            Start test
          </Link>
        ) : practice ? (
          <Link
            href={practice}
            className="inline-flex h-9 items-center rounded-lg bg-crimson px-4 text-sm font-semibold text-white hover:bg-crimson-shape"
          >
            Practice
          </Link>
        ) : notes ? (
          <Link
            href={notes}
            className="inline-flex h-9 items-center rounded-lg border border-ink/15 px-4 text-sm font-semibold text-ink hover:bg-ink/5"
          >
            Read notes
          </Link>
        ) : (
          <button
            type="button"
            disabled
            aria-disabled="true"
            title="This practice module will be available soon."
            className="inline-flex h-9 cursor-not-allowed items-center rounded-lg border border-ink/12 px-4 text-sm font-semibold text-ink/35"
          >
            Coming soon
          </button>
        )}
      </div>
    </article>
  );
}

export default async function SsbPage() {
  await connection();
  const tests = isOpamConfigured() ? await getSsbTests().catch(() => []) : [];

  return (
    <>
      <SiteHeader />
      <main className="bg-bg-light">
        <Container className="py-12 sm:py-16">
          <p className="text-xs font-bold tracking-[0.16em] text-crimson uppercase">Practice module</p>
          <h1 className="mt-3 text-[clamp(2rem,4.5vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">
            SSB — 17 tests, day by day
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/65">
            The full Services Selection Board sequence laid out as it is usually practised: screening,
            psychological tests, the GTO tasks, the interview and the conference. Each module opens as
            its practice content is ready.
          </p>
          <p className="mt-3 max-w-2xl rounded-xl border border-ink/10 bg-white px-4 py-3 text-xs leading-relaxed text-ink/55">
            This is a practice structure, not an official timetable. Actual SSB schedules and the
            arrangement of tasks vary by board and entry.
          </p>

          {tests.length === 0 ? (
            <p className="mt-8 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-[#6b520f]">
              The test catalogue is not connected yet. Nothing is broken — the 17 modules appear here
              as soon as the catalogue is loaded.
            </p>
          ) : (
            DAYS.map((d) => {
              const dayTests = tests.filter((t) => t.day === d.day);
              if (dayTests.length === 0) return null;
              return (
                <section key={d.day} className="mt-12" aria-labelledby={`day-${d.day}`}>
                  <div className="flex items-center gap-3">
                    <h2 id={`day-${d.day}`} className="text-lg font-bold text-ink">{d.title}</h2>
                    <span className="h-px flex-1 bg-ink/10" />
                    <span className="text-xs font-semibold text-ink/40">{dayTests.length} tests</span>
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {dayTests.map((test) => <TestCard key={test.id} test={test} />)}
                  </div>
                </section>
              );
            })
          )}
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
