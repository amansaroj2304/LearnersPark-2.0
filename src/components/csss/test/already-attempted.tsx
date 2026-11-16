import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { buttonClasses } from "@/components/ui/button";

export function AlreadyAttempted({ testTitle }: { testTitle: string }) {
  return (
    <div className="min-h-screen bg-bg-light">
      <Container className="flex min-h-screen items-center justify-center py-16">
        <div className="w-full max-w-[520px] rounded-2xl border border-ink/10 bg-white p-8 text-center sm:p-10">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#2f9e5b]/12 text-[#2f9e5b]">
            <CheckCircle2 className="h-7 w-7" strokeWidth={2} />
          </span>
          <h1 className="mt-6 text-2xl font-extrabold tracking-[-0.02em] text-ink">
            You have already attempted this test
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink/60">
            <span className="font-semibold text-ink">{testTitle}</span> can be
            written only once, so the attempt is closed. Your score and
            section-wise analysis are saved in My Progress.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/progress" className={buttonClasses("primary", "md")}>
              View my result
            </Link>
            <Link
              href="/csss"
              className={buttonClasses("outline", "md")}
            >
              Browse other tests
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
