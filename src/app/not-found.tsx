import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = {
  title: "Page not found | Learners Park",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="bg-bg-light">
        <Container className="py-16 sm:py-24">
          <p className="text-xs font-bold tracking-[0.16em] text-crimson uppercase">Error 404</p>
          <h1 className="mt-3 text-[clamp(2rem,4.5vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">
            This page does not exist
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink/65">
            The link may be mistyped or the page may have moved. Head back to the practice modules and pick up
            where you left off.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/ssb"
              className="inline-flex h-10 items-center rounded-lg bg-crimson px-5 text-sm font-semibold text-white hover:bg-crimson-shape"
            >
              Go to the 17 SSB tests
            </Link>
            <Link
              href="/"
              className="inline-flex h-10 items-center rounded-lg border border-ink/15 px-5 text-sm font-semibold text-ink hover:bg-ink/5"
            >
              Home
            </Link>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
