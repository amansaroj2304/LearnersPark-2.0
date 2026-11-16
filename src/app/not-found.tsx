import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Container } from "@/components/ui/container";
import { buttonClasses } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <Container className="flex flex-1 flex-col items-center justify-center py-24 text-center">
          <span className="rounded-md bg-ink px-3 py-1.5 text-xs font-bold tracking-[0.14em] text-white uppercase">
            404
          </span>
          <h1 className="mt-6 text-[clamp(2rem,5vw,3.25rem)] font-extrabold tracking-[-0.03em] text-ink">
            This page could not be found
          </h1>
          <p className="mt-4 max-w-[46ch] text-lg text-ink/60">
            The link may be broken or the page may have moved. Your CSSS mock
            tests are still waiting for you.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/csss" className={buttonClasses("primary", "lg", "gap-2")}>
              Browse CSSS tests
            </Link>
            <Link href="/" className={buttonClasses("outline", "lg", "gap-2")}>
              <ArrowLeft className="h-4 w-4" strokeWidth={2.4} />
              Back to home
            </Link>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
