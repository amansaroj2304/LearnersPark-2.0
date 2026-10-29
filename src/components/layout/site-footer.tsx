import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { Container } from "@/components/ui/container";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/10 bg-white">
      <Container className="flex flex-col items-center gap-5 py-8 sm:flex-row sm:justify-between">
        <Link href="/" aria-label="Learners Park home" className="flex items-center">
          <Logo className="h-9 w-auto" />
        </Link>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-ink/60">
          <Link href="/privacy" className="transition-colors hover:text-crimson">
            Privacy Policy
          </Link>
          <Link href="/terms" className="transition-colors hover:text-crimson">
            Terms of Service
          </Link>
        </nav>

        <p className="text-sm text-ink/45">© 2026 Learners Park</p>
      </Container>
    </footer>
  );
}
