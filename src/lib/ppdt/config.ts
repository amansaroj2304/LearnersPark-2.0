export interface PpdtSample {
  title: string;
  character: string;
  action: string;
  story?: string;
}

export interface PpdtSet {
  id: number;
  slug: string;
  title: string;
  image: string;
  alt: string;
}

export const PHASES = [
  { name: "perception", durationSeconds: 30, description: "Picture displayed; observe and form a story." },
  { name: "writing", durationSeconds: 240, description: "Blank sheet; write the story." },
] as const;

export const SETS: PpdtSet[] = [
  ["one", 1], ["two", 2], ["three", 3], ["four", 4], ["five", 5],
  ["six", 6], ["seven", 7], ["eight", 8], ["nine", 9], ["ten", 10],
].map(([slug, id]) => ({
  id: id as number,
  slug: slug as string,
  title: `PPDT Test Set ${id}`,
  image: `/images/ppdt/${slug}.jpg`,
  alt: "SSB PPDT - Perception and description test",
}));

export const PRACTICE = {
  image: "/images/ppdt/practice-one.jpg",
  alt: "SSB PPDT - Perception and description test (practice)",
  samples: [
    {
      title: "Story 1",
      character: "M-40/Neutral(0), F-28/Neutral(0)",
      action: "Ensuring passengers safety during turbulence.",
    },
    {
      title: "Story 2",
      character: "M-38/Positive(+), F-23/Positive(+)",
      action: "Preparing for National Shooting.",
      story:
        "Ritika was a pistol player in the junior women's category and was taking training under an accomplished coach for upcoming national games' trials. She was also a graduate student and was managing her studies and sports well with the support of college, parents, and coaches. She practiced hard for the trials and discussed every minute mistake made by her with the coach. She continued to improve her shooting score with this approach and performed very well in the trials. Not only did she qualify to be in the national team, but she also represented her country at various international tournaments and brought back home several medals.",
    },
  ] as PpdtSample[],
};

export function getSet(slug: string) {
  return SETS.find((s) => s.slug === slug) ?? null;
}
