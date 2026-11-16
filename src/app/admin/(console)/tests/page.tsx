import { Badge, DataTable, EmptyState, PageHeader } from "@/components/admin/ui";
import { getTests } from "@/lib/admin/data";

export const instant = false;

export default async function TestsPage() {
  const tests = await getTests();

  return (
    <>
      <PageHeader
        title="Tests"
        description="The test registry. New tests added as rows appear here automatically."
      />
      <div className="px-5 py-6 sm:px-8">
        {tests.length === 0 ? (
          <EmptyState
            title="No tests in the registry"
            description="The registry is seeded with the three CSSS tests when the database SQL runs."
          />
        ) : (
          <DataTable head={["Test", "Category", "Questions", "Duration", "Marking", "Status"]}>
            {tests.map((test) => (
              <tr key={test.id} className="border-b border-ink/6 last:border-b-0">
                <td className="px-4 py-3">
                  <p className="font-semibold text-ink">{test.title}</p>
                  <p className="text-xs text-ink/45">{test.test_key}</p>
                </td>
                <td className="px-4 py-3 text-ink/70">{test.category}</td>
                <td className="px-4 py-3 text-ink/70">{test.total_questions}</td>
                <td className="px-4 py-3 text-ink/70">{test.duration_minutes} min</td>
                <td className="px-4 py-3 text-ink/70">
                  +{test.marks_correct} / −{test.marks_wrong}
                </td>
                <td className="px-4 py-3">
                  <Badge
                    tone={
                      test.status === "published"
                        ? "green"
                        : test.status === "draft"
                          ? "amber"
                          : "grey"
                    }
                  >
                    {test.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </DataTable>
        )}
        <p className="mt-4 text-xs text-ink/50">
          Question banks are still versioned in the repository; only metadata lives in this table for
          now. Editing tests from the console is the next phase.
        </p>
      </div>
    </>
  );
}
