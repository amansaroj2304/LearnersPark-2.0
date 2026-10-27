import type { Metadata } from "next";
import { TestsBrowser } from "@/components/csss/tests-browser";
import { getMyTestResults } from "@/lib/test-results";
import { csssTests } from "@/data/csss-tests";

export const instant = false;

export const metadata: Metadata = {
  title: "CSSS Mock Tests | Learners Park",
  description:
    "Practice CSSS mock tests and improve your performance with structured assessments covering memory, perception, reasoning and communication.",
};

export default async function CsssPage() {
  const results = await getMyTestResults(Object.keys(csssTests));
  return <TestsBrowser results={results} />;
}
