import type { Metadata } from "next";
import { TestRunner } from "@/components/csss/test/runner";
import { getCsssTest } from "@/data/csss-tests";
import { createClient } from "@/lib/supabase/server";

export const instant = false;

export const metadata: Metadata = {
  title: "CSSS Mock Test | Learners Park",
  description:
    "Attempt the CSSS mock test with a timed interface, question palette, review marking and a detailed performance analysis.",
};

export default async function CsssTestPage({
  searchParams,
}: PageProps<"/csss/test">) {
  const { test: testParam } = await searchParams;
  const test = getCsssTest(typeof testParam === "string" ? testParam : undefined);

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  const studentName =
    (claims?.user_metadata?.full_name as string | undefined) ||
    (claims?.user_metadata?.name as string | undefined) ||
    claims?.email?.split("@")[0] ||
    "Student";

  return <TestRunner test={test} studentName={studentName} />;
}
