"use server";

import { createClient } from "@/lib/supabase/server";
import type { TestScore } from "@/lib/csss-scoring";

export type SaveAttemptInput = {
  testId: string;
  testTitle: string;
  score: TestScore;
};

export async function saveAttempt(input: SaveAttemptInput) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (!userId) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase.from("test_attempts").insert({
    user_id: userId,
    test_id: input.testId,
    test_title: input.testTitle,
    score: input.score.score,
    max_score: input.score.maxScore,
    correct: input.score.correct,
    wrong: input.score.wrong,
    attempted: input.score.attempted,
    accuracy: input.score.accuracy,
    sections: input.score.sections,
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
