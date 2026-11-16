import { randomUUID } from "node:crypto";
import { getServiceClient } from "@/lib/supabase/service";
import { gradeAttempt, type OpamReport } from "./grade";
import type { Answer, PublicQuestion, QRow } from "./types";

export type SetConfig = {
  set_id: number;
  title: string;
  subtitle: string;
  is_enabled: boolean;
  per_question_secs: number;
  total_seconds: number;
  allow_back_nav: boolean;
  show_report_to_user: boolean;
};

export type AttemptRow = {
  id: string;
  set_id: number;
  user_id: string | null;
  guest_token: string | null;
  status: "in_progress" | "submitted" | "auto_submitted" | "abandoned";
  started_at: string;
  finished_at: string | null;
  elapsed_secs: number;
  answers: Record<string, Answer>;
  spent: Record<string, number>;
  locked: Record<string, boolean>;
  flagged: Record<string, boolean>;
  report: OpamReport | null;
  ip_hash: string | null;
  user_agent: string | null;
};

function db() {
  const client = getServiceClient();
  if (!client) throw new Error("OPAM is not configured: SUPABASE_SERVICE_ROLE_KEY is missing.");
  return client;
}

export async function getSetConfigs(): Promise<SetConfig[]> {
  const { data } = await db().from("opam_set_config").select("*").order("set_id");
  return (data ?? []) as SetConfig[];
}

export async function getSetConfig(setId: number): Promise<SetConfig | null> {
  const { data } = await db().from("opam_set_config").select("*").eq("set_id", setId).maybeSingle();
  return (data as SetConfig) ?? null;
}

export async function getPublicQuestions(setId: number): Promise<PublicQuestion[]> {
  const { data } = await db()
    .from("opam_questions")
    .select("id, part, qnum, format, text, option_a, option_b, options")
    .eq("set_id", setId)
    .eq("is_active", true)
    .order("qnum");
  return (data ?? []).map((r) => ({
    id: r.id as string,
    part: r.part as 1 | 2 | 3,
    qnum: r.qnum as number,
    format: r.format as PublicQuestion["format"],
    text: r.text as string,
    optionA: (r.option_a as string) ?? null,
    optionB: (r.option_b as string) ?? null,
    options: (r.options as string[]) ?? null,
  }));
}

export async function getFullQuestions(setId: number): Promise<QRow[]> {
  const { data } = await db()
    .from("opam_questions")
    .select("*")
    .eq("set_id", setId)
    .eq("is_active", true)
    .order("qnum");
  return (data ?? []).map((r) => ({
    id: r.id as string,
    setId: r.set_id as number,
    part: r.part as 1 | 2 | 3,
    qnum: r.qnum as number,
    format: r.format as QRow["format"],
    text: r.text as string,
    keyed: (r.keyed as "P" | "N") ?? null,
    pair: (r.pair as string) ?? null,
    optionA: (r.option_a as string) ?? null,
    optionB: (r.option_b as string) ?? null,
    options: (r.options as string[]) ?? null,
    bestIndex: (r.best_index as number) ?? null,
    acceptable: (r.acceptable as number[]) ?? [],
    rationales: (r.rationales as string[]) ?? null,
    olq: (r.olq as string[]) ?? [],
    olqA: (r.olq_a as string[]) ?? [],
    olqB: (r.olq_b as string[]) ?? [],
  }));
}

export async function createAttempt(input: {
  setId: number;
  userId: string | null;
  ipHash: string | null;
  userAgent: string | null;
}) {
  const guestToken = input.userId ? null : randomUUID();
  const { data, error } = await db()
    .from("opam_attempts")
    .insert({
      set_id: input.setId,
      user_id: input.userId,
      guest_token: guestToken,
      ip_hash: input.ipHash,
      user_agent: input.userAgent,
    })
    .select("id")
    .single();
  if (error) throw error;
  return { id: data.id as string, guestToken };
}

export async function getAttempt(id: string): Promise<AttemptRow | null> {
  const { data } = await db().from("opam_attempts").select("*").eq("id", id).maybeSingle();
  return (data as AttemptRow) ?? null;
}

export async function saveAnswer(input: {
  attemptId: string;
  questionId: string;
  answer: Answer;
  spent: number;
}) {
  const attempt = await getAttempt(input.attemptId);
  if (!attempt) return { error: "not_found" as const };
  if (attempt.status !== "in_progress") return { error: "closed" as const };
  const answers = { ...attempt.answers, [input.questionId]: input.answer };
  const spent = { ...attempt.spent, [input.questionId]: input.spent };
  await db().from("opam_attempts").update({ answers, spent }).eq("id", input.attemptId);
  return { ok: true as const };
}

export async function submitAttempt(input: {
  attemptId: string;
  answers: Record<string, Answer>;
  spent: Record<string, number>;
  locked: Record<string, boolean>;
  flagged: Record<string, boolean>;
  mode: "manual" | "auto";
}) {
  const attempt = await getAttempt(input.attemptId);
  if (!attempt) return { error: "not_found" as const };
  if (attempt.status !== "in_progress") return { ok: true as const, alreadyGraded: true as const };

  const questions = await getFullQuestions(attempt.set_id);
  const report = gradeAttempt({
    setId: attempt.set_id,
    questions,
    answers: input.answers,
    spent: input.spent,
    flagged: input.flagged,
  });
  const elapsedSecs = Object.values(input.spent).reduce((a, b) => a + b, 0);

  await db()
    .from("opam_attempts")
    .update({
      status: input.mode === "auto" ? "auto_submitted" : "submitted",
      finished_at: new Date().toISOString(),
      elapsed_secs: elapsedSecs,
      answers: input.answers,
      spent: input.spent,
      locked: input.locked,
      flagged: input.flagged,
      report,
    })
    .eq("id", input.attemptId)
    .eq("status", "in_progress");
  return { ok: true as const };
}

/** Ownership: signed-in owner, guest cookie holder, or an active administrator. */
export function ownsAttempt(attempt: AttemptRow, userId: string | null, token: string | null) {
  if (attempt.user_id && attempt.user_id === userId) return true;
  if (!attempt.user_id && attempt.guest_token && attempt.guest_token === token) return true;
  return false;
}

export async function listAttempts(filters: { setId?: number; status?: string; limit?: number }) {
  let query = db()
    .from("opam_attempts")
    .select("id, set_id, user_id, status, started_at, finished_at, elapsed_secs, answers, report")
    .order("started_at", { ascending: false })
    .limit(filters.limit ?? 50);
  if (filters.setId) query = query.eq("set_id", filters.setId);
  if (filters.status && filters.status !== "all") query = query.eq("status", filters.status);
  const { data } = await query;
  return (data ?? []) as (Pick<
    AttemptRow,
    "id" | "set_id" | "user_id" | "status" | "started_at" | "finished_at" | "elapsed_secs"
  > & { answers: Record<string, Answer>; report: OpamReport | null })[];
}

export async function attemptStats() {
  const client = db();
  const since = new Date(Date.now() - 86_400_000).toISOString();
  const [questions, today, completions, open, all] = await Promise.all([
    client.from("opam_questions").select("set_id, part", { count: "exact", head: false }).eq("is_active", true),
    client.from("opam_attempts").select("id", { count: "exact", head: true }).gte("started_at", since),
    client
      .from("opam_attempts")
      .select("id", { count: "exact", head: true })
      .in("status", ["submitted", "auto_submitted"]),
    client.from("opam_attempts").select("id", { count: "exact", head: true }).eq("status", "in_progress"),
    client.from("opam_attempts").select("report").not("report", "is", null).limit(500),
  ]);
  const rows = (questions.data ?? []) as { set_id: number; part: number }[];
  const byPart: Record<string, number> = {};
  for (const row of rows) {
    const key = `${row.set_id}-${row.part}`;
    byPart[key] = (byPart[key] ?? 0) + 1;
  }
  const reports = (all.data ?? []) as { report: OpamReport | null }[];
  const avgCompletion = reports.length
    ? Math.round((reports.reduce((sum, r) => sum + (r.report?.completion ?? 0), 0) / reports.length) * 10) / 10
    : 0;
  return {
    questions: rows.length,
    byPart,
    attemptsToday: today.count ?? 0,
    completions: completions.count ?? 0,
    open: open.count ?? 0,
    avgCompletion,
  };
}

export const EXPECTED_PARTS: Record<string, number> = {
  "1-1": 60,
  "1-2": 35,
  "1-3": 25,
  "2-1": 60,
  "2-2": 35,
  "2-3": 25,
};

export async function opamInvariants() {
  const client = db();
  const { data } = await client.from("opam_questions").select("id, set_id, part, pair, is_active").eq("is_active", true);
  const rows = (data ?? []) as { id: string; set_id: number; part: number; pair: string | null }[];
  const problems: string[] = [];
  const got: Record<string, number> = {};
  for (const r of rows) {
    const key = `${r.set_id}-${r.part}`;
    got[key] = (got[key] ?? 0) + 1;
  }
  for (const [key, expected] of Object.entries(EXPECTED_PARTS)) {
    if ((got[key] ?? 0) !== expected) {
      const [setId, part] = key.split("-");
      problems.push(`Set ${setId} Part ${part}: expected ${expected}, found ${got[key] ?? 0} active`);
    }
  }
  const byId = new Map(rows.map((r) => [r.id, r]));
  let orphans = 0;
  for (const r of rows) {
    if (r.part !== 1 || !r.pair) continue;
    const twin = byId.get(r.pair);
    if (!twin || twin.part !== 1 || twin.set_id !== r.set_id) orphans++;
  }
  if (orphans) problems.push(`${orphans} profiling item(s) point at a missing or wrong-set reverse twin`);
  return problems;
}

export async function writeAudit(input: {
  actorId: string | null;
  action: string;
  target: string;
  before?: unknown;
  after?: unknown;
}) {
  await db()
    .from("opam_audit")
    .insert({
      actor_id: input.actorId,
      action: input.action,
      target: input.target,
      before: input.before ?? null,
      after: input.after ?? null,
    });
}
