import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { Container } from "@/components/ui/container";
import { navLinks } from "@/lib/data";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-[0_1px_0_rgba(6,21,13,0.07)]">
      <Container className="relative flex h-[68px] items-center justify-between gap-4 md:h-[83px]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Open menu"
            className="-ml-1 flex h-10 w-10 items-center justify-center rounded-lg text-ink hover:bg-ink/5 lg:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link href="/" aria-label="Learners Park home" className="flex items-center">
            <Logo className="h-11 w-auto md:h-12 lg:h-14" />
          </Link>
        </div>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 lg:flex xl:gap-16">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-lg font-medium text-ink/90 transition-colors hover:text-crimson xl:text-[1.35rem]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="#get-started"
          className={buttonClasses("primary", "md", "gap-2.5 md:h-12 md:px-9")}
        >
          Get Started
          <ArrowRight className="h-4 w-4" strokeWidth={2.6} />
        </Link>
      </Container>
    </header>
  );
}
