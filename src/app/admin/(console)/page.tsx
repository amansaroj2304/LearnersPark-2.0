import Link from "next/link";
import { DataTable, EmptyState, PageHeader, StatCard, Badge } from "@/components/admin/ui";
import { formatDate, getDashboard } from "@/lib/admin/data";

export const instant = false;

export default async function AdminOverviewPage() {
  const { counts, statusCounts, recent } = await getDashboard();

  return (
    <>
      <PageHeader
        title="Overview"
        description="Live totals from the database. Empty states mean no data yet, not a broken console."
      />

      <div className="px-5 py-6 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Students" value={counts.students} hint={`${statusCounts.active} active`} />
          <StatCard label="Tests" value={counts.tests} hint="In the registry" />
          <StatCard label="Attempts" value={counts.attempts} hint="Completed submissions" />
          <StatCard label="Logins · 24h" value={counts.logins24h} hint="All sign-in events" />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-ink">Recent attempts</h2>
              <Link href="/admin/students" className="text-sm font-semibold text-crimson hover:underline">
                All students
              </Link>
            </div>
            {recent.length === 0 ? (
              <EmptyState
                title="No attempts yet"
                description="Attempts appear here as soon as a student submits a test. Nothing is simulated."
              />
            ) : (
              <DataTable head={["Test", "Score", "Accuracy", "Submitted"]}>
                {recent.map((row) => (
                  <tr key={row.id} className="border-b border-ink/6 last:border-b-0">
                    <td className="px-4 py-3 font-semibold text-ink">{row.test_title}</td>
                    <td className="px-4 py-3 text-ink">
                      {row.score}
                      <span className="text-ink/40">/{row.max_score}</span>
                    </td>
                    <td className="px-4 py-3 text-ink/70">{row.accuracy}%</td>
                    <td className="px-4 py-3 text-ink/55">{formatDate(row.created_at)}</td>
                  </tr>
                ))}
              </DataTable>
            )}
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-ink">Account status</h2>
            <div className="rounded-2xl border border-ink/10 bg-white p-5">
              <ul className="flex flex-col gap-3 text-sm">
                <li className="flex items-center justify-between">
                  <Badge tone="green">Active</Badge>
                  <span className="font-bold text-ink tabular-nums">{statusCounts.active}</span>
                </li>
                <li className="flex items-center justify-between">
                  <Badge tone="grey">Inactive</Badge>
                  <span className="font-bold text-ink tabular-nums">{statusCounts.inactive}</span>
                </li>
                <li className="flex items-center justify-between">
                  <Badge tone="red">Suspended</Badge>
                  <span className="font-bold text-ink tabular-nums">{statusCounts.suspended}</span>
                </li>
              </ul>
              <div className="mt-5 border-t border-ink/10 pt-4">
                <Link
                  href="/admin/export/students"
                  className="text-sm font-semibold text-crimson hover:underline"
                  prefetch={false}
                >
                  Export students as CSV
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
