import type { CsssQuestion } from "@/data/csss-questions";
import { csssQuestions, csssTestMeta } from "@/data/csss-questions";
import { csssTest2Meta, csssTest2Questions } from "@/data/csss-test-2";

export type CsssTestDefinition = {
  id: string;
  title: string;
  durationMinutes: number;
  marksCorrect: number;
  marksWrong: number;
  questions: (CsssQuestion | null)[];
};

export type TestResultSummary = {
  testId: string;
  attemptCount: number;
  score: number;
  maxScore: number;
  attemptedAt: string;
  rank: number | null;
  total: number | null;
};

export const defaultCsssTestId = "mock-01";

export const csssTests: Record<string, CsssTestDefinition> = {
  "mock-01": {
    id: "mock-01",
    ...csssTestMeta,
    questions: csssQuestions,
  },
  "mock-02": {
    id: "mock-02",
    ...csssTest2Meta,
    questions: csssTest2Questions,
  },
};

export function getCsssTest(id?: string): CsssTestDefinition {
  if (id && csssTests[id]) {
    return csssTests[id];
  }
  return csssTests[defaultCsssTestId];
}
