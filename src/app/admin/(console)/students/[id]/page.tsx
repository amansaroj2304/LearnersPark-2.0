import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge, DataTable, EmptyState, PageHeader } from "@/components/admin/ui";
import { formatDate, getStudent } from "@/lib/admin/data";

export const instant = false;


export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { student, attempts, logins } = await getStudent(id);
  if (!student) notFound();

  const best = attempts.reduce(
    (acc, attempt) => (attempt.score > acc ? attempt.score : acc),
    0,
  );

  return (
    <>
      <PageHeader
        title={student.full_name || "Unnamed student"}
        description={`${student.student_id} · joined ${formatDate(student.created_at)}`}
        actions={
          <Link
            href="/admin/students"
            className="flex h-10 items-center gap-2 rounded-lg border border-ink/15 px-4 text-sm font-semibold text-ink transition-colors hover:bg-ink/5"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.2} />
            Students
          </Link>
        }
      />

      <div className="px-5 py-6 sm:px-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <section className="rounded-2xl border border-ink/10 bg-white p-6">
            <h2 className="text-sm font-bold tracking-[0.12em] text-ink/45 uppercase">Profile</h2>
            <dl className="mt-4 flex flex-col gap-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink/55">Student ID</dt>
                <dd className="font-semibold text-ink">{student.student_id}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink/55">Email</dt>
                <dd className="font-semibold text-ink">{student.email || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink/55">Mobile</dt>
                <dd className="font-semibold text-ink">{student.mobile || "Not provided"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink/55">Status</dt>
                <dd>
                  <Badge
                    tone={
                      student.account_status === "active"
                        ? "green"
                        : student.account_status === "suspended"
                          ? "red"
                          : "grey"
                    }
                  >
                    {student.account_status}
                  </Badge>
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink/55">Attempts</dt>
                <dd className="font-semibold text-ink">{attempts.length}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink/55">Best score</dt>
                <dd className="font-semibold text-ink">{attempts.length ? best : "—"}</dd>
              </div>
            </dl>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-bold tracking-[0.12em] text-ink/45 uppercase">
              Login activity
            </h2>
            {logins.length === 0 ? (
              <EmptyState
                title="No sign-ins recorded"
                description="Login events are written from the next sign-in onward."
              />
            ) : (
              <DataTable head={["Event", "When", "IP"]}>
                {logins.map((row) => (
                  <tr key={row.id} className="border-b border-ink/6 last:border-b-0">
                    <td className="px-4 py-3">
                      <Badge tone={row.event_type === "failed" ? "red" : "green"}>
                        {row.event_type}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-ink/70">{formatDate(row.created_at)}</td>
                    <td className="px-4 py-3 text-ink/55">{row.ip || "—"}</td>
                  </tr>
                ))}
              </DataTable>
            )}
          </section>
        </div>

        <section className="mt-8">
          <h2 className="mb-3 text-sm font-bold tracking-[0.12em] text-ink/45 uppercase">
            Attempts and scorecards
          </h2>
          {attempts.length === 0 ? (
            <EmptyState
              title="No attempts yet"
              description="Scorecards appear here after this student submits a test."
            />
          ) : (
            <div className="flex flex-col gap-3">
              {attempts.map((attempt) => (
                <details key={attempt.id} className="group rounded-2xl border border-ink/10 bg-white">
                  <summary className="flex cursor-pointer list-none flex-wrap items-center gap-4 px-5 py-4">
                    <div className="min-w-[200px] flex-1">
                      <p className="font-semibold text-ink">{attempt.test_title}</p>
                      <p className="text-xs text-ink/45">{formatDate(attempt.created_at)}</p>
                    </div>
                    <span className="text-sm text-ink/60">
                      Correct {attempt.correct} · Wrong {attempt.wrong}
                    </span>
                    <span className="text-sm text-ink/60">Accuracy {attempt.accuracy}%</span>
                    <span className="text-lg font-extrabold text-ink tabular-nums">
                      {attempt.score}
                      <span className="text-sm font-medium text-ink/40">/{attempt.max_score}</span>
                    </span>
                  </summary>
                  <div className="border-t border-ink/8 px-5 py-4">
                    {(attempt.sections ?? []).length === 0 ? (
                      <p className="text-sm text-ink/55">No section breakdown stored for this attempt.</p>
                    ) : (
                      <table className="w-full border-collapse text-sm">
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
                          {attempt.sections.map((section) => (
                            <tr key={section.code} className="border-t border-ink/6 text-ink">
                              <td className="py-2 pr-4 font-medium">{section.name}</td>
                              <td className="py-2 text-center">{section.attempted}</td>
                              <td className="py-2 text-center">{section.correct}</td>
                              <td className="py-2 text-center">{section.wrong}</td>
                              <td className="py-2 text-center font-semibold">{section.score}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </details>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
