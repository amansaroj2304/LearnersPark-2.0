import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ReportView } from "@/components/opam/report-view";
import { getAttempt, getFullQuestions, getSetConfig, ownsAttempt } from "@/lib/opam/data";
import { getGuestToken, getViewer, isAdminViewer } from "@/lib/opam/session";

export const instant = false;

export default async function OpamReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const attempt = await getAttempt(id).catch(() => null);
  if (!attempt) notFound();

  const viewer = await getViewer();
  const token = await getGuestToken(attempt.id);
  const allowed = ownsAttempt(attempt, viewer.userId, token) || (await isAdminViewer());
  if (!allowed) notFound();

  if (attempt.status === "in_progress") redirect(`/opam/${attempt.set_id}/test?attempt=${attempt.id}`);

  const config = await getSetConfig(attempt.set_id).catch(() => null);
  const report = attempt.report;

  return (
    <>
      <SiteHeader />
      <main className="bg-bg-light">
        <Container className="py-10 sm:py-14">
          {!report ? (
            <div className="rounded-2xl border border-ink/10 bg-white p-6">
              <h1 className="text-xl font-bold text-ink">Report pending review</h1>
              <p className="mt-2 text-sm text-ink/65">Your paper was received. The report is not available yet.</p>
            </div>
          ) : !config?.show_report_to_user && !(await isAdminViewer()) ? (
            <div className="rounded-2xl border border-ink/10 bg-white p-6">
              <h1 className="text-xl font-bold text-ink">Report pending review</h1>
              <p className="mt-2 text-sm text-ink/65">
                This set is in review, so reports are not shown to candidates at the moment.
              </p>
            </div>
          ) : (
            <>
              <ReportView
                report={report}
                questions={await getFullQuestions(attempt.set_id)}
                autoSubmitted={attempt.status === "auto_submitted"}
                finishedAt={attempt.finished_at}
                setTitle={config?.title ?? `OPAM Mock Test — Set ${attempt.set_id}`}
                elapsedSecs={attempt.elapsed_secs}
              />
              <div className="mt-8 flex flex-wrap gap-3 print:hidden">
                <Link
                  href={`/opam/${attempt.set_id}`}
                  className="inline-flex h-11 items-center rounded-lg bg-crimson px-5 text-sm font-semibold text-white"
                >
                  Retake this set
                </Link>
                <Link
                  href={`/opam/${attempt.set_id === 1 ? 2 : 1}`}
                  className="inline-flex h-11 items-center rounded-lg border border-ink/15 px-5 text-sm font-semibold text-ink"
                >
                  Take the other set
                </Link>
                <Link href="/opam" className="inline-flex h-11 items-center px-2 text-sm font-semibold text-ink/60">
                  All OPAM sets
                </Link>
              </div>
            </>
          )}
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
