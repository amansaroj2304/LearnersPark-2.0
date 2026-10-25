import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type PaletteStatus =
  | "answered"
  | "not-answered"
  | "marked"
  | "marked-answered"
  | "not-visited";

export type PaletteState = {
  current: number;
  answers: Record<number, number>;
  marked: Record<number, boolean>;
  visited: Record<number, boolean>;
};

export function getPaletteStatus(
  index: number,
  { answers, marked, visited }: PaletteState,
): PaletteStatus {
  const isMarked = Boolean(marked[index]);
  const isAnswered = answers[index] !== undefined;
  if (isMarked && isAnswered) return "marked-answered";
  if (isMarked) return "marked";
  if (isAnswered) return "answered";
  if (visited[index]) return "not-answered";
  return "not-visited";
}

export const paletteStyles: Record<PaletteStatus, string> = {
  answered: "border-[#2f9e5b] bg-[#2f9e5b] text-white",
  "not-answered": "border-crimson bg-crimson text-white",
  marked: "border-gold bg-gold text-white",
  "marked-answered": "border-gold bg-gold text-white",
  "not-visited": "border-ink/25 bg-white text-ink/70",
};

export function countStatuses(
  count: number,
  state: PaletteState,
): Record<PaletteStatus, number> {
  const totals: Record<PaletteStatus, number> = {
    answered: 0,
    "not-answered": 0,
    marked: 0,
    "marked-answered": 0,
    "not-visited": 0,
  };
  for (let index = 0; index < count; index += 1) {
    totals[getPaletteStatus(index, state)] += 1;
  }
  return totals;
}

const legend: { status: PaletteStatus; label: string }[] = [
  { status: "answered", label: "Answered" },
  { status: "not-answered", label: "Not Answered" },
  { status: "not-visited", label: "Not Visited" },
  { status: "marked", label: "Marked" },
];

export function PaletteLegend({ counts }: { counts: Record<PaletteStatus, number> }) {
  return (
    <div className="grid grid-cols-2 gap-x-2.5 gap-y-3">
      {legend.map((item) => (
        <div key={item.status} className="flex flex-col items-center gap-1 text-center">
          <span
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold",
              paletteStyles[item.status],
            )}
          >
            {counts[item.status]}
          </span>
          <span className="text-[0.6rem] leading-tight font-medium text-ink/60">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function PaletteGrid({
  start,
  count,
  state,
  locked = false,
  onSelect,
}: {
  start: number;
  count: number;
  state: PaletteState;
  locked?: boolean;
  onSelect: (questionIndex: number) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {Array.from({ length: count }, (_, localIndex) => {
        const questionIndex = start + localIndex;
        const status = getPaletteStatus(questionIndex, state);
        const isCurrent = questionIndex === state.current;
        return (
          <button
            key={questionIndex}
            type="button"
            onClick={() => onSelect(questionIndex)}
            disabled={locked}
            aria-current={isCurrent}
            className={cn(
              "relative flex h-9 w-full items-center justify-center rounded-md border text-sm font-semibold transition-all",
              paletteStyles[status],
              isCurrent && "ring-2 ring-ink/70 ring-offset-2 ring-offset-white",
              locked && "cursor-not-allowed opacity-50",
            )}
          >
            {localIndex + 1}
            {status === "marked-answered" && (
              <Check
                className="absolute right-0.5 bottom-0.5 h-3 w-3"
                strokeWidth={3}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
