import Link from "next/link";
import { DataTable, EmptyState, PageHeader, Badge } from "@/components/admin/ui";
import { formatDate, getStudents } from "@/lib/admin/data";

export const instant = false;

const statuses = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "suspended", label: "Suspended" },
];

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const { rows, total, page, pageSize, error } = await getStudents({
    q: params.q,
    status: params.status,
    page: Number(params.page ?? 1) || 1,
  });

  const pages = Math.max(1, Math.ceil(total / pageSize));
  const query = (next: number) => {
    const search = new URLSearchParams();
    if (params.q) search.set("q", params.q);
    if (params.status && params.status !== "all") search.set("status", params.status);
    if (next > 1) search.set("page", String(next));
    const suffix = search.toString();
    return suffix ? `/admin/students?${suffix}` : "/admin/students";
  };

  return (
    <>
      <PageHeader
        title="Students"
        description={`${total} profile${total === 1 ? "" : "s"} in the database.`}
        actions={
          <Link
            href="/admin/export/students"
            prefetch={false}
            className="h-10 rounded-lg border border-ink/15 px-4 text-sm font-semibold leading-[2.4rem] text-ink transition-colors hover:bg-ink/5"
          >
            Export CSV
          </Link>
        }
      />

      <div className="px-5 py-6 sm:px-8">
        <form className="flex flex-wrap items-center gap-2" action="/admin/students">
          <input
            type="search"
            name="q"
            defaultValue={params.q ?? ""}
            placeholder="Search name, email, Student ID or mobile"
            className="h-10 w-full max-w-[360px] rounded-lg border border-ink/15 bg-white px-3 text-sm text-ink focus:border-ink/40 focus:outline-none"
          />
          <select
            name="status"
            defaultValue={params.status ?? "all"}
            className="h-10 rounded-lg border border-ink/15 bg-white px-3 text-sm text-ink focus:border-ink/40 focus:outline-none"
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="h-10 rounded-lg bg-ink px-4 text-sm font-semibold text-white transition-colors hover:bg-ink/90"
          >
            Search
          </button>
        </form>

        {error && (
          <p role="alert" className="mt-4 rounded-lg bg-crimson/8 px-3 py-2 text-sm text-crimson">
            Could not load students: {error}
          </p>
        )}

        <div className="mt-5">
          {rows.length === 0 ? (
            <EmptyState
              title="No students found"
              description={
                params.q || (params.status && params.status !== "all")
                  ? "No profile matches this search. Try a different name, email or Student ID."
                  : "Profiles are created automatically the first time a student signs in with Google."
              }
            />
          ) : (
            <DataTable head={["Student", "Email", "Mobile", "Status", "Joined"]}>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-ink/6 last:border-b-0">
                  <td className="px-4 py-3">
                    <Link href={`/admin/students/${row.id}`} className="font-semibold text-ink hover:text-crimson">
                      {row.full_name || "Unnamed student"}
                    </Link>
                    <p className="text-xs text-ink/45">{row.student_id}</p>
                  </td>
                  <td className="px-4 py-3 text-ink/70">{row.email || "—"}</td>
                  <td className="px-4 py-3 text-ink/70">{row.mobile || "—"}</td>
                  <td className="px-4 py-3">
                    <Badge
                      tone={
                        row.account_status === "active"
                          ? "green"
                          : row.account_status === "suspended"
                            ? "red"
                            : "grey"
                      }
                    >
                      {row.account_status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-ink/55">{formatDate(row.created_at)}</td>
                </tr>
              ))}
            </DataTable>
          )}
        </div>

        {pages > 1 && (
          <nav className="mt-5 flex items-center justify-between text-sm" aria-label="Pagination">
            <Link
              href={query(page - 1)}
              aria-disabled={page <= 1}
              className={page <= 1 ? "pointer-events-none text-ink/30" : "font-semibold text-crimson"}
            >
              Previous
            </Link>
            <span className="text-ink/55">
              Page {page} of {pages}
            </span>
            <Link
              href={query(page + 1)}
              aria-disabled={page >= pages}
              className={page >= pages ? "pointer-events-none text-ink/30" : "font-semibold text-crimson"}
            >
              Next
            </Link>
          </nav>
        )}
      </div>
    </>
  );
}
