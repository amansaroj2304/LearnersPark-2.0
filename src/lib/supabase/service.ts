import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null | undefined;

/**
 * Server-only client using the service role key. OPAM tables have RLS with no
 * policies, so this is the only way to read questions or grade attempts.
 * Returns null when the key is not configured, which the OPAM pages surface as
 * "module not configured" instead of crashing.
 */
export function getServiceClient(): SupabaseClient | null {
  if (cached !== undefined) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  cached = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
  return cached;
}

export function isOpamConfigured() {
  return getServiceClient() !== null;
}
