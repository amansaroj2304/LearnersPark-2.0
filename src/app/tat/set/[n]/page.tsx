import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { TatRunner } from "@/components/tat/runner";
import { getSet, SETS } from "@/lib/tat/config";

export const instant = false;

export function generateStaticParams() {
  return SETS.map((s) => ({ n: String(s.id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ n: string }> }): Promise<Metadata> {
  const { n } = await params;
  const set = getSet(Number(n));
  if (!set) return { title: "TAT set not found | Learners Park" };
  return {
    title: `${set.title} — TAT practice | Learners Park`,
    description: `Timed SSB TAT practice: 11 pictures and a blank slide, 30 seconds look and 4 minutes 30 seconds write for each slide.`,
  };
}

export default async function TatSetPage({ params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  const set = getSet(Number(n));
  if (!set) notFound();

  const images = set.images.filter((img) => fs.existsSync(path.join(process.cwd(), "public", img)));
  if (images.length === 0) notFound();

  const prev = getSet(set.id - 1);
  const next = getSet(set.id + 1);

  return (
    <>
      <SiteHeader />
      <main className="bg-bg-light">
        <Container className="py-12 sm:py-16">
          <Link href="/tat" className="text-sm font-semibold text-crimson hover:underline">← All TAT practice sets</Link>
          <p className="mt-4 text-xs font-bold tracking-[0.14em] text-ink/45 uppercase">
            TAT · Psychology · Set {String(set.id).padStart(2, "0")}
          </p>
          <h1 className="mt-2 text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold tracking-[-0.03em] text-ink">
            {set.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-ink/60">
            Keep a sheet and pen ready. Press Start, look at each slide for 30 seconds, then write for 4 minutes
            30 seconds after it is withdrawn. The 12th slide is blank — invent the picture. The next slide comes up
            on its own.
          </p>

          <div className="mt-6">
            <TatRunner title={set.title} images={images} />
          </div>

          <div className="mt-6 flex items-center justify-between text-sm font-semibold">
            {prev ? (
              <Link href={`/tat/set/${prev.id}`} className="text-crimson hover:underline">← Set {String(prev.id).padStart(2, "0")}</Link>
            ) : <span />}
            {next ? (
              <Link href={`/tat/set/${next.id}`} className="text-crimson hover:underline">Set {String(next.id).padStart(2, "0")} →</Link>
            ) : <span />}
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
