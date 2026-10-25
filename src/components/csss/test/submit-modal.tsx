"use client";

export type SubmitSummary = {
  questions: number;
  answered: number;
  notAnswered: number;
  markedForReview: number;
  notVisited: number;
};

export function SubmitModal({
  summary,
  onClose,
  onSubmit,
}: {
  summary: SubmitSummary;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const columns = [
    { key: "label", label: "Section" },
    { key: "questions", label: "No. of questions" },
    { key: "answered", label: "Answered" },
    { key: "notAnswered", label: "Not Answered" },
    { key: "markedForReview", label: "Marked for Review" },
    { key: "notVisited", label: "Not Visited" },
  ] as const;

  const row: Record<(typeof columns)[number]["key"], string | number> = {
    label: "Test",
    questions: summary.questions,
    answered: summary.answered,
    notAnswered: summary.notAnswered,
    markedForReview: summary.markedForReview,
    notVisited: summary.notVisited,
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/55 px-4">
      <div className="w-full max-w-[780px] overflow-hidden rounded-lg bg-white shadow-2xl">
        <p className="border-b border-ink/10 py-4 text-center text-sm font-semibold text-ink">
          Submit your test
        </p>

        <div className="overflow-x-auto px-6 py-6">
          <table className="w-full min-w-[620px] border-collapse text-center text-sm">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="border border-ink/10 bg-ink px-3 py-3 text-xs font-bold text-white"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="text-ink">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="border border-ink/10 px-3 py-3 font-medium"
                  >
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-ink/10 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-lg border border-ink/15 bg-white px-6 text-sm font-semibold text-ink transition-colors hover:bg-ink/5"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="h-11 rounded-lg bg-crimson px-6 text-sm font-semibold text-white transition-colors hover:bg-crimson-shape"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
