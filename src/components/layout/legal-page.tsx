import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Container } from "@/components/ui/container";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-bg-light">
        <Container className="py-12 md:py-16">
          <div className="mx-auto w-full max-w-[820px]">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-ink/55 transition-colors hover:text-crimson"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={2.3} />
              Back to home
            </Link>

            <h1 className="mt-5 text-[clamp(1.9rem,4vw,2.6rem)] font-extrabold tracking-[-0.02em] text-ink">
              {title}
            </h1>
            <p className="mt-2 text-sm font-medium text-ink/50">
              Last updated: {updated}
            </p>

            <div className="legal-prose mt-10">{children}</div>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
