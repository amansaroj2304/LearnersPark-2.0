import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-12 xl:px-[66px]",
        className,
      )}
    >
      {children}
    </div>
  );
}
