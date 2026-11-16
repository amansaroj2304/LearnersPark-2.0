import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/admin/ui";
import { ReportView } from "@/components/opam/report-view";
import { getAttempt, getFullQuestions, getSetConfig } from "@/lib/opam/data";
import { formatDate } from "@/lib/admin/data";

export const instant = false;

const LETTERS = ["A", "B", "C", "D"];

export default async function AdminAttemptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const attempt = await getAttempt(id).catch(() => null);
  if (!attempt) notFound();

  const [questions, config] = await Promise.all([
    getFullQuestions(attempt.set_id),
    getSetConfig(attempt.set_id).catch(() => null),
  ]);
  const byId = new Map(questions.map((q) => [q.id, q]));

  return (
    <>
      <PageHeader
        title={`Attempt · Set ${attempt.set_id}`}
        description={`${formatDate(attempt.started_at)} · ${attempt.status.replace("_", " ")} · ${attempt.user_id ? "signed-in student" : "guest"}`}
        actions={
          <Link href="/admin/opam/attempts" className="flex h-10 items-center gap-2 rounded-lg border border-ink/15 px-4 text-sm font-semibold text-ink hover:bg-ink/5">
            <ArrowLeft className="h-4 w-4" strokeWidth={2.2} /> Attempts
          </Link>
        }
      />

      <div className="flex flex-col gap-8 px-5 py-6 sm:px-8">
        <section className="rounded-2xl border border-ink/10 bg-white p-5">
          <h2 className="text-sm font-bold tracking-[0.12em] text-ink/45 uppercase">Raw answers</h2>
          <p className="mt-1 text-xs text-ink/50">
            Part 3 shows the best option in green, defensible in amber, weak in red. Seconds spent appear under each cell.
          </p>
          <div className="mt-4 grid grid-cols-6 gap-1.5 sm:grid-cols-10 lg:grid-cols-15">
            {questions.map((q) => {
              const pick = attempt.answers[q.id];
              const pickIdx = pick ? LETTERS.indexOf(pick) : -1;
              let tone = "bg-ink/5 text-ink/50";
              if (pickIdx >= 0) {
                if (q.part !== 3) tone = "bg-ink/10 text-ink";
                else if (pickIdx === q.bestIndex) tone = "bg-[#2f9e5b]/20 text-[#256e42]";
                else if ((q.acceptable ?? []).includes(pickIdx)) tone = "bg-gold/25 text-[#7a5c10]";
                else tone = "bg-crimson/15 text-crimson";
              }
              return (
                <div key={q.id} className={`rounded-md px-1 py-1.5 text-center ${tone}`} title={q.text.slice(0, 120)}>
                  <p className="text-[10px] font-semibold">{q.qnum}</p>
                  <p className="text-xs font-bold">{pick ?? "–"}</p>
                  <p className="text-[9px] opacity-70">{attempt.spent[q.id] ?? 0}s</p>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-ink/45">
            Bank size at grading: {questions.length} active questions · per-question {config?.per_question_secs}s · ceiling {config?.total_seconds}s
          </p>
          <p className="text-xs text-ink/45">IP hash: {attempt.ip_hash ?? "—"} · device: {attempt.user_agent?.slice(0, 90) ?? "—"}</p>
        </section>

        {attempt.report ? (
          <section className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-7">
            <ReportView
              report={attempt.report}
              questions={questions}
              autoSubmitted={attempt.status === "auto_submitted"}
              finishedAt={attempt.finished_at}
              setTitle={config?.title ?? `OPAM Mock Test — Set ${attempt.set_id}`}
            />
          </section>
        ) : (
          <p className="rounded-xl border border-ink/10 bg-white p-5 text-sm text-ink/60">
            This attempt has not been graded yet.
          </p>
        )}
        <span className="hidden">{byId.size}</span>
      </div>
    </>
  );
}
