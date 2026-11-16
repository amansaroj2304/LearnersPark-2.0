import { NextResponse, type NextRequest } from "next/server";
import { getAttempt, ownsAttempt, submitAttempt } from "@/lib/opam/data";
import { getGuestToken, getViewer } from "@/lib/opam/session";
import type { Answer } from "@/lib/opam/types";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body?.attemptId) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const attempt = await getAttempt(body.attemptId);
  if (!attempt) return NextResponse.json({ error: "not found" }, { status: 404 });

  const viewer = await getViewer();
  const token = await getGuestToken(attempt.id);
  if (!ownsAttempt(attempt, viewer.userId, token)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // Idempotent: a graded attempt is never re-graded or overwritten.
  if (attempt.status !== "in_progress") {
    return NextResponse.json({ ok: true, alreadyGraded: true });
  }

  const result = await submitAttempt({
    attemptId: attempt.id,
    answers: (body.answers ?? {}) as Record<string, Answer>,
    spent: (body.spent ?? {}) as Record<string, number>,
    locked: (body.locked ?? {}) as Record<string, boolean>,
    flagged: (body.flagged ?? {}) as Record<string, boolean>,
    mode: body.mode === "auto" ? "auto" : "manual",
  });

  if (result.error === "not_found") {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, reportId: attempt.id });
}
