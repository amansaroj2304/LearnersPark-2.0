"use server";

import { revalidatePath } from "next/cache";
import { getAdminState } from "@/lib/admin/auth";
import { getServiceClient } from "@/lib/supabase/service";
import { getSetConfig, opamInvariants, writeAudit } from "@/lib/opam/data";

async function requireAdmin() {
  const state = await getAdminState();
  if (state.status !== "ok") throw new Error("Not authorised");
  return state;
}

export async function toggleSet(formData: FormData) {
  const admin = await requireAdmin();
  const setId = Number(formData.get("setId"));
  if (![1, 2].includes(setId)) throw new Error("Unknown set");

  const before = await getSetConfig(setId);
  const next = !before?.is_enabled;

  if (next) {
    const problems = await opamInvariants();
    if (problems.length) {
      throw new Error(`Cannot enable Set ${setId}: ${problems.join("; ")}`);
    }
  }

  const client = getServiceClient();
  if (!client) throw new Error("Service role key missing");
  const { error } = await client.from("opam_set_config").update({ is_enabled: next }).eq("set_id", setId);
  if (error) throw new Error(error.message);

  await writeAudit({
    actorId: admin.userId,
    action: next ? "set.enable" : "set.disable",
    target: `set:${setId}`,
    before,
    after: { is_enabled: next },
  });

  revalidatePath("/admin/opam");
  revalidatePath(`/opam/${setId}`);
  revalidatePath("/opam");
}

export async function saveSetConfig(formData: FormData) {
  const admin = await requireAdmin();
  const setId = Number(formData.get("setId"));
  if (![1, 2].includes(setId)) throw new Error("Unknown set");

  const perQuestionSecs = Number(formData.get("perQuestionSecs"));
  const totalSeconds = Number(formData.get("totalSeconds"));
  const title = String(formData.get("title") ?? "").slice(0, 120);
  const subtitle = String(formData.get("subtitle") ?? "").slice(0, 120);

  if (!Number.isFinite(perQuestionSecs) || perQuestionSecs < 5 || perQuestionSecs > 120) {
    throw new Error("Per-question time must be between 5 and 120 seconds.");
  }
  if (!Number.isFinite(totalSeconds) || totalSeconds < perQuestionSecs * 120) {
    throw new Error("The total clock cannot be shorter than 120 × per-question time.");
  }

  const before = await getSetConfig(setId);
  const client = getServiceClient();
  if (!client) throw new Error("Service role key missing");
  const after = {
    title,
    subtitle,
    per_question_secs: perQuestionSecs,
    total_seconds: totalSeconds,
    allow_back_nav: formData.get("allowBackNav") === "on",
    show_report_to_user: formData.get("showReportToUser") === "on",
  };
  const { error } = await client.from("opam_set_config").update(after).eq("set_id", setId);
  if (error) throw new Error(error.message);

  await writeAudit({ actorId: admin.userId, action: "set.update", target: `set:${setId}`, before, after });

  revalidatePath("/admin/opam");
  revalidatePath(`/opam/${setId}`);
}
