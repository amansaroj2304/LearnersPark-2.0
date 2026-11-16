import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink/10 px-5 py-6 sm:px-8">
      <div>
        <h1 className="text-[clamp(1.4rem,2.6vw,1.9rem)] font-extrabold tracking-[-0.02em] text-ink">
          {title}
        </h1>
        {description && <p className="mt-1 text-sm text-ink/60">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number | string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5">
      <p className="text-xs font-bold tracking-[0.12em] text-ink/45 uppercase">{label}</p>
      <p className="mt-2 text-3xl font-extrabold tracking-[-0.02em] text-ink tabular-nums">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-ink/50">{hint}</p>}
    </div>
  );
}

const badgeStyles = {
  green: "bg-[#2f9e5b]/12 text-[#256e42]",
  amber: "bg-gold/15 text-[#8a6a12]",
  red: "bg-crimson/10 text-crimson",
  grey: "bg-ink/8 text-ink/60",
} as const;

export function Badge({
  tone = "grey",
  children,
}: {
  tone?: keyof typeof badgeStyles;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold",
        badgeStyles[tone],
      )}
    >
      {children}
    </span>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-ink/20 bg-white px-6 py-14 text-center">
      <p className="text-lg font-bold text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink/55">{description}</p>
    </div>
  );
}

export function DataTable({
  head,
  children,
}: {
  head: string[];
  children: ReactNode;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-ink/10 bg-[#f7f8f1] text-left text-xs font-bold tracking-[0.08em] text-ink/50 uppercase">
            {head.map((cell) => (
              <th key={cell} className="px-4 py-3 font-bold">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
