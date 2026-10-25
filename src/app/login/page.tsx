import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { LoginButton } from "@/components/auth/login-button";

export const instant = false;

export const metadata: Metadata = {
  title: "Sign in | Learners Park",
  description: "Sign in with Google to attempt CSSS tests and track your progress.",
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const nextParam = params.next;
  const next = typeof nextParam === "string" ? nextParam : "/csss";
  const hasError = params.error === "auth";

  return (
    <div className="flex min-h-screen flex-col bg-bg-light">
      <header className="border-b border-ink/10 bg-white">
        <div className="mx-auto flex h-[70px] w-full max-w-[1200px] items-center px-5 sm:px-8">
          <Link href="/" aria-label="Learners Park home" className="flex items-center">
            <Logo className="h-9 w-auto md:h-10" />
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-5 py-12">
        <div className="w-full max-w-[440px] rounded-2xl border border-ink/10 bg-white p-8 shadow-[0_24px_60px_-40px_rgba(6,21,13,0.5)] sm:p-10">
          <span className="rounded-md bg-ink px-3 py-1.5 text-xs font-bold tracking-[0.14em] text-white uppercase">
            CSSS
          </span>
          <h1 className="mt-6 text-[clamp(1.6rem,3.4vw,2rem)] font-extrabold tracking-[-0.02em] text-ink">
            Sign in to continue
          </h1>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/60">
            Sign in with your Google account to attempt tests and track your
            performance over time.
          </p>

          {hasError && (
            <p className="mt-5 rounded-lg border border-crimson/30 bg-crimson/5 px-4 py-3 text-sm font-medium text-crimson">
              We could not complete the sign in. Please try again.
            </p>
          )}

          <div className="mt-7">
            <LoginButton next={next} />
          </div>

          <Link
            href="/csss"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink/55 transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.3} />
            Back to tests
          </Link>
        </div>
      </main>
    </div>
  );
}
