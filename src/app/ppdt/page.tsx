import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { DraftSheet } from "@/components/ppdt/draft-sheet";

export const metadata: Metadata = {
  title: "PPDT — Picture Perception & Picture Description | Learners Park",
  description:
    "How to write and narrate a PPDT story: written, verbal and body-language guidance, do's and don'ts, and the exact answer-sheet format.",
};

const GUIDELINES = [
  {
    title: "Written",
    items: [
      "Writing should be neat and tidy.",
      "Do not write too much or too little.",
      "Use of correct grammar is essential and paramount.",
      "Avoid cutting and overwriting so that your work remains neat enough.",
    ],
  },
  {
    title: "Verbal",
    items: [
      "Voice to be loud and clear to be heard.",
      "Do not speak too much or little.",
      "Use, and frame correct sentences and grammar.",
      "Do not use any slang.",
    ],
  },
  {
    title: "Body language",
    items: [
      "Posture should be correct.",
      "Always wear a smile on your face.",
      "Maintain proper eye contact but 'not staring'.",
      "Avoid unnecessary gestures and excessive hand movements.",
    ],
  },
];

const DOS = [
  "Professional ideas should be there.",
  "Facts → scheme, solution, conclusion and implications.",
  "Current affairs, scientific things, proper construction, practical — should be legal only.",
  "Show team leadership, sportsmanship.",
  "Character, mood and gender shouldn't be missed.",
  "Keep the stories simple and crisp.",
  "Stereotypes and social myths shouldn't be there in the story.",
  "Hero's ideas should match his/her profession or experience.",
];

const DONTS = [
  "No villain should be there in the story.",
  "No use of modals should be there — not, can, could, never, always etc.",
  "Nothing should be written against the authority.",
  "No advice should be given.",
  "Instead of the word 'problem', use words like situation, challenges etc. (but not too much).",
  "Don't add complex stuff you have no idea or experience of.",
  "Don't go with ideas of war or defence unless really needed.",
  "No expectation of awards should be showcased in the story, and no 'preaching'.",
];

const STORY_STEPS = [
  "Observe the picture carefully.",
  "Identify the characters.",
  "Estimate their age and identify gender and mood.",
  "Select the main character.",
  "Understand the situation.",
  "Establish a realistic objective.",
  "Describe practical actions taken by the protagonist.",
  "Show a logical and positive outcome where the situation supports it.",
];

function ArrowList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-sm leading-relaxed text-ink/75">
          <span aria-hidden="true" className="mt-px text-crimson">→</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function PpdtPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-bg-light">
        <Container className="py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="text-xs font-semibold text-ink/45">
            <Link href="/ssb" className="hover:text-crimson">SSB</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span>PPDT</span>
          </nav>

          <p className="mt-6 text-xs font-bold tracking-[0.16em] text-crimson uppercase">PPDT · Day 1 · Screening</p>
          <h1 className="mt-3 max-w-3xl text-[clamp(2rem,4.5vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">
            Picture Perception &amp; Picture Description
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/65">
            One picture, thirty seconds to look, four minutes to write, then narrate and agree a common
            story with your group.
          </p>
          <p className="mt-3 text-xs text-ink/45">
            This is a practice structure, not an official assessment. Task order and timing vary by board
            and entry.
          </p>
          <p className="mt-4 inline-flex rounded-full border border-gold/50 bg-gold/15 px-3 py-1 text-xs font-semibold text-[#7a5c10]">
            Reference notes only — practice test coming
          </p>

          {/* Written / verbal / body language */}
          <section className="mt-12" aria-labelledby="communication">
            <h2 id="communication" className="text-xl font-bold text-ink">Communication basics</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {GUIDELINES.map((g) => (
                <div key={g.title} className="rounded-2xl border border-ink/10 bg-white p-5">
                  <h3 className="text-xs font-bold tracking-[0.14em] text-ink/50 uppercase">{g.title}</h3>
                  <div className="mt-3"><ArrowList items={g.items} /></div>
                </div>
              ))}
            </div>
          </section>

          {/* Do's and Don'ts */}
          <section className="mt-12" aria-labelledby="dos-donts">
            <p className="text-xs font-bold tracking-[0.14em] text-ink/45 uppercase">PPDT story — Do&apos;s &amp; Don&apos;ts</p>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-[#2f9e5b]/25 bg-white p-5">
                <h2 id="dos-donts" className="text-sm font-bold tracking-[0.14em] text-[#256e42] uppercase">Do&apos;s</h2>
                <ol className="mt-3 space-y-2">
                  {DOS.map((item, i) => (
                    <li key={item} className="flex gap-2 text-sm leading-relaxed text-ink/75">
                      <span aria-hidden="true" className="font-semibold text-[#256e42]">{i + 1}.</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="rounded-2xl border border-crimson/20 bg-white p-5">
                <h2 className="text-sm font-bold tracking-[0.14em] text-crimson uppercase">Don&apos;ts</h2>
                <ol className="mt-3 space-y-2">
                  {DONTS.map((item, i) => (
                    <li key={item} className="flex gap-2 text-sm leading-relaxed text-ink/75">
                      <span aria-hidden="true" className="font-semibold text-crimson">{i + 1}.</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          {/* Format */}
          <section className="mt-12" aria-labelledby="format">
            <h2 id="format" className="text-xl font-bold text-ink">Format of PPDT</h2>

            <div className="mt-4 rounded-2xl border border-ink/10 bg-white p-5 sm:p-6">
              <div className="grid gap-x-8 gap-y-3 text-sm text-ink/75 sm:grid-cols-2">
                {[
                  ["Name", "Roll Number"],
                  ["Chest No.", "Batch Number"],
                ].map((row) =>
                  row.map((label) => (
                    <p key={label} className="flex items-baseline gap-2">
                      <span className="font-semibold text-ink/60">{label}:</span>
                      <span className="flex-1 border-b border-dashed border-ink/25" />
                    </p>
                  )),
                )}
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_240px]">
                {/* Answer sheet box */}
                <figure>
                  <div className="relative aspect-[16/10] w-full rounded-md border-2 border-ink/70">
                    <div className="absolute left-[10%] top-[12%] flex flex-col items-center rounded-full border-2 border-crimson px-4 py-3">
                      <span className="text-sm font-bold text-ink">F</span>
                      <span className="text-sm font-bold text-ink">26</span>
                      <span className="text-sm font-bold text-ink">+</span>
                    </div>
                    <div className="absolute right-[18%] top-[14%] flex flex-col items-center">
                      <span className="text-sm font-bold text-ink">F</span>
                      <span className="text-sm font-bold text-ink">40</span>
                      <span className="text-sm font-bold text-ink">-</span>
                    </div>
                    <div className="absolute bottom-[16%] left-1/2 flex -translate-x-1/2 flex-col items-center">
                      <span className="text-sm font-bold text-ink">M</span>
                      <span className="text-sm font-bold text-ink">45</span>
                      <span className="text-sm font-bold text-ink">O</span>
                    </div>
                  </div>
                  <figcaption className="mt-2 text-xs text-ink/50">
                    Each annotation reads letter · age · mood. The circled one, top left, is the main
                    character.
                  </figcaption>
                </figure>

                {/* Legends */}
                <div className="space-y-4">
                  <div className="rounded-xl border border-ink/10 p-4">
                    <h3 className="text-xs font-bold tracking-[0.12em] text-ink/50 uppercase">Mood</h3>
                    <dl className="mt-2 space-y-1 text-sm text-ink/75">
                      <div className="flex gap-2"><dt className="w-4 font-semibold">O</dt><dd>Neutral</dd></div>
                      <div className="flex gap-2"><dt className="w-4 font-semibold">+</dt><dd>Positive</dd></div>
                      <div className="flex gap-2"><dt className="w-4 font-semibold">-</dt><dd>Negative</dd></div>
                    </dl>
                  </div>
                  <div className="rounded-xl border border-ink/10 p-4">
                    <h3 className="text-xs font-bold tracking-[0.12em] text-ink/50 uppercase">Gender</h3>
                    <dl className="mt-2 space-y-1 text-sm text-ink/75">
                      <div className="flex gap-2"><dt className="w-4 font-semibold">F</dt><dd>Female</dd></div>
                      <div className="flex gap-2"><dt className="w-4 font-semibold">M</dt><dd>Male</dd></div>
                    </dl>
                  </div>
                </div>
              </div>

              <p className="mt-5 rounded-lg border border-crimson/20 bg-crimson/5 px-4 py-3 text-sm text-ink/75">
                <span className="font-semibold text-crimson">Action:</span> what&apos;s your perspective from the
                picture that&apos;s shown.
              </p>

              <div className="mt-5 rounded-xl border border-ink/15 p-4">
                <h3 className="text-xs font-bold tracking-[0.12em] text-ink/50 uppercase">Things to remember</h3>
                <ul className="mt-2 space-y-2">
                  <li className="flex gap-2 text-sm text-ink/75"><span aria-hidden="true" className="text-crimson">•</span>The main character should be circled.</li>
                  <li className="flex gap-2 text-sm text-ink/75"><span aria-hidden="true" className="text-crimson">•</span>If you see no character in the picture, then make a dot outside the box and add details like gender, mood, and age.</li>
                </ul>
              </div>

              <p className="mt-5 flex items-center gap-2 rounded-lg bg-gold/15 px-4 py-3 text-sm font-semibold text-[#6b520f]">
                <span aria-hidden="true">⏱</span>
                Things should be done under 4 minutes. (Try to keep the story positive.)
              </p>
            </div>
          </section>

          {/* Story sequence */}
          <section className="mt-12" aria-labelledby="story">
            <h2 id="story" className="text-xl font-bold text-ink">Story development</h2>
            <ol className="mt-4 grid gap-3 sm:grid-cols-2">
              {STORY_STEPS.map((step, i) => (
                <li key={step} className="flex gap-3 rounded-xl border border-ink/10 bg-white p-4 text-sm text-ink/75">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
            <p className="mt-3 text-sm text-ink/55">
              Keep the story consistent with the picture: realistic situations, practical solutions,
              initiative, cooperation, leadership, responsibility and a clear conclusion. Follow the
              timing instructions given at your own board.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="draft">
            <h2 id="draft" className="sr-only">Draft sheet</h2>
            <DraftSheet />
          </section>

          <p className="mt-8 text-sm text-ink/50">
            <Link href="/ssb" className="font-semibold text-crimson hover:underline">← Back to the 17 SSB tests</Link>
          </p>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
