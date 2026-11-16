import { cookies } from "next/headers";
import { createHash } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { getAdminState } from "@/lib/admin/auth";

export const guestCookieName = (attemptId: string) => `opam_guest_${attemptId}`;

export async function getViewer() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  return { userId: data?.claims?.sub ?? null, email: data?.claims?.email ?? null };
}

export async function getGuestToken(attemptId: string) {
  const jar = await cookies();
  return jar.get(guestCookieName(attemptId))?.value ?? null;
}

export async function isAdminViewer() {
  const state = await getAdminState();
  return state.status === "ok";
}

/** Never store raw IPs: sha256(ip + ':' + yyyy-mm-dd). */
export function hashIp(ip: string | null) {
  if (!ip) return null;
  const day = new Date().toISOString().slice(0, 10);
  return createHash("sha256").update(`${ip}:${day}`).digest("hex");
}
