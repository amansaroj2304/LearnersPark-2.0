import type { CsssQuestion } from "@/data/csss-questions";

export type AnswerMap = Record<number, number>;

/** Extra time allowed for network latency and clock skew before an attempt is rejected. */
export const DURATION_GRACE_SECONDS = 120;

export type AnswerValidation =
  | { ok: true; answers: AnswerMap }
  | { ok: false; reason: string };

/**
 * Validates a raw answer payload coming from the browser.
 * Only integer indexes that exist in the test, on questions that are present,
 * and option indexes that exist on that question are accepted.
 */
export function validateAnswers(
  questions: (CsssQuestion | null)[],
  raw: unknown,
): AnswerValidation {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    return { ok: false, reason: "Answers must be an object keyed by question number." };
  }

  const entries = Object.entries(raw as Record<string, unknown>);
  if (entries.length > questions.length) {
    return { ok: false, reason: "More answers than questions in this test." };
  }

  const answers: AnswerMap = {};
  for (const [key, value] of entries) {
    if (!/^\d+$/.test(key)) {
      return { ok: false, reason: "Answer keys must be whole question numbers." };
    }
    const index = Number(key);
    const question = questions[index];
    if (!question) {
      return { ok: false, reason: "Answer refers to a question that does not exist." };
    }
    if (typeof value !== "number" || !Number.isInteger(value)) {
      return { ok: false, reason: "Answer values must be whole option numbers." };
    }
    if (value < 0 || value >= question.options.length) {
      return { ok: false, reason: "Answer refers to an option that does not exist." };
    }
    answers[index] = value;
  }

  return { ok: true, answers };
}

/** Returns an error message when the reported attempt timing is not credible. */
export function validateTiming(
  startedAt: number,
  submittedAt: number,
  durationMinutes: number,
  now: number = Date.now(),
): string | null {
  if (!Number.isFinite(startedAt) || !Number.isFinite(submittedAt)) {
    return "Attempt timing is missing.";
  }
  if (submittedAt < startedAt) {
    return "Attempt timing is invalid.";
  }
  const elapsed = (submittedAt - startedAt) / 1000;
  const limit = durationMinutes * 60 + DURATION_GRACE_SECONDS;
  if (elapsed > limit) {
    return "This attempt took longer than the test duration.";
  }
  if (submittedAt > now + DURATION_GRACE_SECONDS * 1000) {
    return "Attempt timing is invalid.";
  }
  return null;
}
