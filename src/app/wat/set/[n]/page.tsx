import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { WatRunner } from "@/components/wat/runner";
import { getSet, SETS, WAT_TIMINGS } from "@/lib/wat/config";

export const instant = false;

export function generateStaticParams() {
  return SETS.map((s) => ({ n: String(s.id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ n: string }> }): Promise<Metadata> {
  const { n } = await params;
  const set = getSet(Number(n));
  if (!set) return { title: "Page not found | Learners Park" };
  return {
    title: `${set.title} — WAT practice | Learners Park`,
    description: `Timed SSB WAT practice: ${set.words.length} words at ${WAT_TIMINGS.wordSeconds} seconds each, with a click on every word change.`,
  };
}

export default async function WatSetPage({ params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  const set = getSet(Number(n));
  if (!set) notFound();

  const prev = getSet(set.id - 1);
  const next = getSet(set.id + 1);

  return (
    <>
      <SiteHeader />
      <main className="bg-bg-light">
        <Container className="py-12 sm:py-16">
          <Link href="/wat" className="text-sm font-semibold text-crimson hover:underline">← All WAT practice sets</Link>
          <p className="mt-4 text-xs font-bold tracking-[0.14em] text-ink/45 uppercase">
            WAT · Psychology · Set {String(set.id).padStart(2, "0")}
          </p>
          <h1 className="mt-2 text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold tracking-[-0.03em] text-ink">
            {set.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-ink/60">
            Keep a sheet and pen ready. Press Start and write one sentence for each word within{" "}
            {WAT_TIMINGS.wordSeconds} seconds — the next word appears automatically with a click. You can pause,
            step back or skip ahead if you need to.
          </p>

          <div className="mt-6">
            <WatRunner title={set.title} words={set.words} />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm font-semibold">
            <a href={set.ppt} download className="text-ink/55 hover:text-crimson">
              Download this set&apos;s PPT
            </a>
            <div className="flex items-center gap-6">
              {prev ? (
                <Link href={`/wat/set/${prev.id}`} className="text-crimson hover:underline">← Set {String(prev.id).padStart(2, "0")}</Link>
              ) : <span />}
              {next ? (
                <Link href={`/wat/set/${next.id}`} className="text-crimson hover:underline">Set {String(next.id).padStart(2, "0")} →</Link>
              ) : <span />}
            </div>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
