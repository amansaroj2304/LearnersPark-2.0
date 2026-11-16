import { NextResponse, type NextRequest } from "next/server";
import { getAdminState } from "@/lib/admin/auth";
import { listAttempts, writeAudit } from "@/lib/opam/data";

const cell = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;

export async function GET(request: NextRequest) {
  const state = await getAdminState();
  if (state.status !== "ok") {
    return new NextResponse("Not authorised", { status: state.status === "unauthenticated" ? 401 : 403 });
  }

  const setId = Number(request.nextUrl.searchParams.get("set")) || undefined;
  const status = request.nextUrl.searchParams.get("status") ?? "all";
  const rows = await listAttempts({ setId, status, limit: 5000 });

  const header = [
    "attempt_id", "set_id", "candidate", "status", "started_at", "finished_at", "elapsed_secs",
    "attempted", "unanswered", "completion_pct", "consistency_pct", "consistency_checked",
    "sjt_best", "sjt_defensible", "sjt_weak", "sjt_index", "avg_seconds", "rapid_answers", "flagged_count",
  ];
  const lines = rows.map((row) => {
    const r = row.report;
    return [
      row.id, row.set_id, row.user_id ? "student" : "guest", row.status, row.started_at,
      row.finished_at ?? "", row.elapsed_secs,
      r?.attempted ?? Object.keys(row.answers ?? {}).length, r?.unanswered ?? "", r?.completion ?? "",
      r?.cons.rate ?? "", r?.cons.checked ?? "", r?.sjt.best ?? "", r?.sjt.defensible ?? "",
      r?.sjt.weak ?? "", r?.sjt.rate ?? "", r?.lat.avg ?? "", r?.lat.rapid ?? "", r?.flaggedCount ?? "",
    ];
  });
  const csv = [header, ...lines].map((line) => line.map(cell).join(",")).join("\r\n");

  await writeAudit({
    actorId: state.userId,
    action: "attempts.export",
    target: `set:${setId ?? "all"}`,
    after: { rows: rows.length, status },
  });

  return new NextResponse(`\uFEFF${csv}`, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="opam-attempts-${new Date().toISOString().slice(0, 10)}.csv"`,
      "cache-control": "no-store",
    },
  });
}
