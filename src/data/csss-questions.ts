export type CsssQuestion = {
  id: number;
  flash?: string;
  visual?: string;
  cue?: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type CsssSection = {
  code: string;
  name: string;
  questionCount: number;
  description: string;
  secondsPerQuestion: number;
};

export const csssSections: CsssSection[] = [
  {
    code: "A",
    name: "Working Memory",
    questionCount: 15,
    description:
      "A short sequence of numbers or words flashes on screen. Memorise it, then answer the question from memory.",
    secondsPerQuestion: 5,
  },
  {
    code: "B",
    name: "Spatial Perception",
    questionCount: 15,
    description:
      "Picture shapes rotating, folding and combining in space. Choose the option that matches the transformation.",
    secondsPerQuestion: 12,
  },
  {
    code: "C",
    name: "Verbal + Non-verbal Reasoning",
    questionCount: 15,
    description:
      "Number and letter series, and odd-one-out sets. Find the rule (+, ×, squares, primes) and pick the next or odd element.",
    secondsPerQuestion: 10,
  },
  {
    code: "D",
    name: "Linguistic Ability",
    questionCount: 15,
    description:
      "Grammar, vocabulary and sentence structure. Choose the correct word or the best correction to the underlined part.",
    secondsPerQuestion: 6,
  },
  {
    code: "E",
    name: "Auditory Discrimination",
    questionCount: 10,
    description:
      "Compare similar-sounding words and letter sounds. Pick the option that matches what you heard.",
    secondsPerQuestion: 6,
  },
];

export const csssTotalQuestions = csssSections.reduce(
  (total, section) => total + section.questionCount,
  0,
);

export const csssSectionStarts: number[] = csssSections.map((_, index) =>
  csssSections
    .slice(0, index)
    .reduce((total, section) => total + section.questionCount, 0),
);

export function sectionIndexForQuestion(questionIndex: number): number {
  for (let index = 0; index < csssSections.length; index += 1) {
    const start = csssSectionStarts[index];
    if (questionIndex < start + csssSections[index].questionCount) {
      return index;
    }
  }
  return csssSections.length - 1;
}

export const csssTestMeta = {
  title: "CSSS Mock Test 01",
  durationMinutes: 10,
  marksCorrect: 3,
  marksWrong: 1,
};

const realQuestions: Record<number, CsssQuestion> = {
  0: {
    id: 1,
    flash: "4 · 9 · 2 · 7",
    prompt: "Which number occupied position three?",
    options: ["2", "4", "7", "9"],
    answer: 0,
    explanation: "The sequence was 4 · 9 · 2 · 7, so position three held 2.",
  },
  1: {
    id: 2,
    flash: "8 · 1 · 6 · 3",
    prompt: "Which number appeared at the end?",
    options: ["1", "3", "6", "8"],
    answer: 1,
    explanation: "The sequence was 8 · 1 · 6 · 3, so the final value was 3.",
  },
  2: {
    id: 3,
    flash: "5 · 2 · 9 · 4",
    prompt: "Which number opened the sequence?",
    options: ["2", "4", "5", "9"],
    answer: 2,
    explanation: "The sequence 5 · 2 · 9 · 4 opened with 5.",
  },
  3: {
    id: 4,
    flash: "7 · 3 · 8 · 1",
    prompt: "Select the value in position two.",
    options: ["1", "3", "7", "8"],
    answer: 1,
    explanation: "Position two of 7 · 3 · 8 · 1 held 3.",
  },
  4: {
    id: 5,
    flash: "6 · 4 · 1 · 8",
    prompt: "Recall the value in the third slot.",
    options: ["1", "4", "6", "8"],
    answer: 0,
    explanation: "The third slot of 6 · 4 · 1 · 8 held 1.",
  },
  5: {
    id: 6,
    flash: "9 · 5 · 2 · 6",
    prompt: "Select the final value.",
    options: ["2", "5", "6", "9"],
    answer: 2,
    explanation: "The final value of 9 · 5 · 2 · 6 was 6.",
  },
  6: {
    id: 7,
    flash: "3 · 8 · 5 · 0",
    prompt: "Which value followed the first one?",
    options: ["0", "3", "5", "8"],
    answer: 3,
    explanation: "The value after the first (3) in 3 · 8 · 5 · 0 was 8.",
  },
  7: {
    id: 8,
    flash: "1 · 7 · 4 · 9",
    prompt: "Select its opening value.",
    options: ["1", "4", "7", "9"],
    answer: 0,
    explanation: "The sequence 1 · 7 · 4 · 9 opened with 1.",
  },
  8: {
    id: 9,
    flash: "4 · 8 · 2",
    prompt: "Which transformed sequence is correct? (each +1)",
    options: ["5 · 9 · 3", "4 · 9 · 2", "5 · 8 · 3", "3 · 7 · 1"],
    answer: 0,
    explanation: "Adding 1 to each of 4 · 8 · 2 gives 5 · 9 · 3.",
  },
  9: {
    id: 10,
    flash: "7 · 2 · 9 · 4",
    prompt: "Which pair was adjacent in the original order?",
    options: ["7 · 2", "2 · 4", "9 · 7", "4 · 2"],
    answer: 0,
    explanation: "In 7 · 2 · 9 · 4, the pair 7 · 2 were adjacent.",
  },
  10: {
    id: 11,
    flash: "red · blue · green · yellow",
    prompt: "Which colour came immediately before green?",
    options: ["Red", "Blue", "Green", "Yellow"],
    answer: 1,
    explanation:
      "In red · blue · green · yellow, blue came immediately before green.",
  },
  11: {
    id: 12,
    flash: "2 · 6 · 0 · 5",
    prompt: "Reverse the order. Which is correct?",
    options: ["5 · 0 · 6 · 2", "2 · 0 · 6 · 5", "5 · 6 · 0 · 2", "0 · 5 · 6 · 2"],
    answer: 0,
    explanation: "Reversing 2 · 6 · 0 · 5 gives 5 · 0 · 6 · 2.",
  },
  12: {
    id: 13,
    flash: "7 · 1 · 5 · 4",
    prompt: "Select the value held in slot three.",
    options: ["1", "4", "5", "7"],
    answer: 2,
    explanation: "The third slot of 7 · 1 · 5 · 4 held 5.",
  },
  13: {
    id: 14,
    prompt:
      "Ignore the ink colour; select the written word: GREEN shown in red ink.",
    options: ["RED", "BLUE", "GREEN", "YELLOW"],
    answer: 2,
    explanation:
      "Stroop task: read the written word (GREEN) and ignore the red ink.",
  },
  14: {
    id: 15,
    flash: "6 · 9 · 0 · 3",
    prompt: "Recall the closing value.",
    options: ["0", "3", "6", "9"],
    answer: 1,
    explanation: "The closing value of 6 · 9 · 0 · 3 was 3.",
  },
  15: {
    id: 16,
    visual: "mirror_vertical",
    prompt: "A vertical mirror flips the top-left mark. Where will the mark appear?",
    options: ["Top-left", "Top-right", "Bottom-left", "Bottom-right"],
    answer: 1,
    explanation:
      "A horizontal mirror swaps left and right, so the top-left mark moves to the top-right.",
  },
  16: {
    id: 17,
    visual: "water_reflection",
    prompt: "Where should the marked point appear in its water reflection?",
    options: ["Top-left", "Top-right", "Bottom-left", "Bottom-right"],
    answer: 2,
    explanation:
      "A water reflection flips top and bottom, so the top-left point appears at the bottom-left.",
  },
  17: {
    id: 18,
    visual: "rotation_cw90",
    prompt: "A square turns 90° clockwise. Which edge receives the top mark?",
    options: ["Left", "Right", "Top", "Bottom"],
    answer: 1,
    explanation:
      "A 90° clockwise turn moves the top edge to the right, so the mark lands on the right edge.",
  },
  18: {
    id: 19,
    visual: "path_nes",
    prompt: "Route: north, east, then south by the same distance. Where are you from start?",
    options: ["West", "East", "North", "At the start"],
    answer: 1,
    explanation:
      "North then south cancel out, leaving the eastward move; you end due east of the start.",
  },
  19: {
    id: 20,
    visual: "cube_roll",
    prompt: "A cube rolls forward once. Where does the top dot move?",
    options: ["Bottom", "Front", "Back", "It stays on top"],
    answer: 1,
    explanation:
      "Rolling forward tips the cube so the top face moves to the front.",
  },
  20: {
    id: 21,
    visual: "direction_turns",
    prompt: "You face east, turn left, then left again. Which way do you face?",
    options: ["North", "South", "East", "West"],
    answer: 3,
    explanation: "Facing east, two left turns (180°) leave you facing west.",
  },
  21: {
    id: 22,
    visual: "grid_rotation_cw90",
    prompt: "Mark starts bottom-right; grid rotates 90° clockwise. Where is it?",
    options: ["Top-right", "Top-left", "Bottom-left", "Bottom-right"],
    answer: 2,
    explanation:
      "A 90° clockwise grid turn moves the bottom-right mark to the bottom-left.",
  },
  22: {
    id: 23,
    visual: "line_mirror_horizontal",
    prompt: "Line reflected across a horizontal mirror — what happens?",
    options: [
      "It slopes downward",
      "It becomes vertical",
      "It keeps the same slope",
      "It disappears",
    ],
    answer: 0,
    explanation:
      "A horizontal mirror reverses the vertical direction, so a line rising to the right now falls to the right.",
  },
  23: {
    id: 24,
    visual: "arrow_rotate_ccw90",
    prompt: "Downward arrow rotates 90° anticlockwise. Which way does it point?",
    options: ["Right", "Left", "Up", "Down"],
    answer: 0,
    explanation: "A 90° anticlockwise turn points a downward arrow to the right.",
  },
  24: {
    id: 25,
    visual: "coordinate_nw",
    prompt: "Marker moves two cells north and one cell west from centre. Where is it?",
    options: ["Upper-left", "Upper-right", "Lower-left", "Lower-right"],
    answer: 0,
    explanation:
      "Two cells north and one cell west lands up and to the left of centre.",
  },
  25: {
    id: 26,
    visual: "line_mirror_vertical",
    prompt: "Vertical line after reflection across a vertical axis?",
    options: [
      "It becomes horizontal",
      "It remains vertical",
      "It becomes diagonal",
      "It vanishes",
    ],
    answer: 1,
    explanation:
      "A vertical line reflected across a vertical axis lies along the same line, so it stays vertical.",
  },
  26: {
    id: 27,
    visual: "path_e3n1",
    prompt: "Path: east three steps, then north one step. Which displacement matches?",
    options: [
      "Three west, one south",
      "Three east, one north",
      "One east, three north",
      "It returns to the start",
    ],
    answer: 1,
    explanation:
      "East three then north one gives a net displacement of three east and one north.",
  },
  27: {
    id: 28,
    visual: "mirror_vertical",
    prompt:
      "Triangle's shaded corner starts top-left, flipped horizontally. Where does it move?",
    options: ["Top-left", "Top-right", "Bottom-left", "Bottom-right"],
    answer: 1,
    explanation: "A horizontal flip moves the top-left shaded corner to the top-right.",
  },
  28: {
    id: 29,
    visual: "rotation_180",
    prompt: "Square mark starts bottom-left and rotates 180°. Where does it go?",
    options: ["Top-left", "Top-right", "Bottom-left", "Bottom-right"],
    answer: 1,
    explanation: "A 180° turn sends the bottom-left mark to the top-right.",
  },
  29: {
    id: 30,
    visual: "path_right_angle",
    prompt: "Path from centre to 3 o'clock then 12 o'clock. What shape?",
    options: ["A right angle", "A straight line", "A circle", "No path"],
    answer: 0,
    explanation:
      "Centre → 3 o'clock → 12 o'clock is east then north, which forms a right angle.",
  },
  30: {
    id: 31,
    prompt: "Sequence: 3, 6, 12, 24, __",
    options: ["30", "36", "42", "48"],
    answer: 3,
    explanation: "Each term doubles: 24 × 2 = 48.",
  },
  31: {
    id: 32,
    prompt: "Sequence: 5, 8, 11, 14, __",
    options: ["15", "16", "17", "18"],
    answer: 2,
    explanation: "Each term adds 3: 14 + 3 = 17.",
  },
  32: {
    id: 33,
    prompt: "Sequence: 2, 5, 10, 17, __",
    options: ["24", "25", "26", "27"],
    answer: 2,
    explanation: "Differences are 3, 5, 7, then 9: 17 + 9 = 26.",
  },
  33: {
    id: 34,
    prompt: "Sequence: 81, 27, 9, 3, __",
    options: ["0", "1", "2", "6"],
    answer: 1,
    explanation: "Each term is divided by 3: 3 ÷ 3 = 1.",
  },
  34: {
    id: 35,
    prompt: "Sequence: 1, 4, 9, 16, __",
    options: ["20", "24", "25", "36"],
    answer: 2,
    explanation:
      "These are the squares 1², 2², 3², 4², so the next is 5² = 25.",
  },
  35: {
    id: 36,
    prompt: "Sequence: 7, 10, 16, 25, __",
    options: ["34", "35", "36", "37"],
    answer: 3,
    explanation:
      "The gaps grow by 3 (+3, +6, +9, +12), so 25 + 12 = 37.",
  },
  36: {
    id: 37,
    prompt: "Sequence: 2, 4, 3, 6, 4, 8, __",
    options: ["5", "7", "9", "10"],
    answer: 0,
    explanation:
      "The pattern adds 2, 3, 4… then subtracts 1, 2, 3…: 8 − 3 = 5.",
  },
  37: {
    id: 38,
    prompt: "Letters: A, C, F, J, __",
    options: ["M", "N", "O", "P"],
    answer: 2,
    explanation:
      "Letter positions increase by 2, 3, 4, 5: J (10) + 5 = O (15).",
  },
  38: {
    id: 39,
    prompt: "Sequence: 100, 90, 72, 48, __",
    options: ["24", "20", "18", "12"],
    answer: 1,
    explanation:
      "The gaps 10, 18, 24 grow by 8, 6, 4; the next gap is 28, so 48 − 28 = 20.",
  },
  39: {
    id: 40,
    prompt: "3 is to 12 as __ is to __ (same relationship)",
    options: ["4 : 12", "5 : 20", "6 : 18", "7 : 21"],
    answer: 1,
    explanation:
      "The relationship multiplies by 4: 3 × 4 = 12, so 5 × 4 = 20.",
  },
  40: {
    id: 41,
    prompt: "Coding: each letter +1. DOG becomes?",
    options: ["EPH", "EOH", "CNG", "FPH"],
    answer: 0,
    explanation: "Adding 1 to each letter of DOG gives EPH.",
  },
  41: {
    id: 42,
    prompt: "Visual: ● ○ __ — complete the alternating tile",
    options: ["● ○ ●", "○ ● ○", "● ● ○", "○ ○ ●"],
    answer: 0,
    explanation: "The tiles alternate, so after ● ○ comes ●.",
  },
  42: {
    id: 43,
    prompt: "Triangle after 90° clockwise turn",
    options: ["▲", "▶", "▼", "◀"],
    answer: 1,
    explanation: "A 90° clockwise turn points the triangle right: ▶.",
  },
  43: {
    id: 44,
    prompt: "Figure and vertical mirror line — left-right mirror",
    options: ["◆ · ○", "○ · ◆", "◆ · ◆", "○ · ○"],
    answer: 1,
    explanation: "A vertical mirror swaps left and right: ◆ · ○ becomes ○ · ◆.",
  },
  44: {
    id: 45,
    prompt: "Figure above water line — correct water reflection",
    options: ["◆ above ○", "○ above ◆", "◆ below ○", "○ below ◆"],
    answer: 2,
    explanation:
      "A water reflection flips top and bottom: ◆ above ○ becomes ◆ below ○.",
  },
  45: {
    id: 46,
    prompt: "Closest meaning of **'measured'** in \"a measured reply\"",
    options: ["Angry", "Careful and controlled", "Very long", "Unrelated"],
    answer: 1,
    explanation:
      "A measured reply is deliberate and restrained, i.e. careful and controlled.",
  },
  46: {
    id: 47,
    prompt: "Opposite of **'scarce'**",
    options: ["Rare", "Limited", "Abundant", "Hidden"],
    answer: 2,
    explanation: "Scarce means in short supply, so its opposite is abundant.",
  },
  47: {
    id: 48,
    prompt: "The plan was clear and **___**.",
    options: ["practical", "fragile", "distant", "silent"],
    answer: 0,
    explanation:
      "A clear plan is described as practical, matching the positive sense of the sentence.",
  },
  48: {
    id: 49,
    prompt: "Closest meaning of **'resilient'**",
    options: ["Able to recover", "Unable to move", "Very expensive", "Easily distracted"],
    answer: 0,
    explanation: "Resilient means able to recover quickly from difficulty.",
  },
  49: {
    id: 50,
    prompt: "Which word is **different**: observe, notice, ignore, watch?",
    options: ["observe", "notice", "ignore", "watch"],
    answer: 2,
    explanation:
      "Observe, notice and watch all mean to pay attention; ignore is the opposite.",
  },
  50: {
    id: 51,
    prompt: "Best synonym for **'brief'**",
    options: ["Short", "Loud", "Late", "Exact"],
    answer: 0,
    explanation: "Brief means short in duration or length.",
  },
  51: {
    id: 52,
    prompt: "A person who can be **trusted** is **___**.",
    options: ["reliable", "random", "rigid", "restless"],
    answer: 0,
    explanation: "A trustworthy person is reliable.",
  },
  52: {
    id: 53,
    prompt: "Opposite of **'expand'**",
    options: ["Stretch", "Contract", "Explain", "Improve"],
    answer: 1,
    explanation: "Expand means to grow larger, so its opposite is contract.",
  },
  53: {
    id: 54,
    prompt: "Which sentence is **clearest**?",
    options: [
      "Because the rain the match stopped.",
      "The route changed because of rain.",
      "Rain route changed because.",
      "Changed route the rain.",
    ],
    answer: 1,
    explanation:
      "Only \u201cThe route changed because of rain.\u201d is a complete, correctly ordered sentence.",
  },
  54: {
    id: 55,
    prompt: "Closest meaning of **'candid'**",
    options: ["Frank", "Careless", "Secretive", "Polished"],
    answer: 0,
    explanation: "Candid means open and honest, i.e. frank.",
  },
  55: {
    id: 56,
    prompt: "A decision made after **thought** is **___**.",
    options: ["deliberate", "accidental", "restless", "instant"],
    answer: 0,
    explanation: "A decision reached after careful thought is deliberate.",
  },
  56: {
    id: 57,
    prompt: "Which word does **not fit**: calm, steady, composed, frantic?",
    options: ["calm", "steady", "composed", "frantic"],
    answer: 3,
    explanation:
      "Calm, steady and composed describe composure; frantic is the opposite.",
  },
  57: {
    id: 58,
    prompt: "The team reached a **___** agreement after discussion.",
    options: ["mutual", "musical", "minor", "remote"],
    answer: 0,
    explanation: "An agreement reached by both sides together is mutual.",
  },
  58: {
    id: 59,
    prompt: "Best meaning of **'adapt'**",
    options: [
      "Adjust to conditions",
      "Repeat exactly",
      "Reject evidence",
      "Move backward",
    ],
    answer: 0,
    explanation: "To adapt is to adjust to new conditions.",
  },
  59: {
    id: 60,
    prompt: "**Book** is to **reading** as **fork** is to…",
    options: ["writing", "eating", "walking", "sleeping"],
    answer: 1,
    explanation:
      "A book is used for reading, so a fork is used for eating.",
  },
  60: {
    id: 61,
    cue: "7 3 9 2 8",
    prompt: "Select the number sequence you heard",
    options: ["7–9–3–2–8", "7–3–9–2–8", "3–7–9–8–2", "7–3–2–9–8"],
    answer: 1,
    explanation: "The sequence heard was 7–3–9–2–8.",
  },
  61: {
    id: 62,
    cue: "alpha bravo delta echo",
    prompt: "Select the word order you heard",
    options: [
      "alpha bravo delta echo",
      "alpha delta bravo echo",
      "bravo alpha delta echo",
      "alpha bravo echo delta",
    ],
    answer: 0,
    explanation: "The words were heard in the order alpha bravo delta echo.",
  },
  62: {
    id: 63,
    cue: "K R M T",
    prompt: "Select the letter order you heard",
    options: ["K R M T", "K M R T", "R K M T", "K R T M"],
    answer: 0,
    explanation: "The letters were heard as K R M T.",
  },
  63: {
    id: 64,
    cue: "north east south west",
    prompt: "Direction heard in the third position",
    options: ["North", "East", "South", "West"],
    answer: 2,
    explanation: "In north–east–south–west, the third direction is south.",
  },
  64: {
    id: 65,
    cue: "apple chair apple river apple",
    prompt: "How many times was 'apple' heard?",
    options: ["2", "3", "4", "5"],
    answer: 1,
    explanation: "'Apple' was heard three times.",
  },
  65: {
    id: 66,
    cue: "odd even even odd even",
    prompt: "Pattern of the spoken parity labels",
    options: [
      "Odd–Even–Even–Odd–Even",
      "Even–Odd–Even–Odd–Even",
      "Odd–Even–Odd–Even–Odd",
      "Even–Even–Odd–Odd–Even",
    ],
    answer: 0,
    explanation: "The labels were heard as Odd–Even–Even–Odd–Even.",
  },
  66: {
    id: 67,
    cue: "underline the square",
    prompt: "Action requested by the instruction",
    options: [
      "Mark the circle",
      "Underline the square",
      "Cross the triangle",
      "Leave blank",
    ],
    answer: 1,
    explanation: "The instruction asked you to underline the square.",
  },
  67: {
    id: 68,
    cue: "red blue; blue red",
    prompt: "Are the two spoken pairs same or different?",
    options: ["Same order", "Different order", "Same words reversed", "One word missing"],
    answer: 2,
    explanation:
      "Both pairs use the same two words, but the order is reversed.",
  },
  68: {
    id: 69,
    cue: "monday wednesday friday tuesday",
    prompt: "Day heard in the fourth position",
    options: ["Monday", "Tuesday", "Wednesday", "Friday"],
    answer: 1,
    explanation:
      "In Monday–Wednesday–Friday–Tuesday, the fourth day is Tuesday.",
  },
  69: {
    id: 70,
    cue: "candle candy candle cannon candle",
    prompt: "Which word was repeated most often?",
    options: ["Candle", "Candy", "Cannon", "Canvas"],
    answer: 0,
    explanation: "'Candle' was repeated most often, three times.",
  },
};

export const csssQuestions: (CsssQuestion | null)[] = Array.from(
  { length: csssTotalQuestions },
  (_, index) => realQuestions[index] ?? null,
);
