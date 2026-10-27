"use client";

import { useMemo, useState } from "react";
import { AppHeader } from "@/components/csss/app-header";
import { TestCard, type CsssTest } from "@/components/csss/test-card";
import { TestResultCard } from "@/components/csss/test-result-card";
import { SummaryPanel } from "@/components/csss/summary-panel";
import { Container } from "@/components/ui/container";
import type { TestResultSummary } from "@/data/csss-tests";
import { cn } from "@/lib/utils";

const tests: CsssTest[] = [
  {
    id: "mock-01",
    title: "CSSS Mock Test 01",
    kind: "full",
    sections: "All Sections",
    questions: 70,
    marks: 70,
    minutes: 10,
    languages: ["English", "Hindi"],
    free: true,
  },
  {
    id: "mock-02",
    title: "CSSS Mock Test 02",
    kind: "full",
    sections: "All Sections",
    questions: 70,
    marks: 70,
    minutes: 10,
    languages: ["English", "Hindi"],
    free: true,
  },
];

const tabs = [
  { id: "all", label: "All" },
  { id: "full", label: "Full Tests" },
  { id: "section", label: "Section Tests" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function TestsBrowser({
  results = {},
}: {
  results?: Record<string, TestResultSummary>;
}) {
  const [tab, setTab] = useState<TabId>("all");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tests.filter((test) => {
      const matchesTab = tab === "all" || test.kind === tab;
      const matchesQuery = q === "" || test.title.toLowerCase().includes(q);
      return matchesTab && matchesQuery;
    });
  }, [tab, query]);

  const fullCount = tests.filter((test) => test.kind === "full").length;
  const sectionCount = tests.filter((test) => test.kind === "section").length;
  const freeCount = tests.filter((test) => test.free).length;

  return (
    <>
      <AppHeader query={query} onQueryChange={setQuery} />

      <main className="flex-1 pb-20">
        <Container className="grid grid-cols-1 gap-10 pt-10 lg:grid-cols-[1fr_360px] xl:pt-14">
          <div>
            <div className="flex flex-wrap items-center gap-4">
              <span className="rounded-md bg-ink px-3 py-1.5 text-xs font-bold tracking-[0.14em] text-white uppercase">
                CSSS
              </span>
              <p className="text-[0.7rem] font-semibold tracking-[0.18em] text-ink/55 uppercase sm:text-xs">
                Computerised Selection Screening System
              </p>
            </div>

            <h1 className="mt-6 text-[clamp(2.4rem,5vw,4rem)] leading-[1.02] font-extrabold tracking-[-0.03em] text-ink">
              All Tests{" "}
              <span className="text-crimson">({tests.length})</span>
            </h1>

            <p className="mt-4 max-w-[62ch] text-lg text-ink/60">
              Practice CSSS mock tests and improve your performance with
              structured assessments covering memory, perception, reasoning and
              communication.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {tabs.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  aria-pressed={tab === item.id}
                  className={cn(
                    "h-11 rounded-lg px-6 text-[0.95rem] font-semibold transition-colors",
                    tab === item.id
                      ? "bg-ink text-white"
                      : "bg-bg-light-2 text-ink hover:bg-bg-light-2/70",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-6">
              {visible.length > 0 ? (
                visible.map((test) =>
                  results[test.id] ? (
                    <TestResultCard
                      key={test.id}
                      title={test.title}
                      result={results[test.id]}
                    />
                  ) : (
                    <TestCard key={test.id} test={test} />
                  ),
                )
              ) : (
                <div className="rounded-2xl border border-dashed border-ink/15 bg-white/60 px-6 py-14 text-center text-ink/55">
                  No tests found
                  {query.trim() ? ` for “${query.trim()}”` : ""}.
                </div>
              )}
            </div>
          </div>

          <SummaryPanel
            total={tests.length}
            full={fullCount}
            section={sectionCount}
            free={freeCount}
          />
        </Container>
      </main>
    </>
  );
}