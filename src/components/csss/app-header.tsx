"use client";

import Link from "next/link";
import { ArrowRight, Menu, Search } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { Container } from "@/components/ui/container";

export function AppHeader({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (value: string) => void;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-white">
      <Container className="flex h-[70px] items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Open menu"
            className="-ml-1 flex h-10 w-10 items-center justify-center rounded-lg text-ink hover:bg-ink/5"
          >
            <Menu className="h-6 w-6" strokeWidth={2.3} />
          </button>
          <Link
            href="/"
            aria-label="Learners Park home"
            className="flex items-center"
          >
            <Logo className="h-9 w-auto md:h-11" />
          </Link>
        </div>

        <div className="ml-auto hidden flex-1 justify-center md:flex">
          <div className="relative w-full max-w-[470px]">
            <Search
              className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-ink/40"
              strokeWidth={2}
            />
            <input
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search tests..."
              className="h-11 w-full rounded-full border border-ink/10 bg-bg-light pr-4 pl-12 text-[0.95rem] text-ink placeholder:text-ink/45 focus:border-ink/25 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="#get-started"
            className={buttonClasses("primary", "md", "gap-2.5")}
          >
            Get Started
            <ArrowRight className="h-4 w-4" strokeWidth={2.6} />
          </Link>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink/10 text-sm font-bold text-ink">
            R
          </span>
        </div>
      </Container>
    </header>
  );
}