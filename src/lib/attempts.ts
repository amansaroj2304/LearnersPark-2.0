"use server";

import { createClient } from "@/lib/supabase/server";
import { getCsssTest } from "@/data/csss-tests";
import { scoreAttempt, type TestScore } from "@/lib/csss-scoring";
import {
  validateAnswers,
  validateTiming,
  type AnswerMap,
} from "@/lib/attempt-validation";

export type SubmitAttemptInput = {
  testId: string;
  answers: AnswerMap;
  startedAt: number;
  submittedAt: number;
};

export type SubmitAttemptErrorCode =
  | "unauthenticated"
  | "unknown_test"
  | "invalid_answers"
  | "invalid_timing"
  | "already_attempted"
  | "save_failed";

export type SubmitAttemptResult = {
  error: string | null;
  code?: SubmitAttemptErrorCode;
  score?: TestScore;
};

/**
 * Scores and stores an attempt on the server.
 *
 * The browser only sends the answers and timestamps. Marks, accuracy and
 * section totals are always recomputed here from the authoritative question
 * bank, so a tampered client cannot write a score it did not earn.
 */
export async function submitAttempt(
  input: SubmitAttemptInput,
): Promise<SubmitAttemptResult> {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) {
    return { error: "Please sign in again to save your attempt.", code: "unauthenticated" };
  }

  const test = getCsssTest(input.testId);
  if (test.id !== input.testId) {
    return { error: "This test is not available.", code: "unknown_test" };
  }

  const answers = validateAnswers(test.questions, input.answers);
  if (!answers.ok) {
    return {
      error: "Some answers could not be read. Please try submitting again.",
      code: "invalid_answers",
    };
  }

  const timingError = validateTiming(
    input.startedAt,
    input.submittedAt,
    test.durationMinutes,
  );
  if (timingError) {
    return { error: timingError, code: "invalid_timing" };
  }

  const { count, error: lookupError } = await supabase
    .from("test_attempts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("test_id", test.id);

  if (lookupError) {
    return {
      error: "We couldn't check your attempt history. Please try again.",
      code: "save_failed",
    };
  }
  if ((count ?? 0) > 0) {
    return {
      error: "You have already attempted this test. Each test can be written only once.",
      code: "already_attempted",
    };
  }

  const score = scoreAttempt(
    test.questions,
    answers.answers,
    test.marksCorrect,
    test.marksWrong,
  );

  const { error } = await supabase.from("test_attempts").insert({
    user_id: userId,
    test_id: test.id,
    test_title: test.title,
    score: score.score,
    max_score: score.maxScore,
    correct: score.correct,
    wrong: score.wrong,
    attempted: score.attempted,
    accuracy: score.accuracy,
    sections: score.sections,
  });

  if (error) {
    return {
      error: "We couldn't save your attempt. Please try again.",
      code: "save_failed",
    };
  }

  return { error: null, score };
}

/** Whether the signed-in student has already written this test. */
export async function hasAttemptedTest(testId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) return false;

  const { count } = await supabase
    .from("test_attempts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("test_id", testId);

  return (count ?? 0) > 0;
}
