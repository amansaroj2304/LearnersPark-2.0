import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PracticeHub } from "@/components/ppdt/practice-hub";
import { PRACTICE, SETS } from "@/lib/ppdt/config";

export default function PpdtPracticePage() {
  const available = (image: string) => fs.existsSync(path.join(process.cwd(), "public", image));
  const sets = SETS.map((s) => ({
    slug: s.slug,
    title: s.title,
    image: s.image,
    alt: `${s.title} picture`,
    available: available(s.image),
  }));

  return (
    <>
      <SiteHeader />
      <main className="bg-bg-light">
        <Container className="py-12 sm:py-16">
          <Link href="/ppdt" className="text-sm font-semibold text-crimson hover:underline">← PPDT home</Link>
          <p className="mt-6 text-xs font-bold tracking-[0.16em] text-crimson uppercase">PPDT · Practice</p>
          <h1 className="mt-2 text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold tracking-[-0.03em] text-ink">
            Write your first story
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-ink/60">
            Read the four steps, pick practice mode or any one of the ten timed sets, and the picture opens
            with its timer. When you are done you can upload a photo of your handwritten sheet.
          </p>
          <div className="mt-6">
            <PracticeHub
              image={PRACTICE.image}
              alt={PRACTICE.alt}
              imageAvailable={available(PRACTICE.image)}
              samples={PRACTICE.samples}
              sets={sets}
            />
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
