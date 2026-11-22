"use server";

import { getServiceClient } from "@/lib/supabase/service";

export type UploadResult = { ok: boolean; message: string };

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif", "application/pdf"];

function extFor(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]{2,5}$/.test(fromName)) return fromName;
  if (file.type === "application/pdf") return "pdf";
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

/**
 * Stores a photo/scan of a candidate's handwritten PPDT sheet in the private
 * `ppdt-uploads` bucket. A sync job copies new files into the Drive folder
 * "ppdt uploaded"; the name carries the date, mode and set so the folder stays
 * readable on its own.
 */
export async function uploadPpdtSheet(formData: FormData): Promise<UploadResult> {
  const file = formData.get("file");
  const mode = String(formData.get("mode") ?? "practice");
  const set = String(formData.get("set") ?? "practice").replace(/[^a-z0-9-]/gi, "").slice(0, 24) || "practice";

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Choose a photo or PDF of your written sheet first." };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, message: "That file is larger than 10 MB. Try a smaller photo." };
  }
  if (file.type && !ALLOWED.includes(file.type)) {
    return { ok: false, message: "Upload a JPG, PNG, WebP or PDF file." };
  }

  const client = getServiceClient();
  if (!client) {
    return { ok: false, message: "Uploads are not configured on this deployment yet." };
  }

  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const stamp =
    `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}` +
    `-${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}`;
  const rand = Math.random().toString(36).slice(2, 8);
  const path = `ppdt/${stamp}-${mode}-${set}-${rand}.${extFor(file)}`;

  const bytes = Buffer.from(await file.arrayBuffer());
  const { error } = await client.storage.from("ppdt-uploads").upload(path, bytes, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });

  if (error) {
    console.error("ppdt upload failed", error.message);
    return { ok: false, message: "The upload did not go through. Please try again." };
  }

  return {
    ok: true,
    message: `Saved (${path.split("/").pop()}). It is copied to the Drive folder “ppdt uploaded” at the next sync.`,
  };
}
