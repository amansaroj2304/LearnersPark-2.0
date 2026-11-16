import { NextResponse, type NextRequest } from "next/server";
import { getAttempt, ownsAttempt, saveAnswer } from "@/lib/opam/data";
import { getGuestToken, getViewer } from "@/lib/opam/session";
import type { Answer } from "@/lib/opam/types";

const VALID = new Set(["A", "B", "C", "D"]);

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body?.attemptId || !body?.questionId || !VALID.has(body?.answer)) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const attempt = await getAttempt(body.attemptId);
  if (!attempt) return NextResponse.json({ error: "not found" }, { status: 404 });

  const viewer = await getViewer();
  const token = await getGuestToken(attempt.id);
  if (!ownsAttempt(attempt, viewer.userId, token)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const result = await saveAnswer({
    attemptId: attempt.id,
    questionId: String(body.questionId),
    answer: body.answer as Answer,
    spent: Number.isFinite(body.spent) ? Number(body.spent) : 0,
  });
  if (result.error === "closed") {
    return NextResponse.json({ error: "attempt already closed" }, { status: 409 });
  }
  if (result.error === "not_found") {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
