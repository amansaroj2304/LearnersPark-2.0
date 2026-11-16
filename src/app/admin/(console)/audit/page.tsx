import { DataTable, EmptyState, PageHeader } from "@/components/admin/ui";
import { formatDate, getAudit } from "@/lib/admin/data";

export const instant = false;

export default async function AuditPage() {
  const { rows, admins } = await getAudit();

  return (
    <>
      <PageHeader
        title="Audit log"
        description="Administrator actions that touch student data, newest first."
      />
      <div className="px-5 py-6 sm:px-8">
        {rows.length === 0 ? (
          <EmptyState
            title="No admin actions recorded"
            description="Exports and sensitive changes are written here with the acting administrator."
          />
        ) : (
          <DataTable head={["Action", "Administrator", "Target", "When"]}>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-ink/6 last:border-b-0">
                <td className="px-4 py-3 font-semibold text-ink">{row.action}</td>
                <td className="px-4 py-3 text-ink/70">
                  {admins.get(row.admin_id) ?? row.admin_id.slice(0, 8)}
                </td>
                <td className="px-4 py-3 text-ink/55">
                  {row.target_type ? `${row.target_type}:${row.target_id ?? "—"}` : "—"}
                </td>
                <td className="px-4 py-3 text-ink/55">{formatDate(row.created_at)}</td>
              </tr>
            ))}
          </DataTable>
        )}
      </div>
    </>
  );
}
