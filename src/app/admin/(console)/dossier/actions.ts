"use server";

import { getAdminState } from "@/lib/admin/auth";

/**
 * "Sync now" in the admin console.
 *
 * The website cannot talk to Google Drive directly, so this posts to a Manus
 * webhook automation that runs the PPDT and Dossier sync scripts against the
 * amanst786@gmail.com Drive folders. The automation is a new Manus session, so
 * the button returns as soon as the request is accepted (HTTP 202); files
 * appear in Drive within a minute or two.
 */
const SYNC_WEBHOOK =
  process.env.DRIVE_SYNC_WEBHOOK_URL ??
  "https://api.manus.im/api/webhook/triggers/c3daa8fb-0e37-4d15-af3a-888ff0a4416c";

export interface SyncResult {
  ok: boolean;
  message: string;
}

export async function triggerDriveSync(): Promise<SyncResult> {
  const state = await getAdminState();
  if (state.status !== "ok") return { ok: false, message: "Not authorised." };

  try {
    const res = await fetch(SYNC_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "sync-drive",
        source: "admin-console",
        requestedBy: state.email,
        requestedAt: new Date().toISOString(),
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      return { ok: false, message: `Sync service replied ${res.status}. Try again in a moment.` };
    }
    return {
      ok: true,
      message: "Sync started. New uploads should appear in Google Drive within a minute or two.",
    };
  } catch {
    return { ok: false, message: "Could not reach the sync service. The hourly sync will still run." };
  }
}
