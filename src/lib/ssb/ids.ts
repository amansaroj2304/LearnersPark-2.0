/**
 * The 17 fixed SSB test ids, shared by the page and the proxy.
 * Keeping this list free of server-only imports lets the proxy reject unknown
 * /ssb/<id> URLs before the page renders, so they answer with a real 404.
 */
export const SSB_TEST_IDS = [
  "oir",
  "ppdt",
  "tat",
  "wat",
  "srt",
  "sdt",
  "gd",
  "gpe",
  "pgt",
  "hgt",
  "lecturette",
  "individual-obstacles",
  "command-task",
  "snake-race",
  "final-group-task",
  "personal-interview",
  "ssb-conference",
] as const;

export function isKnownSsbTestId(id: string): boolean {
  return (SSB_TEST_IDS as readonly string[]).includes(id);
}
