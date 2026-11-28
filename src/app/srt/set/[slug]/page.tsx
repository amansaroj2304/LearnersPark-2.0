import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SrtRunner } from "@/components/srt/runner";
import { getSet, SETS, SRT_TIMINGS } from "@/lib/srt/config";

export const instant = false;

export function generateStaticParams() {
  return SETS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const set = getSet(slug);
  if (!set) return { title: "Page not found | Learners Park" };
  return {
    title: `${set.title} — SRT practice | Learners Park`,
    description: `Timed SSB SRT practice: ${set.situations.length} situations in 6 pages of 10, ${SRT_TIMINGS.totalSeconds / 60} minutes for the set.`,
  };
}

export default async function SrtSetPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const set = getSet(slug);
  if (!set) notFound();

  const index = SETS.findIndex((s) => s.slug === set.slug);
  const prev = index > 0 ? SETS[index - 1] : null;
  const next = index < SETS.length - 1 ? SETS[index + 1] : null;

  return (
    <>
      <SiteHeader />
      <main className="bg-bg-light">
        <Container className="py-12 sm:py-16">
          <Link href="/srt" className="text-sm font-semibold text-crimson hover:underline">← All SRT practice sets</Link>
          <p className="mt-4 text-xs font-bold tracking-[0.14em] text-ink/45 uppercase">SRT · Psychology · {set.title}</p>
          <h1 className="mt-2 text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold tracking-[-0.03em] text-ink">{set.title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-ink/60">
            {set.situations.length} situations in 6 pages of {SRT_TIMINGS.perPage}. Write one short reaction per
            situation — what the person does next. The 30-minute clock starts when you press Start.
          </p>

          <div className="mt-6">
            <SrtRunner title={set.title} slug={set.slug} situations={set.situations} />
          </div>

          <div className="mt-6 flex items-center justify-between text-sm font-semibold">
            {prev ? (
              <Link href={`/srt/set/${prev.slug}`} className="text-crimson hover:underline">← {prev.title}</Link>
            ) : <span />}
            {next ? (
              <Link href={`/srt/set/${next.slug}`} className="text-crimson hover:underline">{next.title} →</Link>
            ) : <span />}
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
