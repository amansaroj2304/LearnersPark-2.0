import assert from "node:assert/strict";
import { test } from "node:test";
import { band, gradeAttempt, keyedPositive } from "../src/lib/opam/grade";
import type { QRow } from "../src/lib/opam/types";

function q(over: Partial<QRow> & { id: string; qnum: number }): QRow {
  return {
    setId: 1,
    part: 1,
    format: "agree",
    text: "t",
    keyed: "P",
    pair: null,
    optionA: null,
    optionB: null,
    options: null,
    bestIndex: null,
    acceptable: [],
    rationales: null,
    olq: [],
    olqA: [],
    olqB: [],
    ...over,
  };
}

test("agree keys a positive item; disagree keys a reverse item", () => {
  const pos = q({ id: "p", qnum: 1, keyed: "P" });
  const neg = q({ id: "n", qnum: 2, keyed: "N" });
  assert.equal(keyedPositive(pos, "A"), true);
  assert.equal(keyedPositive(pos, "D"), false);
  assert.equal(keyedPositive(neg, "A"), false);
  assert.equal(keyedPositive(neg, "D"), true);
  assert.equal(keyedPositive(pos, null), null);
});

test("consistent pair is not flagged; contradictory pair is", () => {
  const pos = q({ id: "p", qnum: 1, keyed: "P", pair: "n" });
  const neg = q({ id: "n", qnum: 2, keyed: "N", pair: "p" });
  const ok = gradeAttempt({
    setId: 1,
    questions: [pos, neg],
    answers: { p: "A", n: "D" },
    spent: {},
    flagged: {},
  });
  assert.equal(ok.cons.checked, 1);
  assert.equal(ok.cons.consistent, 1);
  assert.equal(ok.cons.flaggedPairs.length, 0);

  const bad = gradeAttempt({
    setId: 1,
    questions: [pos, neg],
    answers: { p: "A", n: "A" },
    spent: {},
    flagged: {},
  });
  assert.equal(bad.cons.consistent, 0);
  assert.equal(bad.cons.flaggedPairs.length, 1);
});

test("OLQ observations count only part 1 and only keyed-positive answers", () => {
  const a = q({ id: "a", qnum: 1, keyed: "P", olq: ["SR"] });
  const b = q({ id: "b", qnum: 2, keyed: "N", olq: ["SR"] });
  const report = gradeAttempt({
    setId: 1,
    questions: [a, b],
    answers: { a: "A", b: "A" }, // b is reverse: agreeing is not keyed positive
    spent: {},
    flagged: {},
  });
  const sr = report.olq.find((o) => o.code === "SR")!;
  assert.equal(sr.total, 2);
  assert.equal(sr.keyed, 1);
  assert.equal(sr.value, 50);
});

test("situational judgement scores best 2, defensible 1, weak 0", () => {
  const s1 = q({ id: "s1", qnum: 61, part: 3, format: "abcd", keyed: null, bestIndex: 1, acceptable: [0] });
  const s2 = q({ id: "s2", qnum: 62, part: 3, format: "abcd", keyed: null, bestIndex: 0, acceptable: [] });
  const s3 = q({ id: "s3", qnum: 63, part: 3, format: "abcd", keyed: null, bestIndex: 0, acceptable: [2] });
  const report = gradeAttempt({
    setId: 1,
    questions: [s1, s2, s3],
    answers: { s1: "B", s2: "D", s3: "C" },
    spent: {},
    flagged: {},
  });
  assert.equal(report.sjt.best, 1);
  assert.equal(report.sjt.defensible, 1);
  assert.equal(report.sjt.weak, 1);
  assert.equal(report.sjt.points, 3);
  assert.equal(report.sjt.max, 6);
  assert.equal(report.sjt.rate, 50);
});

test("forced choice is tallied but never scored", () => {
  const f = q({
    id: "f",
    qnum: 61,
    part: 2,
    format: "ab",
    keyed: null,
    optionA: "a",
    optionB: "b",
    olqA: ["DT"],
    olqB: ["SD"],
  });
  const report = gradeAttempt({
    setId: 1,
    questions: [f],
    answers: { f: "B" },
    spent: { f: 4 },
    flagged: {},
  });
  assert.equal(report.fc.aCount, 0);
  assert.equal(report.fc.bCount, 1);
  assert.equal(report.fc.emphasis.SD, 1);
  assert.equal("score" in report.fc, false);
});

test("latency statistics use answered questions only", () => {
  const q1 = q({ id: "x", qnum: 1 });
  const q2 = q({ id: "y", qnum: 2 });
  const report = gradeAttempt({
    setId: 1,
    questions: [q1, q2],
    answers: { x: "A" },
    spent: { x: 2, y: 9 },
    flagged: {},
  });
  assert.equal(report.lat.n, 1);
  assert.equal(report.lat.avg, 2);
  assert.equal(report.lat.rapid, 1);
});

test("completion and per-part totals are correct", () => {
  const questions = [
    q({ id: "a", qnum: 1 }),
    q({ id: "b", qnum: 2 }),
    q({ id: "c", qnum: 61, part: 2, format: "ab", keyed: null }),
  ];
  const report = gradeAttempt({
    setId: 1,
    questions,
    answers: { a: "A" },
    spent: {},
    flagged: { b: true },
  });
  assert.equal(report.total, 3);
  assert.equal(report.attempted, 1);
  assert.equal(report.unanswered, 2);
  assert.equal(report.completion, 33.3);
  assert.equal(report.perPart[2].total, 1);
  assert.equal(report.flaggedCount, 1);
});

test("bands match the documented thresholds", () => {
  assert.equal(band(85).label, "Strongly indicated");
  assert.equal(band(70).label, "Consistently indicated");
  assert.equal(band(55).label, "Mixed");
  assert.equal(band(54.9).label, "Rarely indicated");
});

test("report contains no suitability verdict", () => {
  const report = gradeAttempt({
    setId: 1,
    questions: [q({ id: "a", qnum: 1 })],
    answers: { a: "A" },
    spent: {},
    flagged: {},
  });
  const text = JSON.stringify(report).toLowerCase();
  for (const word of ["suitable", "unsuitable", "recommended", "selected", "rejected"]) {
    assert.equal(text.includes(word), false, `report leaks "${word}"`);
  }
});
