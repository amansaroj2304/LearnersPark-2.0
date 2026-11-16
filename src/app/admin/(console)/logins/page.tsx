import { Badge, DataTable, EmptyState, PageHeader } from "@/components/admin/ui";
import { formatDate, getLogins } from "@/lib/admin/data";

export const instant = false;

export default async function LoginsPage() {
  const { rows, students } = await getLogins();

  return (
    <>
      <PageHeader
        title="Login activity"
        description="The most recent 100 sign-in events, newest first."
      />
      <div className="px-5 py-6 sm:px-8">
        {rows.length === 0 ? (
          <EmptyState
            title="No login events yet"
            description="Events are recorded from the next sign-in onward. Nothing is backfilled or invented."
          />
        ) : (
          <DataTable head={["Student", "Event", "When", "IP", "Device"]}>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-ink/6 last:border-b-0">
                <td className="px-4 py-3 text-ink">
                  {row.user_id ? students.get(row.user_id) ?? "Unknown student" : "—"}
                </td>
                <td className="px-4 py-3">
                  <Badge tone={row.event_type === "failed" ? "red" : row.event_type === "sign_out" ? "grey" : "green"}>
                    {row.event_type}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-ink/70">{formatDate(row.created_at)}</td>
                <td className="px-4 py-3 text-ink/55">{row.ip || "—"}</td>
                <td className="max-w-[280px] truncate px-4 py-3 text-xs text-ink/45">
                  {row.user_agent || "—"}
                </td>
              </tr>
            ))}
          </DataTable>
        )}
      </div>
    </>
  );
}
