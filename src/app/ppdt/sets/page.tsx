import type { Metadata } from "next";
import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PRACTICE, SETS } from "@/lib/ppdt/config";

export const metadata: Metadata = {
  title: "PPDT practice tests — 10 timed sets | Learners Park",
  description: "Ten timed PPDT sets: 30 seconds to look at the picture, 4 minutes to write the story.",
};

const has = (p: string) => fs.existsSync(path.join(process.cwd(), "public", p));

export default function PpdtSetsPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-bg-light">
        <Container className="py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="text-xs font-semibold text-ink/45">
            <Link href="/ssb" className="hover:text-crimson">SSB</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <Link href="/ppdt" className="hover:text-crimson">PPDT</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span>Tests</span>
          </nav>
          <h1 className="mt-6 text-[clamp(2rem,4.5vw,2.8rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">
            PPDT practice tests
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink/65">
            Each set runs the real sequence: thirty seconds to look at the picture, four minutes to write
            the story. Nothing is scored and nothing leaves your browser.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/ppdt/practice"
              className="flex flex-col rounded-2xl border border-crimson/30 bg-white p-5 hover:border-crimson"
            >
              <span className="text-xs font-bold tracking-[0.14em] text-crimson uppercase">Start here</span>
              <h2 className="mt-1 text-base font-bold text-ink">Practice — picture stays visible</h2>
              <p className="mt-2 text-sm text-ink/65">
                No clock pressure: the picture stays on screen, a count-up timer runs, and sample stories
                can be revealed once you have written yours.
              </p>
            </Link>

            {SETS.map((set) => {
              const ready = has(set.image);
              return (
                <article key={set.slug} className="flex flex-col rounded-2xl border border-ink/10 bg-white p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-base font-bold text-ink">{set.title}</h2>
                    <span
                      className={`rounded px-2 py-0.5 text-[11px] font-semibold ${
                        ready ? "bg-[#2f9e5b]/12 text-[#256e42]" : "bg-gold/20 text-[#7a5c10]"
                      }`}
                    >
                      {ready ? "Ready" : "Picture pending"}
                    </span>
                  </div>
                  <p className="mt-2 flex-1 text-sm text-ink/60">30 s look · 4 min write · timed</p>
                  {ready ? (
                    <Link
                      href={`/ppdt/sets/${set.slug}`}
                      className="mt-4 inline-flex h-9 items-center justify-center rounded-lg bg-crimson px-4 text-sm font-semibold text-white"
                    >
                      Start set {set.id}
                    </Link>
                  ) : (
                    <span className="mt-4 inline-flex h-9 cursor-not-allowed items-center justify-center rounded-lg border border-ink/12 px-4 text-sm font-semibold text-ink/35">
                      Coming soon
                    </span>
                  )}
                </article>
              );
            })}
          </div>

          <p className="mt-8 text-xs text-ink/45">
            Practice structure only — actual SSB schedules and task arrangements vary by board and entry.
            {!has(PRACTICE.image) ? " The practice picture is still to be uploaded." : ""}
          </p>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
