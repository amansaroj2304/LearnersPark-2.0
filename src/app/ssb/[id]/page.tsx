import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { getSsbTest, isKnownSsbTestId, isOpen } from "@/lib/ssb/data";
import { PRACTICE_HREF } from "@/lib/ssb/practice";

export const instant = false;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  if (!isKnownSsbTestId(id)) return { title: "Page not found | Learners Park" };
  const test = await getSsbTest(id).catch(() => null);
  if (!test) return { title: "Page not found | Learners Park" };
  return {
    title: `${test.name} (${test.full_form}) — SSB practice | Learners Park`,
    description: test.description,
  };
}

export default async function SsbTestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Reject unknown ids before the dynamic shell is streamed, so the status is a real 404.
  if (!isKnownSsbTestId(id)) notFound();
  await connection();
  const test = await getSsbTest(id).catch(() => null);
  if (!test) notFound();

  if (!isOpen(test)) {
    return (
      <>
        <SiteHeader />
        <main className="bg-bg-light">
          <Container className="py-16">
            <h1 className="text-2xl font-extrabold text-ink">{test.name} is not open yet</h1>
            <p className="mt-2 text-sm text-ink/65">
              {PRACTICE_HREF[test.id]
                ? "The practice module is live — start practising there while the formal test window is closed."
                : "This practice module will be available soon."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {PRACTICE_HREF[test.id] ? (
                <Link href={PRACTICE_HREF[test.id]} className="inline-flex h-10 items-center rounded-lg bg-crimson px-5 text-sm font-semibold text-white">
                  Practice
                </Link>
              ) : null}
              <Link
                href="/ssb"
                className={`inline-flex h-10 items-center rounded-lg px-5 text-sm font-semibold ${PRACTICE_HREF[test.id] ? "border border-ink/15 text-ink hover:bg-ink/5" : "bg-crimson text-white"}`}
              >
                Back to SSB
              </Link>
            </div>
          </Container>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="bg-bg-light">
        <Container className="py-12 sm:py-16">
          <Link href="/ssb" className="text-sm font-semibold text-crimson hover:underline">← All SSB tests</Link>
          <p className="mt-4 text-xs font-bold tracking-[0.14em] text-ink/45 uppercase">
            Test {test.test_no} · Day {test.day} · {test.category}
          </p>
          <h1 className="mt-2 text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold tracking-[-0.03em] text-ink">
            {test.name}
          </h1>
          <p className="text-sm text-ink/50">{test.full_form}</p>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/65">{test.description}</p>
          <div className="mt-6 rounded-2xl border border-ink/10 bg-white p-6">
            <h2 className="text-sm font-bold tracking-[0.12em] text-ink/45 uppercase">Instructions</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink/70">
              {test.instructions || "Instructions for this test will be shown here before you begin."}
            </p>
          </div>
          <p className="mt-4 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-[#6b520f]">
            The interactive practice for this test is being added. Your access is recorded and it opens
            without any change on your side.
          </p>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
