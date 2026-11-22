import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = {
  title: "PPDT — Picture Perception & Discussion Test | Learners Park",
  description:
    "The Day 1 screening sequence as it is usually practised, the rules for writing and narrating a PPDT story, and the exact format of the answer sheet.",
};

type Block = { title: string; items: [string, string][] };

const WALKTHROUGH: Block[] = [
  {
    title: "Pre-Testing & Building Rapport",
    items: [
      ["Social Compatibility", "Make friends, talk to them! They are not your competitors."],
      [
        "The Neighbourhood Strategy",
        "Talk to the people around (+5 and -5 to your chest number)... so that when discussion takes place, they will not dominate you at least!",
      ],
    ],
  },
  {
    title: "Officers' Intelligence Test (OIR)",
    items: [
      ["Confidence over Hesitation", "Since there is no negative marking, don't hesitate, and feel free!"],
      [
        "Weightage Reality",
        "According to me, the weightage is almost 10% of the screening of OIR. Rest 90% is of the PPDT.",
      ],
      [
        "Focus of Preparation",
        "DON'T PAY MUCH HEED TO OIR TESTS by practising OIR from various sources... Focus on the story writing and narration!",
      ],
    ],
  },
  {
    title: "PPDT: Picture Perception & Story Writing",
    items: [
      [
        "Professional Perception",
        "Perceive a normal resident or a doctor or, say, an engineer or some businessman.",
      ],
      [
        "Avoid Clichés",
        "Don't try to impress the officers by putting the ARMY story everywhere. Don't make stories on terrorists or Naxalites.",
      ],
      [
        "Character Alignment",
        "Mention the main character's age equal to your age, approximately. NEVER EVER CHANGE THE CHARACTER'S SEX IN THE IMAGE!",
      ],
      [
        "The Power of Positivity",
        "THE MOOD MUST BE POSITIVE! A positive MOOD in negative emotions will fetch good results! The main character WILL be in a positive mood ONLY.",
      ],
      [
        "Urgency and Pressure",
        "STORY MUST BE OPERATIONAL IN NATURE. Put some emergency in stories... LESS TIME means MORE PRESSURE ON YOU!",
      ],
      [
        "Action-Oriented Language",
        'Writing terms like "SO HE IMMEDIATELY", "SO HE URGENTLY", "SO HE QUICKLY", etc., will create a big impact!',
      ],
    ],
  },
  {
    title: "PPDT: Narration",
    items: [
      [
        'The "Lion" Demeanour',
        "BE SLOW, LOUD, LOOKING INTO EVERYONE'S EYES AS IF YOU ARE THE LION OF THE JUNGLE.",
      ],
      [
        "Pacing",
        "Don't pay attention to [the assessor saying narrate quickly]. Just take your own time.",
      ],
      [
        "Clarity of Thought",
        'The assessor will say "OKAY NEXT" only and only when he is sure that HE GOT YOUR IDEA.',
      ],
    ],
  },
  {
    title: "PPDT: Group Discussion (GD)",
    items: [
      [
        "The Initiation",
        "As soon as the last candidate finishes his/her story, you have to open your mouth and initiate.",
      ],
      [
        "The Goal of GD",
        'They want to see "HOW WE TALK TO EACH OTHER". That is it! Don\'t bother about the common story! It is just a game to be played!',
      ],
      [
        "Effective Contribution",
        "Speak twice or thrice. Not more than that. BUT, convince your group to take your story!",
      ],
      [
        "Avoid Fake Politeness",
        'Never say, "Let this candidate speak, he hasn\'t spoken yet." This is wrong.',
      ],
      [
        "Observational Skills",
        "OBSERVE very minutely what OTHERS WILL MISS OUT (attire, background, something in hand, etc.).",
      ],
      [
        "Breaking the Deadlock",
        'If NO ONE IS LISTENING TO ANYONE... speak "Friends NAME AND AGE". This small line will also attract attention.',
      ],
    ],
  },
  {
    title: "Critical Reminders",
    items: [
      ["Perceiving the Hazy", "Hazy pictures are easy to write, as no one has a correct perception of them!"],
      [
        "The Fresher Status",
        "The person who has not been screened in even in 2-3 attempts, FOR THE ASSESSOR, once you get screened in, you are STILL A FRESHER.",
      ],
    ],
  },
];

const GUIDELINES = [
  {
    title: "Written",
    items: [
      "Writing should be neat and tidy",
      "Do not write too much or too little.",
      "Use of correct grammar is essential and paramount.",
      "Avoid cutting and overwriting so that your work remains neat enough.",
    ],
  },
  {
    title: "Verbal",
    items: [
      "Voice to be loud and clear to be heard",
      "Do not speak too much or less",
      "Use, and frame correct sentences and grammar.",
      "Do not use any slang.",
    ],
  },
  {
    title: "Body language",
    items: [
      "Posture should be correct",
      "Always wear a smile on your face.",
      "Maintain proper eye contact but 'not staring'",
      "Avoid unnecessary gestures and excessive hand movements.",
    ],
  },
];

const DOS = [
  "Professional ideas should be there",
  "Facts → scheme, solution, conclusion and implications.",
  "Current affairs, scientific things, proper construction, practical — should be legal only",
  "Show team leadership, sportsmanship.",
  "Character, mood and gender shouldn't be missed.",
  "Keep the stories simple and crisp.",
  "Stereotypes and social myths shouldn't be there in the story.",
  "Hero's ideas should match his/her profession or experience.",
];

const DONTS = [
  "No villain should be there in the story",
  "No use of modals should be there — not, can, could, never, always etc.",
  "Nothing should be written against the authority",
  "No advice should be given",
  "Instead of the word 'problem', use words like situation, challenges etc. (but not too much)",
  "Don't add complex stuff you have no idea or experience of.",
  "Don't go with ideas of war or defence unless really needed",
  "No expectation of awards should be showcased in the story, and no 'preaching'",
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
      <style>{`
        @media print {
          @page { size: A4; margin: 15mm; }
          .ppdt-box { width: 3in !important; height: 3in !important; break-inside: avoid; }
        }
      `}</style>
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
            Picture Perception &amp; Discussion Test
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
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/ppdt/practice" className="inline-flex h-10 items-center rounded-lg bg-crimson px-5 text-sm font-semibold text-white hover:bg-crimson-shape">
              Practice with the picture visible
            </Link>
            <Link href="/ppdt/sets" className="inline-flex h-10 items-center rounded-lg border border-ink/15 px-5 text-sm font-semibold text-ink hover:bg-ink/5">
              10 timed sets
            </Link>
          </div>

          {/* Day 1 walkthrough */}
          <section className="mt-12" aria-labelledby="day1">
            <h2 id="day1" className="text-xl font-bold text-ink">Day 1, start to finish</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/60">
              Notes, not directives — this reflects one mentor&apos;s reading of the screening stage.
              Day 1 notes, adapted from a mentor&apos;s briefing.
            </p>
            <div className="mt-5 space-y-4">
              {WALKTHROUGH.map((block, i) => (
                <div key={block.title} className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6">
                  <h3 className="flex items-baseline gap-3 text-base font-bold text-ink">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    {block.title}
                  </h3>
                  <ul className="mt-3 space-y-2.5">
                    {block.items.map(([lead, text]) => (
                      <li key={lead} className="flex gap-2 text-sm leading-relaxed text-ink/75">
                        <span aria-hidden="true" className="mt-px text-crimson">→</span>
                        <span><strong className="font-semibold text-ink">{lead}:</strong> {text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

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
                <div className="mt-3"><ArrowList items={DOS} /></div>
              </div>
              <div className="rounded-2xl border border-crimson/20 bg-white p-5">
                <h2 className="text-sm font-bold tracking-[0.14em] text-crimson uppercase">Don&apos;ts</h2>
                <div className="mt-3"><ArrowList items={DONTS} /></div>
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
                <figure className="flex flex-col items-center">
                  <div
                    className="ppdt-box relative rounded-sm border-2 border-ink/70"
                    style={{ width: "min(3in, 100%)", aspectRatio: "1 / 1" }}
                  >
                    <div className="absolute left-[8%] top-[10%] flex flex-col items-center rounded-full border-2 border-crimson px-3 py-2">
                      <span className="text-sm font-bold text-ink">F</span>
                      <span className="text-sm font-bold text-ink">26</span>
                      <span className="text-sm font-bold text-ink">+</span>
                    </div>
                    <div className="absolute right-[12%] top-[12%] flex flex-col items-center">
                      <span className="text-sm font-bold text-ink">F</span>
                      <span className="text-sm font-bold text-ink">40</span>
                      <span className="text-sm font-bold text-ink">-</span>
                    </div>
                    <div className="absolute bottom-[12%] left-1/2 flex -translate-x-1/2 flex-col items-center">
                      <span className="text-sm font-bold text-ink">M</span>
                      <span className="text-sm font-bold text-ink">45</span>
                      <span className="text-sm font-bold text-ink">O</span>
                    </div>
                  </div>
                  <figcaption className="mt-2 text-center text-xs text-ink/50">
                    Each annotation reads letter · age · mood. The circled one, top left, is the main
                    character. The box is 3 in × 3 in and prints at that size on A4.
                  </figcaption>
                </figure>

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
                  <li className="flex gap-2 text-sm text-ink/75"><span aria-hidden="true" className="text-crimson">•</span>The main character should be circled</li>
                  <li className="flex gap-2 text-sm text-ink/75"><span aria-hidden="true" className="text-crimson">•</span>If you see no character in the picture, then make a dot outside the box and add details like gender, mood, and age.</li>
                </ul>
              </div>

              <p className="mt-5 flex items-center gap-2 rounded-lg bg-gold/15 px-4 py-3 text-sm font-semibold text-[#6b520f]">
                <span aria-hidden="true">⏱</span>
                Things should be done under 4 minutes. (Try to keep the story positive.)
              </p>
            </div>
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
