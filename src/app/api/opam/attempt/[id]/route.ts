import { NextResponse } from "next/server";
import { getAttempt, ownsAttempt } from "@/lib/opam/data";
import { getGuestToken, getViewer, isAdminViewer } from "@/lib/opam/session";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const attempt = await getAttempt(id);
  if (!attempt) return NextResponse.json({ error: "not found" }, { status: 404 });

  const viewer = await getViewer();
  const token = await getGuestToken(attempt.id);
  const allowed = ownsAttempt(attempt, viewer.userId, token) || (await isAdminViewer());
  if (!allowed) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  return NextResponse.json({
    id: attempt.id,
    setId: attempt.set_id,
    status: attempt.status,
    startedAt: attempt.started_at,
    finishedAt: attempt.finished_at,
    elapsedSecs: attempt.elapsed_secs,
    answers: attempt.answers,
    spent: attempt.spent,
    locked: attempt.locked,
    flagged: attempt.flagged,
    report: attempt.report,
  });
}
