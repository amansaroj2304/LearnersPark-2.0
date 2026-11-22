import Link from "next/link";
import { notFound } from "next/navigation";
import fs from "node:fs";
import path from "node:path";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PpdtRunner } from "@/components/ppdt/runner";
import { getSet } from "@/lib/ppdt/config";

export const instant = false;

export default async function PpdtSetPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const set = getSet(slug);
  if (!set) notFound();
  const available = fs.existsSync(path.join(process.cwd(), "public", set.image));

  return (
    <>
      <SiteHeader />
      <main className="bg-bg-light">
        <Container className="py-12 sm:py-16">
          <Link href="/ppdt/sets" className="text-sm font-semibold text-crimson hover:underline">← All PPDT sets</Link>
          <p className="mt-6 text-xs font-bold tracking-[0.16em] text-crimson uppercase">PPDT · Day 1 · Screening</p>
          <h1 className="mt-2 text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold tracking-[-0.03em] text-ink">
            {set.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-ink/60">
            Thirty seconds to look, four minutes to write. The picture is withdrawn when writing starts.
          </p>
          <div className="mt-6">
            <PpdtRunner
              title={set.title}
              image={set.image}
              alt={set.alt}
              imageAvailable={available}
              mode="timed"
              setSlug={set.slug}
            />
          </div>
          <p className="mt-6 text-sm text-ink/50">
            Want the format and the do&apos;s and don&apos;ts first?{" "}
            <Link href="/ppdt" className="font-semibold text-crimson hover:underline">Read the PPDT notes</Link>
          </p>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
