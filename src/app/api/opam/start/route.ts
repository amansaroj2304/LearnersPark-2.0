import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createAttempt, getPublicQuestions, getSetConfig } from "@/lib/opam/data";
import { getViewer, guestCookieName, hashIp } from "@/lib/opam/session";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const setId = Number(body.setId);
  if (![1, 2].includes(setId)) {
    return NextResponse.json({ error: "Unknown set." }, { status: 400 });
  }

  const config = await getSetConfig(setId).catch(() => null);
  if (!config) {
    return NextResponse.json({ error: "This set is not available." }, { status: 404 });
  }
  if (!config.is_enabled) {
    return NextResponse.json({ error: "This test is currently closed." }, { status: 403 });
  }

  const questions = await getPublicQuestions(setId);
  if (questions.length !== 120) {
    return NextResponse.json(
      { error: "This set is still being prepared. Please try again later." },
      { status: 409 },
    );
  }

  const viewer = await getViewer();
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const attempt = await createAttempt({
    setId,
    userId: viewer.userId,
    ipHash: hashIp(ip),
    userAgent: request.headers.get("user-agent"),
  });

  if (attempt.guestToken) {
    const jar = await cookies();
    jar.set(guestCookieName(attempt.id), attempt.guestToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
  }

  return NextResponse.json({
    attemptId: attempt.id,
    questions,
    config: {
      perQuestionSecs: config.per_question_secs,
      totalSeconds: config.total_seconds,
      allowBackNav: config.allow_back_nav,
    },
  });
}
