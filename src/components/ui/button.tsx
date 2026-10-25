import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson/45 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-light disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-crimson text-white shadow-[0_10px_24px_-12px_rgba(107,8,18,0.7)] hover:bg-crimson-shape hover:-translate-y-0.5",
  outline:
    "border-2 border-ink bg-transparent text-ink hover:bg-ink/5 hover:-translate-y-0.5",
  ghost: "text-ink hover:bg-ink/5",
};

const sizes: Record<Size, string> = {
  sm: "h-10 rounded-lg px-5 text-sm",
  md: "h-12 rounded-lg px-7 text-[0.95rem]",
  lg: "h-16 rounded-lg px-8 text-base",
};

export function buttonClasses(
  variant: Variant = "primary",
  size: Size = "md",
  className?: string,
) {
  return cn(base, variants[variant], sizes[size], className);
}
