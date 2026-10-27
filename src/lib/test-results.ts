import { createClient } from "@/lib/supabase/server";
import type { TestResultSummary } from "@/data/csss-tests";

type AttemptRow = {
  test_id: string;
  score: number;
  max_score: number;
  created_at: string;
};

type RankRow = {
  test_id: string;
  rank_position: number;
  total_participants: number;
};

export async function getMyTestResults(
  testIds: string[],
): Promise<Record<string, TestResultSummary>> {
  if (testIds.length === 0) return {};

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims?.sub) return {};

  const { data: attempts } = await supabase
    .from("test_attempts")
    .select("test_id, score, max_score, created_at")
    .in("test_id", testIds)
    .order("created_at", { ascending: true });

  if (!attempts || attempts.length === 0) return {};

  const grouped = new Map<
    string,
    { count: number; latest: AttemptRow }
  >();
  for (const row of attempts as AttemptRow[]) {
    const existing = grouped.get(row.test_id);
    if (existing) {
      existing.count += 1;
      existing.latest = row;
    } else {
      grouped.set(row.test_id, { count: 1, latest: row });
    }
  }

  const { data: ranks } = await supabase.rpc("get_test_ranks", {
    p_test_ids: testIds,
  });
  const rankMap = new Map<string, RankRow>();
  for (const row of (ranks ?? []) as RankRow[]) {
    rankMap.set(row.test_id, row);
  }

  const results: Record<string, TestResultSummary> = {};
  for (const [testId, info] of grouped) {
    const rank = rankMap.get(testId);
    results[testId] = {
      testId,
      attemptCount: info.count,
      score: info.latest.score,
      maxScore: info.latest.max_score,
      attemptedAt: info.latest.created_at,
      rank: rank?.rank_position ?? null,
      total: rank?.total_participants ?? null,
    };
  }

  return results;
}
