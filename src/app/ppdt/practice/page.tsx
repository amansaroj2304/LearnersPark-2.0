import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PpdtRunner } from "@/components/ppdt/runner";
import { PRACTICE } from "@/lib/ppdt/config";

export default function PpdtPracticePage() {
  const available = fs.existsSync(path.join(process.cwd(), "public", PRACTICE.image));
  return (
    <>
      <SiteHeader />
      <main className="bg-bg-light">
        <Container className="py-12 sm:py-16">
          <Link href="/ppdt/sets" className="text-sm font-semibold text-crimson hover:underline">← All PPDT sets</Link>
          <p className="mt-6 text-xs font-bold tracking-[0.16em] text-crimson uppercase">PPDT · Practice</p>
          <h1 className="mt-2 text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold tracking-[-0.03em] text-ink">
            Write your first story with the picture in front of you
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-ink/60">
            The picture stays visible and the clock counts up, so nothing is rushed. Write your story, then
            compare it with the sample stories.
          </p>
          <div className="mt-6">
            <PpdtRunner
              title="PPDT practice"
              image={PRACTICE.image}
              alt={PRACTICE.alt}
              imageAvailable={available}
              mode="practice"
              samples={PRACTICE.samples}
            />
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
