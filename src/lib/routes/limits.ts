/**
 * Small, dependency-free counts shared with the proxy so that unknown
 * practice URLs answer with a real 404 before any page renders.
 * Keep in sync with src/lib/wat/config.ts, src/lib/tat/config.ts,
 * src/lib/srt/config.ts, src/lib/dossier/data.ts (DAYS) and
 * src/lib/ppdt/config.ts (SETS).
 */
export const WAT_SET_COUNT = 21;
export const TAT_SET_COUNT = 25;
export const DOSSIER_DAY_COUNT = 15;
export const PPDT_SET_SLUGS = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"] as const;
export const SRT_SET_SLUGS = ["set-1", "set-4", "set-5", "set-11", "practice-set-4"] as const;

export function isSetInRange(raw: string, count: number): boolean {
  return /^\d+$/.test(raw) && Number(raw) >= 1 && Number(raw) <= count;
}
