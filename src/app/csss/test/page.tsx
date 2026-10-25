import type { Metadata } from "next";
import { TestRunner } from "@/components/csss/test/runner";
import { createClient } from "@/lib/supabase/server";

export const instant = false;

export const metadata: Metadata = {
  title: "CSSS Mock Test 01 | Learners Park",
  description:
    "Attempt the CSSS mock test with a timed interface, question palette, review marking and a detailed performance analysis.",
};

export default async function CsssTestPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  const studentName =
    (claims?.user_metadata?.full_name as string | undefined) ||
    (claims?.user_metadata?.name as string | undefined) ||
    claims?.email?.split("@")[0] ||
    "Student";

  return <TestRunner studentName={studentName} />;
}
