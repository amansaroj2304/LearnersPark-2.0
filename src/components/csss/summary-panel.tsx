import type { ReactNode } from "react";
import { FileText, Info } from "lucide-react";

export function SummaryPanel({
  total,
  full,
  section,
  free,
}: {
  total: number;
  full: number;
  section: number;
  free: number;
}) {
  return (
    <aside className="h-fit rounded-2xl bg-ink p-7 text-white lg:sticky lg:top-[90px]">
      <p className="text-xs font-bold tracking-[0.22em] text-gold uppercase">
        Total Tests
      </p>
      <p className="mt-3 text-6xl leading-none font-extrabold">{total}</p>

      <dl className="mt-7 divide-y divide-white/10 border-t border-white/10">
        <StatRow
          icon={<FileText className="h-5 w-5" strokeWidth={1.9} />}
          label="Full tests"
          value={full}
        />
        <StatRow
          icon={<FileText className="h-5 w-5" strokeWidth={1.9} />}
          label="Section tests"
          value={section}
        />
        <StatRow
          icon={<Info className="h-5 w-5" strokeWidth={1.9} />}
          label="Free access"
          value={free}
        />
      </dl>

      <div className="mt-6 flex gap-3 border-t border-white/10 pt-6 text-sm text-white/80">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-white/70" strokeWidth={1.9} />
        <p>
          Both full tests are currently available. More section tests will be
          added soon.
        </p>
      </div>
    </aside>
  );
}

function StatRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-3 py-4 text-white/75">
      {icon}
      <dt className="flex-1 text-[0.95rem] text-white/85">{label}</dt>
      <dd className="text-lg font-bold text-white">{value}</dd>
    </div>
  );
}