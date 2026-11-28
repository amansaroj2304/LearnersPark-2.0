import { getServiceClient } from "@/lib/supabase/service";

export type SsbStatus = "SOON" | "AVAILABLE" | "LIVE" | "COMPLETED";

export interface SsbTest {
  id: string;
  test_no: number;
  day: number;
  name: string;
  full_form: string;
  category: string;
  description: string;
  status: SsbStatus;
  instructions: string | null;
  content_ref: string | null;
  reference_path: string | null;
  opens_at: string | null;
  closes_at: string | null;
}

export const DAYS = [
  { day: 1, title: "Day 1 — Screening", short: "Screening" },
  { day: 2, title: "Day 2 — Psychology", short: "Psychological" },
  { day: 3, title: "Day 3 — GTO Tasks (Part 1)", short: "GTO Tasks" },
  { day: 4, title: "Day 4 — GTO Tasks (Part 2)", short: "GTO Tasks" },
  { day: 5, title: "Day 5 — Conference", short: "Conference" },
] as const;

export const REFERENCE_NOTES: Record<string, string> = {
  ppdt: "/ppdt",
};

export const STATUSES: SsbStatus[] = ["SOON", "AVAILABLE", "LIVE", "COMPLETED"];

export { isKnownSsbTestId, SSB_TEST_IDS } from "@/lib/ssb/ids";

export async function getSsbTests(): Promise<SsbTest[]> {
  const client = getServiceClient();
  if (!client) return [];
  const { data } = await client.from("ssb_tests").select("*").order("test_no");
  return (data ?? []) as SsbTest[];
}

export async function getSsbTest(id: string): Promise<SsbTest | null> {
  const client = getServiceClient();
  if (!client) return null;
  const { data } = await client.from("ssb_tests").select("*").eq("id", id).maybeSingle();
  return (data as SsbTest) ?? null;
}

export async function updateSsbTest(id: string, patch: Partial<SsbTest>) {
  const client = getServiceClient();
  if (!client) throw new Error("Service role key missing");
  let body: Partial<SsbTest> = patch;
  const { error } = await client.from("ssb_tests").update(body).eq("id", id);
  if (error && /reference_path/.test(error.message)) {
    // Column not migrated yet: save the rest rather than failing the edit.
    body = { ...patch };
    delete body.reference_path;
    const retry = await client.from("ssb_tests").update(body).eq("id", id);
    if (retry.error) throw new Error(retry.error.message);
    return;
  }
  if (error) throw new Error(error.message);
}

/** A test can be opened only when it is AVAILABLE or LIVE, and inside its window. */
export function isOpen(test: SsbTest, now = Date.now()) {
  if (test.status !== "AVAILABLE" && test.status !== "LIVE") return false;
  if (test.opens_at && new Date(test.opens_at).getTime() > now) return false;
  if (test.closes_at && new Date(test.closes_at).getTime() < now) return false;
  return true;
}
