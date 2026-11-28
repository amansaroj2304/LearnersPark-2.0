import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SETS, SRT_TIMINGS } from "@/lib/srt/config";

export const metadata: Metadata = {
  title: "SRT — Situation Reaction Test practice sets | Learners Park",
  description:
    "Practise the SSB Situation Reaction Test page by page: 60 situations in 6 pages of 10, 30 minutes on the clock, answers saved in your browser.",
};

const pad = (n: number) => String(n).padStart(2, "0");

export default function SrtPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-bg-light">
        <Container className="py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="text-xs font-semibold text-ink/45">
            <Link href="/ssb" className="hover:text-crimson">SSB</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span>SRT</span>
          </nav>

          <p className="mt-6 text-xs font-bold tracking-[0.16em] text-crimson uppercase">SRT · Day 2 · Psychology</p>
          <h1 className="mt-3 max-w-3xl text-[clamp(2rem,4.5vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">
            Situation Reaction Test
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/65">
            {SETS.length} practice sets, each with 60 situations laid out in 6 pages of 10. You get{" "}
            {SRT_TIMINGS.totalSeconds / 60} minutes for the whole set: write the first reaction that comes to mind,
            page by page. Answers save automatically in your browser and the test submits itself when the clock runs out.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { k: "60", v: "Situations per set, in 6 pages of 10." },
              { k: "30 min", v: "For the whole set — the clock starts with you." },
              { k: "Auto", v: "Answers save as you type; submit or let time end." },
            ].map((s) => (
              <div key={s.k} className="rounded-xl border border-ink/10 bg-white p-4">
                <p className="text-2xl font-extrabold text-crimson">{s.k}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink/55">{s.v}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-3">
            <h2 className="text-lg font-bold text-ink">Practice sets</h2>
            <span className="h-px flex-1 bg-ink/10" />
            <span className="text-xs font-semibold text-ink/40">{SETS.length} sets</span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SETS.map((s) => (
              <article key={s.slug} className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-white p-4">
                <span
                  aria-hidden="true"
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-ink text-lg font-extrabold text-white"
                >
                  {s.id === 0 ? "P" : pad(s.id)}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-ink">{s.title}</h3>
                  <p className="mt-0.5 text-xs text-ink/55">
                    {s.situations.length} situations · 6 pages · {SRT_TIMINGS.totalSeconds / 60} min
                  </p>
                </div>
                <Link
                  href={`/srt/set/${s.slug}`}
                  className="inline-flex h-9 shrink-0 items-center rounded-lg bg-crimson px-4 text-sm font-semibold text-white hover:bg-crimson-shape"
                >
                  Practice
                </Link>
              </article>
            ))}
          </div>

          <p className="mt-8 text-xs leading-relaxed text-ink/45">
            This is a practice structure, not an official assessment. Timing follows the usual SRT pattern; boards
            may vary.
          </p>

          <p className="mt-6 text-sm text-ink/50">
            <Link href="/ssb" className="font-semibold text-crimson hover:underline">← Back to the 17 SSB tests</Link>
          </p>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
