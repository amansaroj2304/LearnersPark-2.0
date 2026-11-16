import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { GetStartedDialog } from "@/components/auth/get-started-dialog";
import { AccountMenu } from "@/components/auth/account-menu";
import { Logo } from "@/components/layout/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Container } from "@/components/ui/container";
import { navLinks } from "@/lib/data";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-[0_1px_0_rgba(6,21,13,0.07)]">
      <Container className="relative flex h-[68px] items-center justify-between gap-4 md:h-[83px]">
        <div className="flex items-center gap-2">
          <MobileNav
            links={[
              { label: "Home", href: "/" },
              ...navLinks,
              { label: "My Progress", href: "/progress" },
            ]}
          />
          <Link href="/" aria-label="Learners Park home" className="flex shrink-0 items-center">
            <Logo className="h-9 w-auto sm:h-11 md:h-12 lg:h-14" />
          </Link>
        </div>
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 lg:flex xl:gap-16">
          {navLinks.map((link) =>
            link.soon ? (
              <span
                key={link.label}
                aria-disabled="true"
                title="Coming soon"
                className="flex items-center gap-2 text-lg font-medium text-ink/60 xl:text-[1.35rem]"
              >
                {link.label}
                <span className="rounded-md bg-sage/40 px-2 py-0.5 text-[0.6rem] font-bold tracking-[0.12em] text-olive-deep uppercase">
                  Soon
                </span>
              </span>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="text-lg font-medium text-ink/90 transition-colors hover:text-crimson xl:text-[1.35rem]"
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>
        <AccountMenu
          fallback={
            <GetStartedDialog
              className={buttonClasses(
                "primary",
                "sm",
                "gap-2 md:h-12 md:gap-2.5 md:px-9 md:text-[0.95rem]",
              )}
            >
              Get Started
              <ArrowRight className="h-4 w-4" strokeWidth={2.6} />
            </GetStartedDialog>
          }
        />
      </Container>
    </header>
  );
}
