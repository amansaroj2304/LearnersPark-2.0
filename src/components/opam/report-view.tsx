import type { OpamReport } from "@/lib/opam/grade";
import type { QRow } from "@/lib/opam/types";
import { OLQ_NAMES, OPAM_DISCLAIMER } from "@/lib/opam/types";

const LETTERS = ["A", "B", "C", "D"];

function Stat({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-xl border border-ink/10 bg-white p-4">
      <p className="text-[10px] font-bold tracking-[0.12em] text-ink/45 uppercase">{label}</p>
      <p className="mt-1 text-2xl font-extrabold tabular-nums text-ink">{value}</p>
      {hint && <p className="text-xs text-ink/50">{hint}</p>}
    </div>
  );
}

export function ReportView({
  report,
  questions,
  autoSubmitted,
  finishedAt,
  setTitle,
}: {
  report: OpamReport;
  questions: QRow[];
  autoSubmitted: boolean;
  finishedAt: string | null;
  setTitle: string;
}) {
  const sjtQuestions = questions.filter((q) => q.part === 3);
  const byQnum = new Map(sjtQuestions.map((q) => [q.qnum, q]));
  const weakRows = report.sjt.rows.filter((r) => r.band === "weak" || r.band === "unanswered");
  const strengths = report.olq.filter((o) => o.value >= 70).slice(0, 4);
  const growth = report.olq.filter((o) => o.total > 0 && o.value < 55).slice(0, 4);
  const fcTop = Object.entries(report.fc.emphasis)
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const fcMax = Math.max(1, ...fcTop.map(([, n]) => n));

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="text-xs font-bold tracking-[0.16em] text-crimson uppercase">Practice report</p>
        <h1 className="mt-2 text-[clamp(1.6rem,3.5vw,2.3rem)] font-extrabold tracking-[-0.02em] text-ink">
          {setTitle}
        </h1>
        <p className="mt-1 text-sm text-ink/55">
          {finishedAt ? new Date(finishedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : ""}
          {autoSubmitted ? " · auto-submitted at the time ceiling" : ""}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Stat label="Attempted" value={report.attempted} hint={`of ${report.total}`} />
          <Stat label="Unanswered" value={report.unanswered} />
          <Stat label="Time taken" value={`${Math.floor(report.lat.n ? 0 : 0) + Math.round((report.lat.avg * report.lat.n) / 60)} min`} hint="sum of per-question time" />
          <Stat label="Avg response" value={`${report.lat.avg}s`} hint={`median ${report.lat.median}s`} />
          <Stat label="Consistency" value={report.cons.checked ? `${report.cons.rate}%` : "—"} hint={`${report.cons.consistent}/${report.cons.checked} pairs`} />
          <Stat label="Judgement index" value={`${report.sjt.rate}%`} hint={`${report.sjt.points}/${report.sjt.max} points`} />
        </div>
      </header>

      <section className="rounded-2xl border border-gold/40 bg-gold/10 p-5">
        <h2 className="text-sm font-bold tracking-[0.12em] text-[#6b520f] uppercase">Read this first</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#5c4a12]">{OPAM_DISCLAIMER}</p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-ink">Section-wise performance</h2>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-ink/10 bg-white">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-ink/10 bg-[#f7f8f1] text-left text-xs font-bold uppercase tracking-[0.08em] text-ink/50">
                <th className="px-4 py-3">Section</th>
                <th className="px-4 py-3">Format</th>
                <th className="px-4 py-3">Answered</th>
                <th className="px-4 py-3">Of</th>
                <th className="px-4 py-3">Completion</th>
              </tr>
            </thead>
            <tbody>
              {([1, 2, 3] as const).map((part) => {
                const p = report.perPart[part];
                return (
                  <tr key={part} className="border-b border-ink/6 last:border-b-0">
                    <td className="px-4 py-3 font-semibold text-ink">
                      {part === 1 ? "Personality profiling" : part === 2 ? "Forced choice" : "Situational judgement"}
                    </td>
                    <td className="px-4 py-3 text-ink/60">
                      {part === 1 ? "Agree / Disagree" : part === 2 ? "A / B" : "A–D"}
                    </td>
                    <td className="px-4 py-3">{p.answered}</td>
                    <td className="px-4 py-3">{p.total}</td>
                    <td className="px-4 py-3">{p.total ? Math.round((p.answered / p.total) * 100) : 0}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-ink/50">
          Parts 1 and 2 have no answer key, so no score is shown for them. Only situational judgement
          is marked.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-ink">Response consistency</h2>
        <div className="mt-3 rounded-2xl border border-ink/10 bg-white p-5">
          <div className="flex items-center gap-4">
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-ink/8">
              <div className="h-full rounded-full bg-[#2f9e5b]" style={{ width: `${report.cons.rate}%` }} />
            </div>
            <span className="text-sm font-bold tabular-nums text-ink">{report.cons.rate}%</span>
          </div>
          <p className="mt-3 text-sm text-ink/65">
            {report.cons.checked === 0
              ? "Not enough paired answers to compare."
              : report.cons.rate >= 70
                ? "Your answers on matched statement pairs usually agreed with each other."
                : report.cons.rate >= 55
                  ? "Your answers on matched pairs were mixed — worth noticing which topics you answered differently on two readings."
                  : "Several matched pairs pulled in opposite directions. This measures consistency, not honesty: it simply shows where your own reading of yourself shifted."}
          </p>
          {report.cons.flaggedPairs.length > 0 && (
            <details className="mt-3">
              <summary className="cursor-pointer text-sm font-semibold text-crimson">
                Show the {report.cons.flaggedPairs.length} contradicting pair(s)
              </summary>
              <ul className="mt-3 flex flex-col gap-3 text-sm text-ink/70">
                {report.cons.flaggedPairs.map((pair, i) => (
                  <li key={i} className="rounded-lg bg-ink/4 p-3">
                    <p>“{pair.positive}”</p>
                    <p className="mt-1 text-ink/50">…and, on the reversed wording:</p>
                    <p>“{pair.reversed}”</p>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-ink">Situational judgement</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Most constructive" value={report.sjt.best} />
          <Stat label="Defensible" value={report.sjt.defensible} />
          <Stat label="Weakest" value={report.sjt.weak} />
          <Stat label="Index" value={`${report.sjt.rate}%`} hint={`${report.sjt.points}/${report.sjt.max}`} />
        </div>

        {weakRows.length > 0 && (
          <div className="mt-4 flex flex-col gap-3">
            {weakRows.map((row) => {
              const question = byQnum.get(row.qnum);
              if (!question) return null;
              return (
                <div key={row.qnum} className="rounded-xl border border-ink/10 bg-white p-4 text-sm">
                  <p className="font-semibold text-ink">Q{row.qnum}</p>
                  <p className="mt-1 text-ink/70">{question.text}</p>
                  <p className="mt-2 text-ink/60">
                    {row.pick === null
                      ? "You skipped this one."
                      : `You chose ${LETTERS[row.pick]}: ${question.options?.[row.pick] ?? ""}`}
                  </p>
                  <p className="mt-1 text-ink/60">
                    Most constructive: {question.bestIndex !== null ? `${LETTERS[question.bestIndex]} — ${question.options?.[question.bestIndex] ?? ""}` : "—"}
                  </p>
                  {question.bestIndex !== null && question.rationales?.[question.bestIndex] && (
                    <p className="mt-1 text-ink/50">Why: {question.rationales[question.bestIndex]}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <details className="mt-4 rounded-2xl border border-ink/10 bg-white p-4">
          <summary className="cursor-pointer text-sm font-semibold text-crimson">
            Review the reasoning for all {sjtQuestions.length} scenarios
          </summary>
          <div className="mt-4 flex flex-col gap-4">
            {sjtQuestions.map((question) => (
              <div key={question.id} className="text-sm">
                <p className="font-semibold text-ink">Q{question.qnum}. {question.text}</p>
                <ul className="mt-2 flex flex-col gap-1">
                  {(question.options ?? []).map((opt, i) => (
                    <li key={i} className={i === question.bestIndex ? "font-semibold text-[#256e42]" : "text-ink/60"}>
                      {LETTERS[i]}. {opt}
                      {question.rationales?.[i] && <span className="block text-xs text-ink/45">{question.rationales[i]}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </details>
      </section>

      <section>
        <h2 className="text-lg font-bold text-ink">OLQ-wise behavioural observations</h2>
        <p className="mt-1 text-sm text-ink/55">From the 60 personality statements. Descriptive, not a score.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {report.olq.map((o) => (
            <div key={o.code} className="rounded-xl border border-ink/10 bg-white p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-ink">{o.name}</p>
                <span className={`rounded px-2 py-0.5 text-[11px] font-semibold ${
                  o.bandCls === "good" ? "bg-[#2f9e5b]/12 text-[#256e42]" : o.bandCls === "mid" ? "bg-gold/20 text-[#7a5c10]" : "bg-ink/8 text-ink/55"
                }`}>{o.band}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink/8">
                <div className="h-full rounded-full bg-crimson" style={{ width: `${o.value}%` }} />
              </div>
              <p className="mt-1 text-xs text-ink/45">{o.keyed} of {o.total} keyed responses · {o.value}%</p>
              <p className="mt-2 text-sm text-ink/65">{o.value >= 70 ? o.strength : o.growth}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-ink/10 bg-white p-5">
          <h2 className="text-sm font-bold tracking-[0.12em] text-ink/45 uppercase">Where you leaned</h2>
          {fcTop.length === 0 ? (
            <p className="mt-2 text-sm text-ink/60">No forced-choice answers recorded.</p>
          ) : (
            <ul className="mt-3 flex flex-col gap-2">
              {fcTop.map(([code, n]) => (
                <li key={code} className="text-sm">
                  <div className="flex justify-between"><span className="text-ink">{OLQ_NAMES[code] ?? code}</span><span className="tabular-nums text-ink/60">{n}</span></div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ink/8">
                    <div className="h-full rounded-full bg-ink/50" style={{ width: `${(n / fcMax) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-xs text-ink/50">
            Forced-choice answers ({report.fc.aCount} A · {report.fc.bCount} B) are not scored — there is
            no key. They show which behaviours you protect under time pressure.
          </p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-white p-5">
          <h2 className="text-sm font-bold tracking-[0.12em] text-ink/45 uppercase">Answering style</h2>
          <dl className="mt-3 flex flex-col gap-2 text-sm">
            <div className="flex justify-between"><dt className="text-ink/55">Average per answer</dt><dd className="font-semibold text-ink">{report.lat.avg}s</dd></div>
            <div className="flex justify-between"><dt className="text-ink/55">Median</dt><dd className="font-semibold text-ink">{report.lat.median}s</dd></div>
            <div className="flex justify-between"><dt className="text-ink/55">Answered in ≤2 s</dt><dd className="font-semibold text-ink">{report.lat.rapid}</dd></div>
            <div className="flex justify-between"><dt className="text-ink/55">Answered in ≥13 s</dt><dd className="font-semibold text-ink">{report.lat.slow}</dd></div>
            <div className="flex justify-between"><dt className="text-ink/55">Agreed with statements</dt><dd className="font-semibold text-ink">{report.agree.rate}%</dd></div>
          </dl>
          <p className="mt-3 text-xs leading-relaxed text-ink/50">
            Response latency here is recorded only to help you notice your own answering style. It is
            not a lie detector, and nothing in this report should be read as deception analysis — that
            claim would not survive scrutiny.
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-ink/10 bg-white p-5">
          <h2 className="text-sm font-bold tracking-[0.12em] text-ink/45 uppercase">Strengths you showed</h2>
          {strengths.length === 0 ? (
            <p className="mt-2 text-sm text-ink/60">No trait reached the consistent band in this attempt.</p>
          ) : (
            <ul className="mt-2 flex flex-col gap-1 text-sm text-ink/70">
              {strengths.map((o) => <li key={o.code}><span className="font-semibold text-ink">{o.name}</span> — {o.value}%</li>)}
            </ul>
          )}
        </div>
        <div className="rounded-2xl border border-ink/10 bg-white p-5">
          <h2 className="text-sm font-bold tracking-[0.12em] text-ink/45 uppercase">Thinner areas</h2>
          {growth.length === 0 ? (
            <p className="mt-2 text-sm text-ink/60">No trait fell into the rarely-indicated band.</p>
          ) : (
            <ul className="mt-2 flex flex-col gap-2 text-sm text-ink/70">
              {growth.map((o) => <li key={o.code}><span className="font-semibold text-ink">{o.name}</span> — {o.growth}</li>)}
            </ul>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-ink/10 bg-white p-5">
        <h2 className="text-sm font-bold tracking-[0.12em] text-ink/45 uppercase">Method, and its limits</h2>
        <ul className="mt-2 flex flex-col gap-2 text-sm text-ink/65">
          <li>Part 1 is keyed: 30 items are positively worded and 30 reversed, so a blanket “Agree” scores mid-band everywhere.</li>
          <li>Part 2 has no key. It records preference, not correctness.</li>
          <li>Part 3 is marked against the most constructive response and the defensible alternatives.</li>
          <li>Consistency compares matched pairs; it is not a deception measure.</li>
          <li>It cannot see you. It sees twelve minutes of button presses.</li>
        </ul>
      </section>
    </div>
  );
}
