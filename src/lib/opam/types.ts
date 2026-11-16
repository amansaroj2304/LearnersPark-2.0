export type Part = 1 | 2 | 3;
export type Answer = "A" | "B" | "C" | "D";

export interface QRow {
  id: string;
  setId: number;
  part: Part;
  qnum: number;
  format: "agree" | "ab" | "abcd";
  text: string;
  keyed: "P" | "N" | null;
  pair: string | null;
  optionA: string | null;
  optionB: string | null;
  options: string[] | null;
  bestIndex: number | null;
  acceptable: number[];
  rationales: string[] | null;
  olq: string[];
  olqA: string[];
  olqB: string[];
}

/** Safe shape sent to the browser before submission. */
export interface PublicQuestion {
  id: string;
  part: Part;
  qnum: number;
  format: "agree" | "ab" | "abcd";
  text: string;
  optionA: string | null;
  optionB: string | null;
  options: string[] | null;
}

export const OLQ = [
  ["EI", "Effective Intelligence", "Practical problem-solving, situational awareness and the ability to use what is available.", "You tend to find a workable route through a problem rather than waiting for a perfect one.", "Practise reading the constraints in a situation before choosing a response."],
  ["RA", "Reasoning Ability", "Logical analysis, weighing evidence, cause and effect.", "You usually test a claim before acting on it.", "Practise separating what you know from what you assume in a fast decision."],
  ["OA", "Organising Ability", "Planning, sequencing, resource management and follow-through.", "You tend to structure work and keep it structured.", "Practise planning one recurring weekly commitment in writing and reviewing it."],
  ["PE", "Power of Expression", "Clarity in speech and writing; getting an idea across the first time.", "Your explanations are usually understood without repetition.", "Practise a three-sentence brief: situation, decision, next step."],
  ["SA", "Social Adaptability", "Adjusting to people, cultures and unfamiliar situations.", "You adjust to different people without losing your own footing.", "Seek out one unfamiliar group setting a month and contribute in it."],
  ["CO", "Cooperation", "Working with others, team orientation, give and take.", "You work with a team rather than around it.", "Practise finishing a group task without needing the credit for it."],
  ["SR", "Sense of Responsibility", "Ownership, accountability, keeping commitments.", "You own outcomes, including the unpopular ones.", "Practise closing commitments in writing and reconciling them weekly."],
  ["IN", "Initiative", "Acting without being told; spotting what is needed and starting it.", "You start what is needed before being asked.", "Practise volunteering for one responsibility each week that nobody wants."],
  ["SC", "Self Confidence", "Belief in your own ability, poise and recovery from setbacks.", "You hold your ground and recover quickly from being wrong.", "Practise stating a considered opinion in a room where it may be contested."],
  ["SD", "Speed of Decision", "Deciding in time rather than over-deliberating.", "You decide with the information available rather than waiting for certainty.", "Practise deciding one low-stakes choice per day within a fixed time limit."],
  ["IG", "Ability to Influence the Group", "Persuading, setting tone, leading without relying on rank.", "You move a group by argument and example rather than by pressure.", "Practise proposing one concrete improvement to a group you belong to."],
  ["LV", "Liveliness", "Energy, enthusiasm and positive presence.", "You bring energy into a room rather than taking it out.", "Practise protecting sleep and training so your energy is not mood-dependent."],
  ["DT", "Determination", "Persistence, refusing to give up, sustained effort.", "You stay with a task after the interest has gone.", "Practise one difficult commitment held for a fixed number of weeks."],
  ["CG", "Courage", "Physical and moral courage; standing up for what is right.", "You are willing to pay a personal cost for a correct course of action.", "Practise one uncomfortable conversation per week instead of postponing it."],
  ["ST", "Stamina", "Endurance, physical and mental resilience over time.", "You sustain output across long, unglamorous stretches.", "Practise a fixed weekly endurance routine, independent of how you feel."],
] as const;

export const OLQ_CODES = OLQ.map((o) => o[0]);
export const OLQ_NAMES: Record<string, string> = Object.fromEntries(OLQ.map((o) => [o[0], o[1]]));

export const PART_LABEL: Record<Part, string> = {
  1: "Personality Profiling",
  2: "Forced Choice",
  3: "Situational Judgement",
};

export const OPAM_DISCLAIMER =
  "Read this first. This is an independent practice assessment. It is not an official Services Selection Board instrument, it has not been normed on a selection population, and it does not predict selection. It is a mirror with a time limit — useful for spotting your own answering patterns, worthless as a verdict.";
