import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PICTURES_PER_SET, SETS, TAT_TIMINGS } from "@/lib/tat/config";

export const metadata: Metadata = {
  title: "TAT — Thematic Apperception Test practice sets | Learners Park",
  description:
    "Practise the SSB TAT with 25 timed picture sets: 11 pictures per set, 30 seconds to look and 4 minutes 30 seconds to write each story.",
};

const pad = (n: number) => String(n).padStart(2, "0");

export default function TatPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-bg-light">
        <Container className="py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="text-xs font-semibold text-ink/45">
            <Link href="/ssb" className="hover:text-crimson">SSB</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span>TAT</span>
          </nav>

          <p className="mt-6 text-xs font-bold tracking-[0.16em] text-crimson uppercase">TAT · Day 2 · Psychology</p>
          <h1 className="mt-3 max-w-3xl text-[clamp(2rem,4.5vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">
            Thematic Apperception Test
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/65">
            {SETS.length} practice sets, each with {PICTURES_PER_SET} pictures. Every picture stays on screen for{" "}
            {TAT_TIMINGS.lookSeconds} seconds, then is withdrawn and you get {Math.floor(TAT_TIMINGS.writeSeconds / 60)}{" "}
            minutes {TAT_TIMINGS.writeSeconds % 60} seconds to write the story on your sheet. A double beep marks each
            change, so you can write with the screen half in view.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { k: "30 s", v: "Picture on screen — build character, mood and action." },
              { k: "4:30", v: "Picture withdrawn — write the story from memory." },
              { k: "11", v: "Pictures per set, running back to back like the real test." },
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

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SETS.map((s) => (
              <article key={s.id} className="flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white">
                <div className="relative aspect-[4/3] w-full bg-ink/[0.03]">
                  <Image
                    src={s.images[0]}
                    alt={`${s.title} first picture`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                    className="object-cover"
                  />
                  <span className="absolute left-3 top-3 rounded bg-ink/80 px-2 py-0.5 text-[11px] font-bold text-white">
                    Set {pad(s.id)}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-base font-bold text-ink">{s.title}</h3>
                  <p className="mt-1 flex-1 text-xs text-ink/55">
                    {PICTURES_PER_SET} pictures · 30 s look · 4:30 write each
                  </p>
                  <Link
                    href={`/tat/set/${s.id}`}
                    className="mt-3 inline-flex h-9 w-fit items-center rounded-lg bg-crimson px-4 text-sm font-semibold text-white hover:bg-crimson-shape"
                  >
                    Practice
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-8 text-xs leading-relaxed text-ink/45">
            This is a practice structure, not an official assessment. Task order and timing vary by board and entry.
            More sets are added as they are published.
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
