"use server";

import { revalidatePath } from "next/cache";
import { canWrite, getAdminState } from "@/lib/admin/auth";
import { updateSsbTest, STATUSES, type SsbStatus } from "@/lib/ssb/data";

export async function saveSsbTest(formData: FormData) {
  const state = await getAdminState();
  if (state.status !== "ok" || !canWrite(state.role)) throw new Error("Not authorised");

  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing test id");

  const status = String(formData.get("status") ?? "SOON") as SsbStatus;
  if (!STATUSES.includes(status)) throw new Error("Unknown status");

  const description = String(formData.get("description") ?? "").trim();
  const instructions = String(formData.get("instructions") ?? "").trim();
  const opensAt = String(formData.get("opensAt") ?? "");
  const closesAt = String(formData.get("closesAt") ?? "");

  if (description.length < 20) throw new Error("Description must be at least 20 characters.");

  await updateSsbTest(id, {
    status,
    description: description.slice(0, 400),
    instructions: instructions ? instructions.slice(0, 2000) : null,
    opens_at: opensAt ? new Date(opensAt).toISOString() : null,
    closes_at: closesAt ? new Date(closesAt).toISOString() : null,
  });

  revalidatePath("/admin/ssb");
  revalidatePath("/ssb");
  revalidatePath(`/ssb/${id}`);
}
