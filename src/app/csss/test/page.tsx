import type { Metadata } from "next";
import { TestRunner } from "@/components/csss/test/runner";

export const metadata: Metadata = {
  title: "CSSS Mock Test 01 | Learners Park",
  description:
    "Attempt the CSSS mock test with a timed interface, question palette, review marking and a detailed performance analysis.",
};

export default function CsssTestPage() {
  return <TestRunner />;
}
