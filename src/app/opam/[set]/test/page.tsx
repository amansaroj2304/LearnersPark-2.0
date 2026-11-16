import { notFound, redirect } from "next/navigation";
import { ExamRunner } from "@/components/opam/exam-runner";
import { getAttempt, getPublicQuestions, getSetConfig, ownsAttempt } from "@/lib/opam/data";
import { getGuestToken, getViewer } from "@/lib/opam/session";

export const instant = false;

export default async function OpamTestPage({
  params,
  searchParams,
}: {
  params: Promise<{ set: string }>;
  searchParams: Promise<{ attempt?: string }>;
}) {
  const { set } = await params;
  const { attempt: attemptId } = await searchParams;
  const setId = Number(set);
  if (![1, 2].includes(setId)) notFound();
  if (!attemptId) redirect(`/opam/${setId}`);

  const attempt = await getAttempt(attemptId).catch(() => null);
  if (!attempt || attempt.set_id !== setId) redirect(`/opam/${setId}`);
  if (attempt.status !== "in_progress") redirect(`/opam/attempt/${attempt.id}/report`);

  const viewer = await getViewer();
  const token = await getGuestToken(attempt.id);
  if (!ownsAttempt(attempt, viewer.userId, token)) redirect(`/opam/${setId}`);

  const config = await getSetConfig(setId).catch(() => null);
  if (!config?.is_enabled) redirect(`/opam/${setId}`);

  const questions = await getPublicQuestions(setId);
  if (questions.length === 0) redirect(`/opam/${setId}`);

  return (
    <ExamRunner
      setId={setId}
      attemptId={attempt.id}
      questions={questions}
      perQuestionSecs={config.per_question_secs}
      totalSeconds={config.total_seconds}
      allowBackNav={config.allow_back_nav}
      initialAnswers={attempt.answers}
      initialSpent={attempt.spent}
      initialLocked={attempt.locked}
      initialFlagged={attempt.flagged}
    />
  );
}
