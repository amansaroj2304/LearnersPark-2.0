import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { StartButton } from "@/components/opam/start-button";
import { getSetConfig } from "@/lib/opam/data";
import { isOpamConfigured } from "@/lib/supabase/service";
import { OPAM_DISCLAIMER } from "@/lib/opam/types";

export const instant = false;

const INSTRUCTIONS = [
  "The paper has three sections and 120 questions in a fixed order.",
  "Section 1 (Q1–60): agree or disagree with each statement as you usually behave.",
  "Section 2 (Q61–95): two defensible options — choose the one closer to what you would actually do.",
  "Section 3 (Q96–120): a scenario with four responses — choose the most constructive one.",
  "Each question has its own 15-second clock. When it runs out the question closes and the paper moves on.",
  "There is a hard 30-minute ceiling. At the ceiling the paper submits itself.",
  "Time already spent on a question is not returned if you go back to it.",
  "Refreshing the page resumes the same attempt with the same clocks — it does not restart anything.",
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ set: string }>;
}): Promise<Metadata> {
  const { set } = await params;
  return {
    title: `OPAM Mock Test — Set ${set} | Learners Park`,
    robots: { index: true, follow: true },
  };
}

export default async function OpamSetPage({ params }: { params: Promise<{ set: string }> }) {
  const { set } = await params;
  const setId = Number(set);
  if (![1, 2].includes(setId)) notFound();

  const config = isOpamConfigured() ? await getSetConfig(setId).catch(() => null) : null;
  const enabled = Boolean(config?.is_enabled);

  return (
    <>
      <SiteHeader />
      <main className="bg-bg-light">
        <Container className="py-12 sm:py-16">
          <Link href="/opam" className="text-sm font-semibold text-crimson hover:underline">
            ← All OPAM sets
          </Link>
          <h1 className="mt-4 text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-ink">
            {config?.title ?? `OPAM Mock Test — Set ${setId}`}
          </h1>
          <p className="mt-2 text-sm font-semibold text-crimson">{config?.subtitle || (setId === 1 ? "Foundations" : "Pressure")}</p>

          {!enabled ? (
            <div className="mt-8 rounded-2xl border border-ink/10 bg-white p-6">
              <h2 className="text-lg font-bold text-ink">This set is temporarily closed</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">
                The paper is being finalised and will open shortly. Nothing is lost: your progress on
                other tests is unaffected.
              </p>
            </div>
          ) : (
            <>
              <div className="mt-8 grid gap-4 sm:grid-cols-4">
                {[
                  ["Questions", "120"],
                  ["Sections", "3"],
                  ["Per question", `${config?.per_question_secs ?? 15} s`],
                  ["Total clock", `${Math.round((config?.total_seconds ?? 1800) / 60)} min`],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-ink/10 bg-white p-4">
                    <p className="text-[10px] font-bold tracking-[0.12em] text-ink/45 uppercase">{label}</p>
                    <p className="mt-1 text-xl font-extrabold text-ink">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-ink/10 bg-white p-6">
                <h2 className="text-lg font-bold text-ink">Before you start</h2>
                <ol className="mt-3 flex flex-col gap-2 text-sm leading-relaxed text-ink/70">
                  {INSTRUCTIONS.map((line, i) => (
                    <li key={line} className="flex gap-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink/8 text-[11px] font-bold text-ink/60">
                        {i + 1}
                      </span>
                      {line}
                    </li>
                  ))}
                </ol>
                <div className="mt-6">
                  <StartButton setId={setId} label={`Start Set ${setId}`} />
                </div>
              </div>
            </>
          )}

          <div className="mt-6 rounded-2xl border border-ink/10 bg-white p-6">
            <h2 className="text-sm font-bold tracking-[0.12em] text-ink/45 uppercase">Read this first</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">{OPAM_DISCLAIMER}</p>
          </div>

          <p className="mt-6 text-xs leading-relaxed text-ink/45">
            Independent practice simulation. Not affiliated with the Indian Armed Forces, the Ministry
            of Defence, DIPR or any Selection Board. For official information visit{" "}
            <a href="https://joinindianarmy.nic.in" className="underline" rel="noreferrer" target="_blank">
              joinindianarmy.nic.in
            </a>
            .
          </p>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
