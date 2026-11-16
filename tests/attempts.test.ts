import test from "node:test";
import assert from "node:assert/strict";
import { scoreAttempt } from "../src/lib/csss-scoring";
import { validateAnswers, validateTiming } from "../src/lib/attempt-validation";
import type { CsssQuestion } from "../src/data/csss-questions";

function question(id: number, answer: number, options = 4): CsssQuestion {
  return {
    id,
    prompt: `Question ${id}`,
    options: Array.from({ length: options }, (_, index) => `Option ${index}`),
    answer,
    explanation: "",
  };
}

const questions: (CsssQuestion | null)[] = [
  question(1, 0),
  question(2, 1),
  question(3, 2),
  null,
];

test("scores correct, wrong and unattempted answers with negative marking", () => {
  const score = scoreAttempt(questions, { 0: 0, 1: 0, 2: 2 }, 3, 1);
  assert.equal(score.attempted, 3);
  assert.equal(score.correct, 2);
  assert.equal(score.wrong, 1);
  assert.equal(score.score, 5); // 2*3 - 1*1
  assert.equal(score.maxScore, 12);
  assert.equal(score.accuracy, 67);
});

test("ignores answers to missing questions", () => {
  const score = scoreAttempt(questions, { 0: 0, 3: 1 }, 3, 1);
  assert.equal(score.attempted, 1);
  assert.equal(score.correct, 1);
  assert.equal(score.score, 3);
});

test("accepts a valid answer payload", () => {
  const result = validateAnswers(questions, { 0: 0, 1: 3, 2: 1 });
  assert.equal(result.ok, true);
  if (result.ok) assert.deepEqual(result.answers, { 0: 0, 1: 3, 2: 1 });
});

test("rejects out-of-range option indexes", () => {
  const result = validateAnswers(questions, { 0: 9 });
  assert.equal(result.ok, false);
});

test("rejects negative and fractional option indexes", () => {
  assert.equal(validateAnswers(questions, { 0: -1 }).ok, false);
  assert.equal(validateAnswers(questions, { 0: 1.5 }).ok, false);
});

test("rejects answers for questions that do not exist", () => {
  assert.equal(validateAnswers(questions, { 99: 0 }).ok, false);
  assert.equal(validateAnswers(questions, { 3: 0 }).ok, false);
});

test("rejects non-numeric keys and non-object payloads", () => {
  assert.equal(validateAnswers(questions, { abc: 0 }).ok, false);
  assert.equal(validateAnswers(questions, [0, 1]).ok, false);
  assert.equal(validateAnswers(questions, "0,1").ok, false);
  assert.equal(validateAnswers(questions, null).ok, false);
});

test("rejects more answers than questions", () => {
  const many = Object.fromEntries(
    Array.from({ length: 10 }, (_, index) => [index, 0]),
  );
  assert.equal(validateAnswers(questions, many).ok, false);
});

test("timing within duration plus grace is accepted", () => {
  const now = 1_700_000_000_000;
  assert.equal(validateTiming(now - 60_000, now, 10, now), null);
});

test("timing beyond duration plus grace is rejected", () => {
  const now = 1_700_000_000_000;
  assert.ok(validateTiming(now - 13 * 60_000, now, 10, now));
});

test("submission before start is rejected", () => {
  const now = 1_700_000_000_000;
  assert.ok(validateTiming(now, now - 1000, 10, now));
});
