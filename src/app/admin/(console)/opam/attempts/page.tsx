import Link from "next/link";
import { Badge, DataTable, EmptyState, PageHeader } from "@/components/admin/ui";
import { listAttempts } from "@/lib/opam/data";
import { isOpamConfigured } from "@/lib/supabase/service";
import { formatDate } from "@/lib/admin/data";

export const instant = false;

export default async function AdminOpamAttemptsPage({
  searchParams,
}: {
  searchParams: Promise<{ set?: string; status?: string }>;
}) {
  const params = await searchParams;
  const setId = Number(params.set) || undefined;
  const status = params.status ?? "all";

  const rows = isOpamConfigured()
    ? await listAttempts({ setId, status, limit: 100 }).catch(() => [])
    : [];

  return (
    <>
      <PageHeader
        title="OPAM attempts"
        description="Every attempt, newest first. Guests are attempts without a signed-in account."
        actions={
          <Link
            href={`/admin/export/opam?set=${params.set ?? ""}&status=${status}`}
            prefetch={false}
            className="h-10 rounded-lg border border-ink/15 px-4 text-sm font-semibold leading-[2.4rem] text-ink hover:bg-ink/5"
          >
            Export CSV
          </Link>
        }
      />
      <div className="px-5 py-6 sm:px-8">
        <form className="flex flex-wrap items-center gap-2" action="/admin/opam/attempts">
          <select name="set" defaultValue={params.set ?? ""} className="h-10 rounded-lg border border-ink/15 bg-white px-3 text-sm">
            <option value="">All sets</option>
            <option value="1">Set 1</option>
            <option value="2">Set 2</option>
          </select>
          <select name="status" defaultValue={status} className="h-10 rounded-lg border border-ink/15 bg-white px-3 text-sm">
            <option value="all">All statuses</option>
            <option value="in_progress">In progress</option>
            <option value="submitted">Submitted</option>
            <option value="auto_submitted">Auto-submitted</option>
            <option value="abandoned">Abandoned</option>
          </select>
          <button type="submit" className="h-10 rounded-lg bg-ink px-4 text-sm font-semibold text-white">Filter</button>
        </form>

        <div className="mt-5">
          {rows.length === 0 ? (
            <EmptyState
              title="No attempts yet"
              description="Attempts appear here as soon as a candidate starts a set. Nothing is simulated."
            />
          ) : (
            <DataTable head={["Started", "Set", "Candidate", "Status", "Answered", "Completion", "Open"]}>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-ink/6 last:border-b-0">
                  <td className="px-4 py-3 text-ink/70">{formatDate(row.started_at)}</td>
                  <td className="px-4 py-3 text-ink">Set {row.set_id}</td>
                  <td className="px-4 py-3 text-ink/70">{row.user_id ? "Signed-in student" : "Guest"}</td>
                  <td className="px-4 py-3">
                    <Badge tone={row.status === "in_progress" ? "amber" : row.status === "abandoned" ? "red" : "green"}>
                      {row.status.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-ink/70">{Object.keys(row.answers ?? {}).length}</td>
                  <td className="px-4 py-3 text-ink/70">{row.report ? `${row.report.completion}%` : "—"}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/opam/attempts/${row.id}`} className="font-semibold text-crimson hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </DataTable>
          )}
        </div>
      </div>
    </>
  );
}
