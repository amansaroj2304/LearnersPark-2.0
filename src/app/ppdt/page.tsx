import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = {
  title: "PPDT — Picture Perception & Discussion Test | Learners Park",
  description:
    "Choose what you need for the Day 1 screening: the PPDT notes, practice mode with the picture visible, ten timed sets, or the printable answer sheet.",
};

const TILES = [
  {
    href: "/ppdt/notes",
    eyebrow: "Notes",
    title: "Read notes",
    body: "Day 1 walkthrough, communication basics, do's and don'ts, and the answer-sheet format.",
    cta: "Read the notes →",
  },
  {
    href: "/ppdt/practice",
    eyebrow: "Practice",
    title: "Practice",
    body: "Practice mode with the picture visible, or timed mode with 30 s look and 4 min write across ten sets.",
    cta: "Start practising →",
  },
  {
    href: "/docs/ppdt-practice-sheet.pdf",
    eyebrow: "PDF",
    title: "Practice sheet",
    body: "The answer sheet with chest no., batch no., story and action boxes. Print it or fill it in.",
    cta: "Open the sheet →",
  },
] as const;

export default function PpdtPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-bg-light">
        <Container className="py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="text-xs font-semibold text-ink/45">
            <Link href="/ssb" className="hover:text-crimson">SSB</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span>PPDT</span>
          </nav>

          <p className="mt-6 text-xs font-bold tracking-[0.16em] text-crimson uppercase">PPDT · Day 1 · Screening</p>
          <h1 className="mt-3 max-w-3xl text-[clamp(2rem,4.5vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">
            Picture Perception &amp; Discussion Test
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/65">
            One picture, thirty seconds to look, four minutes to write, then narrate and agree a common
            story with your group. Start with the notes, then practise.
          </p>
          <p className="mt-3 text-xs text-ink/45">
            This is a practice structure, not an official assessment. Task order and timing vary by board
            and entry.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {TILES.map((t) =>
              t.href.startsWith("/docs/") ? (
                <a
                  key={t.title}
                  href={t.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group rounded-2xl border border-ink/10 bg-white p-5 transition hover:border-crimson/40"
                >
                  <p className="text-xs font-bold tracking-[0.14em] text-crimson uppercase">{t.eyebrow}</p>
                  <h2 className="mt-2 text-base font-bold text-ink">{t.title}</h2>
                  <p className="mt-1 text-xs leading-relaxed text-ink/55">{t.body}</p>
                  <span className="mt-3 inline-block text-sm font-semibold text-crimson">{t.cta}</span>
                </a>
              ) : (
                <Link
                  key={t.title}
                  href={t.href}
                  className="group rounded-2xl border border-ink/10 bg-white p-5 transition hover:border-crimson/40"
                >
                  <p className="text-xs font-bold tracking-[0.14em] text-crimson uppercase">{t.eyebrow}</p>
                  <h2 className="mt-2 text-base font-bold text-ink">{t.title}</h2>
                  <p className="mt-1 text-xs leading-relaxed text-ink/55">{t.body}</p>
                  <span className="mt-3 inline-block text-sm font-semibold text-crimson">{t.cta}</span>
                </Link>
              ),
            )}
          </div>

          <p className="mt-8 text-sm text-ink/50">
            <Link href="/ssb" className="font-semibold text-crimson hover:underline">← Back to the 17 SSB tests</Link>
          </p>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
