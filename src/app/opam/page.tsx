import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { getSetConfigs } from "@/lib/opam/data";
import { isOpamConfigured } from "@/lib/supabase/service";
import { OPAM_DISCLAIMER } from "@/lib/opam/types";

export const instant = false;

export const metadata: Metadata = {
  title: "OPAM practice tests | Learners Park",
  description:
    "Two free 120-question OPAM practice simulations: personality profiling, forced choice and situational judgement, with a private practice report.",
};

const BLURBS: Record<number, string> = {
  1: "Discipline, composure, group behaviour, initiative and everyday decisions. The broad first pass.",
  2: "Conflicting responsibilities, thin resources, leadership without authority, ethics and sustained pressure.",
};

export default async function OpamIndexPage() {
  let configs: Awaited<ReturnType<typeof getSetConfigs>> = [];
  let loadError = false;
  if (isOpamConfigured()) {
    try {
      configs = await getSetConfigs();
    } catch {
      loadError = true;
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="bg-bg-light">
        <Container className="py-12 sm:py-16">
          <p className="text-xs font-bold tracking-[0.16em] text-crimson uppercase">Practice module</p>
          <h1 className="mt-3 text-[clamp(2rem,4.5vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">
            OPAM practice tests
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/65">
            Two timed simulations of the Officer Personality Assessment Module format: 60 personality
            statements, 35 forced-choice dilemmas and 25 situational scenarios in each set. Every
            attempt produces a private practice report on your own answering patterns.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {[1, 2].map((setId) => {
              const config = configs.find((c) => c.set_id === setId);
              const ready = Boolean(config?.is_enabled);
              return (
                <article key={setId} className="flex flex-col rounded-2xl border border-ink/10 bg-white p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-ink">
                      {config?.title ?? `OPAM Mock Test — Set ${setId}`}
                    </h2>
                    <span
                      className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
                        ready ? "bg-[#2f9e5b]/12 text-[#256e42]" : "bg-ink/8 text-ink/55"
                      }`}
                    >
                      {ready ? "Open" : "Preparing"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-crimson">{config?.subtitle || (setId === 1 ? "Foundations" : "Pressure")}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/65">{BLURBS[setId]}</p>
                  <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                    {[
                      ["Questions", "120"],
                      ["Structure", "60+35+25"],
                      ["Duration", "30 min"],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-lg bg-ink/4 py-2">
                        <dt className="text-[10px] font-bold tracking-[0.1em] text-ink/45 uppercase">{label}</dt>
                        <dd className="text-sm font-bold text-ink">{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <Link
                    href={`/opam/${setId}`}
                    className={`mt-5 inline-flex h-11 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                      ready
                        ? "bg-crimson text-white hover:bg-crimson-shape"
                        : "border border-ink/15 text-ink hover:bg-ink/5"
                    }`}
                  >
                    {ready ? `Start Set ${setId}` : `View Set ${setId}`}
                  </Link>
                </article>
              );
            })}
          </div>

          {(!isOpamConfigured() || loadError) && (
            <p className="mt-6 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-[#6b520f]">
              The OPAM question bank is not connected yet, so both sets show as “Preparing”. Nothing
              is broken — the sets open as soon as the bank is imported and the set is enabled.
            </p>
          )}

          <div className="mt-10 rounded-2xl border border-ink/10 bg-white p-6">
            <h2 className="text-sm font-bold tracking-[0.12em] text-ink/45 uppercase">Read this first</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">{OPAM_DISCLAIMER}</p>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
