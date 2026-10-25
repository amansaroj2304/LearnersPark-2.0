import type { Metadata } from "next";
import { TestsBrowser } from "@/components/csss/tests-browser";

export const metadata: Metadata = {
  title: "CSSS Mock Tests | Learners Park",
  description:
    "Practice CSSS mock tests and improve your performance with structured assessments covering memory, perception, reasoning and communication.",
};

export default function CsssPage() {
  return <TestsBrowser />;
}