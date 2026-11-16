import { OLQ, type Answer, type QRow } from "./types";

const pct = (n: number, d: number) => (d ? Math.round((n / d) * 1000) / 10 : 0);

/** Part 1 polarity. Agree is NOT better than Disagree — reverse items invert. */
export function keyedPositive(q: QRow, ans?: string | null): boolean | null {
  if (!ans) return null;
  return q.keyed === "P" ? ans === "A" : ans === "D";
}

export function band(v: number) {
  if (v >= 85) return { label: "Strongly indicated", cls: "good" };
  if (v >= 70) return { label: "Consistently indicated", cls: "good" };
  if (v >= 55) return { label: "Mixed", cls: "mid" };
  return { label: "Rarely indicated", cls: "low" };
}

export interface GradeInput {
  setId: number;
  questions: QRow[];
  answers: Record<string, Answer>;
  spent: Record<string, number>;
  flagged: Record<string, boolean>;
}

export function gradeAttempt({ setId, questions, answers, spent, flagged }: GradeInput) {
  const qs = questions
    .filter((q) => q.setId === setId)
    .sort((a, b) => a.qnum - b.qnum);

  /* ---- 1. completion ---- */
  const perPart: Record<number, { answered: number; total: number }> = {
    1: { answered: 0, total: 0 },
    2: { answered: 0, total: 0 },
    3: { answered: 0, total: 0 },
  };
  let attempted = 0;
  for (const q of qs) {
    perPart[q.part].total++;
    if (answers[q.id]) {
      attempted++;
      perPart[q.part].answered++;
    }
  }

  /* ---- 2. OLQ observations (Part 1 only — the only keyed section) ---- */
  const acc: Record<string, { keyed: number; total: number }> = {};
  for (const o of OLQ) acc[o[0]] = { keyed: 0, total: 0 };
  for (const q of qs) {
    if (q.part !== 1) continue;
    const kp = keyedPositive(q, answers[q.id]);
    for (const code of q.olq) {
      if (!acc[code]) continue;
      acc[code].total++;
      if (kp === true) acc[code].keyed++;
    }
  }
  const olq = OLQ.map((o) => {
    const a = acc[o[0]];
    const value = pct(a.keyed, a.total);
    return {
      code: o[0],
      name: o[1],
      desc: o[2],
      strength: o[3],
      growth: o[4],
      keyed: a.keyed,
      total: a.total,
      value,
      band: band(value).label,
      bandCls: band(value).cls,
    };
  });

  /* ---- 3. consistency across reversed pairs ---- */
  const byId = new Map(qs.map((q) => [q.id, q]));
  const seen = new Set<string>();
  let checked = 0;
  let consistent = 0;
  const flaggedPairs: { positive: string; reversed: string }[] = [];
  for (const q of qs) {
    if (q.part !== 1 || !q.pair || seen.has(q.id)) continue;
    const twin = byId.get(q.pair);
    if (!twin) continue;
    seen.add(q.id);
    seen.add(twin.id);
    if (!answers[q.id] || !answers[twin.id]) continue;
    checked++;
    const pos = q.keyed === "P" ? q : twin;
    const neg = q.keyed === "P" ? twin : q;
    if (keyedPositive(pos, answers[pos.id]) === keyedPositive(neg, answers[neg.id])) {
      consistent++;
    } else {
      flaggedPairs.push({ positive: pos.text, reversed: neg.text });
    }
  }
  const cons = { checked, consistent, rate: pct(consistent, checked), flaggedPairs };

  /* ---- 4. situational judgement ---- */
  let best = 0;
  let defensible = 0;
  let weak = 0;
  let unansweredSjt = 0;
  const sjtRows: { qnum: number; pick: number | null; band: string; pts: number }[] = [];
  for (const q of qs) {
    if (q.part !== 3) continue;
    const a = answers[q.id];
    if (!a) {
      unansweredSjt++;
      sjtRows.push({ qnum: q.qnum, pick: null, band: "unanswered", pts: 0 });
      continue;
    }
    const idx = "ABCD".indexOf(a);
    let b: string;
    let pts: number;
    if (idx === q.bestIndex) {
      best++;
      b = "best";
      pts = 2;
    } else if ((q.acceptable ?? []).includes(idx)) {
      defensible++;
      b = "defensible";
      pts = 1;
    } else {
      weak++;
      b = "weak";
      pts = 0;
    }
    sjtRows.push({ qnum: q.qnum, pick: idx, band: b, pts });
  }
  const sjtMax = qs.filter((q) => q.part === 3).length * 2;
  const sjt = {
    best,
    defensible,
    weak,
    unanswered: unansweredSjt,
    points: best * 2 + defensible,
    max: sjtMax,
    rate: pct(best * 2 + defensible, sjtMax),
    rows: sjtRows,
  };

  /* ---- 5. forced-choice preference (NOT scored — no key exists) ---- */
  const emphasis: Record<string, number> = Object.fromEntries(OLQ.map((o) => [o[0], 0]));
  let aCount = 0;
  let bCount = 0;
  let fcAnswered = 0;
  for (const q of qs) {
    if (q.part !== 2) continue;
    const a = answers[q.id];
    if (!a) continue;
    fcAnswered++;
    if (a === "A") {
      aCount++;
      q.olqA.forEach((c) => {
        if (emphasis[c] !== undefined) emphasis[c]++;
      });
    } else {
      bCount++;
      q.olqB.forEach((c) => {
        if (emphasis[c] !== undefined) emphasis[c]++;
      });
    }
  }

  /* ---- 6. latency (recorded, never scored as a trait) ---- */
  const times = Object.keys(answers)
    .filter((id) => typeof spent[id] === "number" && answers[id])
    .map((id) => spent[id]);
  const sorted = [...times].sort((x, y) => x - y);
  const median = sorted.length
    ? sorted.length % 2
      ? sorted[(sorted.length - 1) / 2]
      : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : 0;
  const lat = {
    n: times.length,
    avg: times.length ? Math.round((times.reduce((x, y) => x + y, 0) / times.length) * 10) / 10 : 0,
    median,
    rapid: times.filter((t) => t <= 2).length,
    slow: times.filter((t) => t >= 13).length,
  };

  /* ---- 7. agree rate + metadata ---- */
  let agree = 0;
  let p1n = 0;
  for (const q of qs) {
    if (q.part !== 1 || !answers[q.id]) continue;
    p1n++;
    if (answers[q.id] === "A") agree++;
  }

  return {
    version: 1,
    setId,
    gradedAt: new Date().toISOString(),
    total: qs.length,
    attempted,
    unanswered: qs.length - attempted,
    completion: pct(attempted, qs.length),
    perPart,
    olq,
    cons,
    sjt,
    fc: { answered: fcAnswered, aCount, bCount, emphasis },
    lat,
    agree: { agree, n: p1n, rate: pct(agree, p1n) },
    flaggedCount: Object.keys(flagged ?? {}).filter((k) => flagged[k]).length,
  };
}

export type OpamReport = ReturnType<typeof gradeAttempt>;
