#!/usr/bin/env node
/**
 * Import the OPAM question bank.
 *
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/import-opam.mjs path/to/opam-questions.json
 *
 * Validates the 240 / 60-35-25 structure before writing anything, upserts
 * without clobbering, and leaves both sets closed until an admin opens them.
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const EXPECTED = { "1-1": 60, "1-2": 35, "1-3": 25, "2-1": 60, "2-2": 35, "2-3": 25 };

const path = process.argv[2] ?? "supabase/seed/opam-questions.json";
const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
  process.exit(1);
}

const bank = JSON.parse(readFileSync(path, "utf8"));
const questions = bank.questions ?? [];
const problems = [];

if (questions.length !== 240) problems.push(`Expected 240 questions, got ${questions.length}`);
const byPart = {};
for (const q of questions) {
  const k = `${q.set_id}-${q.part}`;
  byPart[k] = (byPart[k] ?? 0) + 1;
}
for (const [k, expected] of Object.entries(EXPECTED)) {
  if ((byPart[k] ?? 0) !== expected) problems.push(`Set/part ${k}: expected ${expected}, got ${byPart[k] ?? 0}`);
}
const ids = new Set(questions.map((q) => q.id));
if (ids.size !== questions.length) problems.push("Duplicate question ids");
for (const q of questions) {
  if (!q.text || q.text.length < 20) problems.push(`${q.id}: text shorter than 20 characters`);
  if (!Array.isArray(q.olq) || q.olq.length === 0 || q.olq.length > 3) problems.push(`${q.id}: needs 1–3 OLQ tags`);
  if (q.part === 1 && !["P", "N"].includes(q.keyed)) problems.push(`${q.id}: keyed must be P or N`);
  if (q.part === 1 && q.pair && !ids.has(q.pair)) problems.push(`${q.id}: pair ${q.pair} missing`);
  if (q.part === 2 && (!q.option_a || !q.option_b)) problems.push(`${q.id}: both options required`);
  if (q.part === 3) {
    if (!Array.isArray(q.options) || q.options.length !== 4) problems.push(`${q.id}: four options required`);
    if (typeof q.best_index !== "number") problems.push(`${q.id}: best_index required`);
    if (Array.isArray(q.acceptable) && q.acceptable.includes(q.best_index)) problems.push(`${q.id}: best option also listed acceptable`);
    if (!Array.isArray(q.rationales) || q.rationales.length !== 4 || q.rationales.some((r) => !r?.trim()))
      problems.push(`${q.id}: a rationale is missing`);
  }
}
if (problems.length) {
  console.error(`Bank rejected (${problems.length} problems):`);
  for (const p of problems.slice(0, 30)) console.error(" -", p);
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });
const rows = questions.map((q) => ({
  id: q.id,
  set_id: q.set_id,
  part: q.part,
  qnum: q.qnum,
  format: q.format,
  text: q.text,
  keyed: q.keyed ?? null,
  pair: q.pair ?? null,
  option_a: q.option_a ?? null,
  option_b: q.option_b ?? null,
  options: q.options ?? null,
  best_index: q.best_index ?? null,
  acceptable: q.acceptable ?? [],
  rationales: q.rationales ?? null,
  olq: q.olq ?? [],
  olq_a: q.olq_a ?? [],
  olq_b: q.olq_b ?? [],
}));

for (let i = 0; i < rows.length; i += 50) {
  const chunk = rows.slice(i, i + 50);
  const { error } = await supabase.from("opam_questions").upsert(chunk, { onConflict: "id" });
  if (error) {
    console.error("Import failed:", error.message);
    process.exit(1);
  }
  process.stdout.write(`\rImported ${Math.min(i + 50, rows.length)}/${rows.length}`);
}
console.log("\nQuestions imported.");

const timing = bank.timing ?? {};
for (const setId of [1, 2]) {
  await supabase
    .from("opam_set_config")
    .update({
      title: setId === 1 ? "OPAM Mock Test — Set 1" : "OPAM Mock Test — Set 2",
      subtitle: setId === 1 ? "Foundations" : "Pressure",
      per_question_secs: timing.per_question_seconds ?? 15,
      total_seconds: timing.total_seconds ?? 1800,
    })
    .eq("set_id", setId);
}
console.log("Set configuration updated. Both sets stay closed until opened in /admin/opam.");
