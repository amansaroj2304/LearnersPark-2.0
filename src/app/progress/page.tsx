import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BarChart3, Trophy } from "lucide-react";
import { AppHeader } from "@/components/csss/app-header";
import { Container } from "@/components/ui/container";
import { buttonClasses } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import type { SectionScore } from "@/lib/csss-scoring";

export const instant = false;

export const metadata: Metadata = {
  title: "My Progress | Learners Park",
  description: "Track your CSSS test scores and section-wise performance.",
};

type Attempt = {
  id: string;
  test_id: string;
  test_title: string;
  score: number;
  max_score: number;
  correct: number;
  wrong: number;
  attempted: number;
  accuracy: number;
  sections: SectionScore[];
  created_at: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function ProgressPage() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();

  if (!claims?.claims) {
    redirect("/login?next=/progress");
  }

  const { data } = await supabase
    .from("test_attempts")
    .select("*")
    .order("created_at", { ascending: false });

  const attempts = (data ?? []) as Attempt[];
  const latest = attempts[0];

  return (
    <div className="min-h-screen bg-bg-light">
      <AppHeader />

      <Container className="py-10">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-white">
            <BarChart3 className="h-5 w-5" strokeWidth={2.3} />
          </span>
          <div>
            <h1 className="text-[clamp(1.5rem,3vw,2rem)] font-extrabold tracking-[-0.02em] text-ink">
              My Progress
            </h1>
            <p className="text-sm text-ink/55">
              Your CSSS test results and section-wise breakdown.
            </p>
          </div>
        </div>

        {!latest ? (
          <div className="mt-10 rounded-2xl border border-ink/10 bg-white p-10 text-center">
            <p className="text-lg font-bold text-ink">No attempts yet</p>
            <p className="mt-2 text-sm text-ink/55">
              Attempt a CSSS mock test to see your score and progress here.
            </p>
            <Link
              href="/csss"
              className={buttonClasses("primary", "md", "mt-6")}
            >
              Browse tests
            </Link>
          </div>
        ) : (
          <>
            <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
              <div className="rounded-2xl border border-ink/10 bg-white p-6 sm:p-7">
                <span className="text-xs font-bold tracking-[0.14em] text-ink/45 uppercase">
                  Latest attempt
                </span>
                <p className="mt-2 text-sm font-semibold text-ink/70">
                  {latest.test_title}
                </p>
                <div className="mt-5 flex items-center gap-5">
                  <span className="flex h-24 w-24 items-center justify-center rounded-full text-2xl font-extrabold text-crimson ring-4 ring-crimson/30">
                    {latest.score}
                  </span>
                  <div className="text-sm text-ink/70">
                    <p className="font-bold text-ink">
                      {latest.score} / {latest.max_score} marks
                    </p>
                    <p className="mt-1">
                      Accuracy{" "}
                      <span className="font-semibold text-ink">
                        {latest.accuracy}%
                      </span>
                    </p>
                    <p className="mt-1">
                      Correct {latest.correct} · Wrong {latest.wrong}
                    </p>
                    <p className="mt-1 text-xs text-ink/45">
                      {formatDate(latest.created_at)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-ink/10 bg-white p-6 sm:p-7">
                <span className="text-xs font-bold tracking-[0.14em] text-ink/45 uppercase">
                  Section breakdown
                </span>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[520px] border-collapse text-sm">
                    <thead>
                      <tr className="text-left text-xs font-bold text-ink/45 uppercase">
                        <th className="pb-2">Section</th>
                        <th className="pb-2 text-center">Attempted</th>
                        <th className="pb-2 text-center">Correct</th>
                        <th className="pb-2 text-center">Wrong</th>
                        <th className="pb-2 text-center">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(latest.sections ?? []).map((section) => (
                        <tr
                          key={section.code}
                          className="border-t border-ink/10 text-ink"
                        >
                          <td className="py-3 pr-4 font-semibold">
                            {section.name}
                          </td>
                          <td className="py-3 text-center">{section.attempted}</td>
                          <td className="py-3 text-center">{section.correct}</td>
                          <td className="py-3 text-center">{section.wrong}</td>
                          <td className="py-3 text-center font-semibold">
                            {section.score}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section className="mt-10">
              <h2 className="text-lg font-bold text-ink">Attempt history</h2>
              <div className="mt-4 flex flex-col gap-3">
                {attempts.map((attempt) => (
                  <div
                    key={attempt.id}
                    className="flex flex-wrap items-center gap-4 rounded-2xl border border-ink/10 bg-white px-6 py-4"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15 text-gold">
                      <Trophy className="h-5 w-5" strokeWidth={2.3} />
                    </span>
                    <div className="min-w-[180px] flex-1">
                      <p className="font-semibold text-ink">
                        {attempt.test_title}
                      </p>
                      <p className="text-xs text-ink/45">
                        {formatDate(attempt.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <span className="text-ink/60">
                        Accuracy{" "}
                        <span className="font-semibold text-ink">
                          {attempt.accuracy}%
                        </span>
                      </span>
                      <span className="font-extrabold text-ink">
                        {attempt.score}
                        <span className="text-ink/40">
                          /{attempt.max_score}
                        </span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </Container>
    </div>
  );
}
