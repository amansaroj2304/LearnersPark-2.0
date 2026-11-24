export const TAT_TIMINGS = {
  /** The picture stays on screen for 30 seconds. */
  lookSeconds: 30,
  /** 4 minutes 30 seconds to write after the picture is withdrawn. */
  writeSeconds: 4 * 60 + 30,
} as const;

/** Pictures per set, as in the SSB TAT (11 pictures, usually followed by a blank slide). */
export const PICTURES_PER_SET = 11;

/** Only the sets whose pictures have been published are listed. */
export const SET_COUNT = 25;

export interface TatSet {
  id: number;
  slug: string;
  title: string;
  images: string[];
  alt: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

export function buildSet(id: number): TatSet {
  return {
    id,
    slug: String(id),
    title: `TAT Set ${pad(id)}`,
    images: Array.from({ length: PICTURES_PER_SET }, (_, i) => `/images/tat/set${pad(id)}/p${pad(i + 1)}.jpg`),
    alt: "SSB TAT practice picture",
  };
}

export const SETS: TatSet[] = Array.from({ length: SET_COUNT }, (_, i) => buildSet(i + 1));

export function getSet(id: number): TatSet | null {
  return Number.isInteger(id) && id >= 1 && id <= SET_COUNT ? buildSet(id) : null;
}
