import Link from "next/link";
import { notFound } from "next/navigation";
import fs from "node:fs";
import path from "node:path";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { DossierRunner } from "@/components/dossier/runner";
import { getDay, TIMINGS } from "@/lib/dossier/data";

export const instant = false;

export default async function DossierDayPage({ params }: { params: Promise<{ day: string }> }) {
  const { day: raw } = await params;
  const day = getDay(Number(raw));
  if (!day) notFound();
  const imageAvailable = fs.existsSync(path.join(process.cwd(), "public", day.tat.image));

  return (
    <>
      <SiteHeader />
      <main className="bg-bg-light">
        <Container className="py-12 sm:py-16">
          <Link href="/dossier" className="text-sm font-semibold text-crimson hover:underline">← All 15 days</Link>
          <p className="mt-6 text-xs font-bold tracking-[0.16em] text-crimson uppercase">SSB Daily Dossier · Day {day.day}</p>
          <h1 className="mt-2 text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold tracking-[-0.03em] text-ink">
            Day {day.day} practice dossier
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-ink/60">
            TAT · WAT (15 words) · SRT (10 situations) · Lecturette. Work in order; write your answers by hand and upload photos at the end.
          </p>
          <div className="mt-6">
            <DossierRunner
              day={day}
              imageAvailable={imageAvailable}
              timings={{
                tat: TIMINGS.tatSeconds,
                watWord: TIMINGS.watWordSeconds,
                srt: TIMINGS.srtSeconds,
                prep: TIMINGS.lecturettePrepSeconds,
                speak: TIMINGS.lecturetteSpeakSeconds,
              }}
            />
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
