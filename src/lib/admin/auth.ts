import { createClient } from "@/lib/supabase/server";

export type AdminRole = "super_admin" | "admin" | "read_only";

export type AdminState =
  | { status: "unauthenticated" }
  | { status: "unavailable" }
  | { status: "forbidden"; email: string | null }
  | { status: "ok"; userId: string; email: string; role: AdminRole };

/**
 * Resolves the current administrator from the session.
 *
 * Authorisation is the `admin_users` row, checked on the server for every
 * admin page and action. A missing table means the SQL has not been applied
 * yet, which is surfaced as `unavailable` instead of a crash.
 */
export async function getAdminState(): Promise<AdminState> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (!claims?.sub) {
    return { status: "unauthenticated" };
  }

  const { data: row, error } = await supabase
    .from("admin_users")
    .select("role, is_active")
    .eq("user_id", claims.sub)
    .maybeSingle();

  if (error) {
    return { status: "unavailable" };
  }

  if (!row || !row.is_active) {
    return { status: "forbidden", email: claims.email ?? null };
  }

  return {
    status: "ok",
    userId: claims.sub,
    email: claims.email ?? "",
    role: row.role as AdminRole,
  };
}

export function canWrite(role: AdminRole) {
  return role === "super_admin" || role === "admin";
}

export const roleLabel: Record<AdminRole, string> = {
  super_admin: "Super admin",
  admin: "Admin",
  read_only: "Read only",
};
