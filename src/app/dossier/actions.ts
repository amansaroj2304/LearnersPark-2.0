"use server";

import { getServiceClient } from "@/lib/supabase/service";

const BUCKET = "dossier-uploads";

export interface UploadTarget {
  kind: string;
  path: string;
  token: string;
}

function basePath(studentId: string, name: string, day: number) {
  const safe = `${studentId}_${name.replace(/[^A-Za-z0-9]+/g, "_").slice(0, 40)}`;
  return `dossier/${safe}/day${String(day).padStart(2, "0")}`;
}

/** Signed upload URLs let the browser send large files straight to storage. */
export async function createUploadTargets(
  studentId: string,
  studentName: string,
  day: number,
  files: { kind: string; ext: string }[],
): Promise<{ ok: boolean; targets?: UploadTarget[]; message?: string }> {
  const client = getServiceClient();
  if (!client) return { ok: false, message: "Submissions are not configured on this deployment yet." };
  if (!/^DOS-[A-Z0-9]{6}$/.test(studentId)) return { ok: false, message: "Invalid student ID." };
  if (day < 1 || day > 15) return { ok: false, message: "Invalid day." };

  const dir = basePath(studentId, studentName, day);
  const targets: UploadTarget[] = [];
  for (const f of files) {
    const ext = (f.ext || "bin").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 5) || "bin";
    const kind = (f.kind || "FILE").replace(/[^A-Za-z0-9_]/g, "").slice(0, 24) || "FILE";
    // Random suffix keeps several handwritten pages uploaded in the same millisecond apart.
    const path = `${dir}/${kind}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
    const { data, error } = await client.storage.from(BUCKET).createSignedUploadUrl(path);
    if (error || !data) return { ok: false, message: error?.message ?? "Could not prepare the upload." };
    targets.push({ kind: f.kind, path: data.path, token: data.token });
  }
  return { ok: true, targets };
}

export interface DossierAttemptPayload {
  day: number;
  status: string;
  startedAt: string;
  submittedAt: string;
  totalSeconds: number;
  tat: { text: string; secondsUsed: number };
  wat: { word: string; answer: string; secondsUsed: number }[];
  srt: { situation: string; answer: string; secondsUsed: number }[];
  lecturette: { topic: string; prepNotes: string; speakNotes: string; prepUsed: number; speakUsed: number };
  files: { kind: string; path: string }[];
}

export async function saveDossierAttempt(
  student: { id: string; name: string; email: string; phone: string },
  payload: DossierAttemptPayload,
): Promise<{ ok: boolean; message: string }> {
  const client = getServiceClient();
  if (!client) return { ok: false, message: "Submissions are not configured on this deployment yet." };
  if (!/^DOS-[A-Z0-9]{6}$/.test(student.id)) return { ok: false, message: "Invalid student ID." };

  const dir = basePath(student.id, student.name, payload.day);
  const record = {
    ...payload,
    student: { id: student.id, name: student.name, email: student.email, phone: student.phone },
    savedAt: new Date().toISOString(),
  };
  const { error } = await client.storage
    .from(BUCKET)
    .upload(`${dir}/attempt-${Date.now()}.json`, Buffer.from(JSON.stringify(record, null, 2)), {
      contentType: "application/json",
      upsert: false,
    });
  if (error) {
    console.error("dossier save failed", error.message);
    return { ok: false, message: "The submission did not save. Please try again." };
  }
  return { ok: true, message: "Drill submitted." };
}

export async function listDossierSubmissions(): Promise<{
  ok: boolean;
  students: { student: string; day: string; files: { name: string; path: string; url: string }[] }[];
  message?: string;
}> {
  const client = getServiceClient();
  if (!client) return { ok: false, students: [], message: "Not configured." };

  const { data: folders } = await client.storage.from(BUCKET).list("dossier", { limit: 1000 });
  const out: { student: string; day: string; files: { name: string; path: string; url: string }[] }[] = [];
  for (const s of folders ?? []) {
    if (!s.name || s.name === ".emptyFolderPlaceholder") continue;
    const { data: days } = await client.storage.from(BUCKET).list(`dossier/${s.name}`, { limit: 1000 });
    for (const d of days ?? []) {
      if (!d.name?.startsWith("day")) continue;
      const { data: files } = await client.storage.from(BUCKET).list(`dossier/${s.name}/${d.name}`, { limit: 1000 });
      const rows = [];
      for (const f of files ?? []) {
        const path = `dossier/${s.name}/${d.name}/${f.name}`;
        const { data: signed } = await client.storage.from(BUCKET).createSignedUrl(path, 60 * 60 * 24);
        rows.push({ name: f.name, path, url: signed?.signedUrl ?? "" });
      }
      if (rows.length) out.push({ student: s.name, day: d.name, files: rows });
    }
  }
  return { ok: true, students: out };
}
