import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { DossierDashboard } from "@/components/dossier/dashboard";
import { DAYS, TIMINGS } from "@/lib/dossier/data";

export const metadata: Metadata = {
  title: "SSB Daily Drills — 15 days of structured practice | Learners Park",
  description:
    "Fifteen day-wise SSB practice drills: one TAT picture, 15 WAT words, 10 SRT situations and a lecturette topic each day, with timers, autosave and submission.",
};

const TOTAL =
  TIMINGS.tatSeconds +
  TIMINGS.watWordSeconds * 15 +
  TIMINGS.srtSeconds * 10 +
  TIMINGS.lecturettePrepSeconds +
  TIMINGS.lecturetteSpeakSeconds;

export default function DossierPage() {
  const days = DAYS.map((d) => ({ day: d.day, lecturette: d.lecturette, totalSeconds: TOTAL }));
  return (
    <>
      <SiteHeader />
      <main className="bg-bg-light">
        <Container className="py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="text-xs font-semibold text-ink/45">
            <Link href="/ssb" className="hover:text-crimson">SSB</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span>Daily Drills</span>
          </nav>
          <p className="mt-6 text-xs font-bold tracking-[0.16em] text-crimson uppercase">SSB · Psychological tests</p>
          <h1 className="mt-3 max-w-3xl text-[clamp(2rem,4.5vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">
            SSB Daily Drills
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/65">
            Fifteen days of structured practice. Each day: one TAT picture, fifteen WAT words, ten SRT situations
            and one lecturette topic, with section timers, autosave and submission.
          </p>
          <p className="mt-3 text-xs text-ink/45">
            Practice format, not an official SSB schedule. Times are {Math.floor(TOTAL / 60)} min {TOTAL % 60} s in total per day.
          </p>
          <div className="mt-8">
            <DossierDashboard days={days} />
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
