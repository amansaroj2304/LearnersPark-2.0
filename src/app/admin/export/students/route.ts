import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAdminState } from "@/lib/admin/auth";
import { getAllStudentsForExport } from "@/lib/admin/data";


function cell(value: unknown) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export async function GET() {
  const state = await getAdminState();
  if (state.status !== "ok") {
    return new NextResponse("Not authorised", {
      status: state.status === "unauthenticated" ? 401 : 403,
    });
  }

  const rows = await getAllStudentsForExport();
  const header = ["Student ID", "Full name", "Email", "Mobile", "Status", "Joined"];
  const csv = [header, ...rows.map((row) => [
    row.student_id,
    row.full_name,
    row.email,
    row.mobile ?? "",
    row.account_status,
    row.created_at,
  ])]
    .map((line) => line.map(cell).join(","))
    .join("\r\n");

  const supabase = await createClient();
  await supabase.from("audit_log").insert({
    admin_id: state.userId,
    action: "export.students",
    target_type: "students",
    target_id: null,
    metadata: { rows: rows.length },
  });

  const stamp = new Date().toISOString().slice(0, 10);
  return new NextResponse(`\uFEFF${csv}`, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="learners-park-students-${stamp}.csv"`,
      "cache-control": "no-store",
    },
  });
}
